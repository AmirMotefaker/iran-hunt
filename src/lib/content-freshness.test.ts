import { expect, test } from 'bun:test';
import { aggregateFreshness, classifyFreshness } from './content-freshness';
import type { Product } from '@/types';

const now = new Date('2026-09-03T12:00:00Z');

function product(slug: string, date: string): Product {
  return {
    id: slug,
    date,
    rank: 1,
    name: slug,
    slug,
    tagline: 'Example',
    description: 'Example',
    category: 'AI',
    url: `https://example.com/${slug}`,
    votes: 1,
    websiteUrl: `https://${slug}.example`,
  };
}

test('classifies fresh, aging and stale repository dates deterministically', () => {
  expect(classifyFreshness('2026-09-03', now).status).toBe('fresh');
  expect(classifyFreshness('2026-08-20', now).status).toBe('aging');
  expect(classifyFreshness('2026-07-01', now).status).toBe('stale');
});

test('invalid and future dates are unknown instead of pretending freshness', () => {
  expect(classifyFreshness('not-a-date', now).status).toBe('unknown');
  expect(classifyFreshness('2026-09-04', now).status).toBe('unknown');
});

test('aggregate freshness exposes mixed dataset counts and latest real date', () => {
  const summary = aggregateFreshness([
    product('fresh', '2026-09-03'),
    product('aging', '2026-08-20'),
    product('stale', '2026-07-01'),
  ], now);

  expect(summary.latestDataDate).toBe('2026-09-03');
  expect(summary.freshCount).toBe(1);
  expect(summary.agingCount).toBe(1);
  expect(summary.staleCount).toBe(1);
  expect(summary.unknownCount).toBe(0);
  expect(summary.score).not.toBeNull();
});
