import { ArrowLeft, Flame } from 'lucide-react';
import Link from 'next/link';
import { extractSlug } from '@/lib/slug';
import type { Product } from '@/types';

const RANK_STYLES: Record<number, string> = {
  1: 'from-amber-400 to-yellow-500',
  2: 'from-slate-300 to-slate-400',
  3: 'from-orange-400 to-amber-600',
};

export function ProductCard({ product }: { product: Product }) {
  const slug = extractSlug(product.url);
  const rankStyle = RANK_STYLES[product.rank] ?? 'from-[#ff6154] to-pink-500';

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="flex items-start gap-4 p-6 pb-4">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={product.thumbnail} alt={product.name} className="h-14 w-14 rounded-2xl border border-gray-100 object-cover" />
        ) : (
          <span className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${rankStyle} text-xl font-black text-white shadow`}>
            {product.rank}
          </span>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-gray-900" dir="ltr">{product.name}</h2>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-[#ff6154]">
              <Flame size={15} /> {product.votes.toLocaleString('fa-IR')}
            </span>
          </div>
          <p className="mt-1 text-sm italic text-gray-500" dir="ltr">{product.tagline}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 px-6">
        {product.category.split('•').map((c) => (
          <span key={c} className="rounded-full bg-gradient-to-l from-blue-50 to-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
            {c.trim()}
          </span>
        ))}
      </div>

      {product.faDescription && (
        <p className="mx-6 mt-4 rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm leading-8 text-gray-800">
          🇮 {product.faDescription}
        </p>
      )}

      <div className="p-6 pt-4">
        {slug ? (
          <Link
            href={`/product/${slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-gray-700"
          >
            مشاهده جزئیات و توضیحات تکمیلی <ArrowLeft size={15} />
          </Link>
        ) : (
          <span className="text-xs text-gray-400">جزئیات به‌زودی</span>
        )}
      </div>
    </article>
  );
}
