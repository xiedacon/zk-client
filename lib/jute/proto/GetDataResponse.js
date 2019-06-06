/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const buffer = require('../buffer');
const Stat = require('../data/Stat');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetDataResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {buffer|Buffer=} data
   * @property {Stat=} stat
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      data: new buffer(value.data),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'data', value: newValue.data },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get data() {
    return this._value.data.valueOf();
  }

  set data(value) {
    this._value.data.setValue(value);
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
      data: this.data,
      stat: this.stat,
    };
  }

};
