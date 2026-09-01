import {
  ArrowRight,
  Calendar,
  ExternalLink,
  Flame,
  Globe2,
  Lightbulb,
  MessageCircle,
  Share2,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { AiReview } from '@/components/AiReview';
import { BookmarkButton } from '@/components/BookmarkButton';
import { GatedContent } from '@/components/GatedContent';
import { LikeButton } from '@/components/LikeButton';
import { Screenshot } from '@/components/Screenshot';
import { ShareButtons } from '@/components/ShareButtons';
import { StarRating } from '@/components/StarRating';
import { UserComments } from '@/components/UserComments';
import { loadCorpusProduct } from '@/lib/corpus';
import { PERIODS } from '@/lib/scraper';
import { loadLatest } from '@/lib/storage';
import { withUtm } from '@/lib/utm';
import type { PeriodKey } from '@/types';

export const dynamic = 'force-dynamic';

const toPersianDigits = (s: string) =>
  s.replace(/[0-9]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);

function formatShamsiFull(isoStr: string): string {
  if (!isoStr) return '';

  const d = new Date(isoStr);

  const dayName = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    weekday: 'long',
  }).format(d);

  const date = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);

  return toPersianDigits(`${dayName}، ${date}`);
}

function formatBudget(s: string): string {
  return /^\d+$/.test(s)
    ? `${Number(s).toLocaleString('fa-IR')} تومان`
    : s;
}

function findRank(
  data: any,
  slug: string,
): { key: PeriodKey; fa: string; rank: number } | null {
  for (const p of PERIODS) {
    const list = (data.periods as any)[p.key] ?? [];
    const found = list.find((x: any) => x.slug === slug);

    if (found) {
      return {
        key: p.key,
        fa: p.fa,
        rank: found.rank,
      };
    }
  }

  return null;
}

