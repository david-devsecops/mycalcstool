import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { calculatorMetadata } from '../../src/data/calculator-metadata.mjs';
import { matchCalculators } from '../../src/lib/insights/calculator-matcher.mjs';

test('calculator metadata preserves every Korean calculator URL from site config', () => {
  const paths = new Set(calculatorMetadata.map((calculator) => calculator.path));
  const siteConfig = JSON.parse(readFileSync('src/data/site-config.json', 'utf8'));

  for (const calculator of siteConfig.calculators) {
    assert.equal(paths.has(calculator.path), true, `${calculator.path} should be matchable`);
  }
});

test('calculator metadata preserves existing English calculator URLs', () => {
  const paths = new Set(calculatorMetadata.map((calculator) => calculator.path));

  for (const expectedPath of [
    '/en/mortgage-calculator/',
    '/en/salary-calculator/',
    '/en/compound-interest-calculator/',
    '/en/stock-average-calculator/',
    '/en/stock-averaging-down-calculator/',
    '/en/stock-return-calculator/',
    '/en/dividend-calculator/',
    '/en/dividend-yield-calculator/',
    '/en/foreign-stock-return-calculator/',
    '/en/etf-investment-calculator/',
    '/en/ai-token-calculator/',
    '/en/chatgpt-api-cost-calculator/',
    '/en/ai-model-cost-comparison/',
    '/en/bmi-calculator/',
    '/en/calorie-calculator/',
    '/en/tdee-calculator/',
    '/en/age-calculator/',
    '/en/days-calculator/',
    '/en/due-date-calculator/',
    '/en/percentage-calculator/',
    '/en/tip-calculator/',
    '/en/unit-converter/',
  ]) {
    assert.equal(paths.has(expectedPath), true, `${expectedPath} should be matchable`);
  }
});

test('matches Korean base-rate issues to the loan calculator', () => {
  const matches = matchCalculators({
    title: '기준금리 0.25%p 변동 시 대출 이자 부담 변화',
    category: 'finance',
    language: 'ko',
    intent: ['POLICY_CHANGE', 'CALCULATOR', 'COST'],
  });

  assert.equal(matches[0].id, 'loan');
  assert.equal(matches[0].path, '/loan/');
  assert.equal(matches[0].score >= 70, true);
});

test('matches AI pricing issues to AI cost calculators', () => {
  const matches = matchCalculators({
    title: 'OpenAI API 가격이 바뀌면 월 토큰 비용은 어떻게 달라질까',
    category: 'ai',
    language: 'ko',
    intent: ['AI_COST', 'COMPARISON', 'CALCULATOR'],
  });

  const ids = matches.map((match) => match.id);
  assert.equal(ids.includes('chatgpt-api-cost-calculator'), true);
  assert.equal(ids.includes('ai-model-cost-comparison'), true);
});

test('does not force a low-relevance calculator match', () => {
  const matches = matchCalculators({
    title: '은행 임원 인사와 조직개편 소식',
    category: 'finance',
    language: 'ko',
    intent: ['INFORMATIONAL'],
  });

  assert.deepEqual(matches, []);
});
