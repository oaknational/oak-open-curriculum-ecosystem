# Architecture

## Overview

The `apps/oak-open-curriculum-semantic-search` workspace provides a Next.js service that indexes Oak Curriculum content into **Elasticsearch Serverless** and exposes hybrid (lexical + semantic) search endpoints. We favour **server-side Reciprocal Rank Fusion (RRF)** to unify BM25 and `semantic_text` ranking inside a single `_search` per scope, returning highlights, facets, and canonical URLs.

## Indices (Elasticsearch Serverless)

| Index             | Purpose                                                      | Key fields                                                                                                                                                                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oak_lessons`     | Primary lesson search surface.                               | `lesson_title` (+ `search_as_you_type`), `lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`, `transcript_text` (term vectors), `lesson_semantic` (`semantic_text`), completion `title_suggest`, metadata keywords (`subject_slug`, `key_stage`, `unit_ids`, `unit_titles`, `lesson_url`). |
| `oak_unit_rollup` | Primary unit search surface with unit-level semantic recall. | `unit_title` (+ `search_as_you_type`, `completion` with contexts), `rollup_text` (per-lesson snippets, term vectors), `unit_semantic` (`semantic_text`, receives `copy_to` from title + rollup), `unit_topics`, `lesson_ids`, `lesson_count`, canonical URLs (`unit_url`, `subject_programmes_url`).                                                      |
| `oak_units`       | Metadata/analytics companion for joins and admin metrics.    | Mirrors unit metadata without rollup text; supports analytics/facets.                                                                                                                                                                                                                                                                                     |
| `oak_sequences`   | Sequence discovery/navigation (optional semantic field).     | `sequence_title`, `category_titles`, `phase_*`, `subject_*`, `key_stages`, `years`, `sequence_url`, `unit_slugs`.                                                                                                                                                                                                                                         |

All indices share custom analysis:

- `oak_text` analyser (standard tokenizer + lowercase + asciifolding + `synonym_graph` via the `oak-syns` synonyms set).
- `oak_lower` normaliser for keyword filters.
- `highlight.max_analyzed_offset` increased to avoid truncation on long fields.

## Service Surface (Next.js)

- `POST /api/search` – structured hybrid search (`scope` = `lessons` | `units` | `sequences`), validates filters via SDK guards. Returns RRF-ranked hits with highlights and metadata.
- `POST /api/search/nl` – natural language endpoint that optionally calls an LLM to translate `{ q }` into structured parameters before delegating to the same core search. Responds with `501` if `AI_PROVIDER=none`.
- `GET /api/index-oak` – admin endpoint that indexes lessons, units, and sequences via the Oak Curriculum SDK, then writes to the search indices. Requires `x-api-key: ${SEARCH_API_KEY}`.
- `GET /api/rebuild-rollup` – regenerates unit rollup documents (short lesson snippets) and updates `oak_unit_rollup`. Also requires the admin key.
- `GET /api/openapi.json` & `GET /api/docs` – serve OpenAPI 3.1 (Zod-generated) and Redoc UI.

## Search Flow (Hybrid + RRF)

1. **Lessons:** Single `_search` against `oak_lessons` using `rank.rrf` with two queries:
   - `multi_match` over boosted lexical fields (`lesson_title^3`, curated teacher metadata, `transcript_text`).
   - `semantic` query over `lesson_semantic`.
     Filters (`subject_slug`, `key_stage`, etc.) applied via `bool.filter`. Highlights come from `transcript_text`.

2. **Units:** Single `_search` against `oak_unit_rollup` with `rank.rrf` combining `multi_match` (title, rollup snippets, optional `unit_topics`) and `semantic` on `unit_semantic`. Highlights are produced from `rollup_text`. Range filters (e.g. minimum lesson count) run inside `bool.filter`.

3. **Sequences:** Lexical `_search` against `oak_sequences` (semantic optional). Results provide navigation metadata.

4. **Type-ahead & suggestions:**
   - Search-as-you-type via `.sa` field variants.
   - Completion suggestions via `title_suggest` with `subject` and `key_stage` contexts.

5. **Facets/Aggregations:** Optional `terms` aggregations on `subject_slug`, `key_stage`, and `range` on `lesson_count`. Admin analytics can query `oak_units` for rollups.

## Rollup Strategy

Units reference many lessons; duplicating entire transcripts per unit would explode storage. Instead we rebuild a dedicated `oak_unit_rollup` index that stores:

- Per-lesson snippets (~300 characters, sentence aware) concatenated into `rollup_text`.
- Metadata for canonical URLs and filters.
- A `unit_semantic` field populated via `copy_to` for semantic recall.

`/api/rebuild-rollup` can be run after indexing or content updates to refresh snippets.

## Environment & Security

Environment variables (server-side only):

- `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`
- `OAK_API_KEY` **or** `OAK_API_BEARER`
- `SEARCH_API_KEY` (required for admin endpoints)
- `AI_PROVIDER` (`openai` or `none`) and `OPENAI_API_KEY` when enabled

Admin endpoints must be called with the header `x-api-key: ${SEARCH_API_KEY}`. Never expose search credentials to the browser; Next.js API routes run server-side only.

## Observability & Maintenance

- Update synonyms via `scripts/synonyms.json` → `PUT /_synonyms/oak-syns`.
- Nightly indexing keeps Elasticsearch in sync with the Oak Curriculum API.
- Log slow queries, zero-hit searches, and bulk failures for tuning.
- For mapping-breaking changes, migrate via versioned indices and alias swaps.
