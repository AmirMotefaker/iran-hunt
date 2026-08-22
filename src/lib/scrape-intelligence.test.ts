import { describe, expect, test } from 'bun:test';
import { buildScrapeIntelligence } from './scrape-intelligence';

describe('scrape intelligence', () => {
  test('calculates reliability metrics', () => {
    const result = buildScrapeIntelligence([
      { id: '1', status: 'success', startedAt: '2026-01-01', durationMs: 1000 },
      { id: '2', status: 'failure', startedAt: '2026-01-02', durationMs: 3000 },
    ]);

    expect(result.successRate).toBe(50);
    expect(result.failureRate).toBe(50);
    expect(result.averageDurationMs).toBe(2000);
  });
});
