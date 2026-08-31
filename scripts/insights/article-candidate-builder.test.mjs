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
