import { describe, expect, test } from 'bun:test';
import { EMPTY_SCRAPE_HEALTH } from './scrape-health';
import { buildScrapeOperationsSnapshot, inferTokenHealth } from './scrape-operations';
const periods = { today: [], yesterday: [], week: [], month: [], year: [] };
describe('scrape operations snapshot', () => {
  test('reports healthy fresh data after success', () => {
    const health = { ...EMPTY_SCRAPE_HEALTH, status: 'success' as const, lastSuccessAt: '2026-08-22T08:00:00.000Z' };
    const s = buildScrapeOperationsSnapshot(health, { date: '2026-08-22', scrapedAt: '2026-08-22T08:00:00.000Z', periods }, new Date('2026-08-22T09:00:00.000Z'));
    expect(s.severity).toBe('healthy'); expect(s.freshness).toBe('fresh'); expect(s.tokenHealth).toBe('ok');
  });
  test('reports critical for stale published data', () => {
    const s = buildScrapeOperationsSnapshot(EMPTY_SCRAPE_HEALTH, { date: '2026-08-20', scrapedAt: '2026-08-20T00:00:00.000Z', periods }, new Date('2026-08-22T00:00:01.000Z'));
    expect(s.freshness).toBe('stale'); expect(s.severity).toBe('critical');
  });
  test('infers missing token from last failure', () => {
    expect(inferTokenHealth({ ...EMPTY_SCRAPE_HEALTH, status: 'failed', lastFailureReason: 'PH_API_TOKEN is required', consecutiveFailures: 1 })).toBe('missing');
  });
});
