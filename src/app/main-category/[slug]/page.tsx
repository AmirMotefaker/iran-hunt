import type { Metadata } from 'next';
import {
  ArrowRight,
  Flame,
  Layers,
  Sparkles,
  Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import {
  CATEGORY_TREE,
  MAIN_TOPICS,
  slugifyMainCategory,
} from '@/lib/categoryTree';
import { slugifyCategory } from '@/lib/categories';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const cat = CATEGORY_TREE.find(
    (c) => slugifyMainCategory(c.name) === slug,
  );

  return {
    title: `${cat?.fa ?? 'دسته‌بندی'} | ایده‌جو`,
    description: `داغ‌ترین ایده‌های ترند جهانی در حوزه ${cat?.fa ?? ''} به همراه ترجمه فارسی و تحلیل فرصت بازار ایران`,
  };
}

export default async function MainCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const cat = CATEGORY_TREE.find(
    (c) => slugifyMainCategory(c.name) === slug,
  );

  if (!cat) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 dark:border-gray-800 dark:bg-gray-950">
          <p className="text-xl font-black text-gray-800 dark:text-gray-100">
            دسته‌بندی پیدا نشد
          </p>

          <Link
            href="/categories"
            className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ff6154]"
          >
            <ArrowRight size={15} />
            بازگشت به دسته‌بندی‌ها
          </Link>
        </div>
      </main>
    );
  }

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

  const topicsSet = new Set(
    (MAIN_TOPICS[cat.name] ?? []).map((t) =>
      t.toLowerCase(),
    ),
  );

  const matching = all.filter((p) =>
    p.category
      .split('•')
      .some((s: string) =>
        topicsSet.has(s.trim().toLowerCase()),
      ),
  );

  const hot = [...matching]
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 8);

  const totalVotes = matching.reduce(
    (sum, p) => sum + (p.votes ?? 0),
    0,
  );

  const subs = (MAIN_TOPICS[cat.name] ?? [])
    .map((t) => ({
      name: t,
      slug: slugifyCategory(t),
      count: all.filter((p) =>
        p.category
          .split('•')
          .map((s: string) => s.trim().toLowerCase())
          .includes(t.toLowerCase()),
      ).length,
    }))
    .filter((s) => s.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm font-black text-gray-500 transition hover:text-[#ff6154] dark:text-gray-400"
      >
        <ArrowRight size={15} />
        همه دسته‌بندی‌ها
      </Link>

      <section className="relative mt-5 overflow-hidden rounded-[30px] border border-black/5 bg-gray-950 p-6 text-white shadow-xl sm:p-9 dark:border-white/5">
        <div
          className={`absolute inset-0 bg-gradient-to-bl ${cat.color} opacity-80`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        <div className="relative">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-3xl backdrop-blur">
                {cat.icon}
              </span>

              <h1 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
                {cat.fa}
              </h1>

              <p
                className="mt-2 text-sm font-extrabold text-white/70"
                dir="ltr"
              >
                {cat.name}
              </p>

              <p className="mt-4 max-w-xl text-sm leading-8 text-white/80">
                ایده‌ها و محصولات ترند این حوزه را بر اساس داده واقعی،
                رأی کاربران و دسته‌بندی تخصصی مرور کن.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:min-w-[340px]">
              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-lg font-black">
                  {matching.length.toLocaleString('fa-IR')}
                </p>
                <p className="mt-1 text-[10px] font-extrabold text-white/65">
                  ایده فعال
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-lg font-black">
                  {subs.length.toLocaleString('fa-IR')}
                </p>
                <p className="mt-1 text-[10px] font-extrabold text-white/65">
                  زیردسته
                </p>
              </div>

              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-lg font-black">
                  {totalVotes.toLocaleString('fa-IR')}
                </p>
                <p className="mt-1 text-[10px] font-extrabold text-white/65">
                  رأی
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {subs.length > 0 && (
        <section className="mt-10">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
                <Layers size={15} />
                مسیرهای تخصصی
              </p>

              <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl dark:text-white">
                زیردسته‌های این حوزه
              </h2>
            </div>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:overflow-visible">
            {subs.map((s) => (
              <Link
                key={s.slug}
                href={`/category/${s.slug}`}
                className="flex min-h-11 shrink-0 items-center gap-2 rounded-2xl border border-black/5 bg-white px-4 py-2.5 text-sm font-black text-gray-700 shadow-sm transition hover:border-[#ff6154]/20 hover:text-[#ff6154] dark:border-white/5 dark:bg-white/[0.035] dark:text-gray-200"
              >
                {s.name}

                <span className="rounded-lg bg-[#ff6154]/10 px-2 py-0.5 text-[10px] font-black text-[#ff6154]">
                  {s.count.toLocaleString('fa-IR')}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-xs font-black text-[#ff6154]">
              <Trophy size={15} />
              انتخاب‌های برتر
            </p>

            <h2 className="mt-2 text-xl font-black text-gray-950 sm:text-2xl dark:text-white">
              داغ‌ترین ایده‌های این دسته
            </h2>

            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
              مرتب‌شده بر اساس رأی واقعی کاربران.
            </p>
          </div>

          {hot.length > 0 && (
            <span className="hidden items-center gap-1 rounded-xl bg-[#ff6154]/10 px-3 py-2 text-xs font-black text-[#ff6154] sm:inline-flex">
              <Flame size={13} />
              {hot.length.toLocaleString('fa-IR')} ایده منتخب
            </span>
          )}
        </div>

        {hot.length > 0 ? (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {hot.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-gray-300 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-950">
            <Sparkles
              size={24}
              className="mx-auto text-[#ff6154]"
            />

            <p className="mt-4 text-lg font-black text-gray-800 dark:text-gray-100">
              هنوز ایده‌ای در این دسته ثبت نشده
            </p>

            <p className="mt-2 text-sm leading-7 text-gray-500 dark:text-gray-400">
              با ورود داده‌های جدید، ایده‌های این حوزه به‌صورت خودکار اینجا
              نمایش داده می‌شوند.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
