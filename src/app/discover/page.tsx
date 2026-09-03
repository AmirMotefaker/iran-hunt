import type { Metadata } from 'next';
import Link from 'next/link';
import { loadCorpusProducts } from '@/lib/corpus';
import { buildDiscoveryTopics } from '@/lib/discovery-growth';
import { SITE_URL } from '@/lib/seo-geo';

export const metadata: Metadata = {
  title: 'کشف موضوعی ابزارها و ایده‌های برتر',
  description:
    'هاب کشف موضوعی ایده‌جو برای پیدا کردن بهترین ابزارها و ایده‌های استارتاپی بر اساس داده واقعی، رتبه‌بندی و تحلیل فارسی.',
  alternates: { canonical: `${SITE_URL}/discover` },
};

export default async function DiscoveryHubPage() {
  const products = await loadCorpusProducts();
  const topics = buildDiscoveryTopics(products);

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="max-w-3xl">
        <p className="text-xs font-black text-[#ff6154]">کشف موضوعی ایده‌جو</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-950 dark:text-white sm:text-5xl">
          بهترین ابزارها و ایده‌ها، دسته‌بندی‌شده با داده واقعی
        </h1>
        <p className="mt-5 text-sm leading-8 text-gray-600 dark:text-gray-300 sm:text-base">
          هر صفحه موضوعی فقط زمانی منتشر می‌شود که داده کافی برای ساخت یک راهنمای مستقل و مفید وجود داشته باشد؛ بنابراین این بخش برای موتور جستجو و موتورهای مولد، مجموعه‌ای از صفحات کم‌ارزش و تکراری تولید نمی‌کند.
        </p>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/discover/${topic.slug}`}
            className="rounded-3xl border border-gray-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#ff6154]/40 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950"
          >
            <p className="text-xs font-black text-[#ff6154]">
              {topic.products.length.toLocaleString('fa-IR')} محصول واجد شرایط
            </p>
            <h2 className="mt-2 text-xl font-black text-gray-950 dark:text-white">
              {topic.fa}
            </h2>
            <p className="mt-3 text-xs leading-7 text-gray-500 dark:text-gray-400">
              {topic.summary}
            </p>
          </Link>
        ))}
      </section>
    </main>
  );
}
