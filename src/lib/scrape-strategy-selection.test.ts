import { expect, test } from "bun:test";
import { selectStrategy } from "./scrape-strategy-selection";

test("high risk selects stabilization", () => {
  expect(selectStrategy({ risk: "high", opportunity: false })).toBe("stabilize");
});
