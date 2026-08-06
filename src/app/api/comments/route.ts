import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? '';
  const items = await sql`
    SELECT c.body, c.created_at, c.email, u.first_name, u.last_name, u.avatar
    FROM comments c LEFT JOIN users u ON u.email = c.email
    WHERE c.slug=${slug} ORDER BY c.created_at DESC LIMIT 100`;
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  const { slug, body } = await req.json();
  const text = String(body ?? '').trim();
  if (!slug || text.length < 3 || text.length > 500)
    return NextResponse.json({ error: 'متن نظر باید بین ۳ تا ۵۰۰ کاراکتر باشد' }, { status: 400 });

  await sql`INSERT INTO comments (email, slug, body) VALUES (${email}, ${slug}, ${text})`;
  return NextResponse.json({ ok: true });
}
