import { Dashboard } from '@/components/Dashboard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await loadLatest();

  const faDate = data
    ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date(data.scrapedAt))
    : '';

  return (
    <main className="min-h-screen pb-16">
      <header className="relative overflow-hidden bg-gradient-to-bl from-[#ff6154] via-[#ff8a5c] to-amber-400 pb-32 pt-12 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="IranHunt" className="h-24 w-24 rounded-3xl bg-white p-3 shadow-2xl" />
          <h1 className="mt-5 text-5xl font-black tracking-tight drop-shadow-sm">IranHunt</h1>
          <p className="mt-3 max-w-xl text-lg font-medium leading-8 text-white/95">
            پلتفرم هوشمند ایده‌های جذاب و ترند استارتاپی — هر روز ۱۰ ایده برتر
            جهانی در ۴ بازه زمانی، با رتبه‌بندی واقعی، توضیح فارسی روان و تحلیل
            مشابه ایرانی با هوش مصنوعی
          </p>
          {data && (
            <div className="mt-6">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-bold backdrop-blur">
                🗓️ آخرین به‌روزرسانی: {faDate}
              </span>
            </div>
          )}
        </div>
      </header>

      {data ? (
        <Dashboard data={data} />
      ) : (
        <section className="relative z-10 mx-auto -mt-16 max-w-3xl px-4">
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <p className="text-xl font-bold">🔍 هنوز داده‌ای ثبت نشده!</p>
          </div>
        </section>
      )}
    </main>
  );
}
