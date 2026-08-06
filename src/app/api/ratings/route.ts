import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug') ?? '';
  const stats = await sql`
    SELECT count(*)::int AS total, COALESCE(avg(rating)::numeric(3,2), 0) AS avg
    FROM ratings WHERE slug=${slug}`;
  const email = await getSessionEmail();
  let myRating = 0;
  if (email) {
    const row = await sql`SELECT rating FROM ratings WHERE slug=${slug} AND email=${email}`;
    myRating = row.length ? Number(row[0].rating) : 0;
  }
  return NextResponse.json({
    total: stats[0]?.total ?? 0,
    avg: Number(stats[0]?.avg ?? 0),
    myRating,
  });
}

export async function POST(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'ابتدا وارد شوید' }, { status: 401 });
  const { slug, rating } = await req.json();
  const r = Number(rating);
  if (!slug || !Number.isInteger(r) || r < 1 || r > 5)
    return NextResponse.json({ error: 'امتیاز باید بین ۱ تا ۵ باشد' }, { status: 400 });

  await sql`
    INSERT INTO ratings (email, slug, rating) VALUES (${email}, ${slug}, ${r})
    ON CONFLICT (email, slug) DO UPDATE SET rating=${r}, created_at=now()`;

  const stats = await sql`
    SELECT count(*)::int AS total, COALESCE(avg(rating)::numeric(3,2), 0) AS avg
    FROM ratings WHERE slug=${slug}`;
  return NextResponse.json({
    total: stats[0].total,
    avg: Number(stats[0].avg),
    myRating: r,
  });
}
