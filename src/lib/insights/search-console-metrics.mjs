function parseNumber(value) {
  return Number(String(value || '').replace(/[% ,]/g, ''));
}

function parseCtr(value) {
  const number = parseNumber(value);
  return Number.isFinite(number) ? number / 100 : 0;
}

function splitCsvLine(line) {
  const cells = [];
  let current = '';
  let quoted = false;

  for (const char of line) {
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === ',' && !quoted) {
      cells.push(current);
      current = '';
      continue;
    }
    current += char;
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function metricKind(row) {
  if (row.calculatorClicks) return 'article-calculator';
  if (row.relatedArticleClicks) return 'article-related';
  if (row.articleIndexClicks) return 'article-index';
  if (row.calculatorToArticleClicks) return 'calculator-article';
  if (row.faqClicks) return 'article-faq';
  if (row.query) return 'search-query';
  return 'search';
}

function metricTarget(row) {
  return row.calculatorId || row.targetArticleSlug || row.sourceCalculatorId || row.faqQuestion || row.query || 'page';
}

function cleanIdPart(value) {
  return String(value || 'unknown').trim().replace(/\s+/g, '-').replace(/[^\p{L}\p{N}._:-]+/gu, '-');
}

export function buildContentMetricRecordId(importedAt, row) {
  return [
    importedAt,
    cleanIdPart(row.slug),
    metricKind(row),
    cleanIdPart(metricTarget(row)),
  ].join('-');
}

export function parseSearchConsoleCsv(csv) {
  const lines = String(csv || '').trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || '').map((header) => header.toLowerCase());

  return lines.map((line) => {
    const cells = splitCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));

    return {
      page: row['top pages'] || row['상위 페이지'] || row.page || row.pages,
      query: row['top queries'] || row['상위 검색어'] || row.query || row.queries,
      clicks: parseNumber(row.clicks || row['클릭수']),
      impressions: parseNumber(row.impressions || row['노출수']),
      ctr: parseCtr(row.ctr),
      averagePosition: parseNumber(row.position || row['average position'] || row['게재순위']),
    };
  });
}

export function summarizeArticleMetrics(rows) {
  return rows
    .map((row) => {
      const match = row.page?.match(/\/articles\/([^/]+)\//);
      if (!match) return null;
      return { slug: match[1], ...row };
    })
    .filter(Boolean);
}

export function parseGa4CalculatorClickCsv(csv) {
  return parseGa4ArticleInteractionCsv(csv)
    .filter((row) => row.calculatorId && row.calculatorClicks);
}

export function parseGa4ArticleInteractionCsv(csv) {
  const lines = String(csv || '').trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || '').map((header) => header.toLowerCase());

  return lines
    .map((line) => {
      const cells = splitCsvLine(line);
      const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));
      const page = row['page path and screen class'] || row['page path + query string'] || row['page path'] || row['페이지 경로 및 화면 클래스'] || row.page;
      const eventName = row['event name'] || row['이벤트 이름'];
      const eventLabel = row['event label'] || row['이벤트 라벨'] || row.event_label;
      const eventCount = parseNumber(row['event count'] || row['이벤트 수'] || row.events || row.count);
      const match = page?.match(/\/articles\/([^/]+)\//);

      if (eventName === 'article_calculator_click' && match && eventLabel) {
        return {
          slug: match[1],
          calculatorId: eventLabel,
          calculatorClicks: eventCount,
        };
      }

      if (eventName === 'article_related_article_click' && match && eventLabel) {
        const [, targetArticleSlug] = eventLabel.split(':');
        if (!targetArticleSlug) return null;

        return {
          slug: match[1],
          targetArticleSlug,
          relatedArticleClicks: eventCount,
        };
      }

      if (eventName === 'article_index_article_click' && eventLabel) {
        return {
          slug: eventLabel,
          articleIndexClicks: eventCount,
        };
      }

      if (eventName === 'calculator_related_article_click' && eventLabel) {
        const [sourceCalculatorId, slug] = eventLabel.split(':');
        if (!sourceCalculatorId || !slug) return null;

        return {
          slug,
          sourceCalculatorId,
          calculatorToArticleClicks: eventCount,
        };
      }

      if (eventName === 'article_faq_toggle' && match && eventLabel) {
        return {
          slug: match[1],
          faqQuestion: eventLabel,
          faqClicks: eventCount,
        };
      }

      return null;
    })
    .filter(Boolean);
}

