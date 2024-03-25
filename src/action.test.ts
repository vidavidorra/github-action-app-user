import anyTest, {type TestFn} from 'ava';
import {stub, type SinonStub, restore} from 'sinon';
import core from '@actions/core';
import {Action} from './action.js';
import {AppUser, type User} from './app-user.js';
import {type Options} from './options.js';

const options: Record<string, string> = {
  slug: 'my-app',
  token: 'ghs_16C7e42F292c6912E7710c838347Ae178B4a',
} as const satisfies Options;
const user: User = {email: 'test@example.com', username: 'test'} as const;
const test = anyTest as TestFn<{
  getInput: SinonStub;
  setOutput: SinonStub;
  setFailed: SinonStub;
  user: SinonStub;
}>;
test.beforeEach((t) => {
  t.context = {
    getInput: stub(core, 'getInput').callsFake((name) => options[name] ?? ''),
    setOutput: stub(core, 'setOutput'),
    setFailed: stub(core, 'setFailed'),
    user: stub(AppUser.prototype, 'user').resolves(user),
  };
});
test.afterEach.always(() => {
  restore();
});

test.serial('calls "AppUser.user" with "slug" and "token"', async (t) => {
  await new Action().run();
  t.is(t.context.user.callCount, 1);
  t.deepEqual(t.context.user.firstCall.args, [options]);
});

test.serial('requires "slug" and "token"', async (t) => {
  await new Action().run();
  t.is(t.context.getInput.callCount, 2);
  t.deepEqual(t.context.getInput.args, [
    ['slug', {required: true}],
    ['token', {required: true}],
  ]);
});

test.serial('outputs "email"', async (t) => {
  await new Action().run();
  t.is(t.context.setOutput.callCount, 2);
  t.deepEqual(t.context.setOutput.firstCall.args, ['email', user.email]);
});

test.serial('outputs "username"', async (t) => {
  await new Action().run();
  t.is(t.context.setOutput.callCount, 2);
  t.deepEqual(t.context.setOutput.secondCall.args, ['username', user.username]);
});

test.serial('fails when "getInput" throws', async (t) => {
  const error = new Error('getInput error');
  t.context.getInput.throws(error);
  await t.throwsAsync(async () => new Action().run(), {is: error});
  t.deepEqual(t.context.setFailed.firstCall.args, [error.message]);
});

test.serial('fails when "AppUser.user" throws', async (t) => {
  const error = new Error('AppUser.user error');
  t.context.user.rejects(error);
  await t.throwsAsync(async () => new Action().run(), {is: error});
  t.deepEqual(t.context.setFailed.firstCall.args, [error.message]);
});

test.serial('fails with "Unknown error" when non-Error', async (t) => {
  t.context.getInput.throws({});
  await t.throwsAsync(async () => new Action().run(), {any: true});
  t.deepEqual(t.context.setFailed.firstCall.args, ['Unknown error']);
});
