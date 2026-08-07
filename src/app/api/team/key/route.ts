import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'node:crypto';
import { getSessionUser } from '@/lib/auth-server';
import { hasPlan } from '@/lib/plans';
import sql from '@/lib/db';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasPlan(user.plan, 'team'))
    return NextResponse.json({ error: 'دسترسی API مخصوص پلن تیم و سازمان است' }, { status: 403 });
  const rows = await sql`SELECT api_key FROM users WHERE email=${user.email}`;
  return NextResponse.json({ apiKey: rows[0]?.api_key ?? null });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  if (!hasPlan(user.plan, 'team'))
    return NextResponse.json({ error: 'دسترسی API مخصوص پلن تیم و سازمان است' }, { status: 403 });
  const key = `ij_live_${randomBytes(24).toString('hex')}`;
  await sql`UPDATE users SET api_key=${key} WHERE email=${user.email}`;
  return NextResponse.json({ apiKey: key });
}
