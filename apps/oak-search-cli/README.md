# Oak Search CLI (`@oaknational/search-cli`)

The operator CLI for Oak's semantic search system. Consumes `@oaknational/oak-search-sdk` to provide commands for searching, administration, evaluation, and observability. Ingests Oak Curriculum content via the official SDK, stores enriched documents across **Elasticsearch Serverless indices**, and provides **server-side RRF** (lexical + semantic) search with suggestions, facets, and observability telemetry.

> **All curriculum data flows through `@oaknational/curriculum-sdk`; types and validators are generated via `pnpm sdk-codegen` from the OpenAPI schema.** When the API changes, `pnpm sdk-codegen` regenerates types, and this workspace automatically uses the updated definitions. No manual type definitions exist — everything imports from the generated SDK.

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](../../docs/architecture/architectural-decisions/), then this search-focused set:

- [ADR-063](../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) - Synonyms source-of-truth and deployment flow
- [ADR-074](../../docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md) - Elastic-native-first strategy
- [ADR-076](../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - ELSER embedding strategy
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

| Command Group       | Subcommands                                                                | SDK Service            |
| ------------------- | -------------------------------------------------------------------------- | ---------------------- |
| `oaksearch search`  | lessons, units, sequences, threads, suggest, facets                        | `RetrievalService`     |
| `oaksearch admin`   | setup, reset, status, synonyms, meta, count, ingest, verify, download, ... | `AdminService`         |
| `oaksearch eval`    | benchmark (all/lessons/units/threads/sequences), validate, codegen         | Pass-through           |
| `oaksearch observe` | telemetry, summary, purge                                                  | `ObservabilityService` |

See the [CLI Reference section](#cli-reference--bulk-ingestion) below for detailed usage.

---

## Features and Possibilities

**Hybrid Search with Reciprocal Rank Fusion** — Combines traditional keyword matching (BM25) with semantic search via sparse embeddings (ELSER). Lessons and units use 4-way RRF (BM25 + ELSER on both Content and Structure field groups); threads and sequences use 2-way RRF.

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
│  │  ├─ shared/                 # SDK factory, resource lifecycle, validators, output, pass-through
│  │  ├─ search/                 # oaksearch search {lessons|units|sequences|suggest|facets}
│  │  ├─ admin/                  # oaksearch admin {setup|status|synonyms|meta|ingest|...}
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
   - `pnpm es:ingest` reads required values from `process.env`.
   - If `apps/oak-search-cli/.env.local` or `apps/oak-search-cli/.env` exists, it is loaded automatically and overrides existing process values.
   - `pnpm es:ingest -- --help` exits successfully without env validation.

3. **Run the standard quality gates**

   ```bash
   pnpm make   # install → build/code-generation → type-check → doc-gen → lint:fix → markdownlint:root → format:root
   pnpm qg     # format-check:root → markdownlint-check:root → type-check → lint → unit/int/ui tests → smoke
   ```

4. **Bootstrap Elasticsearch (mappings, synonyms, indices)**

   ```bash
   cd apps/oak-search-cli
   pnpm es:setup
   ```

5. **Ingest content**

   ```bash
   cd apps/oak-search-cli

   # Ingest specific subject (API mode)
   pnpm es:ingest -- --api --subject maths --key-stage ks4

   # Ingest all subjects (bulk mode is default; use --api for API mode)
   pnpm es:ingest
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

### Bulk Ingestion

```bash
# Preview (dry run)
pnpm es:ingest -- --bulk-dir ./bulk-downloads --dry-run

# Full ingestion (bulk mode is default; incremental - skips existing)
pnpm es:ingest

# Incremental ingestion (skip existing documents - for resuming)
pnpm es:ingest -- --incremental
```

### Flags

| Flag                 | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `--api`              | Use API mode (fetch from Oak API) instead of bulk files          |
| `--bulk-dir <path>`  | Path to bulk download directory (default: `./bulk-downloads`)    |
| `--dry-run`          | Preview operations without executing                             |
| `--incremental`      | Use `create` action (skip existing) instead of default overwrite |
| `--verbose`          | Detailed logging                                                 |
| `--subject <slug>`   | Filter to specific subject(s)                                    |
| `--key-stage <slug>` | Filter to specific key stage(s)                                  |
| `--max-retries <n>`  | Maximum document-level retry attempts (default: 4)               |
| `--retry-delay <ms>` | Base delay for exponential backoff (default: 5000)               |
| `--no-retry`         | Disable document-level retry (fail fast)                         |

### Refresh Bulk Data

```bash
# Download fresh bulk data from Oak API
pnpm bulk:download
```

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
