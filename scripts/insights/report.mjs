import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { readJsonlRecords } from '../../src/lib/insights/jsonl-store.mjs';
import { buildInsightReport } from '../../src/lib/insights/report-builder.mjs';

const dataDir = resolve('data/insights');
const outputPath = resolve(dataDir, 'reports/latest.md');

const issues = await readJsonlRecords(resolve(dataDir, 'issues.jsonl'));
const articleCandidates = await readJsonlRecords(resolve(dataDir, 'article-candidates.jsonl'));
const report = buildInsightReport({ issues, articleCandidates });

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, report, 'utf8');

console.log(`Wrote ${outputPath}`);
