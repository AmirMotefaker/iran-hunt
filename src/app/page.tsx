import { Flame, Trophy } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { TOP_COUNT } from '@/lib/scraper';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await loadLatest();

  const faDate = data
    ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date(data.date))
    : '';

  const totalVotes = data?.products.reduce((s, p) => s + p.votes, 0) ?? 0;

  return (
    <main className="min-h-screen pb-16">
      {/* Hero */}
      <header className="relative overflow-hidden bg-gradient-to-bl from-[#ff6154] via-[#ff8a5c] to-amber-400 pb-24 pt-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="IranHunt logo"
            className="h-24 w-24 rounded-3xl bg-white/95 p-2 shadow-2xl"
          />
          <h1 className="mt-5 text-5xl font-black tracking-tight drop-shadow-sm">
            IranHunt <span className="text-2xl font-bold">🇮🇷</span>
          </h1>
          <p className="mt-3 max-w-xl text-lg font-medium text-white/95 leading-8">
            هر روز {TOP_COUNT} محصول برتر ProductHunt — با رتبه‌بندی واقعی، توضیح
            فارسی روان و تحلیل مشابه ایرانی با هوش مصنوعی
          </p>

          {data && (
            <div className="mt-6 flex gap-3 text-sm font-bold">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                <Trophy size={16} /> {faDate}
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-4 py-2 backdrop-blur">
                <Flame size={16} />
                {totalVotes.toLocaleString('fa-IR')} رأی امروز
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Cards */}
      <section className="mx-auto -mt-14 max-w-3xl space-y-6 px-4">
        {data ? (
          data.products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <p className="text-xl font-bold">🔍 هنوز داده‌ای ثبت نشده!</p>
            <p className="mt-3 text-sm">
              اجرا کن:{' '}
              <code className="rounded bg-gray-100 px-3 py-1 font-mono">bun run scrape</code>
            </p>
          </div>
        )}
      </section>

      <footer className="mt-16 text-center text-sm text-gray-400">
        ساخته شده با ❤️ برای اکوسیستم استارتاپی ایران — داده از ProductHunt
      </footer>
    </main>
  );
}
