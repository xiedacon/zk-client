/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const ustring = require('../ustring');
const object = require('./object');

const Exception = require('../../Exception');

/**
 *
 * @param {string} chrootPath
 * @param {string} path
 */
function removeChroot(chrootPath, path) {
  return chrootPath
    ? (path.substring(chrootPath.length) || '/')
    : path;
}

class ResponseRecord {
  /**
   *
   * @param {Array<{ name: string, value: import('./type') }>} value
   */
  constructor(value) {
    this.realType = new object(value);
    this.chrootPath = '';
  }

  /**
   *
   * @param {string} path
   */
  setChrootPath(path) {
    if (typeof path !== 'string') throw new Exception.Type('string', path);

    this.chrootPath = path;
  }

  /**
   * De-serialize the content from a buffer.
   *
   * @param {Buffer} buffer A buffer object.
   * @param {number=} offset The offset where the read starts.
   * @return {number}
   */
  deserialize(buffer, offset = 0) {
    if (!Buffer.isBuffer(buffer)) {
      throw new Error('buffer must an instance of Node.js Buffer class.');
    }

    if (offset < 0 || offset >= buffer.length) {
      throw new Error('offset: ' + offset + ' is out of buffer range.');
    }

    const bytesRead = this.realType.deserialize(buffer, offset);

    if (this.chrootPath) {
      this.realType.attrs = this.realType.attrs.map(({ name, value }) => {
        if (name === 'path') {
          value = new ustring(removeChroot(this.chrootPath, value.valueOf()));
        }

        return { name, value };
      });
    }

    return bytesRead;
  }

  setValue(value) {
    this.realType.setValue(value);
  }

  clear() {
    this.chrootPath = '';
    this.realType.clear();
  }

}

let MixinRecord;
const realHasInstance = Function.prototype[Symbol.hasInstance];
Object.defineProperty(ResponseRecord, Symbol.hasInstance, {
  value(object) {
    if (realHasInstance.call(this, object)) return true;
    if (this !== ResponseRecord) return false;
    if (!MixinRecord) MixinRecord = require('./MixinRecord');

    return object instanceof MixinRecord;
  },
});

module.exports = ResponseRecord;
