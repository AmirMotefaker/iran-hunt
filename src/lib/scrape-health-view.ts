import type { ScrapeHealth } from './scrape-health';
import type { FreshnessState } from './data-freshness';

export type HealthSeverity = 'healthy' | 'warning' | 'critical';

export function getHealthSeverity(
  health: ScrapeHealth,
  freshness: FreshnessState,
): HealthSeverity {
  if (health.consecutiveFailures >= 3 || freshness === 'stale') return 'critical';
  if (health.status === 'failed' || health.consecutiveFailures > 0) return 'warning';
  return 'healthy';
}
