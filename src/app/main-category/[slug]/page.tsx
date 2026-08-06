import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { getAllCategories, slugifyCategory } from '@/lib/categories';
import { CATEGORY_TREE, slugifyMainCategory } from '@/lib/categoryTree';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_TREE.find((c) => slugifyMainCategory(c.name) === slug);
  return { title: cat?.fa ?? 'دسته‌بندی', description: `زیردسته‌های ${cat?.fa ?? ''} با ایده‌های ترند استارتاپی` };
}

export default async function MainCategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORY_TREE.find((c) => slugifyMainCategory(c.name) === slug);

  if (!cat) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500 dark:text-gray-400">
        <p className="text-xl font-bold">😕 دسته‌بندی پیدا نشد!</p>
        <Link href="/categories" className="mt-4 inline-block text-[#ff6154] hover:underline">بازگشت به دسته‌بندی‌ها</Link>
      </main>
    );
  }

  const allCats = await getAllCategories();
  const data = await loadLatest();
  const all: any[] = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];

  // شمارش محصولات هر زیردسته
  const subcats = cat.subcategories.map((sub) => {
    const subSlug = slugifyCategory(sub);
    const count = all.filter((p) => p.category.split('•').map((s: string) => s.trim()).includes(sub)).length;
    return { name: sub, slug: subSlug, count };
  }).filter((s) => s.count > 0);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#ff6154] dark:text-gray-300">
        <ArrowRight size={16} /> بازگشت به دسته‌بندی‌ها
      </Link>

      <div className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${cat.color}`} />
        <div className="flex items-start gap-4">
          <span className="text-5xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">{cat.fa}</h1>
            <p className="mt-1 text-sm font-bold text-gray-400" dir="ltr">{cat.name}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {subcats.length.toLocaleString('fa-IR')} زیردسته فعال با ایده‌های ترند
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {subcats.map((s) => (
          <Link
            key={s.slug}
            href={`/category/${s.slug}`}
            className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#ff6154]/40 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900"
          >
            <p className="font-extrabold text-gray-800 transition group-hover:text-[#ff6154] dark:text-gray-100" dir="ltr">
              {s.name}
            </p>
            <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">
              {s.count.toLocaleString('fa-IR')} ایده
            </p>
          </Link>
        ))}
      </div>

      {subcats.length === 0 && (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
          <p className="text-lg font-bold">🔍 هنوز ایده‌ای در زیردسته‌های این دسته نیست</p>
        </div>
      )}
    </main>
  );
}
