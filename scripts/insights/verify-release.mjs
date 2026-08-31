import { runReleaseChecks } from '../../src/lib/insights/release-verifier.mjs';

const result = await runReleaseChecks();

if (!result.ok) {
  console.error(`\nRelease verification failed at: ${result.failedCheck.name}`);
  process.exit(1);
}

console.log('\nRelease verification passed.');
