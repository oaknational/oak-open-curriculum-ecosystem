# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 & 2 Complete | Phase 3 IN PROGRESS | Phase 4 PLANNED (SDK + CLI) | Two-Way Hybrid Confirmed Optimal  
**Last Updated**: 2025-12-13

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

## ⚠️ Immediate Priority: Type Discipline Restoration

A stricter ESLint configuration has surfaced **~188 eslint-disable comments** across **all workspaces**. These represent pre-existing architectural drift that must be resolved before feature work continues.

**Prompt**: `.agent/prompts/type-discipline-restoration.prompt.md`
**Plan**: `.agent/plans/quality-and-maintainability/type-discipline-restoration-plan.md`

This is a **repo-wide** issue affecting all workspaces. Key issues:

- `Record<string, unknown>` type aliases — hiding loose types
- `Object.*`/`Reflect.*` usage — should use type-safe helpers
- Missing Zod validation at script boundaries
- Logger using `object` instead of proper `LogContext` interface
- Every `eslint-disable` comment is entropy — they hide real issues

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

### Phase 3 Remaining Work

#### Part 3.0: Verification (CRITICAL - must complete first)

| Task                                      | Priority     | Status            |
| ----------------------------------------- | ------------ | ----------------- |
| BM25 vs ELSER vs Hybrid experiment        | **CRITICAL** | ✅ Complete       |
| Prove lesson-only search works            | **CRITICAL** | 🔲 Pending        |
| Prove unit-only search works              | **CRITICAL** | 🔲 Pending        |
| Prove joint search with doc_type works    | **CRITICAL** | 🔲 Pending        |
| Prove lesson filter by unit works         | **CRITICAL** | 🔲 Pending        |
| Add `doc_type` field (re-index if needed) | **HIGH**     | ✅ Already exists |
| ADR: unified vs separate endpoints        | Medium       | 🔲 Pending        |
| Unit reranking experiment                 | Medium       | 🔲 Deferred       |

#### Part 3a: Feature Parity (after verification complete)

| Task                       | Priority | Status     |
| -------------------------- | -------- | ---------- |
| OWA aliases import         | **HIGH** | 🔲 Pending |
| `pupilLessonOutcome` field | **HIGH** | 🔲 Pending |
| Display title fields       | Medium   | 🔲 Pending |
| Unit enrichment fields     | Medium   | 🔲 Pending |
| ADR: field additions       | Medium   | 🔲 Pending |

#### Part 3b: Semantic Summary Enhancement (NEW)

| Task                                 | Priority | Status      |
| ------------------------------------ | -------- | ----------- |
| Remove dense vector code             | **HIGH** | 🔲 Pending  |
| Lesson semantic summary template     | **HIGH** | 🔲 Pending  |
| Unit semantic summary template       | **HIGH** | 🔲 Pending  |
| Redis caching for summaries          | Medium   | 🔲 Pending  |
| Compare summary vs transcript ELSER  | Medium   | 🔲 Pending  |
| ADR-075: Dense vector removal        | **HIGH** | ✅ Complete |
| ADR-076: ELSER-only strategy         | **HIGH** | ✅ Complete |
| ADR-077: Semantic summary generation | **HIGH** | ✅ Complete |

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

| ADR                                                                                         | Title                           | Status   |
| ------------------------------------------------------------------------------------------- | ------------------------------- | -------- |
| [ADR-074](docs/architecture/architectural-decisions/074-elastic-native-first-philosophy.md) | Elastic-Native-First Philosophy | Accepted |
| [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md)            | Dense Vector Code Removal       | Accepted |
| [ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)   | ELSER-Only Embedding Strategy   | Accepted |
| [ADR-077](docs/architecture/architectural-decisions/077-semantic-summary-generation.md)     | Semantic Summary Generation     | Accepted |

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

| Index             | Count   | Hybrid Search | Proven Working |
| ----------------- | ------- | ------------- | -------------- |
| `oak_lessons`     | **314** | BM25 + ELSER  | ⚠️ Not proven  |
| `oak_unit_rollup` | 244     | BM25 + ELSER  | ⚠️ Not proven  |
| `oak_units`       | 36      | BM25 only     | ❌ Untested    |
| `oak_threads`     | 201     | BM25 + ELSER  | ❌ Untested    |
| `oak_sequences`   | 2       | BM25 + ELSER  | ❌ Untested    |

All 36 Maths KS4 units have their lessons indexed.

**Note**: Hybrid superiority experiment completed. For lessons, hybrid is superior. For units, results are mixed (ELSER slightly better MRR, hybrid better NDCG@10). See `experiments/hybrid-superiority.experiment.ts`.

---

## Embedding Strategy

### Current State

| Resource | ELSER Field       | Content Source            | Token Count |
| -------- | ----------------- | ------------------------- | ----------- |
| Lessons  | `lesson_semantic` | Full video transcript     | ~5000       |
| Units    | `unit_semantic`   | `rollupText` (aggregated) | ~200-400    |

### Dense Vectors: REMOVED

Phase 2 evaluation showed E5 dense vectors provide **no benefit** for curriculum search:

- MRR: 0.900 (two-way) vs 0.897 (three-way) - no improvement
- Latency: 180ms (two-way) vs 240ms (three-way) - 33% worse

**Decision**: Remove all dense vector code. See [ADR-075](docs/architecture/architectural-decisions/075-dense-vector-removal.md).

⚠️ **Action Required**: Dense vector generation code still exists and must be removed.

### Future Enhancement: Semantic Summaries

Add `semantic_summary` fields (~200 tokens) for information-dense embeddings:

| Resource | Field                     | Content                     | Status     |
| -------- | ------------------------- | --------------------------- | ---------- |
| Lessons  | `lesson_summary_semantic` | Template-composed summary   | 🔲 Planned |
| Units    | `unit_semantic`           | Replace rollup with summary | 🔲 Planned |

**Generation approach**:

1. **Template-based** (Phase 3) - Compose from API fields
2. **LLM-enhanced** (Future) - Use `.gp-llm-v2-chat_completion` for richer summaries

**Caching**: Redis (same instance as curriculum API caching).

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

```bash
# Terminal 1: Start the server (current Next.js wrapper; Phase 4 moves to SDK + CLI)
cd apps/oak-open-curriculum-semantic-search
rm -rf .next  # Clear cache (important!)
pnpm dev

# Terminal 2: Run smoke tests
pnpm vitest run -c vitest.smoke.config.ts
```

## Re-Ingestion (if needed)

```bash
cd apps/oak-open-curriculum-semantic-search

# Ensure ES cluster is ready
pnpm es:setup

# Re-ingest Maths KS4 (takes ~5-10 minutes)
pnpm es:ingest-live -- --subject maths --keystage ks4

# Verify status
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
