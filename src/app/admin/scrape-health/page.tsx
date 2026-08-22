import { redirect } from 'next/navigation';
import { getSessionEmail } from '@/lib/auth-server';
import { loadScrapeHealth } from '@/lib/scrape-health';
import { loadLatest } from '@/lib/storage';
import { buildScrapeOperationsSnapshot } from '@/lib/scrape-operations';
import { formatTehranTimestamp } from '@/lib/data-freshness';
import { evaluateScrapeAlert } from '@/lib/scrape-alerts';
import { decideScrapeRecovery } from '@/lib/scrape-recovery';
import { deriveScrapeIncidents } from '@/lib/scrape-incidents';

function displayTime(value: string | null) {
  if (!value) return 'ثبت نشده';
  return formatTehranTimestamp(value) ?? value;
}

export default async function ScrapeHealthPage() {
  const email = await getSessionEmail();
  if (!email || email !== process.env.ADMIN_EMAIL) redirect('/login');

  const [health, latest] = await Promise.all([loadScrapeHealth(), loadLatest()]);
  const view = buildScrapeOperationsSnapshot(health, latest);
  const alert = evaluateScrapeAlert(view);
  const recovery = decideScrapeRecovery(view.failureStreak, view.lastFailureAt);
  const incidents = deriveScrapeIncidents(view.recentRuns).slice(0, 10);

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6" dir="rtl">
      <header>
        <p className="text-sm text-zinc-500">IdehJo Data Operations</p>
        <h1 className="text-3xl font-bold">مرکز عملیات جمع‌آوری داده</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">وضعیت کل</p><p className="mt-2 text-xl font-semibold">{view.severity}</p></article>
        <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">هشدار فعال</p><p className="mt-2 text-xl font-semibold">{alert.level}</p></article>
        <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">تازگی داده</p><p className="mt-2 text-xl font-semibold">{view.freshness}</p></article>
        <article className="rounded-2xl border p-5"><p className="text-sm text-zinc-500">خطاهای متوالی</p><p className="mt-2 text-xl font-semibold">{view.failureStreak}</p></article>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Alert</h2>
          <p className="mt-3 text-sm">{alert.message}</p>
          <p className="mt-2 text-xs text-zinc-500">Code: {alert.code}</p>
        </article>
        <article className="rounded-2xl border p-5">
          <h2 className="font-semibold">Recovery Policy</h2>
          <p className="mt-3 text-sm">Retry: {recovery.shouldRetry ? 'yes' : 'no'}</p>
          <p className="text-sm">Delay: {recovery.delayMinutes} min</p>
          <p className="text-sm">Reason: {recovery.reason}</p>
        </article>
      </section>

      <section className="rounded-2xl border p-5">
        <h2 className="font-semibold">Incident Timeline</h2>
        {incidents.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-500">Incident فعالی ثبت نشده است.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {incidents.map((incident, index) => (
              <article key={`${incident.finishedAt}-${index}`} className="rounded-xl border p-4">
                <div className="flex justify-between gap-4">
                  <strong>{incident.severity}</strong>
                  <span className="text-xs text-zinc-500">{displayTime(incident.finishedAt)}</span>
                </div>
                <p className="mt-2 break-words text-sm">{incident.error}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
