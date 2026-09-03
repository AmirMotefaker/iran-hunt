import { buildProductEvidence, evidenceQualityLabel } from '@/lib/evidence-layer';
import type { Product } from '@/types';

export function ProductEvidenceBlock({ product }: { product: Product }) {
  const evidence = buildProductEvidence(product);

  return (
    <section className="mx-auto mt-6 max-w-4xl rounded-2xl border border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black text-[#ff6154]">شفافیت منبع و شواهد</p>
          <h2 className="mt-1 text-base font-black text-gray-950 dark:text-white">{evidenceQualityLabel(evidence.quality)}</h2>
        </div>
        {evidence.dataDate && (
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">تاریخ داده: {evidence.dataDate}</span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
        {evidence.category && <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-gray-700">دسته: {evidence.category}</span>}
        {evidence.maker && <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-gray-700">سازنده: {evidence.maker}</span>}
        {typeof evidence.votes === 'number' && <span className="rounded-full border border-gray-200 px-3 py-1 dark:border-gray-700">{evidence.votes.toLocaleString('fa-IR')} رأی ثبت‌شده</span>}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs font-black">
        {evidence.sourceUrl && <a href={evidence.sourceUrl} target="_blank" rel="noreferrer" className="text-[#ff6154] hover:underline">منبع ثبت محصول</a>}
        {evidence.websiteUrl && <a href={evidence.websiteUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-[#ff6154] dark:text-gray-300">وب‌سایت رسمی</a>}
      </div>

      <div className="mt-4 rounded-xl bg-gray-50 p-3 text-xs leading-6 text-gray-600 dark:bg-gray-900 dark:text-gray-300">
        <p className="font-black text-gray-800 dark:text-gray-100">محدودیت شواهد</p>
        <ul className="mt-2 list-inside list-disc space-y-1">
          {evidence.limitations.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </div>
    </section>
  );
}
