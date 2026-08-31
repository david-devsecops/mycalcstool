import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import test from 'node:test';

import { verifySitemap } from '../../src/lib/insights/sitemap-verifier.mjs';

test('verifies published articles are indexed and noindex paths are excluded', async () => {
  const distDir = await mkdtemp(join(tmpdir(), 'mycalcstool-sitemap-'));

  try {
    await writeFile(
      join(distDir, 'sitemap-index.xml'),
      '<sitemapindex><sitemap><loc>https://mycalcstool.com/sitemap-0.xml</loc></sitemap></sitemapindex>',
    );
    await writeFile(
      join(distDir, 'sitemap-0.xml'),
      [
        '<urlset>',
        '<url><loc>https://mycalcstool.com/</loc></url>',
        '<url><loc>https://mycalcstool.com/articles/base-rate-loan-interest-impact/</loc></url>',
        '</urlset>',
      ].join(''),
    );

    const result = await verifySitemap({
      distDir,
      siteUrl: 'https://mycalcstool.com',
      publishedArticles: [{ slug: 'base-rate-loan-interest-impact' }],
      noIndexPaths: ['/go/moving/'],
    });

    assert.equal(result.ok, true);
    assert.deepEqual(result.errors, []);
  } finally {
    await rm(distDir, { recursive: true, force: true });
  }
});

test('reports missing published article URLs and noindex leaks', async () => {
  const distDir = await mkdtemp(join(tmpdir(), 'mycalcstool-sitemap-'));

  try {
    await writeFile(
      join(distDir, 'sitemap-index.xml'),
      '<sitemapindex><sitemap><loc>https://mycalcstool.com/sitemap-0.xml</loc></sitemap></sitemapindex>',
    );
    await writeFile(
      join(distDir, 'sitemap-0.xml'),
      [
        '<urlset>',
        '<url><loc>https://mycalcstool.com/go/moving/</loc></url>',
        '</urlset>',
      ].join(''),
    );

    const result = await verifySitemap({
      distDir,
      siteUrl: 'https://mycalcstool.com',
      publishedArticles: [{ slug: 'base-rate-loan-interest-impact' }],
      noIndexPaths: ['/go/moving/'],
    });

    assert.equal(result.ok, false);
    assert.deepEqual(result.errors, [
      'missing_published_article:https://mycalcstool.com/articles/base-rate-loan-interest-impact/',
      'noindex_path_in_sitemap:https://mycalcstool.com/go/moving/',
    ]);
  } finally {
    await rm(distDir, { recursive: true, force: true });
  }
});
