# Semantic Search - Navigation Hub

**Status**: Phase 3 In Progress  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-16

---

## Quick Start

For new implementation sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
   - `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

2. **Source of Truth** (for all types and available data)
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - **The OpenAPI schema**
   - `.agent/plans/external/upstream-api-metadata-wishlist.md` - Fields to request from upstream API

3. **Requirements & Context** - [requirements.md](requirements.md)
   - Strategic goals and business success criteria
   - Risk mitigation strategies
   - Cost model ($0/month for AI/ML features - all included in ES Serverless)
   - Demo scenarios for validation

4. **Entry Point** - [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
   - Current state summary
   - Phase status and next steps
   - Quick reference for commands and file locations

---

## Entry Points

| Document | Purpose |
| -------- | ------- |
| [**Prompt**](../../prompts/semantic-search/semantic-search.prompt.md) | Fresh chat entry point - start here for new sessions |
| [**Requirements**](requirements.md) | Business context, success criteria, demo scenarios |
| [**Phase 3 Plan**](phase-3-multi-index-and-fields.md) | Current work - detailed execution plan |

---

## Elasticsearch Documentation

| Topic | URL |
| ----- | --- |
| **Hybrid Search (RRF)** | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html |
| **Semantic Search Overview** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html |
| **ELSER (Sparse Vectors)** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html |
| **Semantic Reranking** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html |
| **Retriever API** | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html |
| **Multi-index Search** | https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html |

---

## Phase Overview

### Completed Phases

| Phase | Name | Status | Key Outcomes |
| ----- | ---- | ------ | ------------ |
| 1 | Foundation | ✅ Complete | Lexical baseline, ELSER fix, MRR 0.900 for lessons |
| 2 | Dense Vectors | ✅ Complete | E5 evaluated - no benefit, two-way hybrid confirmed |

### Current Phase

| Phase | Name | Status | Progress | Description |
| ----- | ---- | ------ | -------- | ----------- |
| **3** | **Multi-Index & Fields** | 🔄 In Progress | 7/13 | Four-retriever architecture, KS4 filtering |

**Phase 3 Goal**: Implement four-retriever hybrid search with comprehensive filtering.

**⚠️ CRITICAL**: Always re-index fresh before running smoke tests. Validating stale indices is meaningless.

**Part 3.0 - Verification ✅ COMPLETE:**

- ✅ BM25 vs ELSER vs Hybrid experiment (hybrid superior for lessons)
- ✅ Prove lesson-only search works
- ✅ Prove unit-only search works
- ✅ Prove joint search with `doc_type` categorisation works
- ✅ Prove lesson search filtered by unit works
- ✅ `doc_type` field already exists in indexes
- 🔲 ADR: unified vs separate endpoints (deferred)
- 🔲 Unit reranking experiment (deferred)

**Part 3a - Feature Parity ✅ IMPLEMENTED:**

- ✅ OWA aliases import
- ✅ `pupilLessonOutcome` field
- ✅ Display title fields
- ✅ Unit enrichment fields
- ✅ **KS4 Metadata Denormalisation** - sequence traversal, UnitContextMap, array fields
- ⚠️ **Gap**: KS4 filtering not wired through API layer yet

**Part 3b - Semantic Summary Templates ⚠️ NEEDS REWORK:**

- ✅ Remove dense vector code (ADR-075) - **Completed 2025-12-15**
- ✅ Lesson semantic summary template exists (needs update for ALL fields)
- ✅ Unit semantic summary template exists (needs update for ALL fields)
- ⚠️ **ISSUE**: `unit_semantic` was incorrectly replaced with summary instead of adding new field
- 🔲 Redis caching for summaries (deferred)

**Part 3c - Four-Retriever Architecture 🔲 NEW:**

- 🔲 Rename fields to consistent nomenclature (`<entity>_content|structure[_semantic]`)
- 🔲 Add `lesson_structure` field (BM25 text for lessons)
- 🔲 Add `unit_structure` field (BM25 text for units)
- 🔲 Restore `unit_content_semantic` to rollup content
- 🔲 Add `unit_structure_semantic` field
- 🔲 Update summary templates to include ALL API fields
- 🔲 Update query builders to use four retrievers
- 🔲 **Wire KS4 filtering through API** (`SearchStructuredRequestSchema`, filter functions)
- 🔲 **CRITICAL: Prove KS4 filtering works after re-indexing**

**Note**: MCP tool creation is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/`.

