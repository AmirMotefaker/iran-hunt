export type ControlAction = "continue" | "stabilize" | "optimize";

export function decideControlAction(input: {
  risk: "low" | "high";
  opportunity: boolean;
}): ControlAction {
  if (input.risk === "high") return "stabilize";
  if (input.opportunity) return "optimize";
  return "continue";
}
