import assert from 'node:assert/strict';
import test from 'node:test';

import { buildCalculatorBacklog } from '../../src/lib/insights/calculator-backlog-builder.mjs';

test('creates calculator backlog candidates for source-verified issues without calculator matches', () => {
  const backlog = buildCalculatorBacklog([
    {
      id: 'ko-prepayment-fee-policy',
      canonicalTopic: '중도상환수수료 제도 변경과 상환 비용 영향',
      category: 'finance',
      language: 'ko',
      relevanceScore: 82,
      status: 'source_verified',
      calculatorMatches: [],
    },
  ]);

  assert.equal(backlog.length, 1);
  assert.equal(backlog[0].id, 'calc-ko-prepayment-fee-policy');
  assert.equal(backlog[0].title, '중도상환수수료 제도 변경과 상환 비용 영향 계산기');
  assert.equal(backlog[0].status, 'candidate');
  assert.equal(backlog[0].priority, 8);
});

test('does not create backlog entries for low quality or already matched issues', () => {
  const backlog = buildCalculatorBacklog([
    {
      id: 'ko-low',
      canonicalTopic: '관련 낮은 이슈',
      category: 'finance',
      language: 'ko',
      relevanceScore: 45,
      status: 'source_verified',
      calculatorMatches: [],
    },
    {
      id: 'ko-loan',
      canonicalTopic: '기준금리 변화와 대출 이자 영향',
      category: 'finance',
      language: 'ko',
      relevanceScore: 88,
      status: 'source_verified',
      calculatorMatches: [{ id: 'loan', score: 95 }],
    },
    {
      id: 'ko-review',
      canonicalTopic: '공식 출처 없는 이슈',
      category: 'finance',
      language: 'ko',
      relevanceScore: 88,
      status: 'review_required',
      calculatorMatches: [],
    },
  ]);

  assert.deepEqual(backlog, []);
});
