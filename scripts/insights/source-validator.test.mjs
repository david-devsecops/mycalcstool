import test from 'node:test';
import assert from 'node:assert/strict';
import { validateOfficialSources, validateOfficialSourcesReachability } from '../../src/lib/insights/source-validator.mjs';

test('accepts allowlisted official finance sources', () => {
  const result = validateOfficialSources({
    category: 'finance',
    sources: [
      {
        name: '한국은행 기준금리 추이',
        url: 'https://www.bok.or.kr/portal/singl/baseRate/list.do?dataSeCd=01&menuNo=200643',
      },
    ],
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.officialSources[0].host, 'www.bok.or.kr');
});

test('rejects finance candidates backed only by news domains', () => {
  const result = validateOfficialSources({
    category: 'finance',
    sources: [{ name: '뉴스 예시', url: 'https://news.example.com/article/1' }],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('official_source_required'), true);
});

test('rejects invalid source URLs', () => {
  const result = validateOfficialSources({
    category: 'ai',
    sources: [{ name: 'broken', url: 'not-a-url' }],
  });

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('invalid_source_url'), true);
});

test('keeps allowlisted reachable sources valid', async () => {
  const result = await validateOfficialSourcesReachability(
    {
      category: 'finance',
      sources: [{ name: '한국은행', url: 'https://www.bok.or.kr/base-rate' }],
    },
    {
      fetchImpl: async () => ({ ok: true, status: 200 }),
    },
  );

  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
  assert.equal(result.officialSources[0].host, 'www.bok.or.kr');
});

test('marks allowlisted unreachable sources invalid for publishing', async () => {
  const result = await validateOfficialSourcesReachability(
    {
      category: 'finance',
      sources: [{ name: '한국은행', url: 'https://www.bok.or.kr/missing' }],
    },
    {
      fetchImpl: async () => ({ ok: false, status: 404 }),
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('official_source_unreachable'), true);
  assert.equal(result.officialSources[0].reachable, false);
});

test('times out official source reachability checks', async () => {
  const result = await validateOfficialSourcesReachability(
    {
      category: 'ai',
      sources: [{ name: 'OpenAI', url: 'https://openai.com/api/pricing/' }],
    },
    {
      timeoutMs: 1,
      fetchImpl: async (_url, init) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () => reject(new Error('aborted')));
        }),
    },
  );

  assert.equal(result.ok, false);
  assert.equal(result.errors.includes('official_source_unreachable'), true);
});
