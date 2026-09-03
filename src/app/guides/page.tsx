import type { Metadata } from 'next';
import Link from 'next/link';
import { buildDecisionGuides } from '@/lib/decision-guides';
import { loadCorpusProducts } from '@/lib/corpus';
import { SITE_NAME, SITE_URL } from '@/lib/seo-geo';

export const metadata: Metadata = {
  title: 'راهنماهای انتخاب ابزار',
  description:
    'راهنماهای داده‌محور ایده‌جو برای انتخاب ابزارها بر اساس دسته‌بندی‌های واقعی Corpus، رأی ثبت‌شده و شواهد موجود.',
  alternates: { canonical: `${SITE_URL}/guides` },
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    url: `${SITE_URL}/guides`,
    siteName: SITE_NAME,
    title: 'راهنماهای انتخاب ابزار | ایده‌جو',
    description:
      'راهنماهای داده‌محور ایده‌جو برای انتخاب ابزارها بر اساس دسته‌بندی‌های واقعی Corpus، رأی ثبت‌شده و شواهد موجود.',
  },
};

export default async function GuidesHubPage() {
  const products = await loadCorpusProducts();
  const guides = buildDecisionGuides(products);
  const canonical = `${SITE_URL}/guides`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': canonical,
        url: canonical,
        name: 'راهنماهای انتخاب ابزار ایده‌جو',
        inLanguage: 'fa-IR',
      },
      {
        '@type': 'ItemList',
        '@id': `${canonical}#guides`,
        numberOfItems: guides.length,
        itemListElement: guides.map((guide, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `بهترین ابزارهای ${guide.label}`,
          url: `${SITE_URL}/guides/${guide.slug}`,
        })),
      },
    ],
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p className="text-xs font-black text-[#ff6154]">راهنمای تصمیم‌گیری ایده‌جو</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
        راهنماهای انتخاب ابزار
      </h1>
      <p className="mt-5 max-w-3xl text-sm leading-8 text-gray-600 dark:text-gray-300 sm:text-base">
        هر راهنما فقط زمانی منتشر می‌شود که حداقل پنج محصول واقعی در همان دسته‌بندی وجود داشته باشد. رتبه‌بندی‌ها از داده Corpus و رأی ثبت‌شده می‌آیند و ادعای قیمت یا قابلیت خارج از داده ساخته نمی‌شود.
      </p>

      <div className="mt-6 flex flex-wrap gap-3 text-sm font-black">
        <Link href="/discover" className="text-[#ff6154] hover:underline">کشف موضوعی</Link>
        <Link href="/products" className="text-gray-600 hover:text-[#ff6154] dark:text-gray-300">همه محصولات</Link>
      </div>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {guides.map((guide) => (
          <article key={guide.slug} className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-950">
            <span className="text-xs font-black text-[#ff6154]">{guide.products.length.toLocaleString('fa-IR')} محصول منتخب</span>
            <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white">
              بهترین ابزارهای {guide.label}
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600 dark:text-gray-300">
              راهنمای داده‌محور برای مقایسه گزینه‌های معتبر این دسته و رفتن به تحلیل، جایگزین‌ها و مقایسه مستقیم هر محصول.
            </p>
            <Link href={`/guides/${guide.slug}`} className="mt-5 inline-block text-sm font-black text-[#ff6154] hover:underline">
              مشاهده راهنمای انتخاب
            </Link>
          </article>
        ))}
      </section>
    </main>
  );
}
