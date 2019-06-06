/**
 * xiedacon created at 2019-06-02 21:15:28
 *
 * Copyright (c) 2019 Souche.com, all rights reserved.
 */
'use strict';

const util = require('util');
const path = require('path');

exports.noop = function() {};

/**
 * @param {string} connectionString
 */
exports.parseConnectionString = connectionString => {
  let chrootPath = '';

  let index;
  if ((index = connectionString.indexOf('/')) > 0) {
    chrootPath = exports.normalizePath(connectionString.slice(index));
    chrootPath = chrootPath === '/' ? '' : chrootPath;

    connectionString = connectionString.slice(0, index);
  }

  const servers = [];
  for (const str of connectionString.split(',')) {
    const parts = str.split(':');

    servers.push({ host: parts[0], port: Number(parts[1]) || 2181 }); // Default Zookeeper client port.
  }

  return { chrootPath, servers };
};

/**
 * @param {string} _path The path of a node.
 */
exports.normalizePath = _path => {
  return path.normalize('/' + _path);
};

/**
 * @param {Error} err
 */
exports.formatError = err => {
  const name = err.name;
  const message = err.message;
  const stack = err.stack || 'no_stack';
  const props = Object.keys(err).map(key => `${key}: ${util.inspect(err[key])}`).join('\n  ');

  return `${name}: ${message}\n${stack.slice(stack.indexOf('\n') + 1)}\n  ${props}`;
};

/**
 * @param {Error} err
 * @param {string} friendlyStack
 * @param {string} filterPath
 */
exports.optimizeErrorStack = (err, friendlyStack, filterPath) => {
  const stacks = friendlyStack.split('\n').slice(1);
  err.stack = err.stack
    .split('\n')
    .slice(0, 1)
    .concat(
      stacks
        .slice(stacks.findIndex(s => s.indexOf(filterPath) < 0))
        .join('\n')
    )
    .join('\n');
};
