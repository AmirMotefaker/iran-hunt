import { expect, test } from 'bun:test';
import { buildProductEvidence } from './evidence-layer';
import type { Product } from '@/types';

const baseProduct: Product = {
  id: '1',
  date: '2026-09-03',
  rank: 1,
  name: 'Atlas',
  slug: 'atlas',
  tagline: 'Example',
  description: 'Stored description',
  category: 'AI',
  url: 'https://www.producthunt.com/posts/atlas',
  votes: 120,
  websiteUrl: 'https://atlas.example',
  maker: 'Maker',
};

test('complete repository-backed evidence is classified strong', () => {
  const evidence = buildProductEvidence(baseProduct);
  expect(evidence.id).toBe('evidence:atlas');
  expect(evidence.quality).toBe('strong');
  expect(evidence.signals).toContain('source-url');
  expect(evidence.signals).toContain('official-website');
  expect(evidence.signals).toContain('maker');
  expect(evidence.signals).toContain('votes');
  expect(evidence.signals).toContain('data-date');
  expect(evidence.signals).toContain('stored-description');
});

test('missing provenance is surfaced as a limitation instead of fabricated', () => {
  const evidence = buildProductEvidence({
    ...baseProduct,
    url: '',
    websiteUrl: '',
    maker: undefined,
    description: '',
  });

  expect(evidence.quality).toBe('limited');
  expect(evidence.limitations.some((item) => item.includes('سازنده'))).toBe(true);
  expect(evidence.limitations.some((item) => item.includes('لینک منبع'))).toBe(true);
  expect(evidence.limitations.some((item) => item.includes('توضیح متنی'))).toBe(true);
});

test('evidence ids remain stable for the same product slug', () => {
  expect(buildProductEvidence(baseProduct).id).toBe(buildProductEvidence({ ...baseProduct, votes: 999 }).id);
});
