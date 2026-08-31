import test from 'node:test';
import assert from 'node:assert/strict';
import { articles, getPublishedArticles } from '../../src/data/articles.mjs';
import { evaluateArticleCandidate } from '../../src/lib/insights/quality-gate.mjs';

const validCandidate = {
  slug: 'base-rate-loan-interest-impact',
  title: '기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까?',
  description: '기준금리 변화가 대출 이자에 미치는 영향을 예시와 계산기로 확인합니다.',
  category: 'finance',
  language: 'ko',
  status: 'published',
  officialSources: [
    {
      name: '한국은행 기준금리 추이',
      url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
    },
  ],
  numericClaims: [
    {
      claim: '금리 0.25%p 변화',
      sourceUrl: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
    },
  ],
  calculatorMatches: [{ id: 'loan', path: '/loan/', score: 92 }],
  sections: [
    { heading: '무엇이 바뀌었나', body: '공식 발표와 적용 시점을 확인합니다.' },
    { heading: '내 돈에는 어떤 영향이 있나', body: '대출 잔액과 금리 차이를 넣어 월 이자 차이를 계산합니다.' },
    { heading: '직접 계산하기', body: '대출 이자 계산기로 내 조건을 확인합니다.' },
  ],
};

test('published article registry exposes only published indexable articles', () => {
  const published = getPublishedArticles();

  assert.equal(Array.isArray(articles), true);
  assert.equal(published.every((article) => article.status === 'published' && article.noIndex !== true), true);
});

test('quality gate approves source-backed finance candidates with calculator CTA', () => {
  const result = evaluateArticleCandidate(validCandidate, { existingSlugs: [] });

  assert.equal(result.status, 'publish_candidate');
  assert.equal(result.score >= 85, true);
  assert.deepEqual(result.errors, []);
});

test('quality gate rejects finance candidates without official sources', () => {
  const result = evaluateArticleCandidate(
    { ...validCandidate, slug: 'missing-source', officialSources: [], numericClaims: [] },
    { existingSlugs: [] },
  );

  assert.equal(result.status, 'rejected');
  assert.equal(result.errors.includes('official_source_required'), true);
});

test('quality gate rejects unsupported investment guarantees', () => {
  const result = evaluateArticleCandidate(
    {
      ...validCandidate,
      slug: 'guaranteed-return',
      title: '이 종목은 수익을 보장합니다',
      sections: [{ heading: '보장', body: '이 투자 전략은 원금 보장과 수익 보장을 제공합니다.' }],
    },
    { existingSlugs: [] },
  );

  assert.equal(result.status, 'rejected');
  assert.equal(result.errors.includes('banned_claim'), true);
});

test('quality gate rejects duplicate slugs', () => {
  const result = evaluateArticleCandidate(validCandidate, {
    existingSlugs: ['base-rate-loan-interest-impact'],
  });

  assert.equal(result.status, 'rejected');
  assert.equal(result.errors.includes('duplicate_slug'), true);
});
