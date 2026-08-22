import { redirect } from 'next/navigation';
import { getSessionEmail } from '@/lib/auth-server';
import { loadScrapeHealth } from '@/lib/scrape-health';
import { loadLatest } from '@/lib/storage';
import { buildScrapeOperationsSnapshot } from '@/lib/scrape-operations';
import { formatTehranTimestamp } from '@/lib/data-freshness';
function displayTime(value: string | null) { if (!value) return 'ثبت نشده'; return formatTehranTimestamp(value) ?? value; }
export default async function ScrapeHealthPage() {
  const email = await getSessionEmail(); if (!email || email !== process.env.ADMIN_EMAIL) redirect('/login');
  const [health, latest] = await Promise.all([loadScrapeHealth(), loadLatest()]);
  const view = buildScrapeOperationsSnapshot(health, latest);
  return <main className="mx-auto max-w-5xl space-y-8 p-6" dir="rtl">
    <header><p className="text-sm text-zinc-500">IdehJo Data Operations</p><h1 className="text-3xl font-bold">مرکز عملیات جمع‌آوری داده</h1></header>
    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">وضعیت کل</p><p className="mt-2 text-2xl font-semibold">{view.severity}</p></article>
      <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">تازگی داده</p><p className="mt-2 text-2xl font-semibold">{view.freshness}</p></article>
      <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">خطاهای متوالی</p><p className="mt-2 text-2xl font-semibold">{view.failureStreak}</p></article>
    </section>
    <section className="grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border p-5"><h2 className="font-semibold">وضعیت Pipeline</h2><dl className="mt-4 space-y-3 text-sm">
        <div><dt className="text-zinc-500">Pipeline</dt><dd>{view.pipelineStatus}</dd></div><div><dt className="text-zinc-500">آخرین تلاش</dt><dd>{displayTime(view.lastAttemptAt)}</dd></div>
        <div><dt className="text-zinc-500">آخرین موفقیت</dt><dd>{displayTime(view.lastSuccessAt)}</dd></div><div><dt className="text-zinc-500">آخرین داده منتشرشده</dt><dd>{displayTime(view.latestDataAt)}</dd></div>
        <div><dt className="text-zinc-500">وضعیت Product Hunt Token</dt><dd>{view.tokenHealth}</dd></div></dl></article>
      <article className="rounded-2xl border p-5"><h2 className="font-semibold">آخرین خطا</h2><p className="mt-4 break-words text-sm">{view.lastFailureReason ?? 'خطایی ثبت نشده است.'}</p></article>
    </section>
    <section className="rounded-2xl border p-5"><h2 className="font-semibold">تاریخچه اجرای اخیر</h2>{view.recentRuns.length===0 ? <p className="mt-4 text-sm text-zinc-500">هنوز اجرای تکمیل‌شده‌ای ثبت نشده است.</p> : <div className="mt-4 overflow-x-auto"><table className="w-full text-right text-sm"><thead><tr className="border-b"><th className="py-2">نتیجه</th><th className="py-2">شروع</th><th className="py-2">پایان</th><th className="py-2">خطا</th></tr></thead><tbody>{view.recentRuns.map((run,index)=><tr key={`${run.finishedAt}-${index}`} className="border-b last:border-0"><td className="py-3">{run.status}</td><td className="py-3">{displayTime(run.startedAt)}</td><td className="py-3">{displayTime(run.finishedAt)}</td><td className="py-3">{run.error ?? '—'}</td></tr>)}</tbody></table></div>}</section>
  </main>;
}
