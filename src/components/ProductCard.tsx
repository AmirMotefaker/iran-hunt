import { ArrowLeft, Flame, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { LikeButton } from './LikeButton';
import type { Product } from '@/types';

const RANK_STYLES: Record<number, string> = {
  1: 'from-amber-400 to-yellow-500',
  2: 'from-slate-300 to-slate-400',
  3: 'from-orange-400 to-amber-600',
};

export function ProductCard({ product }: { product: Product }) {
  const slug = product.slug || '';
  const rankStyle =
    RANK_STYLES[product.rank] ?? 'from-[#ff6154] to-pink-500';

  const tags = product.category
    .split('•')
    .map((c) => c.trim())
    .filter(Boolean);

  const faSummary =
    product.faDescription ??
    product.faTagline ??
    '';

  const faShort =
    faSummary.length > 150
      ? `${faSummary.slice(0, 150)}…`
      : faSummary;

  return (
    <article className="group overflow-hidden rounded-[26px] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#ff6154]/20 hover:shadow-xl hover:shadow-black/[0.06] dark:border-white/5 dark:bg-white/[0.035] dark:hover:border-[#ff6154]/20">
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-3.5 sm:gap-4">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.thumbnail}
              alt={product.name}
              className="h-14 w-14 shrink-0 rounded-2xl border border-black/5 object-cover sm:h-16 sm:w-16 dark:border-white/10"
            />
          ) : (
            <span
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${rankStyle} text-lg font-black text-white shadow-sm sm:h-16 sm:w-16`}
            >
              {product.rank.toLocaleString('fa-IR')}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2
                  className="truncate text-lg font-black tracking-tight text-gray-950 sm:text-xl dark:text-white"
                  dir="ltr"
                >
                  {product.name}
                </h2>

                <p
                  className="mt-1 line-clamp-2 text-xs leading-6 text-gray-500 sm:text-sm dark:text-gray-400"
                  dir="ltr"
                >
                  {product.tagline}
                </p>
              </div>

              {slug && (
                <div className="shrink-0">
                  <LikeButton slug={slug} />
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#ff6154]/10 px-2.5 py-1 text-[11px] font-black text-[#e75549] dark:text-[#ff8176]">
                <Flame size={12} />
                {product.votes.toLocaleString('fa-IR')} رأی
              </span>

              {product.rank > 0 && (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-black text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                  رتبه {product.rank.toLocaleString('fa-IR')}
                </span>
              )}
            </div>
          </div>
        </div>

        {faShort && (
          <div className="mt-4 rounded-2xl border border-[#ff6154]/10 bg-[#ff6154]/[0.045] p-3.5 dark:bg-[#ff6154]/[0.06]">
            <div className="flex items-start gap-2">
              <Sparkles
                size={15}
                className="mt-1 shrink-0 text-[#ff6154]"
              />
              <p className="text-sm leading-7 text-gray-700 dark:text-gray-200">
                {faShort}
              </p>
            </div>
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {tags.slice(0, 4).map((c) => (
              <Link
                key={c}
                href={`/tag/${encodeURIComponent(c)}`}
                className="max-w-full truncate rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-extrabold text-gray-600 transition hover:bg-[#ff6154]/10 hover:text-[#ff6154] dark:bg-gray-900 dark:text-gray-400"
                dir="ltr"
              >
                {c}
              </Link>
            ))}

            {tags.length > 4 && (
              <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-[10px] font-black text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                +{(tags.length - 4).toLocaleString('fa-IR')}
              </span>
            )}
          </div>
        )}

        <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/5">
          {slug ? (
            <Link
              href={`/product/${slug}`}
              className="flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-4 py-2.5 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6154] sm:w-auto sm:inline-flex dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
            >
              مشاهده تحلیل کامل
              <ArrowLeft size={15} />
            </Link>
          ) : (
            <span className="text-xs font-bold text-gray-400">
              جزئیات به‌زودی
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
