# Semantic Search - Fresh Chat Entry Point

**Status**: Phase 1 Complete | Ready for Baseline Metrics  
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

### Ground Truth ✅ FIXED

Ground truth expectations based on **upstream Oak API content**:

- Pythagoras queries expect Pythagoras lessons from `right-angled-trigonometry` unit
- Trigonometry queries expect trig lessons (sine, cosine, tangent ratios)

### Test Classification ✅ FIXED

- Search quality tests moved to `smoke-tests/` (proper classification per testing-strategy.md)
- Smoke tests make HTTP calls to running server
- Fail fast with clear error if server not available (no skipping)

---

## Next Steps

1. **Run smoke tests** to establish baseline metrics:

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   pnpm dev  # Start server in one terminal
   pnpm test:smoke  # Run benchmarks in another
   ```

2. **Decision Point**:
   - **If targets met** (MRR > 0.70, NDCG@10 > 0.75): Stay with two-way hybrid
   - **If targets not met**: Proceed to Phase 2

---

## Key Files

### Search Quality

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/search-quality/
│   ├── ground-truth.ts   # Query expectations (FIXED)
│   ├── metrics.ts        # MRR, NDCG calculations
│   └── index.ts          # Public exports
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

## Remember

1. **TDD is mandatory** - Write tests FIRST (RED → GREEN → REFACTOR)
2. **Schema-first** - All types flow from field definitions via `pnpm type-gen`
3. **No type shortcuts** - No `as`, `any`, `!`, `Record<string, unknown>`
4. **No skipped tests** - Fix it or delete it
5. **Fail fast** - Clear error messages, no silent failures
6. **Simpler first** - Only add complexity when validated necessary

---

**Ready?** Run smoke tests to establish baseline metrics.
