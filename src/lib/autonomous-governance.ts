export type GovernanceContext = {
  health: "healthy" | "degraded" | "critical";
  confidence: number;
  action: "optimize" | "stabilize" | "observe";
};

export function evaluateGovernance(context: GovernanceContext) {
  if (context.health === "critical") {
    return {
      allowed: false,
      decision: "stabilize",
      reason: "critical systems require stabilization",
    };
  }

  if (context.confidence >= 0.8 && context.action === "optimize") {
    return {
      allowed: true,
      decision: "optimize",
      reason: "stable high-confidence optimization allowed",
    };
  }

  return {
    allowed: true,
    decision: "observe",
    reason: "continue monitored operation",
  };
}
