import { describe, expect, test } from 'bun:test';
import { evaluateScrapeAlert } from './scrape-alerts';
import type { ScrapeOperationsSnapshot } from './scrape-operations';

const base: ScrapeOperationsSnapshot = {
  severity: 'healthy', freshness: 'fresh', pipelineStatus: 'success',
  failureStreak: 0, lastAttemptAt: null, lastSuccessAt: null,
  lastFailureAt: null, lastFailureReason: null, latestDataAt: null,
  tokenHealth: 'ok', recentRuns: [],
};

describe('scrape alerts', () => {
  test('healthy pipeline has no alert', () => {
    expect(evaluateScrapeAlert(base).level).toBe('none');
  });

  test('single failure warns and repeated failures are critical', () => {
    expect(evaluateScrapeAlert({ ...base, failureStreak: 1, pipelineStatus: 'failed' }).level).toBe('warning');
    expect(evaluateScrapeAlert({ ...base, failureStreak: 3, pipelineStatus: 'failed' }).level).toBe('critical');
  });

  test('stale data and missing token are critical', () => {
    expect(evaluateScrapeAlert({ ...base, freshness: 'stale' }).code).toBe('stale-data');
    expect(evaluateScrapeAlert({ ...base, tokenHealth: 'missing' }).code).toBe('missing-token');
  });
});
