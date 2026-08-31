import { resolve } from 'node:path';

import { collectNaverNewsIssues } from '../../src/lib/insights/naver-collector.mjs';
import { appendJsonlRecord, readJsonlRecords } from '../../src/lib/insights/jsonl-store.mjs';

const dataDir = resolve('data/insights');
const issuesPath = resolve(dataDir, 'issues.jsonl');
const existingIssues = await readJsonlRecords(issuesPath);
const existingUrls = new Set(existingIssues.map((issue) => issue.url).filter(Boolean));
const queries = (process.env.NAVER_ISSUE_QUERIES || '기준금리,연말정산,최저임금,OpenAI API 가격')
  .split(',')
  .map((query) => query.trim())
  .filter(Boolean);

let collected = 0;

for (const query of queries) {
  const result = await collectNaverNewsIssues({ query, existingUrls });

  if (result.status !== 'collected') {
    console.log(`${query}: ${result.status}${result.error ? ` (${result.error})` : ''}`);
    continue;
  }

  for (const issue of result.issues) {
    await appendJsonlRecord(issuesPath, issue);
    existingUrls.add(issue.url);
    collected += 1;
  }

  console.log(`${query}: collected ${result.issues.length}`);
}

console.log(`Collected ${collected} new issue(s).`);
