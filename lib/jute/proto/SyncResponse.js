/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class SyncResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
    };

    super([
      { name: 'path', value: newValue.path },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  /**
   *
   * @param {Value} value
   */
  setValue(value = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
    };
  }

};
