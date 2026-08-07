'use client';

import { TrendingUp, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';

export default function InsightsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const u = await me();
      if (!u?.email) { window.location.href = '/login?next=/insights'; return; }
      const res = await fetch('/api/insights');
      if (!res.ok) { setError('این بخش مخصوص پلن سرمایه‌گذار و بالاتر است.'); return; }
      setData(await res.json());
    })();
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black text-white">پلن سرمایه‌گذار</span>
      <h1 className="mt-4 text-3xl font-black text-gray-900 dark:text-white">📊 هوش رقابتی</h1>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">رشد دسته‌ها + سیگنال‌های زودهنگام ایده‌های بدون نسخه ایرانی</p>

      {error && (
        <div className="mt-8 rounded-3xl border border-gray-200 bg-white p-10 text-center dark:border-gray-700 dark:bg-gray-900">
          <p className="font-bold text-gray-700 dark:text-gray-200">🔒 {error}</p>
          <Link href="/pricing" className="mt-4 inline-flex rounded-2xl bg-[#ff6154] px-6 py-2.5 text-sm font-black text-white">ارتقا به سرمایه‌گذار</Link>
        </div>
      )}

      {data && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 font-black text-gray-900 dark:text-white"><TrendingUp size={18} className="text-[#ff6154]" /> داغ‌ترین دسته‌ها (ماه + سال)</h2>
            <ul className="mt-4 space-y-3">
              {data.categories.map((c: any, i: number) => (
                <li key={c.name} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5 dark:bg-gray-800">
                  <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{(i + 1).toLocaleString('fa-IR')}. {c.name}</span>
                  <span className="text-xs font-black text-[#ff6154]">{c.votes.toLocaleString('fa-IR')} رأی</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <h2 className="flex items-center gap-2 font-black text-gray-900 dark:text-white"><Zap size={18} className="text-amber-500" /> سیگنال زودهنگام (بدون نسخه ایرانی)</h2>
            <ul className="mt-4 space-y-3">
              {data.signals.map((s: any) => (
                <li key={s.slug} className="rounded-xl bg-gray-50 px-4 py-2.5 dark:bg-gray-800">
                  <Link href={`/product/${s.slug}`} className="flex items-center justify-between text-sm font-bold text-gray-800 hover:text-[#ff6154] dark:text-gray-200">
                    <span dir="ltr">{s.name}</span>
                    <span className="text-xs font-black text-[#ff6154]">{s.votes.toLocaleString('fa-IR')} 🔥</span>
                  </Link>
                  <p className="mt-1 text-[10px] font-bold text-gray-400" dir="ltr">{s.category}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </main>
  );
}
