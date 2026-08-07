import type { PlanId } from '@/lib/plans';

interface MeResult {
  email: string;
  isAdmin?: boolean;
  plan?: PlanId;
  planExpiresAt?: string | null;
}

export async function me(): Promise<MeResult | null> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  const j = await res.json();
  return j?.email ? { email: j.email, isAdmin: !!j.isAdmin, plan: j.plan ?? 'free', planExpiresAt: j.planExpiresAt ?? null } : null;
}

export async function signup(email: string, password: string) {
  const res = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' });
}
