import type { Metadata } from 'next';
import { ArrowLeft, Layers3, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  CATEGORY_TREE,
  slugifyMainCategory,
} from '@/lib/categoryTree';

export const metadata: Metadata = {
  title: 'دسته‌بندی‌ها',
  description:
    'کاوش ایده‌های ترند استارتاپی در ۲۲ دسته اصلی و صدها زیردسته تخصصی در ایده‌جو.',
};

export const dynamic = 'force-dynamic';

export default function CategoriesPage() {
  const subcategoryCount = CATEGORY_TREE.reduce(
    (sum, cat) => sum + cat.subcategories.length,
    0,
  );

  return (
    <main>
      <section className="border-b border-black/5 dark:border-white/5">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ff6154]/20 bg-[#ff6154]/5 px-4 py-2 text-xs font-black text-[#e75549] dark:bg-[#ff6154]/10 dark:text-[#ff8176]">
              <Sparkles size={14} />
              نقشه موضوعی ایده‌جو
            </span>

            <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-gray-950 sm:text-5xl dark:text-white">
              ایده‌ها را بر اساس
              <span className="mx-2 text-[#ff6154]">حوزه</span>
              کشف کن
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-600 sm:text-base dark:text-gray-400">
              از هوش مصنوعی و توسعه نرم‌افزار تا فین‌تک، طراحی و بهره‌وری؛
              سریع وارد حوزه‌ای شو که برایت مهم است و ایده‌های ترند آن را ببین.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="rounded-xl border border-black/5 bg-white px-3 py-2 text-xs font-black text-gray-700 dark:border-white/5 dark:bg-white/[0.035] dark:text-gray-200">
                {CATEGORY_TREE.length.toLocaleString('fa-IR')} دسته اصلی
              </span>

              <span className="rounded-xl border border-black/5 bg-white px-3 py-2 text-xs font-black text-gray-700 dark:border-white/5 dark:bg-white/[0.035] dark:text-gray-200">
                {subcategoryCount.toLocaleString('fa-IR')} زیردسته
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CATEGORY_TREE.map((cat) => (
            <Link
              key={cat.name}
              href={`/main-category/${slugifyMainCategory(cat.name)}`}
              className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[26px] border border-black/5 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ff6154]/20 hover:shadow-xl hover:shadow-black/[0.06] dark:border-white/5 dark:bg-white/[0.035]"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${cat.color}`}
              />

              <div className="flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-2xl dark:bg-gray-900">
                    {cat.icon}
                  </span>

                  <div className="min-w-0">
                    <h2 className="text-lg font-black text-gray-950 transition group-hover:text-[#ff6154] dark:text-white">
                      {cat.fa}
                    </h2>

                    <p
                      className="mt-1 truncate text-[11px] font-extrabold text-gray-400"
                      dir="ltr"
                    >
                      {cat.name}
                    </p>
                  </div>
                </div>

                <ArrowLeft
                  size={17}
                  className="mt-1 shrink-0 text-gray-300 transition group-hover:-translate-x-1 group-hover:text-[#ff6154]"
                />
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {cat.subcategories.slice(0, 5).map((s) => (
                  <span
                    key={s}
                    className="max-w-full truncate rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-600 dark:bg-gray-900 dark:text-gray-400"
                    dir="ltr"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-gray-500 dark:text-gray-400">
                  <Layers3 size={14} />
                  {cat.subcategories.length.toLocaleString('fa-IR')} زیردسته
                </span>

                <span className="text-xs font-black text-[#ff6154]">
                  مشاهده ایده‌ها
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
