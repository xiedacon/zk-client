/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const _boolean = require('../boolean');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class GetDataRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {_boolean|boolean=} watch
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      watch: new _boolean(value.watch),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'watch', value: newValue.watch },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get watch() {
    return this._value.watch.valueOf();
  }

  set watch(value) {
    this._value.watch.setValue(value);
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
      watch: this.watch,
    };
  }

};
