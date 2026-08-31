import assert from 'node:assert/strict';
import test from 'node:test';

import { buildInsightReport } from '../../src/lib/insights/report-builder.mjs';

test('builds a queue report with status counts and review items', () => {
  const report = buildInsightReport({
    issues: [
      { id: 'issue-1', status: 'analyzed', canonicalTopic: '기준금리 변화와 대출 이자 영향' },
      { id: 'issue-2', status: 'rejected', canonicalTopic: '특정 종목 매수 추천' },
    ],
    issueCandidates: [
      { id: 'candidate-1', status: 'source_verified', canonicalTopic: '기준금리 변화와 대출 이자 영향' },
      { id: 'candidate-2', status: 'review_required', canonicalTopic: '연말정산과 환급액 영향' },
    ],
    articleCandidates: [
      {
        id: 'article-1',
        title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
        slug: 'base-rate-loan-interest-impact',
        status: 'review_required',
        qualityScore: 84,
        reason: 'auto_publish_disabled',
      },
      {
        id: 'article-2',
        title: 'OpenAI API 가격이 바뀌면 월 사용료는 어떻게 달라질까?',
        slug: 'openai-api-price-change-cost-planning',
        status: 'scheduled',
        qualityScore: 92,
      },
    ],
    calculatorBacklog: [
      {
        id: 'calc-ko-prepayment-fee-policy',
        title: '중도상환수수료 제도 변경과 상환 비용 영향 계산기',
        status: 'candidate',
        priority: 8,
      },
    ],
    contentMetrics: [
      { slug: 'base-rate-loan-interest-impact', clicks: 12, impressions: 240, ctr: 0.05, averagePosition: 8.2 },
      { slug: 'base-rate-loan-interest-impact', calculatorId: 'loan', calculatorClicks: 9 },
      { slug: 'openai-api-price-change-cost-planning', clicks: 3, impressions: 100, ctr: 0.03, averagePosition: 14.7 },
    ],
    publishedArticles: [
      {
        slug: 'base-rate-loan-interest-impact',
        title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
        publishedDate: '2026-07-01',
        updatedDate: '2026-08-31',
        officialSources: [{ name: '한국은행', url: 'https://www.bok.or.kr/', checkedAt: '2026-08-31' }],
        calculatorCtas: [{ calculatorId: 'loan', href: '/loan/' }],
      },
    ],
    generatedAt: '2026-08-31T09:00:00.000Z',
  });

  assert.match(report, /# MyCalcsTool Insight Queue Report/);
  assert.match(report, /Generated: 2026-08-31T09:00:00.000Z/);
  assert.match(report, /analyzed: 1/);
  assert.match(report, /rejected: 1/);
  assert.match(report, /source_verified: 1/);
  assert.match(report, /review_required: 1/);
  assert.match(report, /scheduled: 1/);
  assert.match(report, /Calculator Backlog Status/);
  assert.match(report, /candidate: 1/);
  assert.match(report, /중도상환수수료 제도 변경과 상환 비용 영향 계산기/);
  assert.match(report, /Content Metrics/);
  assert.match(report, /Total clicks: 15/);
  assert.match(report, /Total calculator clicks: 9/);
  assert.match(report, /base-rate-loan-interest-impact: 12 clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 9 calculator clicks/);
  assert.match(report, /auto_publish_disabled/);
  assert.match(report, /Published Article Audit/);
  assert.match(report, /\/articles\/base-rate-loan-interest-impact\//);
  assert.match(report, /sources 1 \/ CTAs 1 \/ updated 2026-08-31/);
  assert.match(report, /Performance Classification/);
  assert.match(report, /WINNER: 1/);
  assert.match(report, /base-rate-loan-interest-impact: WINNER/);
  assert.match(report, /Recommended Actions/);
  assert.match(report, /base-rate-loan-interest-impact: add supporting cluster articles and keep the calculator CTA prominent/);
});
