# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 2 Evaluated | Two-Way Hybrid Confirmed Best | Reranker Investigated  
**Last Updated**: 2025-12-11

---

## Strategic Goal

Create a production-ready demo proving Elasticsearch Serverless as the **definitive platform** for intelligent curriculum search, using Maths KS4 as a vertical slice that scales to the full Oak curriculum.

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

**Phase documents**:

- `.agent/plans/semantic-search/phase-1-foundation.md` - ✅ Complete (lexical baseline + ELSER fix)
- `.agent/plans/semantic-search/phase-2-dense-vectors.md` - ✅ Evaluated (E5 provides no benefit)
- `.agent/plans/semantic-search/phase-3-plus-roadmap.md` - 📋 Future

**Research**:

- `.agent/research/elasticsearch/assumptions-validation.md` - **Critical discovery: ELSER was not operational for lessons**

**Navigation hub**: `.agent/plans/semantic-search/README.md`

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
- Three-way RRF query builders ready for Phase 2 if needed
- Fuzzy matching enabled (`fuzziness: 'AUTO'`)
- MRR and NDCG@10 metrics implemented with TDD
- Synonym system refactored into modular themed files

### Critical Discovery: ELSER Was Not Operational for Lessons

**Problem identified**: The `lesson_semantic` field was never being populated during indexing. This meant:

- ELSER queries on lessons returned **0 hits**
- RRF "hybrid" search was actually **BM25-only** for lessons
- Unit search WAS hybrid (unit_semantic was populated correctly)

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

### Full Experimental Results (2025-12-11)

| Configuration             | MRR       | NDCG@10   | Latency | Analysis                    |
| ------------------------- | --------- | --------- | ------- | --------------------------- |
| **2-way (BM25 + ELSER)**  | **0.900** | **0.716** | 153ms   | ✅ Best quality             |
| 3-way (BM25 + ELSER + E5) | 0.892     | 0.715     | 180ms   | E5 adds latency, no benefit |
| 2-way + rerank            | 0.893     | 0.683     | 1546ms  | Rerank hurts quality        |
| 3-way + rerank            | 0.888     | 0.681     | 808ms   | Worst overall quality       |

### Phase 2 Findings: Three-Way Hybrid Does NOT Improve Results

**E5-small dense vectors** (`.multilingual-e5-small-elasticsearch`, 384 dimensions):

- Slightly decreased MRR (-0.008) and NDCG (-0.001)
- Added ~20ms latency with no quality benefit
- Conclusion: **Not recommended** for this dataset

**Reranking** (`.rerank-v1-elasticsearch`):

- Initial 22+ second latencies were caused by using `transcript_text` (full transcripts)
- Switching to `lesson_title` reduced latency to ~1.5s but **decreased quality**
- NDCG dropped from 0.716 → 0.683 with reranking
- Conclusion: **Reranking on short fields is counterproductive**; would need combined field (title + keywords + key_learning_points) to be effective

### Key Findings

1. **Two-way hybrid is optimal** - BM25 + ELSER provides best balance
2. **E5 dense vectors provide no benefit** - For this dataset, sparse vectors (ELSER) are sufficient
3. **Reranker field matters critically** - Full transcripts cause 20+ second latencies; short titles lack semantic signal
4. **Latency improved** - 153ms average is well within target
5. **Fuzzy matching working** - "pythagorus" misspelling returns correct results
6. **Synonyms operational** - "squared" expands to "quadratic" at query time

### Outstanding Work

1. **Unit hybrid search** (CRITICAL): Ensure units use BM25 + ELSER like lessons. See Phase 3.0.
2. **Unit reranking experiment** (HIGH): Test reranking with `rollup_text` field (~300 chars/lesson) - already has good length for cross-encoder.
3. **Unit search testing**: Create ground truth and smoke tests for unit search quality.
4. **Lesson reranking**: Deferred - requires upstream API `rerank_summary` field. See `upstream-api-metadata-wishlist.md`.

---

## Next Steps

### Phase 2 Complete: Two-Way Hybrid Confirmed Optimal

Extensive experimentation evaluated:

- ✅ Three-way hybrid (E5 dense vectors) - No improvement, slight degradation
- ✅ RRF parameter tuning - Minimal impact across all configurations
- ✅ Reranking - Requires field with more semantic content than titles

**Decision: Proceed with two-way hybrid (BM25 + ELSER)** as production configuration.

### Remaining Options to Improve NDCG

| Option                       | Description                                                      | Effort | Expected Gain   |
| ---------------------------- | ---------------------------------------------------------------- | ------ | --------------- |
| A. Accept 0.716              | Good enough for demo                                             | None   | —               |
| B. Ground truth review       | Ensure expectations match reality                                | Low    | Validation      |
| C. Combined rerank field     | Add `rerank_text` field (title + keywords + key_learning_points) | Medium | Unknown         |
| D. Unit search investigation | Evaluate reranking with `rollup_text`                            | Low    | Separate metric |

