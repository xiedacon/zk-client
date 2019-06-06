/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const Exception = require('../Exception');

const type = require('./basic/type');

module.exports = class int extends type {
  /**
   *
   * @param {int|number} value
   */
  constructor(value = 0) {
    super();

    this.setValue(value);
  }

  byteLength() {
    return 4;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  serialize(buffer, offset) {
    const bytesWritten = 4;

    if (typeof this.value === 'number') {
      buffer.writeInt32BE(this.value, offset);
    } else {
      buffer.writeInt32BE(0, offset);
    }

    return bytesWritten;
  }

  /**
   *
   * @param {Buffer} buffer
   * @param {number} offset
   */
  deserialize(buffer, offset) {
    this.value = buffer.readInt32BE(offset);

    return 4;
  }

  /**
   *
   * @param {int|number} value
   */
  setValue(value = 0) {
    this.value = value instanceof type ? value.valueOf() : value;

    if (typeof this.value !== 'number') throw new Exception.Type('number', value);
  }

  clear() {
    this.value = 0;
  }

  /**
   * @return {number}
   */
  valueOf() {
    return this.value;
  }

};
