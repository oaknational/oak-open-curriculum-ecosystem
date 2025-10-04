# Architecture

## Overview

The semantic search workspace delivers a Next.js (App Router) service that ingests Oak Curriculum content via the official SDK, stores enriched documents in **four Elasticsearch Serverless indices**, and serves hybrid (lexical + semantic) queries with server-side **Reciprocal Rank Fusion (RRF)**. The service now exposes structured, natural-language, suggestion, and admin/status endpoints, all guarded by deterministic validation and observability hooks.

## Indices (Elasticsearch Serverless)

| Index             | Purpose                                             | Key fields                                                                                                                                                                                                                                                                                                                                                  |
| ----------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `oak_lessons`     | Primary lesson retrieval surface.                   | `lesson_id`, `lesson_slug`, `lesson_title`, lesson-planning data (`lesson_keywords`, `key_learning_points`, `misconceptions_and_common_mistakes`, `teacher_tips`, `content_guidance`), `transcript_text` with `term_vector`, `lesson_semantic` (`semantic_text`), canonical URL, unit metadata, completion `title_suggest` with contexts, audit timestamps. |
| `oak_unit_rollup` | Unit search and highlight surface.                  | `unit_id`, `unit_slug`, `unit_title`, `unit_topics`, `lesson_ids`, `lesson_count`, canonical URLs, rollup snippets (`rollup_text`), `unit_semantic` (`semantic_text` with `copy_to`), completion `title_suggest`, facet fields (`key_stage`, `subject_slug`, `years`).                                                                                      |
| `oak_units`       | Lightweight unit metadata for analytics and facets. | Mirrors unit identifiers, key stage/subject filters, lesson counts, canonical URLs; excludes rollup text for faster aggregations.                                                                                                                                                                                                                           |
| `oak_sequences`   | Sequence discovery and navigation.                  | `sequence_id`, `sequence_slug`, `sequence_title`, canonical URL, category/phase/year fields, associated unit slugs, optional `sequence_semantic`, completion payloads.                                                                                                                                                                                      |

Shared settings include the `oak_text` analyser (standard, lowercase, asciifolding, `synonym_graph` using `oak-syns`), the `oak_lower` normaliser for keyword filters, and `highlight.max_analyzed_offset` increased to accommodate long transcripts and rollups.

## Service surface (Next.js)

- `POST /api/search` – Structured hybrid search over lessons, units, or sequences. Validates payloads, builds server-side RRF queries, returns highlights, canonical URLs, facets, zero-hit metadata.
- `POST /api/search/nl` – Natural-language wrapper that deterministically converts `{ q }` into structured parameters, then delegates to `/api/search`. Returns `501` when NL search disabled via `AI_PROVIDER=none`.
- `POST /api/search/suggest` – Suggestion/type-ahead endpoint backed by completion contexts and `search_as_you_type` fields. Supports prefix, scope, optional subject/key stage filters, and returns canonical URLs.
- `GET /api/index-oak` – Admin ingestion entry point (guarded by `SEARCH_API_KEY`). Triggers resilient batching across lessons, units, sequences. Supports `?fixtures=` query strings for SDK-provided fixture responses.
- `GET /api/rebuild-rollup` – Regenerates rollup snippets, updates `oak_unit_rollup`, bumps index version, and invalidates caches. Supports fixture modes identical to ingestion.
- `GET /api/index-oak/status` – Reports ingestion progress, processed counts, remaining batches, last error, current `SEARCH_INDEX_VERSION`, and honours fixture mode for deterministic testing.
- `GET /api/openapi.json` & `GET /api/docs` – Serve generated OpenAPI schema and Redoc UI.
- `/api/sdk/*` – SDK parity routes used for regression comparison (not exposed publicly).

All admin endpoints require `x-api-key: ${SEARCH_API_KEY}`.

## UI layout hierarchy

The App Router surfaces use nested layouts to separate search experiences from operational tooling while keeping accessibility and deterministic fixtures front of mind:

- `app/page.tsx` renders the landing page via `app/ui/landing/LandingPage`, introducing hybrid search and funnelling users through CTA cards.
- `app/structured_search/page.tsx` and `app/natural_language_search/page.tsx` load `SearchPageClient`, which in turn drives `SearchPageLayout` and its variant-specific heroes, skip links, and forms.
- `app/ui/search/layout/SearchPageLayout.sections.tsx` bifurcates structured and natural controls, wiring skip links (`buildSkipLinks`) and section IDs (`resolveResultsSectionId`) so Playwright and assistive tech can target the correct regions.
- `app/ui/ops/OperationsLayout.tsx` wraps `/admin` and `/status`, standardising spacing, fixture notices, and aria live regions for status updates (`StatusClient`) and telemetry dashboards (`AdminPageClient`).
- `app/ui/global/Fixture/FixtureNotice.tsx` centralises the fixture toggle and banner copy, sharing tone across search and operations surfaces.

Captured artefacts under `test-artifacts/` (landing, structured, natural) and `test-results/responsive-baseline-*` (admin/status) serve as visual checkpoints, aligning with the UX plan’s evidence requirements.

## Design rationale

