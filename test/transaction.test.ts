/**
 * xiedacon created at 2020-01-15 09:39:52
 *
 * Copyright (c) 2020 xiedacon, all rights reserved.
 */

import test from 'ava';

import { createClient } from '../index';

const connectionString = '127.0.0.1:2181,127.0.0.1:2182,127.0.0.1:2183';

test.beforeEach(async () => {
  const client = createClient(connectionString);
  await client.connect();

  await client.shell.rmrf('/sdktest');

  await client.close();
});

test.serial('it should work', async t => {
  const client = createClient(connectionString);
  await client.connect();

  await client.transaction()
    .create('/sdktest')
    .check('/sdktest')
    .setData('/sdktest', 'test')
    .create('/sdktest/1')
    .commit();

  t.deepEqual(
    (await client.getData('/sdktest')).data.toString('utf-8'),
    'test'
  );

  t.deepEqual(
    await client.getChildren('/sdktest'),
    { children: [ '1' ] }
  );

  await client.transaction()
    .remove('/sdktest/1')
    .remove('/sdktest')
    .commit();

  t.falsy(await client.exists('/sdktest'));

  await client.close();

  t.pass();
});

test.serial('it should work with chrootPath', async t => {
  const client1 = createClient(connectionString);
  await client1.connect();
  await client1.create('/sdktest');

  const client2 = createClient(connectionString.split(',').map(s => `${s}/sdktest`).join(','));
  await client2.connect();

  await client2.transaction()
    .create('/1')
    .check('/1')
    .setData('/1', 'test')
    .create('/1/1')
    .commit();

  t.deepEqual(
    (await client2.getData('/1')).data.toString('utf-8'),
    'test'
  );

  t.deepEqual(
    await client2.getChildren('/1'),
    { children: [ '1' ] }
  );

  await client2.transaction()
    .remove('/1/1')
    .remove('/1')
    .commit();

  t.falsy(await client2.exists('/1'));

  await client2.close();

  await client1.delete('/sdktest');
  await client1.close();

  t.pass();
});
