export type IntelligenceAction = "continue" | "stabilize" | "optimize";

export function evaluateIntelligence(input: { risk: "low" | "high"; opportunity: boolean }): IntelligenceAction {
  if (input.risk === "high") return "stabilize";
  if (input.opportunity) return "optimize";
  return "continue";
}
