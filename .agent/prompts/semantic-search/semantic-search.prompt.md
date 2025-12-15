# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 & 2 Complete | **Phase 3.0 ✅ VERIFIED** | **Phase 3a ✅ IMPLEMENTED** | **Phase 3b ✅ IMPLEMENTED** | Phase 4 PLANNED (SDK + CLI) | Two-Way Hybrid Confirmed Optimal  
**Last Updated**: 2025-12-15

---

## 📋 Current State

**Parts 3.0, 3a, and 3b are COMPLETE (code implemented).** All quality gates pass.

### Part 3.0 (Verification) ✅ VERIFIED
- ✅ Hybrid superiority experiment: Lessons hybrid > BM25/ELSER; Units ELSER slightly better MRR but hybrid better NDCG
- ✅ Lesson-only search verified
- ✅ Unit-only search verified
- ✅ Joint search (both types) verified
- ✅ Lesson filter by unit verified
- ✅ Redis cache TTL updated to 14 days with ±12 hour jitter (ADR-079)

### Part 3a (Feature Parity) ✅ IMPLEMENTED
- ✅ OWA aliases imported (subjects, key stages, exam boards)
- ✅ `pupilLessonOutcome` field added to lesson index
- ✅ Display title fields (`subjectTitle`, `keyStageTitle`) added
- ✅ Unit enrichment fields added (`description`, `whyThisWhyNow`, `categories`, etc.)
- ✅ **KS4 Metadata Denormalisation** implemented:
  - `ks4-context-builder.ts` traverses sequences and builds `UnitContextMap`
  - KS4 arrays indexed: `tiers[]`, `examBoards[]`, `examSubjects[]`, `ks4Options[]` + titles
  - Smoke tests for KS4 filtering created

### Part 3b (Semantic Summaries) ✅ IMPLEMENTED
- ✅ Dense vector code removed (ADR-075)
- ✅ `generateLessonSemanticSummary()` template implemented
- ✅ `generateUnitSemanticSummary()` template implemented
- ✅ `lesson_summary_semantic` field added to lesson index
- ✅ `unit_semantic` now uses curated summary instead of rollup text

### Remaining Work (Optional Enhancements)
- 🔲 Redis caching for semantic summaries (deferred)
- 🔲 Summary vs transcript ELSER experiment (deferred)
- 🔲 Unit reranking experiment (deferred)

### ⚠️ VERIFICATION NEEDED
All code is implemented and quality gates pass, but **re-indexing and live verification** is required:
1. Re-index with fresh data: `pnpm es:setup && pnpm es:ingest-live -- --subject maths --keystage ks4`
2. Run KS4 filtering smoke tests
3. Run search quality benchmarks to measure MRR/NDCG with new fields

See `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md` for detailed validation results.

---

## ⚠️ Fresh Chat First Steps (MANDATORY)

**Significant code changes have occurred** since the last semantic search session. Before any feature work:

### 1. Run Full Quality Gates (from repo root)

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

### 2. ALWAYS Re-Index Fresh (CRITICAL)

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

| Category        | Examples                                               | Requirements                      |
| --------------- | ------------------------------------------------------ | --------------------------------- |
| **API-based**   | `scope-verification`, `search-quality`, `unit-search-*` | Next.js dev server + fresh ES     |
| **Direct ES**   | `hybrid-superiority`                                   | ES credentials in `.env.local`    |

**API-based tests**: Hit `/api/search` endpoint → full stack validation.
**Direct ES tests**: Talk to Elasticsearch directly → raw query validation.

Both require **fresh indices** to produce meaningful results. Never skip re-indexing.

### 4. Run Verification Tests in Correct Order

```bash
# Direct ES tests (no server needed)
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# API-based tests (need server running in separate terminal)
# Terminal 1: pnpm dev
# Terminal 2:
pnpm vitest run -c vitest.smoke.config.ts scope-verification
```

### 5. Then Proceed with Phase 3 Work

Once quality gates pass, indices are fresh, and verification tests pass, continue with Part 3a/3b work.

---

## Strategic Goal

Create a production-ready demo proving Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Phase 3 Goal**: Prove multi-index search infrastructure works correctly:

1. Prove BM25 + ELSER hybrid is superior to either alone
2. Prove lesson-only, unit-only, and joint search all work
3. Prove lesson search can filter by unit
4. Add feature parity fields after verification

