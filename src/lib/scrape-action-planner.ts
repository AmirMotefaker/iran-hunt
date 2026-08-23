export type ActionPlan = {
  action: "stabilize" | "optimize";
  priority: "high" | "normal";
};

export function createActionPlan(risk: "high" | "low"): ActionPlan {
  return risk === "high"
    ? { action: "stabilize", priority: "high" }
    : { action: "optimize", priority: "normal" };
}
