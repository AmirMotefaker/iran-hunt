import { describe, expect, test } from 'bun:test';
import {
  buildComparisonCandidate,
  findComparisonProducts,
  normalizeComparisonPair,
  rankAlternatives,
} from './comparison-engine';
import type { Product } from '@/types';

const product = (slug: string, category: string, votes: number): Product => ({
  id: slug,
  date: '2026-09-03',
  rank: 1,
  name: slug,
  slug,
  tagline: category,
  description: category,
  category,
  url: `https://example.com/${slug}`,
  votes,
  websiteUrl: `https://example.com/${slug}`,
});

describe('P58 comparison engine', () => {
  const alpha = product('alpha', 'AI • Productivity', 100);
  const beta = product('beta', 'AI • Productivity', 300);
  const gamma = product('gamma', 'AI', 200);
  const travel = product('travel', 'Travel', 500);

  test('normalizes pair order to one stable public slug', () => {
    expect(normalizeComparisonPair('beta', 'alpha')).toEqual({
      leftSlug: 'alpha',
      rightSlug: 'beta',
      slug: 'alpha-vs-beta',
    });
  });

  test('rejects comparisons without shared evidence signals', () => {
    expect(buildComparisonCandidate(alpha, travel)).toBeNull();
  });

  test('finds the same comparison regardless of requested pair order', () => {
    const products = [alpha, beta, gamma, travel];
    const first = findComparisonProducts(products, 'alpha', 'beta');
    const second = findComparisonProducts(products, 'beta', 'alpha');

    expect(first?.left.slug).toBe('alpha');
    expect(first?.right.slug).toBe('beta');
    expect(second?.left.slug).toBe('alpha');
    expect(second?.right.slug).toBe('beta');
  });

  test('ranks alternatives by shared evidence then votes', () => {
    const alternatives = rankAlternatives(alpha, [alpha, beta, gamma, travel]);
    expect(alternatives.map((item) => item.slug)).toEqual(['beta', 'gamma']);
  });
});
