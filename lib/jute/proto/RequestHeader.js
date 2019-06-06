/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class RequestHeader extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} xid
   * @property {int|number=} type
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      xid: new int(value.xid),
      type: new int(value.type),
    };

    super([
      { name: 'xid', value: newValue.xid },
      { name: 'type', value: newValue.type },
    ]);

    this._value = newValue;
  }

  get xid() {
    return this._value.xid.valueOf();
  }

  set xid(value) {
    this._value.xid.setValue(value);
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
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
      type: this.type,
    };
  }

};
