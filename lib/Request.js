/**
 * xiedacon created at 2019-05-28 16:21:24
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const jute = require('./jute');

/**
 * This class represent the request the client sends over the wire to ZooKeeper
 * server.
 *
 * @template {Jute.basic.RequestRecord} Payload
 */
module.exports = class Request {
  /**
   * @param {number} opCode The request opCode.
   * @param {Payload=} payload The request payload record.
   */
  constructor(opCode, payload) {
    this.chrootPath = '';
    this.header = opCode ? new jute.proto.RequestHeader({ type: opCode }) : null;
    this.payload = payload;
  }

  /**
   *
   * @param {string} path
   */
  setChrootPath(path) {
    this.chrootPath = path;
  }

  /**
   * Serialize the request to a buffer.
   *
   * @return {Buffer} The buffer which contains the serialized request.
   */
  toBuffer() {
    if (this.chrootPath) this.payload.setChrootPath(this.chrootPath);

    // Needs 4 extra for the length field (Int32)
    const buffer = Buffer.alloc(4);
    const headerBuffer = this.header ? this.header.serialize() : Buffer.alloc(0);
    const payloadBuffer = this.payload ? this.payload.serialize() : Buffer.alloc(0);

    buffer.writeInt32BE(headerBuffer.length + payloadBuffer.length, 0);

    return Buffer.concat([
      buffer,
      headerBuffer,
      payloadBuffer,
    ]);
  }

};
