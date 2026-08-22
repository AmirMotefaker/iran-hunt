import { describe, expect, test } from 'bun:test';
import { getPredictiveRisk } from './scrape-predictive-intelligence';

describe('predictive scrape intelligence', () => {
  test('detects high risk', () => {
    expect(getPredictiveRisk({
      successRate: 0.4,
      consecutiveFailures: 3,
      averageDurationMs: 1000,
    })).toBe('high');
  });

  test('keeps healthy pipeline low risk', () => {
    expect(getPredictiveRisk({
      successRate: 0.95,
      consecutiveFailures: 0,
      averageDurationMs: 900,
    })).toBe('low');
  });
});
