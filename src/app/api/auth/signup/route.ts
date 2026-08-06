import { NextRequest, NextResponse } from 'next/server';
import { createSession, hashPassword } from '@/lib/auth-server';
import sql from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const em = String(email ?? '').trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em))
      return NextResponse.json({ error: 'ایمیل معتبر نیست' }, { status: 400 });
    if (String(password ?? '').length < 6)
      return NextResponse.json({ error: 'رمز عبور حداقل ۶ کاراکتر' }, { status: 400 });

    const existing = await sql`SELECT id FROM users WHERE email = ${em}`;
    if (existing.length)
      return NextResponse.json({ error: 'قبلاً ثبت‌نام شده؛ وارد شوید' }, { status: 409 });

    const hash = hashPassword(String(password));
    await sql`INSERT INTO users (email, password_hash) VALUES (${em}, ${hash})`;
    await createSession(em);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'خطای سرور' }, { status: 500 });
  }
}
