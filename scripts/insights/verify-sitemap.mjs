import { getPublishedArticles } from '../../src/data/articles.mjs';
import { approvalNoIndexPaths } from '../../src/data/approval-noindex-paths.mjs';
import { verifySitemap } from '../../src/lib/insights/sitemap-verifier.mjs';

const result = await verifySitemap({
  distDir: 'dist',
  siteUrl: 'https://mycalcstool.com',
  publishedArticles: getPublishedArticles(),
  noIndexPaths: approvalNoIndexPaths,
});

if (!result.ok) {
  console.error(`Sitemap verification failed with ${result.errors.length} error(s):`);
  for (const error of result.errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Sitemap verification passed (${result.urls.length} URL(s)).`);
