import { ProductCard } from '@/components/ProductCard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const data = await loadLatest();

  const faDate = data
    ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(new Date(data.date))
    : '';

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 sm:p-10" dir="rtl">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
            🇮🇷 IranHunt
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            هر روز ۵ محصول برتر ProductHunt + تحلیل مشابه ایرانی با هوش مصنوعی
          </p>
        </header>

        {data ? (
          <>
            <div className="mb-6 rounded-xl bg-white p-4 text-center shadow-sm border border-gray-100">
              <span className="text-sm text-gray-500">📅 گزارش روز:</span>{' '}
              <strong className="text-gray-900">{faDate}</strong>
            </div>
            <div className="space-y-6">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500">
            <p className="text-xl font-semibold">🔍 هنوز داده‌ای ثبت نشده!</p>
            <p className="mt-3 text-sm">
              اولین اسکرپ را اجرا کن:{' '}
              <code className="rounded bg-gray-100 px-3 py-1 font-mono text-sm">bun run scrape</code>
            </p>
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-gray-400">
          ساخته شده با ❤️ برای اکوسیستم استارتاپی ایران
        </footer>
      </div>
    </main>
  );
}
