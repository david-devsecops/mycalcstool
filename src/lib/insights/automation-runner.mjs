import { resolve } from 'node:path';

import { appendJsonlRecord } from './jsonl-store.mjs';

function recordBase(jobName, startedAt) {
  return {
    id: `${jobName}-${startedAt}`,
    jobName,
    startedAt,
    finishedAt: new Date().toISOString(),
    itemsProcessed: 0,
    itemsFailed: 0,
    cost: 0,
  };
}

export async function runAutomationJob({
  jobName,
  task,
  env = process.env,
  logPath = resolve('data/insights/automation-runs.jsonl'),
}) {
  const startedAt = new Date().toISOString();

  if (env.AUTOMATION_ENABLED === 'false') {
    const record = {
      ...recordBase(jobName, startedAt),
      status: 'skipped',
      errorMessage: 'automation_disabled',
    };
    await appendJsonlRecord(logPath, record);
    return record;
  }

  try {
    const result = await task();
    const record = {
      ...recordBase(jobName, startedAt),
      status: 'success',
      itemsProcessed: result?.itemsProcessed || 0,
      itemsFailed: result?.itemsFailed || 0,
      cost: result?.cost || 0,
    };
    await appendJsonlRecord(logPath, record);
    return record;
  } catch (error) {
    await appendJsonlRecord(logPath, {
      ...recordBase(jobName, startedAt),
      status: 'failed',
      itemsFailed: 1,
      errorMessage: error.message,
    });
    throw error;
  }
}
