export type ReasoningDecision = "stabilize" | "optimize" | "observe";

export function reasonAboutSystem(input: {
  risk: "high" | "low";
  opportunity: boolean;
}): ReasoningDecision {
  if (input.risk === "high") return "stabilize";
  if (input.opportunity) return "optimize";
  return "observe";
}
