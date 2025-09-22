# Oak Curriculum Hybrid Search — Definitive Guide

_Last updated: 2025-03-16 (Europe/London)_

This guide describes the canonical architecture for Oak’s semantic search platform. It consolidates decisions, mappings, ingestion flows, query patterns, suggestion behaviour, admin operations, and maintenance expectations. Treat it as the source of truth for the workspace `apps/oak-open-curriculum-semantic-search`.

---

## 1. Goals & non-negotiables

- **Hybrid retrieval**: server-side Reciprocal Rank Fusion (RRF) combining lexical and `semantic_text` relevance for lessons, units, and sequences.
- **Teacher-centric enrichment**: include curated metadata, canonical URLs, canonical unit/sequence relationships, and suggestion payloads in every document.
- **SDK-first**: all data flows from `@oaknational/oak-curriculum-sdk`; if the SDK lacks a field, fix it upstream.
- **Observability**: structured logging for ingestion, zero-hit events, index version rotation, and suggestion usage.
- **Quality gates**: adhere to `.agent/directives-and-memory/rules.md`, `docs/agent-guidance/testing-strategy.md`, and GO.md.

---

## 2. System architecture

```text
Oak Curriculum SDK → ingestion transforms → Elasticsearch Serverless (4 indices)
  ↓                                               ↓
Next.js API routes (search, NL, suggest, admin, status) ← caching/invalidation ← SEARCH_INDEX_VERSION
  ↓
UI + MCP tooling
```

### Components

