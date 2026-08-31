import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { appendJsonlRecord, readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';

test('appends and reads JSONL records', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mct-jsonl-'));
  const file = join(dir, 'issues.jsonl');

  try {
    await appendJsonlRecord(file, { id: 'issue-1', title: '기준금리 이슈' });
    await appendJsonlRecord(file, { id: 'issue-2', title: '연말정산 이슈' });

    assert.deepEqual(await readJsonlRecords(file), [
      { id: 'issue-1', title: '기준금리 이슈' },
      { id: 'issue-2', title: '연말정산 이슈' },
    ]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('upserts JSONL records by id without duplicating records', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mct-jsonl-'));
  const file = join(dir, 'issues.jsonl');

  try {
    await upsertJsonlRecord(file, { id: 'issue-1', title: 'old' }, 'id');
    await upsertJsonlRecord(file, { id: 'issue-1', title: 'new' }, 'id');

    assert.deepEqual(await readJsonlRecords(file), [{ id: 'issue-1', title: 'new' }]);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

