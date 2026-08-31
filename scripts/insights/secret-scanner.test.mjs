import assert from 'node:assert/strict';
import test from 'node:test';

import { findHardcodedSecretsInText } from '../../src/lib/insights/secret-scanner.mjs';

test('finds hardcoded secret values but ignores environment references and placeholders', () => {
  const findings = findHardcodedSecretsInText(
    [
      "const ok = process.env.OPENAI_API_KEY;",
      "const placeholder = 'your_OPENAI_API_KEY_here';",
      ['OPENAI_API_KEY=', "'sk-live-secret-value-", "1234567890'"].join(''),
      "NAVER_CLIENT_SECRET='client-secret'",
    ].join('\n'),
    'example.env',
  );

  assert.deepEqual(findings, [
    {
      filePath: 'example.env',
      line: 3,
      secretName: 'OPENAI_API_KEY',
      reason: 'hardcoded_secret_value',
    },
  ]);
});

test('finds checked-in private key blocks', () => {
  const findings = findHardcodedSecretsInText(
    [
      'GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY=process.env.GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY',
      ['-----BEGIN', 'PRIVATE KEY-----'].join(' '),
      'abc123',
      '-----END PRIVATE KEY-----',
    ].join('\n'),
    'service-account.txt',
  );

  assert.deepEqual(findings, [
    {
      filePath: 'service-account.txt',
      line: 2,
      secretName: 'PRIVATE_KEY',
      reason: 'private_key_block',
    },
  ]);
});
