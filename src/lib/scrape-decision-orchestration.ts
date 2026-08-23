export type DecisionPlan = {
  action: string;
  priority: "low" | "medium" | "high";
};

export function createDecisionPlan(input: {
  riskScore: number;
  opportunityScore: number;
}): DecisionPlan {
  if (input.riskScore >= 80) {
    return {
      action: "stabilize pipeline",
      priority: "high",
    };
  }

  if (input.opportunityScore >= 70) {
    return {
      action: "optimize strategy",
      priority: "medium",
    };
  }

  return {
    action: "continue monitoring",
    priority: "low",
  };
}
