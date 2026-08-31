import assert from 'node:assert/strict';
import test from 'node:test';

import { findSensitiveAnalyticsAttributesInText } from '../../src/lib/insights/analytics-privacy-scanner.mjs';

test('flags GA attributes that can carry private calculator inputs', () => {
  const findings = findSensitiveAnalyticsAttributesInText(
    [
      '<button data-ga-event="loan_calculated" data-ga-category="calculator">',
      '  Calculate',
      ['</button><a ', 'data-ga-amount', '={loanAmount}>bad</a>'].join(''),
      '<a data-ga-salary={salary}>bad</a>',
    ].join('\n'),
    'src/pages/loan.astro',
  );

  assert.deepEqual(findings, [
    {
      filePath: 'src/pages/loan.astro',
      line: 3,
      attribute: 'data-ga-amount',
      reason: 'sensitive_analytics_attribute',
    },
    {
      filePath: 'src/pages/loan.astro',
      line: 4,
      attribute: 'data-ga-salary',
      reason: 'sensitive_analytics_attribute',
    },
  ]);
});

test('allows static GA event category and label attributes used for CTA tracking', () => {
  const findings = findSensitiveAnalyticsAttributesInText(
    [
      '<a data-ga-event="article_calculator_click"',
      '  data-ga-category="article"',
      '  data-ga-label="loan"',
      '  href="/loan/">Loan calculator</a>',
    ].join('\n'),
    'src/components/ArticleCta.astro',
  );

  assert.deepEqual(findings, []);
});

test('flags GA label expressions that reference private calculator inputs', () => {
  const findings = findSensitiveAnalyticsAttributesInText(
    '<button data-ga-event="salary_calculated" data-ga-label={annualSalary}>Calculate</button>',
    'src/pages/salary.astro',
  );

  assert.deepEqual(findings, [
    {
      filePath: 'src/pages/salary.astro',
      line: 1,
      attribute: 'data-ga-label',
      reason: 'sensitive_analytics_value',
    },
  ]);
});
