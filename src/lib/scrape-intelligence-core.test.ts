import { expect, test } from "bun:test";
import { evaluateIntelligence } from "./scrape-intelligence-core";

test("intelligence core detects stabilization need", () => {
  expect(evaluateIntelligence({ risk: "high", opportunity: false })).toBe("stabilize");
});
