import { describe, expect, test } from 'bun:test';
import { decideScrapeRecovery } from './scrape-recovery';

describe('scrape recovery policy', () => {
  test('does not retry healthy runs', () => {
    expect(decideScrapeRecovery(0, null).shouldRetry).toBe(false);
  });

  test('uses bounded backoff for first two failures', () => {
    expect(decideScrapeRecovery(1, null)).toMatchObject({ shouldRetry: true, delayMinutes: 5 });
    expect(decideScrapeRecovery(2, null)).toMatchObject({ shouldRetry: true, delayMinutes: 15 });
  });

  test('stops automatic retries after the limit', () => {
    expect(decideScrapeRecovery(3, null).reason).toBe('limit-reached');
  });

  test('honors cooldown window', () => {
    expect(decideScrapeRecovery(
      1,
      '2026-08-22T10:00:00.000Z',
      new Date('2026-08-22T10:02:00.000Z'),
    )).toMatchObject({ shouldRetry: false, delayMinutes: 3, reason: 'cooldown' });
  });
});
