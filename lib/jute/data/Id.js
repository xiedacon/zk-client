/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');

const object = require('../basic/object');

module.exports = class Id extends object {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} scheme
   * @property {ustring|string=} id
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      scheme: new ustring(value.scheme),
      id: new ustring(value.id),
    };

    super([
      { name: 'scheme', value: newValue.scheme },
      { name: 'id', value: newValue.id },
    ]);

    this._value = newValue;
  }

  get scheme() {
    return this._value.scheme.valueOf();
  }

  set scheme(value) {
    this._value.scheme.setValue(value);
  }

  get id() {
    return this._value.id.valueOf();
  }

  set id(value) {
    this._value.id.setValue(value);
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
      scheme: this.scheme,
      id: this.id,
    };
  }

};
