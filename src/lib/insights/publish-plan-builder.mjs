export function buildPublishPlanRecords(plan, plannedAt = new Date().toISOString()) {
  return ['toPublish', 'queued', 'rejected'].flatMap((queue) =>
    (plan[queue] || []).map((candidate) => ({
      id: `${plannedAt}-${queue}-${candidate.id}`,
      articleCandidateId: candidate.id,
      slug: candidate.slug,
      status: candidate.status,
      reason: candidate.reason,
      queue,
      plannedAt,
    })),
  );
}