- **RRF everywhere**: Reciprocal Rank Fusion lets us blend lexical lesson-planning fields with semantic embeddings without issuing multiple round trips. A single `_search` per scope keeps latency predictable and aligns with Elasticsearch Serverless limits.
- **Versioned caching (`SEARCH_INDEX_VERSION`)**: Every search response, suggestion payload, and telemetry entry is tagged with the current index version. Bumping the version after ingestion or rollup rebuilds gives deterministic cache invalidation and makes it obvious which deployment produced a response.
- **SDK-generated fixtures**: `SEMANTIC_SEARCH_USE_FIXTURES` (server) and `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE` (client) short-circuit search and admin routes with generated data. This removes the dependency on live infrastructure during onboarding, Playwright runs, and regression tests while still exercising the same validation paths.
- **Target-aware indices**: `SEARCH_INDEX_TARGET` flips the app between primary and sandbox aliases. Admin endpoints, zero-hit persistence, and CLI scripts all derive index names from this target, so developers can experiment in isolated namespaces without touching production data.
- **Optional zero-hit persistence**: `ZERO_HIT_PERSISTENCE_ENABLED` toggles storing aggregated telemetry in Elasticsearch. Persisted events power the admin dashboard, while the in-memory ring buffer keeps lightweight deployments cheap.

## Developer workflow

1. Copy `.env.example` → `.env.local`, set the required search credentials, and opt into fixtures (`SEMANTIC_SEARCH_USE_FIXTURES=fixtures`).
2. Run the canonical quality gates:

   ```bash
   pnpm make
   pnpm qg
   ```

3. Start the dev server (`pnpm -C apps/oak-open-curriculum-semantic-search dev`) and use the fixture toggle in the UI to confirm deterministic data.
4. Execute admin ingestion (`GET /api/index-oak`) and rollup (`GET /api/rebuild-rollup`) locally with fixtures before hitting live Elasticsearch.
5. Update docs/plan entries whenever index mappings, query builders, or fixture semantics change.

`x-api-key: ${SEARCH_API_KEY}`. Admin and search routes share the fixture resolver (`SEMANTIC_SEARCH_USE_FIXTURES`, `NEXT_PUBLIC_ENABLE_FIXTURE_TOGGLE`) so local development and tests can run entirely offline. Structured and NL routes share caching via `SEARCH_INDEX_VERSION` tags (see caching plan).

## Data flow

1. **Ingestion**: Oak SDK adapters fetch enriched curriculum data (lessons, units, sequences), transform it into canonical payloads, and bulk index into the four Elasticsearch indices. Batching (≈250 docs) with exponential backoff handles throttling; progress markers allow resumable runs. Successful runs rotate aliases and advance `SEARCH_INDEX_VERSION`.
2. **Rollup rebuild**: A dedicated flow collects lesson-planning snippets (~300 characters per lesson), assembles unit rollups, copies text to `unit_semantic`, and updates completion payloads. Completion triggers cache/tag invalidation and structured logging.
3. **Querying**: Validated requests build a single `_search` per scope combining lexical `multi_match` clauses and `semantic` queries via `rank.rrf`. Highlights use `unified` highlighter with sentence boundaries. Optional facets and zero-hit logging fire depending on request parameters.
4. **Suggestions**: Completion API hits `title_suggest` with contextual filters; fallback `search_as_you_type` queries provide prefix matches. Responses include canonical URLs and metadata to power UI linking.

## Observability & telemetry

- Structured logs capture ingestion batches, retries, zero-hit searches (`scope`, `text`, filters), and index version rotations.
- Admin status endpoint collates counts, durations, and errors for dashboards.
- Suggestion and search routes log cache keys (debug) and version tags (info) to aid troubleshooting.
- **Zero-hit persistence pipeline**: every zero-hit event is queued through the in-memory ring buffer and, when `ZERO_HIT_PERSISTENCE_ENABLED=true`, also written to the target Elasticsearch Serverless cluster. The pipeline provisions an ILM policy (`oak_zero_hit_events_retention_<days>d`) on first write, applies it to the target index (`oak_zero_hit_events` or `_sandbox`), and honours `ZERO_HIT_INDEX_RETENTION_DAYS` (default 30) before expiring cold documents. The admin dashboard fetches the latest snapshot via `/api/observability/zero-hit`, which falls back to deterministic fixtures when fixture mode is active. Friendly outage copy is surfaced through a dedicated aria-live banner so operators receive immediate feedback when telemetry is unreachable.

## Dependencies & tooling

- **SDK**: All curriculum data comes from `@oaknational/oak-curriculum-sdk`; types generated via `pnpm type-gen` uphold the Cardinal Rule.
- **Testing**: Unit tests cover transforms and query builders; integration suites (Vitest + fixtures/ES test doubles) validate mappings and ingestion behaviour; Playwright (MCP) used for UI flows.
- **Quality gates**: `pnpm format` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm build` → `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`.

## Diagram (conceptual)

```text
Oak Curriculum SDK
    ↓ (enriched transforms)
Resilient ingestion (batch, retry, alias swap)
    ↓
Elasticsearch Serverless indices (lessons, unit_rollup, units, sequences)
    ↓
Server-side RRF queries & suggestions
    ↓
Next.js API routes → MCP tools → UI
```

Keep this document aligned with the target alignment plan whenever indices, endpoints, or observability strategies change.
