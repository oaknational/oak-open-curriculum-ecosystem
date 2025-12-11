# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 & 2 Complete | Phase 3+ Restructured | Two-Way Hybrid Confirmed Best  
**Last Updated**: 2025-12-11

---

## Strategic Goal

Create a production-ready demo proving Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

**Phase 3 Goal**: Enable a `semantic_search` MCP tool that searches lessons and units with filters.

**Why Maths KS4?** Maximum complexity (tiers, pathways, exam boards), high teacher value, complete feature coverage, manageable scope (~10 minutes to ingest).

**Success**: MRR > 0.70, NDCG@10 > 0.75, impressive stakeholder demo, scalable patterns.

**Data Strategy**: Continue with Maths KS4 for Phase 3 (infrastructure changes). Move to full ingest after Phase 3 when MCP tool is ready.

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

## Phase Structure (Restructured 2025-12-11)

Remaining work is organized into three parts:

### Part 1: MCP Prerequisites (Phase 3)

Foundation for a `semantic_search` MCP tool that searches lessons and units with filters.

| Phase | Name                     | Status  | Effort   | Description                        |
| ----- | ------------------------ | ------- | -------- | ---------------------------------- |
| **3** | **Multi-Index & Fields** | 📋 Next | 2-3 days | Unit search, doc_type, OWA aliases |

### Part 2: Enhancements (Phases 4-9)

UI, admin tooling, query improvements, and curriculum enrichment.

| Phase | Name              | Status     | Effort   | Description                            |
| ----- | ----------------- | ---------- | -------- | -------------------------------------- |
| 4     | Search UI         | 📋 Planned | 3-4 days | Functional, portable search UX         |
| 5     | Cloud Functions   | 📋 Planned | 2-3 days | HTTP ingestion endpoints on Vercel     |
| 6     | Admin Dashboard   | 📋 Planned | 2-3 days | Ingestion control, metrics display     |
| 7     | Query Enhancement | 📋 Planned | 1-2 days | Production patterns, OWA compatibility |
| 8     | Entity Extraction | 📋 Future  | 3-4 days | NER, concept graphs                    |
| 9     | Reference Indices | 📋 Future  | 2-3 days | Enriched results, prerequisites, NC    |

### Part 3: AI Integration (Phase 10+)

| Phase | Name   | Status    | Effort     | Description               |
| ----- | ------ | --------- | ---------- | ------------------------- |
| 10+   | Future | 📋 Future | 15-20 days | RAG, Knowledge Graph, LTR |

### Completed

| Phase | Name          | Status      | Description                 |
| ----- | ------------- | ----------- | --------------------------- |
| 1     | Foundation    | ✅ Complete | Lexical baseline, ELSER fix |
| 2     | Dense Vectors | ✅ Complete | E5 evaluated, no benefit    |

**Phase documents**: `.agent/plans/semantic-search/phase-{N}-*.md`

**Archived phases**: `.agent/plans/semantic-search/archive/`

---

## Current State

### Data ✅ COMPLETE

| Index             | Count   | Status |
| ----------------- | ------- | ------ |
| `oak_lessons`     | **314** | ✅     |
| `oak_units`       | 36      | ✅     |
| `oak_unit_rollup` | 244     | ✅     |
| `oak_threads`     | 201     | ✅     |
| `oak_sequences`   | 2       | ✅     |

All 36 Maths KS4 units have their lessons indexed.

### Infrastructure ✅ COMPLETE

- Two-way RRF query builders (BM25 + ELSER) using ES 8.11+ `retriever` API
- Fuzzy matching enabled (`fuzziness: 'AUTO'`)
- MRR and NDCG@10 metrics implemented with TDD
- Synonym system refactored into modular themed files

### Key Discovery: ELSER Was Not Operational for Lessons

**Problem identified**: The `lesson_semantic` field was never being populated during indexing.
**Fix applied**: Added `lesson_semantic: transcript` to `createLessonDocument()`.
**Impact**: Re-indexing required to populate ELSER embeddings for 314 lessons.

See `.agent/research/elasticsearch/assumptions-validation.md` for full analysis.

---

## Results Summary

### Best Configuration: Two-Way Hybrid (BM25 + ELSER) - Confirmed 2025-12-11

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.900** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.716     | > 0.75  | ❌ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| Avg Latency   | **153ms** | < 300ms | ✅ PASS  |

