const sourceRequiredCategories = new Set(['finance', 'tax', 'salary', 'support', 'investing', 'ai']);
const bannedClaimPattern = /(수익\s*보장|원금\s*보장|대출\s*승인\s*보장|무조건\s*(오른|내린|받|가능|수익)|확정\s*수익|매수\s*추천|매도\s*추천|guaranteed\s+return|principal\s+guarantee|buy\s+recommendation|sell\s+recommendation)/i;

function sourceUrls(candidate) {
  return new Set((candidate.officialSources || []).map((source) => source.url));
}

function hasSourceCheckDate(source) {
  return Boolean(source.checkedAt || source.verifiedAt);
}

function normalizeTopic(value) {
  return String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
}

function combinedText(candidate) {
  return [
    candidate.title,
    candidate.description,
    ...(candidate.summary || []),
    ...(candidate.sections || []).flatMap((section) => [section.heading, section.body, ...(section.paragraphs || [])]),
  ].join(' ');
}

export function evaluateArticleCandidate(candidate, options = {}) {
  const errors = [];
  const warnings = [];
  const officialUrls = sourceUrls(candidate);

  if (options.existingSlugs?.includes(candidate.slug)) {
    errors.push('duplicate_slug');
  }

  if (
    candidate.canonicalTopic &&
    (options.existingCanonicalTopics || []).map(normalizeTopic).includes(normalizeTopic(candidate.canonicalTopic))
  ) {
    errors.push('duplicate_canonical_topic');
  }

  if (!candidate.slug || !candidate.title || !candidate.description) {
    errors.push('metadata_required');
  }

  if (sourceRequiredCategories.has(candidate.category) && officialUrls.size === 0) {
    errors.push('official_source_required');
  }

  if (sourceRequiredCategories.has(candidate.category) && (candidate.officialSources || []).some((source) => !hasSourceCheckDate(source))) {
    errors.push('official_source_checked_at_required');
  }

  for (const numericClaim of candidate.numericClaims || []) {
    if (!numericClaim.sourceUrl || !officialUrls.has(numericClaim.sourceUrl)) {
      errors.push('numeric_claim_source_required');
      break;
    }
  }

  if (!candidate.calculatorMatches?.some((match) => Number(match.score) >= 60)) {
    errors.push('calculator_match_required');
  }

  if ((candidate.sections || []).length < 3) {
    warnings.push('short_article');
  }

  if (bannedClaimPattern.test(combinedText(candidate))) {
    errors.push('banned_claim');
  }

  const score = Math.max(0, 100 - errors.length * 30 - warnings.length * 8);
  const status = errors.length > 0 ? 'rejected' : score >= 85 ? 'publish_candidate' : 'review_required';

  return {
    score,
    status,
    errors,
    warnings,
  };
}
