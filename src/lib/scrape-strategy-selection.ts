export type Strategy = "stabilize" | "recover" | "optimize" | "learn";

export function selectStrategy(input: {
  risk: "low" | "high";
  opportunity: boolean;
}): Strategy {
  if (input.risk === "high") return "stabilize";
  if (input.opportunity) return "optimize";
  return "learn";
}
