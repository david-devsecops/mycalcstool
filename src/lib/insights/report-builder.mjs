import { classifyArticlePerformance, summarizeImportedMetrics } from './search-console-metrics.mjs';

function countByStatus(records) {
  return records.reduce((counts, record) => {
    const status = record.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function renderCounts(title, counts) {
  const rows = Object.entries(counts).sort(([left], [right]) => left.localeCompare(right));
  if (rows.length === 0) return `## ${title}\n\nNo records.\n`;

  return [`## ${title}`, '', ...rows.map(([status, count]) => `- ${status}: ${count}`), ''].join('\n');
}

function renderReviewItems(candidates) {
  const reviewItems = candidates.filter((candidate) => candidate.status === 'review_required' || candidate.status === 'rejected');
  if (reviewItems.length === 0) return '## Review Items\n\nNo review items.\n';

  return [
    '## Review Items',
    '',
    ...reviewItems.map((candidate) => {
      const reason = candidate.reason ? ` (${candidate.reason})` : '';
      return `- ${candidate.status}: ${candidate.title || candidate.id} / ${candidate.slug || 'no-slug'} / score ${candidate.qualityScore ?? 'n/a'}${reason}`;
    }),
    '',
  ].join('\n');
}

function renderArticleManualReviewChecklist(candidates) {
  const reviewableStatuses = new Set(['publish_candidate', 'scheduled', 'review_required']);
  const reviewableCandidates = candidates.filter((candidate) => reviewableStatuses.has(candidate.status));
  if (reviewableCandidates.length === 0) return '## Article Manual Review Checklist\n\nNo article candidates to review.\n';

  return [
    '## Article Manual Review Checklist',
    '',
    ...reviewableCandidates.flatMap((candidate) => {
      const id = candidate.slug || candidate.id;
      return [
        `- [ ] ${id}: open every official source URL and confirm it supports the exact topic`,
        `- [ ] ${id}: verify every numeric claim has an official source URL`,
        `- [ ] ${id}: confirm the calculator CTA matches the user's money question`,
        `- [ ] ${id}: check the title, summary, and examples are not thin or duplicated`,
        `- [ ] ${id}: confirm the final preview contains no guarantees, investment advice, or internal operation copy`,
      ];
    }),
    '',
  ].join('\n');
}

function renderBacklogItems(backlog) {
  if (backlog.length === 0) return '## Calculator Backlog\n\nNo calculator backlog items.\n';

  return [
    '## Calculator Backlog',
    '',
    ...backlog.map((candidate) => `- priority ${candidate.priority ?? 'n/a'}: ${candidate.title || candidate.id}`),
    '',
  ].join('\n');
}

function percent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function renderContentMetrics(rows) {
  const summary = summarizeImportedMetrics(rows);
  if (summary.topArticles.length === 0) return '## Content Metrics\n\nNo imported metrics.\n';

  return [
    '## Content Metrics',
    '',
    `- Total clicks: ${summary.totalClicks}`,
    `- Total impressions: ${summary.totalImpressions}`,
    `- Total calculator clicks: ${summary.totalCalculatorClicks}`,
    `- CTR: ${percent(summary.ctr)}`,
    '',
    '### Top Articles',
    '',
    ...summary.topArticles.map(
      (article) =>
        `- ${article.slug}: ${article.clicks} clicks / ${article.impressions} impressions / CTR ${percent(article.ctr)}`,
    ),
    '',
    '### Calculator Clicks',
    '',
    ...summary.articles
      .filter((article) => article.calculatorClicks > 0)
      .map((article) => `- ${article.slug}: ${article.calculatorClicks} calculator clicks`),
    '',
  ].join('\n');
}

function renderPublishedArticleAudit(articles) {
  if (articles.length === 0) return '## Published Article Audit\n\nNo published articles.\n';

  return [
    '## Published Article Audit',
    '',
    ...articles.map((article) => {
      const sourceCount = article.officialSources?.length || 0;
      const ctaCount = article.calculatorCtas?.length || 0;
      return `- /articles/${article.slug}/: sources ${sourceCount} / CTAs ${ctaCount} / updated ${article.updatedDate}`;
    }),
    '',
  ].join('\n');
}

function renderPerformanceClassification(rows, publishedArticles, generatedAt) {
  const classifications = classifyArticlePerformance(rows, publishedArticles, { now: generatedAt });
  if (classifications.length === 0) return '## Performance Classification\n\nNo article performance data.\n';

  const counts = countByStatus(classifications);

  return [
    '## Performance Classification',
    '',
    ...Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)).map(([status, count]) => `- ${status}: ${count}`),
    '',
    ...classifications.map((article) => `- ${article.slug}: ${article.status}`),
    '',
  ].join('\n');
}

function recommendationFor(status) {
  return {
    WINNER: 'add supporting cluster articles and keep the calculator CTA prominent',
    GROWING: 'refresh examples and add one internal link from a related calculator',
    UNDERPERFORM: 'rewrite title and meta description around the user money question',
    DEAD: 'review source freshness and merge or noindex if it still has no impressions',
    NEW: 'wait for enough Search Console data before changing the page',
    NORMAL: 'monitor without increasing publishing volume',
  }[status] || 'review manually';
}

function renderRecommendedActions(rows, publishedArticles, generatedAt) {
  const classifications = classifyArticlePerformance(rows, publishedArticles, { now: generatedAt });
  if (classifications.length === 0) return '## Recommended Actions\n\nNo article performance data.\n';

  return [
    '## Recommended Actions',
    '',
    ...classifications.map((article) => `- ${article.slug}: ${recommendationFor(article.status)}`),
    '',
  ].join('\n');
}

function decisionFor(status, calculatorClicks) {
  if (status === 'WINNER' && calculatorClicks > 0) return 'EXPAND';
  if (status === 'UNDERPERFORM') return 'IMPROVE';
  if (status === 'NEW') return 'WAIT';
  return 'MONITOR';
}

function renderTopicClusterDecisions(rows, publishedArticles, generatedAt) {
  const classifications = classifyArticlePerformance(rows, publishedArticles, { now: generatedAt });
  if (classifications.length === 0) return '## Topic Cluster Decisions\n\nNo article performance data.\n';

  const articlesBySlug = new Map(publishedArticles.map((article) => [article.slug, article]));
  const decisions = classifications.flatMap((metric) => {
    const article = articlesBySlug.get(metric.slug);
    const calculatorIds = article?.calculatorCtas?.map((cta) => cta.calculatorId) || [];

    return calculatorIds.map((calculatorId) => ({
      key: `${article.categoryKey || 'uncategorized'} / ${calculatorId}`,
      decision: decisionFor(metric.status, metric.calculatorClicks || 0),
      metric,
    }));
  });

  if (decisions.length === 0) return '## Topic Cluster Decisions\n\nNo calculator-linked article data.\n';

  return [
    '## Topic Cluster Decisions',
    '',
    ...decisions.map(
      ({ key, decision, metric }) =>
        `- ${key}: ${decision} (${metric.clicks} search clicks, ${metric.impressions} impressions, ${metric.calculatorClicks || 0} calculator clicks)`,
    ),
    '',
  ].join('\n');
}

export function buildInsightReport({
  issues = [],
  issueCandidates = [],
  articleCandidates = [],
  calculatorBacklog = [],
  contentMetrics = [],
  publishedArticles = [],
  generatedAt = new Date().toISOString(),
} = {}) {
  return [
    '# MyCalcsTool Insight Queue Report',
    '',
    `Generated: ${generatedAt}`,
    '',
    renderCounts('Issue Status', countByStatus(issues)),
    renderCounts('Issue Candidate Status', countByStatus(issueCandidates)),
    renderCounts('Article Candidate Status', countByStatus(articleCandidates)),
    renderCounts('Calculator Backlog Status', countByStatus(calculatorBacklog)),
    renderReviewItems(articleCandidates),
    renderArticleManualReviewChecklist(articleCandidates),
    renderBacklogItems(calculatorBacklog),
    renderContentMetrics(contentMetrics),
    renderPublishedArticleAudit(publishedArticles),
    renderPerformanceClassification(contentMetrics, publishedArticles, generatedAt),
    renderRecommendedActions(contentMetrics, publishedArticles, generatedAt),
    renderTopicClusterDecisions(contentMetrics, publishedArticles, generatedAt),
  ].join('\n');
}
