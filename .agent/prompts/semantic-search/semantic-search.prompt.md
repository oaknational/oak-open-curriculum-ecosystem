# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 Complete | 3/4 Targets Met | Decision Point  
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

- `.agent/plans/semantic-search/phase-1-foundation.md` - ✅ Complete
- `.agent/plans/semantic-search/phase-2-dense-vectors.md` - ⏸️ If needed
- `.agent/plans/semantic-search/phase-3-plus-roadmap.md` - 📋 Future

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

### Ground Truth ✅ COMPREHENSIVE

Ground truth reviewed and expanded using MCP curriculum tools:

- Comprehensive KS4 Maths coverage (algebra, geometry, number, graphs, statistics)
- Modular structure: `ground-truth/algebra.ts`, `geometry.ts`, `number.ts`, etc.
- Edge cases included (misspellings, natural language queries)

### Synonyms ✅ REFACTORED

SDK synonyms extracted into modular themed files:

- Location: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`
- Added `numbers` group to ES export (enables "squared" → "quadratic" matching)
- Documentation: `apps/oak-open-curriculum-semantic-search/docs/SYNONYMS.md`

---

## Baseline Results (2025-12-10, after ground truth review)

| Metric        | Result    | Target  | Status   |
| ------------- | --------- | ------- | -------- |
| MRR           | **0.893** | > 0.70  | ✅ PASS  |
| NDCG@10       | 0.648     | > 0.75  | ❌ Below |
| Zero-hit rate | **0.0%**  | < 10%   | ✅ PASS  |
| p95 Latency   | 28ms      | < 300ms | ✅ PASS  |

**3 of 4 targets met.** See `phase-1-foundation.md` for per-query breakdown.

### Key Findings

1. **Fuzzy matching working** - "pythagorus" misspelling returns correct results
2. **Cache issue resolved** - stale Next.js cache was causing false zero-hits
3. **Semantic gap identified** - "x squared" doesn't match "quadratic" (synonym added, needs ES sync)

---

## Next Steps

### 1. Sync Synonyms to Elasticsearch

The `squared → quadratic` synonym has been added to SDK but needs deployment:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm elastic:setup  # Push updated synonyms to ES
```

### 2. Run Smoke Tests (Requires Running Server)

```bash
# Terminal 1: Start the server
cd apps/oak-open-curriculum-semantic-search
rm -rf .next  # Clear cache (important!)
pnpm dev

# Terminal 2: Run smoke tests
cd apps/oak-open-curriculum-semantic-search
pnpm test:smoke
```

**Note**: Smoke tests make HTTP calls to `localhost:3003`. Server must be running.

### 3. Establish Repeatable Baseline

Before evaluating dense vectors (Phase 2), we need:

1. **Stable metrics** - run smoke tests multiple times, ensure consistency
2. **Synonym sync complete** - verify with ES analyse API
3. **Documented baseline** - record metrics with timestamp for comparison

Dense vectors will be evaluated regardless of Phase 1 metrics - we need empirical data to make informed architecture decisions.

### 4. Proceed to Phase 2 Evaluation

See `phase-2-dense-vectors.md` for three-way hybrid (BM25 + ELSER + E5).

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

**Ready?** Sync synonyms to ES, then run smoke tests to establish baseline metrics.
