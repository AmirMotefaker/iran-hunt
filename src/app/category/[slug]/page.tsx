import type { Metadata } from 'next';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { getAllCategories, slugifyCategory } from '@/lib/categories';
import { translateCategory } from '@/lib/translate';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cats = await getAllCategories();
  const cat = cats.find((c) => slugifyCategory(c.name) === slug);
  const fa = cat ? translateCategory(cat.name) : 'دسته‌بندی';
  return { title: `ایده‌های ${fa}`, description: `جدیدترین ایده‌های ترند جهانی در دسته‌بندی ${fa} با ترجمه فارسی و تحلیل مشابه ایرانی` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadLatest();
  const cats = await getAllCategories();
  const cat = cats.find((c) => slugifyCategory(c.name) === slug);
  const enName = cat?.name ?? decodeURIComponent(slug).replace(/-/g, ' ');
  const faName = translateCategory(enName);

  const all: any[] = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];

  const products = all.filter((p) =>
    p.category.split('•').map((s: string) => s.trim()).includes(enName)
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#ff6154] dark:text-gray-300">
        <ArrowRight size={16} /> بازگشت به دسته‌بندی‌ها
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-to-l from-orange-50 via-white to-white p-8 dark:from-orange-950/40 dark:via-gray-900 dark:to-gray-900">
        <span className="rounded-full bg-[#ff6154] px-3 py-1 text-[10px] font-black text-white">دسته‌بندی</span>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">{faName}</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400" dir="ltr">{enName}</p>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          {products.length.toLocaleString('fa-IR')} ایده ترند در این دسته‌بندی
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-300 bg-white p-12 text-center text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300">
            <p className="text-lg font-bold">🔍 ایده‌ای در این دسته نیست</p>
          </div>
        )}
      </div>
    </main>
  );
}
