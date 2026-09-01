import { buildArticleCandidates } from './article-candidate-builder.mjs';
import { buildCalculatorBacklog } from './calculator-backlog-builder.mjs';
import { buildIssueCandidates } from './issue-candidate-builder.mjs';
import { buildPublishPlanRecords } from './publish-plan-builder.mjs';
import { planArticlePublication } from './publish-queue.mjs';
import { buildInsightReport } from './report-builder.mjs';

function optionalNumber(value) {
  if (value === undefined || value === null || value === '') return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function evaluateBudget(costBudget = {}) {
  const dailyLimit = optionalNumber(costBudget.dailyLimit);
  const monthlyLimit = optionalNumber(costBudget.monthlyLimit);
  const dailySpent = optionalNumber(costBudget.dailySpent) ?? 0;
  const monthlySpent = optionalNumber(costBudget.monthlySpent) ?? 0;
  const reasons = [];

  if (dailyLimit !== undefined && dailySpent >= dailyLimit) reasons.push('daily_llm_budget_exhausted');
  if (monthlyLimit !== undefined && monthlySpent >= monthlyLimit) reasons.push('monthly_llm_budget_exhausted');

  return {
    status: reasons.length > 0 ? 'blocked' : 'ok',
    reasons,
    dailyLimit,
    dailySpent,
    monthlyLimit,
    monthlySpent,
  };
}

export function runInsightPipeline({
  rawIssues = [],
  issueCandidates,
  existingSlugs = [],
  existingCanonicalTopics = [],
  autoPublish = false,
  enableArticleGeneration = true,
  enableCalculatorMatching = true,
  maxPerDay = 1,
  alreadyPublishedToday = 0,
  contentMetrics = [],
  publishedArticles = [],
  costBudget,
  now = new Date().toISOString(),
} = {}) {
  const analyzedIssueCandidates = issueCandidates || buildIssueCandidates(rawIssues, { enableCalculatorMatching });
  const budgetStatus = evaluateBudget(costBudget);
  const downstreamEnabled = enableCalculatorMatching && budgetStatus.status === 'ok';
  const articleCandidates = enableArticleGeneration && downstreamEnabled
    ? buildArticleCandidates(analyzedIssueCandidates, { existingSlugs, existingCanonicalTopics, now })
    : [];
  const calculatorBacklog = downstreamEnabled ? buildCalculatorBacklog(analyzedIssueCandidates) : [];
  const publishPlan = planArticlePublication(articleCandidates, {
    autoPublish,
    maxPerDay,
    existingSlugs,
    alreadyPublishedToday,
  });
  const publishPlanRecords = buildPublishPlanRecords(publishPlan);
  const report = buildInsightReport({
    issues: rawIssues,
    issueCandidates: analyzedIssueCandidates,
    articleCandidates,
    publishPlanRecords,
    calculatorBacklog,
    contentMetrics,
    publishedArticles,
    budgetStatus,
    generatedAt: now,
  });

  return {
    issueCandidates: analyzedIssueCandidates,
    articleCandidates,
    calculatorBacklog,
    publishPlan,
    publishPlanRecords,
    budgetStatus,
    report,
  };
}
