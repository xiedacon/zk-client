/**
 * xiedacon created at 2019-05-27 16:55:52
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const _ = require('lodash');
const net = require('net');
const events = require('events');
const path = require('path');

const {
  Xid,
  OpCode,
  ExceptionCode,
  ConnectionEvent,
} = require('./constants');
const jute = require('./jute');
const utils = require('./utils');
const Packet = require('./Packet');
const Exception = require('./Exception');

/**
 * This class parse the connection string to build the ensemble server
 * list and chrootPath.
 */
module.exports = class ConnectionManager extends events.EventEmitter {
  /**
   *
   * Parse the connect string and random the servers of the ensemble.
   *
   * @param {import('./client')} client ZooKeeper server ensemble string.
   */
  constructor(client) {
    super();

    const { chrootPath, servers } = utils.parseConnectionString(client.connectionString);
    if (servers.length === 0) throw new Exception.Normal('connectionString must contain at least one server.');

    this.client = client;

    this.chrootPath = chrootPath;
    /** @type {{ host: string, port: number }} */
    this.server = null;
    this.socket = null;
    /** @type {Array<{ host: string, port: number }>} */
    this.servers = servers;
    /** @type {Array<{ host: string, port: number }>} */
    this.availableServers = [];

    const options = client.options;
    this.sessionId = Buffer.alloc(8);
    if (Buffer.isBuffer(options.sessionId)) options.sessionId.copy(this.sessionId);
    this.sessionPassword = Buffer.alloc(16);
    if (Buffer.isBuffer(options.sessionPassword)) options.sessionPassword.copy(this.sessionPassword);
    /** @type {number} */
    this.sessionTimeout = options.sessionTimeout;
    this.connectTimeout = options.connectTimeout;
    this.reconnectInterval = options.reconnectInterval;
    this.retries = options.retries - 1;
    this.retryInterval = options.retryInterval;
    this.connectTimeoutHandler = null;

    this.showFriendlyErrorStack = options.showFriendlyErrorStack;

    this.xid = 0;
    // Last seen zxid.
    this.zxid = Buffer.alloc(8);

    this.pendingBuffer = null;
    /** @type {Array<import('./Packet')<import('./Request'), import('./Response')>>} */
    this.packetQueue = [];
    /** @type {Array<import('./Packet')<import('./Request'), import('./Response')>>} */
    this.pendingQueue = [];

    this.state = null;
    this.preState = null;
  }

  async ready() {
    this.logger = this.client.logger;
    this.packetManager = this.client.packetManager;
    this.watcherManager = this.client.watcherManager;

    this.on(ConnectionEvent.serverAvailable, server => this.availableServers.push(server));
    this.on(ConnectionEvent.serverUnavailable, server => { this.availableServers = _.dropWhile(this.availableServers, server); });

    try {
      await this.getAvailableServer();
    } catch (err) {
      this.logger.error(utils.formatError(err));
    }
  }

  async testServer(server) {
    await new Promise((resolve, reject) => {
      const socket = net.connect(server);
      const timeout = setTimeout(() => {
        socket.destroy();
        socket.removeAllListeners();

        reject(new Exception.Normal(`Socket connect timeout: ${this.connectTimeout} ms, server: ${JSON.stringify(server)}`));
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
        socket.removeAllListeners();
        clearTimeout(timeout);

        resolve();
      });
      socket.on('error', utils.noop);
    });
  }

  async getAvailableServer() {
    if (this.availableServers.length > 0) return _.sample(this.availableServers);

    await Promise.all(this.servers.map(server =>
      this.testServer(server)
        .then(
          () => this.emit(ConnectionEvent.serverAvailable, server),
          err => this.logger.error(utils.formatError(err))
        )
    ));

    if (this.availableServers.length > 0) return _.sample(this.availableServers);

    throw new Exception.Normal('No available server');
  }

  setState(state, ...args) {
    if (this.state !== state) {
      this.state = state;
      this.emit(state, ...args);
    }
  }

  async connect() {
    if (this.socket) throw new Exception.Normal('Socket already connected');

    this.preState !== null
      ? this.setState(ConnectionEvent.reconnecting)
      : this.setState(ConnectionEvent.connecting);

    try {
      this.server = await this.getAvailableServer();
      this.bindSocket(net.connect(this.server));
    } catch (err) {
      this.logger.error(`Some error happened, it will try reconnect after ${this.reconnectInterval}ms, error: ${utils.formatError(err)}`);
      this.emit(ConnectionEvent.error, err);

      this.zxid.fill(0);
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  /**
   *
   * @param {net.Socket} socket
   */
  bindSocket(socket) {
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
    clearTimeout(this.connectTimeoutHandler);

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

  /**
   *
   * @param {Buffer} buffer
   */
  getDataBuffer(buffer) {
    if (this.pendingBuffer) {
      buffer = Buffer.concat([ this.pendingBuffer, buffer ]);
    }

    // We need at least 4 bytes
    if (buffer.length < 4) {
      this.pendingBuffer = buffer;
      buffer = null;
    }

    let offset = 0;
    const size = buffer.readInt32BE(offset);
    offset += 4;

    if (buffer.length < size + offset) {
      // More data are coming.
      this.pendingBuffer = buffer;
      buffer = null;
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

  /**
   *
   * @param {Buffer} buffer
   */
  onSocketData(buffer) {
    buffer = this.getDataBuffer(buffer);
    if (!buffer) return;

    if (this.state === ConnectionEvent.connecting || this.state === ConnectionEvent.reconnecting) {

      // Handle connect response.
      const packet = this.packetManager.connect;
      packet.response.payload.deserialize(buffer);
      const responseData = packet.response.payload.valueOf();

      if (responseData.timeOut <= 0) {
        this.sessionId.fill(0);
        this.logger.info('Session timeout, it will reconnect');
      } else {
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
      offset += responseHeader.deserialize(buffer, offset);
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

          event.deserialize(buffer, offset);
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
          let error = null;

          if (requestHeaderData.xid !== responseHeaderData.xid) {
            this.socket.destroy(new Exception.Unknow(`Xid out of order. Got xid: ${responseHeader.xid} with error code: ${responseHeader.err}, expected xid: ${pendingPacket.request.header.xid}.`));
            return;
          }

          if (responseHeaderData.zxid) {
            this.zxid = responseHeaderData.zxid;
          }

          if (responseHeaderData.err === 0) {
            pendingPacket.response.fromBuffer(buffer);
          } else {
            pendingPacket.response.header = responseHeader;
            error = new Exception.Protocol(responseHeaderData.err);
          }

          process.nextTick(() => pendingPacket.callback(error, pendingPacket));
      }
    }
  }

  onSocketDrain() {
    if (this.state !== ConnectionEvent.connect && this.state !== ConnectionEvent.closing) return;

    let packet;
    while ((packet = this.packetQueue.shift())) {
      packet.request.header.xid = this.xid++;

      if (!this.socket.write(packet.request.toBuffer())) break;
      this.pendingQueue.push(packet);

      if (packet.request.header.type === OpCode.closeSession) {
        this.setState(ConnectionEvent.disconnect);
        this.setState(ConnectionEvent.closed);
        break;
      }
    }
  }

  onSocketClose() {
    clearTimeout(this.connectTimeoutHandler);

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

      this.connect();
    }
  }

  onSocketError(error) {
    clearTimeout(this.connectTimeoutHandler);

    if (error instanceof Exception && error.name === 'ProtocolError') {
      // Exit client while ProtocolError, eg: AUTH_FAILED
      this.setState(ConnectionEvent.error, error);
      this.logger.error(`Client exited because of error: ${utils.formatError(error)}`);
    } else {
      this.logger.error(`Some error happend, it will reconnect, error: ${utils.formatError(error)}`);
      this.emit(ConnectionEvent.error, error);
    }

    this.emit(ConnectionEvent.serverUnavailable, this.server);
  }

  async close() {
    if (this.state === ConnectionEvent.closing || (this.state === ConnectionEvent.reconnecting && this.preState === ConnectionEvent.closing)) {
      // do nothing
    } else if (!this.socketClosable) {
      const packet = this.packetManager.closeSession;
      const p = this.send(packet);

      this.setState(ConnectionEvent.closing);

      await p;
    } else if (this.socket) {
      this.socket.destroy();
    } else {
      // do nothing
    }
  }

  clear() {
    this.availableServers = [];
    this.sessionId.fill(0);
    this.sessionPassword.fill(0);
    this.connectTimeoutHandler = null;
    this.xid = 0;
    this.zxid = Buffer.alloc(8);

    this.socket && this.socket.removeAllListeners();
    this.socket = null;
    this.pendingBuffer = null;
    this.pendingQueue = [];
    this.packetQueue = [];
    this.preState = null;
  }

  /**
   * @template {import('./Packet')<import('./Request'), import('./Response')>} Packet
   *
   * @param {Packet} packet
   * @param {number} retries
   */
  async send(packet, retries = this.retries) {
    if (!(packet instanceof Packet)) throw new Exception.Normal('request must be a valid instance of Request.');
    if (!this.writable) {
      throw new Exception.Normal('connection not writable');
    }

    if (this.chrootPath && packet.request.payload) {
      packet.request.payload.setChrootPath(this.chrootPath);
    }

    if (this.chrootPath && packet.response.payload) {
      packet.response.payload.setChrootPath(this.chrootPath);
    }

    if (this.showFriendlyErrorStack) Error.captureStackTrace(packet, ConnectionManager.prototype.send);

    const p = new Promise((resolve, reject) => {
      packet.callback = (err, packet) => {
        if (err) {
          packet.stack && utils.optimizeErrorStack(err, packet.stack, path.resolve(__dirname, '..'));
          // @ts-ignore
          err.data = packet;
        }

        err
          ? retries--
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

  _send(packet) {
    this.packetQueue.push(packet);
    if (this.socket) this.socket.emit('drain');
  }

  setPingTimeout(timeout) {
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

};
