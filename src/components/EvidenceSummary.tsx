import { aggregateEvidence } from '@/lib/evidence-layer';
import type { Product } from '@/types';

export function EvidenceSummary({ products }: { products: Product[] }) {
  const summary = aggregateEvidence(products);

  return (
    <aside className="mt-8 rounded-3xl border border-gray-200 bg-gray-50/70 p-5 dark:border-gray-800 dark:bg-gray-900/70">
      <p className="text-xs font-black text-[#ff6154]">شفافیت شواهد</p>
      <div className="mt-3 grid gap-3 text-sm text-gray-700 dark:text-gray-300 sm:grid-cols-2 lg:grid-cols-4">
        <div><span className="font-black">محصول بررسی‌شده:</span> {summary.totalProducts.toLocaleString('fa-IR')}</div>
        <div><span className="font-black">شواهد قوی:</span> {summary.strongCount.toLocaleString('fa-IR')}</div>
        <div><span className="font-black">شواهد متوسط:</span> {summary.moderateCount.toLocaleString('fa-IR')}</div>
        <div><span className="font-black">شواهد محدود:</span> {summary.limitedCount.toLocaleString('fa-IR')}</div>
      </div>
      {summary.latestDataDate && (
        <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
          تازه‌ترین تاریخ داده در این صفحه: {summary.latestDataDate}
        </p>
      )}
      <p className="mt-3 text-xs leading-6 text-gray-500 dark:text-gray-400">
        این صفحه فقط از داده‌های ذخیره‌شده ایده‌جو و لینک‌های منبع/وب‌سایت رسمی موجود استفاده می‌کند و قیمت، سهم بازار، عملکرد یا قابلیت تأییدنشده تولید نمی‌کند.
      </p>
    </aside>
  );
}
