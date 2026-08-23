import { expect, test } from "bun:test";
import { reasonAboutSystem } from "./scrape-reasoning-engine";

test("high risk creates stabilization reasoning", () => {
  expect(reasonAboutSystem({ risk: "high", opportunity: false }))
    .toBe("stabilize");
});
