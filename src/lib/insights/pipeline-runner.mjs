import { buildArticleCandidates } from './article-candidate-builder.mjs';
import { buildCalculatorBacklog } from './calculator-backlog-builder.mjs';
import { buildIssueCandidates } from './issue-candidate-builder.mjs';
import { buildPublishPlanRecords } from './publish-plan-builder.mjs';
import { planArticlePublication } from './publish-queue.mjs';
import { buildInsightReport } from './report-builder.mjs';

export function runInsightPipeline({
  rawIssues = [],
  issueCandidates,
  existingSlugs = [],
  autoPublish = false,
  maxPerDay = 1,
  alreadyPublishedToday = 0,
  contentMetrics = [],
  now = new Date().toISOString(),
} = {}) {
  const analyzedIssueCandidates = issueCandidates || buildIssueCandidates(rawIssues);
  const articleCandidates = buildArticleCandidates(analyzedIssueCandidates, { existingSlugs, now });
  const calculatorBacklog = buildCalculatorBacklog(analyzedIssueCandidates);
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
    calculatorBacklog,
    contentMetrics,
    generatedAt: now,
  });

  return {
    issueCandidates: analyzedIssueCandidates,
    articleCandidates,
    calculatorBacklog,
    publishPlan,
    publishPlanRecords,
    report,
  };
}
