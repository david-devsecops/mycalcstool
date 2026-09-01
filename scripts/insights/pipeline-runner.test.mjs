import assert from 'node:assert/strict';
import test from 'node:test';

import { runInsightPipeline } from '../../src/lib/insights/pipeline-runner.mjs';

const baseRateIssue = {
  title: '한국은행 기준금리 인하, 주담대 대출 이자 영향은',
  url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
  source: '한국은행',
  summary: '기준금리 변경과 대출 이자 영향을 확인합니다.',
  publishedAt: '2026-08-31T00:00:00.000Z',
  collectedAt: '2026-08-31T01:00:00.000Z',
  language: 'ko',
};

test('runs raw issues through the Phase 1A insight pipeline', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    existingSlugs: [],
    autoPublish: false,
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.issueCandidates[0].status, 'source_verified');
  assert.equal(result.issueCandidates[0].calculatorMatches[0].id, 'loan');
  assert.equal(result.articleCandidates[0].slug, 'base-rate-loan-interest-impact');
  assert.equal(result.articleCandidates[0].status, 'publish_candidate');
  assert.equal(result.publishPlan.queued[0].reason, 'auto_publish_disabled');
  assert.match(result.report, /Article Candidate Status/);
});

test('includes publish plan status in the pipeline report', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    existingSlugs: [],
    autoPublish: true,
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.publishPlanRecords[0].status, 'scheduled');
  assert.match(result.report, /Publish Plan Status/);
  assert.match(result.report, /Publish Plan Status[\s\S]*scheduled: 1/);
});

test('keeps issue analysis but skips article candidates when article generation is disabled', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    existingSlugs: [],
    enableArticleGeneration: false,
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.issueCandidates[0].status, 'source_verified');
  assert.deepEqual(result.articleCandidates, []);
  assert.deepEqual(result.publishPlanRecords, []);
  assert.match(result.report, /Article Candidate Status/);
});

test('keeps issue analysis but skips downstream records when calculator matching is disabled', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    existingSlugs: [],
    enableCalculatorMatching: false,
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.issueCandidates[0].status, 'source_verified');
  assert.deepEqual(result.issueCandidates[0].calculatorMatches, []);
  assert.deepEqual(result.articleCandidates, []);
  assert.deepEqual(result.calculatorBacklog, []);
  assert.deepEqual(result.publishPlanRecords, []);
});

test('passes existing canonical topics into article quality checks', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    existingSlugs: [],
    existingCanonicalTopics: ['기준금리 변화와 대출 이자 영향'],
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.articleCandidates[0].status, 'rejected');
  assert.ok(result.articleCandidates[0].qualityErrors.includes('duplicate_canonical_topic'));
});

test('keeps source-verified unmatched issues in the calculator backlog', () => {
  const result = runInsightPipeline({
    issueCandidates: [
      {
        id: 'ko-prepayment-fee-policy',
        canonicalTopic: '중도상환수수료 제도 변경과 상환 비용 영향',
        category: 'finance',
        language: 'ko',
        relevanceScore: 82,
        status: 'source_verified',
        calculatorMatches: [],
        officialSources: [{ name: '금융위원회', url: 'https://www.fsc.go.kr/' }],
      },
    ],
    existingSlugs: [],
    autoPublish: false,
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.calculatorBacklog[0].id, 'calc-ko-prepayment-fee-policy');
  assert.notEqual(result.articleCandidates[0].status, 'publish_candidate');
  assert.match(result.report, /Calculator Backlog Status/);
});

test('stops downstream generation when the LLM budget is exhausted', () => {
  const result = runInsightPipeline({
    rawIssues: [baseRateIssue],
    costBudget: {
      dailyLimit: 1,
      dailySpent: 1,
      monthlyLimit: 30,
      monthlySpent: 5,
    },
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(result.budgetStatus.status, 'blocked');
  assert.deepEqual(result.budgetStatus.reasons, ['daily_llm_budget_exhausted']);
  assert.equal(result.issueCandidates[0].status, 'source_verified');
  assert.deepEqual(result.articleCandidates, []);
  assert.deepEqual(result.calculatorBacklog, []);
  assert.deepEqual(result.publishPlanRecords, []);
  assert.match(result.report, /Budget Status/);
  assert.match(result.report, /daily_llm_budget_exhausted/);
});
