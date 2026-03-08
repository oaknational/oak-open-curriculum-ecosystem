# Repo Search Deep Dive (SDK/CLI focus)

**Scope**: Search functionality in this repo intended for SDK and CLI usage. UI surfaces are ignored by request.
**Primary codebase**: `apps/oak-search-cli` plus SDK type generation under `packages/sdks/oak-curriculum-sdk`.

**Status note**: Anything under `app/api` is aspirational and not actually built or deployed. We do have Elasticsearch data suitable for typeahead suggestions, but there is no UI integration, and there is no natural language or intent flow in use yet.

## Guiding constraints

- All search types, schemas, and Elasticsearch mappings are generated from the SDK OpenAPI schema (`pnpm sdk-codegen`).
- This app consumes SDK-generated types and mappings; it does not define them locally.
- Synonyms and phrase vocabulary are also sourced from the SDK (single source of truth).

## Index inventory and data model

- Indices and mappings are pulled from the SDK and created via `pnpm -C apps/oak-search-cli es:setup`.
- Current indices (via SDK mappings):
  - `oak_lessons` (semantic lesson docs)
  - `oak_unit_rollup` (aggregated unit content for search)
  - `oak_units` (unit metadata)
  - `oak_sequences` (programme sequences)
  - `oak_sequence_facets` (sequence browsing facets)
  - `oak_threads` (thread docs for progression-centric search)
  - `oak_meta` (ingestion metadata)

## Ingestion pipeline (CLI and orchestration)

- Primary CLI:
  - `pnpm -C apps/oak-search-cli es:ingest-live`
  - Supports API mode (default) and bulk mode (`--bulk --bulk-dir`), with `--dry-run`, `--force`, `--verbose`.
- Setup and status:
  - `pnpm ... es:setup` (create synonyms + indices)
  - `pnpm ... es:status` (cluster and index health)
  - `oak-search admin versioned-ingest` / `rollback` / `validate-aliases` (ADR-130 blue/green lifecycle)
- Data sources:
  - API mode uses the SDK to fetch lessons, units, sequences, and metadata.
  - Bulk mode uses bulk download files with API supplementation for KS4 enrichment.
- Transformations:
  - Lesson planning snippets, rollup text generation, semantic summaries.
  - Sequence and thread extraction, facet generation, and document builders.
- Reliability:
  - Two-tier bulk retry strategy for ELSER queue overflow (HTTP retry + document retry).
  - Ingestion error collection, data integrity reports, and structured logging.
- Optional SDK response caching:
  - Redis-backed caching with TTL jitter, 404 fallback caching, and cache reset CLI flags.

## Querying (structured hybrid search, aspirational)

- API endpoint: `POST /api/search` (aspirational; not built/deployed)
- Input schema: `SearchStructuredRequestSchema` from the SDK (planned contract).
- Hybrid retrieval:
  - Lessons and units use **four-way RRF** (BM25 + ELSER on content and structure).
  - Sequences use **two-way RRF** (BM25 + ELSER) with fuzziness.
- Query processing:
  - Noise phrase removal (B.4) and curriculum phrase detection/boosting (B.5).
  - Synonym expansion at query time, derived from SDK ontology.
- Filters supported (structured):
  - `subject`, `keyStage`, `minLessons`, `unitSlug`, `phaseSlug`.
  - Phase 3 filters: `tier`, `examBoard`, `examSubject`, `ks4Option`, `year`, `threadSlug`, `category`.
- Output:
  - Results keyed by scope (`lessons`, `units`, `sequences`) with `rankScore`, `highlights`, and metadata.
  - Optional facets and aggregations.

## Suggestions (type-ahead, aspirational integration)

- ES data model supports typeahead suggestions (completion + fallback).
- No UI integration and no deployed `/api/search/suggest` endpoint yet.
- Planned behaviour: completion-first with `bool_prefix` fallback, context filtering, cache by `SEARCH_INDEX_VERSION`.

## Natural language search (not implemented)

- Natural language and intent parsing are not built or deployed.
- The `parseQuery()` module exists in code, but it is not wired into a live endpoint.

## Observability and fixtures

- Zero-hit logging, persistence, and fixture modes are designed for the aspirational API layer.
- Ingestion telemetry and logging are active today in the CLI and indexing pipeline.
- Cache invalidation via `SEARCH_INDEX_VERSION` is planned for API responses.

## SDK parity endpoints (aspirational)

- `POST /api/sdk/search-lessons`: proxies the SDK lesson search for regression comparison (aspirational).
- `POST /api/sdk/search-transcripts`: proxies SDK transcript search (aspirational).

## Admin endpoints and OpenAPI surfaces (aspirational)

- Admin ingestion endpoints (feature-flagged / guarded in practice, aspirational):
  - `GET /api/index-oak`
  - `GET /api/rebuild-rollup`
  - `GET /api/index-oak/status`
- OpenAPI + docs (aspirational):
  - `GET /api/openapi.json`
  - `GET /api/docs`

## Evaluation and acceptance criteria

- Baseline and diagnostic evaluation scripts:
  - `pnpm eval:diagnostic`, `pnpm eval:per-category`.
- Acceptance criteria and tiering defined in `.agent/plans/semantic-search/search-acceptance-criteria.md`.
- Experiments tracked in `apps/oak-search-cli/evaluation/` and `.agent/evaluations/`.

## Key file references

- SDK type generation overview: `packages/sdks/oak-sdk-codegen/code-generation/typegen/search/README.md`
- SDK search types: `packages/sdks/oak-curriculum-sdk/src/types/generated/search/requests.ts`
- Index setup CLI: `apps/oak-search-cli/src/lib/elasticsearch/setup/cli.ts`
- Ingestion CLI: `apps/oak-search-cli/src/lib/elasticsearch/setup/ingest-live.ts`
- Hybrid search orchestration: `apps/oak-search-cli/src/lib/hybrid-search/index.ts`
- RRF query builders: `apps/oak-search-cli/src/lib/hybrid-search/rrf-query-builders.ts`
- Suggestion pipeline: `apps/oak-search-cli/src/lib/suggestions/index.ts`
- Natural language parser: `apps/oak-search-cli/src/lib/query-parser.ts`
- Indexing module overview: `apps/oak-search-cli/src/lib/indexing/README.md`
- SDK caching guide: `apps/oak-search-cli/docs/SDK-CACHING.md`
