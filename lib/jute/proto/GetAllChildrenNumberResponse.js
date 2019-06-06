/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetAllChildrenNumberResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} totalNumber
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      totalNumber: new int(value.totalNumber),
    };

    super([
      { name: 'totalNumber', value: newValue.totalNumber },
    ]);

    this._value = newValue;
  }

  get totalNumber() {
    return this._value.totalNumber.valueOf();
  }

  set totalNumber(value) {
    this._value.totalNumber.setValue(value);
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
      totalNumber: this.totalNumber,
    };
  }

};
