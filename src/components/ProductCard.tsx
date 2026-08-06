import { ArrowLeft, Flame } from 'lucide-react';
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
  const rankStyle = RANK_STYLES[product.rank] ?? 'from-[#ff6154] to-pink-500';
  const tags = (product.categoryFa ?? product.category)
    .split('•')
    .map((c) => c.trim())
    .filter(Boolean);

  const faSummary = product.faDescription ?? product.faTagline ?? '';
  const faShort = faSummary.length > 140 ? faSummary.slice(0, 140) + '…' : faSummary;

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 transition hover:-translate-y-1 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900 dark:shadow-black/40">
      <div className="flex items-start gap-4 p-6 pb-4">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnail} alt={product.name} className="h-14 w-14 rounded-2xl border border-gray-200 object-cover dark:border-gray-800" />
        ) : (
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${rankStyle} text-xl font-black text-white shadow`}>
            {product.rank}
          </span>
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white" dir="ltr">{product.name}</h2>
            <div className="flex items-center gap-2">
              {slug && <LikeButton slug={slug} />}
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-[#ff6154] dark:bg-orange-950/40">
                <Flame size={15} /> {product.votes.toLocaleString('fa-IR')}
              </span>
            </div>
          </div>
          <p className="mt-1 text-sm italic text-gray-500 dark:text-gray-400" dir="ltr">{product.tagline}</p>
        </div>
      </div>

      {/* خط توضیح فارسی */}
      {faShort && (
        <p className="mx-6 rounded-2xl border border-orange-200 bg-orange-50/70 p-3.5 text-sm leading-7 text-gray-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-100">
          🇮🇷 {faShort}
        </p>
      )}

      <div className="flex flex-wrap gap-2 px-6 pt-4">
        {tags.map((c) => (
          <Link
            key={c}
            href={`/tag/${encodeURIComponent(c)}`}
            className="rounded-full bg-gradient-to-l from-blue-50 to-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:from-[#ff6154] hover:to-[#e5544a] hover:text-white dark:from-indigo-950 dark:to-blue-950 dark:text-indigo-200"
          >
            #{c}
          </Link>
        ))}
      </div>

      <div className="p-6 pt-4">
        {slug ? (
          <Link href={`/product/${slug}`} className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
            مشاهده جزئیات و توضیحات تکمیلی <ArrowLeft size={15} />
          </Link>
        ) : (
          <span className="text-xs text-gray-400">جزئیات به‌زودی</span>
        )}
      </div>
    </article>
  );
}
