/**
 * xiedacon created at 2019-05-28 16:27:46
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const {
  OpCode,
} = require('./constants');
const jute = require('./jute');
const Response = require('./Response');

class TransactionResponse extends Response {
  constructor() {
    super();

    /** @type {Array<Jute.basic.ResponseRecord>} */
    this.payload = [];
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
   * @param {Jute.basic.ResponseRecord} record
   */
  push(record) {
    this.payload.push(
      new jute.proto.MultiHeader(),
      record
    );
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  fromBuffer(buffer, offset = 0) {
    let bytesRead = 0;
    bytesRead += this.header.deserialize(buffer, offset + bytesRead);

    for (let i = 0; i < this.payload.length; i++) {
      const record = this.payload[i];

      if (record) {
        if (this.chrootPath) {
          record.setChrootPath(this.chrootPath);
        }

        bytesRead += record.deserialize(buffer, offset + bytesRead);

        if (record instanceof jute.proto.MultiHeader && record.type === OpCode.error) {
          this.payload[i + 1] = new jute.proto.ErrorResponse();
        }
      }
    }

    return bytesRead;
  }

  [Symbol.iterator]() {
    const payload = this.payload;
    return (function* () {
      for (let i = 0; i < payload.length; i += 2) {
        yield {
          // Forced type conversion just like Java
          /** @type {Jute.proto.MultiHeader} */
          // @ts-ignore
          header: payload[i],
          payload: payload[i + 1],
        };
      }
    })();
  }
}

module.exports = TransactionResponse;
