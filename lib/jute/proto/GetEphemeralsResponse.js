/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const vector = require('../vector');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetEphemeralsResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {vector<string>|Array<string>=} ephemerals
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      ephemerals: new vector(value.ephemerals, ustring),
    };

    super([
      { name: 'ephemerals', value: newValue.ephemerals },
    ]);

    this._value = newValue;
  }

  get ephemerals() {
    return this._value.ephemerals.valueOf();
  }

  set ephemerals(value) {
    this._value.ephemerals.setValue(value);
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
      ephemerals: this.ephemerals,
    };
  }

};
