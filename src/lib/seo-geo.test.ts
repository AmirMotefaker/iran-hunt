import { describe, expect, test } from 'bun:test';
import {
  buildProductEntityGraph,
  buildProductMetadata,
  getProductCanonical,
  getProductDescription,
  SITE_URL,
} from './seo-geo';
import type { Product } from '@/types';

const product: Product = {
  id: '1',
  date: '2026-09-03',
  rank: 1,
  name: 'Example AI',
  slug: 'example-ai',
  tagline: 'AI assistant for teams',
  description: 'Long English description',
  faDescription: 'دستیار هوش مصنوعی برای تیم‌ها و کسب‌وکارها',
  faTagline: 'دستیار هوش مصنوعی برای تیم‌ها',
  category: 'AI • Productivity',
  categoryFa: 'هوش مصنوعی • بهره‌وری',
  url: 'https://example.com/launch',
  votes: 420,
  websiteUrl: 'https://example.com',
  maker: 'Example Maker',
};

describe('SEO + GEO foundation', () => {
  test('uses the production domain as canonical truth', () => {
    expect(SITE_URL).toBe('https://idehjo.ir');
    expect(getProductCanonical(product.slug)).toBe(
      'https://idehjo.ir/product/example-ai',
    );
  });

  test('prefers Persian answer-ready descriptions', () => {
    expect(getProductDescription(product)).toBe(product.faDescription);
  });

  test('builds canonical product metadata', () => {
    const metadata = buildProductMetadata(product);
    expect(metadata.alternates?.canonical).toBe(
      'https://idehjo.ir/product/example-ai',
    );
    expect(metadata.description).toBe(product.faDescription);
  });

  test('builds an entity graph for search and generative engines', () => {
    const graph = buildProductEntityGraph(product);
    const types = graph['@graph'].map((node) => node['@type']);

    expect(types).toContain('WebPage');
    expect(types).toContain('Product');
    expect(types).toContain('SoftwareApplication');
    expect(types).toContain('BreadcrumbList');
    expect(JSON.stringify(graph)).toContain(product.faDescription!);
    expect(JSON.stringify(graph)).toContain(product.websiteUrl);
  });
});
