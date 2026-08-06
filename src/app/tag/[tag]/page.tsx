import { ArrowRight, Hash } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  const data = await loadLatest();

  const all: any[] = data
    ? [...(data.periods.today ?? []), ...(data.periods.yesterday ?? []), ...(data.periods.week ?? []), ...(data.periods.month ?? []), ...(data.periods.year ?? [])]
    : [];

  const products = all.filter((p) =>
    p.category.split('•').map((s: string) => s.trim().toLowerCase()).includes(name.toLowerCase())
  );

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#ff6154] dark:text-gray-400">
        <ArrowRight size={16} /> بازگشت به خانه
      </Link>

      <div className="mt-4 rounded-3xl bg-gradient-to-l from-indigo-50 via-white to-white p-8 dark:from-indigo-950/30 dark:via-gray-900 dark:to-gray-900">
        <span className="rounded-full bg-indigo-600 px-3 py-1 text-[10px] font-black text-white">هشتگ</span>
        <h1 className="mt-3 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl" dir="ltr">
          <Hash className="inline" size={26} /> {name}
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {products.length.toLocaleString('fa-IR')} ایده با این برچسب
        </p>
      </div>

      <div className="mt-8 space-y-6">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-white p-12 text-center text-gray-400 dark:border-gray-800 dark:bg-gray-900">
            <p className="text-lg font-bold">🔍 ایده‌ای با این برچسب پیدا نشد</p>
          </div>
        )}
      </div>
    </main>
  );
}
