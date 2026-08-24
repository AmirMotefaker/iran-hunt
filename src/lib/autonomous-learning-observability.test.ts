import { expect, test } from "bun:test";
import { getLearningObservabilityState } from "./autonomous-learning-observability";

test("learning observability exposes latest learning state", () => {
  const state = getLearningObservabilityState();
  expect(state.outcome).toBe("success");
  expect(state.signal).toBe("reinforce");
  expect(state.score).toBeGreaterThanOrEqual(80);
});
