import { NextRequest, NextResponse } from 'next/server';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim().toLowerCase();
  if (q.length < 2) return NextResponse.json({ results: [] });
  const data = await loadLatest();
  if (!data) return NextResponse.json({ results: [] });

  const seen = new Set<string>();
  const results: any[] = [];
  for (const key of ['today', 'yesterday', 'week', 'month', 'year'] as const) {
    for (const p of data.periods[key] ?? []) {
      if (seen.has(p.slug)) continue;
      if ((p.name ?? '').toLowerCase().includes(q) || (p.tagline ?? '').toLowerCase().includes(q)) {
        seen.add(p.slug);
        results.push({ slug: p.slug, name: p.name, tagline: p.tagline, votes: p.votes, thumbnail: p.thumbnail });
      }
      if (results.length >= 8) return NextResponse.json({ results });
    }
  }
  return NextResponse.json({ results });
}
