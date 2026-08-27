import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { loadCorpus } from '@/lib/corpus';

export const dynamic = 'force-dynamic';

export default async function ProductsArchivePage() {
  const corpus = await loadCorpus();

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white">آرشیو کامل ایده‌جو</h1>
          <p className="mt-2 text-sm leading-7 text-gray-600 dark:text-gray-400">
            {corpus.audit.products.toLocaleString('fa-IR')} محصول یکتا از آرشیو تاریخی ایده‌جو
          </p>
        </div>
        <Link href="/" className="text-sm font-bold text-[#ff6154] hover:underline">
          بازگشت به صفحه اصلی
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-black">{corpus.audit.products.toLocaleString('fa-IR')}</div>
          <div className="mt-1 text-xs text-gray-500">محصول یکتا</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-black">{corpus.audit.withRealComments.toLocaleString('fa-IR')}</div>
          <div className="mt-1 text-xs text-gray-500">دارای کامنت واقعی</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-black">{corpus.audit.withPersianDescription.toLocaleString('fa-IR')}</div>
          <div className="mt-1 text-xs text-gray-500">توضیح فارسی</div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <div className="text-2xl font-black">{corpus.audit.withAiReview.toLocaleString('fa-IR')}</div>
          <div className="mt-1 text-xs text-gray-500">تحلیل AI</div>
        </div>
      </div>

      <div className="grid gap-5">
        {corpus.products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </main>
  );
}
