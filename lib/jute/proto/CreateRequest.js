/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const buffer = require('../buffer');
const ACL = require('../data/ACL');
const vector = require('../vector');
const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class CreateRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {buffer|Buffer=} data
   * @property {vector<ACL>|Array<ACL>=} acl
   * @property {int|number=} flags
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      data: new buffer(value.data),
      acl: new vector(value.acl, ACL),
      flags: new int(value.flags),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'data', value: newValue.data },
      { name: 'acl', value: newValue.acl },
      { name: 'flags', value: newValue.flags },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get data() {
    return this._value.data.valueOf();
  }

  set data(value) {
    this._value.data.setValue(value);
  }

  get acl() {
    return this._value.acl.valueOf();
  }

  set acl(value) {
    this._value.acl.setValue(value);
  }

  get flags() {
    return this._value.flags.valueOf();
  }

  set flags(value) {
    this._value.flags.setValue(value);
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
      data: this.data,
      acl: this.acl,
      flags: this.flags,
    };
  }

};
