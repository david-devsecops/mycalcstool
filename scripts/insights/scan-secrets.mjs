import { scanFilesForSecrets } from '../../src/lib/insights/secret-scanner.mjs';

const findings = await scanFilesForSecrets(['src', 'scripts', 'docs', 'public', 'package.json']);

if (findings.length > 0) {
  for (const finding of findings) {
    console.error(`${finding.filePath}:${finding.line}: ${finding.secretName} ${finding.reason}`);
  }
  process.exit(1);
}

console.log('Secret scan passed.');
