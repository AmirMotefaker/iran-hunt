import { expect, test } from "bun:test";
import { createActionPlan } from "./scrape-action-planner";

test("high risk creates stabilization plan", () => {
  expect(createActionPlan("high").action).toBe("stabilize");
});
