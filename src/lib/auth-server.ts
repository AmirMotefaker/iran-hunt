import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import sql from '@/lib/db';
import type { PlanId } from '@/lib/plans';

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
    httpOnly: true, secure: true, sameSite: 'lax', path: '/',
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

export interface SessionUser {
  email: string;
  plan: PlanId;
  planExpiresAt: string | null;
}

// پلن فعال کاربر (اگه اشتراک منقضی شده باشه -> free)
export async function getSessionUser(): Promise<SessionUser | null> {
  const email = await getSessionEmail();
  if (!email) return null;
  const rows = await sql`SELECT plan, plan_expires_at FROM users WHERE email=${email}`;
  if (!rows.length) return { email, plan: 'free', planExpiresAt: null };
  let plan = (rows[0].plan as PlanId) || 'free';
  const exp = rows[0].plan_expires_at ? new Date(rows[0].plan_expires_at) : null;
  if (email === process.env.ADMIN_EMAIL) plan = 'team';
  else if (plan !== 'free' && (!exp || exp.getTime() < Date.now())) plan = 'free';
  return { email, plan, planExpiresAt: exp ? exp.toISOString() : null };
}