**3 of 4 targets met.** Two-way hybrid remains optimal after extensive experimentation.

### Phase 2 Findings

- **E5 dense vectors**: No improvement, slight degradation
- **Reranking**: Hurts quality on current fields (needs combined field)
- **Conclusion**: Proceed with two-way hybrid (BM25 + ELSER)

---

## Next Steps: Phase 3

**Goal**: Enable `semantic_search` MCP tool that searches lessons and units with filters.

**Data**: Continue with Maths KS4 (infrastructure changes don't need full curriculum).

### Priority Tasks

| Task                               | Priority     | Notes                               |
| ---------------------------------- | ------------ | ----------------------------------- |
| **Verify unit hybrid search**      | **CRITICAL** | Ensure units use BM25 + ELSER       |
| **Test unit search quality**       | **HIGH**     | Create ground truth and smoke tests |
| **Experiment with unit reranking** | **HIGH**     | Test with `rollup_text` field       |
| **Add `doc_type` field**           | Medium       | Distinguish lesson/unit in results  |
| **Import OWA aliases**             | Medium       | Better query understanding          |

See `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md` for full details.

### After Phase 3

Once the `semantic_search` MCP tool works for Maths KS4:

1. Move to full curriculum ingest (10,000 req/hr makes this feasible)
2. Create the MCP tool in the SDK
3. Test cross-subject search capabilities

### Re-Running Tests

```bash
# Terminal 1: Start the server
cd apps/oak-open-curriculum-semantic-search
rm -rf .next  # Clear cache (important!)
pnpm dev

# Terminal 2: Run smoke tests
pnpm test:smoke
```

### Re-Ingestion (if needed)

```bash
cd apps/oak-open-curriculum-semantic-search

# Ensure ES cluster is ready
pnpm es:setup

# Re-ingest Maths KS4 (takes ~5-10 minutes)
pnpm es:ingest-live -- --subject maths --keystage ks4

# Verify ELSER is working
pnpm es:status
```

---

## Key Files

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/search-quality/
│   ├── ground-truth/              # Modular ground truth
│   ├── metrics.ts                 # MRR, NDCG calculations
│   └── index.ts                   # Public exports
└── smoke-tests/
    └── search-quality.smoke.test.ts  # Benchmark suite
```

### RRF Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
└── rrf-query-helpers.ts            # Shared helpers
```

### Document Transforms (ELSER Fix Location)

```text
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
└── document-transforms.ts          # createLessonDocument() - FIXED
```

### Synonyms (SDK)

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts         # Subject name variations
├── key-stages.ts       # Key stage aliases
├── numbers.ts          # Numbers + maths terms (squared → quadratic)
└── index.ts            # Barrel file (exports synonymsData)
```

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm type-gen                                     # Generate types
pnpm build                                        # Build all
pnpm type-check                                   # TypeScript validation
pnpm lint:fix                                     # Auto-fix linting
pnpm format:root                                  # Format code
pnpm markdownlint:root                            # Markdown lint
pnpm test                                         # Unit + integration
pnpm test:e2e                                     # E2E tests
pnpm test:e2e:built                               # E2E on built app
pnpm test:ui                                      # Playwright UI tests
pnpm smoke:dev:stub                               # Smoke tests
```

All gates must pass. No exceptions.

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

## Testing Approach (Per Foundation Docs)

| Test Type       | Location                | Purpose                               | IO                |
| --------------- | ----------------------- | ------------------------------------- | ----------------- |
| **Unit**        | `*.unit.test.ts`        | Pure functions (metrics calculations) | None              |
| **Integration** | `*.integration.test.ts` | Code units working together           | None              |
| **Smoke**       | `smoke-tests/`          | Running system, real ES queries       | HTTP to localhost |

**TDD at all levels**: Write tests FIRST (RED → GREEN → REFACTOR).

---

## Remember

1. **TDD is mandatory** - Write tests FIRST (RED → GREEN → REFACTOR)
2. **Schema-first** - All types flow from field definitions via `pnpm type-gen`
3. **No type shortcuts** - No `as`, `any`, `!`, `Record<string, unknown>`
4. **No skipped tests** - Fix it or delete it
5. **Fail fast** - Clear error messages, no silent failures
6. **Simpler first** - Only add complexity when validated necessary
7. **All quality gates must pass** - No exceptions, no workarounds

---

**Ready?** Start with Phase 3: `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
