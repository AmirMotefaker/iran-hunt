export function createExecutionPlan(priority: "high" | "normal") {
  return priority === "high"
    ? { status: "execute", priority }
    : { status: "hold", priority };
}
