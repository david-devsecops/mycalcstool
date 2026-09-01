import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import { verifyCalculatorRoutes } from '../../src/lib/insights/calculator-route-verifier.mjs';

async function writeRoute(distDir, routePath, html) {
  const outputDir = join(distDir, ...routePath.split('/').filter(Boolean));
  await mkdir(outputDir, { recursive: true });
  await writeFile(join(outputDir, 'index.html'), html, 'utf8');
}

test('calculator route verifier accepts rendered indexable calculator pages', async () => {
  const distDir = await mkdtemp(join(tmpdir(), 'mycalcstool-routes-'));
  const calculators = [{ id: 'loan', path: '/loan/', name: '대출 이자 계산기' }];

  await writeRoute(distDir, '/loan/', '<link rel="canonical" href="https://mycalcstool.com/loan/"><meta name="robots" content="index, follow">');

  const result = await verifyCalculatorRoutes({ distDir, calculators });

  assert.equal(result.ok, true);
  assert.equal(result.checked, 1);
  assert.deepEqual(result.missing, []);
  assert.deepEqual(result.noindex, []);
  assert.deepEqual(result.canonicalMismatches, []);
});

test('calculator route verifier allows intentionally noindexed calculator pages', async () => {
  const distDir = await mkdtemp(join(tmpdir(), 'mycalcstool-routes-'));
  const calculators = [{ id: 'bmi', path: '/bmi/', name: 'BMI 계산기' }];

  await writeRoute(distDir, '/bmi/', '<link rel="canonical" href="https://mycalcstool.com/bmi/"><meta name="robots" content="noindex, follow">');

  const result = await verifyCalculatorRoutes({
    distDir,
    calculators,
    noindexAllowedPaths: new Set(['/bmi/']),
  });

  assert.equal(result.ok, true);
  assert.deepEqual(result.noindex, []);
});

test('calculator route verifier reports missing, noindex, and canonical drift', async () => {
  const distDir = await mkdtemp(join(tmpdir(), 'mycalcstool-routes-'));
  const calculators = [
    { id: 'loan', path: '/loan/', name: '대출 이자 계산기' },
    { id: 'salary', path: '/salary/', name: '연봉 계산기' },
    { id: 'tax-refund', path: '/tax-refund/', name: '연말정산 계산기' },
  ];

  await writeRoute(distDir, '/loan/', '<link rel="canonical" href="https://mycalcstool.com/old-loan/"><meta name="robots" content="index, follow">');
  await writeRoute(distDir, '/salary/', '<link rel="canonical" href="https://mycalcstool.com/salary/"><meta name="robots" content="noindex, follow">');

  const result = await verifyCalculatorRoutes({ distDir, calculators });

  assert.equal(result.ok, false);
  assert.deepEqual(result.missing.map((route) => route.id), ['tax-refund']);
  assert.deepEqual(result.noindex.map((route) => route.id), ['salary']);
  assert.deepEqual(result.canonicalMismatches.map((route) => route.id), ['loan']);
});
