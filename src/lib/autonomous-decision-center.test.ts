import { expect, test } from "bun:test";
import { getAutonomousDecisionCenterState } from "./autonomous-decision-center";

test("decision center exposes explainable autonomous state", () => {
  const state = getAutonomousDecisionCenterState();
  expect(state.health).toBe("healthy");
  expect(state.confidence).toBeGreaterThanOrEqual(90);
  expect(state.humanOverride).toBe(false);
});
