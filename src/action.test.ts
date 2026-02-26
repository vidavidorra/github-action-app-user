import anyTest, {type TestFn} from 'ava';
import {stub, type SinonStub} from 'sinon';
import esmock from 'esmock';
import {type User} from './app-user.js';
import {type Options} from './options.js';
import type * as ActionModule from './action.js';

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
  Action: typeof ActionModule.Action;
}>;

test.beforeEach(async (t) => {
  const stubs = {
    getInput: stub().callsFake((name: string) => options[name] ?? ''),
    setOutput: stub(),
    setFailed: stub(),
    user: stub().resolves(user),
  };

  /* eslint-disable @typescript-eslint/naming-convention */
  const {Action} = await esmock<typeof ActionModule>(
    './action.js',
    import.meta.url,
    {
      '@actions/core': stubs,
      './app-user.js': {
        AppUser: class {
          user = stubs.user;
        },
      },
    },
  );

  t.context = {...stubs, Action};
  /* eslint-enable @typescript-eslint/naming-convention */
});

test('calls "AppUser.user" with "slug" and "token"', async (t) => {
  await new t.context.Action().run();
  t.is(t.context.user.callCount, 1);
  t.deepEqual(t.context.user.firstCall.args, [options]);
});

test('requires "slug" and "token"', async (t) => {
  await new t.context.Action().run();
  t.is(t.context.getInput.callCount, 2);
  t.deepEqual(t.context.getInput.args, [
    ['slug', {required: true}],
    ['token', {required: true}],
  ]);
});

test('outputs "email"', async (t) => {
  await new t.context.Action().run();
  t.is(t.context.setOutput.callCount, 2);
  t.deepEqual(t.context.setOutput.firstCall.args, ['email', user.email]);
});

test('outputs "username"', async (t) => {
  await new t.context.Action().run();
  t.is(t.context.setOutput.callCount, 2);
  t.deepEqual(t.context.setOutput.secondCall.args, ['username', user.username]);
});

test('fails when "getInput" throws', async (t) => {
  const error = new Error('getInput error');
  t.context.getInput.throws(error);
  await t.throwsAsync(async () => new t.context.Action().run(), {is: error});
  t.deepEqual(t.context.setFailed.firstCall.args, [error.message]);
});

test('fails when "AppUser.user" throws', async (t) => {
  const error = new Error('AppUser.user error');
  t.context.user.rejects(error);
  await t.throwsAsync(async () => new t.context.Action().run(), {is: error});
  t.deepEqual(t.context.setFailed.firstCall.args, [error.message]);
});

test('fails with "Unknown error" when non-Error', async (t) => {
  t.context.getInput.throws({});
  await t.throwsAsync(async () => new t.context.Action().run(), {any: true});
  t.deepEqual(t.context.setFailed.firstCall.args, ['Unknown error']);
});
