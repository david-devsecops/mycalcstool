import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { articles, getPublishedArticles, getPublishedCanonicalTopics } from '../../src/data/articles.mjs';

const articleHtml = readFileSync('dist/articles/base-rate-loan-interest-impact/index.html', 'utf8');
const articlesIndexHtml = readFileSync('dist/articles/index.html', 'utf8');
const loanHtml = readFileSync('dist/loan/index.html', 'utf8');
const taxRefundHtml = readFileSync('dist/tax-refund/index.html', 'utf8');
const aiCostHtml = readFileSync('dist/chatgpt-api-cost-calculator/index.html', 'utf8');
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
const publicCopyBanPattern = /AdSense review window|애드센스|승인 전 전략|수익화|수익형|검색 신호|운영 초점|밀어야|수익 측정/;

test('rendered article pages expose article metadata and calculator CTA', () => {
  assert.match(articleHtml, /<meta property="og:type" content="article">/);
  assert.match(articleHtml, /"@type":"Article"/);
  assert.match(articleHtml, /"image":\["https:\/\/mycalcstool\.com\/og-default\.png"\]/);
  assert.match(articleHtml, /"publisher":\{"@type":"Organization","name":"mycalcstool","logo":\{"@type":"ImageObject","url":"https:\/\/mycalcstool\.com\/og-default\.png"\}\}/);
  assert.match(articleHtml, /"mainEntityOfPage":\{"@type":"WebPage","@id":"https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\/"\}/);
  assert.match(articleHtml, /rel="canonical" href="https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\/"/);
  assert.match(articleHtml, /data-ga-event="article_calculator_click"/);
});

test('sitemap includes published issue articles', () => {
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\//);
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/year-end-tax-refund-paycheck-impact\//);
  assert.match(sitemap, /https:\/\/mycalcstool\.com\/articles\/openai-api-price-change-cost-planning\//);
});

test('rendered article index exposes collection list structured data', () => {
  assert.match(articlesIndexHtml, /"@type":"CollectionPage"/);
  assert.match(articlesIndexHtml, /"@type":"ItemList"/);
  assert.match(articlesIndexHtml, /"itemListElement":\[\{"@type":"ListItem","position":1,"url":"https:\/\/mycalcstool\.com\/articles\/base-rate-loan-interest-impact\/","name":"기준금리가 바뀌면 내 대출 이자는 얼마나 달라질까\?"/);
  assert.match(articlesIndexHtml, /"@type":"BreadcrumbList"/);
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

test('every rendered article exposes trust elements and calculator links', () => {
  for (const article of getPublishedArticles()) {
    const html = readFileSync(`dist/articles/${article.slug}/index.html`, 'utf8');

    assert.match(html, /"@type":"Article"/, `${article.slug} missing Article schema`);
    assert.match(html, /"@type":"BreadcrumbList"/, `${article.slug} missing breadcrumb schema`);
    assert.match(html, /"image":\["https:\/\/mycalcstool\.com\/og-default\.png"\]/, `${article.slug} missing Article image`);
    assert.match(html, /"mainEntityOfPage":\{"@type":"WebPage","@id":"https:\/\/mycalcstool\.com\/articles\//, `${article.slug} missing Article WebPage entity`);
    assert.match(html, /id="sources"/, `${article.slug} missing source section`);
    assert.match(html, /id="disclaimer"/, `${article.slug} missing disclaimer`);
    assert.doesNotMatch(html, publicCopyBanPattern, `${article.slug} contains internal public copy`);

    for (const source of article.officialSources) {
      assert.match(html, new RegExp(source.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')), `${article.slug} missing source URL`);
      assert.match(html, new RegExp(`확인일\\s*${source.checkedAt}`), `${article.slug} missing source checked date`);
    }

    for (const cta of article.calculatorCtas) {
      assert.match(html, new RegExp(`href="${cta.href}"`), `${article.slug} missing CTA href ${cta.href}`);
      assert.match(html, new RegExp(`data-ga-label="${cta.calculatorId}"`), `${article.slug} missing CTA tracking label`);
    }
  }
});
