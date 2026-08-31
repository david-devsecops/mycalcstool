import assert from 'node:assert/strict';
import test from 'node:test';

import { buildPublishPlanRecords } from '../../src/lib/insights/publish-plan-builder.mjs';

test('builds auditable publish plan records from queue decisions', () => {
  const records = buildPublishPlanRecords(
    {
      toPublish: [{ id: 'article-1', slug: 'base-rate-next', status: 'scheduled', reason: 'ready_to_publish' }],
      queued: [{ id: 'article-2', slug: 'tax-next', status: 'review_required', reason: 'auto_publish_disabled' }],
      rejected: [{ id: 'article-3', slug: 'ai-next', status: 'rejected', reason: 'duplicate_slug' }],
    },
    '2026-08-31T09:00:00.000Z',
  );

  assert.deepEqual(records.map((record) => record.queue), ['toPublish', 'queued', 'rejected']);
  assert.equal(records[0].plannedAt, '2026-08-31T09:00:00.000Z');
  assert.equal(records[1].reason, 'auto_publish_disabled');
  assert.equal(records[2].status, 'rejected');
});
