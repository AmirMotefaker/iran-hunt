import type { Metadata } from 'next';
import {
  ArrowRight,
  Flame,
  Hash,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const name = decodeURIComponent(tag);

  return {
    title: `ایده‌های ${name}`,
    description: `تمام ایده‌های ترند جهانی با برچسب ${name} به همراه ترجمه فارسی و تحلیل فرصت بازار ایران`,
    alternates: {
      canonical: `/tag/${encodeURIComponent(name)}`,
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const name = decodeURIComponent(tag);
  const data = await loadLatest();

  const all: any[] = data
    ? [
        ...(data.periods.today ?? []),
        ...(data.periods.yesterday ?? []),
        ...(data.periods.week ?? []),
        ...(data.periods.month ?? []),
        ...(data.periods.year ?? []),
      ]
    : [];

  const normalizedName = name.trim().toLowerCase();
  const unique = new Map<string, any>();

  for (const product of all) {
    const tags = product.category
      .split('•')
      .map((item: string) => item.trim().toLowerCase());

    if (
      tags.includes(normalizedName) &&
      product.slug &&
      !unique.has(product.slug)
    ) {
      unique.set(product.slug, product);
    }
  }

  const products = [...unique.values()].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
  );

  const totalVotes = products.reduce(
    (sum, product) => sum + (product.votes ?? 0),
    0,
  );

  const topProduct = products[0];

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-black text-gray-500 transition hover:text-[#ff6154] dark:text-gray-400"
      >
        <ArrowRight size={15} />
        دسته‌بندی‌ها
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-xl shadow-black/[0.04] sm:p-8 lg:p-10 dark:border-white/5 dark:bg-white/[0.035]">
        <div className="pointer-events-none absolute -left-16 -top-20 h-52 w-52 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-1.5 text-xs font-black text-white">
            <Hash size={13} />
            برچسب
          </span>

          <h1
            className="mt-5 break-words text-3xl font-black tracking-tight text-gray-950 sm:text-5xl dark:text-white"
            dir="ltr"
          >
            #{name}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-600 sm:text-base dark:text-gray-300">
            محصولات مرتبط با این موضوع را بر اساس استقبال واقعی کاربران
            مرور کن و سریع‌تر ایده‌های شاخص این حوزه را پیدا کن.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
              <Sparkles size={17} className="text-indigo-500" />
              <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
                {products.length.toLocaleString('fa-IR')}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                ایده مرتبط
              </span>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
              <Flame size={17} className="text-[#ff6154]" />
              <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
                {totalVotes.toLocaleString('fa-IR')}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                مجموع رأی‌ها
              </span>
            </div>

            <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
              <TrendingUp size={17} className="text-[#ff6154]" />
              <strong
                className="mt-3 block truncate text-lg font-black text-gray-950 dark:text-white"
                dir="ltr"
              >
                {topProduct?.name ?? '—'}
              </strong>
              <span className="mt-1 block text-xs text-gray-500">
                محبوب‌ترین محصول
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#ff6154]">
              نتایج این برچسب
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              محصولات مرتبط
            </h2>
          </div>

          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            مرتب‌شده بر اساس بیشترین رأی
          </p>
        </div>

        {products.length > 0 ? (
          <div className="mt-6 grid items-start gap-5 lg:grid-cols-2">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[26px] border-2 border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-700 dark:bg-white/[0.035]">
            <Hash
              size={26}
              className="mx-auto text-indigo-500"
            />

            <p className="mt-4 text-lg font-black text-gray-900 dark:text-white">
              ایده‌ای با این برچسب پیدا نشد
            </p>

            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
              می‌توانی از دسته‌بندی‌ها برای پیدا کردن موضوعات مرتبط استفاده کنی.
            </p>

            <Link
              href="/categories"
              className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-gray-950 px-5 text-sm font-black text-white transition hover:bg-[#ff6154] dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
            >
              مشاهده دسته‌بندی‌ها
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
