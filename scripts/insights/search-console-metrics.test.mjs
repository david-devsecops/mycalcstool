import assert from 'node:assert/strict';
import test from 'node:test';

import { parseSearchConsoleCsv, summarizeArticleMetrics } from '../../src/lib/insights/search-console-metrics.mjs';

const csv = `Top pages,Clicks,Impressions,CTR,Position
https://mycalcstool.com/articles/base-rate-loan-interest-impact/,12,240,5%,8.2
https://mycalcstool.com/loan/,30,500,6%,5.1
https://mycalcstool.com/articles/openai-api-price-change-cost-planning/,3,100,3%,14.7
`;

test('parses Search Console CSV exports into numeric metrics', () => {
  const rows = parseSearchConsoleCsv(csv);

  assert.equal(rows[0].page, 'https://mycalcstool.com/articles/base-rate-loan-interest-impact/');
  assert.equal(rows[0].clicks, 12);
  assert.equal(rows[0].impressions, 240);
  assert.equal(rows[0].ctr, 0.05);
  assert.equal(rows[0].averagePosition, 8.2);
});

test('summarizes only article page metrics by slug', () => {
  const summary = summarizeArticleMetrics(parseSearchConsoleCsv(csv));

  assert.deepEqual(summary.map((item) => item.slug), [
    'base-rate-loan-interest-impact',
    'openai-api-price-change-cost-planning',
  ]);
  assert.equal(summary[0].clicks, 12);
  assert.equal(summary[1].impressions, 100);
});
