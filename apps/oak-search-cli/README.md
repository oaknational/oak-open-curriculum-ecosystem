# Oak Search CLI (`@oaknational/search-cli`)

The operator CLI for Oak's semantic search system. Consumes `@oaknational/oak-search-sdk` to provide commands for searching, administration, evaluation, and observability. Ingests Oak Curriculum content via the official SDK, stores enriched documents across **Elasticsearch Serverless indices**, and provides **server-side RRF** (lexical + semantic) search with suggestions, facets, and observability telemetry.

> **All curriculum data flows through `@oaknational/curriculum-sdk`; types and validators are generated via `pnpm sdk-codegen` from the OpenAPI schema.** When the API changes, `pnpm sdk-codegen` regenerates types, and this workspace automatically uses the updated definitions. No manual type definitions exist — everything imports from the generated SDK.

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](../../docs/architecture/architectural-decisions/), then this search-focused set:

- [ADR-063](../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) - Synonyms source-of-truth and deployment flow
- [ADR-074](../../docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md) - Elastic-native-first strategy
- [ADR-076](../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER embedding strategy
- [ADR-138](../../docs/architecture/architectural-decisions/138-shared-search-field-contract-surface.md) - Shared field-inventory and stage-matrix contract surface
- [ADR-048](../../docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md) - Shared parsing helper pattern

## What It Does

The semantic search workspace indexes Oak's entire curriculum into Elasticsearch for users to search using natural language.

### Current Focus: Educator Curriculum Search

| Dimension         | Current Scope                       | Future                     |
| ----------------- | ----------------------------------- | -------------------------- |
| **Content Type**  | Lessons, units, threads, sequences  | Additional content types   |
| **User Persona**  | Professional educators (teachers)   | Pupils, students, learners |
| **Search Intent** | Finding curriculum content to teach | Self-directed learning     |

Example teacher searches:

- "fake emails, scams, social engineering" (finding cyber security lessons)
- "photosynthesis plant nutrition" (finding biology lessons)
- "fractions unlike denominators" (finding maths lessons)
- "algebra progression" (finding curriculum threads)

A future learner-focused search may use different RRF weightings, retrievers, and preprocessing. Ground truths and evaluation currently assume the user is a professional teacher.

The workspace uses **ELSER** (Elastic Learned Sparse EncodeR) to generate semantic embeddings, enabling search by meaning rather than just keywords.

## CLI Commands (`oaksearch`)

| Command Group       | Subcommands                                                                                                                                                                                              | SDK Service            |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `oaksearch search`  | lessons, units, sequences, threads, suggest, facets                                                                                                                                                      | `RetrievalService`     |
| `oaksearch admin`   | setup, reset, status, synonyms, meta, count, versioned-ingest, stage, promote, rollback, validate-aliases, inspect-lease, release-lease, delete-version, list-orphans, cleanup-orphans, verify, download | `AdminService`         |
| `oaksearch eval`    | benchmark (all/lessons/units/threads/sequences), validate, codegen                                                                                                                                       | Pass-through           |
| `oaksearch observe` | telemetry, summary, purge                                                                                                                                                                                | `ObservabilityService` |

See the [CLI Reference section](#cli-reference--bulk-ingestion) below for detailed usage.

Field-integrity tooling:

- Root-level `pnpm test:field-integrity` runs the explicit manifest-based field-integrity suites.
- The field-readback audit must be run from the **repo root** with an explicit ledger path (the default ledger path is repo-root-relative and fails when invoked via `pnpm --filter`): `pnpm tsx apps/oak-search-cli/operations/ingestion/field-readback-audit.ts --ledger .agent/plans/semantic-search/archive/completed/field-gap-ledger.json --target-version <version> --attempts 6 --interval-ms 5000 --emit-json`. See [`INDEXING.md`](docs/INDEXING.md) for full staged-validation guidance.

## SDK Capability Boundary (ADR-134)

`@oaknational/oak-search-sdk` is consumed through explicit capability subpaths:

- non-admin modules (`search`, `observe`, and shared read wiring) import from `@oaknational/oak-search-sdk/read`
- admin modules import from `@oaknational/oak-search-sdk/admin`
- `src/**/*.ts` defaults to non-admin policy; only explicitly privileged subtrees may import admin
  (`src/cli/admin/**`, `src/lib/indexing/**`, `src/adapters/**`)
- `evaluation/**` and `operations/**` are mixed-capability but cannot import SDK root/internal paths
- app code must not import SDK internal/deep paths (`internal/**`, `dist/**`)
- shared index resolver primitives are canonical on SDK `/read`; admin modules consume them via
  SDK `/admin` re-exports (not direct `/read` imports), and never through transitive internal paths

This policy is enforced by lint in `apps/oak-search-cli/eslint.config.ts` and
fixture-backed integration tests in `apps/oak-search-cli/eslint-boundary.integration.test.ts`.

---

## Features and Possibilities

**Hybrid Search with Reciprocal Rank Fusion** — Combines traditional keyword matching (BM25) with semantic search via sparse embeddings (ELSER). Lessons and units use 4-way RRF (BM25 + ELSER on both Content and Structure field groups); threads use 2-way RRF; sequence retrieval is currently lexical-only while `sequence_semantic` remains unpopulated.

**Curriculum-Aware Vocabulary** — Every lesson includes expert-curated keyword definitions, which are used to improve the relevance of the search results.

**Advanced Filtering** — Precision targeting by exam board, tier (Foundation/Higher), year group, and pedagogical metadata (misconceptions, key learning points).

The possibility for data enrichment at ingest time, such as:

- Extracting named entities from the transcript text
- Extracting relationships from the transcript text

## Elastic-Native Philosophy

**This project explores how far we can go using ONLY Elasticsearch Serverless features** — no external AI/ML APIs (Cohere, OpenAI, etc.). We suspect it might be a long way:

- ✅ **Hybrid search** — BM25 lexical + ELSER sparse embeddings (RRF fusion)
- ✅ **Four-way RRF** — Content + Structure field groups with both BM25 and ELSER retrievers
- 🎯 **Advanced relevance** — Elastic Native ReRank (`.rerank-v1-elasticsearch`)
- 🎯 **Knowledge graphs** — ES Graph API for curriculum relationships
- 🎯 **RAG** — Elastic Native LLM (`.gp-llm-v2-chat_completion`) + `semantic_text` chunking
- 🎯 **Graph RAG** — Combine knowledge graph with RAG for contextual search
- 🎯 **Chat-based search** — Conversational interface via Elastic Native LLM
- 🎯 **Entity extraction** — NER models deployed within ES cluster

**Key Principle**: For AI/ML features, we ask: "How far can we go using ONLY Elasticsearch Serverless features?"

And when that isn't possible, we can deploy open source models **within** the ES cluster rather than calling external APIs.

**Benefits**:

- **Data sovereignty** — All processing within our ES cluster
- **Cost efficiency** — No per-token charges, resource-based billing only
- **Lower latency** — No external API roundtrips
- **Simplified architecture** — Fewer dependencies, single platform
- **Graceful degradation** — If inference unavailable, fallback to lexical search

See [ADR-074: Elastic-Native-First Philosophy](../../docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md) for the detailed rationale.

---

## Technical highlights

- **Seven indices**: `oak_lessons`, `oak_unit_rollup`, `oak_units`, `oak_threads`, `oak_sequences`, `oak_sequence_facets`, `oak_meta` with `semantic_text`, completion contexts, highlight offsets, canonical URLs, and lesson-planning data.
- **Server-side RRF**: Lexical + semantic queries fused per scope; optional facets and highlights.
- **Suggestions**: Completion + `search_as_you_type` endpoints with cache tagging tied to `SEARCH_INDEX_VERSION`.
- **Observability**: Structured logging for ingestion batches, zero-hit events, cache version rotation; optional webhook for zero hits.
- **Type safety**: Generated SDK types + shared `parseSchema` helper for requests/responses, no unsafe assertions.
- **Documentation**: Authored guides in `docs/`, generated TypeDoc under `docs/api/`.

---

## Directory overview

```text
apps/oak-search-cli/
├─ bin/oaksearch.ts              # CLI entry point (commander)
├─ src/
│  ├─ cli/                       # CLI subcommand groups
│  │  ├─ shared/                 # SDK factory, read-safe config, validators, output, pass-through
│  │  ├─ search/                 # oaksearch search {lessons|units|sequences|suggest|facets}
│  │  ├─ admin/                  # oaksearch admin {setup|status|synonyms|meta|versioned-ingest|stage|...}
│  │  │  └─ shared/              # Admin-only lifecycle service composition
│  │  ├─ observe/                # oaksearch observe {telemetry|summary|purge}
│  │  └─ eval/                   # oaksearch eval {benchmark|validate|codegen}
│  ├─ lib/hybrid-search/        # RRF query builders, score normalisation, search orchestration
│  ├─ lib/indexing/              # Enriched transforms, batching helpers
│  ├─ lib/elasticsearch/setup/  # Index creation, synonym management
│  ├─ lib/suggestions/          # Suggestion/type-ahead logic
│  ├─ lib/observability/        # Zero-hit telemetry, persistence
│  ├─ lib/env.ts                # Environment validation
│  ├─ lib/logger.ts             # Structured logging
│  ├─ types/                    # Re-exports from SDK search entry point
│  └─ adapters/                 # SDK guards, data source adapters, caching
├─ evaluation/                  # Benchmark infrastructure (455+ files)
│  └─ analysis/create-evaluation-search-sdk.ts  # Shared benchmark SDK+ES lifecycle helper
├─ ground-truths/               # Ground truth data and generation
├─ smoke-tests/                 # Smoke tests (hit live Elasticsearch directly)
├─ e2e-tests/                   # CLI-focused E2E tests
├─ scripts/                     # Utility scripts (download-bulk, diagnostics)
├─ operations/                  # Operational scripts (ingestion, observability)
├─ fixtures/                    # Test fixture data
├─ docs/                        # Authored guides (architecture, setup, indexing, …)
└─ docker-compose.yml           # Redis for SDK response caching
```

Consult `docs/ARCHITECTURE.md` for the full system diagram.

---

## Quick start (summary)

> For detailed instructions see `docs/SETUP.md`.

1. **Install dependencies**

   ```bash
   pnpm install
   ```

2. **Configure environment**

   ```bash
   cp apps/oak-search-cli/.env.example apps/oak-search-cli/.env.local
   ```

   Populate the required variables:

   | Variable                       | Required | Notes                                                                          |
   | ------------------------------ | -------- | ------------------------------------------------------------------------------ |
   | `ELASTICSEARCH_URL`            | ✅       | Elasticsearch Serverless HTTPS endpoint                                        |
   | `ELASTICSEARCH_API_KEY`        | ✅       | API key with manage + search privileges                                        |
   | `OAK_API_KEY`                  | ✅       | Oak Curriculum SDK key                                                         |
   | `SEARCH_API_KEY`               | ✅       | Shared secret that guards admin and observability routes                       |
   | `SEARCH_INDEX_VERSION`         | ✅       | Monotonic cache/version tag (update manually after every ingestion/rollup run) |
   | `ZERO_HIT_WEBHOOK_URL`         | ➖       | Use a webhook endpoint or set to `none` to disable external delivery           |
   | `LOG_LEVEL`                    | ➖       | Structured logging level (`info` by default)                                   |
   | `SEARCH_INDEX_TARGET`          | ➖       | `primary` (default) or `sandbox` for alternate index namespaces                |
   | `ZERO_HIT_PERSISTENCE_ENABLED` | ➖       | `true` to persist zero-hit events to Elasticsearch                             |

   Runtime behaviour:
   - `pnpm es:ingest` (alias for `oaksearch admin versioned-ingest`) reads required values from `process.env`.
   - If `apps/oak-search-cli/.env.local` or `apps/oak-search-cli/.env` exists, it is loaded automatically and overrides existing process values.
   - `pnpm es:ingest -- --help` exits successfully without env validation.

3. **Run the standard quality gates**

   ```bash
   pnpm make   # install → build/code-generation → type-check → doc-gen → lint:fix → subagents:check → portability:check → practice:fitness:informational → markdownlint:root → format:root
   pnpm qg     # format-check:root → markdownlint-check:root → subagents:check → portability:check → test:root-scripts → type-check → lint → unit/int/ui tests → smoke
   ```

4. **Bootstrap Elasticsearch (mappings, synonyms, indices)**

   ```bash
   cd apps/oak-search-cli
   pnpm es:setup
   ```

5. **Ingest content**

   ```bash
   cd apps/oak-search-cli

   # Full lifecycle ingest (blue/green)
   pnpm es:ingest

   # Stage only (no alias promotion)
   pnpm tsx bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads
   ```

6. **Verify search quality**

   ```bash
   pnpm test:smoke    # Smoke tests hit live Elasticsearch directly
   pnpm benchmark     # Run ground truth benchmarks
   ```

## Observability and maintenance

- Monitor structured logs for ingestion retries, zero-hit counts, and cache version rotation.
- Update `SEARCH_INDEX_VERSION` whenever ingestion/rollup runs.
- Keep `scripts/synonyms.json` fresh; rerun `es:setup` after synonym or mapping changes.
- Regenerate TypeDoc after schema updates with `pnpm -C apps/oak-search-cli doc-gen`.

For deeper explanations see:

- `docs/ARCHITECTURE.md`
- `docs/INDEXING.md`
- `docs/QUERYING.md`
- `docs/ROLLUP.md`

Maintain this README alongside code changes to keep onboarding concise and accurate.

## CLI Reference — Bulk Ingestion

The bulk ingestion CLI provides commands for managing Elasticsearch indices and ingesting curriculum data from bulk download files.

### Setup and Reset

```bash
# Reset indices (wipes data, recreates with fresh synonyms)
pnpm es:setup --reset

# Check index status
pnpm es:status
```

### Bulk Ingestion (Lifecycle)

```bash
# Full lifecycle ingest (create + ingest + alias management)
pnpm es:ingest

# Stage only (create + ingest + verify, no promotion)
pnpm tsx bin/oaksearch.ts admin stage --bulk-dir ./bulk-downloads

# Validate alias health before/after ingest
pnpm tsx bin/oaksearch.ts admin validate-aliases
```

Structural alias health (see [docs/INDEXING.md](./docs/INDEXING.md) — `validate-aliases` vs `admin count`) is not the same as data freshness relative to your bulk snapshot.

### Flags

| Flag                             | Description                                                     |
| -------------------------------- | --------------------------------------------------------------- |
| `--bulk-dir <path>`              | Path to bulk download directory (overrides `BULK_DOWNLOAD_DIR`) |
| `--subject-filter <subjects...>` | Restrict ingestion to specific subjects                         |
| `--min-doc-count <count>`        | Minimum expected docs per index during validation               |
| `--verbose`                      | Detailed lifecycle logging                                      |

### Refresh Bulk Data

```bash
# Download fresh bulk data from Oak API
pnpm bulk:download
```

### Bulk Directory Configuration

Set `BULK_DOWNLOAD_DIR` once in `.env.local` for all ingestion/verification commands:

```dotenv
BULK_DOWNLOAD_DIR=./bulk-downloads
```

Resolution precedence is:

1. explicit CLI flag (`--bulk-dir`, or `--bulk-download` for `admin verify`)
2. `BULK_DOWNLOAD_DIR` from env
3. fail fast with actionable error

### Evaluation Commands

```bash
# Run diagnostic queries
pnpm eval:diagnostic

# Run retriever ablation tests
pnpm vitest run --config vitest.smoke.config.ts four-retriever-ablation
```

---

## System Topology

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                         OpenAPI Schema                                  │
│           (packages/sdks/oak-curriculum-sdk/schema-cache/)              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  pnpm sdk-codegen
┌─────────────────────────────────────────────────────────────────────────┐
│                    SDK Type Generation Layer                            │
│    (packages/sdks/oak-curriculum-sdk/code-generation/typegen/search/)          │
│                                                                         │
│  ┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐    │
│  │ generate-search-  │  │ (other search     │  │ (barrel exports)  │    │
│  │ index-docs.ts     │  │  generators)      │  │                   │    │
│  └───────────────────┘  └───────────────────┘  └───────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  13 modules generated
┌─────────────────────────────────────────────────────────────────────────┐
│               Generated Search Schemas (SDK)                            │
│   (packages/sdks/oak-curriculum-sdk/src/types/generated/search/)        │
│                                                                         │
│  facets.ts │ fixtures.ts │ index-documents.ts │ requests.ts │ ...       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼  imported by
┌─────────────────────────────────────────────────────────────────────────┐
│              Search CLI + Evaluation                                     │
│       (apps/oak-search-cli/ → @oaknational/oak-search-sdk)              │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │  Hybrid     │  │  Indexing   │  │  Adapters   │                     │
│  │  Search     │  │  Pipeline   │  │ (Caching)   │                     │
│  └─────────────┘  └─────────────┘  └─────────────┘                     │
│         │                │                │                             │
│         └────────────────┴────────────────┘                             │
│                          │                                              │
│                          ▼                                              │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │             Elasticsearch Serverless                              │  │
│  │                                                                   │  │
│  │  Indexes: oak_lessons, oak_units, oak_unit_rollup,                │  │
│  │    oak_threads, oak_sequences, oak_sequence_facets, oak_meta     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                          │                                              │
│                          ▼ (optional)                                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │               Redis (Docker)                                      │  │
│  │  SDK Response Caching - 14-day TTL                                │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
```
