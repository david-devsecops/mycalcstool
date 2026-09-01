import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

const execFileAsync = promisify(execFile);

test('report script includes stored publish plan records', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'mct-report-'));
  const dataDir = join(dir, 'data/insights');
  await mkdir(dataDir, { recursive: true });
  await writeFile(
    join(dataDir, 'publish-plan.jsonl'),
    `${JSON.stringify({
      id: 'plan-1',
      articleCandidateId: 'article-1',
      slug: 'base-rate-loan-interest-impact',
      status: 'scheduled',
      queue: 'toPublish',
      reason: 'ready_to_publish',
    })}\n`,
    'utf8',
  );

  await execFileAsync(process.execPath, [resolve('scripts/insights/report.mjs')], { cwd: dir });

  const report = await readFile(join(dataDir, 'reports/latest.md'), 'utf8');
  assert.match(report, /Publish Plan Status/);
  assert.match(report, /Publish Plan Status[\s\S]*scheduled: 1/);
});
