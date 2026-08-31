import assert from 'node:assert/strict';
import test from 'node:test';

import { countPublishedOnDate, planArticlePublication } from '../../src/lib/insights/publish-queue.mjs';

const candidate = {
  id: 'article-base-rate',
  slug: 'base-rate-loan-interest-impact-next',
  status: 'publish_candidate',
  qualityScore: 92,
  language: 'ko',
};

test('keeps publish candidates queued when auto publish is disabled', () => {
  const result = planArticlePublication([candidate], {
    autoPublish: false,
    alreadyPublishedToday: 0,
    existingSlugs: [],
  });

  assert.equal(result.toPublish.length, 0);
  assert.equal(result.queued[0].status, 'review_required');
  assert.equal(result.queued[0].reason, 'auto_publish_disabled');
});

test('enforces a hard maximum of two publishes per day', () => {
  const result = planArticlePublication(
    [
      candidate,
      { ...candidate, id: 'article-tax', slug: 'tax-refund-impact' },
      { ...candidate, id: 'article-ai', slug: 'ai-api-cost-impact' },
    ],
    {
      autoPublish: true,
      alreadyPublishedToday: 0,
      existingSlugs: [],
      maxPerDay: 5,
    },
  );

  assert.equal(result.toPublish.length, 2);
  assert.equal(result.queued.length, 1);
  assert.equal(result.queued[0].reason, 'daily_publish_limit');
});

test('rejects slug collisions before publishing', () => {
  const result = planArticlePublication([candidate], {
    autoPublish: true,
    alreadyPublishedToday: 0,
    existingSlugs: ['base-rate-loan-interest-impact-next'],
  });

  assert.equal(result.toPublish.length, 0);
  assert.equal(result.rejected[0].reason, 'duplicate_slug');
});

test('counts already published articles for the same date', () => {
  const count = countPublishedOnDate(
    [
      { slug: 'today-1', status: 'published', publishedDate: '2026-08-31' },
      { slug: 'today-2', status: 'published', publishedDate: '2026-08-31' },
      { slug: 'draft-today', status: 'draft', publishedDate: '2026-08-31' },
      { slug: 'yesterday', status: 'published', publishedDate: '2026-08-30' },
    ],
    '2026-08-31',
  );

  assert.equal(count, 2);
});
