import { expect, test } from 'bun:test';
import { buildIntentKey, deriveIntentCandidates, summarizeIntentCoverage } from './intent-coverage';
import type { Product } from '@/types';

function product(overrides: Partial<Product> = {}): Product {
  return {
    id: '1',
    date: '2026-09-03',
    rank: 1,
    name: 'Atlas AI',
    slug: 'atlas-ai',
    tagline: 'AI workspace',
    description: 'AI workspace for teams',
    faDescription: 'فضای کاری هوش مصنوعی برای تیم‌ها',
    category: 'AI • Productivity',
    categoryFa: 'هوش مصنوعی • بهره‌وری',
    url: 'https://www.producthunt.com/posts/atlas-ai',
    votes: 100,
    websiteUrl: 'https://atlas.example',
    ...overrides,
  };
}

test('normalizes intent keys deterministically', () => {
  expect(buildIntentKey('category-discovery', '  هوش   مصنوعی  ')).toBe(
    buildIntentKey('category-discovery', 'هوش مصنوعی'),
  );
});

test('deduplicates repeated product evidence inside the same intent', () => {
  const products = [product(), product({ id: '2' })];
  const intents = deriveIntentCandidates(products);
  const nav = intents.find((item) => item.key === buildIntentKey('navigational', 'Atlas AI'));

  expect(nav?.evidenceCount).toBe(1);
  expect(nav?.productSlugs).toEqual(['atlas-ai']);
});

test('maps known public surfaces to covered intents', () => {
  const intents = deriveIntentCandidates([product()]);
  const nav = intents.find((item) => item.type === 'navigational');
  const alternatives = intents.find((item) => item.type === 'alternatives');

  expect(nav?.coveredBy).toBe('/product/atlas-ai');
  expect(alternatives?.coveredBy).toBe('/alternatives/atlas-ai');
});

test('coverage summary is deterministic and contains no fabricated demand metrics', () => {
  const summary = summarizeIntentCoverage([
    product(),
    product({ id: '2', name: 'Nova', slug: 'nova', votes: 50, categoryFa: 'هوش مصنوعی' }),
  ]);

  expect(summary.totalIntents).toBeGreaterThan(0);
  expect(summary.coveredIntents).toBeGreaterThan(0);
  expect(summary.coverageRatio).toBeGreaterThan(0);
  expect(Object.keys(summary)).not.toContain('searchVolume');
  expect(Object.keys(summary)).not.toContain('keywordDifficulty');
});
