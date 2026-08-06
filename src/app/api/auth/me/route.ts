import { NextResponse } from 'next/server';
import { getSessionEmail } from '@/lib/auth-server';

export async function GET() {
  const email = await getSessionEmail();
  if (!email) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  return NextResponse.json({ email });
}
