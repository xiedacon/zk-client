/**
 * xiedacon created at 2019-05-28 17:16:15
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const ustring = require('../ustring');
const vector = require('../vector');
const object = require('./object');

const Exception = require('../../Exception');

/**
 *
 * @param {string} chrootPath
 * @param {string} path
 */
function prependChroot(chrootPath, path) {
  return chrootPath
    ? path === '/'
      ? chrootPath
      : this.chrootPath + path
    : path;
}

module.exports = class RequestRecord {
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
   * Serialize the content to a buffer.
   *
   * @return {Buffer}
   */
  serialize() {
    const attrs = this.realType.attrs;

    if (this.chrootPath) {
      this.realType.attrs = this.realType.attrs.map(({ name, value }) => {
        if (name === 'path') {
          value = new ustring(prependChroot(this.chrootPath, value.valueOf()));
        } else if (
          (name === 'dataWatches'
        || name === 'existWatches'
        || name === 'childWatches'
          ) && value instanceof vector
        ) {
          value = new vector(value.valueOf().map(path => prependChroot(this.chrootPath, path)), ustring);
        }

        return { name, value };
      });
    }

    const buffer = Buffer.alloc(this.realType.byteLength());
    this.realType.serialize(buffer, 0);
    this.realType.attrs = attrs;

    return buffer;
  }

  setValue(value) {
    this.realType.setValue(value);
  }

  clear() {
    this.chrootPath = '';
    this.realType.clear();
  }

};
