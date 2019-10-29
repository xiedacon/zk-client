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
  /**
   * Add a create operation with given path, data, acls and mode.
   *
   * @param {string} path The znode path.
   * @param {string|Buffer=} [data] The data buffer.
   * @param {Array<Jute.data.ACL>=} acl An array of ACL object.
   * @param {number=} flags The creation mode.
   */
  create(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number): this;
  /**
   * Add a check (existence) operation with given path and optional version.
   *
   * @param {string} path The znode path.
   * @param {number=} version The version of the znode.
   */
  check(path: string, version?: number): this;
  /**
   * Add a set-data operation with the given path, data and optional version.
   *
   * @param {string} path The znode path.
   * @param {string|Buffer=} data The data buffer.
   * @param {number=} version The version of the znode.
   */
  setData(path: string, data?: string | Buffer, version?: number): this;
  /**
   * Add a delete operation with the given path and optional version.
   *
   * @param {string} path The znode path.
   * @param {number=} version The version of the znode.
   */
  remove(path: string, version?: number): this;
  /**
   * Execute the transaction atomically.
   */
  commit(): Promise<{ header: { type: number; done: boolea; err: number; }, payload: object }>;
}

export class Client {
  constructor(connectionString: string, options?: Options);
  /**
   * The session id for this ZooKeeper client instance. The value returned is
   * not valid until the client connects to a server and may change after a
   * re-connect.
   */
  get getSessionId(): Buffer;
  /**
   * The session password for this ZooKeeper client instance. The value
   * returned is not valid until the client connects to a server and may
   * change after a re-connect.
   */
  get getSessionPassword(): Buffer;
  /**
   * The negotiated session timeout for this ZooKeeper client instance. The
   * value returned is not valid until the client connects to a server and
   * may change after a re-connect.
   */
  get getSessionTimeout(): number;
  /**
   * Start the client and try to connect to the ensemble.
   */
  connect(): Promise<void>;
  /**
   * Close this client object. Once the client is closed, its session becomes
   * invalid. All the ephemeral nodes in the ZooKeeper server associated with
   * the session will be removed. The watches left on those nodes (and on
   * their parents) will be triggered.
   */
  close(): Promise<void>;
  /**
   * Create a node with the given path. The node data will be the given data,
   * and node acl will be the given acl.
   *
   * The flags argument specifies whether the created node will be ephemeral
   * or not.
   *
   * An ephemeral node will be removed by the ZooKeeper automatically when the
   * session associated with the creation of the node expires.
   *
   * The flags argument can also specify to create a sequential node. The
   * actual path name of a sequential node will be the given path plus a
   * suffix "i" where i is the current sequential number of the node. The sequence
   * number is always fixed length of 10 digits, 0 padded. Once
   * such a node is created, the sequential number will be incremented by one.
   *
   * If a node with the same actual path already exists in the ZooKeeper, a
   * KeeperException with error code KeeperException.NodeExists will be
   * thrown. Note that since a different actual path is used for each
   * invocation of creating sequential node with the same path argument, the
   * call will never throw "file exists" KeeperException.
   *
   * If the parent node does not exist in the ZooKeeper, a KeeperException
   * with error code KeeperException.NoNode will be thrown.
   *
   * An ephemeral node cannot have children. If the parent node of the given
   * path is ephemeral, a KeeperException with error code
   * KeeperException.NoChildrenForEphemerals will be thrown.
   *
   * This operation, if successful, will trigger all the watches left on the
   * node of the given path by exists and getData API calls, and the watches
   * left on the parent node by getChildren API calls.
   *
   * If a node is created successfully, the ZooKeeper server will trigger the
   * watches on the path left by exists calls, and the watches on the parent
   * of the node by getChildren calls.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperExecption to be thrown.
   *
   * @param {string} path the path for the node
   * @param {string|Buffer=} data the initial data for the node
   * @param {Array<Jute.data.ACL>=} acl the acl for the node
   * @param {number=} flags specifying whether the node to be created is ephemeral and/or sequential
   */
  create(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number): Promise<{ path: string }>;
  /**
   * Create a node with the given path and returns the Stat of that node. The
   * node data will be the given data and node acl will be the given acl.
   *
   * The flags argument specifies whether the created node will be ephemeral
   * or not.
   *
   * An ephemeral node will be removed by the ZooKeeper automatically when the
   * session associated with the creation of the node expires.
   *
   * The flags argument can also specify to create a sequential node. The
   * actual path name of a sequential node will be the given path plus a
   * suffix "i" where i is the current sequential number of the node. The sequence
   * number is always fixed length of 10 digits, 0 padded. Once
   * such a node is created, the sequential number will be incremented by one.
   *
   * If a node with the same actual path already exists in the ZooKeeper, a
   * KeeperException with error code KeeperException.NodeExists will be
   * thrown. Note that since a different actual path is used for each
   * invocation of creating sequential node with the same path argument, the
   * call will never throw "file exists" KeeperException.
   *
   * If the parent node does not exist in the ZooKeeper, a KeeperException
   * with error code KeeperException.NoNode will be thrown.
   *
   * An ephemeral node cannot have children. If the parent node of the given
   * path is ephemeral, a KeeperException with error code
   * KeeperException.NoChildrenForEphemerals will be thrown.
   *
   * This operation, if successful, will trigger all the watches left on the
   * node of the given path by exists and getData API calls, and the watches
   * left on the parent node by getChildren API calls.
   *
   * If a node is created successfully, the ZooKeeper server will trigger the
   * watches on the path left by exists calls, and the watches on the parent
   * of the node by getChildren calls.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperExecption to be thrown.
   *
   * @param {string} path the path for the node
   * @param {string|Buffer=} data the initial data for the node
   * @param {Array<Jute.data.ACL>=} acl the acl for the node
   * @param {number=} flags specifying whether the node to be created is ephemeral and/or sequential
   * @param {Buffer=} ttl specifying a TTL when mode is CreateMode.PERSISTENT_WITH_TTL or CreateMode.PERSISTENT_SEQUENTIAL_WITH_TTL
   */
  create2(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number, ttl?: Buffer): Promise<{ path: string; stat: Stat }>;
  /**
   * Delete the node with the given path. The call will succeed if such a node
   * exists, and the given version matches the node's version (if the given
   * version is -1, it matches any node's versions).
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if the nodes does not exist.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given version does not match the node's version.
   *
   * A KeeperException with error code KeeperException.NotEmpty will be thrown
   * if the node has children.
   *
   * This operation, if successful, will trigger all the watches on the node
   * of the given path left by exists API calls, and the watches on the parent
   * node left by getChildren API calls.
   *
   * @param {string} path the path of the node to be deleted
   * @param {number=} version the expected node version
   */
  delete(path: string, version?: number): Promise<void>;
  /**
   * Set the data for the node of the given path if such a node exists and the
   * given version matches the version of the node (if the given version is
   * -1, it matches any node's versions). Return the stat of the node.
   *
   * This operation, if successful, will trigger all the watches on the node
   * of the given path left by getData calls.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given version does not match the node's version.
   *
   * The maximum allowable size of the data array is 1 MB (1,048,576 bytes).
   * Arrays larger than this will cause a KeeperException to be thrown.
   *
   * @param {string} path the path of the node
   * @param {string|Buffer} data the data to set
   * @param {number=} version the expected matching version
   */
  setData(path: string, data?: string | Buffer, version?: number): Promise<{ stat: Stat }>;
  /**
   *
   * Return the data and the stat of the node of the given path.
   *
   * If the watch is non-null and the call is successful (no exception is
   * thrown), a watch will be left on the node with the given path. The watch
   * will be triggered by a successful operation that sets data on the node, or
   * deletes the node.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param {string} path the node path
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher explicit watcher
   */
  getData(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ data: Buffer, stat: Stat }>;
  /**
   * Set the ACL for the node of the given path if such a node exists and the
   * given aclVersion matches the acl version of the node. Return the stat of the
   * node.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * A KeeperException with error code KeeperException.BadVersion will be
   * thrown if the given aclVersion does not match the node's aclVersion.
   *
   * @param {string} path the given path for the node
   * @param {Array<Jute.data.ACL>} acl the given acl for the node
   * @param {number=} version the given acl version of the node
   */
  setACL(path: string, acl: Array<ACL>, version?: number): Promise<{ stat: Stat }>;
  /**
   * Retrieve the ACL list and the stat of the node of the given path.
   *
   * @param {string} path The node path.
   */
  getACL(path: string): Promise<{ acl: Array<ACL>; stat: Stat }>;
  /**
   * Return the stat of the node of the given path. Return null if no such a
   * node exists.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that creates/delete the node or sets
   * the data on the node.
   *
   * @param {string} path the node path
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher explicit watcher
   */
  exists(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ stat: Stat }>;
  /**
   * Return the list of the children of the node of the given path.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that deletes the node of the given
   * path or creates/delete a child under the node.
   *
   * The list of children returned is not sorted and no guarantee is provided
   * as to its natural or lexical order.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param {string} path the node path
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher explicit watcher
   */
  getChildren(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ children: Array<string> }>;
  /**
   * For the given znode path return the stat and children list.
   *
   * If the watch is non-null and the call is successful (no exception is thrown),
   * a watch will be left on the node with the given path. The watch will be
   * triggered by a successful operation that deletes the node of the given
   * path or creates/delete a child under the node.
   *
   * The list of children returned is not sorted and no guarantee is provided
   * as to its natural or lexical order.
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if no node with the given path exists.
   *
   * @param {string} path the node path
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher explicit watcher
   */
  getChildren2(path: string, watcher?: (event: { type: number, state: number, path: string }) => any): Promise<{ children: Array<string>, stat: Stat }>;
  /**
   * Gets all numbers of children nodes under a specific path
   *
   * @param {string} path
   */
  getAllChildrenNumber(path: string): Promise<{ totalNumber: number }>;
  /**
   * Gets all the ephemeral nodes matching prefixPath
   * created by this session.  If prefixPath is "/" then it returns all
   * ephemerals
   *
   * @param {string} prefixPath
   */
  getEphemerals(prefixPath?: string): Promise<{ ephemerals: Array<string> }>;
  /**
   * Flushes channel between process and leader.
   *
   * @param {string} path
   */
  sync(path: string): Promise<{ path: string }>;
  /**
   * A Transaction is a thin wrapper on the multi method
   * which provides a builder object that can be used to construct
   * and commit an atomic set of operations.
   */
  transaction(): Transaction;
  getChildWatches(): Array<string>;
  getDataWatches(): Array<string>;
  getExistWatches(): Array<string>;
  /**
   * For the given znode path, removes the specified watcher of given
   * watcherType.
   *
   * Watcher shouldn't be null. A successful call guarantees that, the
   * removed watcher won't be triggered.
   *
   * @param {string} path the path of the node
   * @param {(event: { type: number, state: number, path: string }) => any} watcher explicit watcher
   * @param {number} type the type of watcher to be removed
   */
  removeWatches(path: string, watcher: (event: { type: number, state: number, path: string }) => any, type: number): Promise<void>;
  /**
   * For the given znode path, removes all the registered watchers of given
   * watcherType.
   *
   * A successful call guarantees that, the removed watchers won't be
   * triggered.
   *
   * @param {string} path the path of the node
   * @param {number} type the type of watcher to be removed
   */
  removeAllWatches(path: string, type: number): Promise<void>;
  /**
   * Return the last committed configuration (as known to the server to which the client is connected)
   * and the stat of the configuration.
   *
   * If the watch is non-null and the call is successful (no exception is
   * thrown), a watch will be left on the configuration node (ZooDefs.CONFIG_NODE). The watch
   * will be triggered by a successful reconfig operation
   *
   * A KeeperException with error code KeeperException.NoNode will be thrown
   * if the configuration node doesn't exists.
   *
   * @param {(event: { type: number, state: number, path: string }) => any=} watcher explicit watcher
   */
  getConfig(wathcer?: (event: { type: number, state: number, path: string }) => any): Promise<{ data: Buffer; stat: Stat }>;
  /**
   * mkdir -p
   */
  mkdirp(path: string, data?: string | Buffer, acl?: Array<ACL>, flags?: number): Promise<void>;
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
