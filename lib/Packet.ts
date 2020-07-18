/**
 * xiedacon created at 2019-05-31 23:11:59
 *
 * Copyright (c) 2019 xiedacon, all rights reserved.
 */

import Request from './Request';
import Response from './Response';

export default class Packet<Req extends Request<Jute.basic.RequestRecord>, Res extends Response<Jute.basic.ResponseRecord>> {
  opCode: number;
  request: Req;
  response: Res;
  callback?: (error: Error & { data?: any } | null) => any;
  stack: string;

  constructor(opCode: number, request: Req, response: Res, callback?: (error: Error | null) => any) {
    this.opCode = opCode;
    this.request = request;
    this.response = response;
    this.callback = callback;
    this.stack = '';
  }

}
