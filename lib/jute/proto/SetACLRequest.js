/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const ACL = require('../data/ACL');
const vector = require('../vector');
const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class SetACLRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} path
   * @property {vector<ACL>|Array<ACL>=} acl
   * @property {int|number=} version
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      path: new ustring(value.path),
      acl: new vector(value.acl, ACL),
      version: new int(value.version),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'acl', value: newValue.acl },
      { name: 'version', value: newValue.version },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get acl() {
    return this._value.acl.valueOf();
  }

  set acl(value) {
    this._value.acl.setValue(value);
  }

  get version() {
    return this._value.version.valueOf();
  }

  set version(value) {
    this._value.version.setValue(value);
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
      acl: this.acl,
      version: this.version,
    };
  }

};
