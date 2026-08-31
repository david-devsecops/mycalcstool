import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const articleHtml = readFileSync('dist/articles/base-rate-loan-interest-impact/index.html', 'utf8');
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');

test('rendered article pages expose article metadata and calculator CTA', () => {
  assert.match(articleHtml, /<meta property="og:type" content="article">/);
  assert.match(articleHtml, /"@type":"Article"/);
  assert.match(articleHtml, /rel="canonical" href="https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\/"/);
  assert.match(articleHtml, /data-ga-event="article_calculator_click"/);
});

test('sitemap includes published issue articles', () => {
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\//);
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/year-end-tax-refund-paycheck-impact\//);
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/openai-api-price-change-cost-planning\//);
});
