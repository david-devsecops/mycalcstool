function countByStatus(records) {
  return records.reduce((counts, record) => {
    const status = record.status || 'unknown';
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});
}

function renderCounts(title, counts) {
  const rows = Object.entries(counts).sort(([left], [right]) => left.localeCompare(right));
  if (rows.length === 0) return `## ${title}\n\nNo records.\n`;

  return [`## ${title}`, '', ...rows.map(([status, count]) => `- ${status}: ${count}`), ''].join('\n');
}

function renderReviewItems(candidates) {
  const reviewItems = candidates.filter((candidate) => candidate.status === 'review_required' || candidate.status === 'rejected');
  if (reviewItems.length === 0) return '## Review Items\n\nNo review items.\n';

  return [
    '## Review Items',
    '',
    ...reviewItems.map((candidate) => {
      const reason = candidate.reason ? ` (${candidate.reason})` : '';
      return `- ${candidate.status}: ${candidate.title || candidate.id} / ${candidate.slug || 'no-slug'} / score ${candidate.qualityScore ?? 'n/a'}${reason}`;
    }),
    '',
  ].join('\n');
}

function renderBacklogItems(backlog) {
  if (backlog.length === 0) return '## Calculator Backlog\n\nNo calculator backlog items.\n';

  return [
    '## Calculator Backlog',
    '',
    ...backlog.map((candidate) => `- priority ${candidate.priority ?? 'n/a'}: ${candidate.title || candidate.id}`),
    '',
  ].join('\n');
}

export function buildInsightReport({
  issues = [],
  issueCandidates = [],
  articleCandidates = [],
  calculatorBacklog = [],
  generatedAt = new Date().toISOString(),
} = {}) {
  return [
    '# MyCalcsTool Insight Queue Report',
    '',
    `Generated: ${generatedAt}`,
    '',
    renderCounts('Issue Status', countByStatus(issues)),
    renderCounts('Issue Candidate Status', countByStatus(issueCandidates)),
    renderCounts('Article Candidate Status', countByStatus(articleCandidates)),
    renderCounts('Calculator Backlog Status', countByStatus(calculatorBacklog)),
    renderReviewItems(articleCandidates),
    renderBacklogItems(calculatorBacklog),
  ].join('\n');
}
