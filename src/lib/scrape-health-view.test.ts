import { describe, expect, test } from 'bun:test';
import { getHealthSeverity } from './scrape-health-view';

describe('health severity', () => {
  test('returns healthy for fresh success', () => {
    expect(getHealthSeverity({
      status: 'success',
      lastAttemptAt: null,
      lastSuccessAt: null,
      lastFailureAt: null,
      lastFailureReason: null,
      consecutiveFailures: 0,
      recentRuns: [],
    }, 'fresh')).toBe('healthy');
  });
});

