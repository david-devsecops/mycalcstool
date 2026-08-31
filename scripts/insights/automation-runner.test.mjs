import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import { readJsonlRecords } from '../../src/lib/insights/jsonl-store.mjs';
import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';

test('skips the job and logs it when automation is disabled', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'insights-runs-'));
  const logPath = join(dir, 'automation-runs.jsonl');
  let called = false;

  const result = await runAutomationJob({
    jobName: 'issue-analyzer',
    env: { AUTOMATION_ENABLED: 'false' },
    logPath,
    task: async () => {
      called = true;
      return { itemsProcessed: 1 };
    },
  });

  const records = await readJsonlRecords(logPath);
  assert.equal(called, false);
  assert.equal(result.status, 'skipped');
  assert.equal(records[0].jobName, 'issue-analyzer');
  assert.equal(records[0].status, 'skipped');
  assert.equal(records[0].errorMessage, 'automation_disabled');
});

test('logs successful job run counts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'insights-runs-'));
  const logPath = join(dir, 'automation-runs.jsonl');

  const result = await runAutomationJob({
    jobName: 'article-generator',
    logPath,
    task: async () => ({ itemsProcessed: 3, itemsFailed: 1, cost: 0.02 }),
  });

  const records = await readJsonlRecords(logPath);
  assert.equal(result.status, 'success');
  assert.equal(records[0].itemsProcessed, 3);
  assert.equal(records[0].itemsFailed, 1);
  assert.equal(records[0].cost, 0.02);
});

test('logs failed jobs and rethrows the error', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'insights-runs-'));
  const logPath = join(dir, 'automation-runs.jsonl');

  await assert.rejects(
    () =>
      runAutomationJob({
        jobName: 'source-validator',
        logPath,
        task: async () => {
          throw new Error('source timeout');
        },
      }),
    /source timeout/,
  );

  const records = await readJsonlRecords(logPath);
  assert.equal(records[0].status, 'failed');
  assert.equal(records[0].itemsFailed, 1);
  assert.equal(records[0].errorMessage, 'source timeout');
});
