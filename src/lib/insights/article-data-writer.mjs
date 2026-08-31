function asParagraphs(section) {
  if (Array.isArray(section.paragraphs)) return section.paragraphs;
  return [section.body].filter(Boolean);
}

function readTime(sections) {
  const words = sections.flatMap((section) => asParagraphs(section)).join(' ').length;
  return `${Math.max(3, Math.ceil(words / 450))}분`;
}

function ctaLabel(match) {
  return match.name || '관련 계산기';
}

export function buildArticleDataEntry(candidate, publishDate = new Date().toISOString().slice(0, 10)) {
  return {
    slug: candidate.slug,
    language: candidate.language || 'ko',
    status: 'published',
    noIndex: false,
    category: candidate.categoryLabel || candidate.category,
    categoryKey: candidate.category,
    title: candidate.title,
    description: candidate.description,
    publishedDate: publishDate,
    updatedDate: publishDate,
    readTime: readTime(candidate.sections || []),
    summary: candidate.summary || [],
    sections: (candidate.sections || []).map((section) => ({
      heading: section.heading,
      paragraphs: asParagraphs(section),
    })),
    calculatorCtas: (candidate.calculatorMatches || []).map((match) => ({
      calculatorId: match.id,
      href: match.path,
      label: ctaLabel(match),
      description: '내 조건으로 직접 계산합니다.',
    })),
    officialSources: candidate.officialSources || [],
    disclaimerType: candidate.disclaimerType || candidate.category,
  };
}

function existingSlugSet(moduleSource) {
  return new Set([...moduleSource.matchAll(/["']?slug["']?\s*:\s*["']([^"']+)["']/g)].map((match) => match[1]));
}

export function buildUpdatedArticlesModule(moduleSource, candidates, publishDate) {
  const slugs = existingSlugSet(moduleSource);
  const entries = candidates.map((candidate) => {
    if (slugs.has(candidate.slug)) {
      throw new Error(`duplicate_slug:${candidate.slug}`);
    }
    slugs.add(candidate.slug);
    return buildArticleDataEntry(candidate, publishDate);
  });

  if (entries.length === 0) return moduleSource;

  const insertion = entries.map((entry) => `  ${JSON.stringify(entry, null, 2).replace(/\n/g, '\n  ')},`).join('\n');
  const marker = '\n];';
  const index = moduleSource.indexOf(marker);
  if (index === -1) throw new Error('articles_array_marker_missing');

  return `${moduleSource.slice(0, index)}\n${moduleSource.endsWith('[\n') ? '' : ''}${insertion}${moduleSource.slice(index)}`;
}
