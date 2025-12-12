# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 & 2 Complete | Phase 3 IN PROGRESS | Two-Way Hybrid Confirmed Best  
**Last Updated**: 2025-12-12

---

## Strategic Goal

Create a production-ready demo proving Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Phase 3 Goal**: Complete multi-index infrastructure and feature parity to enable a `semantic_search` MCP tool.

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

**Success**: MRR > 0.70, NDCG@10 > 0.75, impressive stakeholder demo, scalable patterns.

---

## Read First

**Foundation documents** (MUST read before any work):

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**Requirements & context** (strategic goals, risks, costs, demos):

- `.agent/plans/semantic-search/requirements.md` - **Read this for business context**

**Navigation hub**: `.agent/plans/semantic-search/README.md`

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
| Two-way hybrid (BM25 + ELSER) confirmed optimal   | ✅ Complete |
| Lesson search: MRR 0.908, 40 ground truth queries | ✅ Complete |
| Unit search: MRR 0.915, 43 ground truth queries   | ✅ Complete |
| Three-way RRF code removed (dead code cleanup)    | ✅ Complete |
| All quality gates passing                         | ✅ Complete |

### Phase 3 Remaining Work (10 tasks)

#### Part 3.0: Multi-Index Infrastructure

| Task                                | Priority | Status     |
| ----------------------------------- | -------- | ---------- |
| BM25 vs ELSER vs Hybrid experiment  | **HIGH** | 🔲 Pending |
| Add `doc_type` field to all indexes | **HIGH** | 🔲 Pending |
| Verify unit filter on lesson search | Medium   | 🔲 Pending |
| ADR: unified vs separate endpoints  | Medium   | 🔲 Pending |

#### Part 3a: Feature Parity Quick Wins

| Task                       | Priority | Status     |
| -------------------------- | -------- | ---------- |
| OWA aliases import         | **HIGH** | 🔲 Pending |
| `pupilLessonOutcome` field | **HIGH** | 🔲 Pending |
| Display title fields       | Medium   | 🔲 Pending |
| Unit enrichment fields     | Medium   | 🔲 Pending |
| ADR: field additions       | Medium   | 🔲 Pending |

#### Final Task

| Task                      | Priority | Status     |
| ------------------------- | -------- | ---------- |
| Unit reranking experiment | Medium   | 🔲 Pending |

See `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` for full details.

---

## Technical Architecture

### Two-Way Hybrid Search (BM25 + ELSER)

We use Elasticsearch's Reciprocal Rank Fusion (RRF) to combine:

1. **BM25** - Lexical/keyword matching (built-in)
2. **ELSER** - Sparse semantic embeddings via `.elser-2-elasticsearch`

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

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html

### ES Serverless Features ($0 additional cost)

| Feature | Endpoint                     | Purpose                |
| ------- | ---------------------------- | ---------------------- |
| BM25    | Built-in                     | Lexical search         |
| ELSER   | `.elser-2-elasticsearch`     | Sparse semantic        |
| ReRank  | `.rerank-v1-elasticsearch`   | Cross-encoder reranker |
| LLM     | `.gp-llm-v2-chat_completion` | Future RAG             |

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

| Index             | Count   | Hybrid Search | Status      |
| ----------------- | ------- | ------------- | ----------- |
| `oak_lessons`     | **314** | BM25 + ELSER  | ✅ Tested   |
| `oak_unit_rollup` | 244     | BM25 + ELSER  | ✅ Tested   |
| `oak_units`       | 36      | BM25 only     | ❌ Untested |
| `oak_threads`     | 201     | BM25 + ELSER  | ❌ Untested |
| `oak_sequences`   | 2       | BM25 + ELSER  | ❌ Untested |

All 36 Maths KS4 units have their lessons indexed.

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
| 4     | Search UI         | 📋 Planned | 3-4 days |
| 5     | Cloud Functions   | 📋 Planned | 2-3 days |
| 6     | Admin Dashboard   | 📋 Planned | 2-3 days |
| 7     | Query Enhancement | 📋 Planned | 1-2 days |
| 8     | Entity Extraction | 📋 Future  | 3-4 days |
| 9     | Reference Indices | 📋 Future  | 2-3 days |
| 10+   | AI Integration    | 📋 Future  | 15-20d   |

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
# Terminal 1: Start the server
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
