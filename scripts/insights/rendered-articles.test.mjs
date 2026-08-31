import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { articles, getPublishedCanonicalTopics } from '../../src/data/articles.mjs';

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

test('published article records expose audit fields for duplicate and source gates', () => {
  for (const article of articles.filter((item) => item.status === 'published')) {
    assert.equal(typeof article.issueId, 'string', `${article.slug} missing issueId`);
    assert.equal(typeof article.canonicalTopic, 'string', `${article.slug} missing canonicalTopic`);
    assert.match(article.publishedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.match(article.updatedDate, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(article.officialSources.every((source) => /^\d{4}-\d{2}-\d{2}$/.test(source.checkedAt)), `${article.slug} source checkedAt missing`);
  }

  assert.ok(getPublishedCanonicalTopics().includes('기준금리 변화와 대출 이자 영향'));
});
