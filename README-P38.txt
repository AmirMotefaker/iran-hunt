# P38 — Vote-Aware Today Recovery

- Atom feed is discovery-only.
- Atom slugs are resolved through Product Hunt GraphQL.
- Real votesCount and canonical metadata are recovered before publication.
- Zero-vote unresolved Atom entries are excluded.
- API and recovered products are merged by slug and ranked by real votes.
- Yesterday no longer falls back to the current Atom feed.
- Existing scrape validation remains authoritative.
- No vote counts are fabricated.
