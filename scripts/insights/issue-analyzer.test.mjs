import assert from 'node:assert/strict';
import test from 'node:test';

import { analyzeIssues } from '../../src/lib/insights/issue-analyzer.mjs';

test('clusters duplicate base-rate issues into one finance calculator candidate', () => {
  const issues = analyzeIssues([
    {
      title: '한국은행 기준금리 0.25%p 인하, 대출시장 영향은',
      url: 'https://news.example.com/base-rate-a',
      sourceName: 'Example News A',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
    {
      title: '기준금리 인하에 주담대 이자 얼마나 줄어드나',
      url: 'https://news.example.com/base-rate-b',
      sourceName: 'Example News B',
      publishedAt: '2026-08-31T01:00:00.000Z',
      language: 'ko',
    },
    {
      title: '은행권 대출금리 인하 전망',
      url: 'https://news.example.com/base-rate-c',
      sourceName: 'Example News C',
      publishedAt: '2026-08-31T02:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(issues.length, 1);
  assert.equal(issues[0].canonicalTopic, '기준금리 변화와 대출 이자 영향');
  assert.equal(issues[0].category, 'finance');
  assert.equal(issues[0].sourceCount, 3);
  assert.equal(issues[0].status, 'analyzed');
  assert.ok(issues[0].relevanceScore >= 80);
  assert.deepEqual(issues[0].intent.sort(), ['CALCULATOR', 'POLICY_CHANGE', 'RATE'].sort());
});

test('rejects promotional and speculative stock issues', () => {
  const issues = analyzeIssues([
    {
      title: '특정 종목 매수 추천, 다음 달 무조건 오른다는 증권가 전망',
      url: 'https://news.example.com/stock-promo',
      sourceName: 'Example News',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(issues[0].status, 'rejected');
  assert.ok(issues[0].relevanceScore < 40);
  assert.ok(issues[0].exclusionReasons.includes('unsupported_investment_claim'));
});

test('classifies AI pricing issues for cost comparison calculators', () => {
  const issues = analyzeIssues([
    {
      title: 'OpenAI API 가격 변경, GPT 토큰 비용 비교 필요',
      url: 'https://news.example.com/openai-price',
      sourceName: 'Example News',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(issues[0].category, 'ai');
  assert.equal(issues[0].canonicalTopic, 'AI API 가격 변화와 월 사용료 영향');
  assert.ok(issues[0].relevanceScore >= 80);
  assert.deepEqual(issues[0].intent.sort(), ['AI_COST', 'COMPARISON', 'COST'].sort());
});
