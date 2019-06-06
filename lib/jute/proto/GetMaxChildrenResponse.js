/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetMaxChildrenResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} max
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      max: new int(value.max),
    };

    super([
      { name: 'max', value: newValue.max },
    ]);

    this._value = newValue;
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
      max: this.max,
    };
  }

};