function Section({
  eyebrow,
  title,
  icon,
  children,
}: {
  eyebrow?: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[26px] border border-black/5 bg-white p-5 shadow-sm sm:p-6 dark:border-white/5 dark:bg-white/[0.035]">
      <div className="mb-5">
        {eyebrow && (
          <p className="text-xs font-black text-[#ff6154]">
            {eyebrow}
          </p>
        )}

        <div className="mt-1 flex items-center gap-2">
          {icon}

          <h2 className="text-lg font-black tracking-tight text-gray-950 sm:text-xl dark:text-white">
            {title}
          </h2>
        </div>
      </div>

      {children}
    </section>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await loadLatest();

  let product = null;

  if (data) {
    for (const key of [
      'today',
      'yesterday',
      'week',
      'month',
      'year',
    ] as const) {
      const found = (data.periods[key] ?? []).find(
        (p) => p.slug === slug,
      );

      if (found) {
        product = found;
        break;
      }
    }
  }

  if (!product) {
    product = await loadCorpusProduct(slug);
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="rounded-[28px] border border-dashed border-gray-300 bg-white p-10 dark:border-gray-800 dark:bg-gray-950">
          <Sparkles
            size={28}
            className="mx-auto text-[#ff6154]"
          />

          <p className="mt-4 text-xl font-black text-gray-800 dark:text-gray-100">
            ایده پیدا نشد
          </p>

          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#ff6154]"
          >
            <ArrowRight size={15} />
            بازگشت به خانه
          </Link>
        </div>
      </main>
    );
  }

  const rankInfo = data
    ? findRank(data, slug)
    : null;

  const eq = product.iranEquivalent;

  const screenshot =
    product.screenshots?.[0] ??
    `https://image.thum.io/get/width/1200/crop/675/${
      product.websiteUrl || 'https://example.com'
    }`;

  const tags = (product.categoryFa ?? product.category)
    .split('•')
    .map((c) => c.trim())
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm font-black text-gray-500 transition hover:text-[#ff6154] dark:text-gray-400"
      >
        <ArrowRight size={15} />
        بازگشت به ایده‌ها
      </Link>

      <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-6">
          <section className="overflow-hidden rounded-[30px] border border-black/5 bg-white shadow-xl shadow-black/[0.04] dark:border-white/5 dark:bg-white/[0.035]">
            <div className="p-5 sm:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {product.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="h-20 w-20 shrink-0 rounded-[22px] border border-black/5 object-cover sm:h-24 sm:w-24 dark:border-white/10"
                  />
                ) : (
                  <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#ff6154] to-pink-500 text-2xl font-black text-white sm:h-24 sm:w-24">
                    {product.rank.toLocaleString('fa-IR')}
                  </span>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h1
                        className="break-words text-3xl font-black tracking-tight text-gray-950 sm:text-4xl dark:text-white"
                        dir="ltr"
                      >
                        {product.name}
                      </h1>

                      <p
                        className="mt-2 text-sm leading-7 text-gray-500 sm:text-base dark:text-gray-400"
                        dir="ltr"
                      >
                        {product.tagline}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <LikeButton slug={product.slug} />
                      <BookmarkButton slug={product.slug} />
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {rankInfo && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ff6154] px-3 py-1.5 text-xs font-black text-white">
                        <Flame size={13} />
                        رتبه {rankInfo.rank.toLocaleString('fa-IR')} در{' '}
                        {rankInfo.fa}
                      </span>
                    )}

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                      <Flame
                        size={13}
                        className="text-[#ff6154]"
                      />
                      {product.votes.toLocaleString('fa-IR')} رأی
                    </span>

                    {product.featuredAt && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                        <Calendar size={13} />
                        {formatShamsiFull(product.featuredAt)}
                      </span>
                    )}

                    {product.maker &&
                      !product.maker.includes('REDACTED') && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-700 dark:bg-gray-900 dark:text-gray-300">
                          <User size={13} />
                          {product.maker}
                        </span>
                      )}
                  </div>

                  {tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {tags.slice(0, 6).map((c) => (
                        <Link
                          key={c}
                          href={`/tag/${encodeURIComponent(c)}`}
                          className="rounded-lg bg-[#ff6154]/10 px-2.5 py-1 text-[10px] font-black text-[#ff6154] transition hover:bg-[#ff6154] hover:text-white"
                        >
                          {c}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {product.websiteUrl && (
                <a
                  href={withUtm(product.websiteUrl)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gray-950 px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-[#ff6154] sm:w-auto sm:inline-flex dark:bg-white dark:text-gray-950 dark:hover:bg-[#ff6154] dark:hover:text-white"
                >
                  <ExternalLink size={16} />
                  وب‌سایت رسمی
                </a>
              )}
            </div>

            <div className="border-t border-black/5 bg-gray-50/60 p-3 sm:p-5 dark:border-white/5 dark:bg-black/10">
              <div className="overflow-hidden rounded-[22px] border border-black/5 bg-white shadow-sm dark:border-white/5 dark:bg-gray-950">
                <Screenshot
                  src={screenshot}
                  alt={`اسکرین‌شات ${product.name}`}
                />
              </div>
            </div>
          </section>

          {product.faDescription && (
            <Section
              eyebrow="خلاصه فارسی"
              title="این محصول چه کاری انجام می‌دهد؟"
              icon={
                <Sparkles
                  size={18}
                  className="text-[#ff6154]"
                />
              }
            >
              <p className="text-sm leading-8 text-gray-700 sm:text-base dark:text-gray-200">
                {product.faDescription}
              </p>
            </Section>
          )}

          <Section
            eyebrow="تحلیل عمیق"
            title="تحلیل و اطلاعات تکمیلی"
            icon={
              <Lightbulb
                size={18}
                className="text-[#ff6154]"
              />
            }
          >
            <GatedContent product={product} />
          </Section>

          {eq && eq.confidence > 0 && (
            <Section
              eyebrow="فرصت بازار ایران"
              title={`نسخه یا فرصت مشابه ایرانی: ${eq.productName}`}
              icon={
                <Globe2
                  size={18}
                  className="text-emerald-500"
                />
              }
            >
              {eq.description && (
                <p className="text-sm leading-8 text-gray-700 sm:text-base dark:text-gray-200">
                  {eq.description}
                </p>
              )}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {eq.marketOpportunity && (
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm leading-7 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100">
                    <span className="block text-xs font-black text-emerald-700 dark:text-emerald-300">
                      فرصت بازار
                    </span>
                    <p className="mt-1">
                      {eq.marketOpportunity}
                    </p>
                  </div>
                )}

                {eq.estimatedBudget && (
                  <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    <span className="block text-xs font-black text-gray-500">
                      بودجه برآوردی
                    </span>
                    <p className="mt-1 font-black">
                      {formatBudget(eq.estimatedBudget)}
                    </p>
                  </div>
                )}

                {eq.targetAudience && (
                  <div className="rounded-2xl bg-gray-100 p-4 text-sm leading-7 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                    <span className="block text-xs font-black text-gray-500">
                      مخاطب هدف
                    </span>
                    <p className="mt-1">
                      {eq.targetAudience}
                    </p>
                  </div>
                )}

                <div className="rounded-2xl bg-gray-100 p-4 text-sm text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                  <span className="block text-xs font-black text-gray-500">
                    میزان اطمینان تحلیل
                  </span>
                  <p className="mt-1 font-black text-[#ff6154]">
                    {eq.confidence.toLocaleString('fa-IR')}٪
                  </p>
                </div>
              </div>

              {eq.challenges?.length > 0 && (
                <div className="mt-5 rounded-2xl border border-black/5 p-4 dark:border-white/5">
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    چالش‌های پیش‌رو
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {eq.challenges.map((x) => (
                      <li
                        key={x}
                        className="flex gap-2"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ff6154]" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eq.monetization?.length > 0 && (
                <div className="mt-4 rounded-2xl border border-black/5 p-4 dark:border-white/5">
                  <p className="text-sm font-black text-gray-900 dark:text-white">
                    مدل‌های درآمدی پیشنهادی
                  </p>

                  <ul className="mt-3 space-y-2 text-sm leading-7 text-gray-600 dark:text-gray-300">
                    {eq.monetization.map((x) => (
                      <li
                        key={x}
                        className="flex gap-2"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {eq.techStack?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {eq.techStack.map((t) => (
                    <span
                      key={t}
                      className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-black text-gray-600 dark:bg-gray-900 dark:text-gray-300"
                      dir="ltr"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </Section>
          )}

          {product.aiReview && (
            <Section
              eyebrow="تحلیل هوش مصنوعی"
              title="نگاه تحلیلی ایده‌جو"
              icon={
                <Sparkles
                  size={18}
                  className="text-[#ff6154]"
                />
              }
            >
              <AiReview text={product.aiReview} />
            </Section>
          )}

          {product.faComments &&
            product.faComments.length > 0 && (
              <Section
                eyebrow="بازخورد کاربران"
                title="نظرات ثبت‌شده"
                icon={
                  <MessageCircle
                    size={18}
                    className="text-[#ff6154]"
                  />
                }
              >
                <div className="space-y-3">
                  {product.faComments.map((cm, i) => (
                    <article
                      key={`${cm.user}-${i}`}
                      className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-900"
                    >
                      <p className="text-xs font-black text-[#ff6154]">
                        {cm.user}
                      </p>

                      <p className="mt-2 text-sm leading-7 text-gray-700 dark:text-gray-200">
                        {cm.text}
                      </p>
                    </article>
                  ))}
                </div>
              </Section>
            )}

          <Section
            eyebrow="گفت‌وگو"
            title="نظر شما درباره این ایده"
            icon={
              <MessageCircle
                size={18}
                className="text-[#ff6154]"
              />
            }
          >
            <UserComments slug={product.slug} />
          </Section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.035]">
            <div className="flex items-center gap-2">
              <Star
                size={17}
                className="text-[#ff6154]"
              />

              <h2 className="text-sm font-black text-gray-950 dark:text-white">
                امتیاز شما
              </h2>
            </div>

            <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-gray-400">
              تجربه یا برداشت خودت از این ایده را ثبت کن.
            </p>

            <div className="mt-4">
              <StarRating slug={product.slug} />
            </div>
          </div>

          <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.035]">
            <div className="flex items-center gap-2">
              <Share2
                size={17}
                className="text-[#ff6154]"
              />

              <h2 className="text-sm font-black text-gray-950 dark:text-white">
                اشتراک‌گذاری
              </h2>
            </div>

            <div className="mt-4">
              <ShareButtons
                url={`/product/${product.slug}`}
                name={product.name}
              />
            </div>
          </div>

          {(product.websiteUrl ||
            product.makerTwitter ||
            product.url) && (
            <div className="rounded-[24px] border border-black/5 bg-white p-5 shadow-sm dark:border-white/5 dark:bg-white/[0.035]">
              <h2 className="text-sm font-black text-gray-950 dark:text-white">
                لینک‌های رسمی
              </h2>

              <div className="mt-4 grid gap-2">
                {product.websiteUrl && (
                  <a
                    href={withUtm(product.websiteUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center justify-between rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-black text-gray-700 transition hover:bg-[#ff6154]/10 hover:text-[#ff6154] dark:bg-gray-900 dark:text-gray-200"
                  >
                    وب‌سایت رسمی
                    <ExternalLink size={14} />
                  </a>
                )}

                {product.makerTwitter && (
                  <a
                    href={`https://twitter.com/${product.makerTwitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center justify-between rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-black text-gray-700 transition hover:bg-[#ff6154]/10 hover:text-[#ff6154] dark:bg-gray-900 dark:text-gray-200"
                  >
                    حساب سازنده
                    <ExternalLink size={14} />
                  </a>
                )}

                {product.url && (
                  <a
                    href={product.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex min-h-11 items-center justify-between rounded-2xl bg-gray-100 px-4 py-2.5 text-sm font-black text-gray-700 transition hover:bg-[#ff6154]/10 hover:text-[#ff6154] dark:bg-gray-900 dark:text-gray-200"
                  >
                    صفحه معرفی
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
