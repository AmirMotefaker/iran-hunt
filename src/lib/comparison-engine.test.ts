import { describe, expect, test } from 'bun:test';
import {
  buildComparisonCandidate,
  buildEligibleAlternativeTargets,
  buildEligibleComparisonPairs,
  findComparisonProducts,
  normalizeComparisonPair,
  parseComparisonSlug,
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
  const delta = product('delta', 'AI', 150);
  const travel = product('travel', 'Travel', 500);

  test('normalizes pair order to one stable public slug', () => {
    expect(normalizeComparisonPair('beta', 'alpha')).toEqual({
      leftSlug: 'alpha',
      rightSlug: 'beta',
      slug: 'alpha-vs-beta',
    });
    expect(parseComparisonSlug('beta-vs-alpha')).toEqual({
      leftSlug: 'alpha',
      rightSlug: 'beta',
      slug: 'alpha-vs-beta',
    });
  });

  test('rejects comparisons without shared evidence signals', () => {
    expect(buildComparisonCandidate(alpha, travel)).toBeNull();
  });

  test('finds the same comparison regardless of requested pair order', () => {
    const products = [alpha, beta, gamma, delta, travel];
    const first = findComparisonProducts(products, 'alpha', 'beta');
    const second = findComparisonProducts(products, 'beta', 'alpha');

    expect(first?.left.slug).toBe('alpha');
    expect(first?.right.slug).toBe('beta');
    expect(second?.left.slug).toBe('alpha');
    expect(second?.right.slug).toBe('beta');
  });

  test('ranks alternatives by shared evidence then votes', () => {
    const alternatives = rankAlternatives(alpha, [alpha, beta, gamma, delta, travel]);
    expect(alternatives.map((item) => item.slug)).toEqual(['beta', 'gamma', 'delta']);
  });

  test('publishes alternatives only when sufficient evidence-backed options exist', () => {
    const products = [alpha, beta, gamma, delta, travel];
    const targets = buildEligibleAlternativeTargets(products, 3);
    expect(targets.map((item) => item.slug)).toEqual(['beta', 'gamma', 'delta', 'alpha']);
    expect(targets.some((item) => item.slug === 'travel')).toBe(false);
  });

  test('builds duplicate-free deterministic comparison pairs', () => {
    const products = [alpha, beta, gamma, delta, travel];
    const pairs = buildEligibleComparisonPairs(products, 2);
    expect(new Set(pairs.map((pair) => pair.slug)).size).toBe(pairs.length);
    expect(pairs).toEqual([...pairs].sort((a, b) => a.slug.localeCompare(b.slug)));
  });
});
