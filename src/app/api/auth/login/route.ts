import { NextRequest, NextResponse } from 'next/server';
import { createSession, verifyPassword } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const em = String(email ?? '').trim().toLowerCase();
    const rows = await sql`SELECT email, password_hash FROM users WHERE email = ${em}`;
    if (!rows.length || !verifyPassword(String(password ?? ''), rows[0].password_hash as string))
      return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است' }, { status: 401 });

    await createSession(em);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
