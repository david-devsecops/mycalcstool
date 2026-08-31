import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

import { articles } from '../../src/data/articles.mjs';
import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';
import { readJsonlRecords } from '../../src/lib/insights/jsonl-store.mjs';
import { buildUpdatedArticlesModule } from '../../src/lib/insights/article-data-writer.mjs';
import { countPublishedOnDate, dateKeyForTimeZone, planArticlePublication } from '../../src/lib/insights/publish-queue.mjs';

await runAutomationJob({
  jobName: 'article-publisher',
  task: async () => {
    const args = new Set(process.argv.slice(2));
    const apply = args.has('--apply');
    const manualApproval = args.has('--manual-approval');
    const dataDir = resolve('data/insights');
    const articlesPath = resolve('src/data/articles.mjs');
    const previewPath = resolve(dataDir, 'reports/articles-preview.mjs');
    const articleCandidates = await readJsonlRecords(resolve(dataDir, 'article-candidates.jsonl'));
    const articlesSource = await readFile(articlesPath, 'utf8');
    const existingSlugs = [...articlesSource.matchAll(/["']?slug["']?\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]);
    const publishDate = dateKeyForTimeZone();
    const plan = planArticlePublication(articleCandidates, {
      autoPublish: apply && manualApproval,
      existingSlugs,
      maxPerDay: Number(process.env.MAX_ARTICLES_PER_DAY || 1),
      alreadyPublishedToday: countPublishedOnDate(articles, publishDate),
    });
    const nextSource = buildUpdatedArticlesModule(articlesSource, plan.toPublish, publishDate);
    const targetPath = apply && manualApproval ? articlesPath : previewPath;

    await mkdir(dirname(targetPath), { recursive: true });
    await writeFile(targetPath, nextSource, 'utf8');

    console.log(
      `${apply && manualApproval ? 'Applied' : 'Previewed'} ${plan.toPublish.length} article(s); ${plan.queued.length} queued, ${plan.rejected.length} rejected.`,
    );
    return { itemsProcessed: plan.toPublish.length, itemsFailed: plan.rejected.length };
  },
});
