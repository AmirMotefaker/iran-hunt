import { describe, expect, test } from 'bun:test';
import {
  EMPTY_SCRAPE_HEALTH,
  failScrapeHealth,
  startScrapeHealth,
  succeedScrapeHealth,
} from './scrape-health';

describe('scrape health transitions', () => {
  test('marks an attempt as running without erasing prior success', () => {
    const previous = {
      ...EMPTY_SCRAPE_HEALTH,
      status: 'success' as const,
      lastSuccessAt: '2026-08-20T20:30:00.000Z',
    };
    const health = startScrapeHealth(previous, '2026-08-21T20:30:00.000Z');
    expect(health.status).toBe('running');
    expect(health.lastAttemptAt).toBe('2026-08-21T20:30:00.000Z');
    expect(health.lastSuccessAt).toBe('2026-08-20T20:30:00.000Z');
  });

  test('success updates last success and resets failure state', () => {
    const previous = {
      ...EMPTY_SCRAPE_HEALTH,
      status: 'running' as const,
      lastAttemptAt: '2026-08-21T20:30:00.000Z',
      lastFailureReason: 'old failure',
      consecutiveFailures: 3,
    };
    const health = succeedScrapeHealth(previous, '2026-08-21T20:31:00.000Z');
    expect(health.status).toBe('success');
    expect(health.lastSuccessAt).toBe('2026-08-21T20:31:00.000Z');
    expect(health.lastFailureReason).toBeNull();
    expect(health.consecutiveFailures).toBe(0);
  });

  test('failure increments consecutive failures and preserves last success', () => {
    const previous = {
      ...EMPTY_SCRAPE_HEALTH,
      status: 'running' as const,
      lastAttemptAt: '2026-08-21T20:30:00.000Z',
      lastSuccessAt: '2026-08-20T20:31:00.000Z',
      consecutiveFailures: 1,
    };
    const health = failScrapeHealth(
      previous,
      new Error('Refusing to publish incomplete scrape:\n- today: expected 3'),
      '2026-08-21T20:31:00.000Z',
    );
    expect(health.status).toBe('failed');
    expect(health.lastFailureAt).toBe('2026-08-21T20:31:00.000Z');
    expect(health.lastSuccessAt).toBe('2026-08-20T20:31:00.000Z');
    expect(health.consecutiveFailures).toBe(2);
    expect(health.lastFailureReason).toContain('Refusing to publish incomplete scrape');
    expect(health.lastFailureReason).not.toContain('\n');
  });

  test('failure reasons are bounded and empty state is stable', () => {
    const health = failScrapeHealth(EMPTY_SCRAPE_HEALTH, new Error('x'.repeat(700)));
    expect(health.lastFailureReason?.length).toBe(500);
    expect(health.consecutiveFailures).toBe(1);
    expect(EMPTY_SCRAPE_HEALTH.consecutiveFailures).toBe(0);
  });
});