**Next phase (Phase 4)**: Extract the search capability as an **SDK + first-class local CLI**, so it can be consumed by the **Express MCP server** (NL policy stays in MCP via comprehensive tool examples). See `.agent/plans/semantic-search/phase-4-search-sdk-and-cli.md`.

**MCP tool creation** is coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/` (Phase 4 prepares the SDK surface the MCP tool will consume).

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

**Success**: MRR > 0.70, NDCG@10 > 0.75, impressive stakeholder demo, scalable patterns.

---

## Read First

**Foundation documents** (MUST read before any work):

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**Source of truth** (for all types and available data):

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - **The OpenAPI schema**
- `.agent/plans/external/upstream-api-metadata-wishlist.md` - Fields to request from upstream API

**Requirements & context** (strategic goals, risks, costs, demos):

- `.agent/plans/semantic-search/requirements.md` - **Read this for business context**

**Navigation hub**: `.agent/plans/semantic-search/README.md`

---

## Type Discipline Status

Quality gates are now **passing**. Type discipline restoration work is ongoing but not blocking semantic search.

**Plan**: `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md`

**Current state**: 2 lint errors remain; test isolation enabled (`isolate: true` + `pool: 'forks'`).

---

## Elasticsearch Documentation

Key ES documentation for this project:

| Topic                   | URL                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------ |
| **Hybrid Search (RRF)** | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html                   |
| **Semantic Search**     | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html       |
| **ELSER**               | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html |
| **Semantic Reranking**  | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html    |
| **Retriever API**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html             |

---

## Current State

### Completed Work

| Item                                              | Status      |
| ------------------------------------------------- | ----------- |
| Two-way hybrid code written (BM25 + ELSER RRF)    | ✅ Complete |
| Lesson search: MRR 0.908, 40 ground truth queries | ✅ Complete |
| Unit search: MRR 0.915, 43 ground truth queries   | ✅ Complete |
| Three-way RRF code removed (dead code cleanup)    | ✅ Complete |
| All quality gates passing                         | ✅ Complete |
| BM25 vs ELSER vs Hybrid experiment                | ✅ Complete |
| Part 3.0 verification (scope, doc_type, filters)  | ✅ Complete |
| Redis cache TTL 14 days + jitter (ADR-079)        | ✅ Complete |
| **Part 3a: Feature Parity fields**                | ✅ Complete |
| **Part 3a: KS4 Metadata Denormalisation**         | ✅ Complete |
| **Part 3b: Dense vector removal**                 | ✅ Complete |
| **Part 3b: Semantic summary templates**           | ✅ Complete |

### Phase 3 Remaining Work

**📋 Detailed execution plan**: `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md`

#### Phase 0: Redis Cache TTL Configuration ✅ COMPLETE

| Task                                        | Priority | Status      |
| ------------------------------------------- | -------- | ----------- |
| Investigate current Redis TTL configuration | **HIGH** | ✅ Complete |
| Update TTL to 14 days with ±12 hour jitter  | **HIGH** | ✅ Complete |
| Create ADR-079 for TTL jitter               | **HIGH** | ✅ Complete |
| Update SDK-CACHING.md documentation         | **HIGH** | ✅ Complete |
| Create `pnpm cache:reset-ttls` dev tool     | **HIGH** | ✅ Complete |

**Implementation**: `calculateTtlWithJitter()` pure function in `src/adapters/sdk-cache/ttl-jitter.ts` with per-entry jitter for true stampede prevention.

**Dev Tool**: `pnpm cache:reset-ttls` - Reset TTLs on existing cached entries without re-downloading data.

#### Part 3.0: Verification ✅ COMPLETE

| Task                                   | Priority     | Status      |
| -------------------------------------- | ------------ | ----------- |
| BM25 vs ELSER vs Hybrid experiment     | **CRITICAL** | ✅ Complete |
| Prove lesson-only search works         | **CRITICAL** | ✅ Complete |
| Prove unit-only search works           | **CRITICAL** | ✅ Complete |
| Prove joint search with doc_type works | **CRITICAL** | ✅ Complete |
| Prove lesson filter by unit works      | **CRITICAL** | ✅ Complete |
| `doc_type` field exists                | **HIGH**     | ✅ Complete |
| ADR: unified vs separate endpoints     | Medium       | 🔲 Deferred |
| Unit reranking experiment              | Medium       | 🔲 Deferred |

**Verified 2025-12-15** with fresh Maths KS4 data. See validation results in `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md`.

#### Part 3a: Feature Parity ✅ IMPLEMENTED

| Task                                    | Priority     | Status        |
| --------------------------------------- | ------------ | ------------- |
| OWA aliases import                      | **HIGH**     | ✅ Complete   |
| `pupilLessonOutcome` field              | **HIGH**     | ✅ Complete   |
| Display title fields                    | Medium       | ✅ Complete   |
| Unit enrichment fields                  | Medium       | ✅ Complete   |
| KS4 sequence traversal to ingestion     | **CRITICAL** | ✅ Complete   |
| Build UnitContextMap from sequences     | **CRITICAL** | ✅ Complete   |
| KS4 field definitions (arrays)          | **HIGH**     | ✅ Complete   |
| Decorate documents with KS4 metadata    | **HIGH**     | ✅ Complete   |
| KS4 filtering smoke tests               | **HIGH**     | ✅ Complete   |
| ADR-080: Denormalisation strategy       | **HIGH**     | ✅ Complete   |

#### Part 3b: Semantic Summary Enhancement ✅ IMPLEMENTED

| Task                                 | Priority | Status         |
| ------------------------------------ | -------- | -------------- |
| Remove dense vector code             | **HIGH** | ✅ Complete    |
| Lesson semantic summary template     | **HIGH** | ✅ Complete    |
| Unit semantic summary template       | **HIGH** | ✅ Complete    |
| `lesson_summary_semantic` field      | **HIGH** | ✅ Complete    |
| Redis caching for summaries          | Medium   | 🔲 Deferred    |
| Compare summary vs transcript ELSER  | Medium   | 🔲 Deferred    |
| ADR-075: Dense vector removal        | **HIGH** | ✅ Implemented |
| ADR-076: ELSER-only strategy         | **HIGH** | ✅ Complete    |
| ADR-077: Semantic summary generation | **HIGH** | ✅ Complete    |

**Approach**: Traverse `/sequences/{sequence}/units` endpoints, build lookup tables mapping units → tiers/examBoards, decorate indexed documents with arrays. See [ADR-080](docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md).

**Redis Caching**: All SDK requests continue to be cached in Redis (14-day TTL with jitter per ADR-079). Sequence endpoints are no exception.

See `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` for full details.

---

## Technical Architecture

### Two-Way Hybrid Search (BM25 + ELSER)

We use Elasticsearch's Reciprocal Rank Fusion (RRF) to combine **multiple retrievers within a single index**.

**Key clarification**: RRF combines **retrievers** (search methods), not indices. All retrievers query the same `oak_lessons` index using different matching strategies.

| Retriever | Type            | Field(s)                                             | Purpose           |
| --------- | --------------- | ---------------------------------------------------- | ----------------- |
| BM25      | Lexical         | `lesson_title`, `lesson_keywords`, `transcript_text` | Keyword matching  |
| ELSER     | Sparse semantic | `lesson_semantic` (full transcript)                  | Semantic matching |

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": { "multi_match": { "query": "...", "fields": ["title", "transcript"] } }
          }
        },
        { "standard": { "query": { "semantic": { "field": "lesson_semantic", "query": "..." } } } }
      ],
      "rank_window_size": 100,
      "rank_constant": 60
    }
  }
}
```

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>

