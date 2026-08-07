'use client';

import { Key, Users } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';

export default function TeamPage() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    (async () => {
      const u = await me();
      if (!u?.email) { window.location.href = '/login?next=/team'; return; }
      setPlan(u.plan);
      const res = await fetch('/api/team/key');
      if (res.ok) setApiKey((await res.json()).apiKey);
      else setError('این بخش مخصوص پلن تیم و سازمان است.');
    })();
  }, []);

  const regen = async () => {
    const res = await fetch('/api/team/key', { method: 'POST' });
    if (res.ok) setApiKey((await res.json()).apiKey);
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <span className="rounded-full bg-purple-600 px-3 py-1 text-[10px] font-black text-white">پلن تیم و سازمان</span>
      <h1 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">👥 فضای تیمی</h1>

      {error && (
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="font-bold text-gray-700 dark:text-gray-200">🔒 {error}</p>
          <Link href="/pricing" className="mt-4 inline-flex rounded-2xl bg-[#ff6154] px-6 py-2.5 text-sm font-black text-white">ارتقا به پلن تیم</Link>
        </div>
      )}

      {!error && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 font-black text-gray-900 dark:text-white"><Users size={18} className="text-purple-500" /> صندلی‌های تیم</h2>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">۵ صندلی در پلن شما فعال است.</p>
            <ul className="mt-4 space-y-2">
              <li className="rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-bold text-purple-800 dark:bg-purple-950/30 dark:text-purple-200">👑 شما (مالک)</li>
              {[1, 2, 3, 4].map((i) => (
                <li key={i} className="rounded-xl border border-dashed border-gray-300 px-4 py-2.5 text-sm font-bold text-gray-400 dark:border-gray-700">+ دعوت عضو (به‌زودی)</li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 font-black text-gray-900 dark:text-white"><Key size={18} className="text-amber-500" /> کلید API</h2>
            {apiKey ? (
              <>
                <code dir="ltr" className="mt-4 block break-all rounded-xl bg-gray-900 p-3 text-xs text-green-400">{apiKey}</code>
                <button onClick={regen} className="mt-3 rounded-xl border border-gray-300 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
                  🔄 تولید کلید جدید
                </button>
              </>
            ) : (
              <button onClick={regen} className="mt-4 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white dark:bg-white dark:text-gray-900">
                تولید کلید API
              </button>
            )}
            <p className="mt-4 text-xs leading-6 text-gray-500 dark:text-gray-400">
              با این کلید به endpoint داده‌های ترجمه‌شده دسترسی دارید. مستندات کامل پس از فعال‌سازی پلن ارسال می‌شود.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
