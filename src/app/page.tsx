import {
  ArrowLeft,
  Brain,
  Flame,
  Layers,
  Rocket,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { Dashboard } from '@/components/Dashboard';
import { Logo } from '@/components/Logo';
import {
  formatTehranTimestamp,
  getFreshnessState,
} from '@/lib/data-freshness';
import { loadLatest } from '@/lib/storage';
import { loadCorpusProducts } from '@/lib/corpus';

export const dynamic = 'force-dynamic';

function countAI(all: any[]): number {
  const aiKeys = [
    'artificial intelligence',
    'ai',
    'machine learning',
    'llm',
    'chatgpt',
    'gpt',
  ];

  return all.filter((p) => {
    const cats = (p.category ?? '').toLowerCase();
    const tag = (p.tagline ?? '').toLowerCase();
    const desc = (p.description ?? '').toLowerCase();

    return aiKeys.some(
      (k) => cats.includes(k) || tag.includes(k) || desc.includes(k),
    );
  }).length;
}

export default async function Home() {
  const data = await loadLatest();
  const corpus = await loadCorpusProducts();

  const all = data
    ? [
        ...(data.periods.today ?? []),
        ...(data.periods.yesterday ?? []),
        ...(data.periods.week ?? []),
        ...(data.periods.month ?? []),
        ...(data.periods.year ?? []),
      ]
    : [];

  const votes = all.reduce((s, p) => s + p.votes, 0);

  const cats = new Set(
    all.flatMap((p) =>
      p.category
        .split('•')
        .map((s) => s.trim())
        .filter(Boolean),
    ),
  ).size;

  const aiCount = countAI(all);

  const freshness = data
    ? getFreshnessState(data.scrapedAt)
    : 'unknown';

  const lastUpdated = data
    ? formatTehranTimestamp(data.scrapedAt)
    : null;

  const freshnessLabel =
    freshness === 'fresh'
      ? 'داده‌ها تازه‌اند'
      : freshness === 'stale'
        ? 'در انتظار به‌روزرسانی'
        : 'وضعیت نامشخص';

  const freshnessColor =
    freshness === 'fresh'
      ? 'bg-emerald-500'
      : freshness === 'stale'
        ? 'bg-amber-500'
        : 'bg-gray-400';

  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-black/5 dark:border-white/5">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute right-[-10%] top-[-35%] h-[520px] w-[520px] rounded-full bg-[#ff6154]/10 blur-3xl" />
          <div className="absolute bottom-[-40%] left-[-10%] h-[460px] w-[460px] rounded-full bg-violet-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-20">
          <div className="mx-auto max-w-4xl text-center">
            <div className="fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-[#ff6154]/20 bg-[#ff6154]/5 px-4 py-2 text-xs font-black text-[#e75549] dark:bg-[#ff6154]/10 dark:text-[#ff8176]">
              <Sparkles size={14} />
              رادار روزانه ایده‌های جهانی
            </div>

            <div className="fade-up-1 mx-auto mt-7 flex h-20 w-20 items-center justify-center rounded-[26px] bg-white shadow-xl shadow-orange-100 ring-1 ring-black/5 dark:bg-gray-950 dark:shadow-black/30 dark:ring-white/10">
              <Logo size={54} />
            </div>

            <h1 className="fade-up-1 mx-auto mt-7 max-w-4xl text-4xl font-black leading-[1.25] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl dark:text-white">
              ایده‌های جهانی را
              <span className="mx-2 text-[#ff6154]">زودتر</span>
              ببین؛
              <br className="hidden sm:block" />
              برای ایران بهتر بساز
            </h1>

            <p className="fade-up-2 mx-auto mt-6 max-w-2xl text-sm font-medium leading-8 text-gray-600 sm:text-base sm:leading-9 dark:text-gray-400">
              ایده‌جو هر روز محصولات و ایده‌های ترند جهان را با رأی واقعی،
              کامنت واقعی، ترجمه فارسی و تحلیل فرصت بازار ایران جمع‌آوری و
              دسته‌بندی می‌کند.
            </p>

            <div className="fade-up-2 mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-6 py-3.5 text-sm font-black text-white shadow-xl shadow-gray-300/40 transition hover:-translate-y-0.5 sm:w-auto dark:bg-white dark:text-gray-950 dark:shadow-black/30"
              >
                مشاهده ایده‌ها
                <ArrowLeft size={16} />
              </Link>

              <Link
                href="/categories"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white/80 px-6 py-3.5 text-sm font-black text-gray-800 backdrop-blur transition hover:bg-white sm:w-auto dark:border-gray-800 dark:bg-gray-950/70 dark:text-gray-100"
              >
                کشف دسته‌بندی‌ها
                <Layers size={16} />
              </Link>
            </div>
          </div>

          <div className="fade-up-3 mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              {
                icon: Trophy,
                value: corpus.length.toLocaleString('fa-IR'),
                label: 'ایده در آرشیو',
              },
              {
                icon: Flame,
                value: votes.toLocaleString('fa-IR'),
                label: 'رأی واقعی',
              },
              {
                icon: Layers,
                value: cats.toLocaleString('fa-IR'),
                label: 'دسته فعال',
              },
              {
                icon: Brain,
                value: aiCount.toLocaleString('fa-IR'),
                label: 'ایده هوش مصنوعی',
              },
              {
                icon: Rocket,
                value: '۵',
                label: 'بازه زمانی',
              },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="group rounded-[22px] border border-black/5 bg-white/70 p-4 text-center shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.035]"
              >
                <Icon
                  size={17}
                  className="mx-auto text-[#ff6154] transition group-hover:scale-110"
                />
                <p className="mt-2 text-xl font-black tracking-tight text-gray-950 dark:text-white">
                  {value}
                </p>
                <p className="mt-1 text-[11px] font-extrabold text-gray-500 dark:text-gray-400">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black text-[#ff6154]">
              امروز چه چیزی ترند شده؟
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl dark:text-white">
              ایده‌های ترند روز
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
              تازه‌ترین محصولات و فرصت‌هایی که ارزش بررسی دارند.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-950">
            <div className="flex items-center gap-2 text-xs font-black text-gray-700 dark:text-gray-200">
              <span className={`h-2.5 w-2.5 rounded-full ${freshnessColor}`} />
              {freshnessLabel}
            </div>

            {lastUpdated && (
              <p className="mt-1 text-[10px] font-bold text-gray-500 dark:text-gray-500">
                آخرین داده: {lastUpdated}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-[30px] border border-black/5 bg-white p-3 shadow-xl shadow-black/[0.03] sm:p-6 dark:border-white/5 dark:bg-white/[0.025] dark:shadow-black/30">
          {data ? (
            <Dashboard data={data} />
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 p-14 text-center dark:border-gray-800">
              <p className="text-lg font-black text-gray-700 dark:text-gray-200">
                هنوز داده‌ای ثبت نشده
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
