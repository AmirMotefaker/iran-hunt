import { loadScrapeHealth } from "@/lib/scrape-health";
import { loadLatest } from "@/lib/storage";
import { buildScrapeOperationsSnapshot } from "@/lib/scrape-operations";
import { buildAutonomousRuntimeState } from "@/lib/autonomous-runtime-state";

export const dynamic = "force-dynamic";

const statusMap: Record<string, string> = {
  healthy: "سالم",
  degraded: "نیازمند توجه",
  critical: "بحرانی",
};

const executionMap: Record<string, string> = {
  ready: "آماده اجرا",
  running: "در حال اجرا",
  blocked: "متوقف",
};

const learningSignalMap: Record<string, string> = {
  reinforce: "تقویت",
  adjust: "تنظیم",
  escalate: "ارجاع",
};

function Card({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description?: string;
}) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      <p className="mb-2 text-xs font-medium text-black/50 dark:text-white/50">
        {title}
      </p>

      <p className="text-lg font-black leading-8">
        {value}
      </p>

      {description ? (
        <p className="mt-2 text-sm leading-7 text-black/55 dark:text-white/55">
          {description}
        </p>
      ) : null}
    </article>
  );
}

export default async function AutonomousEnginePage() {
  const [health, latest] = await Promise.all([
    loadScrapeHealth(),
    loadLatest(),
  ]);

  const snapshot = buildScrapeOperationsSnapshot(
    health,
    latest
  );

  const state = buildAutonomousRuntimeState(snapshot);

  return (
    <main
      dir="rtl"
      className="mx-auto max-w-6xl px-5 py-10"
    >
      <section className="rounded-[2rem] border border-black/10 bg-gradient-to-br from-[#ff6154]/15 via-transparent to-[#ffb11b]/15 p-6 md:p-9 dark:border-white/10">
        <span className="inline-flex rounded-full bg-[#ff6154]/10 px-3 py-1 text-xs font-bold text-[#ff6154]">
          مرکز تصمیم‌گیری خودکار · داده زنده
        </span>

        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">
              مغز عملیاتی ایده‌جو
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-8 text-black/60 dark:text-white/60">
              این نما مستقیماً از سلامت Scraper،
              تازگی داده و تاریخچه اجرای واقعی سیستم ساخته می‌شود.
            </p>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-center dark:border-white/10 dark:bg-black/20">
            <p className="text-xs text-black/50 dark:text-white/50">
              اعتماد تصمیم
            </p>

            <p className="mt-1 text-3xl font-black">
              {state.confidence}%
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card
          title="سلامت سیستم"
          value={statusMap[state.health]}
          description={`شکست متوالی: ${snapshot.failureStreak}`}
        />

        <Card
          title="استراتژی منتخب"
          value={state.strategy}
          description={`تازگی داده: ${snapshot.freshness}`}
        />

        <Card
          title="وضعیت اجرا"
          value={executionMap[state.execution]}
          description={`پایپ‌لاین: ${snapshot.pipelineStatus}`}
        />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card
          title="استدلال هوش مصنوعی"
          value={state.reasoning}
        />

        <Card
          title="اقدام بعدی"
          value={state.action}
        />
      </section>

      <section className="mt-6 rounded-[2rem] border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-[#ff6154]">
          حلقه یادگیری واقعی
        </p>

        <h2 className="mt-2 text-2xl font-black">
          آخرین نتیجه یادگیری
        </h2>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card
            title="نتیجه اجرا"
            value={
              state.learning.outcome === "success"
                ? "موفق"
                : state.learning.outcome === "failed"
                ? "ناموفق"
                : "نامشخص"
            }
          />

          <Card
            title="سیگنال یادگیری"
            value={
              learningSignalMap[state.learning.signal]
            }
          />

          <Card
            title="اثر روی استراتژی"
            value={state.learning.strategyEffect}
            description={`امتیاز یادگیری: ${state.learning.score}`}
          />
        </div>
      </section>

      <section className="mt-4 grid gap-4 md:grid-cols-3">
        <Card
          title="آخرین تلاش"
          value={snapshot.lastAttemptAt ?? "نامشخص"}
        />

        <Card
          title="آخرین موفقیت"
          value={
            snapshot.lastSuccessAt ??
            "هنوز ثبت نشده"
          }
        />

        <Card
          title="وضعیت توکن"
          value={snapshot.tokenHealth}
        />
      </section>
    </main>
  );
}