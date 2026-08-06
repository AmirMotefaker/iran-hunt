import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadLatest();
  const name = decodeURIComponent(slug).replace(/-/g, ' ');

  const all: any[] = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];

  const products = all.filter((p) =>
    p.category.split('•').map((s: string) => s.trim().toLowerCase()).includes(name.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/categories" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#ff6154] dark:text-gray-400">
        <ArrowRight size={16} /> بازگشت به دسته‌بندی‌ها
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-to-l from-orange-50 via-white to-white p-8 dark:from-orange-950/30 dark:via-gray-900 dark:to-gray-900">
        <span className="rounded-full bg-[#ff6154] px-3 py-1 text-[10px] font-black text-white">دسته‌بندی</span>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl" dir="ltr">{name}</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {products.length.toLocaleString('fa-IR')} ایده ترند در این دسته‌بندی
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold">🔍 ایده‌ای در این دسته نیست</p>
          </div>
        )}
      </div>
    </main>
  );
}
