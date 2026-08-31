import { resolve } from 'node:path';

import { articles } from '../../src/data/articles.mjs';
import { buildArticleCandidates } from '../../src/lib/insights/article-candidate-builder.mjs';
import { readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';

const dataDir = resolve('data/insights');
const issueCandidates = await readJsonlRecords(resolve(dataDir, 'issue-candidates.jsonl'));
const existingSlugs = articles.map((article) => article.slug);
const articleCandidates = buildArticleCandidates(issueCandidates, { existingSlugs });
const outputPath = resolve(dataDir, 'article-candidates.jsonl');

for (const candidate of articleCandidates) {
  await upsertJsonlRecord(outputPath, candidate);
}

console.log(`Generated ${articleCandidates.length} article candidate(s).`);
