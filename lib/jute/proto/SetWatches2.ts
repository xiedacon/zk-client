/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import long from '../long';
import ustring from '../ustring';
import vector from '../vector';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  relativeZxid?: long | Buffer;
  dataWatches?: vector<string> | Array<string>;
  existWatches?: vector<string> | Array<string>;
  childWatches?: vector<string> | Array<string>;
  persistentWatches?: vector<string> | Array<string>;
  persistentRecursiveWatches?: vector<string> | Array<string>;
};

type Value = {
  relativeZxid: long;
  dataWatches: vector<string>;
  existWatches: vector<string>;
  childWatches: vector<string>;
  persistentWatches: vector<string>;
  persistentRecursiveWatches: vector<string>;
};

export default class SetWatches2 extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      relativeZxid: new long(value.relativeZxid),
      dataWatches: new vector(value.dataWatches, ustring),
      existWatches: new vector(value.existWatches, ustring),
      childWatches: new vector(value.childWatches, ustring),
      persistentWatches: new vector(value.persistentWatches, ustring),
      persistentRecursiveWatches: new vector(value.persistentRecursiveWatches, ustring),
    };

    super([
      { name: 'relativeZxid', value: newValue.relativeZxid },
      { name: 'dataWatches', value: newValue.dataWatches },
      { name: 'existWatches', value: newValue.existWatches },
      { name: 'childWatches', value: newValue.childWatches },
      { name: 'persistentWatches', value: newValue.persistentWatches },
      { name: 'persistentRecursiveWatches', value: newValue.persistentRecursiveWatches },
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

  get persistentWatches() {
    return this._value.persistentWatches.valueOf();
  }

  set persistentWatches(value) {
    this._value.persistentWatches.setValue(value);
  }

  get persistentRecursiveWatches() {
    return this._value.persistentRecursiveWatches.valueOf();
  }

  set persistentRecursiveWatches(value) {
    this._value.persistentRecursiveWatches.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      relativeZxid: this.relativeZxid,
      dataWatches: this.dataWatches,
      existWatches: this.existWatches,
      childWatches: this.childWatches,
      persistentWatches: this.persistentWatches,
      persistentRecursiveWatches: this.persistentRecursiveWatches,
    };
  }

}
