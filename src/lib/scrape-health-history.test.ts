import { describe, expect, test } from 'bun:test';
import { EMPTY_SCRAPE_HEALTH, failScrapeHealth, startScrapeHealth, succeedScrapeHealth } from './scrape-health';
describe('scrape health run history', () => {
  test('records successful completed runs', () => {
    const running = startScrapeHealth(EMPTY_SCRAPE_HEALTH, '2026-08-22T08:00:00.000Z');
    const h = succeedScrapeHealth(running, '2026-08-22T08:01:00.000Z');
    expect(h.recentRuns).toHaveLength(1); expect(h.recentRuns[0].status).toBe('success'); expect(h.recentRuns[0].error).toBeNull();
  });
  test('keeps only latest 20 failed runs', () => {
    let h = EMPTY_SCRAPE_HEALTH;
    for (let i=0;i<25;i++) { h=startScrapeHealth(h, `2026-08-22T08:${String(i).padStart(2,'0')}:00.000Z`); h=failScrapeHealth(h, new Error(`failure-${i}`), `2026-08-22T08:${String(i).padStart(2,'0')}:30.000Z`); }
    expect(h.recentRuns).toHaveLength(20); expect(h.recentRuns[0].error).toBe('failure-24'); expect(h.recentRuns[19].error).toBe('failure-5');
  });
});
