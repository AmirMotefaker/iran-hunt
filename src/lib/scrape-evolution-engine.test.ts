import { describe, expect, test } from 'bun:test';
import { getEvolutionSignal } from './scrape-evolution-engine';

describe('autonomous evolution engine', () => {
  test('evolves after repeated failures', () => {
    expect(getEvolutionSignal({
      reliabilityScore: 0.7,
      optimizationNeeded: true,
      consecutiveFailures: 3,
    })).toBe('evolve');
  });

  test('keeps healthy systems stable', () => {
    expect(getEvolutionSignal({
      reliabilityScore: 0.99,
      optimizationNeeded: false,
      consecutiveFailures: 0,
    })).toBe('stable');
  });
});
