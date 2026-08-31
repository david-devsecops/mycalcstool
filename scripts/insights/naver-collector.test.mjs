import assert from 'node:assert/strict';
import test from 'node:test';

import { collectNaverNewsIssues } from '../../src/lib/insights/naver-collector.mjs';

test('does not call Naver API when collector is disabled', async () => {
  const result = await collectNaverNewsIssues({
    env: { ENABLE_ISSUE_COLLECTOR: 'false' },
    fetchImpl: async () => {
      throw new Error('fetch should not run');
    },
  });

  assert.equal(result.status, 'disabled');
  assert.deepEqual(result.issues, []);
});

test('builds the official Naver news search request and parses items', async () => {
  let requestedUrl;
  let requestedHeaders;

  const result = await collectNaverNewsIssues({
    env: {
      ENABLE_ISSUE_COLLECTOR: 'true',
      NAVER_CLIENT_ID: 'client-id',
      NAVER_CLIENT_SECRET: 'client-secret',
    },
    query: '기준금리',
    display: 2,
    fetchImpl: async (url, options) => {
      requestedUrl = url;
      requestedHeaders = options.headers;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          items: [
            {
              title: '<b>기준금리</b> 인하, 대출 이자 영향',
              originallink: 'https://news.example.com/base-rate',
              link: 'https://n.news.naver.com/article/001/0000000001',
              description: '대출금리 영향 설명',
              pubDate: 'Mon, 31 Aug 2026 09:00:00 +0900',
            },
          ],
        }),
      };
    },
  });

  const url = new URL(requestedUrl);
  assert.equal(`${url.origin}${url.pathname}`, 'https://openapi.naver.com/v1/search/news.json');
  assert.equal(url.searchParams.get('query'), '기준금리');
  assert.equal(url.searchParams.get('display'), '2');
  assert.equal(url.searchParams.get('sort'), 'date');
  assert.equal(requestedHeaders['X-Naver-Client-Id'], 'client-id');
  assert.equal(requestedHeaders['X-Naver-Client-Secret'], 'client-secret');
  assert.equal(result.status, 'collected');
  assert.equal(result.issues[0].title, '기준금리 인하, 대출 이자 영향');
  assert.equal(result.issues[0].url, 'https://news.example.com/base-rate');
  assert.equal(result.issues[0].language, 'ko');
  assert.equal(result.issues[0].publishedAt, '2026-08-31T00:00:00.000Z');
});

test('skips duplicate URLs that were already collected', async () => {
  const result = await collectNaverNewsIssues({
    env: {
      ENABLE_ISSUE_COLLECTOR: 'true',
      NAVER_CLIENT_ID: 'client-id',
      NAVER_CLIENT_SECRET: 'client-secret',
    },
    existingUrls: new Set(['https://news.example.com/base-rate']),
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          {
            title: '기준금리 인하',
            originallink: 'https://news.example.com/base-rate',
            link: 'https://n.news.naver.com/article/001/0000000001',
            description: '',
            pubDate: 'Mon, 31 Aug 2026 09:00:00 +0900',
          },
        ],
      }),
    }),
  });

  assert.equal(result.status, 'collected');
  assert.deepEqual(result.issues, []);
});

test('reports Naver API failures without producing issues', async () => {
  const result = await collectNaverNewsIssues({
    env: {
      ENABLE_ISSUE_COLLECTOR: 'true',
      NAVER_CLIENT_ID: 'client-id',
      NAVER_CLIENT_SECRET: 'client-secret',
    },
    fetchImpl: async () => ({ ok: false, status: 429, text: async () => 'rate limited' }),
  });

  assert.equal(result.status, 'failed');
  assert.equal(result.error, 'naver_api_429');
  assert.deepEqual(result.issues, []);
});
