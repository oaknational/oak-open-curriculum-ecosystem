# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 Complete | Two-Way Hybrid Measured | Phase 2 Decision Pending  
**Last Updated**: 2025-12-10

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
- `.agent/plans/semantic-search/phase-2-dense-vectors.md` - ⏸️ If needed
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

### Two-Way Hybrid (BM25 + ELSER) - Current (2025-12-10)

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.908** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.725     | > 0.75  | ❌ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| p95 Latency   | **198ms** | < 300ms | ✅ PASS  |

**3 of 4 targets met.** NDCG improved but still 2.5% below target.

### Comparison: Lexical vs Two-Way Hybrid

| Metric      | Lexical (BM25) | Two-Way Hybrid | Change       |
| ----------- | -------------- | -------------- | ------------ |
| MRR         | 0.920          | 0.908          | -1.3%        |
| NDCG@10     | 0.690          | 0.725          | **+5.1%** ✅ |
| p95 Latency | 322ms          | 198ms          | **-38%** ✅  |

### Analysis

**Good news:**

- NDCG@10 improved by 5.1% with ELSER semantic search
- Latency improved significantly (38% faster)
- All queries return results (0% zero-hit rate)

**Remaining gap:**

- NDCG still 2.5% below the 0.75 target
- MRR slightly decreased (likely noise, difference is small)

### Key Findings

1. **ELSER adds value** - 5.1% NDCG improvement validates hybrid approach
2. **Latency improved** - Fresh index performs better than stale data
3. **Fuzzy matching working** - "pythagorus" misspelling returns correct results
4. **Synonyms operational** - "squared" expands to "quadratic" at query time
5. **Semantic gap narrowed** - Natural language queries improved but room for more

---

## Next Steps

### Decision Point: Phase 2?

Two-way hybrid improved NDCG by 5.1% but still misses the 0.75 target by 2.5%.

**Options:**

| Option                 | Description                            | Effort | Expected Gain |
| ---------------------- | -------------------------------------- | ------ | ------------- |
| A. Accept 0.725        | Good enough for demo, defer Phase 2    | None   | —             |
| B. Tune RRF params     | Adjust rank_window_size, rank_constant | Low    | +1-2%         |
| C. Ground truth review | Ensure expectations match reality      | Low    | Validation    |
| D. Phase 2 (E5 dense)  | Three-way hybrid (BM25 + ELSER + E5)   | Medium | +5-10%        |

**Recommendation**: Try options B and C first (low effort). If NDCG remains below 0.75, proceed to Phase 2.

### If Proceeding to Phase 2

See `phase-2-dense-vectors.md` for three-way hybrid (BM25 + ELSER + E5).

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
│  2. TWO-WAY HYBRID (BM25 + ELSER)                         ← MEASURED       │
│     • RRF combines lexical + sparse vector                                 │
│     • MRR: 0.908 | NDCG: 0.725 (+5.1%)                                     │
│     • p95 Latency: 198ms (-38%)                                            │
├────────────────────────────────────────────────────────────────────────────┤
│  3. THREE-WAY HYBRID (BM25 + ELSER + E5)                  ← PHASE 2        │
│     • RRF combines lexical + sparse + dense vectors                        │
│     • Expected: Additional +5-10% NDCG                                     │
│     • Requires: Dense vector retriever enabled                             │
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

Run after every piece of work, from repo root:

```bash
pnpm type-gen          # Generate types
pnpm build             # Build all
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting
pnpm format:root       # Format root files
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit + integration
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built artifacts
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

All gates must pass.

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
