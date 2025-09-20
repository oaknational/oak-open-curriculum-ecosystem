# Unit Rollup Index (`oak_unit_rollup`)

The rollup index delivers unit-level semantic recall and highlight snippets without duplicating full lesson transcripts. Each document represents a unit enriched with short lesson passages and metadata pulled from the Oak Curriculum SDK.

## Why it exists

- Units span many lessons; copying every transcript into the unit document would bloat storage and slow highlighting.
- Teachers still expect unit highlights that reference individual lessons. We therefore concatenate curated ~300-character snippets per lesson into `rollup_text`.
- Both `unit_title` and `rollup_text` are copied into `unit_semantic`, enabling `semantic_text` recall that aligns with the rollup content.

## Document shape

```json
{
  "unit_id": "...",
  "unit_slug": "...",
  "unit_title": "Glaciation and Mountains",
  "subject_slug": "geography",
  "key_stage": "ks4",
  "lesson_ids": ["..."],
  "lesson_count": 10,
  "unit_topics": "glaciation; mountain formation",
  "rollup_text": "Introductory lesson snippet …",
  "unit_semantic": "semantic_text payload (managed by ES)",
  "unit_url": "https://www.thenational.academy/teachers/programmes/geography-secondary/units/glaciation",
  "subject_programmes_url": "https://www.thenational.academy/teachers/key-stages/ks4/subjects/geography/programmes"
}
```

Key field notes:

- `rollup_text` uses the shared `oak_text` analyser, stores term vectors for unified highlighting, and participates in RRF via `multi_match`.
- `unit_semantic` is a `semantic_text` field. Elasticsearch populates and stores the semantic representation; we just send the raw text.
- `title_suggest` exposes completion suggestions with `subject` and `key_stage` contexts to power guided type-ahead.

## Rebuild process (`/api/rebuild-rollup`)

1. Fetch units and their lessons via the Oak Curriculum SDK (no raw HTTP).
2. For each lesson:
   - Select teacher-facing metadata (keywords, key learning points, tips) or transcript excerpts.
   - Trim to a readable ~300-character snippet, respecting sentence boundaries.
3. Concatenate the snippets, store them in `rollup_text`, and derive metadata (`lesson_count`, canonical URLs).
4. Bulk index the documents into `oak_unit_rollup`, checking for partial failures. Refresh highlights by re-running the endpoint after indexing or content updates.

## When to run it

- After `POST /api/index-oak` completes (fresh content ingested).
- On scheduled jobs (e.g. nightly) to capture SDK changes.
- Whenever synonyms or analyser changes warrant reindexing (combine with the main index rebuild).
