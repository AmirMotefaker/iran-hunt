import { describe, expect, test } from 'bun:test';
import { decideRemediation } from './scrape-self-healing';

describe('self healing scrape decisions', () => {
  test('escalates repeated failures', () => {
    expect(decideRemediation({
      reason: 'api failure',
      consecutiveFailures: 3,
      staleData: true,
    })).toBe('escalate');
  });

  test('retries timeout failures', () => {
    expect(decideRemediation({
      reason: 'timeout',
      consecutiveFailures: 1,
      staleData: false,
    })).toBe('retry');
  });
});
