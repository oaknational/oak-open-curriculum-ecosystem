# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 3 In Progress  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-16

---

## Strategic Goal

Create a production-ready demo proving **Elasticsearch Serverless as the definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

**Success Criteria**:
- MRR > 0.70, NDCG@10 > 0.75
- KS4 filtering proven working
- Impressive stakeholder demo
- Scalable patterns established

---

## Quick Start

1. **Read foundation documents first** (mandatory):
   - `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
   - `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

2. **Source of truth** (for all types and available data):
   - `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - **The OpenAPI schema**
   - `.agent/plans/external/upstream-api-metadata-wishlist.md` - Fields to request from upstream API

3. **Requirements & context** (strategic goals, risks, costs, demos):
   - `.agent/plans/semantic-search/requirements.md` - **Read this for business context**

4. **Navigation hub**: `.agent/plans/semantic-search/README.md`

5. **Detailed plan**: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`

---

## Current State Summary

### Phase 3 Progress

| Part | Name | Status | Notes |
| ---- | ---- | ------ | ----- |
| 3.0 | Verification | ✅ Complete | Hybrid superiority proven, scope filtering works |
| 3a | Feature Parity | ✅ Complete | KS4 metadata indexed, unit enrichment fields added |
| 3b | Semantic Summaries | ⚠️ Needs Rework | Field naming incorrect, needs four-retriever refactor |
| 3c | Four-Retriever Architecture | 🔲 Not Started | Implement consistent content/structure nomenclature |

### ⚠️ Critical Gap Identified

**KS4 filtering is NOT wired through the API layer**. While KS4 metadata is indexed:

- `SearchStructuredRequestSchema` lacks `tier`, `examBoard`, `examSubject`, `ks4Option` fields
- `createLessonFilters()` / `createUnitFilters()` don't apply these filters
- Smoke tests pass `tier` in request body but it's silently ignored

**This must be fixed before KS4 filtering can work.**

### Completed Work

| Item | Status |
| ---- | ------ |
| Two-way hybrid code written (BM25 + ELSER RRF) | ✅ Complete |
| Lesson search: MRR 0.908, 40 ground truth queries | ✅ Complete |
| Unit search: MRR 0.915, 43 ground truth queries | ✅ Complete |
| Dense vector code removed (ADR-075) | ✅ Complete |
| All quality gates passing | ✅ Complete |
| BM25 vs ELSER vs Hybrid experiment | ✅ Complete |
| Part 3.0 verification (scope, doc_type, filters) | ✅ Complete |
| Redis cache TTL 14 days + jitter (ADR-079) | ✅ Complete |
| Part 3a: Feature Parity fields | ✅ Complete |
| Part 3a: KS4 Metadata Denormalisation | ✅ Complete |
| Semantic summary generator templates | ✅ Complete |

---

## Architecture Notes

### ⚠️ Next.js App is Deprecated

The `app/` folder contains a Next.js frontend that is **not used in production**. All actual search functionality lives in:

- `src/` - Core implementation (indexing, search, transforms)
- `scripts/` - CLI tools for ingestion and maintenance

**Phase 4 will delete the Next.js app** and create a proper SDK + CLI.

