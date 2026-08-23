import { describe, expect, test } from 'bun:test';
import { getOptimizationSignal } from './scrape-learning-optimization';

describe('autonomous learning optimization', () => {
  test('detects optimization need', () => {
    expect(getOptimizationSignal({
      successRate: 0.8,
      averageDurationMs: 70000,
      consecutiveFailures: 0,
    })).toBe('optimize');
  });

  test('keeps stable pipelines stable', () => {
    expect(getOptimizationSignal({
      successRate: 0.99,
      averageDurationMs: 1000,
      consecutiveFailures: 0,
    })).toBe('stable');
  });
});
