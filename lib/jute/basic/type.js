/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

/**
 * Interface for all jute types
 */
module.exports = class Type {

  /**
   * Calculate and return the size of the buffer which is need to serialize this.
   *
   * @return {number}
   */
  byteLength() {
    throw new Error('method must be implemented');
  }

  /**
   * Serialize the content to a buffer.
   *
   * @param {Buffer} buffer buffer
   * @param {number} offset offset
   * @return {number}
   */
  serialize(buffer, offset) {
    throw new Error('method must be implemented');
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param {Buffer} buffer buffer
   * @param {number} offset offset
   * @return {number}
   */
  deserialize(buffer, offset) {
    throw new Error('method must be implemented');
  }

  /**
   *
   * @param {any} value
   */
  setValue(value) {
    throw new Error('method must be implemented');
  }

  clear() {
    throw new Error('method must be implemented');
  }

  /**
   * @return {any}
   */
  valueOf() {
    throw new Error('method must be implemented');
  }

};
