import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const sensitiveNames = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'NAVER_CLIENT_SECRET',
  'CLOUDFLARE_API_TOKEN',
  'GOOGLE_SEARCH_CONSOLE_PRIVATE_KEY',
];
const assignmentPattern = new RegExp(`\\b(${sensitiveNames.join('|')})\\b\\s*[:=]\\s*['"]([^'"]{12,})['"]`, 'i');
const ignoredValuePattern = /process\.env|import\.meta\.env|your_|placeholder|dummy|example|test|client-secret|xxx/i;
const privateKeyStart = ['-----BEGIN', 'PRIVATE KEY-----'].join(' ');

export function findHardcodedSecretsInText(text, filePath = '') {
  return text.split(/\r?\n/).flatMap((lineText, index) => {
    const line = index + 1;

    if (lineText.includes(privateKeyStart)) {
      return [{ filePath, line, secretName: 'PRIVATE_KEY', reason: 'private_key_block' }];
    }

    const match = lineText.match(assignmentPattern);
    if (!match || ignoredValuePattern.test(match[2])) return [];

    return [{ filePath, line, secretName: match[1], reason: 'hardcoded_secret_value' }];
  });
}

async function listFiles(path) {
  const info = await stat(path);
  if (info.isFile()) return [path];

  const entries = await readdir(path, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !['node_modules', 'dist', '.git', 'data'].includes(entry.name))
      .map((entry) => listFiles(join(path, entry.name))),
  );
  return nested.flat();
}

export async function scanFilesForSecrets(paths) {
  const files = (await Promise.all(paths.map((path) => listFiles(path)))).flat();
  const findings = [];

  for (const filePath of files) {
    const text = await readFile(filePath, 'utf8').catch(() => '');
    findings.push(...findHardcodedSecretsInText(text, filePath));
  }

  return findings;
}
