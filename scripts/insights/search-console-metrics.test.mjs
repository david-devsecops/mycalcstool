import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildContentMetricRecordId,
  classifyArticlePerformance,
  parseGa4ArticleInteractionCsv,
  parseGa4CalculatorClickCsv,
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

test('parses GA4 article calculator click CSV exports', () => {
  const rows = parseGa4CalculatorClickCsv(`Page path and screen class,Event name,Event label,Event count
/articles/base-rate-loan-interest-impact/,article_calculator_click,loan,9
/articles/openai-api-price-change-cost-planning/,article_calculator_click,chatgpt-api-cost-calculator,4
/loan/,article_calculator_click,loan,20
/articles/base-rate-loan-interest-impact/,page_view,loan,99
`);

  assert.deepEqual(rows, [
    {
      slug: 'base-rate-loan-interest-impact',
      calculatorId: 'loan',
      calculatorClicks: 9,
    },
    {
      slug: 'openai-api-price-change-cost-planning',
      calculatorId: 'chatgpt-api-cost-calculator',
      calculatorClicks: 4,
    },
  ]);
});

test('includes calculator clicks in imported metric summaries', () => {
  const summary = summarizeImportedMetrics([
    { slug: 'base-rate-loan-interest-impact', clicks: 12, impressions: 240, averagePosition: 8.2 },
    { slug: 'base-rate-loan-interest-impact', calculatorId: 'loan', calculatorClicks: 9 },
    { slug: 'openai-api-price-change-cost-planning', clicks: 3, impressions: 100, averagePosition: 14.7 },
    { slug: 'openai-api-price-change-cost-planning', calculatorId: 'chatgpt-api-cost-calculator', calculatorClicks: 4 },
  ]);

  assert.equal(summary.totalCalculatorClicks, 13);
  assert.equal(summary.topArticles[0].slug, 'base-rate-loan-interest-impact');
  assert.equal(summary.topArticles[0].calculatorClicks, 9);
  assert.deepEqual(summary.topArticles[0].calculatorClickTargets, { loan: 9 });
});

test('parses GA4 article interaction CSV exports without private calculator inputs', () => {
  const rows = parseGa4ArticleInteractionCsv(`Page path and screen class,Event name,Event label,Event count
/articles/base-rate-loan-interest-impact/,article_calculator_click,loan,9
/articles/base-rate-loan-interest-impact/,article_related_article_click,base-rate-loan-interest-impact:year-end-tax-refund-paycheck-impact,3
/articles/,article_index_article_click,openai-api-price-change-cost-planning,5
/loan/,calculator_related_article_click,loan:base-rate-loan-interest-impact,2
/articles/base-rate-loan-interest-impact/,article_faq_toggle,기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?,7
/salary/,salary_calculate,52000000,99
`);

  assert.deepEqual(rows, [
    {
      slug: 'base-rate-loan-interest-impact',
      calculatorId: 'loan',
      calculatorClicks: 9,
    },
    {
      slug: 'base-rate-loan-interest-impact',
      targetArticleSlug: 'year-end-tax-refund-paycheck-impact',
      relatedArticleClicks: 3,
    },
    {
      slug: 'openai-api-price-change-cost-planning',
      articleIndexClicks: 5,
    },
    {
      slug: 'base-rate-loan-interest-impact',
      sourceCalculatorId: 'loan',
      calculatorToArticleClicks: 2,
    },
    {
      slug: 'base-rate-loan-interest-impact',
      faqQuestion: '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?',
      faqClicks: 7,
    },
  ]);
});

test('summarizes imported article interaction metrics', () => {
  const summary = summarizeImportedMetrics([
    { slug: 'base-rate-loan-interest-impact', clicks: 12, impressions: 240, averagePosition: 8.2 },
    { slug: 'base-rate-loan-interest-impact', calculatorId: 'loan', calculatorClicks: 9 },
    { slug: 'base-rate-loan-interest-impact', targetArticleSlug: 'year-end-tax-refund-paycheck-impact', relatedArticleClicks: 3 },
    { slug: 'base-rate-loan-interest-impact', articleIndexClicks: 5 },
    { slug: 'base-rate-loan-interest-impact', sourceCalculatorId: 'loan', calculatorToArticleClicks: 2 },
    { slug: 'base-rate-loan-interest-impact', faqQuestion: '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?', faqClicks: 7 },
  ]);

  assert.equal(summary.totalCalculatorClicks, 9);
  assert.equal(summary.totalRelatedArticleClicks, 3);
  assert.equal(summary.totalArticleIndexClicks, 5);
  assert.equal(summary.totalCalculatorToArticleClicks, 2);
  assert.equal(summary.totalFaqClicks, 7);
  assert.equal(summary.topArticles[0].relatedArticleClicks, 3);
  assert.equal(summary.topArticles[0].articleIndexClicks, 5);
  assert.equal(summary.topArticles[0].calculatorToArticleClicks, 2);
  assert.equal(summary.topArticles[0].faqClicks, 7);
  assert.deepEqual(summary.topArticles[0].relatedArticleClickTargets, { 'year-end-tax-refund-paycheck-impact': 3 });
  assert.deepEqual(summary.topArticles[0].calculatorToArticleSources, { loan: 2 });
  assert.deepEqual(summary.topArticles[0].faqClickTargets, { '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?': 7 });
});

test('builds distinct import record ids for FAQ questions on the same article', () => {
  const importedAt = '2026-09-02T00:00:00.000Z';

  assert.notEqual(
    buildContentMetricRecordId(importedAt, {
      slug: 'base-rate-loan-interest-impact',
      faqQuestion: '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?',
      faqClicks: 7,
    }),
    buildContentMetricRecordId(importedAt, {
      slug: 'base-rate-loan-interest-impact',
      faqQuestion: '0.25%p 금리 차이는 1억원 대출에서 얼마인가요?',
      faqClicks: 4,
    }),
  );
});
