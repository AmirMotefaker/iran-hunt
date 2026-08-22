import { describe, expect, test } from 'bun:test';
import { assertValidPeriods, requireProductHuntToken, validatePeriods } from './scrape-validation';
import type { PeriodKey, PeriodsData, Product } from '@/types';

function product(period: PeriodKey, index: number, votes = index + 1): Product {
  return {
    id: `ph-${period}-${index + 1}`,
    date: '2026-08-22',
    rank: index + 1,
    name: `${period}-${index + 1}`,
    slug: `${period}-${index + 1}`,
    tagline: 'tagline',
    description: 'description',
    category: 'General',
    url: `https://www.producthunt.com/posts/${period}-${index + 1}`,
    votes,
    websiteUrl: '',
    comments: [],
  };
}

function validPeriods(): PeriodsData {
  return {
    today: Array.from({ length: 3 }, (_, i) => product('today', i, i + 1)),
    yesterday: Array.from({ length: 3 }, (_, i) => product('yesterday', i)),
    week: Array.from({ length: 5 }, (_, i) => product('week', i)),
    month: Array.from({ length: 5 }, (_, i) => product('month', i)),
    year: Array.from({ length: 5 }, (_, i) => product('year', i)),
  };
}

describe('scrape validation', () => {
  test('accepts a complete five-period scrape', () => {
    expect(validatePeriods(validPeriods())).toEqual([]);
    expect(() => assertValidPeriods(validPeriods())).not.toThrow();
  });

  test('rejects incomplete periods', () => {
    const periods = validPeriods();
    periods.month = [];
    expect(() => assertValidPeriods(periods)).toThrow('month');
  });

  test('rejects empty or duplicate slugs', () => {
    const periods = validPeriods();
    periods.week[0].slug = '';
    periods.week[2].slug = periods.week[1].slug;
    const messages = validatePeriods(periods).map((issue) => issue.message);
    expect(messages.some((message) => message.includes('empty slug'))).toBe(true);
    expect(messages.some((message) => message.includes('duplicate slug'))).toBe(true);
  });

  test('rejects today data without a real vote count and requires PH_API_TOKEN', () => {
    const periods = validPeriods();
    periods.today = periods.today.map((item) => ({ ...item, votes: 0 }));
    expect(() => assertValidPeriods(periods)).toThrow('real vote count');
    expect(() => requireProductHuntToken(undefined)).toThrow('PH_API_TOKEN');
    expect(requireProductHuntToken(' token ')).toBe('token');
  });
});
