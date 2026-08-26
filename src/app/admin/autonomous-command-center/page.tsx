import { loadScrapeHealth } from "@/lib/scrape-health";
import { loadLatest } from "@/lib/storage";
import { buildScrapeOperationsSnapshot } from "@/lib/scrape-operations";
import { buildAutonomousRuntimeState } from "@/lib/autonomous-runtime-state";
import { buildAutonomousControlPlane } from "@/lib/autonomous-control-plane";
import { evaluateGovernance } from "@/lib/autonomous-governance";

export const dynamic = "force-dynamic";

const healthLabel: Record<string, string> = {
  healthy: "سالم",
  degraded: "نیازمند توجه",
  critical: "بحرانی",
};

const executionLabel: Record<string, string> = {
  ready: "آماده",
  running: "در حال اجرا",
  blocked: "متوقف",
};

const modeLabel: Record<string, string> = {
  observe: "پایش",
  stabilize: "تثبیت",
  optimize: "بهینه‌سازی",
};

function Metric({
  title,
  value,
  caption,
}: {
  title: string;
  value: string;
  caption: string;
}) {
  return (
    <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
      <p className="text-xs font-medium text-black/45 dark:text-white/45">{title}</p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-2 text-sm leading-7 text-black/55 dark:text-white/55">{caption}</p>
    </article>
  );
}

export default async function AutonomousCommandCenterPage() {
  const [health, latest] = await Promise.all([loadScrapeHealth(), loadLatest()]);
  const snapshot = buildScrapeOperationsSnapshot(health, latest);
  const runtime = buildAutonomousRuntimeState(snapshot);

  const control = buildAutonomousControlPlane({
    health: runtime.health as "healthy" | "degraded" | "critical",
    confidence: runtime.confidence,
    execution: runtime.execution as "ready" | "running" | "blocked",
  });

  const governance = evaluateGovernance({
    health: runtime.health as "healthy" | "degraded" | "critical",
    confidence: runtime.confidence / 100,
    action:
      control.mode === "optimize"
        ? "optimize"
        : control.mode === "stabilize"
          ? "stabilize"
          : "observe",
  });

  return (
    <main dir="rtl" className="mx-auto max-w-7xl px-5 py-8 md:py-12">
      <section className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-black px-6 py-8 text-white shadow-xl md:px-10 md:py-12">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#ff6154]/25 blur-3xl" />
        <div className="absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-[#ffb11b]/20 blur-3xl" />

        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              IDEHJO AUTONOMOUS OS
            </div>

            <h1 className="mt-5 text-3xl font-black tracking-tight md:text-5xl">
              مرکز فرماندهی هوشمند ایده‌جو
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65 md:text-base">
              وضعیت زنده Runtime، تصمیم، کنترل، حاکمیت و یادگیری سیستم در یک نمای مدیریتی.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs text-white/50">اعتماد تصمیم</p>
              <p className="mt-1 text-3xl font-black">{runtime.confidence}%</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4">
              <p className="text-xs text-white/50">حالت کنترل</p>
              <p className="mt-2 text-lg font-black">{modeLabel[control.mode]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric
          title="سلامت سیستم"
          value={healthLabel[runtime.health] ?? runtime.health}
          caption={`شکست متوالی: ${snapshot.failureStreak}`}
        />
        <Metric
          title="وضعیت اجرا"
          value={executionLabel[runtime.execution] ?? runtime.execution}
          caption={`Pipeline: ${snapshot.pipelineStatus}`}
        />
        <Metric
          title="امتیاز یادگیری"
          value={String(runtime.learning.score)}
          caption={`Signal: ${runtime.learning.signal}`}
        />
        <Metric
          title="Governance"
          value={governance.allowed ? "مجاز" : "مسدود"}
          caption={governance.reason}
        />
      </section>

      <section className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#ff6154]">CURRENT AUTONOMOUS DECISION</p>
              <h2 className="mt-2 text-2xl font-black">{runtime.strategy}</h2>
            </div>
            <span className="rounded-full bg-black px-3 py-1 text-xs font-bold text-white dark:bg-white dark:text-black">
              {governance.allowed ? "POLICY APPROVED" : "POLICY BLOCKED"}
            </span>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <p className="text-xs font-bold text-black/40 dark:text-white/40">استدلال</p>
              <p className="mt-3 leading-8 text-black/70 dark:text-white/70">{runtime.reasoning}</p>
            </div>
            <div className="rounded-2xl bg-black/[0.03] p-5 dark:bg-white/[0.04]">
              <p className="text-xs font-bold text-black/40 dark:text-white/40">اقدام بعدی</p>
              <p className="mt-3 leading-8 text-black/70 dark:text-white/70">{runtime.action}</p>
            </div>
          </div>
        </article>

        <article className="rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          <p className="text-xs font-bold text-[#ff6154]">LIVE OPERATIONS</p>
          <h2 className="mt-2 text-xl font-black">وضعیت عملیاتی</h2>

          <div className="mt-5 space-y-3 text-sm">
            {[
              ["آخرین تلاش", snapshot.lastAttemptAt ?? "نامشخص"],
              ["آخرین موفقیت", snapshot.lastSuccessAt ?? "ثبت نشده"],
              ["تازگی داده", snapshot.freshness],
              ["وضعیت توکن", snapshot.tokenHealth],
            ].map(([label, value]) => (
              <div key={label} className="flex items-start justify-between gap-4 rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.04]">
                <span className="text-black/45 dark:text-white/45">{label}</span>
                <span className="max-w-[60%] break-words text-left font-bold">{value}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-5 rounded-[2rem] border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.04] md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-[#ff6154]">AUTONOMOUS LEARNING</p>
            <h2 className="mt-2 text-2xl font-black">حلقه یادگیری زنده</h2>
          </div>
          <span className="rounded-full bg-black/[0.05] px-3 py-1 text-xs font-bold dark:bg-white/10">
            {runtime.learning.signal}
          </span>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Metric
            title="نتیجه آخرین اجرا"
            value={runtime.learning.outcome === "success" ? "موفق" : runtime.learning.outcome === "failed" ? "ناموفق" : "نامشخص"}
            caption="Outcome واقعی از تاریخچه Runtime"
          />
          <Metric
            title="اثر روی استراتژی"
            value={runtime.learning.strategyEffect}
            caption="تغییر استراتژی بر اساس نتیجه اجرا"
          />
          <Metric
            title="Human Approval"
            value={governance.allowed ? "نیاز ندارد" : "لازم است"}
            caption={`Control mode: ${control.mode}`}
          />
        </div>
      </section>
    </main>
  );
}
