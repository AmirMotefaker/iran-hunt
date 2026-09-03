import { describe, expect, test } from 'bun:test';
import type { Product } from '@/types';
import { buildDecisionGuides, findDecisionGuide, rankGuideProducts } from './decision-guides';

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

describe('P59 decision guide engine', () => {
  const products = [
    product('alpha', 'AI', 100),
    product('beta', 'AI', 400),
    product('gamma', 'AI', 300),
    product('delta', 'AI', 200),
    product('epsilon', 'AI', 50),
    product('travel', 'Travel', 900),
  ];

  test('publishes only categories with enough evidence-backed products', () => {
    const guides = buildDecisionGuides(products, 5);
    expect(guides.map((guide) => guide.slug)).toEqual(['ai']);
  });

  test('ranks guide candidates by votes with stable slug tie-break', () => {
    expect(rankGuideProducts(products.slice(0, 5)).map((item) => item.slug)).toEqual([
      'beta',
      'gamma',
      'delta',
      'alpha',
      'epsilon',
    ]);
  });

  test('finds a stable guide by slug', () => {
    const guide = findDecisionGuide(products, 'ai');
    expect(guide?.label).toBe('AI');
    expect(guide?.products.length).toBe(5);
  });
});
