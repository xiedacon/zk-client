/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const Stat = require('../data/Stat');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class Create2Response extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {Stat=} stat
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
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
      path: this.path,
      stat: this.stat,
    };
  }

};
