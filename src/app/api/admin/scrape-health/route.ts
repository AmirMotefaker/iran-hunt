import { NextResponse } from 'next/server';
import { loadScrapeHealth } from '@/lib/scrape-health';

export async function GET() {
  return NextResponse.json(await loadScrapeHealth());
}
