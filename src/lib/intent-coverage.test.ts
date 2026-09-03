import { expect, test } from 'bun:test';
import {
  buildIntentCoverageSurfaceIndex,
  buildIntentKey,
  deriveIntentCandidates,
  summarizeIntentCoverage,
} from './intent-coverage';
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
    category: 'AI',
    categoryFa: 'هوش مصنوعی',
    url: 'https://www.producthunt.com/posts/atlas-ai',
    votes: 100,
    websiteUrl: 'https://atlas.example',
    ...overrides,
  };
}

function eligibleProducts(): Product[] {
  return [
    product(),
    product({ id: '2', name: 'Nova', slug: 'nova', votes: 90 }),
    product({ id: '3', name: 'Orbit', slug: 'orbit', votes: 80 }),
    product({ id: '4', name: 'Pulse', slug: 'pulse', votes: 70 }),
    product({ id: '5', name: 'Quill', slug: 'quill', votes: 60 }),
  ];
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

test('only marks alternatives covered when the target passes the real eligibility threshold', () => {
  const ineligible = deriveIntentCandidates([product()]).find((item) => item.type === 'alternatives');
  expect(ineligible?.coveredBy).toBeUndefined();

  const eligible = deriveIntentCandidates(eligibleProducts()).find(
    (item) => item.type === 'alternatives' && item.label === 'Atlas AI',
  );
  expect(eligible?.coveredBy).toBe('/alternatives/atlas-ai');
});

test('builds guide and comparison coverage from real eligible surface builders', () => {
  const products = eligibleProducts();
  const surfaces = buildIntentCoverageSurfaceIndex(products);

  expect(surfaces.guideSlugs.has('هوش-مصنوعی')).toBe(true);
  expect(surfaces.alternativeSlugs.has('atlas-ai')).toBe(true);
  expect(surfaces.comparisonSlugs.size).toBeGreaterThan(0);
});

test('coverage summary exposes per-intent-type diagnostics and no fabricated demand metrics', () => {
  const summary = summarizeIntentCoverage(eligibleProducts());

  expect(summary.totalIntents).toBeGreaterThan(0);
  expect(summary.coveredIntents).toBeGreaterThan(0);
  expect(summary.coverageRatio).toBeGreaterThan(0);
  expect(summary.byType.alternatives.total).toBeGreaterThan(0);
  expect(summary.byType.comparison.covered).toBeGreaterThan(0);
  expect(Object.keys(summary)).not.toContain('searchVolume');
  expect(Object.keys(summary)).not.toContain('keywordDifficulty');
});
