import { ArrowRight, Calendar, ExternalLink, Flame, User } from 'lucide-react';
import Link from 'next/link';
import { GatedContent } from '@/components/GatedContent';
import { LikeButton } from '@/components/LikeButton';
import { ShareButtons } from '@/components/ShareButtons';
import { StarRating } from '@/components/StarRating';
import { UserComments } from '@/components/UserComments';
import { loadLatest } from '@/lib/storage';
import { PERIODS } from '@/lib/scraper';
import type { PeriodKey } from '@/types';

export const dynamic = 'force-dynamic';

// تاریخ شمسی کامل
const toPersianDigits = (s: string) => s.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);
function formatShamsiFull(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const dayName = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { weekday: 'long' }).format(d);
  const date = new Intl.DateTimeFormat('fa-IR-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(d);
  return toPersianDigits(`${dayName}، ${date}`);
}

// پیدا کردن رتبه محصول در هر بازه
function findRank(data: any, slug: string): { key: PeriodKey; fa: string; rank: number } | null {
  for (const p of PERIODS) {
    const list = (data.periods as any)[p.key] ?? [];
    const found = list.find((x: any) => x.slug === slug);
    if (found) return { key: p.key, fa: p.fa, rank: found.rank };
  }
  return null;
}

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

  const rankInfo = data ? findRank(data, slug) : null;
  const eq = product.iranEquivalent;
  const screenshot = product.screenshots?.[0] ?? `https://image.thum.io/get/width/800/crop/450/${product.websiteUrl || 'https://example.com'}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-1 text-sm font-bold text-gray-600 hover:text-[#ff6154] dark:text-gray-400">
        <ArrowRight size={16} /> بازگشت به لیست
      </Link>

      <article className="mt-4 overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
        {/* Hero */}
        <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start">
          {product.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.thumbnail} alt={product.name} className="h-20 w-20 shrink-0 rounded-2xl border border-gray-200 object-cover dark:border-gray-700" />
          ) : (
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff6154] to-pink-500 text-2xl font-black text-white">{product.rank}</span>
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white" dir="ltr">{product.name}</h1>
            <p className="mt-2 text-base italic text-gray-600 dark:text-gray-300" dir="ltr">{product.tagline}</p>
            {/* Meta: رتبه + تاریخ + maker */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold">
              {rankInfo && (
                <span className="rounded-full bg-[#ff6154] px-3 py-1 text-white">
                  🏆 رتبه {rankInfo.rank.toLocaleString('fa-IR')} در {rankInfo.fa}
                </span>
              )}
              {product.featuredAt && (
                <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <Calendar size={12} /> {formatShamsiFull(product.featuredAt)}
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                <Flame size={12} className="text-[#ff6154]" /> {product.votes.toLocaleString('fa-IR')} رأی
              </span>
              {product.maker && (
                <span className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-1 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
                  <User size={12} /> {product.maker}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <LikeButton slug={product.slug} />
            {product.websiteUrl && (
              <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-xl bg-gray-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200">
                <ExternalLink size={12} /> وب‌سایت رسمی
              </a>
            )}
          </div>
        </div>

        {/* Screenshot */}
        {screenshot && (
          <div className="px-6">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg dark:border-gray-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={screenshot} alt={`اسکرین‌شات ${product.name}`} className="h-auto w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
          </div>
        )}

        <div className="space-y-4 p-6">
          {/* Star Rating */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <h3 className="mb-3 text-sm font-black text-gray-800 dark:text-gray-200">امتیاز شما به این ایده:</h3>
            <StarRating slug={product.slug} />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
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

          {/* Short description (public) */}
          {product.faDescription && (
            <p className="rounded-2xl border border-orange-200 bg-orange-50/70 p-4 text-sm leading-8 text-gray-800 dark:border-orange-900/40 dark:bg-orange-950/30 dark:text-orange-100">
              🇮🇷 {product.faDescription}
            </p>
          )}

          {/* Long description (gated) */}
          <GatedContent product={product} />

          {/* Iran equivalent */}
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

          {/* Share */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50/50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
            <ShareButtons url={`/product/${product.slug}`} name={product.name} />
          </div>

          {/* Comments */}
          <UserComments slug={product.slug} />
        </div>
      </article>
    </main>
  );
}
