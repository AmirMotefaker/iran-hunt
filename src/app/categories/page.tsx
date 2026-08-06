import { Layers } from 'lucide-react';
import Link from 'next/link';
import { loadLatest } from '@/lib/storage';

export const metadata = {
  title: 'دسته‌بندی‌ها',
  description:
    'کاوش ایده‌های ترند استارتاپی بر اساس دسته‌بندی: هوش مصنوعی، ابزار توسعه‌دهندگان، بهره‌وری، طراحی، فین‌تک و بیشتر.',
};

export const dynamic = 'force-dynamic';

export default async function CategoriesPage() {
  const data = await loadLatest();

  const counts = new Map<string, number>();
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month'] as const) {
      for (const p of data.periods[key] ?? []) {
        for (const c of p.category.split('•').map((s) => s.trim()).filter(Boolean)) {
          counts.set(c, (counts.get(c) ?? 0) + 1);
        }
      }
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-16">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-bold text-gray-500 shadow-sm">
        <Layers size={13} /> دسته‌بندی‌ها
      </span>
      <h1 className="mt-5 text-3xl font-black text-gray-900 sm:text-4xl">
        ایده‌ها را بر اساس موضوع کاوش کن
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-8 text-gray-500">
        هر دسته‌بندی، مجموعه‌ای از ترندترین ایده‌های جهانی در همان حوزه است. روی هر
        دسته بزن تا ایده‌های همان موضوع را ببینی.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {sorted.map(([name, count]) => (
          <Link
            key={name}
            href={`/?cat=${encodeURIComponent(name)}`}
            className="group rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6154]/30 hover:shadow-lg"
          >
            <p className="font-extrabold text-gray-800 transition group-hover:text-[#ff6154]" dir="ltr">
              {name}
            </p>
            <p className="mt-2 text-xs font-bold text-gray-400">
              {count.toLocaleString('fa-IR')} ایده در لیست‌ها
            </p>
          </Link>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-400">
          هنوز داده‌ای ثبت نشده است.
        </div>
      )}
    </main>
  );
}
