import { expect, test } from "bun:test";
import { knowledgeLayer } from "./scrape-knowledge-layer";

test("incidents create learning signal", () => {
  expect(knowledgeLayer({ incidents: 1, improvements: false }))
    .toBe("learn");
});
