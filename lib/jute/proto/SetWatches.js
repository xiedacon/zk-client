/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const long = require('../long');
const ustring = require('../ustring');
const vector = require('../vector');

const RequestRecord = require('../basic/RequestRecord');

module.exports = class SetWatches extends RequestRecord {
  /**
   * @typedef {object} Value
   * @property {long|Buffer=} relativeZxid
   * @property {vector<string>|Array<string>=} dataWatches
   * @property {vector<string>|Array<string>=} existWatches
   * @property {vector<string>|Array<string>=} childWatches
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      relativeZxid: new long(value.relativeZxid),
      dataWatches: new vector(value.dataWatches, ustring),
      existWatches: new vector(value.existWatches, ustring),
      childWatches: new vector(value.childWatches, ustring),
    };

    super([
      { name: 'relativeZxid', value: newValue.relativeZxid },
      { name: 'dataWatches', value: newValue.dataWatches },
      { name: 'existWatches', value: newValue.existWatches },
      { name: 'childWatches', value: newValue.childWatches },
    ]);

    this._value = newValue;
  }

  get relativeZxid() {
    return this._value.relativeZxid.valueOf();
  }

  set relativeZxid(value) {
    this._value.relativeZxid.setValue(value);
  }

  get dataWatches() {
    return this._value.dataWatches.valueOf();
  }

  set dataWatches(value) {
    this._value.dataWatches.setValue(value);
  }

  get existWatches() {
    return this._value.existWatches.valueOf();
  }

  set existWatches(value) {
    this._value.existWatches.setValue(value);
  }

  get childWatches() {
    return this._value.childWatches.valueOf();
  }

  set childWatches(value) {
    this._value.childWatches.setValue(value);
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
      relativeZxid: this.relativeZxid,
      dataWatches: this.dataWatches,
      existWatches: this.existWatches,
      childWatches: this.childWatches,
    };
  }

};
