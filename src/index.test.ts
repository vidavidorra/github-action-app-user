import test from 'ava';
import {stub} from 'sinon';
import {Action} from './action.js';

const action = stub(Action.prototype, 'run').resolves();

test('calls "action" when imported', async (t) => {
  await import('./index.js');
  t.is(action.callCount, 1);
});
