import { expect, test } from "bun:test";
import { orchestrateLearning } from "./scrape-learning-orchestrator";

test("repeated failures trigger retrain", () => {
  expect(orchestrateLearning({ failures: 3, opportunities: false }))
    .toBe("retrain");
});
