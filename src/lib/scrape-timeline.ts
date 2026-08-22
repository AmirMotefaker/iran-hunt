export type ScrapeTimelineEvent = {
  id: string;
  status: 'running' | 'success' | 'failure';
  startedAt: string;
  finishedAt?: string;
  durationMs?: number;
  reason?: string;
};

export function createTimelineEvent(
  status: ScrapeTimelineEvent['status'],
  startedAt: string,
  finishedAt?: string,
  reason?: string,
): ScrapeTimelineEvent {
  const durationMs = finishedAt
    ? new Date(finishedAt).getTime() - new Date(startedAt).getTime()
    : undefined;

  return {
    id: `${status}-${startedAt}`,
    status,
    startedAt,
    finishedAt,
    durationMs,
    reason,
  };
}
