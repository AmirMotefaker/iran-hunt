import { aggregateFreshness, freshnessLabel, productFreshness } from '@/lib/content-freshness';
import type { Product } from '@/types';

export function ProductFreshnessSummary({ product }: { product: Product }) {
  const signal = productFreshness(product);

  return (
    <aside className="mx-auto mt-4 max-w-4xl rounded-2xl border border-gray-200 bg-gray-50/70 px-4 py-4 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#ff6154]">تازگی داده</p>
          <p className="mt-1 text-sm font-black text-gray-950 dark:text-white">{freshnessLabel(signal.status)}</p>
        </div>
        {signal.dataDate && <span className="text-xs font-bold text-gray-500 dark:text-gray-400">تاریخ داده: {signal.dataDate}</span>}
      </div>
      <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
        {signal.status === 'stale'
          ? 'این داده قدیمی است و ایده‌جو آن را به‌عنوان اطلاعات تازه معرفی نمی‌کند.'
          : signal.status === 'aging'
            ? 'این داده در حال قدیمی‌شدن است و برای تصمیم حساس بهتر است منبع رسمی نیز بررسی شود.'
            : signal.status === 'fresh'
              ? 'این وضعیت فقط بر اساس تاریخ واقعی ذخیره‌شده در Corpus محاسبه شده است.'
              : 'تاریخ معتبر کافی برای ادعای تازگی این محتوا موجود نیست.'}
      </p>
    </aside>
  );
}

export function AggregateFreshnessSummary({ products }: { products: Product[] }) {
  const summary = aggregateFreshness(products);

  return (
    <aside className="mt-6 rounded-3xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#ff6154]">تازگی محتوای این صفحه</p>
          <p className="mt-1 text-sm font-black text-gray-950 dark:text-white">{freshnessLabel(summary.status)}</p>
        </div>
        {summary.latestDataDate && <span className="text-xs font-bold text-gray-500 dark:text-gray-400">تازه‌ترین تاریخ داده: {summary.latestDataDate}</span>}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-gray-600 dark:text-gray-300 sm:grid-cols-4">
        <span>تازه: {summary.freshCount.toLocaleString('fa-IR')}</span>
        <span>در حال قدیمی‌شدن: {summary.agingCount.toLocaleString('fa-IR')}</span>
        <span>قدیمی: {summary.staleCount.toLocaleString('fa-IR')}</span>
        <span>نامشخص: {summary.unknownCount.toLocaleString('fa-IR')}</span>
      </div>
      {(summary.status === 'stale' || summary.status === 'aging') && (
        <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
          این صفحه وضعیت تازگی را شفاف نمایش می‌دهد و داده قدیمی را به‌عنوان اطلاعات جدید معرفی نمی‌کند.
        </p>
      )}
    </aside>
  );
}
