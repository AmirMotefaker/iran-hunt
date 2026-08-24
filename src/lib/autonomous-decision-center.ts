export type AutonomousDecisionCenterState = {
  health: "healthy" | "degraded" | "critical";
  reasoning: string;
  strategy: string;
  action: string;
  execution: "ready" | "running" | "blocked";
  confidence: number;
  humanOverride: boolean;
};

export function getAutonomousDecisionCenterState(): AutonomousDecisionCenterState {
  return {
    health: "healthy",
    reasoning: "سیگنال‌های عملیاتی پایدار هستند و سامانه برای هماهنگی خودکار آماده است.",
    strategy: "بهینه‌سازی مستمر",
    action: "پایش را ادامه بده و اقدامات هوشمند با بیشترین ارزش را در اولویت قرار بده.",
    execution: "ready",
    confidence: 94,
    humanOverride: false,
  };
}
