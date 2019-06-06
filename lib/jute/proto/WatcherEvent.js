/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const ustring = require('../ustring');

const ResponseRecord = require('../basic/ResponseRecord');

module.exports = class WatcherEvent extends ResponseRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} type
   * @property {int|number=} state
   * @property {ustring|string=} path
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      type: new int(value.type),
      state: new int(value.state),
      path: new ustring(value.path),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'state', value: newValue.state },
      { name: 'path', value: newValue.path },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get state() {
    return this._value.state.valueOf();
  }

  set state(value) {
    this._value.state.setValue(value);
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
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
      type: this.type,
      state: this.state,
      path: this.path,
    };
  }

};
