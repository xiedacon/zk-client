/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const Exception = require('../Exception');

const type = require('./basic/type');

/**
 * Long is represented by a buffer of 8 bytes in big endian since
 * Javascript does not support native 64 integer.
 */
module.exports = class long extends type {
  /**
   *
   * @param {long|Buffer} value
   */
  constructor(value = Buffer.alloc(8)) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 8;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  serialize(buffer, offset) {
    const bytesWritten = 8;

    if (Buffer.isBuffer(this.value)) {
      this.value.copy(buffer, offset);
    } else {
      Buffer.alloc(8).copy(buffer, offset);
    }

    return bytesWritten;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  deserialize(buffer, offset) {
    this.value = Buffer.alloc(8);
    buffer.copy(this.value, 0, offset, offset + 8);

    return 8;
  }

  /**
   *
   * @param {long|Buffer} value
   */
  setValue(value = Buffer.alloc(8)) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (!Buffer.isBuffer(this.value)) throw new Exception.Type('buffer', value);
  }

  clear() {
    this.value.fill(0);
  }

  /**
   * @return {Buffer}
   */
  valueOf() {
    return this.value;
  }

};
