/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */
'use strict';

const int = require('../int');
const _boolean = require('../boolean');

const MixinRecord = require('../basic/MixinRecord');

module.exports = class MultiHeader extends MixinRecord {
  /**
   * @typedef {object} Value
   * @property {int|number=} type
   * @property {_boolean|boolean=} done
   * @property {int|number=} err
   *
   * @param {Value} value
   */
  constructor(value = {}) {
    const newValue = {
      type: new int(value.type),
      done: new _boolean(value.done),
      err: new int(value.err),
    };

    super([
      { name: 'type', value: newValue.type },
      { name: 'done', value: newValue.done },
      { name: 'err', value: newValue.err },
    ]);

    this._value = newValue;
  }

  get type() {
    return this._value.type.valueOf();
  }

  set type(value) {
    this._value.type.setValue(value);
  }

  get done() {
    return this._value.done.valueOf();
  }

  set done(value) {
    this._value.done.setValue(value);
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
      type: this.type,
      done: this.done,
      err: this.err,
    };
  }

};
