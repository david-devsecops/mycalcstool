import { resolve } from 'node:path';

import { articles } from '../../src/data/articles.mjs';
import { readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';
import { planArticlePublication } from '../../src/lib/insights/publish-queue.mjs';
import { buildPublishPlanRecords } from '../../src/lib/insights/publish-plan-builder.mjs';

const dataDir = resolve('data/insights');
const articleCandidates = await readJsonlRecords(resolve(dataDir, 'article-candidates.jsonl'));
const existingSlugs = articles.map((article) => article.slug);
const autoPublish = process.env.ENABLE_AUTO_PUBLISH === 'true';
const maxPerDay = Number(process.env.MAX_ARTICLES_PER_DAY || 1);
const plan = planArticlePublication(articleCandidates, {
  autoPublish,
  maxPerDay,
  existingSlugs,
  alreadyPublishedToday: 0,
});
const records = buildPublishPlanRecords(plan);
const outputPath = resolve(dataDir, 'publish-plan.jsonl');

for (const record of records) {
  await upsertJsonlRecord(outputPath, record);
}

console.log(`Publish plan: ${plan.toPublish.length} scheduled, ${plan.queued.length} queued, ${plan.rejected.length} rejected.`);
