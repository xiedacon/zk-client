/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const type = require('./basic/type');

module.exports = class _boolean extends type {
  /**
   *
   * @param {boolean|_boolean} value
   */
  constructor(value = false) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 1;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  serialize(buffer, offset) {
    const bytesWritten = 1;

    buffer.writeUInt8(this.value ? 1 : 0, offset);

    return bytesWritten;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  deserialize(buffer, offset) {
    this.value = buffer.readUInt8(offset) === 1;

    return 1;
  }

  /**
   *
   * @param {boolean|_boolean} value
   */
  setValue(value = false) {
    this.value = value instanceof type ? value.valueOf() : value;
  }

  clear() {
    this.value = false;
  }

  valueOf() {
    return Boolean(this.value);
  }

};
