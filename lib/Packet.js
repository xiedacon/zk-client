/**
 * xiedacon created at 2019-05-31 23:11:59
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

/**
 *
 * @template {import('./Request')} Req
 * @template {import('./Response')} Res
 */
module.exports = class Packet {
  /**
   *
   * @param {number} opCode
   * @param {Req} request
   * @param {Res} response
   * @param {(error: Error, packet: Packet<Req, Res>) => any=} callback
   */
  constructor(opCode, request, response, callback) {
    this.opCode = opCode;
    this.request = request;
    this.response = response;
    this.callback = callback;
    this.stack = '';
  }

};
