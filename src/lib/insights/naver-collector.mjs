import { retryOperation } from './retry.mjs';

const endpoint = 'https://openapi.naver.com/v1/search/news.json';
const defaultRetryDelaysMs = [30000, 120000, 600000];

function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function toIsoDate(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function buildSearchUrl({ query = '기준금리', display = 10, start = 1, sort = 'date' } = {}) {
  const url = new URL(endpoint);
  url.searchParams.set('query', query);
  url.searchParams.set('display', String(Math.min(Math.max(Number(display) || 10, 1), 100)));
  url.searchParams.set('start', String(Math.min(Math.max(Number(start) || 1, 1), 1000)));
  url.searchParams.set('sort', sort === 'sim' ? 'sim' : 'date');
  return url.toString();
}

function mapItem(item) {
  const url = item.originallink || item.link;

  return {
    title: stripHtml(item.title),
    url,
    naverUrl: item.link,
    sourceName: 'Naver News Search',
    summary: stripHtml(item.description),
    publishedAt: toIsoDate(item.pubDate),
    language: 'ko',
    collectedAt: new Date().toISOString(),
  };
}

export async function collectNaverNewsIssues({
  env = process.env,
  fetchImpl = globalThis.fetch,
  query = '기준금리',
  display = 10,
  start = 1,
  existingUrls = new Set(),
  retryDelaysMs = defaultRetryDelaysMs,
  delay,
} = {}) {
  if (env.ENABLE_ISSUE_COLLECTOR !== 'true') {
    return { status: 'disabled', issues: [] };
  }

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return { status: 'failed', error: 'naver_credentials_required', issues: [] };
  }

  let response;

  try {
    response = await retryOperation(
      async () => {
        const nextResponse = await fetchImpl(buildSearchUrl({ query, display, start }), {
          headers: {
            'X-Naver-Client-Id': env.NAVER_CLIENT_ID,
            'X-Naver-Client-Secret': env.NAVER_CLIENT_SECRET,
          },
        });

        if (!nextResponse.ok && (nextResponse.status === 429 || nextResponse.status >= 500)) {
          throw new Error(`naver_api_${nextResponse.status}`);
        }

        return nextResponse;
      },
      { delaysMs: retryDelaysMs, delay },
    );
  } catch (error) {
    return { status: 'failed', error: error.message, issues: [] };
  }

  if (!response.ok) {
    return { status: 'failed', error: `naver_api_${response.status}`, issues: [] };
  }

  const payload = await response.json();
  const issues = (payload.items || [])
    .map(mapItem)
    .filter((item) => item.url && !existingUrls.has(item.url));

  return { status: 'collected', issues };
}
