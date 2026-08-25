export type ControlPlaneMode =
  | "observe"
  | "stabilize"
  | "optimize";

export function buildAutonomousControlPlane(input: {
  health: "healthy" | "degraded" | "critical";
  confidence: number;
  execution: "ready" | "running" | "blocked";
}) {
  const mode: ControlPlaneMode =
    input.health === "critical"
      ? "stabilize"
      : input.confidence >= 85
        ? "optimize"
        : "observe";

  return {
    mode,
    confidence: input.confidence,
    decision:
      mode === "stabilize"
        ? "Prioritize recovery and system stabilization."
        : mode === "optimize"
          ? "Continue optimization based on stable signals."
          : "Continue observation and collect more evidence.",
    execution: input.execution,
  };
}
