import { expect, test } from "bun:test";
import { decideControlAction } from "./scrape-control-plane";

test("high risk stabilizes", () => {
  expect(decideControlAction({ risk: "high", opportunity: false }))
    .toBe("stabilize");
});
