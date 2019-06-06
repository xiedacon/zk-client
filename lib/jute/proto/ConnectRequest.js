/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const long = require('../long');
const buffer = require('../buffer');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class ConnectRequest extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} protocolVersion
   * @property {long|Buffer=} lastZxidSeen
   * @property {int|number=} timeOut
   * @property {long|Buffer=} sessionId
   * @property {buffer|Buffer=} passwd
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      protocolVersion: new int(value.protocolVersion),
      lastZxidSeen: new long(value.lastZxidSeen),
      timeOut: new int(value.timeOut),
      sessionId: new long(value.sessionId),
      passwd: new buffer(value.passwd),
    };

    super([
      { name: 'protocolVersion', value: newValue.protocolVersion },
      { name: 'lastZxidSeen', value: newValue.lastZxidSeen },
      { name: 'timeOut', value: newValue.timeOut },
      { name: 'sessionId', value: newValue.sessionId },
      { name: 'passwd', value: newValue.passwd },
    ]);

    this._value = newValue;
  }

  get protocolVersion() {
    return this._value.protocolVersion.valueOf();
  }

  set protocolVersion(value) {
    this._value.protocolVersion.setValue(value);
  }

  get lastZxidSeen() {
    return this._value.lastZxidSeen.valueOf();
  }

  set lastZxidSeen(value) {
    this._value.lastZxidSeen.setValue(value);
  }

  get timeOut() {
    return this._value.timeOut.valueOf();
  }

  set timeOut(value) {
    this._value.timeOut.setValue(value);
  }

  get sessionId() {
    return this._value.sessionId.valueOf();
  }

  set sessionId(value) {
    this._value.sessionId.setValue(value);
  }

  get passwd() {
    return this._value.passwd.valueOf();
  }

  set passwd(value) {
    this._value.passwd.setValue(value);
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
      protocolVersion: this.protocolVersion,
      lastZxidSeen: this.lastZxidSeen,
      timeOut: this.timeOut,
      sessionId: this.sessionId,
      passwd: this.passwd,
    };
  }

};
