import assert from 'node:assert/strict';
import test from 'node:test';

import { buildArticleDataEntry, buildUpdatedArticlesModule } from '../../src/lib/insights/article-data-writer.mjs';

const candidate = {
  slug: 'minimum-wage-paycheck-impact',
  language: 'ko',
  category: 'salary',
  categoryLabel: '급여',
  title: '최저임금이 오르면 월급 실수령액은 얼마나 달라질까?',
  description: '최저임금 변화가 월급과 연봉 실수령액에 어떤 영향을 주는지 계산기와 함께 확인합니다.',
  summary: ['최저임금 변화는 세전 월급과 실수령액을 나눠 봐야 합니다.'],
  sections: [
    { heading: '무엇이 바뀌나요?', body: '공식 고시 기준 최저임금과 적용 시점을 확인해야 합니다.' },
    { heading: '내 월급에는 어떤 영향이 있나요?', body: '근로시간, 주휴수당, 4대보험 공제에 따라 실수령액이 달라집니다.' },
    { heading: '어떻게 계산하나요?', body: '연봉 실수령액 계산기에 조건을 입력해 비교합니다.' },
  ],
  calculatorMatches: [{ id: 'salary', path: '/salary/', name: '연봉 실수령액 계산기', score: 91 }],
  officialSources: [{ name: '고용노동부', url: 'https://www.moel.go.kr/' }],
  disclaimerType: 'salary',
  updatedAt: '2026-08-31T09:00:00.000Z',
};

test('builds an articles.mjs-compatible entry from an article candidate', () => {
  const entry = buildArticleDataEntry(candidate, '2026-08-31');

  assert.equal(entry.slug, 'minimum-wage-paycheck-impact');
  assert.equal(entry.status, 'published');
  assert.equal(entry.noIndex, false);
  assert.equal(entry.category, '급여');
  assert.equal(entry.categoryKey, 'salary');
  assert.equal(entry.publishedDate, '2026-08-31');
  assert.equal(entry.sections[0].paragraphs[0], '공식 고시 기준 최저임금과 적용 시점을 확인해야 합니다.');
  assert.deepEqual(entry.calculatorCtas[0], {
    calculatorId: 'salary',
    href: '/salary/',
    label: '연봉 실수령액 계산기',
    description: '내 조건으로 직접 계산합니다.',
  });
});

test('appends a new entry to the articles module without duplicating existing slugs', () => {
  const currentModule = `export const articles = [\n  {\n    slug: 'base-rate-loan-interest-impact',\n  },\n];\n\nexport function getPublishedArticles() {\n  return articles;\n}\n`;
  const updated = buildUpdatedArticlesModule(currentModule, [candidate], '2026-08-31');

  assert.match(updated, /minimum-wage-paycheck-impact/);
  assert.match(updated, /export function getPublishedArticles/);
  assert.throws(
    () => buildUpdatedArticlesModule(updated, [candidate], '2026-08-31'),
    /duplicate_slug/,
  );
});
