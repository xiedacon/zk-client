/**
 * xiedacon created at 2019-05-28 16:30:32
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const _ = require('lodash');
const util = require('util');

const {
  OpCode,
} = require('./constants');
const jute = require('./jute');
const Request = require('./Request');

/** @type {Map<object, number>} */
const recordProtoToOpCode = new Map();
recordProtoToOpCode.set(jute.proto.CreateRequest.prototype, OpCode.create);
recordProtoToOpCode.set(jute.proto.DeleteRequest.prototype, OpCode.delete);
recordProtoToOpCode.set(jute.proto.SetDataRequest.prototype, OpCode.setData);
recordProtoToOpCode.set(jute.proto.CheckVersionRequest.prototype, OpCode.check);

/**
 *
 * @param {Jute.basic.RequestRecord} record
 */
function recordToOpCode(record) {
  let opCode = recordProtoToOpCode.get(Object.getPrototypeOf(record));

  if (opCode === undefined) {
    if (record instanceof jute.proto.CreateRequest) {
      opCode = OpCode.create;
    } else if (record instanceof jute.proto.DeleteRequest) {
      opCode = OpCode.delete;
    } else if (record instanceof jute.proto.SetDataRequest) {
      opCode = OpCode.setData;
    } else if (record instanceof jute.proto.CheckVersionRequest) {
      opCode = OpCode.check;
    } else {
      throw new Error('Unsupport RequestRecord: ' + _.get(Object.getPrototypeOf(record), [ 'constructor', 'name' ], util.inspect(record)));
    }
  }

  return opCode;
}

module.exports = class TransactionRequest extends Request {
  constructor() {
    super(OpCode.multi);

    /** @type {Array<Jute.basic.RequestRecord>} */
    this.payload = [];
  }

  /**
   *
   * @param {Jute.basic.RequestRecord} record
   */
  push(record) {
    this.payload.push(
      new jute.proto.MultiHeader({
        type: recordToOpCode(record),
        done: false,
        err: -1,
      }),
      record
    );
  }

  /**
   * Serialize the request to a buffer.
   *
   * @return {Buffer} The buffer which contains the serialized request.
   */
  toBuffer() {
    // Signal the end of the ops.
    this.payload.push(new jute.proto.MultiHeader({
      type: -1,
      done: true,
      err: -1,
    }));

    const payload = this.payload.filter(Boolean);
    if (this.chrootPath) {
      for (const record of payload) {
        record.setChrootPath(this.chrootPath);
      }
    }

    // Needs 4 extra for the length field (Int32)
    const buffer = Buffer.alloc(4);
    const headerBuffer = this.header.serialize();
    const packetsBuffer = Buffer.concat(payload.map(packet => packet.serialize()));

    buffer.writeInt32BE(headerBuffer.length + packetsBuffer.length, 0);

    return Buffer.concat([
      buffer,
      headerBuffer,
      packetsBuffer,
    ]);
  }

};
