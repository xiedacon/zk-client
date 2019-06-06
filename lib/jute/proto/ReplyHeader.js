/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const long = require('../long');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class ReplyHeader extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} xid
   * @property {long|Buffer=} zxid
   * @property {int|number=} err
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      xid: new int(value.xid),
      zxid: new long(value.zxid),
      err: new int(value.err),
    };

    super([
      { name: 'xid', value: newValue.xid },
      { name: 'zxid', value: newValue.zxid },
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
  }

  get xid() {
    return this._value.xid.valueOf();
  }

  set xid(value) {
    this._value.xid.setValue(value);
  }

  get zxid() {
    return this._value.zxid.valueOf();
  }

  set zxid(value) {
    this._value.zxid.setValue(value);
  }

  get err() {
    return this._value.err.valueOf();
  }

  set err(value) {
    this._value.err.setValue(value);
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
      xid: this.xid,
      zxid: this.zxid,
      err: this.err,
    };
  }

};
