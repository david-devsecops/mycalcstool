import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { getPublishedArticles } from '../../src/data/articles.mjs';
import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';
import { readJsonlRecords } from '../../src/lib/insights/jsonl-store.mjs';
import { buildInsightReport } from '../../src/lib/insights/report-builder.mjs';

await runAutomationJob({
  jobName: 'insight-report',
  task: async () => {
    const dataDir = resolve('data/insights');
    const outputPath = resolve(dataDir, 'reports/latest.md');

    const issues = await readJsonlRecords(resolve(dataDir, 'issues.jsonl'));
    const issueCandidates = await readJsonlRecords(resolve(dataDir, 'issue-candidates.jsonl'));
    const articleCandidates = await readJsonlRecords(resolve(dataDir, 'article-candidates.jsonl'));
    const calculatorBacklog = await readJsonlRecords(resolve(dataDir, 'calculator-backlog.jsonl'));
    const contentMetrics = await readJsonlRecords(resolve(dataDir, 'content-metrics.jsonl'));
    const report = buildInsightReport({
      issues,
      issueCandidates,
      articleCandidates,
      calculatorBacklog,
      contentMetrics,
      publishedArticles: getPublishedArticles(),
    });

    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, report, 'utf8');

    console.log(`Wrote ${outputPath}`);
    return {
      itemsProcessed: issues.length + issueCandidates.length + articleCandidates.length + calculatorBacklog.length + contentMetrics.length,
    };
  },
});
