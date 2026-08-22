import { getFreshnessState, type FreshnessState } from './data-freshness';
import type { DailyData } from '@/types';
import type { ScrapeHealth, ScrapeRunRecord } from './scrape-health';
import { getHealthSeverity, type HealthSeverity } from './scrape-health-view';

export type TokenHealth = 'ok' | 'missing' | 'unknown';
export interface ScrapeOperationsSnapshot {
  severity: HealthSeverity; freshness: FreshnessState; pipelineStatus: ScrapeHealth['status'];
  failureStreak: number; lastAttemptAt: string | null; lastSuccessAt: string | null;
  lastFailureAt: string | null; lastFailureReason: string | null; latestDataAt: string | null;
  tokenHealth: TokenHealth; recentRuns: ScrapeRunRecord[];
}
export function inferTokenHealth(health: ScrapeHealth): TokenHealth {
  if (health.lastFailureReason?.includes('PH_API_TOKEN')) return 'missing';
  if (health.lastSuccessAt) return 'ok';
  return 'unknown';
}
export function buildScrapeOperationsSnapshot(health: ScrapeHealth, latest: DailyData | null, now = new Date()): ScrapeOperationsSnapshot {
  const latestDataAt = latest?.scrapedAt ?? null;
  const freshness = latestDataAt ? getFreshnessState(latestDataAt, now) : 'unknown';
  return { severity: getHealthSeverity(health, freshness), freshness, pipelineStatus: health.status,
    failureStreak: health.consecutiveFailures, lastAttemptAt: health.lastAttemptAt, lastSuccessAt: health.lastSuccessAt,
    lastFailureAt: health.lastFailureAt, lastFailureReason: health.lastFailureReason, latestDataAt,
    tokenHealth: inferTokenHealth(health), recentRuns: health.recentRuns };
}
