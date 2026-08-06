import { NextResponse } from 'next/server';
import { deleteSession } from '@/lib/auth-server';

export async function POST() {
  await deleteSession();
  return NextResponse.json({ ok: true });
}
