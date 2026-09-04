import { expect, test } from 'bun:test';
import { dateInTehran, startOfTehranDayUtc } from './tehran-date';

test('Tehran calendar date is stable for a known 2026 instant', () => {
  const now = new Date('2026-09-04T12:00:00.000Z');
  expect(dateInTehran(now)).toBe('2026-09-04');
});

test('Tehran midnight maps to the correct UTC instant', () => {
  const now = new Date('2026-09-04T12:00:00.000Z');
  expect(startOfTehranDayUtc(now).toISOString()).toBe('2026-09-03T20:30:00.000Z');
  expect(startOfTehranDayUtc(now, 1).toISOString()).toBe('2026-09-02T20:30:00.000Z');
});
