import { resolve } from 'node:path';

import { runAutomationJob } from '../../src/lib/insights/automation-runner.mjs';
import {
  buildIssueCandidates,
  buildIssueCandidatesWithSourceReachability,
} from '../../src/lib/insights/issue-candidate-builder.mjs';
import { readJsonlRecords, upsertJsonlRecord } from '../../src/lib/insights/jsonl-store.mjs';

await runAutomationJob({
  jobName: 'issue-analyzer',
  task: async () => {
    const dataDir = resolve('data/insights');
    const issues = await readJsonlRecords(resolve(dataDir, 'issues.jsonl'));
    const candidatesPath = resolve(dataDir, 'issue-candidates.jsonl');
    const options = {
      enableCalculatorMatching: process.env.ENABLE_CALCULATOR_MATCHING !== 'false',
      enableSourceContentMatch: process.env.ENABLE_SOURCE_CONTENT_MATCH === 'true',
    };
    const candidates =
      process.env.ENABLE_SOURCE_REACHABILITY === 'true'
        ? await buildIssueCandidatesWithSourceReachability(issues, options)
        : buildIssueCandidates(issues, options);

    for (const candidate of candidates) {
      await upsertJsonlRecord(candidatesPath, candidate);
    }

    console.log(`Analyzed ${issues.length} issue(s), wrote ${candidates.length} candidate(s).`);
    return { itemsProcessed: candidates.length };
  },
});
