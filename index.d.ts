/**
 * xiedacon created at 2019-08-26 14:07:07
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */

type Id = {
  scheme: string;
  id: string;
}

type ACL = {
  perms: number;
  id: Id;
}

type Stat = {
  czxid: Buffer;
  mzxid: Buffer;
  ctime: Buffer;
  mtime: Buffer;
  version: number;
  cversion: number;
  aversion: number;
  ephemeralOwner: Buffer;
  dataLength: number;
  numChildren: number;
  pzxid: Buffer;
}

export interface Logger {
  error: Function;
  info: Function;
  warn: Function;
  debug: Function;
}

export interface Transaction {
  create(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number): this;
  check(path: string, version?: number): this;
  setData(path: string, data?: string | Buffer, version?: number): this;
  remove(path: string, version?: number): this;
  commit(): Promise<{ header: { type: number; done: boolea; err: number; }, payload: object }>;
}

export class Client {
  constructor(connectionString: string, options?: Options);
  ready(): Promise<void>;
  get getSessionId(): Buffer;
  get getSessionPassword(): Buffer;
  get getSessionTimeout(): number;
  connect(): Promise<void>;
  close(): Promise<void>;
  create(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number): Promise<{ path: string }>;
  create2(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number, ttl?: Buffer): Promise<{ path: string; stat: Stat }>;
  delete(path: string, version?: number): Promise<void>;
  setData(path: string, data?: string | Buffer, version?: number): Promise<{ stat: Stat }>;
  getData(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ data: Buffer, stat: Stat }>;
  setACL(path: string, acl: Array<ACL>, version?: number): Promise<{ stat: Stat }>;
  getACL(path: string): Promise<{ acl: Array<ACL>; stat: Stat }>;
  exists(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ stat: Stat }>;
  getChildren(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ children: Array<string> }>;
  getChildren2(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ children: Array<string>, stat: Stat }>;
  getAllChildrenNumber(path: string): Promise<{ totalNumber: number }>;
  getEphemerals(prefixPath?: string): Promise<{ ephemerals: Array<string> }>;
  sync(path: string): Promise<{ path: string }>;
  transaction(): Transaction;
  getChildWatches(): Array<string>;
  getDataWatches(): Array<string>;
  getExistWatches(): Array<string>;
  removeWatches(path: string, watcher: (event: { type: number, state: number, path: string }) => any, type: number): Promise<void>;
  removeAllWatches(path: string, type: number): Promise<void>;
  getConfig(wathcer?: (event: { type: number, state: number, path: string }) => any): Promise<{ data: Buffer; stat: Stat }>
}

export type Options = {
  /**
   * scheme:auth information
   */
  authInfo?: Array<{ scheme: string, auth: string | Buffer }>;
  configNode?: string;
  /**
   * socket connect timeout
   */
  connectTimeout?: number;
  /**
   * Time to wait after try all server failed
   */
  reconnectInterval?: number;
  /**
   * Times to retry send packet to server
   */
  retries?: number;
  /**
   * Time to wait before retry send
   */
  retryInterval?: number;
  /**
   * Show friendly error stack
   */
  showFriendlyErrorStack?: boolean;
  logger?: Logger;
  PacketManager?: number;
  WatcherManager?: number;
}

export function createClient(connectionString: string | Array<string>, options?: Options): Client
export const CreateMode = {
  PERSISTENT: 0,
  PERSISTENT_SEQUENTIAL: 2,
  EPHEMERAL: 1,
  EPHEMERAL_SEQUENTIAL: 3,
  CONTAINER: 4,
  PERSISTENT_WITH_TTL: 5,
  PERSISTENT_SEQUENTIAL_WITH_TTL: 6,
}

export const OpCode = {
  notification: 0,
  create: 1,
  delete: 2,
  exists: 3,
  getData: 4,
  setData: 5,
  getACL: 6,
  setACL: 7,
  getChildren: 8,
  sync: 9,
  ping: 11,
  getChildren2: 12,
  check: 13,
  multi: 14,
  create2: 15,
  reconfig: 16,
  checkWatches: 17,
  removeWatches: 18,
  createContainer: 19,
  deleteContainer: 20,
  createTTL: 21,
  auth: 100,
  setWatces: 101,
  sasl: 102,
  getEphemerals: 103,
  getAllChildrenNumber: 104,
  createSession: -10,
  closeSession: -11,
  error: -1,
}

export const Perms = {
  READ: 1,
  WRITE: 2,
  CREATE: 4,
  DELETE: 8,
  ADMIN: 16,
  ALL: 31,
}

export const Xid = {
  notification: -1,
  ping: -2,
  authentication: -4,
  setWatches: -8,
}

export const WatcherType = {
  Children: 1,
  Data: 2,
  Any: 3,
}

export const EventType = {
  None: -1,
  NodeCreated: 1,
  NodeDeleted: 2,
  NodeDataChanged: 3,
  NodeChildrenChanged: 4,
  DataWatchRemoved: 5,
  ChildWatchRemoved: 6,
}

export const EventState = {
  Unknown: -1,
  Disconnected: 0,
  NoSyncConnected: 1,
  SyncConnected: 3,
  AuthFailed: 4,
  ConnectedReadOnly: 5,
  SaslAuthenticated: 6,
  Expired: -122,
  Closed: 7,
}

export const ExceptionCode = {
  OK: 0,
  SYSTEM_ERROR: -1,
  RUNTIME_INCONSISTENCY: -2,
  DATA_INCONSISTENCY: -3,
  CONNECTION_LOSS: -4,
  MARSHALLING_ERROR: -5,
  UNIMPLEMENTED: -6,
  OPERATION_TIMEOUT: -7,
  BAD_ARGUMENTS: -8,
  UNKNOWN_SESSION: -12,
  NEW_CONFIG_NO_QUORUM: -13,
  RECONFIG_IN_PROGRESS: -14,
  API_ERROR: -100,
  NO_NODE: -101,
  NO_AUTH: -102,
  BAD_VERSION: -103,
  NO_CHILDREN_FOR_EPHEMERALS: -108,
  NODE_EXISTS: -110,
  NOT_EMPTY: -111,
  SESSION_EXPIRED: -112,
  INVALID_CALLBACK: -113,
  INVALID_ACL: -114,
  AUTH_FAILED: -115,
  SESSION_MOVED: -118,
  NOT_READONLY: -119,
  EPHEMERAL_ON_LOCAL_SESSION: -120,
  NOWATCHER: -121,
  REQUEST_TIMEOUT: -122,
  RECONFIG_DISABLED: -123,
}

export const ConnectionEvent = {
  connecting: 'connecting',
  reconnecting: 'reconnecting',
  connect: 'connect',
  disconnect: 'disconnect',
  closing: 'closing',
  closed: 'closed',
  error: 'error',

  serverAvailable: 'serverAvailable',
  serverUnavailable: 'serverUnavailable',
}

export const Ids = {
  ANYONE_ID_UNSAFE: Id,
  AUTH_IDS: Id,
  OPEN_ACL_UNSAFE: ACL,
  CREATOR_ALL_ACL: ACL,
  READ_ACL_UNSAFE: ACL
}
