import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import sql from '@/lib/db';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  try {
    const [salt, hash] = stored.split(':');
    const h = scryptSync(password, salt, 64);
    return timingSafeEqual(h, Buffer.from(hash, 'hex'));
  } catch {
    return false;
  }
}

export async function createSession(email: string): Promise<void> {
  const token = randomBytes(32).toString('hex');
  await sql`INSERT INTO sessions (token, email) VALUES (${token}, ${email})`;
  const store = await cookies();
  store.set('ih_session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get('ih_session')?.value;
  if (!token) return null;
  const rows = await sql`SELECT email FROM sessions WHERE token = ${token}`;
  return rows.length ? (rows[0].email as string) : null;
}

export async function deleteSession(): Promise<void> {
  const store = await cookies();
  const token = store.get('ih_session')?.value;
  if (token) await sql`DELETE FROM sessions WHERE token = ${token}`;
  store.delete('ih_session');
}