### Future: Three-Way Hybrid (BM25 + Transcript ELSER + Summary ELSER)

With semantic summary enhancement (Part 3b), we add a **third retriever** (still same index):

| Retriever          | Type            | Field                     | Purpose                         |
| ------------------ | --------------- | ------------------------- | ------------------------------- |
| BM25               | Lexical         | Multiple text fields      | Keyword matching                |
| ELSER (transcript) | Sparse semantic | `lesson_semantic`         | Detailed content matching       |
| ELSER (summary)    | Sparse semantic | `lesson_summary_semantic` | Conceptual/pedagogical matching |

**⚠️ Important**: This "three-way" refers to BM25 + two ELSER fields, **NOT** dense vectors. Dense vectors were evaluated in Phase 2 and provided no benefit (see ADR-075).

### Why ELSER Only (No Dense Vectors)

Phase 2 evaluated E5 dense vectors - **no benefit for curriculum search**:

- ELSER handles curriculum vocabulary well (quadratic, denominator, photosynthesis)
- Dense vectors added latency (+33%) without improving MRR/NDCG
- Simpler architecture with one embedding type

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>

### ES Serverless Features ($0 additional cost)

| Feature | Endpoint                               | Purpose                | Status      |
| ------- | -------------------------------------- | ---------------------- | ----------- |
| BM25    | Built-in                               | Lexical search         | ✅ Used     |
| ELSER   | `.elser-2-elasticsearch`               | Sparse semantic        | ✅ Used     |
| E5      | `.multilingual-e5-small-elasticsearch` | Dense vectors          | ❌ Not used |
| ReRank  | `.rerank-v1-elasticsearch`             | Cross-encoder reranker | 📋 Planned  |
| LLM     | `.gp-llm-v2-chat_completion`           | Future RAG / summaries | 📋 Planned  |

