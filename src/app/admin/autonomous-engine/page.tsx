import { getAutonomousDecisionCenterState } from "@/lib/autonomous-decision-center";
import { getLearningObservabilityState } from "@/lib/autonomous-learning-observability";

const statusMap = { healthy: "سالم", degraded: "نیازمند توجه", critical: "بحرانی" } as const;
const executionMap = { ready: "آماده اجرا", running: "در حال اجرا", blocked: "متوقف" } as const;
const learningSignalMap = { reinforce: "تقویت", adjust: "تنظیم", escalate: "ارجاع" } as const;

function Card({ title, value, description }: { title: string; value: string; description?: string }) {
  return (
    <article className="rounded-2xl border border-black/10 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
      <p className="mb-2 text-xs font-medium text-black/50 dark:text-white/50">{title}</p>
      <p className="text-lg font-black leading-8">{value}</p>
      {description ? <p className="mt-2 text-sm leading-7 text-black/55 dark:text-white/55">{description}</p> : null}
    </article>
  );
}

export default function AutonomousEnginePage() {
  const state = getAutonomousDecisionCenterState();
  const learning = getLearningObservabilityState();

  return (
    <main dir="rtl" className="mx-auto max-w-6xl px-5 py-10">
      <section className="rounded-[2rem] border border-black/10 bg-gradient-to-br from-[#ff6154]/15 via-transparent to-[#ffb11b]/15 p-6 md:p-9 dark:border-white/10">
        <span className="inline-flex rounded-full bg-[#ff6154]/10 px-3 py-1 text-xs font-bold text-[#ff6154]">مرکز تصمیم‌گیری خودکار</span>
        <div className="mt-4 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black md:text-4xl">مغز عملیاتی ایده‌جو</h1>
            <p className="mt-3 max-w-2xl text-sm leading-8 text-black/60 dark:text-white/60">نمای زنده‌ای از تصمیم، اجرا و یادگیری موتور هوشمند ایده‌جو.</p>
          </div>
          <div className="rounded-2xl border border-black/10 bg-white/80 px-5 py-4 text-center dark:border-white/10 dark:bg-black/20">
            <p className="text-xs text-black/50 dark:text-white/50">اعتماد تصمیم</p>
            <p className="mt-1 text-3xl font-black">{state.confidence}%</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <Card title="سلامت سیستم" value={statusMap[state.health]} />
        <Card title="استراتژی منتخب" value={state.strategy} />
        <Card title="وضعیت اجرا" value={executionMap[state.execution]} />
      </section>

      <section className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card title="استدلال هوش مصنوعی" value={state.reasoning} />
        <Card title="اقدام بعدی" value={state.action} />
      </section>

      <section className="mt-6 rounded-[2rem] border border-black/10 bg-white/70 p-6 dark:border-white/10 dark:bg-white/[0.04]">
        <p className="text-xs font-bold text-[#ff6154]">حلقه یادگیری خودکار</p>
        <h2 className="mt-2 text-2xl font-black">آخرین نتیجه یادگیری</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Card title="نتیجه اجرا" value={learning.outcome === "success" ? "موفق" : "ناموفق"} />
          <Card title="سیگنال یادگیری" value={learningSignalMap[learning.signal]} />
          <Card title="اثر روی استراتژی" value={learning.strategyEffect} description={`امتیاز یادگیری: ${learning.score}`} />
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-dashed border-black/15 p-5 dark:border-white/15">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-black">Human Override</h2>
            <p className="mt-1 text-sm text-black/55 dark:text-white/55">کنترل انسانی برای تصمیم‌های حساس در معماری حفظ شده است.</p>
          </div>
          <span className="rounded-full bg-black/5 px-3 py-1 text-sm font-bold dark:bg-white/10">{state.humanOverride ? "فعال" : "غیرفعال"}</span>
        </div>
      </section>
    </main>
  );
}
