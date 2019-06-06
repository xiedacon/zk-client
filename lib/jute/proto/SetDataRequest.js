/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const buffer = require('../buffer');
const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class SetDataRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {buffer|Buffer=} data
   * @property {int|number=} version
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      data: new buffer(value.data),
      version: new int(value.version),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'data', value: newValue.data },
      { name: 'version', value: newValue.version },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get data() {
    return this._value.data.valueOf();
  }

  set data(value) {
    this._value.data.setValue(value);
  }

  get version() {
    return this._value.version.valueOf();
  }

  set version(value) {
    this._value.version.setValue(value);
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
      data: this.data,
      version: this.version,
    };
  }

};
