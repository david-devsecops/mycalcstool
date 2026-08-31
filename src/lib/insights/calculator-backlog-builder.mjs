function priorityFromScore(score) {
  if (score >= 90) return 9;
  if (score >= 80) return 8;
  if (score >= 70) return 7;
  return 0;
}

function candidateTitle(issue) {
  const topic = String(issue.canonicalTopic || issue.title || '').trim();
  return topic.endsWith('계산기') ? topic : `${topic} 계산기`;
}

export function buildCalculatorBacklog(issueCandidates, options = {}) {
  const minRelevanceScore = options.minRelevanceScore ?? 70;

  return issueCandidates
    .filter((issue) => issue.status === 'source_verified')
    .filter((issue) => (issue.relevanceScore || 0) >= minRelevanceScore)
    .filter((issue) => (issue.calculatorMatches || []).length === 0)
    .map((issue) => ({
      id: `calc-${issue.id}`,
      title: candidateTitle(issue),
      description: '공식 출처가 확인됐지만 현재 연결 가능한 계산기가 없어 후보로 보관합니다.',
      reason: 'source_verified_issue_without_calculator_match',
      category: issue.category,
      language: issue.language || 'ko',
      relatedIssueId: issue.id,
      estimatedDemand: Math.min(100, issue.relevanceScore || 0),
      priority: priorityFromScore(issue.relevanceScore || 0),
      status: 'candidate',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
}
