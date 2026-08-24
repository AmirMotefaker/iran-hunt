import { expect, test } from "bun:test";
import { getAutonomousDashboardState } from "./autonomous-dashboard";

test("autonomous dashboard exposes operational state", () => {
  const state = getAutonomousDashboardState();
  expect(state.systemHealth).toBe("healthy");
  expect(state.executionStatus).toBe("ready");
  expect(state.strategy.length).toBeGreaterThan(0);
});
