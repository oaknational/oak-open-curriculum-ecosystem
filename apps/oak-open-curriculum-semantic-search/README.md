# Oak Open Curriculum Semantic Search

A workspace that ingests Oak Curriculum content via the official SDK, stores enriched documents across **Elasticsearch Serverless indices**, and provides **server-side RRF** (lexical + semantic) search with suggestions, facets, and observability telemetry. This workspace is being extracted into a standalone Search SDK + CLI.

> **All curriculum data flows through `@oaknational/oak-curriculum-sdk`; types and validators are generated via `pnpm type-gen` from the OpenAPI schema.** When the API changes, `pnpm type-gen` regenerates types, and this workspace automatically uses the updated definitions. No manual type definitions exist — everything imports from the generated SDK.

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

See [ADR-074: Elastic-Native-First Philosophy](/docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md) for the detailed rationale.

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
apps/oak-open-curriculum-semantic-search/
├─ src/
│  ├─ lib/hybrid-search/        # RRF query builders, score normalisation, search orchestration
│  ├─ lib/indexing/              # Enriched transforms, batching helpers
│  ├─ lib/elasticsearch/setup/  # Index creation, synonym management, CLI
│  ├─ lib/suggestions/          # Suggestion/type-ahead logic
│  ├─ lib/observability/        # Zero-hit telemetry, persistence
│  ├─ lib/env.ts                # Environment validation
│  ├─ lib/logger.ts             # Structured logging
│  ├─ types/                    # Re-exports from SDK search entry point
│  └─ adapters/                 # SDK guards, data source adapters, caching
├─ evaluation/                  # Benchmark infrastructure (455+ files)
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
   cp apps/oak-open-curriculum-semantic-search/.env.example apps/oak-open-curriculum-semantic-search/.env.local
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

3. **Run the standard quality gates**

   ```bash
   pnpm make   # install → type-gen → build → type-check → doc-gen → lint → format
   pnpm qg     # format-check → type-check → lint → markdownlint → unit/int/ui tests → smoke
   ```

4. **Bootstrap Elasticsearch (mappings, synonyms, indices)**

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   pnpm es:setup
   ```

5. **Ingest content**

   ```bash
   cd apps/oak-open-curriculum-semantic-search

   # Ingest specific subject
   pnpm es:ingest-live -- --subject maths --key-stage ks4

   # Ingest all subjects
   pnpm es:ingest-live -- --all
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
- Regenerate TypeDoc after schema updates with `pnpm -C apps/oak-open-curriculum-semantic-search doc-gen`.

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
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --dry-run

# Full ingestion (incremental - skips existing)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads

# Incremental ingestion (skip existing documents - for resuming)
pnpm es:ingest-live --bulk --bulk-dir ./bulk-downloads --incremental
```

### Flags

| Flag                 | Description                                                      |
| -------------------- | ---------------------------------------------------------------- |
| `--bulk`             | Enable bulk mode (reads from files instead of API)               |
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
                                    ▼  pnpm type-gen
┌─────────────────────────────────────────────────────────────────────────┐
│                    SDK Type Generation Layer                            │
│    (packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/)          │
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
│              Semantic Search Workspace                                   │
│       (apps/oak-open-curriculum-semantic-search/)                       │
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
