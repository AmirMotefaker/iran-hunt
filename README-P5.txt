IdehJo P5 — Scrape Alerting & Recovery

Overlay this ZIP on branch feat/p5-scrape-alerting-recovery.

Adds:
- alert engine (healthy/warning/critical)
- bounded recovery policy (5m, 15m, then stop)
- cooldown handling
- incident derivation from recent run history
- admin dashboard integration
- tests for alerts, recovery and incidents

This phase does NOT automatically perform network retries yet; it establishes a deterministic, tested policy layer first.
