# Semantic Search API Context

**Purpose**: Living context document for the Oak Open Curriculum Semantic Search API project. Use this to regain situational awareness quickly and to keep work aligned with the definitive architecture and delivery rules.

**Last Updated**: 2025-03-16  
**Project Status**: Alignment Execution — Definitive architecture adoption  
**Primary Plan**: `.agent/plans/semantic-search/semantic-search-api-plan.md`  
**Canonical Reference**: `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`

---

## Project Overview

### What we're building

A **hybrid lexical + semantic search platform** for Oak Curriculum content that:

- Serves **structured** (`POST /api/search`) and **natural language** (`POST /api/search/nl`) queries with server-side **Reciprocal Rank Fusion (RRF)** across lexical and `semantic_text` clauses.
- Provides **suggestion/type-ahead** endpoints backed by Elasticsearch completion contexts and `search_as_you_type` fields.
- Exposes **admin surfaces** (indexing, rollup rebuild, status, observability hooks) guarded by `SEARCH_API_KEY`.
- Publishes an up-to-date **OpenAPI contract**, feeds MCP tools/resources/prompts, and insists on TDD + quality gates per `docs/agent-guidance/testing-strategy.md`.

### Architecture (definitive target)

- **Backend**: Next.js App Router (Node runtime) deployed to Vercel, with handlers structured for TDD and dependency injection.
- **Search Engine**: Elasticsearch Serverless **four-index** topology:
  - `oak_lessons`: Transcript-rich lesson documents with lesson-planning data, canonical URLs, `lesson_semantic`, term vectors, and completion payloads.
  - `oak_unit_rollup`: Unit-centric snippets (≈300 characters per lesson) plus `unit_semantic`, facets, canonical URLs, completion contexts.
  - `oak_units`: Lightweight unit metadata for analytics, joins, and facet aggregation.
  - `oak_sequences`: Sequence discovery surface with optional `sequence_semantic`, navigation metadata, canonical URLs, and suggestion payloads.
- **Data Source**: Oak Curriculum SDK (types generated via `pnpm type-gen`), exposing enriched lesson-planning data, canonical URLs, and sequence relationships.
- **Observability**: Structured logging for bulk indexing, zero-hit searches, and error telemetry; metrics feed future dashboards.

---

## Current State Snapshot

### ✅ Completed foundations

- Next.js workspace scaffolding with structured/natural-language endpoints and MCP tooling.
- Baseline Elasticsearch setup scripts (synonym set, analyser/normaliser definitions) and legacy indexing flows.
- Initial hybrid search implementation using BM25 + semantic RRF for lessons and units.
- Quality gates (lint, type-check, test, build) passing on the pre-alignment codebase.

### 🚧 Active alignment work

- Regenerating **Elasticsearch mappings/settings** to match the definitive guide (completion contexts, highlight offsets, semantic fields, `oak_sequences`).
- Extending **environment validation** to support `OAK_API_KEY` and `OAK_API_BEARER`, index version tagging, observability config, and AI provider selection with safe defaults.
- Rebuilding the **ingestion pipeline** (lessons, units, rollout, sequences) for resilient batching/backoff, enriched payloads, and deterministic retries.
- Redesigning **rollup generation** to prioritise lesson-planning data, curated snippets, canonical URLs, and semantic copies.
- Implementing **server-side RRF** query builders for lessons, units, and sequences with optional facets, highlights, and filters.
- Expanding **API surface** (structured, NL, suggestion/type-ahead, admin status, observability hooks) with generated schemas and guards.
- Adding **regression coverage and logging**: zero-hit telemetry, bulk error reporting, and removal of obsolete client-side fusion helpers.

### ⏳ Pending validation / sign-off

