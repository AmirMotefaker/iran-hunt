import type { MetadataRoute } from 'next';
import { extractSlug } from '@/lib/slug';
import { loadLatest } from '@/lib/storage';
import { SITE_URL } from '@/lib/seo-geo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const data = await loadLatest();

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
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...[...slugs].map((s) => ({
      url: `${SITE_URL}/product/${encodeURIComponent(s)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
