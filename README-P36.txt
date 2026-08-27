# P36 — Daily Corpus Growth + Automated Enrichment

- Every successful daily scrape merges newly discovered products into data/corpus.json.
- Existing corpus products are preserved.
- data/corpus-health.json records daily growth.
- Corpus safety gates detect suspicious shrinkage and low real-comment coverage.
- Nightly enrichment is followed by a corpus audit.
- The corpus can grow naturally from 186 to 200+ as new unique products are discovered.
