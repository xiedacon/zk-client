/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const ustring = require('../ustring');
const buffer = require('../buffer');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class AuthPacket extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} type
   * @property {ustring|string=} scheme
   * @property {buffer|Buffer=} auth
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      type: new int(value.type),
      scheme: new ustring(value.scheme),
      auth: new buffer(value.auth),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'scheme', value: newValue.scheme },
      { name: 'auth', value: newValue.auth },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get scheme() {
    return this._value.scheme.valueOf();
  }

  set scheme(value) {
    this._value.scheme.setValue(value);
  }

  get auth() {
    return this._value.auth.valueOf();
  }

  set auth(value) {
    this._value.auth.setValue(value);
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
      type: this.type,
      scheme: this.scheme,
      auth: this.auth,
    };
  }

};