**MCP tool creation** is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/` (Phase 4 prepares the SDK surface the MCP tool will consume).

### Four-Retriever Design

Each entity (lesson, unit) uses four retrievers combined via RRF:

1. **BM25 on Content** - Lexical matching on teaching material
2. **ELSER on Content** - Semantic matching on teaching material
3. **BM25 on Structure** - Lexical matching on metadata/summaries
4. **ELSER on Structure** - Semantic matching on metadata/summaries

**Design rationale**: Content fields contain the actual teaching material (transcripts, lesson snippets). Structure fields contain curated metadata about what the content covers (learning objectives, curriculum alignment, pedagogical context). Both perspectives are valuable for different query types:
- Content retrievers: "Find lessons that discuss/teach X"
- Structure retrievers: "Find lessons about topic Y"

**No reranker required initially** - RRF with four complementary retrievers provides good coverage. Add reranking later if needed.

**See**: [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) for KS4 filtering architecture with Mermaid diagrams.

### ES Serverless Features ($0 additional cost)

| Feature | Endpoint | Purpose | Status |
| ------- | -------- | ------- | ------ |
| BM25 | Built-in | Lexical search | ✅ Used |
| ELSER | `.elser-2-elasticsearch` | Sparse semantic | ✅ Used |
| E5 | `.multilingual-e5-small-elasticsearch` | Dense vectors | ❌ Not used |
| ReRank | `.rerank-v1-elasticsearch` | Cross-encoder reranker | 📋 Planned |
| LLM | `.gp-llm-v2-chat_completion` | Future RAG / summaries | 📋 Planned |

All AI/ML features are included in the ES Serverless subscription at no additional cost.

### Key ADRs

| ADR | Title | Relevance |
| --- | ----- | --------- |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation | **Tier/examBoard filtering architecture** |
| [ADR-075](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense Vector Removal | Why we use ELSER only |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-Only Strategy | Sparse vectors are sufficient |
| [ADR-077](../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) | Semantic Summary Generation | Summary template design |
| [ADR-079](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) | SDK Cache TTL Jitter | Cache stampede prevention |

---

## Fresh Chat First Steps (MANDATORY)

**Significant code changes have occurred** since the last semantic search session. Before any feature work:

### 1. Run Quality Gates (from repo root)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass before proceeding.** Resolve any issues gate-by-gate.

### 2. Re-Index Fresh Data (MANDATORY)

**⚠️ Never run search quality smoke tests against stale indices.** The indices may contain data from a previous session with different schema, transforms, or field mappings. Results are meaningless without fresh data.

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup                                           # Ensure mappings are current
pnpm es:ingest-live -- --subject maths --keystage ks4   # ~5-10 minutes
pnpm es:status                                          # Verify document counts
```

**Expected counts**: ~314 lessons, ~36 units for Maths KS4.

### 3. Understand Smoke Test Architecture

There are **two categories** of smoke tests:

| Category | Examples | Requirements |
| -------- | -------- | ------------ |
| **API-based** | `scope-verification`, `search-quality`, `unit-search-*`, `ks4-filtering` | Next.js dev server + fresh ES |
| **Direct ES** | `hybrid-superiority` | ES credentials in `.env.local` |

**API-based tests**: Hit `/api/search` endpoint → full stack validation.
**Direct ES tests**: Talk to Elasticsearch directly → raw query validation.

Both require **fresh indices** to produce meaningful results. Never skip re-indexing.

### 4. Run Smoke Tests

```bash
# Direct ES tests (no server needed)
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# API-based tests (need pnpm dev in another terminal)
pnpm vitest run -c vitest.smoke.config.ts scope-verification
pnpm vitest run -c vitest.smoke.config.ts search-quality
pnpm vitest run -c vitest.smoke.config.ts unit-search
pnpm vitest run -c vitest.smoke.config.ts ks4-filtering
```

---

## Current Metrics

### Lesson Search (314 Maths KS4 lessons)

| Metric | Result | Target | Status |
| ------ | ------ | ------ | ------ |
| MRR | **0.908** | > 0.70 | ✅ PASS |
| NDCG@10 | 0.725 | > 0.75 | ⚠️ Below |
| Zero-hit rate | **0.0%** | < 10% | ✅ PASS |
| p95 Latency | 367ms | < 300ms | ⚠️ Above |

### Unit Search (36 Maths KS4 units)

| Metric | Result | Target | Status |
| ------ | ------ | ------ | ------ |
| MRR | **0.915** | > 0.60 | ✅ PASS |
| NDCG@10 | **0.924** | > 0.65 | ✅ PASS |
| Zero-hit rate | **0.0%** | < 15% | ✅ PASS |
| p95 Latency | **196ms** | < 300ms | ✅ PASS |

---

## Index Status

**Last indexed**: 2025-12-15 (Maths KS4)

| Index | Count | Hybrid Search | Status |
| ----- | ----- | ------------- | ------ |
| `oak_lessons` | 314 | BM25 + ELSER | ✅ Verified |
| `oak_unit_rollup` | 36 | BM25 + ELSER | ✅ Verified |
| `oak_units` | 36 | BM25 only | ✅ Verified |
| `oak_threads` | 201 | BM25 + ELSER | ❌ Untested |
| `oak_sequences` | 2 | BM25 + ELSER | ❌ Untested |

All 36 Maths KS4 units have their lessons indexed. Redis cache refreshed with 14-day TTLs (8,109 entries).

**Note**: Hybrid superiority experiment completed. For lessons, hybrid is superior. For units, results are mixed (ELSER slightly better MRR, hybrid better NDCG@10).

---

## Elasticsearch Documentation

