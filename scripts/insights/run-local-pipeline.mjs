import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { articles } from '../../src/data/articles.mjs';
import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';
import { readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';
import { runInsightPipeline } from '../../src/lib/insights/pipeline-runner.mjs';

await runAutomationJob({
  jobName: 'local-insight-pipeline',
  task: async () => {
    const dataDir = resolve('data/insights');
    const rawIssues = await readJsonlRecords(resolve(dataDir, 'issues.jsonl'));
    const contentMetrics = await readJsonlRecords(resolve(dataDir, 'content-metrics.jsonl'));
    const result = runInsightPipeline({
      rawIssues,
      contentMetrics,
      existingSlugs: articles.map((article) => article.slug),
      autoPublish: process.env.ENABLE_AUTO_PUBLISH === 'true',
      maxPerDay: Number(process.env.MAX_ARTICLES_PER_DAY || 1),
    });

    for (const candidate of result.issueCandidates) {
      await upsertJsonlRecord(resolve(dataDir, 'issue-candidates.jsonl'), candidate);
    }
    for (const candidate of result.articleCandidates) {
      await upsertJsonlRecord(resolve(dataDir, 'article-candidates.jsonl'), candidate);
    }
    for (const candidate of result.calculatorBacklog) {
      await upsertJsonlRecord(resolve(dataDir, 'calculator-backlog.jsonl'), candidate);
    }
    for (const record of result.publishPlanRecords) {
      await upsertJsonlRecord(resolve(dataDir, 'publish-plan.jsonl'), record);
    }

    const reportPath = resolve(dataDir, 'reports/latest.md');
    await mkdir(dirname(reportPath), { recursive: true });
    await writeFile(reportPath, result.report, 'utf8');

    console.log(
      `Pipeline: ${result.issueCandidates.length} issue candidate(s), ${result.articleCandidates.length} article candidate(s), ${result.calculatorBacklog.length} calculator backlog candidate(s).`,
    );
    return {
      itemsProcessed: result.issueCandidates.length + result.articleCandidates.length + result.calculatorBacklog.length,
      itemsFailed: result.publishPlan.rejected.length,
    };
  },
});
