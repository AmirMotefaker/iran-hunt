import type { ScrapeOperationsSnapshot } from './scrape-operations';

export type ScrapeAlertLevel = 'none' | 'warning' | 'critical';

export interface ScrapeAlert {
  level: ScrapeAlertLevel;
  code: 'healthy' | 'single-failure' | 'failure-streak' | 'stale-data' | 'missing-token';
  message: string;
}

export function evaluateScrapeAlert(snapshot: ScrapeOperationsSnapshot): ScrapeAlert {
  if (snapshot.tokenHealth === 'missing') {
    return { level: 'critical', code: 'missing-token', message: 'PH_API_TOKEN is missing or invalid.' };
  }
  if (snapshot.freshness === 'stale') {
    return { level: 'critical', code: 'stale-data', message: 'Published scrape data is stale.' };
  }
  if (snapshot.failureStreak >= 3) {
    return { level: 'critical', code: 'failure-streak', message: `${snapshot.failureStreak} consecutive scrape failures.` };
  }
  if (snapshot.failureStreak > 0 || snapshot.pipelineStatus === 'failed') {
    return { level: 'warning', code: 'single-failure', message: 'The latest scrape attempt failed.' };
  }
  return { level: 'none', code: 'healthy', message: 'Scrape pipeline is healthy.' };
}
