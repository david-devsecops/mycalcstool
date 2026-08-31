import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';

function locValues(xml) {
  return [...String(xml || '').matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

function normalizeSiteUrl(siteUrl) {
  return String(siteUrl || '').replace(/\/$/, '');
}

export async function readSitemapUrls(distDir = 'dist') {
  const indexXml = await readFile(join(distDir, 'sitemap-index.xml'), 'utf8');
  const sitemapFiles = locValues(indexXml).map((url) => basename(new URL(url).pathname));
  const urls = [];

  for (const file of sitemapFiles) {
    const xml = await readFile(join(distDir, file), 'utf8');
    urls.push(...locValues(xml));
  }

  return urls;
}

export async function verifySitemap({
  distDir = 'dist',
  siteUrl = 'https://mycalcstool.com',
  publishedArticles = [],
  noIndexPaths = [],
} = {}) {
  const urls = new Set(await readSitemapUrls(distDir));
  const baseUrl = normalizeSiteUrl(siteUrl);
  const errors = [];

  for (const article of publishedArticles) {
    const url = `${baseUrl}/articles/${article.slug}/`;
    if (!urls.has(url)) {
      errors.push(`missing_published_article:${url}`);
    }
  }

  for (const path of noIndexPaths) {
    const url = `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    if (urls.has(url)) {
      errors.push(`noindex_path_in_sitemap:${url}`);
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    urls: [...urls],
  };
}
