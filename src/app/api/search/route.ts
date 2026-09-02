import { NextRequest, NextResponse } from 'next/server';
import { rankSearchResults } from '@/lib/search-ranking';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') ?? '').trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  const data = await loadLatest();
  if (!data) return NextResponse.json({ results: [] });

  return NextResponse.json({ results: rankSearchResults(data.periods, q, 8) });
}
