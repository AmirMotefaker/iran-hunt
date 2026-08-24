import { expect, test } from "bun:test";
import { evaluateLearningOutcome } from "./autonomous-learning-loop";

test("successful confident outcomes reinforce strategy", () => {
  expect(evaluateLearningOutcome({ success: true, confidence: 92 }).signal).toBe("reinforce");
});

test("repeated failures escalate learning response", () => {
  expect(
    evaluateLearningOutcome({ success: false, confidence: 40, repeatedFailure: true }).signal,
  ).toBe("escalate");
});
