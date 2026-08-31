import { analyzeIssues } from './issue-analyzer.mjs';
import { matchCalculators } from './calculator-matcher.mjs';
import { validateOfficialSources } from './source-validator.mjs';

export function buildIssueCandidates(rawIssues) {
  return analyzeIssues(rawIssues).map((issue) => {
    const calculatorMatches =
      issue.status === 'rejected'
        ? []
        : matchCalculators({
            title: issue.canonicalTopic,
            category: issue.category,
            intent: issue.intent,
            language: issue.language,
          });
    const sourceValidation = validateOfficialSources({ category: issue.category, sources: issue.sources });
    const status = issue.status === 'rejected' ? 'rejected' : sourceValidation.ok ? 'source_verified' : 'review_required';

    return {
      ...issue,
      status,
      calculatorMatches,
      officialSources: sourceValidation.officialSources,
      sourceErrors: sourceValidation.errors,
    };
  });
}
