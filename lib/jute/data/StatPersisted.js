/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const long = require('../long');
const int = require('../int');

const object = require('../basic/object');

module.exports = class StatPersisted extends object {
  /**
   * @typedef {object} Value
   * @property {long|Buffer=} czxid
   * @property {long|Buffer=} mzxid
   * @property {long|Buffer=} ctime
   * @property {long|Buffer=} mtime
   * @property {int|number=} version
   * @property {int|number=} cversion
   * @property {int|number=} aversion
   * @property {long|Buffer=} ephemeralOwner
   * @property {long|Buffer=} pzxid
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      czxid: new long(value.czxid),
      mzxid: new long(value.mzxid),
      ctime: new long(value.ctime),
      mtime: new long(value.mtime),
      version: new int(value.version),
      cversion: new int(value.cversion),
      aversion: new int(value.aversion),
      ephemeralOwner: new long(value.ephemeralOwner),
      pzxid: new long(value.pzxid),
    };

    super([
      { name: 'czxid', value: newValue.czxid },
      { name: 'mzxid', value: newValue.mzxid },
      { name: 'ctime', value: newValue.ctime },
      { name: 'mtime', value: newValue.mtime },
      { name: 'version', value: newValue.version },
      { name: 'cversion', value: newValue.cversion },
      { name: 'aversion', value: newValue.aversion },
      { name: 'ephemeralOwner', value: newValue.ephemeralOwner },
      { name: 'pzxid', value: newValue.pzxid },
    ]);

    this._value = newValue;
  }

  get czxid() {
    return this._value.czxid.valueOf();
  }

  set czxid(value) {
    this._value.czxid.setValue(value);
  }

  get mzxid() {
    return this._value.mzxid.valueOf();
  }

  set mzxid(value) {
    this._value.mzxid.setValue(value);
  }

  get ctime() {
    return this._value.ctime.valueOf();
  }

  set ctime(value) {
    this._value.ctime.setValue(value);
  }

  get mtime() {
    return this._value.mtime.valueOf();
  }

  set mtime(value) {
    this._value.mtime.setValue(value);
  }

  get version() {
    return this._value.version.valueOf();
  }

  set version(value) {
    this._value.version.setValue(value);
  }

  get cversion() {
    return this._value.cversion.valueOf();
  }

  set cversion(value) {
    this._value.cversion.setValue(value);
  }

  get aversion() {
    return this._value.aversion.valueOf();
  }

  set aversion(value) {
    this._value.aversion.setValue(value);
  }

  get ephemeralOwner() {
    return this._value.ephemeralOwner.valueOf();
  }

  set ephemeralOwner(value) {
    this._value.ephemeralOwner.setValue(value);
  }

  get pzxid() {
    return this._value.pzxid.valueOf();
  }

  set pzxid(value) {
    this._value.pzxid.setValue(value);
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
      czxid: this.czxid,
      mzxid: this.mzxid,
      ctime: this.ctime,
      mtime: this.mtime,
      version: this.version,
      cversion: this.cversion,
      aversion: this.aversion,
      ephemeralOwner: this.ephemeralOwner,
      pzxid: this.pzxid,
    };
  }

};