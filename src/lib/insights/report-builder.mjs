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

function countPublishedArticleStatus(articles) {
  return countByStatus(articles.map((article) => ({ status: article.status || 'published' })));
}

function renderBudgetStatus(budgetStatus) {
  if (!budgetStatus) return '';

  const reasons = budgetStatus.reasons?.length ? budgetStatus.reasons.join(', ') : 'none';
  return [
    '## Budget Status',
    '',
    `- status: ${budgetStatus.status}`,
    `- reasons: ${reasons}`,
    `- daily: ${budgetStatus.dailySpent ?? 0} / ${budgetStatus.dailyLimit ?? 'unlimited'}`,
    `- monthly: ${budgetStatus.monthlySpent ?? 0} / ${budgetStatus.monthlyLimit ?? 'unlimited'}`,
    '',
  ].join('\n');
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

function renderSearchQueries(articles) {
  const rows = articles.flatMap((article) =>
    Object.entries(article.searchQueries || {}).map(([query, metrics]) => ({ slug: article.slug, query, ...metrics })),
  );
  if (rows.length === 0) return ['### Search Queries', '', 'No query metrics.'];

  return [
    '### Search Queries',
    '',
    ...rows
      .sort((left, right) => right.clicks - left.clicks)
      .slice(0, 10)
      .map((row) => `- ${row.slug}: ${row.query} (${row.clicks} clicks / ${row.impressions} impressions)`),
  ];
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
    `- Total related article clicks: ${summary.totalRelatedArticleClicks}`,
    `- Total article index clicks: ${summary.totalArticleIndexClicks}`,
    `- Total calculator to article clicks: ${summary.totalCalculatorToArticleClicks}`,
    `- Total FAQ clicks: ${summary.totalFaqClicks}`,
    `- CTR: ${percent(summary.ctr)}`,
    '',
    '### Top Articles',
    '',
    ...summary.topArticles.map(
      (article) =>
        `- ${article.slug}: ${article.clicks} clicks / ${article.impressions} impressions / CTR ${percent(article.ctr)}`,
    ),
    '',
    ...renderSearchQueries(summary.articles),
    '',
    '### Calculator Clicks',
    '',
    ...summary.articles
      .filter((article) => article.calculatorClicks > 0)
      .map((article) => `- ${article.slug}: ${article.calculatorClicks} calculator clicks`),
    '',
    '### Article Navigation Clicks',
    '',
    ...summary.articles
      .filter((article) => article.relatedArticleClicks > 0 || article.articleIndexClicks > 0 || article.calculatorToArticleClicks > 0)
      .flatMap((article) => [
        article.relatedArticleClicks > 0 ? `- ${article.slug}: ${article.relatedArticleClicks} related article clicks` : null,
        article.articleIndexClicks > 0 ? `- ${article.slug}: ${article.articleIndexClicks} article index clicks` : null,
        article.calculatorToArticleClicks > 0 ? `- ${article.slug}: ${article.calculatorToArticleClicks} calculator to article clicks` : null,
      ])
      .filter(Boolean),
    '',
    '### FAQ Clicks',
    '',
    ...summary.articles
      .filter((article) => article.faqClicks > 0)
      .map((article) => `- ${article.slug}: ${article.faqClicks} FAQ clicks`),
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

function daysSince(dateValue, generatedAt) {
  const checked = new Date(`${dateValue}T00:00:00.000Z`);
  const generated = new Date(generatedAt);
  return Math.floor((generated - checked) / 86_400_000);
}

function sourceFreshnessLimit(categoryKey) {
  return categoryKey === 'ai' ? 30 : 90;
}

function renderSourceFreshnessReview(articles, generatedAt) {
  const reviewItems = articles.flatMap((article) => {
    const sources = article.officialSources || [];
    if (sources.length === 0 || sources.some((source) => !source.checkedAt)) {
      return [`- ${article.slug}: missing official source checkedAt`];
    }

    const oldestCheckAge = Math.max(...sources.map((source) => daysSince(source.checkedAt, generatedAt)));
    const limit = sourceFreshnessLimit(article.categoryKey);
    if (oldestCheckAge <= limit) return [];

    return [`- ${article.slug}: recheck official sources (${oldestCheckAge} days since source check, limit ${limit})`];
  });

  if (reviewItems.length === 0) return '## Source Freshness Review\n\nNo stale source checks.\n';

  return ['## Source Freshness Review', '', ...reviewItems, ''].join('\n');
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

function renderAutomationRuns(runs) {
  if (runs.length === 0) return '## Automation Runs\n\nNo automation runs.\n';

  const counts = countByStatus(runs);
  const totalCost = runs.reduce((sum, run) => sum + (Number(run.cost) || 0), 0);
  const failedRuns = runs.filter((run) => run.status === 'failed' || Number(run.itemsFailed) > 0).slice(-5);

  return [
    '## Automation Runs',
    '',
    ...Object.entries(counts).sort(([left], [right]) => left.localeCompare(right)).map(([status, count]) => `- ${status}: ${count}`),
    `- Total automation cost: ${totalCost.toFixed(2)}`,
    '',
    '### Recent Failures',
    '',
    ...(failedRuns.length
      ? failedRuns.map(
          (run) =>
            `- ${run.jobName}: ${run.status || 'unknown'} / failed ${run.itemsFailed || 0} / ${run.errorMessage || 'no error message'}`,
        )
      : ['No recent failures.']),
    '',
  ].join('\n');
}

export function buildInsightReport({
  issues = [],
  issueCandidates = [],
  articleCandidates = [],
  publishPlanRecords = [],
  calculatorBacklog = [],
  contentMetrics = [],
  publishedArticles = [],
  automationRuns = [],
  budgetStatus,
  generatedAt = new Date().toISOString(),
} = {}) {
  return [
    '# MyCalcsTool Insight Queue Report',
    '',
    `Generated: ${generatedAt}`,
    '',
    renderBudgetStatus(budgetStatus),
    renderCounts('Issue Status', countByStatus(issues)),
    renderCounts('Issue Candidate Status', countByStatus(issueCandidates)),
    renderCounts('Article Candidate Status', countByStatus(articleCandidates)),
    renderCounts('Publish Plan Status', countByStatus(publishPlanRecords)),
    renderCounts('Calculator Backlog Status', countByStatus(calculatorBacklog)),
    renderCounts('Published Article Status', countPublishedArticleStatus(publishedArticles)),
    renderReviewItems(articleCandidates),
    renderArticleManualReviewChecklist(articleCandidates),
    renderBacklogItems(calculatorBacklog),
    renderContentMetrics(contentMetrics),
    renderAutomationRuns(automationRuns),
    renderPublishedArticleAudit(publishedArticles),
    renderSourceFreshnessReview(publishedArticles, generatedAt),
    renderPerformanceClassification(contentMetrics, publishedArticles, generatedAt),
    renderRecommendedActions(contentMetrics, publishedArticles, generatedAt),
    renderTopicClusterDecisions(contentMetrics, publishedArticles, generatedAt),
  ].join('\n');
}
