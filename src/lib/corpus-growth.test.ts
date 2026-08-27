import { expect, test } from 'bun:test';
import { assertCorpusHealth, mergeProductsIntoCorpus } from './corpus-growth';
import type { ProductCorpus } from './corpus';
import type { Product } from '@/types';

const product = (slug: string, votes = 1): Product => ({
  id: slug, date: '2026-08-27', rank: 1, name: slug, slug, tagline: slug,
  description: slug, category: 'AI', url: `https://producthunt.com/posts/${slug}`,
  votes, websiteUrl: `https://${slug}.example.com`,
  comments: [{ user: 'A', text: 'Real launch comment' }],
});

test('daily corpus growth adds products without removing existing ones', () => {
  const base: ProductCorpus = {
    generatedAt: '2026-08-26T00:00:00.000Z', sourceFiles: 19,
    products: [product('a', 10), product('b', 20)],
    audit: { products: 2, withRealComments: 2, withPersianComments: 0,
      withPersianDescription: 0, withAiReview: 0, withIranEquivalent: 0, totalRealComments: 2 },
  };
  const { corpus, report } = mergeProductsIntoCorpus(base, [product('b', 50), product('c', 30)]);
  expect(report.before).toBe(2);
  expect(report.after).toBe(3);
  expect(report.added).toBe(1);
  expect(corpus.products.find((p) => p.slug === 'b')?.votes).toBe(50);
});

test('corpus health rejects suspiciously small corpus', () => {
  expect(() => assertCorpusHealth({
    after: 2,
    audit: { products: 2, withRealComments: 2, withPersianComments: 0,
      withPersianDescription: 0, withAiReview: 0, withIranEquivalent: 0, totalRealComments: 2 },
  })).toThrow();
});