See [phase-3-multi-index-and-fields.md](phase-3-multi-index-and-fields.md) for full details.

### Future Phases

#### Part 2: Enhancements (Phases 4-10)

| Phase | Name | Status | Effort | Description |
| ----- | ---- | ------ | ------ | ----------- |
| 4 | Search SDK + CLI | 📋 Planned | 3-6 days | Extract SDK + first-class local CLI; retire Next.js runtime |
| 5 | Search UI | 📋 Planned | 3-4 days | Reference UX patterns (future UI lives in a different app) |
| 6 | Cloud Functions | 📋 Planned | 2-3 days | (Future) HTTP ingestion endpoints (not required for SDK-first) |
| 7 | Admin Dashboard | 📋 Planned | 2-3 days | (Future) UI for ingestion control/metrics (not required now) |
| 8 | Query Enhancement | 📋 Planned | 1-2 days | Production patterns, OWA compatibility |
| 9 | Entity Extraction | 📋 Future | 3-4 days | NER, concept graphs |
| 10 | Reference Indices | 📋 Future | 2-3 days | Subject/keystage metadata, threads |

#### Part 3: AI Integration (Phase 11+)

| Phase | Name | Status | Effort | Description |
| ----- | ---- | ------ | ------ | ----------- |
| 11+ | Future | 📋 Future | 15-20 days | RAG, Knowledge Graph, LTR |

---

## Current Metrics

### Lesson Search (314 Maths KS4 lessons)

| Metric | Result | Target | Status |
| ------ | ------ | ------ | ------ |
| MRR | **0.908** | > 0.70 | ✅ PASS |
| NDCG@10 | 0.725 | > 0.75 | ⚠️ Below |
| Zero-hit rate | **0.0%** | < 10% | ✅ PASS |
| p95 Latency | **367ms** | < 300ms | ⚠️ Above |

### Unit Search (36 Maths KS4 units)

| Metric | Result | Target | Status |
| ------ | ------ | ------ | ------ |
| MRR | **0.915** | > 0.60 | ✅ PASS |
| NDCG@10 | **0.924** | > 0.65 | ✅ PASS |
| Zero-hit rate | **0.0%** | < 15% | ✅ PASS |
| p95 Latency | **196ms** | < 300ms | ✅ PASS |

---

## Key Findings (Phase 1, 2 & 3)

### Phase 1 & 2

1. **Two-way hybrid is baseline** - BM25 + ELSER provides good balance of precision and recall
2. **E5 dense vectors provide no benefit** - For this dataset, sparse vectors (ELSER) are sufficient
3. **Reranker field matters critically** - Full transcripts cause 20+ second latencies; short titles lack semantic signal
4. **ELSER was not operational for lessons** - Fixed by adding `lesson_semantic: transcript` to document transform
5. **Dense vector code removed** - Completed 2025-12-15 per ADR-075

### Phase 3 Architectural Decisions

6. **Four-retriever architecture** - Content + Structure fields with both BM25 and ELSER provide comprehensive matching:
   - Content retrievers serve "find lessons that discuss/teach X" queries
   - Structure retrievers serve "find lessons about topic Y" queries
7. **No reranker required initially** - RRF with four complementary retrievers is sufficient; add reranking later if needed
8. **Consistent nomenclature** - `<entity>_content|structure[_semantic]` pattern for clarity
9. **Comprehensive summaries** - Include ALL API fields in structural summaries; users search from unknown perspectives
10. **KS4 metadata denormalisation** - Traverse sequences to build unit → tier/examBoard/examSubject mapping

See ES RRF documentation: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>

---

## Architecture

### Key Design Decision

**Four-retriever hybrid search** using BM25 + ELSER on both content and structure fields:

| Retriever | Field Type | Purpose |
| --------- | ---------- | ------- |
| BM25 on Content | Transcript/rollup text | Lexical matching on teaching material |
| ELSER on Content | Transcript/rollup text | Semantic matching on teaching material |
| BM25 on Structure | Curated summary | Lexical matching on metadata |
| ELSER on Structure | Curated summary | Semantic matching on metadata |

### Field Nomenclature

