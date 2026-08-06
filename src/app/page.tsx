import { ProductCard } from '@/components/ProductCard';
import { loadLatest } from '@/lib/storage';

export default async function Home() {
  const data = await loadLatest();

  const faDate = data
    ? new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(
        new Date(data.date),
      )
    : '';

  return (
    <main className="min-h-screen bg-gray-50 p-6 sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">🇮🇷 IranHunt</h1>
          <p className="mt-3 text-lg text-gray-600">
            هر روز ۵ محصول برتر ProductHunt + تحلیل مشابه ایرانی
          </p>
        </header>

        {data ? (
          <>
            <div className="mb-6 rounded-xl bg-white p-4 text-center shadow-sm">
              <span className="text-sm text-gray-500">گزارش روز:</span>{' '}
              <strong>{faDate}</strong>
            </div>
            <div className="space-y-6">
              {data.products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            <p className="text-lg font-semibold">هنوز داده‌ای ثبت نشده!</p>
            <p className="mt-2 text-sm">
              اولین اسکرپ را اجرا کن:{' '}
              <code className="rounded bg-gray-100 px-2 py-1">bun run scrape</code>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
