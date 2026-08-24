import { expect, test } from "bun:test";
import { createExecutionPlan } from "./scrape-execution-orchestrator";

test("high priority executes", () => {
  expect(createExecutionPlan("high").status).toBe("execute");
});
