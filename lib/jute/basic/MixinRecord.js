/**
 * xiedacon created at 2019-06-01 17:50:29
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const RequestRecord = require('./RequestRecord');
const ResponseRecord = require('./ResponseRecord');

/**
 * Mixin RequestRecord and ResponseRecord.
 */
module.exports = class MixinRecord extends RequestRecord {

  /**
   * De-serialize the content from a buffer.
   *
   * @param {Buffer} buffer A buffer object.
   * @param {Number} offset The offset where the read starts.
   * @return {number}
   */
  deserialize(buffer, offset) {
    return ResponseRecord.prototype.deserialize.call(this, buffer, offset);
  }

};
