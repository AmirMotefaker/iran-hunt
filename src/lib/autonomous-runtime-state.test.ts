import { expect, test } from "bun:test";
import { buildAutonomousRuntimeState } from "./autonomous-runtime-state";
import type { ScrapeOperationsSnapshot } from "./scrape-operations";

const base: ScrapeOperationsSnapshot = {
  severity: "healthy", freshness: "fresh", pipelineStatus: "success",
  failureStreak: 0, lastAttemptAt: null, lastSuccessAt: null,
  lastFailureAt: null, lastFailureReason: null, latestDataAt: null,
  tokenHealth: "ok",
  recentRuns: [{ status: "success", startedAt: "2026-08-24T08:00:00.000Z", finishedAt: "2026-08-24T08:01:00.000Z", error: null }],
};

test("healthy runtime reinforces strategy", () => {
  const state = buildAutonomousRuntimeState(base);
  expect(state.health).toBe("healthy");
  expect(state.learning.signal).toBe("reinforce");
});

test("critical repeated failures escalate", () => {
  const state = buildAutonomousRuntimeState({
    ...base,
    severity: "critical",
    freshness: "stale",
    pipelineStatus: "failed",
    failureStreak: 3,
    recentRuns: [{ status: "failed", startedAt: "2026-08-24T08:00:00.000Z", finishedAt: "2026-08-24T08:01:00.000Z", error: "timeout" }],
  });
  expect(state.health).toBe("critical");
  expect(state.execution).toBe("blocked");
  expect(state.learning.signal).toBe("escalate");
});