**Recommendation**: Accept current results for demo. Ground truth review may reveal unrealistic expectations.

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

## Comparison Framework

```text
┌────────────────────────────────────────────────────────────────────────────┐
│                        SEARCH APPROACH COMPARISON                          │
├────────────────────────────────────────────────────────────────────────────┤
│  1. LEXICAL ONLY (BM25)                                   ← MEASURED       │
│     • Fuzzy matching (fuzziness: 'AUTO')                                   │
│     • Query-time synonyms (oak_text_search analyzer)                       │
│     • MRR: 0.920 | NDCG: 0.690                                             │
├────────────────────────────────────────────────────────────────────────────┤
│  2. TWO-WAY HYBRID (BM25 + ELSER)                    ✅ RECOMMENDED        │
│     • RRF combines lexical + sparse vector                                 │
│     • MRR: 0.900 | NDCG: 0.716 | Latency: 153ms                            │
│     • Best balance of quality and performance                              │
├────────────────────────────────────────────────────────────────────────────┤
│  3. THREE-WAY HYBRID (BM25 + ELSER + E5)                  ← MEASURED       │
│     • RRF combines lexical + sparse + dense vectors                        │
│     • MRR: 0.892 | NDCG: 0.715 | Latency: 180ms                            │
│     • Result: No improvement, slight degradation                           │
├────────────────────────────────────────────────────────────────────────────┤
│  4. WITH RERANKING (.rerank-v1-elasticsearch)             ← MEASURED       │
│     • 2-way + rerank: MRR: 0.893 | NDCG: 0.683 | Latency: 1546ms           │
│     • 3-way + rerank: MRR: 0.888 | NDCG: 0.681 | Latency: 808ms            │
│     • Result: Reranking on lesson_title DECREASES quality                  │
│     • Note: Would need combined field for effective reranking              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Files

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/search-quality/
│   ├── ground-truth/              # Modular ground truth
│   │   ├── algebra.ts             # Algebra queries
│   │   ├── geometry.ts            # Geometry queries
│   │   ├── number.ts              # Number queries
│   │   ├── graphs.ts              # Graphs queries
│   │   ├── statistics.ts          # Statistics queries
│   │   ├── edge-cases.ts          # Misspellings, NL queries
│   │   ├── types.ts               # GroundTruthQuery interface
│   │   └── index.ts               # Combined exports
│   ├── ground-truth.ts            # Legacy wrapper
│   ├── metrics.ts                 # MRR, NDCG calculations (13 unit tests)
│   └── index.ts                   # Public exports
└── smoke-tests/
    └── search-quality.smoke.test.ts  # Benchmark suite
```

### RRF Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
├── rrf-query-builders-three-way.ts # Three-way (for Phase 2)
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
├── geography.ts        # Geography concepts
├── maths.ts            # Maths operations
└── index.ts            # Barrel file (exports synonymsData)
```

**Synonym Architecture**: Query-time only (BM25 benefits, ELSER does not). See `docs/SYNONYMS.md`.

---

## Quality Gates

Run after every piece of work, from repo root, in order:

```bash
pnpm i                                            # Install dependencies
pnpm type-gen                                     # Generate types
pnpm build                                        # Build all
pnpm type-check                                   # TypeScript validation
pnpm lint -- --fix                                # Auto-fix linting
pnpm -F @oaknational/oak-curriculum-sdk docs:all  # Generate SDK docs
pnpm format                                       # Format code
pnpm markdownlint                                 # Markdown lint
pnpm test                                         # Unit + integration
pnpm test:e2e                                     # E2E tests
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

---

## Testing Approach (Per Foundation Docs)

| Test Type       | Location                | Purpose                               | IO                |
| --------------- | ----------------------- | ------------------------------------- | ----------------- |
| **Unit**        | `*.unit.test.ts`        | Pure functions (metrics calculations) | None              |
| **Integration** | `*.integration.test.ts` | Code units working together           | None              |
| **Smoke**       | `smoke-tests/`          | Running system, real ES queries       | HTTP to localhost |

**TDD at all levels**: Write tests FIRST (RED → GREEN → REFACTOR).

**Smoke tests are NOT E2E tests**: They test a running system but are classified as smoke tests per `testing-strategy.md` because they make real network calls.

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

**Ready?** Follow the [Ingestion Guide](../../apps/oak-open-curriculum-semantic-search/docs/INGESTION-GUIDE.md) to re-index lessons, then run smoke tests to measure two-way hybrid improvement over lexical baseline.