- Verification of compatibility against target clients (OpenAI Connector, Gemini, ElevenLabs) once transport hardening merges (see High-Level Plan #3).
- Regeneration of OpenAPI + TypeDoc artefacts after schema and doc updates.
- Quality gates (`pnpm lint`, `pnpm test`, `pnpm build`, workspace `doc-gen`) executed post-alignment.

### Immediate next steps (follow GO cadence)

1. Apply `.agent/plans/semantic-search/semantic-search-target-alignment-plan.md` tasks in order, ensuring each `ACTION:` is followed by a self-review per `GO.md`.
2. Start with mapping/setup updates, then progress through environment validation, ingestion rebuild, rollup redesign, query refactors, API expansion, documentation, and regression tests.
3. After each major feature slice, run quality gates and capture outcomes in the review log.

---

## Technical Context

### Key files & directories

```text
apps/oak-open-curriculum-semantic-search/
├── app/api/
│   ├── search/route.ts                     # Structured search (server-side RRF)
│   ├── search/nl/route.ts                  # Natural language wrapper (LLM optional)
│   ├── search/suggest/route.ts             # Type-ahead / completion endpoint (to add)
│   ├── index-oak/route.ts                  # Legacy indexing (superseded during rebuild)
│   ├── index-oak/status/route.ts           # Alignment target: progress telemetry
│   ├── rebuild-rollup/route.ts             # Rollup regeneration
│   └── sdk/                                # Parity routes for regression comparison
├── src/lib/
│   ├── elastic/                            # ES client, helpers, retry wrappers
│   ├── ingestion/                          # Lesson/unit/sequence transforms and bulk logic
│   ├── queries/                            # Server-side RRF builders per scope
│   ├── suggestions/                        # Suggest/type-ahead payload assembly
│   ├── env.ts                              # Environment validation + defaults
│   ├── logging.ts                          # Structured logging and zero-hit telemetry
│   └── tests/                              # Unit/integration suites (Vitest)
├── scripts/
│   ├── elastic-setup.ts                    # Synonyms, analyzers, index templates
│   └── elastic-alias-swap.ts               # Zero-downtime reindex helpers
└── docs/                                   # Authored documentation (kept in sync with plan)
```

_(Files marked “to add” are required outcomes of the alignment plan.)_

### Environment variables (post-alignment)

```env
# Core search infrastructure
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here

# Oak Curriculum access
OAK_API_KEY=your_oak_api_key_here
OAK_API_BEARER=...                         # Preferred bearer token (mutually exclusive with OAK_API_KEY)

# Admin + observability
SEARCH_API_KEY=your_search_api_key_here
SEARCH_INDEX_VERSION=v2025-03-16           # Monotonic tag used for cache invalidation
ZERO_HIT_WEBHOOK_URL=https://...           # Optional webhook for zero-hit telemetry (set to 'none' if unused)
LOG_LEVEL=info                             # Structured logging level

# Natural language search
AI_PROVIDER=openai | none                  # Choose 'none' to disable NL endpoint
OPENAI_API_KEY=your_openai_api_key_here

# Derived by tooling
NODE_ENV=development|production            # Standard Next.js env
```

Environment validation in `src/lib/env.ts` must enforce mutual exclusivity between `OAK_API_KEY` and `OAK_API_BEARER`, require `SEARCH_API_KEY`, and provide sensible defaults for observability fields. Tests must cover the validation logic (TDD per repository rules).

### Data flow (definitive)

1. **Ingestion**: Oak Curriculum SDK → enriched transforms (lessons, units, rollups, sequences) → resilient bulk indexing into four ES indices (batching, backoff, retries, logging).
2. **Querying**:
   - Structured search → validated payload → server-side RRF query builder → single `_search` per scope (lexical + semantic + filters + optional facets) → response formatting with canonical URLs and highlights.
   - Natural language search → deterministic NL → structured translation → structured search path → shared caching/telemetry.
   - Suggestions/type-ahead → completion or `search_as_you_type` query using contexts (`subject`, `key_stage`, etc.).
3. **Observability**: Zero-hit queries, bulk failures, and significant latency spikes logged through centralised logger; admin status endpoint surfaces progress and failure counts.

---

## Implementation Detail Highlights

### Elasticsearch mappings & settings

- Apply the **oak_text analyser** with synonym graph and ascii folding, and the **oak_lower normaliser** for keyword filters.
- Increase `highlight.max_analyzed_offset` to support long transcripts and rollups.
- Configure completion fields (`title_suggest`) with contexts for subject and key stage.
- Ensure `semantic_text` fields exist for lessons (`lesson_semantic`), units (`unit_semantic`), and optionally sequences (`sequence_semantic`).
- Maintain explicit index templates/versioning so `SEARCH_INDEX_VERSION` can drive alias swaps and cache invalidation.

### Resilient ingestion pipeline

- Fetch data via SDK adapters that already expose lesson-planning data, canonical URLs, sequences, and provenance fields.
- Produce deterministic document IDs and payloads (JSON serialisable, snake_case field names matching mappings).
- Use bulk batches (≈250 docs) with exponential backoff on HTTP 429/5xx, and log per-batch outcomes.
- Persist progress markers (e.g., key stage + subject + offset) so retries resume cleanly.
- After successful ingestion, rotate index aliases (lessons/units/sequences/rollups) and bump `SEARCH_INDEX_VERSION`.

### Server-side RRF query builders

- `rank.rrf` combining lexical `multi_match` clauses and semantic queries for lessons and units.
- Optional facets via `aggs`, only when requested by the client.
- Highlight definitions for `transcript_text` (lessons) and `rollup_text` (units) with sentence boundary scanners.
- Sequences scope supports lexical query plus optional semantic clause when `sequence_semantic` lands.

### Suggestion & type-ahead endpoints

- Completion API using `title_suggest` with contextual filters.
- `search_as_you_type` endpoints for immediate suggestions keyed by prefix.
- Responses include canonical URLs and metadata to support UI linking.

### Observability & logging

- Structured logs for ingestion progress, retries, and failures (include batch identifiers, error details).
- Zero-hit search telemetry with payload context (scope, filters, text) routed to webhook or log sink.
- Admin status endpoint summarises docs processed, remaining batches, last error, and current index version.

---

## Current Challenges & Mitigations

| Challenge                          | Mitigation                                                                                                                               |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Mapping parity across four indices | Regenerate mappings/settings from definitive guide; cover via integration tests (ES container or mocked responses) per testing strategy. |
| Enriched SDK data availability     | Ensure SDK exposes lesson-planning data, canonical URLs, sequence relationships; if missing, raise upstream issues before proceeding.    |
| Resilient bulk ingestion           | Implement retry/backoff helpers, idempotent progress markers, and structured logging to enable safe restarts.                            |
| Cache invalidation & consistency   | Tie response caching to `SEARCH_INDEX_VERSION`; call `revalidateTag` after ingestion/rollup to flush stale results.                      |
| Observability gaps                 | Instrument zero-hit logging and bulk failure metrics; document operational runbooks in `docs/INDEXING.md` and `docs/QUERYING.md`.        |

---

## Development Workflow Expectations

- **Planning & reviews**: Follow `GO.md` — every `ACTION:` is immediately followed by a self-review entry. Reference `.agent/directives-and-memory/rules.md` and `docs/agent-guidance/testing-strategy.md` when defining tasks.
- **TDD**: Write failing tests first (Vitest for queries/transforms, integration harnesses for ES interactions). Avoid `any`, unsafe casts, or bypassing quality gates.
- **Quality gates**: `pnpm format` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm build` → `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`. Capture outcomes in the Review Log.
- **Documentation**: Keep `apps/oak-open-curriculum-semantic-search/docs/*.md` and README in sync with code changes; regenerate OpenAPI + TypeDoc after schema updates.
- **Deployment**: Use Vercel with environment sets per branch (`Preview`, `Production`). Post-deploy, run admin ingestion/rollup routes, then verify search, suggestion, and status endpoints.
- **Regression testing**: Compare hybrid results against SDK parity routes; run compatibility checks with target clients listed in the high-level plan.

---

## Quick Reference Commands

```bash
# Install dependencies
pnpm install

# Elasticsearch setup (post-mapping updates)
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
  pnpm -C apps/oak-open-curriculum-semantic-search elastic:setup

# Run alignment-focused tests (workspace)
pnpm -C apps/oak-open-curriculum-semantic-search test

# Execute quality gates in order
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build && \
  pnpm -C apps/oak-open-curriculum-semantic-search doc-gen

# Admin ingestion (cloud)
curl -X POST https://<host>/api/index-oak-bulk \
  -H "x-api-key: $SEARCH_API_KEY"

# Rollup rebuild
curl -X POST https://<host>/api/rebuild-rollup \
  -H "x-api-key: $SEARCH_API_KEY"

# Suggestion endpoint (example)
curl -X POST https://<host>/api/search/suggest \
  -H 'content-type: application/json' \
  -d '{"prefix":"mount","scope":"lessons","subject":"geography","keyStage":"ks4"}'
```

---

## Review Notes

- Keep this context document updated whenever alignment milestones shift. Record the date and summary in the Review Log within `.agent/plans/semantic-search/semantic-search-alignment-refresh-plan.md` after each significant edit.
