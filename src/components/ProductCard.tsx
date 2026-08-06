import { ArrowUpRight, Flame, Lightbulb, MessageCircle } from 'lucide-react';
import type { Product } from '@/types';

const RANK_STYLES: Record<number, string> = {
  1: 'from-amber-400 to-yellow-500',
  2: 'from-slate-300 to-slate-400',
  3: 'from-orange-400 to-amber-600',
};

export function ProductCard({ product }: { product: Product }) {
  const eq = product.iranEquivalent;
  const rankStyle = RANK_STYLES[product.rank] ?? 'from-[#ff6154] to-pink-500';

  return (
    <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg shadow-gray-200/50 transition hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}
      <div className="flex items-start gap-4 p-6 pb-4">
        {product.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.thumbnail}
            alt={product.name}
            className="h-14 w-14 rounded-2xl border border-gray-100 object-cover"
          />
        ) : (
          <span
            className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${rankStyle} text-xl font-black text-white shadow`}
          >
            {product.rank}
          </span>
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-xl font-extrabold text-gray-900">{product.name}</h2>
            <span className="flex shrink-0 items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-[#ff6154]">
              <Flame size={15} /> {product.votes.toLocaleString('fa-IR')}
            </span>
          </div>
          <p className="mt-1 text-sm italic text-gray-500" dir="ltr">
            {product.tagline}
          </p>
        </div>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-2 px-6">
        {product.category.split('•').map((c) => (
          <span
            key={c}
            className="rounded-full bg-gradient-to-l from-blue-50 to-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700"
          >
            {c.trim()}
          </span>
        ))}
      </div>

      {/* Descriptions */}
      <div className="space-y-3 p-6">
        <p className="rounded-2xl bg-gray-50 p-4 text-sm leading-7 text-gray-700" dir="ltr">
          {product.description}
        </p>
        {product.faDescription && (
          <p className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm leading-8 text-gray-800">
            🇮🇷 {product.faDescription}
          </p>
        )}
      </div>

      {/* Links */}
      <div className="flex gap-3 px-6 pb-4 text-sm font-bold">
        <a
          href={product.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 rounded-xl bg-[#ff6154] px-4 py-2 text-white shadow transition hover:bg-[#e5544a]"
        >
          <ArrowUpRight size={15} /> ProductHunt
        </a>
        {product.websiteUrl && (
          <a
            href={product.websiteUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-xl border-2 border-gray-200 px-4 py-2 text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <ArrowUpRight size={15} /> وب‌سایت رسمی
          </a>
        )}
      </div>

      {/* Persian comments */}
      {product.faComments && product.faComments.length > 0 && (
        <div className="border-t border-gray-100 bg-gray-50/60 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-extrabold text-gray-800">
            <MessageCircle size={18} className="text-[#ff6154]" />
            برگزیده کامنت‌های جامعه (فارسی)
          </h3>
          <ul className="space-y-3">
            {product.faComments.map((c, i) => (
              <li key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                <span className="mb-1 block text-xs font-black text-[#ff6154]">
                  {c.user}
                </span>
                <span className="text-sm leading-7 text-gray-700">{c.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Iranian equivalent */}
      {eq && eq.confidence > 0 && (
        <div className="border-t-4 border-green-500 bg-gradient-to-bl from-green-50 to-emerald-50 p-6">
          <h3 className="flex items-center gap-2 text-lg font-black text-green-900">
            <Lightbulb size={20} /> مشابه ایرانی: {eq.productName}
          </h3>
          {eq.description && (
            <p className="mt-2 text-sm leading-8 text-green-900">{eq.description}</p>
          )}
          <div className="mt-4 grid gap-3 text-sm text-green-900 sm:grid-cols-2">
            {eq.marketOpportunity && (
              <div className="rounded-xl bg-white/70 p-3">🎯 {eq.marketOpportunity}</div>
            )}
            {eq.estimatedBudget && (
              <div className="rounded-xl bg-white/70 p-3">💰 {eq.estimatedBudget}</div>
            )}
            {eq.targetAudience && (
              <div className="rounded-xl bg-white/70 p-3">👥 {eq.targetAudience}</div>
            )}
            <div className="rounded-xl bg-white/70 p-3">📊 اطمینان: {eq.confidence}٪</div>
          </div>
          {eq.challenges.length > 0 && (
            <ul className="mt-3 list-inside list-disc text-sm text-green-900">
              {eq.challenges.map((c) => (
                <li key={c}>⚠️ {c}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </article>
  );
}
