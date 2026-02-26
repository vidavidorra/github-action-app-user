import github from '@actions/github';
import anyTest, {type TestFn} from 'ava';
import {stub, type SinonStub as Stub, restore} from 'sinon';
import {type Endpoints} from '@octokit/types';
import {z} from 'zod';
import {AppUser} from './app-user.js';

const test = anyTest as TestFn<{getOctokit: Stub; getByusername: Stub}>;
const octokit = github.getOctokit('unknown');
const userId = 123;
test.beforeEach((t) => {
  t.context = {
    getOctokit: stub(github, 'getOctokit').returns(octokit),
    getByusername: stub(octokit.rest.users, 'getByUsername').resolves({
      status: 200,
      headers: {},
      url: '',
      data: {id: userId},
    } as Endpoints['GET /users/{username}']['response']),
  };
});
test.afterEach.always(() => {
  restore();
});

test.serial('throws an error when "options" are invalid', async (t) => {
  await t.throwsAsync(async () => new AppUser().user({slug: '', token: ''}), {
    instanceOf: z.ZodError,
  });
});

const options = {
  slug: 'my-app',
  token: 'ghs_16C7e42F292c6912E7710c838347Ae178B4a',
} as const;

// Test.serial('returns "username" with "<slug>[bot]" format', async (t) => {
//   const user = await new AppUser().user(options);
//   t.is(user.username, `${options.slug}[bot]`);
// });

// test.serial(
//   'returns a noreply GitHub "email" containing the user ID and name',
//   async (t) => {
//     const user = await new AppUser().user(options);
//     t.is(user.email, `${userId}+${user.username}@users.noreply.github.com`);
//   },
// );

// test.serial('calls "getOctokit" with "token"', async (t) => {
//   await new AppUser().user(options);
//   t.deepEqual(t.context.getOctokit.firstCall.args, [options.token]);
// });
//
// test.serial('calls "users.getByUsername" with the "username"', async (t) => {
//   const {username} = await new AppUser().user(options);
//   t.deepEqual(t.context.getByusername.firstCall.args, [{username}]);
// });
