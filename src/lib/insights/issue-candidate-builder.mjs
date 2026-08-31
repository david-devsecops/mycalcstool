import { analyzeIssues } from './issue-analyzer.mjs';
import { matchCalculators } from './calculator-matcher.mjs';
import { validateOfficialSources, validateOfficialSourcesReachability } from './source-validator.mjs';

function buildIssueCandidate(issue, sourceValidation, options = {}) {
  const enableCalculatorMatching = options.enableCalculatorMatching !== false;
  const calculatorMatches =
    issue.status === 'rejected' || !enableCalculatorMatching
      ? []
      : matchCalculators({
          title: issue.canonicalTopic,
          category: issue.category,
          intent: issue.intent,
          language: issue.language,
        });
  const status = issue.status === 'rejected' ? 'rejected' : sourceValidation.ok ? 'source_verified' : 'review_required';

  return {
    ...issue,
    status,
    calculatorMatches,
    officialSources: sourceValidation.officialSources,
    sourceErrors: sourceValidation.errors,
  };
}

export function buildIssueCandidates(rawIssues, options = {}) {
  return analyzeIssues(rawIssues).map((issue) => {
    const sourceValidation = validateOfficialSources({ category: issue.category, sources: issue.sources });
    return buildIssueCandidate(issue, sourceValidation, options);
  });
}

export async function buildIssueCandidatesWithSourceReachability(rawIssues, options = {}) {
  const issues = analyzeIssues(rawIssues);
  const candidates = [];

  for (const issue of issues) {
    const sourceValidation = await validateOfficialSourcesReachability(
      {
        category: issue.category,
        sources: issue.sources,
        sourceKeywords: options.enableSourceContentMatch ? issue.sourceKeywords : [],
      },
      { fetchImpl: options.fetchImpl, timeoutMs: options.timeoutMs },
    );
    candidates.push(buildIssueCandidate(issue, sourceValidation, options));
  }

  return candidates;
}
