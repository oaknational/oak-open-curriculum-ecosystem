# Unit Rollup Index

**Goal:** unit-level semantic recall and snippet highlights without duplicating all lesson transcripts per unit.

- `rollup_text`: concatenated short passages (first 1–2 sentences, ~300 chars) from each unit lesson.
- `unit_semantic`: `semantic_text` at the root; receives `copy_to` from `unit_title` and `rollup_text`.
- Rebuild via `/api/rebuild-rollup` after (re)indexing or content changes.
