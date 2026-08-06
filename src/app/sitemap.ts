import type { MetadataRoute } from 'next';
import { extractSlug } from '@/lib/slug';
import { loadLatest } from '@/lib/storage';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://idehyab.ir';
  const now = new Date();
  const data = await loadLatest();

  const slugs = new Set<string>();
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month'] as const) {
      for (const p of data.periods[key] ?? []) {
        const s = extractSlug(p.url);
        if (s) slugs.add(s);
      }
    }
  }

  return [
    { url: base, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/categories`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    ...[...slugs].map((s) => ({
      url: `${base}/product/${s}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ];
}
