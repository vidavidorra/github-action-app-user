import anyTest, {type TestFn} from 'ava';
import {stub, type SinonStub} from 'sinon';
import {z} from 'zod';
import esmock from 'esmock';
import type * as AppUserModule from './app-user.js';

const test = anyTest as TestFn<{
  getOctokit: SinonStub;
  getByUsername: SinonStub;
  AppUser: typeof AppUserModule.AppUser;
}>;

const userId = 123;

test.beforeEach(async (t) => {
  const getByUsername = stub().resolves({
    status: 200,
    headers: {},
    url: '',
    data: {id: userId},
  });
  const getOctokit = stub().returns({rest: {users: {getByUsername}}});

  /* eslint-disable @typescript-eslint/naming-convention */
  const {AppUser} = await esmock<typeof AppUserModule>(
    './app-user.js',
    import.meta.url,
    {'@actions/github': {getOctokit}},
  );

  t.context = {getOctokit, getByUsername, AppUser};
  /* eslint-enable @typescript-eslint/naming-convention */
});

test('throws an error when "options" are invalid', async (t) => {
  await t.throwsAsync(
    async () => new t.context.AppUser().user({slug: '', token: ''}),
    {
      instanceOf: z.ZodError,
    },
  );
});

const options = {
  slug: 'my-app',
  token: 'ghs_16C7e42F292c6912E7710c838347Ae178B4a',
} as const;

test('returns "username" with "<slug>[bot]" format', async (t) => {
  const user = await new t.context.AppUser().user(options);
  t.is(user.username, `${options.slug}[bot]`);
});

test('returns a noreply GitHub "email" containing the user ID and name', async (t) => {
  const user = await new t.context.AppUser().user(options);
  t.is(user.email, `${userId}+${user.username}@users.noreply.github.com`);
});

test('calls "getOctokit" with "token"', async (t) => {
  await new t.context.AppUser().user(options);
  t.deepEqual(t.context.getOctokit.firstCall.args, [options.token]);
});

test('calls "users.getByUsername" with the "username"', async (t) => {
  const {username} = await new t.context.AppUser().user(options);
  t.deepEqual(t.context.getByUsername.firstCall.args, [{username}]);
});
