import { evaluateLearningOutcome } from "./autonomous-learning-loop";

export function getLearningObservabilityState() {
  const outcome = evaluateLearningOutcome({ success: true, confidence: 92 });

  return {
    outcome: "success" as const,
    signal: outcome.signal,
    score: outcome.score,
    strategyEffect:
      outcome.signal === "reinforce"
        ? "استراتژی فعلی تقویت می‌شود."
        : outcome.signal === "adjust"
          ? "استراتژی نیاز به تنظیم دارد."
          : "نیاز به مداخله و بررسی بیشتر وجود دارد.",
  };
}
