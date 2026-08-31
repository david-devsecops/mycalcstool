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
      page: row['top pages'] || row.page || row.pages,
      clicks: parseNumber(row.clicks),
      impressions: parseNumber(row.impressions),
      ctr: parseCtr(row.ctr),
      averagePosition: parseNumber(row.position || row['average position']),
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
