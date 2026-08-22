IdehJo P6 — Automated Scrape Reliability Engine

Adds:
- real retry runner around the existing scrape command
- hard maximum of 3 total attempts
- reuse of P5 recovery/backoff decisions
- 5m/15m cooldown behavior from the existing policy
- workflow timeout increased to 45 minutes to accommodate bounded recovery
- original scrape health recording remains the source of truth
- workflow still exits failed if recovery does not succeed

Safety:
- no unbounded retry loop
- no retry after policy limit
- no change to Product Hunt request implementation
- no publishing of invalid data; P1 validation remains intact

Apply on feat/p6-scrape-reliability-engine, then run:
bun test
bun run type-check
bun run build
