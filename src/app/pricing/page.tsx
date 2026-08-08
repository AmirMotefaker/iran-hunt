'use client';

import { Check, Crown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { me } from '@/lib/auth-client';
import { CYCLES, PLANS, faDigits, priceFor, toman, type CycleId } from '@/lib/plans';

export default function PricingPage() {
  const [cycle, setCycle] = useState<CycleId>('monthly');
  const [myPlan, setMyPlan] = useState<string | null>(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    me().then((r) => setMyPlan(r?.plan ?? null));
    const p = new URLSearchParams(window.location.search);
    if (p.get('canceled')) setMsg('پرداخت لغو شد.');
    if (p.get('error')) setMsg('خطا در تأیید پرداخت. دوباره تلاش کنید.');
  }, []);

  const buy = async (planId: string) => {
    setMsg('');
    if (!myPlan) { window.location.href = `/login?next=/pricing`; return; }
    const res = await fetch('/api/checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, cycle }),
    });
    const j = await res.json();
    if (res.ok && j.url) window.location.href = j.url;
    else setMsg(j.error ?? 'خطا');
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <Crown size={13} className="text-[#ff6154]" /> پلن‌های ایده‌جو
        </span>
        <h1 className="mt-5 text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">پلنی که با تو رشد می‌کنه</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-300">
          از کشف رایگان تا هوش رقابتی برای تیم‌ها — هر مرحله که هستی، یک پلن مناسب داری.
        </p>
      </div>

      <div className="mx-auto mt-8 flex w-fit rounded-2xl border border-gray-200 bg-white p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {CYCLES.map((c) => (
          <button key={c.id} onClick={() => setCycle(c.id)} className={`rounded-xl px-4 py-2 text-sm font-bold transition ${cycle === c.id ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'}`}>
            {c.fa}
            {c.discount > 0 && (
              <span className="mr-1.5 rounded-full bg-[#ff6154] px-1.5 py-0.5 text-[10px] font-black text-white">
                {faDigits(Math.round(c.discount * 100))}٪ تخفیف
              </span>
            )}
          </button>
        ))}
      </div>

      {msg && <p className="mx-auto mt-4 w-fit rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-400">{msg}</p>}

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((p) => {
          const price = priceFor(p.monthly, cycle);
          const isCurrent = myPlan === p.id;
          return (
            <div key={p.id} className={`relative flex flex-col rounded-3xl border p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${p.highlight ? 'border-[#ff6154] bg-white ring-2 ring-[#ff6154]/30 dark:bg-gray-900' : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900'}`}>
              {p.highlight && (
                <span className="absolute -top-3 right-6 rounded-full bg-[#ff6154] px-3 py-1 text-[10px] font-black text-white">پیشنهاد ما ⭐</span>
              )}
              <h3 className="text-lg font-black text-gray-900 dark:text-white">{p.fa}</h3>
              <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">{p.tagline}</p>

              <div className="mt-5">
                {p.monthly === 0 ? (
                  <p className="text-3xl font-black text-gray-900 dark:text-white">رایگان</p>
                ) : (
                  <>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">
                      {toman(price.perMonth)}
                      <span className="text-sm font-bold text-gray-500"> تومان/ماه</span>
                    </p>
                    {cycle !== 'monthly' && (
                      <p className="mt-1 text-xs font-bold text-gray-500 dark:text-gray-400">
                        پرداخت {toman(price.total)} تومان برای {CYCLES.find((c) => c.id === cycle)!.fa}
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 whitespace-nowrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                    <Check size={15} className="shrink-0 text-[#ff6154]" /> {f}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => (p.id === 'free' ? (window.location.href = myPlan ? '/dashboard' : '/login') : buy(p.id))}
                disabled={isCurrent}
                className={`mt-6 rounded-2xl px-4 py-3 text-sm font-black transition ${
                  isCurrent ? 'cursor-default bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  : p.highlight ? 'bg-[#ff6154] text-white shadow hover:bg-[#e5544a]'
                  : 'bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200'
                }`}
              >
                {isCurrent ? 'پلن فعلی شما' : p.id === 'free' ? 'شروع رایگان' : `انتخاب پلن ${p.fa}`}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs font-bold text-gray-500 dark:text-gray-400">
        🔒 پرداخت امن با{' '}
        <a href="https://www.zarinpal.com" target="_blank" rel="noreferrer" className="text-[#ff6154] underline underline-offset-2">زرین‌پال</a>
      </p>
    </main>
  );
}
