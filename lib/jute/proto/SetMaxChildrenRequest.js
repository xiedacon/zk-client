/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class SetMaxChildrenRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {int|number=} max
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      max: new int(value.max),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'max', value: newValue.max },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get max() {
    return this._value.max.valueOf();
  }

  set max(value) {
    this._value.max.setValue(value);
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
      max: this.max,
    };
  }

};
