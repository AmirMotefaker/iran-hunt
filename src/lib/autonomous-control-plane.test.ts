import { expect, test } from "bun:test";
import { buildAutonomousControlPlane } from "./autonomous-control-plane";

test("critical systems enter stabilization mode", () => {
  const state = buildAutonomousControlPlane({
    health: "critical",
    confidence: 90,
    execution: "blocked",
  });

  expect(state.mode).toBe("stabilize");
});

test("healthy confident systems optimize", () => {
  const state = buildAutonomousControlPlane({
    health: "healthy",
    confidence: 95,
    execution: "ready",
  });

  expect(state.mode).toBe("optimize");
});
