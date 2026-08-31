import { resolve } from 'node:path';

import { buildCalculatorBacklog } from '../../src/lib/insights/calculator-backlog-builder.mjs';
import { readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';

const dataDir = resolve('data/insights');
const issueCandidates = await readJsonlRecords(resolve(dataDir, 'issue-candidates.jsonl'));
const backlog = buildCalculatorBacklog(issueCandidates);
const outputPath = resolve(dataDir, 'calculator-backlog.jsonl');

for (const candidate of backlog) {
  await upsertJsonlRecord(outputPath, candidate);
}

console.log(`Generated ${backlog.length} calculator backlog candidate(s).`);
