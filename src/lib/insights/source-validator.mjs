import { officialSourceDomains } from '../../data/official-source-allowlist.mjs';

const sourceRequiredCategories = new Set(['finance', 'tax', 'salary', 'support', 'investing', 'ai']);

function isOfficialHost(host) {
  return officialSourceDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

export function validateOfficialSources(candidate) {
  const errors = [];
  const officialSources = [];

  for (const source of candidate.sources || []) {
    try {
      const url = new URL(source.url);
      const host = url.hostname.toLowerCase();

      if (isOfficialHost(host)) {
        officialSources.push({ ...source, host });
      }
    } catch {
      errors.push('invalid_source_url');
    }
  }

  if (sourceRequiredCategories.has(candidate.category) && officialSources.length === 0) {
    errors.push('official_source_required');
  }

  return {
    ok: errors.length === 0,
    errors,
    officialSources,
  };
}

