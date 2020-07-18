/**
 * xiedacon created at 2019-05-27 16:55:52
 *
 * Copyright (c) 2019 xiedacon, all rights reserved.
 */

import * as _ from 'lodash';
import * as net from 'net';
import * as events from 'events';
import * as path from 'path';

import {
  Xid,
  OpCode,
  ExceptionCode,
  ConnectionEvent,
} from './constants';
import jute from './jute';
import * as utils from './utils';
import Packet from './Packet';
import Exception from './Exception';

import Client, { Logger } from './Client';
import Request from './Request';
import Response from './Response';
import PacketManager from './PacketManager';
import WatcherManager from './WatcherManager';

/**
 * This class parse the connection string to build the ensemble server
 * list and chrootPath.
 */
export default class ConnectionManager extends events.EventEmitter {
  public xid = 0;
  public zxid = Buffer.alloc(8);
  public sessionId = Buffer.alloc(8);
  public sessionPassword = Buffer.alloc(16);
  public sessionTimeout = 30000;
  public socket: net.Socket | null;
  public chrootPath: string;

  private client: Client;

  private server: { host: string; port: number } | null;
  private servers: Array<{ host: string; port: number }>;
  private availableServers: Array<{ host: string; port: number }>;

  private connectTimeout: number;
  private reconnectInterval: number;
  private closeTimeout: number;
  private retries: number;
  private retryInterval: number;
  private showFriendlyErrorStack: boolean;

  private connectTimeoutHandler: NodeJS.Timeout | null;

  private pendingBuffer: Buffer | null;
  private packetQueue: Array<Packet<Request<any>, Response<any>>>;
  private pendingQueue: Array<Packet<Request<any>, Response<any>>>;

  private state: string | null;
  private preState: string | null;

  private logger: Logger;
  private packetManager: PacketManager;
  private watcherManager: WatcherManager;

  /**
   *
   * Parse the connect string and random the servers of the ensemble.
   *
   * @param client ZooKeeper server ensemble string.
   */
  constructor(client: Client) {
    super();

    const { chrootPath, servers } = utils.parseConnectionString(client.connectionString);
    if (servers.length === 0) throw new Exception.Params('connectionString must contain at least one server.');

    this.client = client;

    this.chrootPath = chrootPath;
    this.server = null;
    this.socket = null;
    this.servers = servers;
    this.availableServers = [];

    const options = client.options;
    this.connectTimeout = options.connectTimeout;
    this.reconnectInterval = options.reconnectInterval;
    this.closeTimeout = options.closeTimeout;
    this.retries = options.retries - 1;
    this.retryInterval = options.retryInterval;
    this.showFriendlyErrorStack = options.showFriendlyErrorStack;

    // Last seen zxid.
    this.sessionId = Buffer.alloc(8);
    this.sessionPassword = Buffer.alloc(16);
    this.sessionTimeout = 30000;
    this.connectTimeoutHandler = null;

    this.pendingBuffer = null;
    this.packetQueue = [];
    this.pendingQueue = [];

    this.state = null;
    this.preState = null;
  }

  async ready() {
    this.logger = this.client.logger;
    this.packetManager = this.client.packetManager;
    this.watcherManager = this.client.watcherManager;

    this.setState(ConnectionEvent.connecting);

    try {
      await this.getAvailableServer();
    } catch (err) {
      // do nothing
    }
  }

  async testServer(server: { host: string; port: number }) {
    await new Promise((resolve, reject) => {
      const socket = net.connect(server);
      const timeout = setTimeout(() => {
        socket.destroy();

        reject(new Exception.Network(`Socket connect timeout: ${this.connectTimeout} ms`));
      }, this.connectTimeout);

      socket.on('connect', () => {
        const packet = this.packetManager.connect;
        packet.request.payload.setValue({
          protocolVersion: 0,
          lastZxidSeen: this.zxid,
          timeOut: this.sessionTimeout,
          sessionId: Buffer.alloc(8),
          passwd: Buffer.alloc(16),
        });

        socket.write(packet.request.toBuffer());
        this.packetManager.recyclePacket(packet);
      });

      socket.on('data', () => {
        socket.destroy();
        clearTimeout(timeout);

        resolve();
      });

      socket.on('error', err => {
        clearTimeout(timeout);

        reject(err);
      });

      socket.on('close', () => socket.removeAllListeners());
    });
  }

