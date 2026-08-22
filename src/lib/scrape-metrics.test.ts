import { describe, expect, test } from 'bun:test';
import { calculateScrapeMetrics } from './scrape-metrics';

describe('scrape metrics', () => {
  test('calculates reliability score', () => {
    const result = calculateScrapeMetrics([
      { id: '1', status: 'success', startedAt: '2026-01-01' },
      { id: '2', status: 'failure', startedAt: '2026-01-02' },
    ]);

    expect(result.reliabilityScore).toBe(50);
    expect(result.totalRuns).toBe(2);
  });
});
