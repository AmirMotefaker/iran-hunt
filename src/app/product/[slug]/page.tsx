import { ArrowRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { GatedContent } from '@/components/GatedContent';
import { LikeButton } from '@/components/LikeButton';
import { UserComments } from '@/components/UserComments';
import { loadLatest } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadLatest();

  let product = null;
  if (data) {
    for (const key of ['today', 'yesterday', 'week', 'month', 'year'] as const) {
      const found = (data.periods[key] ?? []).find((p) => p.slug === slug);
      if (found) { product = found; break; }
    }
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500 dark:text-gray-400">
        <p className="text-xl font-bold">😕 ایده پیدا نشد!</p>
        <Link href="/" className="mt-4 inline-block text-[#ff6154] hover:underline">بازگشت به خانه</Link>
      </main>
    );
  }

  const eq = product.iranEquivalent;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#ff6154] dark:text-gray-400">
        <ArrowRight size={16} /> بازگشت به لیست
      </Link>

      <article className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        <div className="flex items-start gap-4 p-6">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.thumbnail} alt={product.name} className="h-16 w-16 rounded-2xl border border-gray-200 object-cover dark:border-gray-800" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6154] to-pink-500 text-2xl font-black text-white">{product.rank}</span>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-black text-gray-900 dark:text-white" dir="ltr">{product.name}</h1>
              <div className="flex items-center gap-2">
                <LikeButton slug={product.slug} />
                <span className="flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-bold text-[#ff6154] dark:bg-orange-950/40">
                  <Flame size={15} /> {product.votes.toLocaleString('fa-IR')} رأی
                </span>
              </div>
            </div>
            <p className="mt-1 italic text-gray-500 dark:text-gray-400" dir="ltr">{product.tagline}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 px-6">
          {(product.categoryFa ?? product.category).split('•').map((c) => (
            <Link
              key={c}
              href={`/tag/${encodeURIComponent(c.trim())}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-indigo-700 transition hover:from-[#ff6154] hover:to-[#e5544a] hover:text-white dark:bg-indigo-950 dark:text-indigo-200"
            >
              #{c.trim()}
            </Link>
          ))}
        </div>

        <div className="space-y-4 p-6">
          {product.description && (
            <p className="rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm leading-8 text-gray-800 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200" dir="ltr">
              {product.description}
            </p>
          )}
          {product.faDescription && (
            <p className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 text-sm leading-8 text-gray-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-100">
              🇮🇷 {product.faDescription}
            </p>
          )}

          {eq && eq.confidence > 0 && (
            <div className="rounded-2xl border-t-4 border-green-500 bg-gradient-to-bl from-green-50 to-emerald-50 p-5 dark:from-green-950/30 dark:to-emerald-950/20">
              <h3 className="text-lg font-black text-green-900 dark:text-green-200">💡 مشابه ایرانی: {eq.productName}</h3>
              {eq.description && <p className="mt-2 text-sm leading-8 text-green-900 dark:text-green-100">{eq.description}</p>}
              <div className="mt-3 grid gap-3 text-sm text-green-900 dark:text-green-100 sm:grid-cols-2">
                {eq.marketOpportunity && <div className="rounded-xl bg-white/70 p-3 dark:bg-gray-800/50">🎯 {eq.marketOpportunity}</div>}
                {eq.estimatedBudget && <div className="rounded-xl bg-white/70 p-3 dark:bg-gray-800/50">💰 {eq.estimatedBudget}</div>}
                {eq.targetAudience && <div className="rounded-xl bg-white/70 p-3 dark:bg-gray-800/50">👥 {eq.targetAudience}</div>}
                <div className="rounded-xl bg-white/70 p-3 dark:bg-gray-800/50">📊 اطمینان: {eq.confidence.toLocaleString('fa-IR')}٪</div>
              </div>
            </div>
          )}

          <UserComments slug={product.slug} />
          <GatedContent product={product} />
        </div>
      </article>
    </main>
  );
}
