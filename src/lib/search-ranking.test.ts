import { expect, test } from 'bun:test';
import type { PeriodsData, Product } from '@/types';
import { rankSearchResults } from './search-ranking';

const product = (overrides: Partial<Product>): Product => ({
  id: overrides.slug ?? 'id',
  date: '2026-09-02',
  rank: 1,
  name: 'Example',
  slug: 'example',
  tagline: '',
  description: '',
  category: '',
  url: 'https://example.com',
  votes: 0,
  websiteUrl: 'https://example.com',
  ...overrides,
});

const periods = (items: Partial<PeriodsData>): PeriodsData => ({
  today: [], yesterday: [], week: [], month: [], year: [], ...items,
});

test('Persian fields are searchable and Persian character variants normalize', () => {
  const data = periods({
    year: [product({ slug: 'ai-fa', name: 'Global Tool', faTagline: 'هوش مصنوعی برای کسب و کار' })],
  });

  expect(rankSearchResults(data, 'هوش مصنوعی')[0]?.slug).toBe('ai-fa');
});

test('exact and prefix name matches outrank weaker description matches', () => {
  const data = periods({
    today: [product({ slug: 'weak', name: 'Other', faDescription: 'ابزار حسابداری برای شرکت‌ها', votes: 500 })],
    year: [product({ slug: 'exact', name: 'حسابداری', votes: 1 })],
    month: [product({ slug: 'prefix', name: 'حسابداری هوشمند', votes: 10 })],
  });

  expect(rankSearchResults(data, 'حسابداری').map((item) => item.slug)).toEqual(['exact', 'prefix', 'weak']);
});

test('duplicates do not consume result slots and richer matching copy wins', () => {
  const data = periods({
    today: [product({ slug: 'same', name: 'Alpha', tagline: 'finance', votes: 10 })],
    year: [product({ slug: 'same', name: 'Alpha', faTagline: 'فین‌تک مالی', votes: 100 })],
    month: [product({ slug: 'other', name: 'فین‌تک دوم', votes: 20 })],
  });

  const results = rankSearchResults(data, 'فین‌تک', 8);
  expect(results.map((item) => item.slug)).toEqual(['other', 'same']);
  expect(new Set(results.map((item) => item.slug)).size).toBe(results.length);
});

test('ranking happens before truncation and is deterministic', () => {
  const data = periods({
    today: Array.from({ length: 10 }, (_, index) => product({
      slug: `weak-${index}`,
      name: `Other ${index}`,
      description: 'analytics tool',
      votes: 100 - index,
    })),
    year: [product({ slug: 'best', name: 'analytics', votes: 0 })],
  });

  const first = rankSearchResults(data, 'analytics', 8);
  const second = rankSearchResults(data, 'analytics', 8);
  expect(first[0]?.slug).toBe('best');
  expect(first).toEqual(second);
  expect(first).toHaveLength(8);
});
