import type { ScrapeOperationsSnapshot } from "./scrape-operations";
import { evaluateLearningOutcome } from "./autonomous-learning-loop";

export function buildAutonomousRuntimeState(snapshot: ScrapeOperationsSnapshot) {
  const confidence =
    snapshot.severity === "critical" ? 52 :
    snapshot.severity === "warning" ? 76 :
    snapshot.freshness === "fresh" && snapshot.pipelineStatus === "success" ? 96 : 88;

  const lastRun = snapshot.recentRuns[0];
  const learning = evaluateLearningOutcome({
    success: lastRun?.status === "success",
    confidence,
    repeatedFailure: snapshot.failureStreak >= 3,
  });

  const health =
    snapshot.severity === "healthy" ? "healthy" :
    snapshot.severity === "warning" ? "degraded" : "critical";

  const strategy =
    snapshot.severity === "critical" ? "تثبیت فوری" :
    snapshot.severity === "warning" ? "بازیابی و پایش" :
    snapshot.freshness === "fresh" ? "بهینه‌سازی مستمر" : "پایش و اعتبارسنجی";

  const action =
    snapshot.severity === "critical"
      ? "علت افت سلامت داده را بررسی کن و بازیابی کنترل‌شده را در اولویت قرار بده."
      : snapshot.severity === "warning"
        ? "شکست اخیر را پایش کن و مسیر بازیابی را آماده نگه دار."
        : "پایش را ادامه بده و اقدامات هوشمند با بیشترین ارزش را در اولویت قرار بده.";

  const execution =
    snapshot.pipelineStatus === "running" ? "running" :
    snapshot.severity === "critical" ? "blocked" : "ready";

  return {
    health,
    reasoning: `سلامت عملیاتی: ${snapshot.severity}. تازگی داده: ${snapshot.freshness}. وضعیت پایپ‌لاین: ${snapshot.pipelineStatus}. شکست متوالی: ${snapshot.failureStreak}.`,
    strategy,
    action,
    execution,
    confidence,
    learning: {
      outcome: lastRun?.status ?? "unknown",
      signal: learning.signal,
      score: learning.score,
      strategyEffect:
        learning.signal === "reinforce"
          ? "استراتژی فعلی بر اساس نتیجه واقعی تقویت می‌شود."
          : learning.signal === "adjust"
            ? "استراتژی بر اساس نتیجه واقعی نیاز به تنظیم دارد."
            : "شکست‌های تکراری نیازمند ارجاع و مداخله هستند.",
    },
  };
}
