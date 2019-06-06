/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class RemoveWatchesRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {int|number=} type
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      type: new int(value.type),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'type', value: newValue.type },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
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
      type: this.type,
    };
  }

};
