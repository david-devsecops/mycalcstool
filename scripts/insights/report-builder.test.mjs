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
    generatedAt: '2026-08-31T09:00:00.000Z',
  });

  assert.match(report, /# MyCalcsTool Insight Queue Report/);
  assert.match(report, /Generated: 2026-08-31T09:00:00.000Z/);
  assert.match(report, /analyzed: 1/);
  assert.match(report, /rejected: 1/);
  assert.match(report, /source_verified: 1/);
  assert.match(report, /review_required: 1/);
  assert.match(report, /scheduled: 1/);
  assert.match(report, /auto_publish_disabled/);
});
