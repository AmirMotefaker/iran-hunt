import { describe, expect, test } from 'bun:test';
import { decideOperation } from './scrape-autonomous-operations';

describe('autonomous operations decision engine', () => {
  test('escalates repeated high risk failures', () => {
    expect(decideOperation({
      risk: 'high',
      consecutiveFailures: 3,
    })).toBe('escalate');
  });

  test('continues healthy operations', () => {
    expect(decideOperation({
      risk: 'low',
      consecutiveFailures: 0,
    })).toBe('continue');
  });
});
