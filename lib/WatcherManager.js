/**
 * xiedacon created at 2019-05-27 16:59:55
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const events = require('events');

const Exception = require('./Exception');

const {
  Xid,
  EventType,
  EventState,
  ConnectionEvent,
  WatcherType,
} = require('./constants');
const jute = require('./jute');
const utils = require('./utils');

module.exports = class WatcherManager extends events.EventEmitter {
  /**
   *
   * @param {import('./client')} client
   */
  constructor(client) {
    super();

    this.client = client;
    /** @type {{ [key: string]: events.EventEmitter }} */
    this.dataWatchers = {};
    /** @type {{ [key: string]: events.EventEmitter }} */
    this.childWatchers = {};
    /** @type {{ [key: string]: events.EventEmitter }} */
    this.existWatchers = {};
  }

  ready() {
    this.packetManager = this.client.packetManager;
    this.connectionManager = this.client.connectionManager;

    this.client.connectionManager.on(ConnectionEvent.connect, () => {
      const packet = this.packetManager.setWatches;
      packet.request.header.xid = Xid.setWatches;
      packet.request.payload.setValue({
        relativeZxid: this.connectionManager.zxid,
        dataWatches: this.getDataWatcherPaths(),
        existWatches: this.getExistWatcherPaths(),
        childWatches: this.getChildWatcherPaths(),
      });
      packet.request.setChrootPath(this.connectionManager.chrootPath);

      // Send inner-request without queue
      this.connectionManager.socket.write(packet.request.toBuffer());

      this.packetManager.recyclePacket(packet);
    });
  }

  /**
   *
   * @param {{ [key: string]: events.EventEmitter }} watchers
   * @param {string} path
   * @param {(event: { type: number, state: number, path: string }) => any} watcher
   */
  registerWatcher(watchers, path, watcher) {
    if (typeof watcher !== 'function') throw new Error('watcher must be a valid function.');
    path = utils.normalizePath(path);

    let watcherExists = false;
    watchers[path] = watchers[path] || new events.EventEmitter();
    watcherExists = watchers[path].listeners('notification').some(l => {
      // This is rather hacky since node.js wraps the listeners using an
      // internal function.
      // @ts-ignore
      return l === watcher || l.listener === watcher;
    });

    if (!watcherExists) {
      watchers[path].once('notification', watcher);
    }
  }

  /**
   *
   * @param {string} path
   * @param {(event: { type: number, state: number, path: string }) => any} watcher
   */
  registerDataWatcher(path, watcher) {
    this.registerWatcher(this.dataWatchers, path, watcher);
  }

  /**
   *
   * @param {string} path
   * @param {(event: { type: number, state: number, path: string }) => any} watcher
   */
  registerChildWatcher(path, watcher) {
    this.registerWatcher(this.childWatchers, path, watcher);
  }

  /**
   *
   * @param {string} path
   * @param {(event: { type: number, state: number, path: string }) => any} watcher
   */
  registerExistWatcher(path, watcher) {
    this.registerWatcher(this.existWatchers, path, watcher);
  }

  /**
   *
   * @param {{ [key: string]: events.EventEmitter }} watchers
   */
  getWatcherPaths(watchers) {
    const result = [];

    for (const path of Object.keys(watchers)) {
      if (watchers[path].listeners('notification').length > 0) {
        result.push(path);
      }
    }

    return result;
  }

  getDataWatcherPaths() {
    return this.getWatcherPaths(this.dataWatchers);
  }

  getChildWatcherPaths() {
    return this.getWatcherPaths(this.childWatchers);
  }

  getExistWatcherPaths() {
    return this.getWatcherPaths(this.existWatchers);
  }

  /**
   *
   * @param {string} eventType
   * @param {Jute.proto.WatcherEvent} watcherEvent
   */
  emit(eventType, watcherEvent) {
    const emitters = [];
    const event = watcherEvent.valueOf();

    switch (event.type) {
      case EventType.None:
        // eslint-disable-next-line no-case-declarations
        const watcherList = [ this.dataWatchers, this.childWatchers, this.existWatchers ];

        for (const watchers of watcherList) {
          for (const path of Object.keys(watchers)) {
            if (watchers[path]) {
              emitters.push(watchers[path]);
            }
          }
        }
        break;
      case EventType.NodeDataChanged:
      case EventType.NodeCreated:
        if (this.dataWatchers[event.path]) {
          emitters.push(this.dataWatchers[event.path]);
          delete this.dataWatchers[event.path];
        }

        if (this.existWatchers[event.path]) {
          emitters.push(this.existWatchers[event.path]);
          delete this.existWatchers[event.path];
        }
        break;
      case EventType.NodeChildrenChanged:
        if (this.childWatchers[event.path]) {
          emitters.push(this.childWatchers[event.path]);
          delete this.childWatchers[event.path];
        }
        break;
      case EventType.NodeDeleted:
        if (this.dataWatchers[event.path]) {
          emitters.push(this.dataWatchers[event.path]);
          delete this.dataWatchers[event.path];
        }
        if (this.childWatchers[event.path]) {
          emitters.push(this.childWatchers[event.path]);
          delete this.childWatchers[event.path];
        }
        break;
      default:
        throw new Exception.Normal('Unknown event type: ' + event.type);
    }

    process.nextTick(() => {
      for (const emitter of emitters) {
        emitter.emit('notification', event);
      }
    });

    return true;
  }

  close() {
    // Emit close event for all watches
    this.emit('', new jute.proto.WatcherEvent({
      state: EventState.Closed,
      type: EventType.None,
    }));
  }

  clear() {
    const watcherList = [ this.dataWatchers, this.childWatchers, this.existWatchers ];

    for (const watchers of watcherList) {
      for (const path of Object.keys(watchers)) {
        if (watchers[path]) {
          watchers[path].removeAllListeners();
        }
      }
    }

    this.removeAllListeners();
    this.dataWatchers = {};
    this.childWatchers = {};
    this.existWatchers = {};
  }

  /**
   *
   * @param {string} path
   * @param {number} type
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher
   */
  removeWatches(path, type, watcher) {
    switch (type) {
      case WatcherType.Children:
        if (this.childWatchers[path]) {
          watcher
            ? this.childWatchers[path].removeListener('notification', watcher)
            : this.childWatchers[path].removeAllListeners();

          delete this.childWatchers[path];
        }
        break;
      case WatcherType.Data:
        if (this.dataWatchers[path]) {
          watcher
            ? this.dataWatchers[path].removeListener('notification', watcher)
            : this.dataWatchers[path].removeAllListeners();

          delete this.dataWatchers[path];
        }
        if (this.existWatchers[path]) {
          watcher
            ? this.existWatchers[path].removeListener('notification', watcher)
            : this.existWatchers[path].removeAllListeners();

          delete this.existWatchers[path];
        }
        break;
      case WatcherType.Any:
        if (this.childWatchers[path]) {
          watcher
            ? this.childWatchers[path].removeListener('notification', watcher)
            : this.childWatchers[path].removeAllListeners();

          delete this.childWatchers[path];
        }
        if (this.dataWatchers[path]) {
          watcher
            ? this.dataWatchers[path].removeListener('notification', watcher)
            : this.dataWatchers[path].removeAllListeners();

          delete this.dataWatchers[path];
        }
        if (this.existWatchers[path]) {
          watcher
            ? this.existWatchers[path].removeListener('notification', watcher)
            : this.existWatchers[path].removeAllListeners();

          delete this.existWatchers[path];
        }
        break;
      default:
        throw new Exception.Normal('Unknown watcher type: ' + type);
    }
  }

};
