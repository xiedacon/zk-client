/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const Id = require('./Id');

const object = require('../basic/object');

module.exports = class ACL extends object {
  /**
   * @typedef {object} Value
   * @property {int|number=} perms
   * @property {Id=} id
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      perms: new int(value.perms),
      id: new Id(value.id),
    };

    super([
      { name: 'perms', value: newValue.perms },
      { name: 'id', value: newValue.id },
    ]);

    this._value = newValue;
  }

  get perms() {
    return this._value.perms.valueOf();
  }

  set perms(value) {
    this._value.perms.setValue(value);
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
      perms: this.perms,
      id: this.id,
    };
  }

};