Consistent pattern: `<entity>_content|structure[_semantic]`

#### Lesson Fields

| Field | Type | Content | Purpose |
| ----- | ---- | ------- | ------- |
| `lesson_content` | text | Full transcript (~5000 tokens) | BM25 lexical |
| `lesson_content_semantic` | semantic_text | Full transcript | ELSER semantic |
| `lesson_structure` | text | Curated summary (~200 tokens) | BM25 lexical |
| `lesson_structure_semantic` | semantic_text | Curated summary | ELSER semantic |

#### Unit Fields (Rollup)

| Field | Type | Content | Purpose |
| ----- | ---- | ------- | ------- |
| `unit_content` | text | Aggregated lesson snippets (~200-400 tokens) | BM25 lexical |
| `unit_content_semantic` | semantic_text | Aggregated lesson snippets | ELSER semantic |
| `unit_structure` | text | Curated summary (~200 tokens) | BM25 lexical |
| `unit_structure_semantic` | semantic_text | Curated summary | ELSER semantic |

### ES Serverless Features Used

| Feature | ES Endpoint | Cost | Purpose | Status |
| ------- | ----------- | ---- | ------- | ------ |
| BM25 | Built-in | $0 | Lexical search | ✅ Used |
| ELSER | `.elser-2-elasticsearch` | $0 | Sparse semantic embeddings | ✅ Used |
| E5 Dense | `.multilingual-e5-small-elasticsearch` | $0 | Dense vectors | ❌ Not used |
| ReRank | `.rerank-v1-elasticsearch` | $0 | Cross-encoder reranking | 📋 Planned |
| LLM | `.gp-llm-v2-chat_completion` | $0 | Future RAG / semantic summaries | 📋 Planned |

All AI/ML features are included in the ES Serverless subscription at no additional cost.

**Note**: E5 dense vectors were evaluated in Phase 2 and provided no benefit. Code removed 2025-12-15 (ADR-075).

### Key ADRs

