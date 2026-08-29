# P40 — Autonomous Enrichment Backlog

- Prioritizes least-complete products, then oldest products.
- Processes a bounded nightly batch (default 10).
- Existing enrichment fields are never downgraded.
- Failed items remain eligible for later runs.
- Persists data/enrichment-health.json with backlog and failure metrics.
- Nightly workflow updates corpus, enriches, audits, and commits data.
