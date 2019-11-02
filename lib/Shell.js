/**
 * xiedacon created at 2019-11-02 13:43:34
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const {
  CreateMode,
  Ids,
  ExceptionCode,
} = require('./constants');

module.exports = class Shell {
  /**
   *
   * @param {import('./client')} client an instance of node-zookeeper-client.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * touch
   *
  * @param {string} path the path for the node
   */
  async touch(path) {
    try {
      return await this.client.create(path, '', Ids.OPEN_ACL_UNSAFE, CreateMode.EPHEMERAL);
    } catch (err) {
      if (err.code !== ExceptionCode.NODE_EXISTS) throw err;
    }
  }

  /**
   * mkdir -p
   *
  * @param {string} path the path for the node
   */
  async mkdirp(path) {
    let parent = '';
    const parts = path.split(/\//g);

    for (const part of parts) {
      parent = `${parent}/${part}`;
      await this.touch(parent);
    }
  }

  /**
   * cp
   *
   * @param {string} from
   * @param {string} to
   */
  async cp(from, to) {
    const { data, stat } = await this.client.getData(from);
    const { acl } = await this.client.getACL(from);

    await this.client.create(
      to,
      data,
      acl,
      stat.ephemeralOwner.toString() === Buffer.alloc(8).toString()
        ? CreateMode.PERSISTENT
        : CreateMode.EPHEMERAL
    );
  }

  /**
   * cp -r
   *
   * @param {string} from
   * @param {string} to
   */
  async cpr(from, to) {
    await this.cp(from, to);

    for (const child of await this.ls(from)) {
      await this.cp(`${from}/${child}`, `${to}/${child}`);
    }
  }

  /**
   * mv
   *
   * @param {string} from
   * @param {string} to
   */
  async mv(from, to) {
    await this.cpr(from, to);
    await this.rmrf(from);
  }

  /**
   * ls
   *
   * @param {string} path
   */
  async ls(path) {
    try {
      const { children } = await this.client.getChildren(path);
      return children;
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;

      return [];
    }
  }

  /**
   * tree
   *
   * @param {string} path
   * @return {Promise<Array<string>>}
   */
  async tree(path) {
    const tree = [];
    for (const child of await this.ls(path)) {
      tree.push(
        child,
        ...(await this.tree(`${path}/${child}`)).map(p => `${child}/${p}`)
      );
    }

    return tree;
  }

  /**
   * cat
   *
   * @param {string} path
   */
  async cat(path) {
    try {
      const { data } = await this.client.getData(path);
      return data.toString();
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;

      return '';
    }
  }

  /**
   * rm
   *
   * @param {string} path the path for the node
   */
  async rm(path) {
    try {
      await this.client.delete(path);
    } catch (err) {
      if (err.code !== ExceptionCode.NO_NODE) throw err;
    }
  }

  /**
   * rm -rf
   *
   * @param {string} path the path for the node
   */
  async rmrf(path) {
    for (const child of await this.ls(path)) {
      await this.rmrf(`${path}/${child}`);
    }

    await this.rm(path);
  }

};
