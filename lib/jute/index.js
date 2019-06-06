/**
* This file created by ./bin/gen_types
* Do not modify this file!!!!!!!!!
 */
'use strict';

exports.basic = {
  type: require('./basic/type'),
  object: require('./basic/object'),
  RequestRecord: require('./basic/RequestRecord'),
  ResponseRecord: require('./basic/ResponseRecord'),
};

exports.boolean = require('./boolean');
exports.buffer = require('./buffer');
exports.int = require('./int');
exports.long = require('./long');
exports.ustring = require('./ustring');
exports.vector = require('./vector');

exports.data = {
  Id: require('./data/Id'),
  ACL: require('./data/ACL'),
  Stat: require('./data/Stat'),
  StatPersisted: require('./data/StatPersisted'),
};

exports.proto = {
  ConnectRequest: require('./proto/ConnectRequest'),
  ConnectResponse: require('./proto/ConnectResponse'),
  SetWatches: require('./proto/SetWatches'),
  RequestHeader: require('./proto/RequestHeader'),
  MultiHeader: require('./proto/MultiHeader'),
  AuthPacket: require('./proto/AuthPacket'),
  ReplyHeader: require('./proto/ReplyHeader'),
  GetDataRequest: require('./proto/GetDataRequest'),
  SetDataRequest: require('./proto/SetDataRequest'),
  ReconfigRequest: require('./proto/ReconfigRequest'),
  SetDataResponse: require('./proto/SetDataResponse'),
  GetSASLRequest: require('./proto/GetSASLRequest'),
  SetSASLRequest: require('./proto/SetSASLRequest'),
  SetSASLResponse: require('./proto/SetSASLResponse'),
  CreateRequest: require('./proto/CreateRequest'),
  CreateTTLRequest: require('./proto/CreateTTLRequest'),
  DeleteRequest: require('./proto/DeleteRequest'),
  GetChildrenRequest: require('./proto/GetChildrenRequest'),
  GetAllChildrenNumberRequest: require('./proto/GetAllChildrenNumberRequest'),
  GetChildren2Request: require('./proto/GetChildren2Request'),
  CheckVersionRequest: require('./proto/CheckVersionRequest'),
  GetMaxChildrenRequest: require('./proto/GetMaxChildrenRequest'),
  GetMaxChildrenResponse: require('./proto/GetMaxChildrenResponse'),
  SetMaxChildrenRequest: require('./proto/SetMaxChildrenRequest'),
  SyncRequest: require('./proto/SyncRequest'),
  SyncResponse: require('./proto/SyncResponse'),
  GetACLRequest: require('./proto/GetACLRequest'),
  SetACLRequest: require('./proto/SetACLRequest'),
  SetACLResponse: require('./proto/SetACLResponse'),
  WatcherEvent: require('./proto/WatcherEvent'),
  ErrorResponse: require('./proto/ErrorResponse'),
  CreateResponse: require('./proto/CreateResponse'),
  Create2Response: require('./proto/Create2Response'),
  ExistsRequest: require('./proto/ExistsRequest'),
  ExistsResponse: require('./proto/ExistsResponse'),
  GetDataResponse: require('./proto/GetDataResponse'),
  GetChildrenResponse: require('./proto/GetChildrenResponse'),
  GetAllChildrenNumberResponse: require('./proto/GetAllChildrenNumberResponse'),
  GetChildren2Response: require('./proto/GetChildren2Response'),
  GetACLResponse: require('./proto/GetACLResponse'),
  CheckWatchesRequest: require('./proto/CheckWatchesRequest'),
  RemoveWatchesRequest: require('./proto/RemoveWatchesRequest'),
  GetEphemeralsRequest: require('./proto/GetEphemeralsRequest'),
  GetEphemeralsResponse: require('./proto/GetEphemeralsResponse'),
};
