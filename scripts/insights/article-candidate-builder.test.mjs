import assert from 'node:assert/strict';
import test from 'node:test';

import { buildArticleCandidates } from '../../src/lib/insights/article-candidate-builder.mjs';

const sourceVerifiedIssue = {
  id: 'ko-기준금리-변화와-대출-이자-영향',
  canonicalTopic: '기준금리 변화와 대출 이자 영향',
  category: 'finance',
  language: 'ko',
  relevanceScore: 88,
  intent: ['POLICY_CHANGE', 'RATE', 'CALCULATOR'],
  status: 'source_verified',
  officialSources: [
    {
      name: '한국은행 기준금리 추이',
      url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
    },
  ],
  calculatorMatches: [{ id: 'loan', path: '/loan/', name: '대출 이자 계산기', score: 96 }],
};

test('creates a publish candidate from a source-verified issue with calculator match', () => {
  const candidates = buildArticleCandidates([sourceVerifiedIssue], {
    existingSlugs: [],
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(candidates.length, 1);
  assert.equal(candidates[0].slug, 'base-rate-loan-interest-impact');
  assert.equal(candidates[0].status, 'publish_candidate');
  assert.ok(candidates[0].qualityScore >= 85);
  assert.equal(candidates[0].calculatorMatches[0].path, '/loan/');
  assert.equal(candidates[0].officialSources[0].url, sourceVerifiedIssue.officialSources[0].url);
  assert.equal(candidates[0].numericClaims[0].sourceUrl, sourceVerifiedIssue.officialSources[0].url);
});

test('keeps non-verified issues out of article generation', () => {
  const candidates = buildArticleCandidates([{ ...sourceVerifiedIssue, status: 'review_required', officialSources: [] }]);

  assert.equal(candidates.length, 0);
});

test('rejects duplicate slugs through the quality gate', () => {
  const candidates = buildArticleCandidates([sourceVerifiedIssue], {
    existingSlugs: ['base-rate-loan-interest-impact'],
  });

  assert.equal(candidates[0].status, 'rejected');
  assert.ok(candidates[0].qualityErrors.includes('duplicate_slug'));
});

test('rejects duplicate canonical topics through the quality gate', () => {
  const candidates = buildArticleCandidates([sourceVerifiedIssue], {
    existingSlugs: [],
    existingCanonicalTopics: ['기준금리 변화와 대출 이자 영향'],
  });

  assert.equal(candidates[0].status, 'rejected');
  assert.ok(candidates[0].qualityErrors.includes('duplicate_canonical_topic'));
});

test('creates user-question templates for supported tax salary and exchange-rate topics', () => {
  const issues = [
    {
      ...sourceVerifiedIssue,
      id: 'ko-tax-refund-impact',
      canonicalTopic: '연말정산과 환급액 영향',
      category: 'tax',
      intent: ['TAX', 'CALCULATOR', 'COST'],
      officialSources: [{ name: '국세청 연말정산', url: 'https://www.nts.go.kr/' }],
      calculatorMatches: [{ id: 'tax-refund', path: '/tax-refund/', name: '연말정산 환급액 계산기', score: 92 }],
    },
    {
      ...sourceVerifiedIssue,
      id: 'ko-salary-take-home-impact',
      canonicalTopic: '월급과 연봉 실수령액 영향',
      category: 'salary',
      intent: ['SALARY', 'CALCULATOR', 'COST'],
      officialSources: [{ name: '고용노동부 최저임금', url: 'https://www.moel.go.kr/' }],
      calculatorMatches: [{ id: 'salary', path: '/salary/', name: '연봉 실수령액 계산기', score: 90 }],
    },
    {
      ...sourceVerifiedIssue,
      id: 'ko-exchange-stock-return-impact',
      canonicalTopic: '환율 변화와 해외주식 원화 수익률 영향',
      category: 'investing',
      intent: ['INVESTMENT', 'RATE', 'CALCULATOR'],
      officialSources: [{ name: '한국은행 경제통계', url: 'https://ecos.bok.or.kr/' }],
      calculatorMatches: [{ id: 'foreign-stock-return-calculator', path: '/foreign-stock-return-calculator/', name: '해외주식 환율 수익률 계산기', score: 88 }],
    },
  ];

  const candidates = buildArticleCandidates(issues, {
    existingSlugs: [],
    now: '2026-08-31T09:00:00.000Z',
  });

  assert.equal(candidates.find((candidate) => candidate.canonicalTopic === '연말정산과 환급액 영향').slug, 'year-end-tax-refund-paycheck-impact');
  assert.match(candidates.find((candidate) => candidate.canonicalTopic === '연말정산과 환급액 영향').title, /환급액/);
  assert.equal(candidates.find((candidate) => candidate.canonicalTopic === '월급과 연봉 실수령액 영향').slug, 'salary-take-home-pay-impact');
  assert.match(candidates.find((candidate) => candidate.canonicalTopic === '월급과 연봉 실수령액 영향').title, /실수령액/);
  assert.equal(candidates.find((candidate) => candidate.canonicalTopic === '환율 변화와 해외주식 원화 수익률 영향').slug, 'exchange-rate-foreign-stock-return-impact');
  assert.match(candidates.find((candidate) => candidate.canonicalTopic === '환율 변화와 해외주식 원화 수익률 영향').title, /원화 수익률/);
  assert.equal(candidates.every((candidate) => candidate.status === 'publish_candidate'), true);
});
