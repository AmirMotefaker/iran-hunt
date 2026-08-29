# P39 — Unique Daily Corpus Growth

- Canonicalizes incoming products by slug before merge.
- Rejects products without a canonical slug.
- Separates unseen products from known corpus products.
- Known products refresh richer metadata but do not consume new-product quota.
- Adds a default daily unique-growth quota of 10 products.
- Selects unseen products deterministically by date, votes, then slug.
- Persists discovered, canonical, acceptedNew, duplicates, rejected, before, after, and added metrics.
- Preserves corpus shrink and real-comment coverage safety gates.
- Does not fabricate products or votes.