| Topic | URL |
| ----- | --- |
| **Hybrid Search (RRF)** | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html |
| **Semantic Search** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html |
| **ELSER** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html |
| **Semantic Reranking** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html |
| **Retriever API** | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html |

---

## Key File Locations

### Implementation (Core)

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/indexing/           # Document transforms, KS4 context builder
│   ├── ks4-context-builder.ts  # Sequence traversal, UnitContextMap
│   ├── ks4-context-types.ts    # KS4 type definitions
│   ├── document-transforms.ts  # createLessonDocument(), createUnitDocument()
│   └── document-transform-helpers.ts  # extractKs4DocumentFields()
├── src/lib/hybrid-search/      # RRF query builders
│   ├── rrf-query-builders.ts   # Two-way (BM25 + ELSER)
│   ├── rrf-query-helpers.ts    # Filter creation
│   ├── lessons.ts              # Lesson search
│   └── units.ts                # Unit search
├── src/lib/search-quality/     # Ground truth, metrics
│   ├── ground-truth/           # Lesson + unit ground truth
│   │   ├── units/              # 43 unit queries
│   │   └── ...                 # 40 lesson queries
│   └── metrics.ts              # MRR, NDCG calculations
└── scripts/                    # CLI tools for ingestion
```

### Schema & Types

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/field-definitions/  # Index field definitions (schema source)
│   └── curriculum.ts           # LESSONS_INDEX_FIELDS, UNITS_INDEX_FIELDS, etc.
└── src/types/generated/
    ├── api-schema/             # OpenAPI types (source of truth)
    │   └── api-schema-sdk.json # **THE OpenAPI schema**
    └── search/
        └── requests.ts         # SearchStructuredRequestSchema (needs tier/examBoard)
```

### Tests

```text
apps/oak-open-curriculum-semantic-search/
├── smoke-tests/                # Search quality benchmarks
│   ├── ks4-filtering.smoke.test.ts       # KS4 filtering verification
│   ├── search-quality.smoke.test.ts      # Lesson MRR/NDCG
│   ├── unit-search-quality.smoke.test.ts # Unit MRR/NDCG
│   ├── scope-verification.smoke.test.ts  # Scope filtering
│   └── hybrid-superiority.smoke.test.ts  # Direct ES tests
└── src/**/*.unit.test.ts       # Unit tests alongside implementation
```

### SDK Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts         # Subject name variations
├── key-stages.ts       # Key stage aliases
├── numbers.ts          # Numbers + maths terms
└── index.ts            # Barrel file
```

---

## Environment

Required in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

**Rate Limit**: Oak API upgraded to **10,000 requests/hour** (from 1,000). This makes full curriculum ingestion feasible.

---

## Phase Structure

### Completed

| Phase | Name | Status | Description |
| ----- | ---- | ------ | ----------- |
| 1 | Foundation | ✅ Complete | Lexical baseline, ELSER fix |
| 2 | Dense Vectors | ✅ Complete | E5 evaluated, no benefit |

### Current

| Phase | Name | Status | Description |
| ----- | ---- | ------ | ----------- |
| **3** | **Multi-Index & Fields** | 🔄 In Progress | Four-retriever architecture, KS4 filtering |

### Future

| Phase | Name | Status | Effort |
| ----- | ---- | ------ | ------ |
| 4 | Search SDK + CLI | 📋 Planned | 3-6 days |
| 5 | Search UI | 📋 Planned | 3-4 days |
| 6 | Cloud Functions | 📋 Planned | 2-3 days |
| 7 | Admin Dashboard | 📋 Planned | 2-3 days |
| 8 | Query Enhancement | 📋 Planned | 1-2 days |
| 9 | Entity Extraction | 📋 Future | 3-4 days |
| 10 | Reference Indices | 📋 Future | 2-3 days |
| 11+ | AI Integration | 📋 Future | 15-20d |

**Phase documents**: `.agent/plans/semantic-search/phase-{N}-*.md`

---

## Remember

1. **TDD is mandatory** - Write tests FIRST at ALL levels (RED → GREEN → REFACTOR)
2. **Schema-first** - All types flow from field definitions via `pnpm type-gen`
3. **No type shortcuts** - No `as`, `any`, `!`, `Record<string, unknown>`
4. **No skipped tests** - Fix it or delete it
5. **Fail fast** - Clear error messages, no silent failures
6. **Delete dead code** - If unused, delete it
7. **All quality gates must pass** - No exceptions, no workarounds
8. **Re-index before smoke tests** - Stale data = meaningless results

---

**Ready?** Start with Phase 3: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
