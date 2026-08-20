'use client';

import { Flame, Trophy } from 'lucide-react';
import { useState } from 'react';
import { ProductCard } from './ProductCard';
import { selectDefaultPeriod } from '@/lib/data-freshness';
import { PERIODS } from '@/lib/scraper';
import type { DailyData, PeriodKey } from '@/types';

export function Dashboard({ data }: { data: DailyData }) {
  const [tab, setTab] = useState<PeriodKey>(() => selectDefaultPeriod(data.periods));
  const products = data.periods[tab] ?? [];

  const totalVotes = products.reduce((s: number, p: any) => s + (p.votes ?? 0), 0);
  const activePeriod = PERIODS.find((p) => p.key === tab)!;

  return (
    <section id="trends">
      <div className="flex gap-1 overflow-x-auto rounded-3xl border border-gray-100 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {PERIODS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            aria-pressed={tab === t.key}
            className={`min-w-max flex-1 rounded-2xl px-4 py-3 text-center text-sm font-extrabold transition ${
              tab === t.key ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900' : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`}
          >
            {t.fa}
          </button>
        ))}
      </div>

      {products.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 text-xs font-bold">
          <span className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <Trophy size={13} className="text-amber-500" /> {activePeriod.fa}
          </span>
          <span className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-[#ff6154] shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Flame size={13} /> {totalVotes.toLocaleString('fa-IR')} رأی
          </span>
          <span className="rounded-full border border-gray-100 bg-white px-4 py-2 text-gray-600 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            {products.length.toLocaleString('fa-IR')} ایده
          </span>
        </div>
      )}

      <div className="mt-7 space-y-6">
        {products.length > 0 ? (
          products.map((p, idx) => (
            <ProductCard 
              key={`${tab}-${p.slug || p.id || idx}`} 
              product={p} 
            />
          ))
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold">🔍 داده‌ای برای این بازه نیست!</p>
          </div>
        )}
      </div>
    </section>
  );
}
