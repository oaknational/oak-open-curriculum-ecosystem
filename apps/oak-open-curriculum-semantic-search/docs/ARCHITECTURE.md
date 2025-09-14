# Architecture

## Indices

- `oak_lessons`
  - `lesson_title` (text), `subject_slug` (keyword), `key_stage` (keyword)
  - `transcript_text` (text, term vectors, highlightable)
  - `lesson_semantic` (`semantic_text`)
- `oak_units`
  - `unit_title` (text), `subject_slug` (keyword), `key_stage` (keyword)
  - `lesson_ids` (keyword), `lesson_count` (integer), optional `unit_topics`
- `oak_unit_rollup`
  - `unit_title` (text, copy_to `unit_semantic`)
  - `rollup_text` (text, term vectors, copy_to `unit_semantic`)
  - `unit_semantic` (`semantic_text`)

## Endpoints

- **Structured**: `POST /api/search` – requires a structured body.
- **Natural language**: `POST /api/search/nl` – converts `q` into a structured query via LLM (disabled if no `OPENAI_API_KEY`).
- **Indexer**: `GET /api/index-oak` (admin header `x-api-key`).
- **Rollup**: `GET /api/rebuild-rollup` (admin header `x-api-key`).
- **SDK parity**: `POST /api/sdk/search-lessons`, `POST /api/sdk/search-transcripts`.

## Data flow

- **Indexing:** `/api/index-oak` uses the SDK to fetch units, lessons, and transcripts, then bulk indexes to `oak_lessons` and `oak_units`.
- **Rollups:** `/api/rebuild-rollup` reads units + lessons from ES, synthesizes short lesson passages, and indexes `oak_unit_rollup`.
- **Search:** both endpoints call a shared core (`runHybridSearch`) that:
  - **Lessons:** BM25 on (`lesson_title^3`, `transcript_text`) + semantic on `lesson_semantic` → **RRF**, with transcript highlights.
  - **Units:** BM25 on `oak_units` + semantic on `oak_unit_rollup.unit_semantic` + BM25 on `rollup_text` → **RRF**, with rollup highlights.
