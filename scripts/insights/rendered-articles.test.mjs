import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const articleHtml = readFileSync('dist/articles/base-rate-loan-interest-impact/index.html', 'utf8');
const loanHtml = readFileSync('dist/loan/index.html', 'utf8');
const taxRefundHtml = readFileSync('dist/tax-refund/index.html', 'utf8');
const aiCostHtml = readFileSync('dist/chatgpt-api-cost-calculator/index.html', 'utf8');
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

test('calculator pages link back to relevant issue articles', () => {
  assert.match(loanHtml, /\/articles\/base-rate-loan-interest-impact\//);
  assert.match(taxRefundHtml, /\/articles\/year-end-tax-refund-paycheck-impact\//);
  assert.match(aiCostHtml, /\/articles\/openai-api-price-change-cost-planning\//);
});
