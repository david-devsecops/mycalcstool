import assert from 'node:assert/strict';
import test from 'node:test';

import { retryOperation } from '../../src/lib/insights/retry.mjs';

test('retries transient failures before returning a successful result', async () => {
  let attempts = 0;
  const delays = [];

  const result = await retryOperation(
    async () => {
      attempts += 1;
      if (attempts < 3) throw new Error('temporary failure');
      return 'ok';
    },
    { delaysMs: [30, 120], delay: async (ms) => delays.push(ms) },
  );

  assert.equal(result, 'ok');
  assert.equal(attempts, 3);
  assert.deepEqual(delays, [30, 120]);
});

test('throws the final error after retry delays are exhausted', async () => {
  let attempts = 0;

  await assert.rejects(
    () =>
      retryOperation(
        async () => {
          attempts += 1;
          throw new Error(`failure-${attempts}`);
        },
        { delaysMs: [1], delay: async () => {} },
      ),
    /failure-2/,
  );

  assert.equal(attempts, 2);
});
