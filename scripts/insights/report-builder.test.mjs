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
        officialSources: [{ name: 'OpenAI Pricing', url: 'https://openai.com/api/pricing/' }],
        numericClaims: [{ claim: 'API price', sourceUrl: 'https://openai.com/api/pricing/' }],
        calculatorMatches: [{ id: 'chatgpt-api-cost-calculator', score: 91 }],
      },
    ],
    publishPlanRecords: [
      {
        id: 'plan-1',
        articleCandidateId: 'article-2',
        slug: 'openai-api-price-change-cost-planning',
        status: 'scheduled',
        queue: 'toPublish',
        reason: 'ready_to_publish',
      },
      {
        id: 'plan-2',
        articleCandidateId: 'article-1',
        slug: 'base-rate-loan-interest-impact',
        status: 'review_required',
        queue: 'queued',
        reason: 'auto_publish_disabled',
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
      { slug: 'base-rate-loan-interest-impact', query: '기준금리 대출이자', clicks: 8, impressions: 120, averagePosition: 7.4 },
      { slug: 'base-rate-loan-interest-impact', calculatorId: 'loan', calculatorClicks: 9 },
      { slug: 'base-rate-loan-interest-impact', targetArticleSlug: 'year-end-tax-refund-paycheck-impact', relatedArticleClicks: 3 },
      { slug: 'base-rate-loan-interest-impact', articleIndexClicks: 5 },
      { slug: 'base-rate-loan-interest-impact', sourceCalculatorId: 'loan', calculatorToArticleClicks: 2 },
      { slug: 'base-rate-loan-interest-impact', faqQuestion: '기준금리가 바뀌면 내 대출금리도 바로 바뀌나요?', faqClicks: 7 },
      { slug: 'openai-api-price-change-cost-planning', clicks: 3, impressions: 100, ctr: 0.03, averagePosition: 14.7 },
    ],
    automationRuns: [
      {
        id: 'run-1',
        jobName: 'collect-naver',
        status: 'success',
        itemsProcessed: 12,
        itemsFailed: 0,
        cost: 0.01,
        finishedAt: '2026-08-31T08:00:00.000Z',
      },
      {
        id: 'run-2',
        jobName: 'generate-articles',
        status: 'failed',
        itemsProcessed: 0,
        itemsFailed: 1,
        cost: 0.07,
        errorMessage: 'official_source_missing',
        finishedAt: '2026-08-31T08:10:00.000Z',
      },
      {
        id: 'run-3',
        jobName: 'publish-candidates',
        status: 'skipped',
        itemsProcessed: 0,
        itemsFailed: 0,
        cost: 0,
        errorMessage: 'automation_disabled',
        finishedAt: '2026-08-31T08:20:00.000Z',
      },
    ],
    publishedArticles: [
      {
        slug: 'base-rate-loan-interest-impact',
        title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
        publishedDate: '2026-07-01',
        updatedDate: '2026-08-31',
        categoryKey: 'finance',
        officialSources: [{ name: '한국은행', url: 'https://www.bok.or.kr/', checkedAt: '2026-08-31' }],
        calculatorCtas: [{ calculatorId: 'loan', href: '/loan/' }],
      },
      {
        slug: 'openai-api-price-change-cost-planning',
        title: 'OpenAI API 가격이 바뀌면 월 사용료는 어떻게 달라질까?',
        publishedDate: '2026-08-25',
        updatedDate: '2026-08-31',
        categoryKey: 'ai',
        officialSources: [{ name: 'OpenAI Pricing', url: 'https://openai.com/api/pricing/', checkedAt: '2026-08-31' }],
        calculatorCtas: [{ calculatorId: 'chatgpt-api-cost-calculator', href: '/chatgpt-api-cost-calculator/' }],
      },
      {
        slug: 'stale-ai-pricing-impact',
        title: 'AI API 단가가 바뀌면 월 비용은 얼마나 달라질까?',
        publishedDate: '2026-06-01',
        updatedDate: '2026-06-01',
        categoryKey: 'ai',
        officialSources: [{ name: 'AI Pricing', url: 'https://example.com/pricing', checkedAt: '2026-06-01' }],
        calculatorCtas: [{ calculatorId: 'chatgpt-api-cost-calculator', href: '/chatgpt-api-cost-calculator/' }],
      },
      {
        slug: 'unchecked-loan-policy-impact',
        title: '대출 제도가 바뀌면 이자는 어떻게 달라질까?',
        publishedDate: '2026-08-01',
        updatedDate: '2026-08-01',
        categoryKey: 'finance',
        officialSources: [{ name: '금융기관 공지', url: 'https://example.com/loan-policy' }],
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
  assert.match(report, /Publish Plan Status/);
  assert.match(report, /Publish Plan Status[\s\S]*scheduled: 1/);
  assert.match(report, /Publish Plan Status[\s\S]*review_required: 1/);
  assert.match(report, /Calculator Backlog Status/);
  assert.match(report, /candidate: 1/);
  assert.match(report, /중도상환수수료 제도 변경과 상환 비용 영향 계산기/);
  assert.match(report, /Content Metrics/);
  assert.match(report, /Total clicks: 23/);
  assert.match(report, /Total calculator clicks: 9/);
  assert.match(report, /Total related article clicks: 3/);
  assert.match(report, /Total article index clicks: 5/);
  assert.match(report, /Total calculator to article clicks: 2/);
  assert.match(report, /Total FAQ clicks: 7/);
  assert.match(report, /base-rate-loan-interest-impact: 20 clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 9 calculator clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 3 related article clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 5 article index clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 2 calculator to article clicks/);
  assert.match(report, /base-rate-loan-interest-impact: 7 FAQ clicks/);
  assert.match(report, /Search Queries/);
  assert.match(report, /base-rate-loan-interest-impact: 기준금리 대출이자 \(8 clicks \/ 120 impressions\)/);
  assert.match(report, /auto_publish_disabled/);
  assert.match(report, /Published Article Audit/);
  assert.match(report, /Published Article Status/);
  assert.match(report, /published: 4/);
  assert.match(report, /\/articles\/base-rate-loan-interest-impact\//);
  assert.match(report, /sources 1 \/ CTAs 1 \/ updated 2026-08-31/);
  assert.match(report, /Performance Classification/);
  assert.match(report, /WINNER: 1/);
  assert.match(report, /base-rate-loan-interest-impact: WINNER/);
  assert.match(report, /Recommended Actions/);
  assert.match(report, /base-rate-loan-interest-impact: add supporting cluster articles and keep the calculator CTA prominent/);
  assert.match(report, /Topic Cluster Decisions/);
  assert.match(report, /finance \/ loan: EXPAND/);
  assert.match(report, /ai \/ chatgpt-api-cost-calculator: WAIT/);
  assert.match(report, /Source Freshness Review/);
  assert.match(report, /stale-ai-pricing-impact: recheck official sources \(91 days since source check, limit 30\)/);
  assert.match(report, /unchecked-loan-policy-impact: missing official source checkedAt/);
  assert.match(report, /Article Manual Review Checklist/);
  assert.match(report, /openai-api-price-change-cost-planning: open every official source URL and confirm it supports the exact topic/);
  assert.match(report, /openai-api-price-change-cost-planning: verify every numeric claim has an official source URL/);
  assert.match(report, /openai-api-price-change-cost-planning: confirm the calculator CTA matches the user's money question/);
  assert.match(report, /Automation Runs/);
  assert.match(report, /success: 1/);
  assert.match(report, /failed: 1/);
  assert.match(report, /skipped: 1/);
  assert.match(report, /Total automation cost: 0.08/);
  assert.match(report, /generate-articles: failed \/ failed 1 \/ official_source_missing/);
  assert.doesNotMatch(report, /특정 종목 매수 추천: open every official source URL/);
});
