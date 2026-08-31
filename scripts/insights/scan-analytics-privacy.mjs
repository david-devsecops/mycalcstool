import { scanFilesForSensitiveAnalyticsAttributes } from '../../src/lib/insights/analytics-privacy-scanner.mjs';

const findings = await scanFilesForSensitiveAnalyticsAttributes(['src', 'public']);

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.filePath}:${finding.line}: ${finding.attribute} ${finding.reason}`);
  }
  process.exit(1);
}

console.log('Analytics privacy scan passed.');
