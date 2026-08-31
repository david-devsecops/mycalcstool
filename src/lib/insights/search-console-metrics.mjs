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

export function parseSearchConsoleCsv(csv) {
  const lines = String(csv || '').trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || '').map((header) => header.toLowerCase());

  return lines.map((line) => {
    const cells = splitCsvLine(line);
    const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));

    return {
      page: row['top pages'] || row['상위 페이지'] || row.page || row.pages,
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
  const lines = String(csv || '').trim().split(/\r?\n/).filter(Boolean);
  const headers = splitCsvLine(lines.shift() || '').map((header) => header.toLowerCase());

  return lines
    .map((line) => {
      const cells = splitCsvLine(line);
      const row = Object.fromEntries(headers.map((header, index) => [header, cells[index] || '']));
      const page = row['page path and screen class'] || row['page path + query string'] || row['page path'] || row['페이지 경로 및 화면 클래스'] || row.page;
      const eventName = row['event name'] || row['이벤트 이름'];
      const calculatorId = row['event label'] || row['이벤트 라벨'] || row.event_label;
      const match = page?.match(/\/articles\/([^/]+)\//);

      if (eventName !== 'article_calculator_click' || !match || !calculatorId) return null;

      return {
        slug: match[1],
        calculatorId,
        calculatorClicks: parseNumber(row['event count'] || row['이벤트 수'] || row.events || row.count),
      };
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
      calculatorClickTargets: {},
    };
    current.clicks += row.clicks || 0;
    current.impressions += row.impressions || 0;
    current.weightedPosition += (row.averagePosition || 0) * (row.impressions || 0);
    current.calculatorClicks += row.calculatorClicks || 0;
    if (row.calculatorId && row.calculatorClicks) {
      current.calculatorClickTargets[row.calculatorId] = (current.calculatorClickTargets[row.calculatorId] || 0) + row.calculatorClicks;
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

  return {
    totalClicks,
    totalImpressions,
    totalCalculatorClicks,
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
