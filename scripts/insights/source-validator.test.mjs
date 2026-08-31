import test from 'node:test';
import assert from 'node:assert/strict';
import { validateOfficialSources } from '../../src/lib/insights/source-validator.mjs';

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

