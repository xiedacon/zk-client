/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const vector = require('../vector');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetChildrenResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {vector<string>|Array<string>=} children
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      children: new vector(value.children, ustring),
    };

    super([
      { name: 'children', value: newValue.children },
    ]);

    this._value = newValue;
  }

  get children() {
    return this._value.children.valueOf();
  }

  set children(value) {
    this._value.children.setValue(value);
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
    };
  }

};
