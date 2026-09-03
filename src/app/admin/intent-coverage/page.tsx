import Link from 'next/link';
import { loadCorpusProducts } from '@/lib/corpus';
import { summarizeIntentCoverage, type IntentType } from '@/lib/intent-coverage';

export const dynamic = 'force-dynamic';

const labels: Record<IntentType, string> = {
  navigational: 'ناوبری محصول',
  informational: 'اطلاعاتی',
  comparison: 'مقایسه',
  alternatives: 'جایگزین‌ها',
  'category-discovery': 'کشف دسته‌بندی',
  'decision-guide': 'راهنمای تصمیم',
};

function percent(value: number) {
  return `${Math.round(value * 100)}٪`;
}

export default async function IntentCoveragePage() {
  const products = await loadCorpusProducts();
  const report = summarizeIntentCoverage(products);

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <header className="rounded-[2rem] border border-black/10 bg-black p-7 text-white md:p-10">
        <p className="text-xs font-bold tracking-[0.18em] text-white/55">SEO + GEO CONTROL PLANE</p>
        <h1 className="mt-3 text-3xl font-black md:text-5xl">پوشش نیت‌های جستجو</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65 md:text-base">
          این گزارش فقط از داده واقعی Corpus و Surfaceهای واجدشرایط ایده‌جو ساخته می‌شود. هیچ Search Volume، CTR، Keyword Difficulty یا تقاضای بازار ساختگی در آن وجود ندارد.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ['کل نیت‌ها', report.totalIntents.toLocaleString('fa-IR')],
          ['پوشش داده‌شده', report.coveredIntents.toLocaleString('fa-IR')],
          ['شکاف‌های واجدشواهد', report.gapIntents.toLocaleString('fa-IR')],
          ['نرخ پوشش', percent(report.coverageRatio)],
        ].map(([title, value]) => (
          <article key={title} className="rounded-3xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-white/[0.04]">
            <p className="text-xs text-black/45 dark:text-white/45">{title}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {(Object.keys(labels) as IntentType[]).map((type) => {
          const item = report.byType[type];
          return (
            <article key={type} className="rounded-3xl border border-black/10 p-5 dark:border-white/10">
              <div className="flex items-center justify-between gap-4">
                <h2 className="font-black">{labels[type]}</h2>
                <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
                  {percent(item.ratio)}
                </span>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-center text-sm">
                <div><dt className="text-black/45 dark:text-white/45">کل</dt><dd className="mt-1 font-black">{item.total.toLocaleString('fa-IR')}</dd></div>
                <div><dt className="text-black/45 dark:text-white/45">پوشش</dt><dd className="mt-1 font-black">{item.covered.toLocaleString('fa-IR')}</dd></div>
                <div><dt className="text-black/45 dark:text-white/45">شکاف</dt><dd className="mt-1 font-black">{item.gaps.toLocaleString('fa-IR')}</dd></div>
              </dl>
            </article>
          );
        })}
      </section>

      <section className="mt-6 rounded-[2rem] border border-black/10 p-6 dark:border-white/10 md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-black">شکاف‌های اولویت‌دار</h2>
            <p className="mt-2 text-sm text-black/55 dark:text-white/55">فقط نیت‌هایی که حداقل شواهد لازم را دارند و هنوز Surface معتبر ندارند.</p>
          </div>
          <Link href="/admin/autonomous-command-center" className="text-sm font-bold underline underline-offset-4">بازگشت به مرکز فرمان</Link>
        </div>

        <div className="mt-6 grid gap-3">
          {report.gaps.slice(0, 30).map((gap) => (
            <article key={gap.key} className="rounded-2xl border border-black/10 p-4 dark:border-white/10">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold text-black/45 dark:text-white/45">{labels[gap.type]}</p>
                  <h3 className="mt-1 font-black">{gap.label}</h3>
                </div>
                <div className="flex gap-2 text-xs font-bold">
                  <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">شواهد: {gap.evidenceCount.toLocaleString('fa-IR')}</span>
                  <span className="rounded-full bg-black/5 px-3 py-1 dark:bg-white/10">اولویت: {gap.priority.toLocaleString('fa-IR')}</span>
                </div>
              </div>
            </article>
          ))}
          {!report.gaps.length && <p className="text-sm text-black/55 dark:text-white/55">شکاف واجدشرایطی شناسایی نشد.</p>}
        </div>
      </section>
    </main>
  );
}
