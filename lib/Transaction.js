/**
 * xiedacon created at 2019-05-27 16:58:55
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const {
  CreateMode,
  Ids,
  OpCode,
  ExceptionCode,
} = require('./constants');
const jute = require('./jute');
const utils = require('./utils');

const Exception = require('./Exception');

class Transaction {
  /**
   * Transaction provides a builder interface that helps building an atomic set
   * of operations.
   *
   * @param {import('./client')} client an instance of node-zookeeper-client.
   */
  constructor(client) {
    this.showFriendlyErrorStack = client.options.showFriendlyErrorStack;
    this.packetManager = client.packetManager;
    this.connectionManager = client.connectionManager;

    this.packet = client.packetManager.multi;
  }

  /**
   * Add a create operation with given path, data, acls and mode.
   *
   * @param {string} path The znode path.
   * @param {string|Buffer=} [data] The data buffer.
   * @param {Array<Jute.data.ACL>=} acl An array of ACL object.
   * @param {number=} flags The creation mode.
   */
  create(path, data, acl = Ids.OPEN_ACL_UNSAFE, flags = CreateMode.PERSISTENT) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;

    this.packet.request.push(new jute.proto.CreateRequest({
      path,
      acl,
      flags,
      data,
    }));
    this.packet.response.push(new jute.proto.CreateResponse());

    return this;
  }

  /**
   * Add a check (existence) operation with given path and optional version.
   *
   * @param {string} path The znode path.
   * @param {number=} version The version of the znode.
   */
  check(path, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    this.packet.request.push(new jute.proto.CheckVersionRequest({
      path,
      version,
    }));
    this.packet.response.push(null);

    return this;
  }

  /**
   * Add a set-data operation with the given path, data and optional version.
   *
   * @param {string} path The znode path.
   * @param {string|Buffer=} data The data buffer.
   * @param {number=} version The version of the znode.
   */
  setData(path, data, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    data = data ? Buffer.isBuffer(data) ? data : Buffer.from(data) : undefined;

    this.packet.request.push(new jute.proto.SetDataRequest({
      path,
      data,
      version,
    }));
    this.packet.response.push(new jute.proto.SetDataResponse());

    return this;
  }

  /**
   * Add a delete operation with the given path and optional version.
   *
   * @param {string} path The znode path.
   * @param {number=} version The version of the znode.
   */
  remove(path, version = -1) {
    if (typeof path !== 'string') throw new Error('path must be a string');
    path = utils.normalizePath(path);

    this.packet.request.push(new jute.proto.DeleteRequest({
      path,
      version,
    }));
    this.packet.response.push(null);

    return this;
  }

  /**
   * Execute the transaction atomically.
   */
  async commit() {
    if (this.packet.request.payload.length > 0) await this.connectionManager.send(this.packet);

    const result = [];
    for (const { header, payload } of this.packet.response) {
      if (header.type === OpCode.error && header.err !== ExceptionCode.OK) throw new Exception.Protocol(header.err);

      result.push({
        header: header.valueOf(),
        payload: payload && payload.valueOf(),
      });
    }

    this.packetManager.recyclePacket(this.packet);
    this.packet = null;

    return result;
  }

}

module.exports = Transaction;
