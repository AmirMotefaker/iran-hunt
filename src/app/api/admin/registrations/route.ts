import { NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function GET() {
  const email = await getSessionEmail();
  if (!email || email !== process.env.ADMIN_EMAIL)
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });

  const rows = await sql`SELECT email, created_at FROM users ORDER BY created_at DESC`;
  return NextResponse.json({ rows });
}
