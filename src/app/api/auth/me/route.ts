import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth-server';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({
    email: user.email,
    isAdmin: user.email === process.env.ADMIN_EMAIL,
    plan: user.plan,
    planExpiresAt: user.planExpiresAt,
  });
}
