# P35 — Historical Corpus Recovery & Nightly Enrichment Repair

## What this fixes

- Recovers the historical IdehJo corpus from all canonical YYYY-MM-DD.json datasets.
- Deep-merges duplicate products by slug.
- Preserves richer historical comments, Persian content, AI reviews, Iranian equivalents and screenshots.
- Fixes Nightly AI so operational JSON files such as scrape-health.json are never selected as product datasets.
- Maintains a durable data/corpus.json artifact.
- Adds /products as the full historical archive.
- Makes historical products addressable through existing /product/[slug] pages.
- Uses corpus data for homepage portfolio metrics while keeping temporal ranking tabs tied to the latest daily dataset.
- Adds tests and a safety gate that refuses to write a suspiciously tiny recovered corpus.

## Important

The recovery does not fabricate products. It reconstructs the corpus only from data already present in repository history/data files.
