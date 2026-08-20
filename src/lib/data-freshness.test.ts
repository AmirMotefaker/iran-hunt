import { describe, expect, test } from 'bun:test';
import { getFreshnessState, selectDefaultPeriod } from './data-freshness';
import type { PeriodsData } from '@/types';

const emptyPeriods = (): PeriodsData => ({
  today: [],
  yesterday: [],
  week: [],
  month: [],
  year: [],
});

describe('selectDefaultPeriod', () => {
  test('prefers today when today has data', () => {
    const periods = emptyPeriods();
    periods.today = [{ slug: 'today' } as never];
    periods.yesterday = [{ slug: 'yesterday' } as never];
    expect(selectDefaultPeriod(periods)).toBe('today');
  });

  test('falls back to the newest non-empty period', () => {
    const periods = emptyPeriods();
    periods.week = [{ slug: 'week' } as never];
    periods.month = [{ slug: 'month' } as never];
    expect(selectDefaultPeriod(periods)).toBe('week');
  });

  test('returns today when every period is empty', () => {
    expect(selectDefaultPeriod(emptyPeriods())).toBe('today');
  });
});

describe('getFreshnessState', () => {
  const now = new Date('2026-08-21T12:00:00.000Z');

  test('marks data within 36 hours as fresh', () => {
    expect(getFreshnessState('2026-08-20T20:57:48.772Z', now)).toBe('fresh');
  });

  test('marks older data as stale', () => {
    expect(getFreshnessState('2026-08-19T00:00:00.000Z', now)).toBe('stale');
  });

  test('marks invalid or future timestamps as unknown', () => {
    expect(getFreshnessState('invalid', now)).toBe('unknown');
    expect(getFreshnessState('2026-08-22T00:00:00.000Z', now)).toBe('unknown');
  });
});
