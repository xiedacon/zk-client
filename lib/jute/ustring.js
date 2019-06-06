/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const Exception = require('../Exception');

const type = require('./basic/type');

module.exports = class ustring extends type {
  /**
   *
   * @param {ustring|string} value
   */
  constructor(value = '') {
    super();

    this.setValue(value);
  }

  byteLength() {
    let length = 4;

    if (typeof this.value === 'string') {
      length += Buffer.byteLength(this.value);
    }

    return length;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  serialize(buffer, offset) {
    let bytesWritten = 4;

    if (typeof this.value === 'string') {
      const length = Buffer.byteLength(this.value);
      buffer.writeInt32BE(length, offset);

      Buffer.from(this.value).copy(buffer, offset + bytesWritten);
      bytesWritten += length;
    } else {
      buffer.writeInt32BE(-1, offset);
    }

    return bytesWritten;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  deserialize(buffer, offset) {
    const length = buffer.readInt32BE(offset);
    let bytesRead = 4;

    if (length === -1) {
      this.value = undefined;
    } else {
      this.value = buffer.toString(
        'utf8',
        offset + bytesRead,
        offset + bytesRead + length
      );

      bytesRead += length;
    }

    return bytesRead;
  }

  /**
   *
   * @param {ustring|string} value
   */
  setValue(value = '') {
    this.value = value instanceof type ? value.valueOf() : value;

    if (typeof this.value !== 'string') throw new Exception.Type('string', value);
  }

  clear() {
    this.value = '';
  }

  /**
   * @return {string}
   */
  valueOf() {
    return this.value;
  }

};
