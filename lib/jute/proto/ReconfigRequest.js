/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const ustring = require('../ustring');
const long = require('../long');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class ReconfigRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {ustring|string=} joiningServers
   * @property {ustring|string=} leavingServers
   * @property {ustring|string=} newMembers
   * @property {long|Buffer=} curConfigId
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      joiningServers: new ustring(value.joiningServers),
      leavingServers: new ustring(value.leavingServers),
      newMembers: new ustring(value.newMembers),
      curConfigId: new long(value.curConfigId),
    };

    super([
      { name: 'joiningServers', value: newValue.joiningServers },
      { name: 'leavingServers', value: newValue.leavingServers },
      { name: 'newMembers', value: newValue.newMembers },
      { name: 'curConfigId', value: newValue.curConfigId },
    ]);

    this._value = newValue;
  }

  get joiningServers() {
    return this._value.joiningServers.valueOf();
  }

  set joiningServers(value) {
    this._value.joiningServers.setValue(value);
  }

  get leavingServers() {
    return this._value.leavingServers.valueOf();
  }

  set leavingServers(value) {
    this._value.leavingServers.setValue(value);
  }

  get newMembers() {
    return this._value.newMembers.valueOf();
  }

  set newMembers(value) {
    this._value.newMembers.setValue(value);
  }

  get curConfigId() {
    return this._value.curConfigId.valueOf();
  }

  set curConfigId(value) {
    this._value.curConfigId.setValue(value);
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
      joiningServers: this.joiningServers,
      leavingServers: this.leavingServers,
      newMembers: this.newMembers,
      curConfigId: this.curConfigId,
    };
  }

};
