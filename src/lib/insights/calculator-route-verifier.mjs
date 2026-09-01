import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { approvalNoIndexPathSet } from '../../data/approval-noindex-paths.mjs';
import { calculatorMetadata } from '../../data/calculator-metadata.mjs';

function routeToOutputFile(distDir, routePath) {
  const routeSegments = routePath.split('/').filter(Boolean);
  return join(distDir, ...routeSegments, 'index.html');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasCanonicalUrl(html, expectedUrl) {
  const canonicalLink = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*>/i)?.[0] ?? '';
  return new RegExp(`href=["']${escapeRegExp(expectedUrl)}["']`, 'i').test(canonicalLink);
}

function hasNoindex(html) {
  return /<meta\s+[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html);
}

export async function verifyCalculatorRoutes({
  distDir = 'dist',
  calculators = calculatorMetadata,
  noindexAllowedPaths = approvalNoIndexPathSet,
  site = 'https://mycalcstool.com',
} = {}) {
  const siteOrigin = site.replace(/\/$/, '');
  const missing = [];
  const noindex = [];
  const canonicalMismatches = [];

  for (const calculator of calculators) {
    const outputFile = routeToOutputFile(distDir, calculator.path);
    let html = '';

    try {
      html = await readFile(outputFile, 'utf8');
    } catch {
      missing.push(calculator);
      continue;
    }

    if (hasNoindex(html) && !noindexAllowedPaths.has(calculator.path)) {
      noindex.push(calculator);
    }

    if (!hasCanonicalUrl(html, `${siteOrigin}${calculator.path}`)) {
      canonicalMismatches.push(calculator);
    }
  }

  return {
    ok: missing.length === 0 && noindex.length === 0 && canonicalMismatches.length === 0,
    checked: calculators.length,
    missing,
    noindex,
    canonicalMismatches,
  };
}
