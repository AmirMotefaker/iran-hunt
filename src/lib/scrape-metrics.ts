import type { ScrapeTimelineEvent } from './scrape-timeline';

export function calculateScrapeMetrics(events: ScrapeTimelineEvent[]) {
  const total = events.length;
  const success = events.filter((event) => event.status === 'success').length;
  const failure = events.filter((event) => event.status === 'failure').length;

  return {
    totalRuns: total,
    successRate: total ? success / total : 0,
    failureRate: total ? failure / total : 0,
    reliabilityScore: total ? Math.round((success / total) * 100) : 0,
  };
}
