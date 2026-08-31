import assert from 'node:assert/strict';
import test from 'node:test';

import {
  classifyArticlePerformance,
  parseSearchConsoleCsv,
  summarizeArticleMetrics,
  summarizeImportedMetrics,
} from '../../src/lib/insights/search-console-metrics.mjs';

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

test('parses Korean Search Console CSV headers', () => {
  const rows = parseSearchConsoleCsv(`상위 페이지,클릭수,노출수,CTR,게재순위
https://mycalcstool.com/articles/base-rate-loan-interest-impact/,7,140,5%,9.4
`);

  assert.equal(rows[0].page, 'https://mycalcstool.com/articles/base-rate-loan-interest-impact/');
  assert.equal(rows[0].clicks, 7);
  assert.equal(rows[0].impressions, 140);
  assert.equal(rows[0].ctr, 0.05);
  assert.equal(rows[0].averagePosition, 9.4);
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

test('summarizes imported metrics totals and top article rows', () => {
  const summary = summarizeImportedMetrics([
    { slug: 'base-rate-loan-interest-impact', clicks: 12, impressions: 240, ctr: 0.05, averagePosition: 8.2 },
    { slug: 'openai-api-price-change-cost-planning', clicks: 3, impressions: 100, ctr: 0.03, averagePosition: 14.7 },
    { slug: 'base-rate-loan-interest-impact', clicks: 4, impressions: 60, ctr: 0.0666, averagePosition: 7.9 },
  ]);

  assert.equal(summary.totalClicks, 19);
  assert.equal(summary.totalImpressions, 400);
  assert.equal(summary.ctr, 0.0475);
  assert.equal(summary.topArticles[0].slug, 'base-rate-loan-interest-impact');
  assert.equal(summary.topArticles[0].clicks, 16);
  assert.equal(summary.topArticles[0].impressions, 300);
});

test('keeps totals based on all imported rows when top article list is limited', () => {
  const summary = summarizeImportedMetrics(
    [
      { slug: 'a', clicks: 10, impressions: 100 },
      { slug: 'b', clicks: 5, impressions: 100 },
      { slug: 'c', clicks: 1, impressions: 100 },
    ],
    { limit: 1 },
  );

  assert.equal(summary.topArticles.length, 1);
  assert.equal(summary.totalClicks, 16);
  assert.equal(summary.totalImpressions, 300);
});

test('classifies article performance from imported metrics and article age', () => {
  const classifications = classifyArticlePerformance(
    [
      { slug: 'winner', clicks: 30, impressions: 500, averagePosition: 5 },
      { slug: 'growing', clicks: 3, impressions: 80, averagePosition: 13 },
      { slug: 'underperform', clicks: 0, impressions: 200, averagePosition: 32 },
      { slug: 'normal', clicks: 1, impressions: 20, averagePosition: 18 },
    ],
    [
      { slug: 'winner', publishedDate: '2026-07-01' },
      { slug: 'growing', publishedDate: '2026-07-01' },
      { slug: 'underperform', publishedDate: '2026-07-01' },
      { slug: 'normal', publishedDate: '2026-07-01' },
      { slug: 'new-article', publishedDate: '2026-08-25' },
      { slug: 'dead', publishedDate: '2026-06-01' },
    ],
    { now: '2026-08-31T00:00:00.000Z' },
  );

  assert.equal(classifications.find((item) => item.slug === 'winner').status, 'WINNER');
  assert.equal(classifications.find((item) => item.slug === 'growing').status, 'GROWING');
  assert.equal(classifications.find((item) => item.slug === 'underperform').status, 'UNDERPERFORM');
  assert.equal(classifications.find((item) => item.slug === 'normal').status, 'NORMAL');
  assert.equal(classifications.find((item) => item.slug === 'new-article').status, 'NEW');
  assert.equal(classifications.find((item) => item.slug === 'dead').status, 'DEAD');
});
