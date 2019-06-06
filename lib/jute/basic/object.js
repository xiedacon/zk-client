/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const type = require('./type');

/**
 * Abstract class for all jute object types
 */
module.exports = class _object extends type {
  /**
   *
   * @param {Array<{ name: string, value: type }>} value
   */
  constructor(value) {
    super();

    this.attrs = value;
  }

  byteLength() {
    let length = 0;

    for (const attr of this.attrs) {
      length += attr.value.byteLength();
    }

    return length;
  }

  /**
   * Serialize the content to a buffer.
   *
   * @param {Buffer} buffer buffer
   * @param {number} offset offset
   */
  serialize(buffer, offset) {
    let bytesWritten = 0;

    for (const attr of this.attrs) {
      bytesWritten += attr.value.serialize(buffer, offset + bytesWritten);
    }

    return bytesWritten;
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param {Buffer} buffer buffer
   * @param {number} offset offset
   */
  deserialize(buffer, offset) {
    let bytesRead = 0;

    for (const attr of this.attrs) {
      bytesRead += attr.value.deserialize(buffer, offset + bytesRead);
    }

    return bytesRead;
  }

  /**
   *
   * @param {any} value
   */
  setValue(value) {
    value = value instanceof type ? value.valueOf() : value;

    for (const attr of this.attrs) {
      attr.value.setValue(value[attr.name]);
    }
  }

  clear() {
    for (const attr of this.attrs) {
      attr.value.clear();
    }
  }

};
