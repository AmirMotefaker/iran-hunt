# P34 — Data Loader Availability Fix

Root cause:
`loadLatest()` considered every `.json` file in `data/`.
Because `scrape-health.json` sorts after date-based filenames in descending lexical order,
the homepage could load health metadata instead of the latest daily dataset and then
fall back to an empty legacy product list.

Fix:
- Only accept canonical daily filenames matching `YYYY-MM-DD.json`.
- Keep all historical data untouched.
- Add a regression test proving `scrape-health.json` cannot be selected as daily product data.
- No database, domain, deployment, scraper, or production configuration changes.