  async getAvailableServer() {
    if (this.availableServers.length === 0) {
      await new Promise(async resolve => {
        const results = new Array(this.servers.length).fill('fulfilled');

        await Promise.all(this.servers.map((server, i) =>
          this.testServer(server)
            .then(
              () => {
                this.availableServers.push(server);
                resolve();
              },
              err => {
                this.logger.warn(`Failed to test server: ${JSON.stringify(server)}, error: ${utils.formatError(err)}`);
                results[i] = 'rejected';
              }
            )
        ));

        if (results.indexOf('fulfilled') < 0) resolve();
      });
    }

    const server = _.sample(this.availableServers);
    if (!server) throw new Exception.Network(`No available server, servers: ${JSON.stringify(this.servers)}`);

    return server;
  }

  setState(state: string, ...args: Array<any>) {
    if (this.state !== state) {
      this.state = state;
      this.emit(state, ...args);
    }
  }

  async connect() {
    if (this.socket) throw new Exception.State('Socket already connected');
    if (this.state !== ConnectionEvent.connecting && this.state !== ConnectionEvent.reconnecting) {
      throw new Exception.State('connectionManager.connect() must be called after connectionManager.ready()');
    }

    try {
      this.bindSocket(net.connect(this.server = await this.getAvailableServer()));
    } catch (err) {
      this.logger.error(`Some error happened on connect, it will try reconnect after ${this.reconnectInterval}ms, error: ${utils.formatError(err)}`);
      this.emit(ConnectionEvent.error, err);

      this.zxid.fill(0);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  bindSocket(socket: net.Socket) {
    this.socket = socket;
    this.connectTimeoutHandler = setTimeout(() => {
      this.logger.warn(`Socket connect timeout: ${this.connectTimeout} ms, server: ${JSON.stringify(this.server)}`);
      socket.destroy();
    }, this.connectTimeout);

    // Disable the Nagle algorithm.
    socket.setNoDelay();

    socket.on('connect', this.onSocketConnect.bind(this));
    socket.on('data', this.onSocketData.bind(this));
    socket.on('drain', this.onSocketDrain.bind(this));
    socket.on('close', this.onSocketClose.bind(this));
    socket.on('error', this.onSocketError.bind(this));
  }

  onSocketConnect() {
    if (!this.socket) return;
    if (this.connectTimeoutHandler) clearTimeout(this.connectTimeoutHandler);

    const packet = this.packetManager.connect;
    packet.request.payload.setValue({
      protocolVersion: 0,
      lastZxidSeen: this.zxid,
      timeOut: this.sessionTimeout,
      sessionId: this.sessionId,
      passwd: this.sessionPassword,
    });

    this.socket.write(packet.request.toBuffer());
  }

  getDataBuffer(buffer: Buffer) {
    if (this.pendingBuffer) {
      buffer = Buffer.concat([ this.pendingBuffer, buffer ]);
    }

    // We need at least 4 bytes
    if (buffer.length < 4) {
      this.pendingBuffer = buffer;
      return null;
    }

    let offset = 0;
    const size = buffer.readInt32BE(offset);
    offset += 4;

    if (buffer.length < size + offset) {
      // More data are coming.
      this.pendingBuffer = buffer;
      return null;
    } else if (buffer.length === size + offset) {
      this.pendingBuffer = null;
      buffer = buffer.slice(offset, size + offset);
    } else {
      // We have extra bytes, splice them out as pending buffer.
      this.pendingBuffer = buffer.slice(size + offset);
      buffer = buffer.slice(offset, size + offset);

      // We have more data to process, need to recursively process it.
      process.nextTick(this.onSocketData.bind(this, Buffer.alloc(0)));
    }

    return buffer;
  }

  onSocketData(buffer: Buffer) {
    if (!this.socket) return;

    const dataBuffer = this.getDataBuffer(buffer);
    if (!dataBuffer) return;

    if (this.state === ConnectionEvent.connecting || this.state === ConnectionEvent.reconnecting) {

      // Handle connect response.
      const packet = this.packetManager.connect;
      packet.response.payload.deserialize(dataBuffer);
      const responseHeader = packet.response.header.valueOf();
      const responseData = packet.response.payload.valueOf();

      if (responseData.timeOut <= 0) {
        this.sessionId.fill(0);
        this.logger.info('Session timeout, it will reconnect');
      } else {
        this.xid = responseHeader.xid;
        this.pendingQueue = [];
        this.sessionId = responseData.sessionId;
        this.sessionPassword = responseData.passwd;

        this.sessionTimeout = responseData.timeOut;

        this.setState(ConnectionEvent.connect);
        if (this.preState !== null) {
          this.setState(this.preState);

          this.preState = null;
        }

        this.setPingTimeout(this.sessionTimeout / 3);

        // Check if we have anything to send out just in case.
        this.socket.emit('drain');
      }
    } else {
      // Handle  all other repsonses.
      let offset = 0;

      const responseHeader = new jute.proto.ReplyHeader();
      offset += responseHeader.deserialize(dataBuffer, offset);
      const responseHeaderData = responseHeader.valueOf();

      switch (responseHeaderData.xid) {
        case Xid.ping:
        case Xid.setWatches:
          break;
        case Xid.authentication:
          if (responseHeaderData.err === ExceptionCode.AUTH_FAILED) {
            this.socket.destroy(new Exception.Protocol(responseHeaderData.err));
          }
          break;
        case Xid.notification:
          // eslint-disable-next-line no-case-declarations
          const event = this.packetManager.notification.response.payload;
          if (this.chrootPath) event.setChrootPath(this.chrootPath);

          event.deserialize(dataBuffer, offset);
          this.watcherManager.emit('', event);
          break;
        default:
          // eslint-disable-next-line no-case-declarations
          const pendingPacket = this.pendingQueue.shift();

          if (!pendingPacket) {
            this.socket.destroy(new Exception.Unknow('Nothing in pending queue but got data from server.'));
            return;
          }

          // eslint-disable-next-line no-case-declarations
          const requestHeader = pendingPacket.request.header;
          // eslint-disable-next-line no-case-declarations
          const requestHeaderData = requestHeader.valueOf();
          // eslint-disable-next-line no-case-declarations
          let error = null as Error | null;

          if (requestHeaderData.xid !== responseHeaderData.xid) {
            this.socket.destroy(new Exception.Unknow(`Xid out of order. Got xid: ${responseHeader.xid} with error code: ${responseHeader.err}, expected xid: ${pendingPacket.request.header.xid}.`));
            return;
          }

          if (responseHeaderData.zxid && responseHeaderData.err !== ExceptionCode.UNIMPLEMENTED) {
            this.zxid = responseHeaderData.zxid;
          }

          if (responseHeaderData.err === ExceptionCode.OK) {
            pendingPacket.response.fromBuffer(dataBuffer);
          } else {
            pendingPacket.response.header = responseHeader;
            error = new Exception.Protocol(responseHeaderData.err);
          }

          process.nextTick(() => pendingPacket.callback && pendingPacket.callback(error));
      }
    }
  }

  onSocketDrain() {
    if (!this.socket) return;
    if (this.state !== ConnectionEvent.connect && this.state !== ConnectionEvent.closing) return;

    let packet: Packet<Request<any>, Response<any>> | undefined;
    while ((packet = this.packetQueue.shift())) {
      packet.request.header.xid = this.xid++;

      if (!this.socket.write(packet.request.toBuffer())) break;
      this.pendingQueue.push(packet);

      if (packet.request.header.type === OpCode.closeSession) {
        break;
      }
    }
  }

  onSocketClose() {
    if (this.connectTimeoutHandler) clearTimeout(this.connectTimeoutHandler);

    this.packetQueue = this.pendingQueue.concat(this.packetQueue);
    this.socket && this.socket.removeAllListeners();
    this.socket = null;

    if (this.socketClosable) {
      if (this.state !== ConnectionEvent.closed) {
        this.setState(ConnectionEvent.disconnect);
        this.setState(ConnectionEvent.closed);
      }
    } else {
      this.preState = this.preState || (this.state === ConnectionEvent.connecting ? null : this.state);
      this.setState(ConnectionEvent.disconnect);
      this.setState(ConnectionEvent.reconnecting);
      this.connect();
    }
  }

  onSocketError(error: Error) {
    if (this.connectTimeoutHandler) clearTimeout(this.connectTimeoutHandler);

    if (error instanceof Exception && error.name === 'ProtocolError') {
      // Exit client while ProtocolError, eg: AUTH_FAILED
      this.logger.error(`Client exited because of error: ${utils.formatError(error)}`);
      this.setState(ConnectionEvent.error, error);
    } else {
      this.logger.error(`Some error happened on socket, it will reconnect, error: ${utils.formatError(error)}`);
      this.emit(ConnectionEvent.error, error);
    }

    if (this.server) this.availableServers = _.dropWhile(this.availableServers, this.server);
  }

  async close() {
    if (this.state === ConnectionEvent.closing || (this.state === ConnectionEvent.reconnecting && this.preState === ConnectionEvent.closing)) {
      await new Promise(async resolve => this.on(ConnectionEvent.closed, resolve));
    } else if (!this.socketClosable) {
      await new Promise(async resolve => {
        const timeout = setTimeout(() => {
          this.logger.warn(`Socket close timeout: ${this.closeTimeout} ms, server: ${JSON.stringify(this.server)}`);

          resolve();
        }, this.closeTimeout);

        const packet = this.packetManager.closeSession;
        const p = this.send(packet);

        this.setState(ConnectionEvent.closing);

        await p;

        clearTimeout(timeout);

        resolve();
      });

      if (this.state !== ConnectionEvent.closed) {
        this.setState(ConnectionEvent.disconnect);
        this.setState(ConnectionEvent.closed);
      }
    } else {
      if (this.state !== ConnectionEvent.closed) this.setState(ConnectionEvent.closed);
    }

    if (this.socket && !this.socket.destroyed) this.socket.destroy();
  }

  clear() {
    this.availableServers = [];
    this.sessionId.fill(0);
    this.sessionPassword.fill(0);
    this.connectTimeoutHandler = null;
    this.xid = 0;
    this.zxid = Buffer.alloc(8);

    this.removeAllListeners();
    this.socket && this.socket.removeAllListeners();
    this.socket = null;
    this.pendingBuffer = null;

    for (const packet of this.pendingQueue.concat(this.packetQueue)) {
      if (packet.callback) packet.callback(new Exception.State('Client already closed'));
    }

    this.pendingQueue = [];
    this.packetQueue = [];
    this.preState = null;
  }

  async send<T1 extends Jute.basic.RequestRecord, T2 extends Jute.basic.ResponseRecord>(packet: Packet<Request<T1>, Response<T2>>, retries = this.retries) {
    if (!(packet instanceof Packet)) throw new Exception.Params('request must be a valid instance of Request.');
    if (!this.writable) {
      throw new Exception.State('Connection not writable');
    }

    if (this.chrootPath) {
      packet.request.setChrootPath(this.chrootPath);
      packet.response.setChrootPath(this.chrootPath);
    }

    if (this.showFriendlyErrorStack) Error.captureStackTrace(packet, ConnectionManager.prototype.send);

    const p = new Promise<Packet<Request<T1>, Response<T2>>>((resolve, reject) => {
      packet.callback = err => {
        if (err) {
          packet.stack && utils.optimizeErrorStack(err, packet.stack, path.resolve(__dirname, '..'));
          err.data = packet;
        }

        err
          ? this.writable && retries--
            ? this.retryInterval
              ? setTimeout(() => this._send(packet), this.retryInterval)
              : this._send(packet)
            : reject(err)
          : resolve(packet);
      };
    });

    process.nextTick(() => this._send(packet));

    return p;
  }

  _send(packet: Packet<Request<any>, Response<any>>) {
    this.packetQueue.push(packet);
    if (this.socket) this.socket.emit('drain');
  }

  setPingTimeout(timeout: number) {
    if (!this.socket) return;
    this.socket.setTimeout(
      timeout,
      () => {
        if (this.socket && this.state === ConnectionEvent.connect) {
          const pingRequest = this.packetManager.ping;
          pingRequest.request.header.xid = Xid.ping;

          this.socket.write(pingRequest.request.toBuffer());

          // Re-register the timeout handler since it only fired once.
          this.setPingTimeout(timeout);
        }
      }
    );
  }

  get writable() {
    switch (this.state) {
      case ConnectionEvent.connecting:
      case ConnectionEvent.connect:
      case ConnectionEvent.disconnect:
        return true;
      case ConnectionEvent.reconnecting:
        this.state = this.preState;
        // eslint-disable-next-line no-case-declarations
        const res = this.writable;
        this.state = ConnectionEvent.reconnecting;

        return res;
      case ConnectionEvent.closing:
      case ConnectionEvent.closed:
      case ConnectionEvent.error:
      default:
        return false;
    }
  }

  get socketClosable() {
    switch (this.state) {
      case ConnectionEvent.connecting:
      case ConnectionEvent.connect:
      case ConnectionEvent.disconnect:
      case ConnectionEvent.closing:
      case ConnectionEvent.reconnecting:
        return false;
      case ConnectionEvent.closed:
      case ConnectionEvent.error:
      default:
        return true;
    }
  }

}
