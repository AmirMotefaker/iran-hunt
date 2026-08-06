import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? '';
  const count = await sql`SELECT count(*)::int AS n FROM likes WHERE slug=${slug}`;
  const email = await getSessionEmail();
  let liked = false;
  if (email) {
    const row = await sql`SELECT 1 FROM likes WHERE slug=${slug} AND email=${email}`;
    liked = row.length > 0;
  }
  return NextResponse.json({ count: count[0]?.n ?? 0, liked });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const exists = await sql`SELECT 1 FROM likes WHERE slug=${slug} AND email=${email}`;
  if (exists.length) await sql`DELETE FROM likes WHERE slug=${slug} AND email=${email}`;
  else await sql`INSERT INTO likes (email, slug) VALUES (${email}, ${slug})`;

  const count = await sql`SELECT count(*)::int AS n FROM likes WHERE slug=${slug}`;
  return NextResponse.json({ count: count[0]?.n ?? 0, liked: !exists.length });
}
