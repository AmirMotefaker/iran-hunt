import { describe, expect, test } from "bun:test";
import { evaluateStrategy } from "./scrape-strategy-engine";

describe("autonomous strategy engine", () => {
  test("detects improvement opportunity", () => {
    expect(evaluateStrategy({ reliability: 50, failures: 4 }).opportunityScore)
      .toBe(80);
  });

  test("keeps stable systems optimized", () => {
    expect(evaluateStrategy({ reliability: 99, failures: 0 }).recommendation)
      .toContain("optimization");
  });
});
