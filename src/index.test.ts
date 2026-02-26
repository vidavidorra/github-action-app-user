import test from 'ava';
import {stub} from 'sinon';
import esmock from 'esmock';

test('calls "action" when imported', async (t) => {
  const run = stub().resolves();

  /* eslint-disable @typescript-eslint/naming-convention */
  await esmock('./index.js', import.meta.url, {
    './action.js': {
      Action: class {
        run = run;
      },
    },
  });
  /* eslint-enable @typescript-eslint/naming-convention */

  t.is(run.callCount, 1);
});
