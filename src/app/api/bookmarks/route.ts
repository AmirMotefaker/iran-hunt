import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await sql`SELECT slug, created_at FROM bookmarks WHERE email=${user.email} ORDER BY created_at DESC`;
  return NextResponse.json({ bookmarks: rows });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const exists = await sql`SELECT 1 FROM bookmarks WHERE email=${user.email} AND slug=${slug}`;
  if (exists.length) {
    await sql`DELETE FROM bookmarks WHERE email=${user.email} AND slug=${slug}`;
    return NextResponse.json({ bookmarked: false });
  }
  if (user.plan === 'free') {
    const count = await sql`SELECT count(*)::int AS n FROM bookmarks WHERE email=${user.email}`;
    if (count[0].n >= 20)
      return NextResponse.json({ error: 'در پلن رایگان حداکثر ۲۰ بوکمارک مجاز است — برای بوکمارک نامحدود، پلن حرفه‌ای را فعال کنید.' }, { status: 403 });
  }
  await sql`INSERT INTO bookmarks (email, slug) VALUES (${user.email}, ${slug})`;
  return NextResponse.json({ bookmarked: true });
}
