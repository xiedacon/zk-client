/**
 * xiedacon created at 2019-05-31 14:20:04
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const {
  OpCode,
} = require('./constants');
const jute = require('./jute');
const Packet = require('./Packet');
const Request = require('./Request');
const Response = require('./Response');
const TransactionRequest = require('./TransactionRequest');
const TransactionResponse = require('./TransactionResponse');

module.exports = class PacketManager {
  constructor(client) {
    this.client = client;
  }

  ready() {

  }

  /**
   *
   * @param {Packet<Request, Response>} packet
   */
  recyclePacket(packet) {
    if (!packet) return;

    packet.opCode = null;
    // @ts-ignore
    packet.request && typeof packet.request.clear === 'function' && packet.request.clear(this);
    // @ts-ignore
    packet.response && typeof packet.response.clear === 'function' && packet.response.clear(this);
    packet.callback = null;
    packet.stack = '';

    // TODO: packet cache
  }

  close() {

  }

  clear() {

  }

  // Inner op packet
  get connect() {
    return new Packet(
      NaN,
      new Request(null, new jute.proto.ConnectRequest()),
      new Response(new jute.proto.ConnectResponse())
    );
  }


  get notification() {
    return new Packet(
      OpCode.notification,
      new Request(OpCode.notification),
      new Response(new jute.proto.WatcherEvent())
    );
  }

  get create() {
    return new Packet(
      OpCode.create,
      new Request(OpCode.create, new jute.proto.CreateRequest()),
      new Response(new jute.proto.CreateResponse())
    );
  }

  get delete() {
    return new Packet(
      OpCode.delete,
      new Request(OpCode.delete, new jute.proto.DeleteRequest()),
      new Response()
    );
  }

  get exists() {
    return new Packet(
      OpCode.exists,
      new Request(OpCode.exists, new jute.proto.ExistsRequest()),
      new Response(new jute.proto.ExistsResponse())
    );
  }

  get getData() {
    return new Packet(
      OpCode.getData,
      new Request(OpCode.getData, new jute.proto.GetDataRequest()),
      new Response(new jute.proto.GetDataResponse())
    );
  }

  get setData() {
    return new Packet(
      OpCode.setData,
      new Request(OpCode.setData, new jute.proto.SetDataRequest()),
      new Response(new jute.proto.SetDataResponse())
    );
  }

  get getACL() {
    return new Packet(
      OpCode.getACL,
      new Request(OpCode.getACL, new jute.proto.GetACLRequest()),
      new Response(new jute.proto.GetACLResponse())
    );
  }

  get setACL() {
    return new Packet(
      OpCode.setACL,
      new Request(OpCode.setACL, new jute.proto.SetACLRequest()),
      new Response(new jute.proto.SetACLResponse())
    );
  }

  get getChildren() {
    return new Packet(
      OpCode.getChildren,
      new Request(OpCode.getChildren, new jute.proto.GetChildrenRequest()),
      new Response(new jute.proto.GetChildrenResponse())
    );
  }

  get sync() {
    return new Packet(
      OpCode.sync,
      new Request(OpCode.sync, new jute.proto.SyncRequest()),
      new Response(new jute.proto.SyncResponse())
    );
  }

  get ping() {
    return new Packet(
      OpCode.ping,
      new Request(OpCode.ping),
      new Response()
    );
  }

  get getChildren2() {
    return new Packet(
      OpCode.getChildren2,
      new Request(OpCode.getChildren2, new jute.proto.GetChildren2Request()),
      new Response(new jute.proto.GetChildren2Response())
    );
  }

  get check() {
    return new Packet(
      OpCode.check,
      new Request(OpCode.check, new jute.proto.CheckVersionRequest()),
      new Response()
    );
  }

  get multi() {
    return new Packet(
      OpCode.multi,
      new TransactionRequest(),
      new TransactionResponse()
    );
  }

  get create2() {
    return new Packet(
      OpCode.create2,
      new Request(OpCode.create2, new jute.proto.CreateRequest()),
      new Response(new jute.proto.Create2Response())
    );
  }

  get reconfig() {
    return new Packet(
      OpCode.reconfig,
      new Request(OpCode.reconfig),
      new Response()
    );
  }

  get checkWatches() {
    return new Packet(
      OpCode.checkWatches,
      new Request(OpCode.checkWatches, new jute.proto.CheckWatchesRequest()),
      new Response()
    );
  }

  get removeWatches() {
    return new Packet(
      OpCode.removeWatches,
      new Request(OpCode.removeWatches, new jute.proto.RemoveWatchesRequest()),
      new Response()
    );
  }

  get createContainer() {
    return new Packet(
      OpCode.createContainer,
      new Request(OpCode.createContainer),
      new Response()
    );
  }

  get deleteContainer() {
    return new Packet(
      OpCode.deleteContainer,
      new Request(OpCode.deleteContainer),
      new Response()
    );
  }

  get createTTL() {
    return new Packet(
      OpCode.createTTL,
      new Request(OpCode.createTTL, new jute.proto.CreateTTLRequest()),
      new Response(new jute.proto.Create2Response())
    );
  }

  get auth() {
    return new Packet(
      OpCode.auth,
      new Request(OpCode.auth, new jute.proto.AuthPacket()),
      new Response()
    );
  }

  get setWatches() {
    return new Packet(
      OpCode.setWatces,
      new Request(OpCode.setWatces, new jute.proto.SetWatches()),
      new Response()
    );
  }

  get sasl() {
    return new Packet(
      OpCode.sasl,
      new Request(OpCode.sasl),
      new Response()
    );
  }

  get getEphemerals() {
    return new Packet(
      OpCode.getEphemerals,
      new Request(OpCode.getEphemerals, new jute.proto.GetEphemeralsRequest()),
      new Response(new jute.proto.GetEphemeralsResponse())
    );
  }

  get getAllChildrenNumber() {
    return new Packet(
      OpCode.getAllChildrenNumber,
      new Request(OpCode.getAllChildrenNumber, new jute.proto.GetAllChildrenNumberRequest()),
      new Response(new jute.proto.GetAllChildrenNumberResponse())
    );
  }

  get createSession() {
    return new Packet(
      OpCode.createSession,
      new Request(OpCode.createSession),
      new Response()
    );
  }

  get closeSession() {
    return new Packet(
      OpCode.closeSession,
      new Request(OpCode.closeSession),
      new Response()
    );
  }

  get error() {
    return new Packet(
      OpCode.error,
      new Request(OpCode.error),
      new Response(new jute.proto.ErrorResponse())
    );
  }

};
