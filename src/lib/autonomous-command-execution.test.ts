import { expect, test } from "bun:test";
import { decideCommandExecution } from "./autonomous-command-execution";

test("healthy high-confidence optimization executes autonomously", () => {
  const decision = decideCommandExecution({
    id: "cmd-optimize",
    requestedAction: "optimize",
    policyState: "healthy",
    governance: {
      health: "healthy",
      confidence: 0.96,
      action: "optimize",
    },
  });

  expect(decision.mode).toBe("execute");
  expect(decision.allowed).toBe(true);
  expect(decision.requiresApproval).toBe(false);
  expect(decision.action).toBe("optimize");
});

test("critical stabilization requires approval", () => {
  const decision = decideCommandExecution({
    id: "cmd-stabilize",
    requestedAction: "stabilize",
    policyState: "critical",
    governance: {
      health: "critical",
      confidence: 0.99,
      action: "stabilize",
    },
  });

  expect(decision.mode).toBe("require-approval");
  expect(decision.allowed).toBe(false);
  expect(decision.requiresApproval).toBe(true);
  expect(decision.action).toBe("stabilize");
});

test("unknown policy state blocks execution", () => {
  const decision = decideCommandExecution({
    id: "cmd-unknown",
    requestedAction: "optimize",
    policyState: "unknown",
    governance: {
      health: "healthy",
      confidence: 0.95,
      action: "optimize",
    },
  });

  expect(decision.mode).toBe("blocked");
  expect(decision.allowed).toBe(false);
  expect(decision.action).toBe("blocked");
});

test("governance observation produces observe-only mode", () => {
  const decision = decideCommandExecution({
    id: "cmd-observe",
    requestedAction: "observe",
    policyState: "healthy",
    governance: {
      health: "healthy",
      confidence: 0.55,
      action: "observe",
    },
  });

  expect(decision.mode).toBe("observe-only");
  expect(decision.allowed).toBe(true);
  expect(decision.requiresApproval).toBe(false);
  expect(decision.action).toBe("observe");
});

test("policy and requested action mismatch is blocked", () => {
  const decision = decideCommandExecution({
    id: "cmd-mismatch",
    requestedAction: "stabilize",
    policyState: "healthy",
    governance: {
      health: "healthy",
      confidence: 0.95,
      action: "optimize",
    },
  });

  expect(decision.mode).toBe("blocked");
  expect(decision.allowed).toBe(false);
  expect(decision.requiresApproval).toBe(true);
});
