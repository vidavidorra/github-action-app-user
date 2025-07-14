import test from 'ava';
import {z} from 'zod';
import {type Options, schema} from './options.js';

const succeeds = test.macro<[keyof Options, string | undefined, string]>({
  exec(t, key, value) {
    t.notThrows(() => schema.shape[key].parse(value));
  },
  title: (_, key, _0, detail) => `succeeds parsing with ${detail} "${key}"`,
});

class ZodError extends z.ZodError {}
const fails = test.macro<[keyof Options, string | undefined, string]>({
  exec(t, key, value) {
    const error = t.throws(() => schema.shape[key].parse(value), {
      instanceOf: ZodError,
    });
    t.is(error.issues.length, 1);
  },
  title: (_, key, _0, detail) => `fails parsing with ${detail} "${key}"`,
});

const token = 'ghs_16C7e42F292c6912E7710c838347Ae178B4a';
test(fails, 'token', undefined, 'undefined');
test(fails, 'token', '', 'an empty');
test(fails, 'token', `aaaa${token.slice(4)}`, 'a non "ghs_" prefixed');
test(fails, 'token', `${token.slice(0, -1)}+`, 'an invalid character');
test(fails, 'token', token.slice(0, -1), 'a 35 character');
test(fails, 'token', `${token}a`, 'a 37 character');
test(succeeds, 'token', token, 'a 36 character "ghs_" prefixed');

test(fails, 'slug', undefined, 'undefined');
test(fails, 'slug', '', 'an empty');
test(fails, 'slug', '-a', 'a "-" prefixed');
test(fails, 'slug', 'snake_case', 'a snake_case');
test(succeeds, 'slug', 'a', 'a single character');
test(succeeds, 'slug', 'test', 'a short');
test(succeeds, 'slug', 'a'.repeat(1024 * 1024), 'a long');
test(succeeds, 'slug', 'kebab-case', 'a kebab-case');
