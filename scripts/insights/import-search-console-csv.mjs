import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';
import { appendJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';
import { parseSearchConsoleCsv, summarizeArticleMetrics } from '../../src/lib/insights/search-console-metrics.mjs';

const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Usage: npm run insights:metrics:import -- path/to/search-console.csv');
  process.exit(1);
}

await runAutomationJob({
  jobName: 'search-console-metrics-import',
  task: async () => {
    const csv = await readFile(resolve(csvPath), 'utf8');
    const importedAt = new Date().toISOString();
    const rows = summarizeArticleMetrics(parseSearchConsoleCsv(csv));
    const outputPath = resolve('data/insights/content-metrics.jsonl');

    for (const row of rows) {
      await appendJsonlRecord(outputPath, { id: `${importedAt}-${row.slug}`, importedAt, ...row });
    }

    console.log(`Imported ${rows.length} article metric row(s).`);
    return { itemsProcessed: rows.length };
  },
});
