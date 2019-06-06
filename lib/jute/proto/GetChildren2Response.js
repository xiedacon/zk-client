/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const vector = require('../vector');
const Stat = require('../data/Stat');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetChildren2Response extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {vector<string>|Array<string>=} children
   * @property {Stat=} stat
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      children: new vector(value.children, ustring),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'children', value: newValue.children },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get children() {
    return this._value.children.valueOf();
  }

  set children(value) {
    this._value.children.setValue(value);
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
      children: this.children,
      stat: this.stat,
    };
  }

};
