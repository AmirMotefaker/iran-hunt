import {
  ArrowLeft,
  Archive,
  BrainCircuit,
  MessageCircle,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/ProductCard';
import { loadCorpus } from '@/lib/corpus';

export const dynamic = 'force-dynamic';

export default async function ProductsArchivePage() {
  const corpus = await loadCorpus();

  const products = [...corpus.products].sort(
    (a, b) => (b.votes ?? 0) - (a.votes ?? 0),
  );

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="relative overflow-hidden rounded-[30px] border border-black/5 bg-white p-6 shadow-xl shadow-black/[0.04] sm:p-8 lg:p-10 dark:border-white/5 dark:bg-white/[0.035]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#ff6154]/10 blur-3xl" />

        <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#ff6154] px-3 py-1.5 text-xs font-black text-white">
              <Archive size={13} />
              آرشیو ایده‌جو
            </span>

            <h1 className="mt-5 text-3xl font-black tracking-tight text-gray-950 sm:text-5xl dark:text-white">
              همه محصولات، یکجا
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-gray-600 sm:text-base dark:text-gray-300">
              آرشیو ماندگار محصولات کشف‌شده توسط ایده‌جو؛
              برای مرور ایده‌ها، تحلیل بازار و پیدا کردن
              فرصت‌هایی که ارزش بررسی بیشتری دارند.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-950 px-5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6154] dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
          >
            صفحه اصلی
            <ArrowLeft size={15} />
          </Link>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
            <Archive
              size={17}
              className="text-[#ff6154]"
            />
            <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
              {corpus.audit.products.toLocaleString('fa-IR')}
            </strong>
            <span className="mt-1 block text-xs text-gray-500">
              محصول یکتا
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
            <MessageCircle
              size={17}
              className="text-[#ff6154]"
            />
            <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
              {corpus.audit.withRealComments.toLocaleString('fa-IR')}
            </strong>
            <span className="mt-1 block text-xs text-gray-500">
              دارای نظر واقعی
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
            <Sparkles
              size={17}
              className="text-[#ff6154]"
            />
            <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
              {corpus.audit.withPersianDescription.toLocaleString('fa-IR')}
            </strong>
            <span className="mt-1 block text-xs text-gray-500">
              دارای توضیح فارسی
            </span>
          </div>

          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900">
            <BrainCircuit
              size={17}
              className="text-[#ff6154]"
            />
            <strong className="mt-3 block text-2xl font-black text-gray-950 dark:text-white">
              {corpus.audit.withAiReview.toLocaleString('fa-IR')}
            </strong>
            <span className="mt-1 block text-xs text-gray-500">
              دارای تحلیل هوش مصنوعی
            </span>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black text-[#ff6154]">
              پایگاه ایده‌ها
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              محصولات آرشیوشده
            </h2>
          </div>

          <p className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {products.length.toLocaleString('fa-IR')} محصول برای مرور
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
          <div className="mt-6 rounded-[26px] border-2 border-dashed border-gray-300 bg-white p-12 text-center dark:border-gray-700 dark:bg-white/[0.035]">
            <Sparkles
              size={26}
              className="mx-auto text-[#ff6154]"
            />

            <p className="mt-4 text-lg font-black text-gray-900 dark:text-white">
              آرشیو هنوز خالی است
            </p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              محصولات جدید پس از ورود به پایگاه داده در این
              بخش نمایش داده می‌شوند.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
