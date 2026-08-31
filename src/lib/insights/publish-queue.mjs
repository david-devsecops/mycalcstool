const hardDailyLimit = 2;

function withQueueStatus(candidate, reason, status = 'review_required') {
  return { ...candidate, status, reason };
}

export function planArticlePublication(candidates, options = {}) {
  const autoPublish = options.autoPublish === true;
  const existingSlugs = new Set(options.existingSlugs || []);
  const maxPerDay = Math.min(options.maxPerDay ?? 1, hardDailyLimit);
  const remainingSlots = Math.max(0, maxPerDay - (options.alreadyPublishedToday || 0));
  const result = { toPublish: [], queued: [], rejected: [] };

  for (const candidate of candidates) {
    if (existingSlugs.has(candidate.slug)) {
      result.rejected.push(withQueueStatus(candidate, 'duplicate_slug', 'rejected'));
      continue;
    }

    if (candidate.status !== 'publish_candidate' || Number(candidate.qualityScore || 0) < 85) {
      result.queued.push(withQueueStatus(candidate, 'quality_gate_not_passed'));
      continue;
    }

    if (!autoPublish) {
      result.queued.push(withQueueStatus(candidate, 'auto_publish_disabled'));
      continue;
    }

    if (result.toPublish.length >= remainingSlots) {
      result.queued.push(withQueueStatus(candidate, 'daily_publish_limit'));
      continue;
    }

    result.toPublish.push({ ...candidate, status: 'scheduled', reason: 'ready_to_publish' });
    existingSlugs.add(candidate.slug);
  }

  return result;
}
