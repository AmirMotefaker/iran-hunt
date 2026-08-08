import type { Metadata } from 'next';
import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { CATEGORY_TREE, MAIN_TOPICS, slugifyMainCategory } from '@/lib/categoryTree';
import { slugifyCategory } from '@/lib/categories';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORY_TREE.find((c) => slugifyMainCategory(c.name) === slug);
  return { title: `${cat?.fa ?? 'دسته‌بندی'} | ایده‌جو`, description: `زیردسته‌های ${cat?.fa ?? ''} مطابق ProductHunt + داغ‌ترین ایده‌های این حوزه` };
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

  const data = await loadLatest();
  const all: any[] = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];

  const topics = new Set((MAIN_TOPICS[cat.name] ?? []).map((t) => t.toLowerCase()));
  const hot = all.filter((p) => p.category.split('•').some((s: string) => topics.has(s.trim().toLowerCase()))).sort((a, b) => b.votes - a.votes).slice(0, 5);

  const subCounts = cat.subcategories.map((sub) => ({
    name: sub,
    slug: slugifyCategory(sub),
    count: all.filter((p) => p.category.split('•').map((s: string) => s.trim().toLowerCase()).includes(sub.toLowerCase())).length,
  }));

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#ff6154] dark:text-gray-300">
        <ArrowRight size={16} /> بازگشت به دسته‌بندی‌ها
      </Link>

      <div className="relative mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-900">
        <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-l ${cat.color}`} />
        <div className="flex items-start gap-4">
          <span className="text-5xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">{cat.fa}</h1>
            <p className="mt-1 text-sm font-bold text-gray-400" dir="ltr">{cat.name}</p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{cat.subcategories.length.toLocaleString('fa-IR')} زیردسته مطابق ProductHunt</p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-lg font-black text-gray-900 dark:text-white">زیردسته‌ها</h2>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {subCounts.map((s) => (
          <Link key={s.slug} href={`/category/${s.slug}`} className={`group rounded-2xl border p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${s.count > 0 ? 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900' : 'border-gray-100 bg-gray-50 opacity-70 dark:border-gray-800 dark:bg-gray-900/50'}`}>
            <p className="font-extrabold text-gray-800 transition group-hover:text-[#ff6154] dark:text-gray-100" dir="ltr">{s.name}</p>
            <p className="mt-2 text-xs font-bold text-gray-500 dark:text-gray-400">{s.count.toLocaleString('fa-IR')} ایده</p>
          </Link>
        ))}
      </div>

      {hot.length > 0 && (
        <>
          <h2 className="mt-12 flex items-center gap-2 text-lg font-black text-gray-900 dark:text-white">
            <Flame size={18} className="text-[#ff6154]" /> داغ‌ترین ایده‌های این دسته
          </h2>
          <div className="mt-6 space-y-6">
            {hot.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </>
      )}
    </main>
  );
}
