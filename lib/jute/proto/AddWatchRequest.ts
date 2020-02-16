/**
 * This file created by ./bin/gen_types
 * Do not modify this file!!!!!!!!!
 */

import ustring from '../ustring';
import int from '../int';

import RequestRecord from '../basic/RequestRecord';

type ParamValue = {
  path?: ustring | string;
  mode?: int | number;
};

type Value = {
  path: ustring;
  mode: int;
};

export default class AddWatchRequest extends RequestRecord {
  private _value: Value;

  constructor(value: ParamValue = {}) {
    const newValue = {
      path: new ustring(value.path),
      mode: new int(value.mode),
    };

    super([
      { name: 'path', value: newValue.path },
      { name: 'mode', value: newValue.mode },
    ]);

    this._value = newValue;
  }

  get path() {
    return this._value.path.valueOf();
  }

  set path(value) {
    this._value.path.setValue(value);
  }

  get mode() {
    return this._value.mode.valueOf();
  }

  set mode(value) {
    this._value.mode.setValue(value);
  }

  setValue(value: ParamValue = {}) {
    super.setValue(value);
  }

  valueOf() {
    return {
      path: this.path,
      mode: this.mode,
    };
  }

}
