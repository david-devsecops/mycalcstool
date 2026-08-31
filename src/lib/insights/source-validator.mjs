import { officialSourceDomains } from '../../data/official-source-allowlist.mjs';

const sourceRequiredCategories = new Set(['finance', 'tax', 'salary', 'support', 'investing', 'ai']);
const categorySourceDomains = {
  finance: ['bok.or.kr', 'fsc.go.kr', 'fss.or.kr', 'moef.go.kr', 'gov.kr', 'law.go.kr'],
  tax: ['nts.go.kr', 'moef.go.kr', 'gov.kr', 'law.go.kr'],
  salary: ['moel.go.kr', 'nts.go.kr', 'mohw.go.kr', 'gov.kr', 'law.go.kr'],
  support: ['gov.kr', 'mohw.go.kr', 'molit.go.kr', 'moel.go.kr', 'moef.go.kr', 'law.go.kr'],
  investing: ['bok.or.kr', 'fsc.go.kr', 'fss.or.kr', 'moef.go.kr', 'law.go.kr'],
  ai: ['openai.com', 'platform.openai.com', 'anthropic.com', 'platform.claude.com', 'ai.google.dev', 'cloud.google.com', 'aws.amazon.com', 'learn.microsoft.com'],
};

function isOfficialHost(host) {
  return officialSourceDomains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function matchesDomain(host, domain) {
  return host === domain || host.endsWith(`.${domain}`);
}

function isOfficialHostForCategory(host, category) {
  return (categorySourceDomains[category] || officialSourceDomains).some((domain) => matchesDomain(host, domain));
}

async function isReachable(url, { fetchImpl, timeoutMs }) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let response = await fetchImpl(url, { method: 'HEAD', signal: controller.signal });

    if (response.status === 405) {
      response = await fetchImpl(url, { method: 'GET', signal: controller.signal });
    }

    return Boolean(response.ok);
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export function validateOfficialSources(candidate) {
  const errors = [];
  const officialSources = [];

  for (const source of candidate.sources || []) {
    try {
      const url = new URL(source.url);
      const host = url.hostname.toLowerCase();

      if (isOfficialHost(host) && isOfficialHostForCategory(host, candidate.category)) {
        officialSources.push({ ...source, host });
      } else if (isOfficialHost(host) && !errors.includes('official_source_category_mismatch')) {
        errors.push('official_source_category_mismatch');
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

export async function validateOfficialSourcesReachability(candidate, options = {}) {
  const fetchImpl = options.fetchImpl || globalThis.fetch;
  const timeoutMs = options.timeoutMs || 5000;
  const result = validateOfficialSources(candidate);

  if (!fetchImpl || result.officialSources.length === 0) {
    return result;
  }

  const officialSources = [];
  const errors = [...result.errors];

  for (const source of result.officialSources) {
    const reachable = await isReachable(source.url, { fetchImpl, timeoutMs });
    officialSources.push({ ...source, reachable });

    if (!reachable && !errors.includes('official_source_unreachable')) {
      errors.push('official_source_unreachable');
    }
  }

  return {
    ok: errors.length === 0,
    errors,
    officialSources,
  };
}
