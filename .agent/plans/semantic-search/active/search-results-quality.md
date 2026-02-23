# Search Results Quality

**Status**: Merge blocker
**Priority**: High
**Area**: Search (Elasticsearch)

## Problem

Searching for `text: "apples"` with `scope: "lessons"` returns 8,347 results (essentially every lesson in the index). Only the top 2 results are genuinely about apples. Results 3+ include "Missing angles", "Alternate angles", "Using samples", and "Magnetic poles" — none of which relate to apples.

The highlights confirm the search is matching on phonetically/textually vague words like "angles", "samples", "poles", and "apply". Rank scores are extremely low (0.03–0.06), indicating weak matches that should be filtered out.

ChatGPT managed to present sensible results by ignoring the noise, but the underlying search quality is poor.

## Evidence

Query via `oak-remote-preview` MCP:

```json
{ "text": "apples", "scope": "lessons" }
```

Response: `total: 8347`, `took: 340ms`

| Rank | Result | rankScore | Relevant? |
|------|--------|-----------|-----------|
| 1 | Making apple flapjack bites | 0.063 | Yes |
| 2 | Rosh Hashanah: diverse Jewish celebrations | 0.037 | Yes (apples and honey) |
| 3 | Missing angles | 0.032 | No |
| 4 | Alternate angles | 0.032 | No |
| 5 | Analysing 'A Poison Tree' by William Blake | 0.032 | Marginal (apple metaphor) |
| 6 | Corresponding angles | 0.031 | No |
| 7 | Selective breeding of plants | 0.031 | Yes |
| 8 | Using samples | 0.031 | No |

## Investigation areas

1. **Elasticsearch query construction** — Is the query using fuzzy matching or very broad text matching? Why does "apples" match "angles"?
2. **Minimum score threshold** — Are results with very low rank scores being returned when they should be filtered?
3. **Total count** — Returning 8,347 for a specific term suggests no meaningful filtering is happening at the query level.
4. **Transcript weighting** — Many false matches appear in transcript highlights. Is transcript text weighted too heavily relative to structured fields (title, keywords, subject)?

## Files to investigate

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/` — search tool implementation
- `packages/sdks/oak-search-sdk/` — Elasticsearch query construction
- Search index mapping and analyzer configuration

## Acceptance criteria

- A query for "apples" in lessons returns a manageable number of genuinely relevant results
- Irrelevant results (e.g. "Missing angles") are excluded or ranked well below relevant ones
- Total counts reflect actual matches, not the entire index
