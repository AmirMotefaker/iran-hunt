import { test, expect } from "bun:test";
import { evaluatePolicy } from "./autonomous-policy-engine";

test("critical requires approval", () => {
  expect(evaluatePolicy("critical").requiresApproval).toBe(true);
});

test("healthy optimizes", () => {
  expect(evaluatePolicy("healthy").action).toBe("optimize");
});

test("unknown is blocked", () => {
  expect(evaluatePolicy("unknown").allowed).toBe(false);
});
