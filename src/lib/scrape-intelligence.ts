import type { ScrapeTimelineEvent } from './scrape-timeline';

export function buildScrapeIntelligence(events: ScrapeTimelineEvent[]) {
  const total = events.length;
  const success = events.filter((e) => e.status === 'success').length;
  const failure = events.filter((e) => e.status === 'failure').length;

  const durations = events
    .map((e) => e.durationMs)
    .filter((v): v is number => typeof v === 'number');

  return {
    totalRuns: total,
    successRate: total ? Math.round((success / total) * 100) : 0,
    failureRate: total ? Math.round((failure / total) * 100) : 0,
    averageDurationMs: durations.length
      ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
      : 0,
  };
}
