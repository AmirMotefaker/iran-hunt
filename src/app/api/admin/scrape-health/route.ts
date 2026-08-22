import { NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import { loadScrapeHealth } from '@/lib/scrape-health';
import { loadLatest } from '@/lib/storage';
import { buildScrapeOperationsSnapshot } from '@/lib/scrape-operations';
export async function GET() {
  const email = await getSessionEmail();
  if (!email || email !== process.env.ADMIN_EMAIL) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  const [health, latest] = await Promise.all([loadScrapeHealth(), loadLatest()]);
  return NextResponse.json(buildScrapeOperationsSnapshot(health, latest));
}
