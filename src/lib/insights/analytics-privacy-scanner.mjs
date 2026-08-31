import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const sensitiveAnalyticsAttributes = [
  'amount',
  'salary',
  'income',
  'loan',
  'principal',
  'rate',
  'term',
  'age',
  'weight',
  'height',
  'bmi',
  'calorie',
  'tax',
  'refund',
  'price',
  'cost',
  'token',
  'input',
  'value',
];

const sensitiveAnalyticsAttributePattern = new RegExp(
  `\\b(data-ga-(?:${sensitiveAnalyticsAttributes.join('|')}))\\b`,
  'i',
);
const sensitiveAnalyticsValuePattern = new RegExp(
  `\\bdata-ga-label\\s*=\\s*\\{[^}]*(?:${sensitiveAnalyticsAttributes.join('|')})`,
  'i',
);

export function findSensitiveAnalyticsAttributesInText(text, filePath = '') {
  return text.split(/\r?\n/).flatMap((lineText, index) => {
    const line = index + 1;
    const findings = [];
    const attributeMatch = lineText.match(sensitiveAnalyticsAttributePattern);
    const valueMatch = lineText.match(sensitiveAnalyticsValuePattern);

    if (attributeMatch) {
      findings.push({
        filePath,
        line,
        attribute: attributeMatch[1],
        reason: 'sensitive_analytics_attribute',
      });
    }

    if (valueMatch) {
      findings.push({
        filePath,
        line,
        attribute: 'data-ga-label',
        reason: 'sensitive_analytics_value',
      });
    }

    return findings;
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

export async function scanFilesForSensitiveAnalyticsAttributes(paths) {
  const files = (await Promise.all(paths.map((path) => listFiles(path)))).flat();
  const findings = [];

  for (const filePath of files) {
    const text = await readFile(filePath, 'utf8').catch(() => '');
    findings.push(...findSensitiveAnalyticsAttributesInText(text, filePath));
  }

  return findings;
}
