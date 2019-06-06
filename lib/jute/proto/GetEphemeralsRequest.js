/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class GetEphemeralsRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} prefixPath
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      prefixPath: new ustring(value.prefixPath),
    };

    super([
      { name: 'prefixPath', value: newValue.prefixPath },
    ]);

    this._value = newValue;
  }

  get prefixPath() {
    return this._value.prefixPath.valueOf();
  }

  set prefixPath(value) {
    this._value.prefixPath.setValue(value);
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
      prefixPath: this.prefixPath,
    };
  }

};
