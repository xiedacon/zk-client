/**
 * xiedacon created at 2019-06-02 21:15:28
 *
 * Copyright (c) 2019 xiedacon, all rights reserved.
 */

import * as util from 'util';
import * as path from 'path';

import Exception from '../Exception';

export function noop() {}

export function parseConnectionString(connectionString: string) {
  let chrootPath = '';

  const servers = [] as Array<{ host: string; port: number }>;
  for (let str of connectionString.split(',')) {
    let index: number;
    if ((index = str.indexOf('/')) > 0) {
      let itemChrootPath = exports.normalizePath(str.slice(index));
      itemChrootPath = itemChrootPath === '/' ? '' : itemChrootPath;

      if (chrootPath && chrootPath !== itemChrootPath) throw new Exception.Params('all connections must use the same chrootPath');

      chrootPath = itemChrootPath;
      str = str.slice(0, index);
    }

    const parts = str.split(':');

    servers.push({ host: parts[0], port: Number(parts[1]) || 2181 }); // Default Zookeeper client port.
  }

  return { chrootPath, servers };
}

export function normalizePath(_path: string) {
  return path.normalize(`/${_path}`);
}

export function formatError(err: Error) {
  const name = err.name;
  const message = err.message;
  const stack = err.stack || 'no_stack';
  const props = Object.keys(err).map(key => `${key}: ${util.inspect(err[key])}`).join('\n  ');

  return `${name}: ${message}\n${stack.slice(stack.indexOf('\n') + 1)}\n  ${props}`;
}

export function optimizeErrorStack(err: Error, friendlyStack: string, filterPath: string) {
  const stacks = friendlyStack.split('\n').slice(1);
  err.stack = (err.stack || 'no_stack')
    .split('\n')
    .slice(0, 1)
    .concat(
      stacks
        .slice(stacks.findIndex(s => s.indexOf(filterPath) < 0))
        .join('\n')
    )
    .join('\n');
}
