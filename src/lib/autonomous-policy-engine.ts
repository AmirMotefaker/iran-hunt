export type PolicyState = "critical" | "warning" | "healthy" | "unknown";

export function evaluatePolicy(state: PolicyState) {
  if (state === "critical") {
    return { allowed: true, action: "stabilize", requiresApproval: true };
  }

  if (state === "healthy") {
    return { allowed: true, action: "optimize", requiresApproval: false };
  }

  if (state === "warning") {
    return { allowed: true, action: "stabilize", requiresApproval: true };
  }

  return { allowed: false, action: "blocked", requiresApproval: true };
}