- **Indices**: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_sequences` (see section 3).
- **API routes**: `/api/search`, `/api/search/nl`, `/api/search/suggest`, `/api/index-oak`, `/api/rebuild-rollup`, `/api/index-oak/status`, `/api/openapi.json`, `/api/docs`, `/api/sdk/*`.
- **Caching**: `unstable_cache` keyed by `${SEARCH_INDEX_VERSION}|hash(payload)` with tag-based invalidation.
- **Observability**: structured logs, zero-hit webhook (optional), admin status endpoint.

---

## 3. Elasticsearch definitions

Shared settings:

- `oak_text` analyser (standard + lowercase + asciifolding + `synonym_graph` via `oak-syns`).
- `oak_lower` normaliser for keyword filters.
- `highlight.max_analyzed_offset` ≥ 10,000,000 to accommodate transcripts/rollups.

### `oak_lessons`

- **Purpose**: lesson search.
- **Fields**: metadata (`lesson_id`, `lesson_slug`, `subject_slug`, `key_stage`, `years`), teacher fields, transcripts with `term_vector`, `lesson_semantic` (`semantic_text`), canonical URL, unit relationships, completion `title_suggest` with contexts `{ subject, key_stage }`, `search_as_you_type` sub-field.

### `oak_unit_rollup`

- **Purpose**: unit search/highlights.
- **Fields**: metadata (`unit_id`, `unit_slug`, `subject_slug`, `key_stage`, `years`, `unit_topics`), lesson relationships (`lesson_ids`, `lesson_count`), rollup snippets (`rollup_text`), `unit_semantic`, canonical URLs, completion contexts (subject, key stage, sequence).

### `oak_units`

- **Purpose**: lightweight unit metadata for aggregations/analytics.
- **Fields**: identifiers, key stage, subject, years, sequence references, canonical URLs.

### `oak_sequences`

- **Purpose**: sequence discovery/navigation.
- **Fields**: `sequence_id`, `sequence_slug`, `sequence_title`, `category_titles`, `phase_slug`, `key_stages`, `years`, canonical URL, unit slugs, optional `sequence_semantic`, completion payloads.

Mappings must remain in sync with `scripts/elastic-setup.ts`; regenerate indices via alias swap if mappings change.

---

## 4. Ingestion & rollup flows

1. **Fetch via SDK** – Get lessons, units, sequences, transcripts, teacher notes, canonical URLs. Validate using generated types/guards.
2. **Transform** – Build deterministic payloads, populate suggestion contexts, ensure British spelling.
3. **Bulk index** – Batch ~250 docs, retry with exponential backoff on 429/5xx, log outcomes. Use versioned write indices (`oak_lessons_v2025-03-16`) and swap aliases atomically.
4. **Rollup** – Generate unit snippets prioritising teacher metadata; copy to `unit_semantic`; refresh completion payloads.
5. **Versioning** – Increment `SEARCH_INDEX_VERSION`, persist it, and call `revalidateTag` to invalidate caches.
6. **Telemetry** – Emit structured logs for ingestion completion, retries, zero-hit baseline resets, and version rotations.

---

## 5. Query patterns

- **Lessons**: RRF over lexical (`lesson_title^3`, teacher metadata, `transcript_text`) and `lesson_semantic`; apply filters in `bool.filter`; highlight `transcript_text` with sentence boundary scanner.
- **Units**: RRF over `unit_title^3`, `rollup_text`, `unit_topics`, and `unit_semantic`; optional lesson count ranges aggregated via `aggs`.
- **Sequences**: Lexical + optional semantic; filter by subject/phase; return canonical URLs.
- **Suggestions**: Completion API with contexts; fallback to `search_as_you_type`; responses include cache metadata (`version`, `ttlSeconds`).
- **Zero-hit logging**: `semantic-search.zero-hit` events with scope, text, filters, index version.

See `docs/QUERYING.md` for canonical JSON bodies.

---

## 6. Endpoints & behaviours

- `/api/search` – Validates payloads (scope, filters, facets), executes server-side RRF, returns hits, highlights, facets, zero-hit info.
- `/api/search/nl` – Deterministically converts NL queries to structured payloads; returns `501` if NL disabled.
- `/api/search/suggest` – Accepts `prefix`, scope, optional filters; caches with short TTL.
- `/api/index-oak` – Runs ingestion (idempotent, resilient); rotates aliases/version; requires `SEARCH_API_KEY`.
- `/api/rebuild-rollup` – Regenerates rollups and increments version.
- `/api/index-oak/status` – Progress telemetry (processed, remaining, last error, version).
- `/api/openapi.json` & `/api/docs` – Generated contract; update after schema changes.
- `/api/sdk/*` – Parity routes for regression only.

All admin endpoints must guard against unauthorised access and log actions.

---

## 7. Caching & invalidation

- Use Data Cache (`unstable_cache`) with keys `${SEARCH_INDEX_VERSION}|hash(payload)`.
- Tags: `index:${SEARCH_INDEX_VERSION}` plus `search:structured`/`search:suggest` for manual flushes.
- After ingestion/rollup, rotate version and call `revalidateTag`. Document version changes in logs.

---

## 8. Observability & maintenance

- Log ingestion duration, retry counts, zero-hit events, suggestion usage.
- Configure optional webhook for zero hits (`ZERO_HIT_WEBHOOK_URL`).
- Monitor Elasticsearch Serverless health and synonym updates (`PUT /_synonyms/oak-syns`).
- Update documentation, OpenAPI, TypeDoc whenever API payloads evolve.
- Run quality gates and record outcomes in alignment refresh plan review log.

---

## 9. Security

- Admin endpoints require `SEARCH_API_KEY` and must fail fast with `401/403` on missing/invalid keys.
- Do not expose admin/status routes publicly; restrict via platform configuration.
- Validate all inputs with Zod/TypeScript guards; reject unexpected fields.

---

## 10. Checklist for releases

1. Run ingestion + rollup; confirm aliases and index version.
2. Run structured, NL, suggestion queries; verify zero-hit logging.
3. Regenerate OpenAPI (`pnpm make openapi`) and TypeDoc (`pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`).
4. Execute quality gates: format → type-check → lint → test → build.
5. Update documentation review log and commit.

Keep this guide updated whenever the alignment plan changes. Deviations must be documented and approved before implementation.
