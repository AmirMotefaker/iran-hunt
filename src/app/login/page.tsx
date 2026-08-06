'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { login, signup } from '@/lib/auth-client';

function LoginInner() {
  const [mode, setMode] = useState<'signup' | 'login'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/';

  const submit = async () => {
    setBusy(true);
    setError('');
    const r = mode === 'signup' ? await signup(email, password) : await login(email, password);
    if (r.ok) router.push(next);
    else setError(r.error ?? 'خطا');
    setBusy(false);
  };

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl">
        <h1 className="text-center text-2xl font-black">
          {mode === 'signup' ? 'ثبت‌نام در IranHunt' : 'ورود به IranHunt'}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          برای دسترسی به توضیحات تکمیلی و وب‌سایت رسمی ایده‌ها
        </p>

        <div className="mt-6 flex rounded-2xl bg-gray-100 p-1">
          <button onClick={() => setMode('signup')} className={`flex-1 rounded-xl py-2 text-sm font-bold ${mode === 'signup' ? 'bg-white shadow' : 'text-gray-500'}`}>ثبت‌نام</button>
          <button onClick={() => setMode('login')} className={`flex-1 rounded-xl py-2 text-sm font-bold ${mode === 'login' ? 'bg-white shadow' : 'text-gray-500'}`}>ورود</button>
        </div>

        <div className="mt-6 space-y-3">
          <input type="email" dir="ltr" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          <input type="password" dir="ltr" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm" />
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
          <button onClick={submit} disabled={busy || !email || password.length < 6} className="w-full rounded-xl bg-[#ff6154] py-3 text-sm font-bold text-white disabled:opacity-40">
            {busy ? 'لطفاً صبر کنید…' : mode === 'signup' ? 'ثبت‌نام' : 'ورود'}
          </button>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}