| ADR | Title | Purpose |
| --- | ----- | ------- |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation | **Tier/examBoard filtering architecture** (with Mermaid diagrams) |
| [ADR-075](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense Vector Removal | Why E5 was removed |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Strategy | Sparse vectors sufficient |
| [ADR-077](../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) | Semantic Summary Generation | Summary template design |
| [ADR-079](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) | SDK Cache TTL Jitter | Cache stampede prevention |

---

## Implementation Note

### ⚠️ Next.js App is Deprecated

The `app/` folder in `apps/oak-open-curriculum-semantic-search/` contains a Next.js frontend that is **not used**. All actual search functionality lives in:

| Directory | Purpose |
| --------- | ------- |
| `src/` | Core implementation (indexing, search, transforms) |
| `scripts/` | CLI tools for ingestion and maintenance |
| `smoke-tests/` | Search quality verification |

**Phase 4** will delete the Next.js app and create a proper SDK + CLI.

---

## Smoke Test Architecture

**⚠️ CRITICAL**: Always re-index before running smoke tests. Stale indices invalidate all metrics.

### Test Categories

| Category | Tests | Requirements | Purpose |
| -------- | ----- | ------------ | ------- |
| **API-based** | `scope-verification`, `search-quality`, `unit-search-*`, `ks4-filtering` | Next.js dev server + fresh ES | Full stack validation |
| **Direct ES** | `hybrid-superiority` | ES credentials (`.env.local`) | Raw Elasticsearch query testing |

### Required Sequence

1. **Re-index fresh** (always, no exceptions)
2. **Run Direct ES tests** (no server needed)
3. **Start dev server** (for API-based tests)
4. **Run API-based tests**
5. **Run KS4 filtering tests** (CRITICAL for Phase 3 completion)

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Fresh re-index (~5-10 min)
pnpm es:setup && pnpm es:ingest-live -- --subject maths --keystage ks4

# 2. Direct ES tests
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# 3. Start server (in separate terminal)
pnpm dev

# 4. API-based tests
pnpm vitest run -c vitest.smoke.config.ts scope-verification

# 5. KS4 filtering tests (CRITICAL - must pass to complete Phase 3)
pnpm vitest run -c vitest.smoke.config.ts ks4-filtering
```

### KS4 Filtering Verification (CRITICAL)

**Must prove KS4 filtering works** before declaring Phase 3 complete.

Test queries to verify:
- Filter by `tier` (foundation, higher)
- Filter by `examBoard` (aqa, edexcel, ocr)
- Filter by `examSubject` (gcse-biology, gcse-chemistry, gcse-physics)
- Filter by `ks4Option` (programme pathways)

**File**: `apps/oak-open-curriculum-semantic-search/smoke-tests/ks4-filtering.smoke.test.ts`

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all packages
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting issues
pnpm format:root       # Format code
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built app
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**All gates must pass. No exceptions.**

---

## Key File Locations

### Search Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/            # RRF query builders
├── src/lib/search-quality/           # Ground truth, metrics
├── src/lib/indexing/                 # Document transforms
├── smoke-tests/                      # Search quality benchmarks
└── docs/                             # INGESTION-GUIDE, SYNONYMS, etc.
```

### SDK & Field Definitions

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/field-definitions/  # Index schemas (schema-first)
├── src/mcp/synonyms/                 # Subject, key stage, number synonyms
└── src/types/generated/api-schema/   # OpenAPI types (source of truth)
```

---

## Document Structure

```text
.agent/plans/semantic-search/
├── README.md                           # This file - navigation hub
├── requirements.md                     # Strategic context, risks, costs, demos
│
├── phase-3-multi-index-and-fields.md   # 🔄 Current - unit search, doc_type, aliases
├── phase-4-search-sdk-and-cli.md       # 📋 Planned - extract SDK + first-class CLI
├── phase-5-search-ui.md                # 📋 Planned - reference UX patterns (future app)
├── phase-6-cloud-functions.md          # 📋 Planned - (future) HTTP ingestion endpoints
├── phase-7-admin-dashboard.md          # 📋 Planned - (future) ingestion control UI
├── phase-8-query-enhancement.md        # 📋 Planned - query patterns, OWA compatibility
├── phase-9-entity-extraction.md        # 📋 Future - NER, concept graphs
├── phase-10-reference-indices.md       # 📋 Future - reference data, threads
├── phase-11-plus-future.md             # 📋 Future - RAG, KG, LTR, resource types
│
├── reference-docs/                     # Reference documentation
│   ├── reference-data-completeness-policy.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-ir-metrics-guide.md
│
└── archive/                            # Completed and superseded documents
    ├── phase-1-foundation-COMPLETE.md
    ├── phase-2-dense-vectors-COMPLETE.md
    └── ...
```

---

## Development Rules (From Foundation Docs)

### TDD is Mandatory at All Levels

1. **RED** - Write test first, run it, prove it fails
2. **GREEN** - Write minimal implementation to pass
3. **REFACTOR** - Improve implementation, tests stay green

This applies to unit tests, integration tests, AND E2E tests.

### Schema-First

All types flow from the OpenAPI schema via `pnpm type-gen`. Never hand-author types.

### No Type Shortcuts

Never use `as`, `any`, `!`, `Record<string, unknown>`. Preserve type information.

### All Quality Gates Must Pass

No exceptions. No `--no-verify`. Fix issues, don't disable checks.

### Delete Dead Code

If code is unused, delete it. No commented-out code. No skipped tests.

---

## Rate Limit

**Oak API rate limit**: **10,000 requests/hour** (upgraded from 1,000)

This makes full curriculum ingestion feasible in reasonable time.

---

## Document Index

### Plans

| Document | Description |
| -------- | ----------- |
| [Phase 3](phase-3-multi-index-and-fields.md) | Current work - four-retriever architecture |
| [Phase 4 (planned)](phase-4-search-sdk-and-cli.md) | SDK + CLI extraction |
| [Requirements](requirements.md) | Business context, success criteria |

### Reference

| Document | Description |
| -------- | ----------- |
| [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) | Fields to request from Oak API |
| [Feature Parity Analysis](../research/feature-parity-analysis.md) | Gap analysis with OWA |

### Archive

| Document | Description |
| -------- | ----------- |
| [Phase 1 (complete)](archive/phase-1-foundation-COMPLETE.md) | Lexical baseline |
| [Phase 2 (complete)](archive/phase-2-dense-vectors-COMPLETE.md) | Dense vector evaluation |

---

**Ready to start?** Read [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md)
