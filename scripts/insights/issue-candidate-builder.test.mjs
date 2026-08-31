import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildIssueCandidates,
  buildIssueCandidatesWithSourceReachability,
} from '../../src/lib/insights/issue-candidate-builder.mjs';

test('keeps news-only finance issues in review while preserving calculator matches', () => {
  const candidates = buildIssueCandidates([
    {
      title: '기준금리 인하에 주담대 이자 얼마나 줄어드나',
      url: 'https://news.example.com/base-rate',
      sourceName: 'Example News',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(candidates[0].status, 'review_required');
  assert.deepEqual(candidates[0].sourceErrors, ['official_source_required']);
  assert.equal(candidates[0].calculatorMatches[0].path, '/loan/');
});

test('marks official-source finance issues as source verified', () => {
  const candidates = buildIssueCandidates([
    {
      title: '한국은행 기준금리 인하와 대출 이자 영향',
      url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
      sourceName: '한국은행',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(candidates[0].status, 'source_verified');
  assert.equal(candidates[0].officialSources[0].host, 'www.bok.or.kr');
  assert.equal(candidates[0].calculatorMatches[0].path, '/loan/');
});

test('keeps source verification while calculator matching is disabled', () => {
  const candidates = buildIssueCandidates(
    [
      {
        title: '한국은행 기준금리 인하와 대출 이자 영향',
        url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
        sourceName: '한국은행',
        publishedAt: '2026-08-31T00:00:00.000Z',
        language: 'ko',
      },
    ],
    { enableCalculatorMatching: false },
  );

  assert.equal(candidates[0].status, 'source_verified');
  assert.deepEqual(candidates[0].calculatorMatches, []);
});

test('keeps allowlisted but unreachable official sources in review', async () => {
  const candidates = await buildIssueCandidatesWithSourceReachability(
    [
      {
        title: '한국은행 기준금리 인하와 대출 이자 영향',
        url: 'https://www.bok.or.kr/missing',
        sourceName: '한국은행',
        publishedAt: '2026-08-31T00:00:00.000Z',
        language: 'ko',
      },
    ],
    {
      fetchImpl: async () => ({ ok: false, status: 404 }),
    },
  );

  assert.equal(candidates[0].status, 'review_required');
  assert.equal(candidates[0].sourceErrors.includes('official_source_unreachable'), true);
  assert.equal(candidates[0].officialSources[0].reachable, false);
});

test('keeps official sources in review when source content does not match the issue topic', async () => {
  const candidates = await buildIssueCandidatesWithSourceReachability(
    [
      {
        title: '한국은행 기준금리 인하와 대출 이자 영향',
        url: 'https://www.bok.or.kr/base-rate',
        sourceName: '한국은행',
        publishedAt: '2026-08-31T00:00:00.000Z',
        language: 'ko',
      },
    ],
    {
      enableSourceContentMatch: true,
      fetchImpl: async (_url, init) => ({
        ok: true,
        status: 200,
        text: async () => (init.method === 'GET' ? '한국은행 경제교육 일반 안내' : ''),
      }),
    },
  );

  assert.equal(candidates[0].status, 'review_required');
  assert.equal(candidates[0].sourceErrors.includes('official_source_content_mismatch'), true);
});

test('keeps excluded issues rejected', () => {
  const candidates = buildIssueCandidates([
    {
      title: '특정 종목 매수 추천, 다음 달 무조건 오른다는 증권가 전망',
      url: 'https://news.example.com/stock-promo',
      sourceName: 'Example News',
      publishedAt: '2026-08-31T00:00:00.000Z',
      language: 'ko',
    },
  ]);

  assert.equal(candidates[0].status, 'rejected');
  assert.ok(candidates[0].exclusionReasons.includes('unsupported_investment_claim'));
});
