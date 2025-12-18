# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 3d ✅ Complete (incl. tier fix) | Phase 3e 📋 Next (ES Native Enhancements)  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-18 (tier metadata fix)

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
| 3b | Semantic Summaries | ✅ Complete | Enhanced templates with all API fields |
| 3c | Four-Retriever + API Wiring | ✅ Complete | Code implemented, quality gates pass |
| 3d | Live Validation | ✅ Complete | All metrics improved, tier metadata fixed (2025-12-18) |
| 3e | ES Native Enhancements | 📋 Planned | Fuzzy, stemming, phonetic, typeahead (see below) |

### ✅ Phase 3 Validation Results (2025-12-18)

| Scope   | Metric   | Baseline | Four-Retriever | Change   |
| ------- | -------- | -------- | -------------- | -------- |
| Lessons | MRR      | 0.908    | **0.931**      | **+2.5%** |
| Lessons | NDCG@10  | 0.725    | **0.749**      | **+3.3%** |
| Units   | MRR      | 0.915    | **1.000**      | **+9.3%** |
| Units   | NDCG@10  | 0.924    | **0.981**      | **+6.2%** |

### ⚠️ Critical Insight: Hard Query Performance (Ablation Study)

The four-retriever ablation study revealed a critical finding:

| Query Type | Best Performer | MRR | Notes |
| ---------- | -------------- | --- | ----- |
| Standard (topic names) | Four-way Hybrid | 0.931 | Hybrid wins as expected |
| **Hard (naturalistic/typos)** | **ELSER alone** | **0.287** | Hybrid only 0.250 |

**Insight**: On hard queries (misspellings like "simulatneous", naturalistic phrasing like "that sohcahtoa stuff"), single ELSER retrievers **outperform** the four-way hybrid. BM25 may be adding noise rather than signal.

**Phase 3e addresses this** with ES native enhancements to improve BM25's contribution.

### 📋 Phase 3e: ES Native Enhancements (NEXT)

Goal: Improve hard query MRR from 0.250 → ≥0.300 (+20%)

| Task | Description | Reindex? |
| ---- | ----------- | -------- |
| 3e.1 | Enhanced fuzzy (`AUTO:3,6`, `prefix_length: 1`) | No |
| 3e.2 | Phrase prefix boost | No |
| 3e.3 | Stemming + stop words | **Yes** |
| 3e.4 | Phonetic matching (`double_metaphone`) | **Yes** |
| 3e.5 | `search_as_you_type` fields | **Yes** |
| 3e.6 | `minimum_should_match` tuning | No |

**Detailed plan**: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` (Phase 3e section)

### Synonym Enrichment (Completed 2025-12-18)

Enriched SDK synonyms from OWA and OALA reference repositories:
- Added common abbreviations (bio, chem, phys, hist, geog, sci)
- Added EYFS and KS5 key stages with aliases (gcse, a-level, sixth form)
- Added year format variations (y1, yr1, year1, year 1)
- Added exam board full names
- Context budget increased to 30KB

**Plan**: `.agent/plans/sdk-and-mcp-enhancements/17-synonym-enrichment-from-owa-oala.md`

### ✅ KS4 Filtering (Fully Working)

All layers wired and **tier metadata fix applied (2025-12-18)**:

- `SearchStructuredRequestSchema` has `tier`, `examBoard`, `examSubject`, `ks4Option`, `year`, `threadSlug`, `category`
- `buildStructuredQuery()` extracts all filter fields
- `createLessonFilters()` / `createUnitFilters()` apply filters via `addMetadataFilters()`
- **Tier metadata now populates correctly**: 251 Foundation lessons, 314 Higher lessons
- Filtering by `tier: "foundation"` or `tier: "higher"` returns correct results

**Root cause fixed**: The `isKs4Sequence()` check was skipping `maths-secondary` (no exam board in slug, no ks4Options). But tier data exists in Year 10/11 entries. Fix: Process ALL sequences—see [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md).

### Completed Work

| Item | Status |
| ---- | ------ |
| Two-way hybrid code written (BM25 + ELSER RRF) | ✅ Complete |
| Lesson search: MRR 0.908, 40 ground truth queries | ✅ Complete (pre-4-retriever) |
| Unit search: MRR 0.915, 43 ground truth queries | ✅ Complete (pre-4-retriever) |
| Dense vector code removed (ADR-075) | ✅ Complete |
| All quality gates passing | ✅ Complete |
| BM25 vs ELSER vs Hybrid experiment | ✅ Complete |
| Part 3.0 verification (scope, doc_type, filters) | ✅ Complete |
| Redis cache TTL 14 days + jitter (ADR-079) | ✅ Complete |
| Part 3a: Feature Parity fields | ✅ Complete |
| Part 3a: KS4 Metadata Denormalisation | ✅ Complete |
| Part 3b: Enhanced semantic summaries (all API fields) | ✅ Complete |
| Part 3c: Four-retriever architecture | ✅ Complete |
| Part 3c: Field nomenclature standardisation | ✅ Complete |
| Part 3c: KS4 filter wiring through API | ✅ Complete |
| **Part 3d: Tier metadata bug fix** | ✅ Complete (2025-12-18) |

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

## What's Proven (2025-12-18)

### ✅ Proven (Code Quality)

| Claim | Evidence |
| ----- | -------- |
| Code compiles | `pnpm type-check` passes |
| Unit tests pass | `pnpm test` passes |
| All quality gates pass | `pnpm check:turbo` exits 0 |

### ✅ Proven (Search Quality)

| Claim | Evidence | Result |
| ----- | -------- | ------ |
| Four-retriever improves search | Hybrid MRR 0.931 > BM25 0.892 > ELSER 0.831 | ✅ Proven |
| KS4 filter wiring complete | End-to-end API connected | ✅ Proven |
| **Tier filtering works** | 251 Foundation, 314 Higher lessons indexed | ✅ Proven (fixed 2025-12-18) |
| MRR improved | Lessons 0.931 (+2.5%), Units 1.000 (+9.3%) | ✅ Proven |
| NDCG@10 improved | Lessons 0.749 (+3.3%), Units 0.981 (+6.2%) | ✅ Proven |

### Current Metrics (Four-Retriever, 2025-12-18)

| Scope | MRR | NDCG@10 | Zero-hit | p95 Latency |
| ----- | --- | ------- | -------- | ----------- |
| Lessons (314) | **0.931** | **0.749** | 0.0% | 438ms |
| Units (36) | **1.000** | **0.981** | 0.0% | 314ms |

---

## Index Status

**⚠️ MAY BE STALE**: Last indexed 2025-12-18. Re-index before smoke tests.

| Index | Expected Count | Notes |
| ----- | -------------- | ----- |
| `oak_lessons` | 314 | Maths KS4 |
| `oak_unit_rollup` | 36 | Maths KS4 |

**Next step**: Phase 3e (ES Native Enhancements) to improve hard query performance.

**After Phase 3e**: Proceed to Phase 4 (Search SDK + CLI).

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
| 3.0-3d | Multi-Index & Fields | ✅ Complete | Four-retriever hybrid, KS4 filtering |

### Current

| Phase | Name | Status | Description |
| ----- | ---- | ------ | ----------- |
| **3e** | **ES Native Enhancements** | 📋 Planned | Fuzzy, stemming, phonetic, typeahead |

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

**Ready?** Start with Phase 3e (ES Native Enhancements): `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`

Look for the "Phase 3e: Elasticsearch Native Search Enhancements" section.
