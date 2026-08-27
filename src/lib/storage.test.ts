import { expect, test } from 'bun:test';
import { isDailyDataFilename } from './storage';

test('daily data filename filter accepts only YYYY-MM-DD json files', () => {
  expect(isDailyDataFilename('2026-08-26.json')).toBe(true);
  expect(isDailyDataFilename('2026-01-01.json')).toBe(true);
  expect(isDailyDataFilename('scrape-health.json')).toBe(false);
  expect(isDailyDataFilename('health.json')).toBe(false);
  expect(isDailyDataFilename('2026-08-26.backup.json')).toBe(false);
  expect(isDailyDataFilename('.gitkeep')).toBe(false);
});
