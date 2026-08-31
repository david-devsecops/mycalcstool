import assert from 'node:assert/strict';
import test from 'node:test';

import {
  publicCopyBanPattern,
  releaseChecks,
  resolveArgs,
  resolveCommand,
  shellForCommand,
  runReleaseChecks,
} from '../../src/lib/insights/release-verifier.mjs';

test('release gate lists the required deployment checks in order', () => {
  assert.deepEqual(
    releaseChecks.map((check) => check.name),
    [
      'insight tests',
      'growth homepage checks',
      'static build',
      'sitemap coverage',
      'public operation-copy scan',
      'analytics privacy scan',
      'secret leak scan',
    ],
  );
});

test('release gate stops on the first failed check', async () => {
  const calls = [];
  const result = await runReleaseChecks({
    runner: async (check) => {
      calls.push(check.name);
      return check.name === 'static build' ? { ok: false, output: 'build failed' } : { ok: true, output: '' };
    },
    logger: () => {},
  });

  assert.equal(result.ok, false);
  assert.deepEqual(calls, ['insight tests', 'growth homepage checks', 'static build']);
  assert.equal(result.failedCheck.name, 'static build');
});

test('public operation-copy scan includes internal strategy phrases', () => {
  assert.match('승인 전 전략', publicCopyBanPattern);
  assert.match('수익화', publicCopyBanPattern);
  assert.match('Issue → Information → Calculator', publicCopyBanPattern);
  assert.doesNotMatch('대출 이자 직접 계산하기', publicCopyBanPattern);
});

test('resolves npm through cmd on Windows without enabling child_process shell mode', () => {
  assert.equal(resolveCommand('npm', 'win32'), 'cmd.exe');
  assert.deepEqual(resolveArgs('npm', ['run', 'build'], 'win32'), ['/d', '/s', '/c', 'npm', 'run', 'build']);
  assert.equal(resolveCommand('node', 'win32'), 'node');
  assert.equal(resolveCommand('rg', 'win32'), 'rg');
});

test('never enables shell mode so regex pipes stay as arguments', () => {
  assert.equal(shellForCommand('npm', 'win32'), false);
  assert.equal(shellForCommand('rg', 'win32'), false);
  assert.equal(shellForCommand('node', 'linux'), false);
});
