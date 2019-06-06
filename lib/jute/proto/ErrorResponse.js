/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class ErrorResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} err
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      err: new int(value.err),
    };

    super([
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
  }

  get err() {
    return this._value.err.valueOf();
  }

  set err(value) {
    this._value.err.setValue(value);
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
      err: this.err,
    };
  }

};