export function summarizeImportedMetrics(rows, options = {}) {
  const bySlug = new Map();

  for (const row of rows) {
    const current = bySlug.get(row.slug) || {
      slug: row.slug,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
      calculatorClicks: 0,
      relatedArticleClicks: 0,
      articleIndexClicks: 0,
      calculatorToArticleClicks: 0,
      faqClicks: 0,
      calculatorClickTargets: {},
      relatedArticleClickTargets: {},
      calculatorToArticleSources: {},
      faqClickTargets: {},
      searchQueries: {},
    };
    current.clicks += row.clicks || 0;
    current.impressions += row.impressions || 0;
    current.weightedPosition += (row.averagePosition || 0) * (row.impressions || 0);
    current.calculatorClicks += row.calculatorClicks || 0;
    current.relatedArticleClicks += row.relatedArticleClicks || 0;
    current.articleIndexClicks += row.articleIndexClicks || 0;
    current.calculatorToArticleClicks += row.calculatorToArticleClicks || 0;
    current.faqClicks += row.faqClicks || 0;
    if (row.calculatorId && row.calculatorClicks) {
      current.calculatorClickTargets[row.calculatorId] = (current.calculatorClickTargets[row.calculatorId] || 0) + row.calculatorClicks;
    }
    if (row.targetArticleSlug && row.relatedArticleClicks) {
      current.relatedArticleClickTargets[row.targetArticleSlug] = (current.relatedArticleClickTargets[row.targetArticleSlug] || 0) + row.relatedArticleClicks;
    }
    if (row.sourceCalculatorId && row.calculatorToArticleClicks) {
      current.calculatorToArticleSources[row.sourceCalculatorId] = (current.calculatorToArticleSources[row.sourceCalculatorId] || 0) + row.calculatorToArticleClicks;
    }
    if (row.faqQuestion && row.faqClicks) {
      current.faqClickTargets[row.faqQuestion] = (current.faqClickTargets[row.faqQuestion] || 0) + row.faqClicks;
    }
    if (row.query) {
      const query = current.searchQueries[row.query] || { clicks: 0, impressions: 0 };
      query.clicks += row.clicks || 0;
      query.impressions += row.impressions || 0;
      current.searchQueries[row.query] = query;
    }
    bySlug.set(row.slug, current);
  }

  const articleMetrics = [...bySlug.values()].map((row) => ({
      ...row,
      ctr: row.impressions > 0 ? row.clicks / row.impressions : 0,
      averagePosition: row.impressions > 0 ? row.weightedPosition / row.impressions : 0,
    }));

  const sortedArticleMetrics = articleMetrics.sort((left, right) => right.clicks - left.clicks);
  const topArticles = sortedArticleMetrics.slice(0, options.limit ?? 5);
  const totalClicks = articleMetrics.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = articleMetrics.reduce((sum, row) => sum + row.impressions, 0);
  const totalCalculatorClicks = articleMetrics.reduce((sum, row) => sum + row.calculatorClicks, 0);
  const totalRelatedArticleClicks = articleMetrics.reduce((sum, row) => sum + row.relatedArticleClicks, 0);
  const totalArticleIndexClicks = articleMetrics.reduce((sum, row) => sum + row.articleIndexClicks, 0);
  const totalCalculatorToArticleClicks = articleMetrics.reduce((sum, row) => sum + row.calculatorToArticleClicks, 0);
  const totalFaqClicks = articleMetrics.reduce((sum, row) => sum + row.faqClicks, 0);

  return {
    totalClicks,
    totalImpressions,
    totalCalculatorClicks,
    totalRelatedArticleClicks,
    totalArticleIndexClicks,
    totalCalculatorToArticleClicks,
    totalFaqClicks,
    ctr: totalImpressions > 0 ? totalClicks / totalImpressions : 0,
    articles: sortedArticleMetrics,
    topArticles,
  };
}

function daysBetween(left, right) {
  const start = new Date(left);
  const end = new Date(right);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0;
  return Math.floor((end.getTime() - start.getTime()) / 86400000);
}

function classifyMetric(row, article, options) {
  const ageDays = daysBetween(article?.publishedDate, options.now || new Date().toISOString());
  const ctr = row.impressions > 0 ? row.clicks / row.impressions : 0;

  if (ageDays <= (options.newDays ?? 14)) return 'NEW';
  if ((row.impressions || 0) === 0 && ageDays >= (options.deadAfterDays ?? 45)) return 'DEAD';
  if ((row.clicks || 0) >= 10 && (row.impressions || 0) >= 100 && (row.averagePosition || 99) <= 10) return 'WINNER';
  if ((row.impressions || 0) >= 100 && (row.clicks === 0 || ctr < 0.01 || (row.averagePosition || 0) > 20)) return 'UNDERPERFORM';
  if ((row.impressions || 0) >= 50 && (row.clicks || 0) > 0) return 'GROWING';
  return 'NORMAL';
}

export function classifyArticlePerformance(rows, publishedArticles = [], options = {}) {
  const metrics = summarizeImportedMetrics(rows, { limit: Number.MAX_SAFE_INTEGER }).articles;
  const metricsBySlug = new Map(metrics.map((row) => [row.slug, row]));
  const slugs = new Set([...publishedArticles.map((article) => article.slug), ...metrics.map((row) => row.slug)]);

  return [...slugs].map((slug) => {
    const article = publishedArticles.find((item) => item.slug === slug) || { slug };
    const metric = metricsBySlug.get(slug) || { slug, clicks: 0, impressions: 0, ctr: 0, averagePosition: 0 };

    return {
      ...metric,
      status: classifyMetric(metric, article, options),
    };
  });
}
