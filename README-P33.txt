# P33 — Autonomous Command Execution Layer

P33 adds a controlled decision-to-execution boundary for the IdehJo autonomous intelligence stack.

## Scope

- Converts command-center decisions into explicit execution outcomes.
- Reuses the existing autonomous policy engine.
- Reuses the existing governance layer.
- Supports four execution modes: execute, require-approval, observe-only, blocked.
- Prevents policy/action mismatches.
- Prevents execution when policy state is unknown.
- Requires approval for critical or warning stabilization paths.
- Keeps the layer deterministic and side-effect free.

## Safety boundary

This phase decides whether an autonomous action may execute. It does not perform external side effects, mutate production infrastructure, change the database, or invoke deployment actions.

A later execution adapter can consume this decision object to perform real operations behind explicit safety controls.
