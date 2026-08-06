'use client';

import { Flame, LayoutGrid, Trophy } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ProductCard } from './ProductCard';
import { PERIODS } from '@/lib/scraper';
import type { DailyData, PeriodKey } from '@/types';

export function Dashboard({ data }: { data: DailyData }) {
  const [tab, setTab] = useState<PeriodKey>('today');
  const [category, setCategory] = useState<string>('all');

  const products = data.periods[tab] ?? [];

  const topCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      for (const c of p.category.split('•').map((s) => s.trim()).filter(Boolean)) {
        counts.set(c, (counts.get(c) ?? 0) + 1);
      }
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([name]) => name);
  }, [products]);

  const filtered =
    category === 'all'
      ? products
      : products.filter((p) => p.category.split('•').map((s) => s.trim()).includes(category));

  const totalVotes = filtered.reduce((s, p) => s + p.votes, 0);
  const activePeriod = PERIODS.find((p) => p.key === tab)!;

  return (
    <section className="relative z-10 mx-auto -mt-16 max-w-4xl px-4">
      <div className="flex gap-1 overflow-x-auto rounded-3xl bg-white p-2 shadow-xl shadow-gray-200/60">
        {PERIODS.map((t) => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setCategory('all'); }}
            className={`min-w-max flex-1 rounded-2xl px-4 py-3 text-center text-sm font-extrabold transition ${
              tab === t.key ? 'bg-[#ff6154] text-white shadow-lg shadow-orange-200' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.fa}
          </button>
        ))}
      </div>

      {topCategories.length > 0 && (
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
          <LayoutGrid size={16} className="shrink-0 text-gray-400" />
          <button
            onClick={() => setCategory('all')}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
              category === 'all' ? 'bg-gray-900 text-white' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'
            }`}
          >
            همه
          </button>
          {topCategories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c === category ? 'all' : c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                category === c ? 'bg-[#ff6154] text-white shadow' : 'bg-white text-gray-600 shadow-sm hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-sm font-bold">
          <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-gray-700 shadow-sm">
            <Trophy size={15} className="text-amber-500" /> {activePeriod.fa}
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-[#ff6154] shadow-sm">
            <Flame size={15} /> {totalVotes.toLocaleString('fa-IR')} رأی
          </span>
          <span className="rounded-full bg-white px-4 py-2 text-gray-700 shadow-sm">
            {filtered.length.toLocaleString('fa-IR')} ایده
          </span>
        </div>
      )}

      <div className="mt-6 space-y-6">
        {filtered.length > 0 ? (
          filtered.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <p className="text-lg font-bold">🔍 داده‌ای برای این بازه نیست!</p>
          </div>
        )}
      </div>
    </section>
  );
}
