import { NextRequest, NextResponse } from 'next/server';
import { loadCorpus } from '@/lib/corpus';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

type SearchProduct = {
  slug?: string;
  name?: string;
  tagline?: string;
  faTagline?: string;
  faDescription?: string;
  category?: string;
  categoryFa?: string;
  votes?: number;
  thumbnail?: string;
};

function scoreProduct(product: SearchProduct, query: string): number {
  const q = query.toLowerCase();

  const name = (product.name ?? '').toLowerCase();
  const tagline = (product.tagline ?? '').toLowerCase();
  const faTagline = (product.faTagline ?? '').toLowerCase();
  const faDescription = (product.faDescription ?? '').toLowerCase();
  const category = (product.category ?? '').toLowerCase();
  const categoryFa = (product.categoryFa ?? '').toLowerCase();

  let score = 0;

  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 80;
  else if (name.includes(q)) score += 60;

  if (tagline.includes(q)) score += 25;
  if (faTagline.includes(q)) score += 30;
  if (faDescription.includes(q)) score += 20;
  if (category.includes(q)) score += 12;
  if (categoryFa.includes(q)) score += 15;

  return score;
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '')
    .trim()
    .toLowerCase();

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const [latest, corpus] = await Promise.all([
    loadLatest(),
    loadCorpus(),
  ]);

  const candidates: SearchProduct[] = [];

  if (latest) {
    for (const key of [
      'today',
      'yesterday',
      'week',
      'month',
      'year',
    ] as const) {
      candidates.push(...(latest.periods[key] ?? []));
    }
  }

  candidates.push(...corpus.products);

  const unique = new Map<string, SearchProduct>();

  for (const product of candidates) {
    if (!product.slug) continue;

    const existing = unique.get(product.slug);

    if (!existing) {
      unique.set(product.slug, product);
      continue;
    }

    if (
      (product.votes ?? 0) > (existing.votes ?? 0)
    ) {
      unique.set(product.slug, {
        ...existing,
        ...product,
      });
    }
  }

  const results = [...unique.values()]
    .map((product) => ({
      product,
      score: scoreProduct(product, q),
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (b.product.votes ?? 0) - (a.product.votes ?? 0),
    )
    .slice(0, 8)
    .map(({ product }) => ({
      slug: product.slug,
      name: product.name,
      tagline: product.tagline,
      votes: product.votes ?? 0,
      thumbnail: product.thumbnail,
    }));

  return NextResponse.json({ results });
}
