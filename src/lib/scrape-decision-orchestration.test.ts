import { describe, expect, test } from "bun:test";
import { createDecisionPlan } from "./scrape-decision-orchestration";

describe("autonomous decision orchestration", () => {
  test("prioritizes stabilization for high risk", () => {
    expect(createDecisionPlan({ riskScore: 90, opportunityScore: 20 }).priority)
      .toBe("high");
  });

  test("selects optimization for opportunities", () => {
    expect(createDecisionPlan({ riskScore: 20, opportunityScore: 80 }).action)
      .toContain("optimize");
  });
});
