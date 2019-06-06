/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const Exception = require('../Exception');

const Type = require('./basic/type');

/**
 * @template T
 */
module.exports = class vector extends Type {
  /**
   *
   * @param {vector<T>|Array<T>} value
   * @param {typeof Type} type
   */
  constructor(value = [], type) {
    super();

    this.type = type;
    this.setValue(value);
  }

  /**
   * Calculate and return the size of the buffer which is need to serialize this.
   */
  byteLength() {
    let length = 4;

    if (Array.isArray(this.value)) {
      for (const value of this.value) {
        length += value.byteLength();
      }
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
    let bytesWritten = 4;

    if (Array.isArray(this.value)) {
      const length = this.value.length;
      buffer.writeInt32BE(length, offset);

      for (const value of this.value) {
        bytesWritten += value.serialize(buffer, offset + bytesWritten);
      }
    } else {
      buffer.writeInt32BE(-1, offset);
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
    const length = buffer.readInt32BE(offset);
    let bytesRead = 4;

    if (length === -1) {
      this.value = undefined;
    } else {
      this.value = [];
      while (length > this.value.length) {
        const value = new this.type();
        bytesRead += value.deserialize(buffer, offset + bytesRead);

        this.value.push(value);
      }
    }

    return bytesRead;
  }

  /**
   *
   * @param {vector<T>|Array<T>} value
   */
  setValue(value = []) {
    const newValue = value instanceof Type ? value.valueOf() : value;

    if (!Array.isArray(newValue)) throw new Exception.Type('Array', value);

    /** @type {Array<Type>} */
    // @ts-ignore
    this.value = newValue.map(v => new this.type(v));
  }

  clear() {
    this.value = [];
  }

  /**
   * @return {Array<T>}
   */
  valueOf() {
    return this.value.map(v => v.valueOf());
  }

};
