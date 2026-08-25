import { expect, test } from "bun:test";
import { evaluateGovernance } from "./autonomous-governance";

test("critical systems require stabilization", () => {
  const result = evaluateGovernance({
    health: "critical",
    confidence: 0.9,
    action: "optimize",
  });

  expect(result.decision).toBe("stabilize");
  expect(result.allowed).toBe(false);
});

test("healthy confident systems may optimize", () => {
  const result = evaluateGovernance({
    health: "healthy",
    confidence: 0.9,
    action: "optimize",
  });

  expect(result.decision).toBe("optimize");
  expect(result.allowed).toBe(true);
});
