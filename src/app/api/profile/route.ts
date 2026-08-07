import { NextRequest, NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const rows = await sql`SELECT email, first_name, last_name, province, city, mobile, avatar, created_at FROM users WHERE email=${email}`;
  if (!rows.length) return NextResponse.json({ error: 'not found' }, { status: 404 });
  const likes = await sql`SELECT count(*)::int AS n FROM likes WHERE email=${email}`;
  const comments = await sql`SELECT count(*)::int AS n FROM comments WHERE email=${email}`;
  return NextResponse.json({ profile: rows[0], likes: likes[0]?.n ?? 0, comments: comments[0]?.n ?? 0 });
}

export async function PATCH(req: NextRequest) {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  const b = await req.json();

  const first_name = String(b.first_name ?? '').slice(0, 60);
  const last_name = String(b.last_name ?? '').slice(0, 60);
  const province = String(b.province ?? '').slice(0, 40);
  const city = String(b.city ?? '').slice(0, 40);
  const mobile = String(b.mobile ?? '').trim();
  const avatar = String(b.avatar ?? '');
  const alerts = b.alerts === undefined ? undefined : !!b.alerts;

  if (mobile && !/^09\d{9}$/.test(mobile))
    return NextResponse.json({ error: 'شماره موبایل معتبر نیست (مثال: 09123456789)' }, { status: 400 });
  if (avatar && (!avatar.startsWith('data:image/') || avatar.length > 400000))
    return NextResponse.json({ error: 'تصویر پروفایل معتبر نیست' }, { status: 400 });

  await sql`UPDATE users SET first_name=${first_name}, last_name=${last_name}, province=${province}, city=${city}, mobile=${mobile}, avatar=${avatar || ''} WHERE email=${email}`;
  return NextResponse.json({ ok: true });
}
