import { Brain, Cpu, Database, Flame, Layers, Rocket, Trophy } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Logo } from '@/components/Logo';
import { formatTehranTimestamp, getFreshnessState } from '@/lib/data-freshness';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

function countAI(all: any[]): number {
  const aiKeys = ['artificial intelligence', 'ai', 'machine learning', 'llm', 'chatgpt', 'gpt'];
  let n = 0;
  for (const p of all) {
    const cats = (p.category ?? '').toLowerCase();
    const tag = (p.tagline ?? '').toLowerCase();
    const desc = (p.description ?? '').toLowerCase();
    if (aiKeys.some((k) => cats.includes(k) || tag.includes(k) || desc.includes(k))) n++;
  }
  return n;
}

export default async function Home() {
  const data = await loadLatest();

  const all = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];
  const votes = all.reduce((s, p) => s + p.votes, 0);
  const cats = new Set(all.flatMap((p) => p.category.split('•').map((s) => s.trim()).filter(Boolean))).size;
  const aiCount = countAI(all);
  const freshness = data ? getFreshnessState(data.scrapedAt) : 'unknown';
  const lastUpdated = data ? formatTehranTimestamp(data.scrapedAt) : null;
  const freshnessLabel = freshness === 'fresh' ? 'به‌روز' : freshness === 'stale' ? 'نیازمند به‌روزرسانی' : 'وضعیت نامشخص';
  const freshnessColor = freshness === 'fresh' ? 'bg-emerald-500' : freshness === 'stale' ? 'bg-amber-500' : 'bg-gray-400';

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 pb-4 pt-16 text-center sm:pt-20">
        <div className="fade-up mx-auto flex h-24 w-24 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-orange-100 ring-1 ring-gray-200 dark:bg-gray-900 dark:shadow-black/40 dark:ring-gray-800">
          <Logo size={64} />
        </div>
        <h1 className="fade-up-1 mt-6 text-5xl font-black tracking-tight text-gray-900 dark:text-white sm:text-6xl">ایده‌جو</h1>
        <p className="fade-up-1 mt-3 text-lg font-bold text-[#ff6154] sm:text-xl">ایده‌ی درست، در زمان درست</p>
        <p className="fade-up-2 mx-auto mt-4 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-400 sm:text-base">
          نبض نوآوری جهان در دستان تو؛ هر روز ۱۰ ایده برتر جهانی با رأی واقعی، ترجمه روان و تحلیل هوش مصنوعی از نسخه ایرانی — قبل از اینکه بقیه بفهمن!
        </p>

        <div className="fade-up-3 mx-auto mt-9 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Trophy size={17} className="mx-auto text-amber-500" />
            <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{all.length.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">ایده تحلیل‌شده</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Flame size={17} className="mx-auto text-[#ff6154]" />
            <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{votes.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">رأی واقعی</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Layers size={17} className="mx-auto text-indigo-500" />
            <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{cats.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">دسته‌بندی</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Brain size={17} className="mx-auto text-purple-500" />
            <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">{aiCount.toLocaleString('fa-IR')}</p>
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">ایده AI</p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <Rocket size={17} className="mx-auto text-emerald-500" />
            <p className="mt-2 text-lg font-black text-gray-900 dark:text-white">۵</p>
            <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400">بازه زمانی</p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-10 max-w-5xl px-4">
        <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-gradient-to-b from-orange-50 via-white to-white dark:from-orange-950/30 dark:via-gray-900 dark:to-gray-950" />
        <div className="relative rounded-[2.5rem] border border-orange-200/70 p-6 shadow-xl shadow-orange-100/40 backdrop-blur dark:border-orange-900/40 dark:shadow-black/40 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu size={18} className="text-[#ff6154]" />
              <h2 className="text-lg font-black text-gray-900 dark:text-white">ایده‌های ترند روز</h2>
            </div>
            <div className="text-left">
              <span className="inline-flex items-center gap-2 text-sm font-black text-gray-700 dark:text-gray-200">
                <span className={`h-2.5 w-2.5 rounded-full ${freshnessColor}`} />
                {freshnessLabel}
              </span>
              {lastUpdated && (
                <p className="mt-1 text-[10px] font-bold text-gray-500 dark:text-gray-400">
                  آخرین داده: {lastUpdated}
                </p>
              )}
            </div>
          </div>
          {data ? (
            <Dashboard data={data} />
          ) : (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-800 dark:bg-gray-900">
              <p className="text-xl font-bold">🔍 هنوز داده‌ای ثبت نشده!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

