import type { Metadata } from 'next';
import Link from 'next/link';
import { CATEGORY_TREE, slugifyMainCategory } from '@/lib/categoryTree';

export const metadata: Metadata = {
  title: 'دسته‌بندی‌ها',
  description: 'کاوش ایده‌های ترند استارتاپی در ۲۲ دسته اصلی و صدها زیردسته: هوش مصنوعی، ابزار توسعه‌دهندگان، بهره‌وری، طراحی، فین‌تک و بیشتر.',
};

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        📂 دسته‌بندی‌ها
      </span>
      <h1 className="mt-5 text-3xl font-black text-gray-900 dark:text-white sm:text-5xl">
        ایده‌ها را بر اساس موضوع کاوش کن
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-300">
        ۲۲ دسته اصلی استارتاپی با صدها زیردسته تخصصی. روی هر دسته بزن تا ایده‌های آن حوزه را ببینی.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_TREE.map((cat) => (
          <Link
            key={cat.name}
            href={`/main-category/${slugifyMainCategory(cat.name)}`}
            className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6154]/40 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900"
          >
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${cat.color}`} />
            <div className="flex items-start gap-4">
              <span className="text-4xl">{cat.icon}</span>
              <div className="flex-1">
                <h3 className="text-lg font-black text-gray-900 group-hover:text-[#ff6154] dark:text-white">
                  {cat.fa}
                </h3>
                <p className="mt-0.5 text-[11px] font-bold text-gray-400 dark:text-gray-500" dir="ltr">{cat.name}</p>
                <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
                  {cat.subcategories.length.toLocaleString('fa-IR')} زیردسته
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {cat.subcategories.slice(0, 4).map((s) => (
                <span key={s} className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-600 dark:bg-gray-800 dark:text-gray-400" dir="ltr">{s}</span>
              ))}
              {cat.subcategories.length > 4 && (
                <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                  +{(cat.subcategories.length - 4).toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
