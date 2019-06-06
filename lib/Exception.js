/**
 * xiedacon created at 2019-05-27 16:57:17
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const _ = require('lodash');
const util = require('util');

const {
  ExceptionCode,
} = require('./constants');

const codeToName = _.invert(ExceptionCode);

module.exports = class Exception extends Error {
  /**
   * Exception class for all zookeeper errors.
   *
   * @param {string} name Exception code.
   * @param {Array<any>} args Name of the exception.
   */
  constructor(name, ...args) {
    super();

    this.name = name;
    this.args = args;

    let code;
    let type;
    let message;
    let value;
    let path;
    switch (name) {
      case 'TypeError':
        [ type, value ] = args;
        this.message = `[${type}] must be a ${type}, get a ${typeof value === 'object' ? Object.prototype.toString.call(value) : typeof value}, value: ${util.inspect(value)}`;
        break;
      case 'ProtocolError':
        [ code, path ] = args;
        this.code = code;
        this.message = `${codeToName[String(code)] || ''} [${code}] ${path || ''}`;
        break;
      default:
        [ message ] = args;
        this.message = message;
        break;
    }
  }

  /**
   * @return {new (type: string, value: any) => Exception}
   */
  static get Type() {
    return Exception.bind(null, 'TypeError');
  }

  /**
   * @return {new (code: number, path?: string) => Exception}
   */
  static get Protocol() {
    return Exception.bind(null, 'ProtocolError');
  }

  /**
   * @return {new (message: string) => Exception}
   */
  static get Unknow() {
    return Exception.bind(null, 'UnknowError');
  }

  /**
   * @return {new (message: string) => Exception}
   */
  static get Normal() {
    return Exception.bind(null, 'NormalError');
  }

  toString() {
    return this.message;
  }

};
