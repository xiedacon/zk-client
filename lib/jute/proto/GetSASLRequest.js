/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const buffer = require('../buffer');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class GetSASLRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {buffer|Buffer=} token
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      token: new buffer(value.token),
    };

    super([
      { name: 'token', value: newValue.token },
    ]);

    this._value = newValue;
  }

  get token() {
    return this._value.token.valueOf();
  }

  set token(value) {
    this._value.token.setValue(value);
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
      token: this.token,
    };
  }

};
