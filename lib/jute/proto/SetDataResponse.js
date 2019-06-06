/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const Stat = require('../data/Stat');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class SetDataResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {Stat=} stat
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      stat: new Stat(value.stat),
    };

    super([
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get stat() {
    return this._value.stat.valueOf();
  }

  set stat(value) {
    this._value.stat.setValue(value);
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
      stat: this.stat,
    };
  }

};