### ADRs

| ADR                                                                                          | Title                              | Status      |
| -------------------------------------------------------------------------------------------- | ---------------------------------- | ----------- |
| [ADR-074](docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md)  | Elastic-Native-First Philosophy    | Accepted    |
| [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md)             | Dense Vector Code Removal          | Accepted    |
| [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)    | ELSER-Only Embedding Strategy      | Accepted    |
| [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md)      | Semantic Summary Generation        | Accepted    |
| [ADR-079](docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md)             | SDK Cache TTL Jitter               | Implemented |
| [ADR-080](docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 Metadata Denormalisation  | Accepted    |

---

## Current Metrics

### Lesson Search (314 Maths KS4 lessons)

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.908** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.725     | > 0.75  | ⚠️ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| p95 Latency   | 367ms     | < 300ms | ⚠️ Above |

### Unit Search (36 Maths KS4 units)

| Metric        | Result    | Target  | Status  |
| ------------- | --------- | ------- | ------- |
| MRR           | **0.915** | > 0.60  | ✅ PASS |
| NDCG@10       | **0.924** | > 0.65  | ✅ PASS |
| Zero-hit rate | **0.0%**  | < 15%   | ✅ PASS |
| p95 Latency   | **196ms** | < 300ms | ✅ PASS |

---

## Data

**Last indexed**: 2025-12-15 (Maths KS4)

| Index             | Count | Hybrid Search | Status       |
| ----------------- | ----- | ------------- | ------------ |
| `oak_lessons`     | 314   | BM25 + ELSER  | ✅ Verified  |
| `oak_unit_rollup` | 36    | BM25 + ELSER  | ✅ Verified  |
| `oak_units`       | 36    | BM25 only     | ✅ Verified  |
| `oak_threads`     | 201   | BM25 + ELSER  | ❌ Untested  |
| `oak_sequences`   | 2     | BM25 + ELSER  | ❌ Untested  |

All 36 Maths KS4 units have their lessons indexed. Redis cache refreshed with 14-day TTLs (8,109 entries).

**Note**: Hybrid superiority experiment completed. For lessons, hybrid is superior. For units, results are mixed (ELSER slightly better MRR, hybrid better NDCG@10).

---

## Embedding Strategy

### Current State

| Resource | ELSER Field       | Content Source            | Token Count |
| -------- | ----------------- | ------------------------- | ----------- |
| Lessons  | `lesson_semantic` | Full video transcript     | ~5000       |
| Units    | `unit_semantic`   | `rollupText` (aggregated) | ~200-400    |

### Dense Vectors: REMOVED ✅

Phase 2 evaluation showed E5 dense vectors provide **no benefit** for curriculum search:

- MRR: 0.900 (two-way) vs 0.897 (three-way) - no improvement
- Latency: 180ms (two-way) vs 240ms (three-way) - 33% worse

**Decision**: Remove all dense vector code. See [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md).

✅ **Completed 2025-12-15**: All dense vector code has been removed:
- `dense-vector-generation.ts` module deleted
- Dense vector fields removed from document transforms
- SDK field definitions updated (type-gen regenerated)
- Rerank experiment scripts simplified to 2-way only
- All quality gates passing

### Semantic Summaries ✅ IMPLEMENTED

Semantic summary fields (~200 tokens) for information-dense embeddings:

| Resource | Field                     | Content                     | Status       |
| -------- | ------------------------- | --------------------------- | ------------ |
| Lessons  | `lesson_summary_semantic` | Template-composed summary   | ✅ Complete  |
| Units    | `unit_semantic`           | Curated summary (not rollup)| ✅ Complete  |

**Implementation**:
- `generateLessonSemanticSummary()` in `semantic-summary-generator.ts`
- `generateUnitSemanticSummary()` in `semantic-summary-generator.ts`
- Templates compose from: title, keyStage, subject, keyLearningPoints, keywords, misconceptions, pupilLessonOutcome

**Future enhancement**: LLM-generated summaries via `.gp-llm-v2-chat_completion` for richer prose.

See [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md).

---

## Phase Structure

### Completed

| Phase | Name          | Status      | Description                 |
| ----- | ------------- | ----------- | --------------------------- |
| 1     | Foundation    | ✅ Complete | Lexical baseline, ELSER fix |
| 2     | Dense Vectors | ✅ Complete | E5 evaluated, no benefit    |

### Current

| Phase | Name                     | Status         | Description                        |
| ----- | ------------------------ | -------------- | ---------------------------------- |
| **3** | **Multi-Index & Fields** | 🔄 In Progress | Unit search, doc_type, OWA aliases |

### Future

| Phase | Name              | Status     | Effort   |
| ----- | ----------------- | ---------- | -------- |
| 4     | Search SDK + CLI  | 📋 Planned | 3-6 days |
| 5     | Search UI         | 📋 Planned | 3-4 days |
| 6     | Cloud Functions   | 📋 Planned | 2-3 days |
| 7     | Admin Dashboard   | 📋 Planned | 2-3 days |
| 8     | Query Enhancement | 📋 Planned | 1-2 days |
| 9     | Entity Extraction | 📋 Future  | 3-4 days |
| 10    | Reference Indices | 📋 Future  | 2-3 days |
| 11+   | AI Integration    | 📋 Future  | 15-20d   |

**Phase documents**: `.agent/plans/semantic-search/phase-{N}-*.md`

---

## Key Files

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/search-quality/
│   ├── ground-truth/              # Lesson + unit ground truth
│   │   ├── units/                 # 43 unit queries
│   │   └── ...                    # 40 lesson queries
│   ├── metrics.ts                 # MRR, NDCG calculations
│   └── index.ts                   # Public exports
└── smoke-tests/
    ├── search-quality.smoke.test.ts       # Lesson benchmarks
    ├── unit-search-quality.smoke.test.ts  # Unit benchmarks
    └── unit-search-verification.smoke.test.ts
```

### RRF Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
├── rrf-query-helpers.ts            # Shared helpers
├── lessons.ts                      # Lesson search
└── units.ts                        # Unit search
```

### Document Transforms

```text
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
└── document-transforms.ts          # createLessonDocument(), createUnitDocument()
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

## Quality Gates

Run after every piece of work, from repo root, in order:

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

## Running Tests

### Direct ES Tests (no server needed)

These tests talk directly to Elasticsearch using credentials from `.env.local`:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority
```

### API-Based Tests (need server)

These tests hit the `/api/search` endpoint:

```bash
# Terminal 1: Start the dev server
cd apps/oak-open-curriculum-semantic-search
rm -rf .next  # Clear cache
pnpm dev

# Terminal 2: Run API-based smoke tests
pnpm vitest run -c vitest.smoke.config.ts scope-verification
pnpm vitest run -c vitest.smoke.config.ts search-quality
pnpm vitest run -c vitest.smoke.config.ts unit-search
```

## Re-Ingestion (MANDATORY before verification)

**⚠️ Always re-index before running smoke tests.** Stale indices invalidate all results.

```bash
cd apps/oak-open-curriculum-semantic-search

# Setup indices with current mappings
pnpm es:setup

# Ingest Maths KS4 fresh (~5-10 minutes)
pnpm es:ingest-live -- --subject maths --keystage ks4

# Verify document counts (expect ~314 lessons, ~36 units)
pnpm es:status
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

**Rate Limit**: Oak API upgraded to **10,000 requests/hour** (from 1,000).

---

## Remember

1. **TDD is mandatory** - Write tests FIRST at ALL levels (RED → GREEN → REFACTOR)
2. **Schema-first** - All types flow from field definitions via `pnpm type-gen`
3. **No type shortcuts** - No `as`, `any`, `!`, `Record<string, unknown>`
4. **No skipped tests** - Fix it or delete it
5. **Fail fast** - Clear error messages, no silent failures
6. **Delete dead code** - If unused, delete it
7. **All quality gates must pass** - No exceptions, no workarounds

---

**Ready?** Start with Phase 3: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
