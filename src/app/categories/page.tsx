import type { Metadata } from 'next';
import { Layers } from 'lucide-react';
import Link from 'next/link';
import { getAllCategories, slugifyCategory } from '@/lib/categories';
import { translateCategory } from '@/lib/translate';

export const metadata: Metadata = {
  title: 'دسته‌بندی‌ها',
  description: 'کاوش ایده‌های ترند استارتاپی بر اساس دسته‌بندی: هوش مصنوعی، ابزار توسعه‌دهندگان، بهره‌وری، طراحی، فین‌تک و بیشتر.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const cats = await getAllCategories();

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-600 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
        <Layers size={13} /> دسته‌بندی‌ها
      </span>
      <h1 className="mt-5 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
        ایده‌ها را بر اساس موضوع کاوش کن
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-8 text-gray-600 dark:text-gray-300">
        هر دسته‌بندی، مجموعه‌ای از ترندترین ایده‌های جهانی در همان حوزه است. روی هر دسته بزن تا ایده‌های همان موضوع را با جزئیات کامل ببینی.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cats.map((c) => (
          <Link
            key={c.name}
            href={`/category/${slugifyCategory(c.name)}`}
            className="group rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6154]/40 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="font-extrabold text-gray-800 transition group-hover:text-[#ff6154] dark:text-gray-100">
              {translateCategory(c.name)}
            </p>
            <p className="mt-1 text-[11px] font-bold text-gray-400 dark:text-gray-500" dir="ltr">{c.name}</p>
            <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
              {c.count.toLocaleString('fa-IR')} ایده در لیست‌ها
            </p>
          </Link>
        ))}
      </div>

      {cats.length === 0 && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          هنوز داده‌ای ثبت نشده است.
        </div>
      )}
    </main>
  );
}
