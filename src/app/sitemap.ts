import type { MetadataRoute } from 'next';
import {
  buildEligibleAlternativeTargets,
  buildEligibleComparisonPairs,
} from '@/lib/comparison-engine';
import { loadCorpusProducts } from '@/lib/corpus';
import { buildDiscoveryTopics } from '@/lib/discovery-growth';
import { SITE_URL } from '@/lib/seo-geo';
import { extractSlug } from '@/lib/slug';
import { loadLatest } from '@/lib/storage';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const data = await loadLatest();
  const corpusProducts = await loadCorpusProducts();
  const discoveryTopics = buildDiscoveryTopics(corpusProducts);
  const alternativeTargets = buildEligibleAlternativeTargets(corpusProducts);
  const comparisonPairs = buildEligibleComparisonPairs(corpusProducts);

  const slugs = new Set<string>();
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month', 'year'] as const) {
      for (const p of data.periods[key] ?? []) {
        const s = p.slug || extractSlug(p.url);
        if (s) slugs.add(s);
      }
    }
  }

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/discover`, lastModified: now, changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...discoveryTopics.map((topic) => ({
      url: `${SITE_URL}/discover/${topic.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    ...alternativeTargets.map((product) => ({
      url: `${SITE_URL}/alternatives/${encodeURIComponent(product.slug)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.72,
    })),
    ...comparisonPairs.map((pair) => ({
      url: `${SITE_URL}/compare/${pair.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...[...slugs].map((s) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(s)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
