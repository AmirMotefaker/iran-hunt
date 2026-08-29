import { expect, test } from 'bun:test';
import {
  assertCorpusHealth,
  canonicalizeIncomingProducts,
  mergeProductsIntoCorpus,
} from './corpus-growth';
import type { ProductCorpus } from './corpus';
import type { Product } from '@/types';

const product = (slug: string, votes = 1, date = '2026-08-27'): Product => ({
  id: slug,
  date,
  rank: 1,
  name: slug,
  slug,
  tagline: slug,
  description: slug,
  category: 'AI',
  url: `https://producthunt.com/posts/${slug}`,
  votes,
  websiteUrl: `https://${slug}.example.com`,
  comments: [{ user: 'A', text: 'Real launch comment' }],
});

function corpus(products: Product[]): ProductCorpus {
  return {
    generatedAt: '2026-08-26T00:00:00.000Z',
    sourceFiles: 19,
    products,
    audit: {
      products: products.length,
      withRealComments: products.length,
      withPersianComments: 0,
      withPersianDescription: 0,
      withAiReview: 0,
      withIranEquivalent: 0,
      totalRealComments: products.length,
    },
  };
}

test('incoming canonicalization deduplicates by slug and rejects empty slugs', () => {
  const result = canonicalizeIncomingProducts([
    product('a', 10),
    product('a', 20),
    { ...product('missing'), slug: '' },
    product('b', 5),
  ]);

  expect(result.discovered).toBe(4);
  expect(result.products.length).toBe(2);
  expect(result.duplicates).toBe(1);
  expect(result.rejected).toBe(1);
  expect(result.products.find((item) => item.slug === 'a')?.votes).toBe(20);
});

test('daily corpus growth adds products without removing existing ones', () => {
  const base = corpus([product('a', 10), product('b', 20)]);
  const { corpus: merged, report } = mergeProductsIntoCorpus(base, [
    product('b', 50),
    product('c', 30),
  ]);

  expect(report.before).toBe(2);
  expect(report.after).toBe(3);
  expect(report.added).toBe(1);
  expect(report.acceptedNew).toBe(1);
  expect(report.duplicates).toBe(1);
  expect(merged.products.find((p) => p.slug === 'b')?.votes).toBe(50);
});

test('duplicate products do not consume unique-growth quota', () => {
  const base = corpus([product('known', 5)]);
  const { corpus: merged, report } = mergeProductsIntoCorpus(
    base,
    [
      product('known', 25, '2026-08-29'),
      product('new-a', 10, '2026-08-29'),
      product('new-b', 9, '2026-08-29'),
      product('new-c', 8, '2026-08-28'),
    ],
    { maxNewProducts: 2 },
  );

  expect(report.acceptedNew).toBe(2);
  expect(report.added).toBe(2);
  expect(report.duplicates).toBe(1);
  expect(report.rejected).toBe(1);
  expect(merged.products.some((item) => item.slug === 'new-a')).toBe(true);
  expect(merged.products.some((item) => item.slug === 'new-b')).toBe(true);
  expect(merged.products.some((item) => item.slug === 'new-c')).toBe(false);
  expect(merged.products.find((item) => item.slug === 'known')?.votes).toBe(25);
});

test('new products are selected deterministically by date, votes, then slug', () => {
  const { corpus: merged } = mergeProductsIntoCorpus(
    corpus([]),
    [
      product('z', 10, '2026-08-28'),
      product('a', 5, '2026-08-29'),
      product('b', 7, '2026-08-29'),
      product('c', 7, '2026-08-29'),
    ],
    { maxNewProducts: 2 },
  );

  expect(merged.products.map((item) => item.slug).sort()).toEqual(['b', 'c']);
});

test('corpus health rejects suspiciously small corpus', () => {
  expect(() =>
    assertCorpusHealth({
      after: 2,
      audit: {
        products: 2,
        withRealComments: 2,
        withPersianComments: 0,
        withPersianDescription: 0,
        withAiReview: 0,
        withIranEquivalent: 0,
        totalRealComments: 2,
      },
    }),
  ).toThrow();
});
