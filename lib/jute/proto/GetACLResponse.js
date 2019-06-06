/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ACL = require('../data/ACL');
const vector = require('../vector');
const Stat = require('../data/Stat');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class GetACLResponse extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {vector<ACL>|Array<ACL>=} acl
   * @property {Stat=} stat
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      acl: new vector(value.acl, ACL),
      stat: new Stat(value.stat),
    };

    super([
      { name: 'acl', value: newValue.acl },
      { name: 'stat', value: newValue.stat },
    ]);

    this._value = newValue;
  }

  get acl() {
    return this._value.acl.valueOf();
  }

  set acl(value) {
    this._value.acl.setValue(value);
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
      acl: this.acl,
      stat: this.stat,
    };
  }

};
