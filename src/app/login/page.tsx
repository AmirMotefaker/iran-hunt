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

  const requestedNext = params.get('next') ?? '/';

  const next =
    requestedNext.startsWith('/') &&
    !requestedNext.startsWith('//')
      ? requestedNext
      : '/';

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
      <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-gray-700 dark:bg-gray-900">
        <h1 className="text-center text-2xl font-black text-gray-900 dark:text-white">
          {mode === 'signup' ? 'ثبت‌نام در ایده‌جو' : 'ورود به ایده‌جو'}
        </h1>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          برای دسترسی به توضیحات تکمیلی و وب‌سایت رسمی ایده‌ها
        </p>

        <div className="mt-6 flex rounded-2xl bg-gray-100 p-1 dark:bg-gray-800">
          <button onClick={() => setMode('signup')} className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${mode === 'signup' ? 'bg-white shadow dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>ثبت‌نام</button>
          <button onClick={() => setMode('login')} className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${mode === 'login' ? 'bg-white shadow dark:bg-gray-700 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>ورود</button>
        </div>

        <form
          className="mt-6 space-y-3"
          onSubmit={(e) => { e.preventDefault(); submit(); }}
        >
          <input
            type="email"
            dir="ltr"
            placeholder="email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ff6154] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <input
            type="password"
            dir="ltr"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:border-[#ff6154] focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          {error && <p className="text-xs font-bold text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={busy || !email || password.length < 6}
            className="w-full rounded-xl bg-[#ff6154] py-3 text-sm font-bold text-white transition hover:bg-[#e5544a] disabled:opacity-40"
          >
            {busy ? 'لطفاً صبر کنید…' : mode === 'signup' ? 'ثبت‌نام' : 'ورود'}
          </button>
          
        </form>
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
