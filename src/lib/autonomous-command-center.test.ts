import { expect, test } from "bun:test";
import { buildAutonomousControlPlane } from "./autonomous-control-plane";
import { evaluateGovernance } from "./autonomous-governance";

test("command center control and governance agree on healthy optimization", () => {
  const control = buildAutonomousControlPlane({
    health: "healthy",
    confidence: 96,
    execution: "ready",
  });

  const governance = evaluateGovernance({
    health: "healthy",
    confidence: 0.96,
    action: control.mode === "optimize" ? "optimize" : "observe",
  });

  expect(control.mode).toBe("optimize");
  expect(governance.allowed).toBe(true);
});
