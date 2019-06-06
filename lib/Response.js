/**
 * xiedacon created at 2019-05-28 16:24:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const jute = require('./jute');

/**
 * This class represent the response that ZooKeeper sends back to the client.
 *
 * @template {Jute.basic.ResponseRecord} Payload
 */
module.exports = class Response {
  /**
   *
   * @param {Payload=} payload The response payload record.
   */
  constructor(payload) {
    this.header = new jute.proto.ReplyHeader();
    this.payload = payload;
    this.chrootPath = '';
  }

  /**
   *
   * @param {string} path
   */
  setChrootPath(path) {
    this.chrootPath = path;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number=} offset
   */
  fromBuffer(buffer, offset = 0) {
    if (this.chrootPath) this.payload.setChrootPath(this.chrootPath);

    let bytesRead = 0;
    bytesRead += this.header ? this.header.deserialize(buffer, offset + bytesRead) : 0;
    bytesRead += this.payload ? this.payload.deserialize(buffer, offset + bytesRead) : 0;

    return bytesRead;
  }

};
