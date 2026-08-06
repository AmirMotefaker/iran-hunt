import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { GatedContent } from '@/components/GatedContent';
import { extractSlug } from '@/lib/slug';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadLatest();

  let product = null;
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month'] as const) {
      const found = (data.periods[key] ?? []).find((p) => extractSlug(p.url) === slug);
      if (found) { product = found; break; }
    }
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
        <p className="text-xl font-bold">😕 محصول پیدا نشد!</p>
        <Link href="/" className="mt-4 inline-block text-[#ff6154] hover:underline">بازگشت به خانه</Link>
      </main>
    );
  }

  const eq = product.iranEquivalent;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-[#ff6154]">
        <ArrowRight size={16} /> بازگشت به لیست
      </Link>

      <article className="mt-4 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
        <div className="flex items-start gap-4 p-6">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.thumbnail} alt={product.name} className="h-16 w-16 rounded-2xl border border-gray-100 object-cover" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6154] to-pink-500 text-2xl font-black text-white">
              {product.rank}
            </span>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gray-900" dir="ltr">{product.name}</h1>
              <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-[#ff6154]">
                <Flame size={15} /> {product.votes.toLocaleString('fa-IR')} رأی
              </span>
            </div>
            <p className="mt-1 italic text-gray-500" dir="ltr">{product.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-6">
          {product.category.split('•').map((c) => (
            <span key={c} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-indigo-700">{c.trim()}</span>
          ))}
        </div>

        <div className="space-y-4 p-6">
          {product.faDescription && (
            <p className="rounded-2xl border border-orange-100 bg-orange-50/60 p-4 text-sm leading-8 text-gray-800">
              🇮🇷 {product.faDescription}
            </p>
          )}

          {eq && eq.confidence > 0 && (
            <div className="rounded-2xl border-t-4 border-green-500 bg-gradient-to-bl from-green-50 to-emerald-50 p-5">
              <h3 className="text-lg font-black text-green-900">💡 مشابه ایرانی: {eq.productName}</h3>
              {eq.description && <p className="mt-2 text-sm leading-8 text-green-900">{eq.description}</p>}
              <div className="mt-3 grid gap-3 text-sm text-green-900 sm:grid-cols-2">
                {eq.marketOpportunity && <div className="rounded-xl bg-white/70 p-3">🎯 {eq.marketOpportunity}</div>}
                {eq.estimatedBudget && <div className="rounded-xl bg-white/70 p-3">💰 {eq.estimatedBudget}</div>}
                {eq.targetAudience && <div className="rounded-xl bg-white/70 p-3">👥 {eq.targetAudience}</div>}
                <div className="rounded-xl bg-white/70 p-3">📊 اطمینان: {eq.confidence.toLocaleString('fa-IR')}٪</div>
              </div>
            </div>
          )}

          {product.faComments && product.faComments.length > 0 && (
            <div className="rounded-2xl bg-gray-50 p-5">
              <h4 className="font-extrabold text-gray-800">💬 برگزیده نظرات جامعه (فارسی)</h4>
              <ul className="mt-3 space-y-3">
                {product.faComments.map((c, i) => (
                  <li key={i} className="rounded-2xl bg-white p-4 shadow-sm">
                    <span className="block text-xs font-black text-[#ff6154]">{c.user}</span>
                    <span className="text-sm leading-7 text-gray-700">{c.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <GatedContent product={product} />
        </div>
      </article>
    </main>
  );
}
