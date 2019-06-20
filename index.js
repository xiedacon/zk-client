/**
 * xiedacon created at 2019-06-03 14:49:05
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const {
  CreateMode,
  OpCode,
  Perms,
  Xid,
  WatcherType,
  EventType,
  EventState,
  ExceptionCode,
  ConnectionEvent,
  Ids,
} = require('./lib/constants');
const Client = require('./lib/Client');

exports.Client = Client;
/**
 *
 * @param {string} connectionString
 * @param {import('./lib/Client').Options=} options
 */
exports.createClient = (connectionString, options) => new Client(connectionString, options);
exports.CreateMode = CreateMode;
exports.OpCode = OpCode;
exports.Perms = Perms;
exports.Xid = Xid;
exports.WatcherType = WatcherType;
exports.EventType = EventType;
exports.EventState = EventState;
exports.ExceptionCode = ExceptionCode;
exports.ConnectionEvent = ConnectionEvent;
exports.Ids = Ids;
