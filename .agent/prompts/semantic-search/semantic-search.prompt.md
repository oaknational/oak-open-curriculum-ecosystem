# Semantic Search - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Quick start for Maths KS4 semantic search implementation  
**Status**: Maths KS4 Ingested ✅ - RRF API Update Required

---

## Quick Start

**Current Phase**: RRF API Update Required → Then Baseline Metrics

**Implementation Status**:

1. **Phase 1A: Data Ingestion** ✅ COMPLETE
   - ✅ Maths KS4 ingested (100 lessons, 36 units, 36 rollups)
   - ✅ Dense vectors generated successfully
   - ✅ All quality gates passing
   - ⚠️ Programme factors NOT populated (expected - not in this dataset)

2. **Phase 1B: RRF API Update** ← CURRENT BLOCKER
   - 🔴 RRF query builders use deprecated `rank` API
   - 🔴 ES 8.11+ requires new `retriever` API
   - Must fix before two-way hybrid can be tested
   - Duration: 0.5-1 day

3. **Phase 1C: Baseline Metrics**
   - Establish baseline with two-way hybrid (BM25 + ELSER)
   - Calculate MRR, NDCG@10, zero-hit rate, latency
   - Duration: 0.5-1 day

4. **Phase 2: Evaluate Dense Vectors** (only if two-way insufficient)
   - Dense vector infrastructure already built ✅
   - Only activate if Phase 1C baseline doesn't meet targets
   - Duration: 0.5 day

5. **Phase 3+**: Additional features (ReRank, filtered kNN, etc.)
   - Only proceed after validating foundation

**First Question**: Could it be simpler? Start with two-way hybrid. Only add complexity if it delivers measurable value.

---

## Critical Reading Order

**MUST READ BEFORE ANY WORK**:

1. **`.agent/directives-and-memory/rules.md`** (5 min)
   - TDD mandatory (RED → GREEN → REFACTOR)
   - No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
   - Quality gates must ALL pass
   - Functions ≤8 complexity, files ≤250 lines

2. **`.agent/directives-and-memory/schema-first-execution.md`** (3 min)
   - ALL types flow from field definitions via `pnpm type-gen`
   - Never edit generated files
   - Update generators only

3. **`.agent/directives-and-memory/testing-strategy.md`** (5 min)
   - Unit tests: Pure functions, NO IO, NO mocks
   - Integration tests: IMPORTED code, SIMPLE mocks injected as arguments
   - E2E tests: Running system in separate process

4. **`.agent/plans/semantic-search/maths-ks4-implementation-plan.md`** (30 min) ⭐ **MAIN PLAN**
   - Complete roadmap for implementation
   - Field definitions, extraction functions, ES queries
   - TDD approach, ADRs, success criteria

**Foundation Document Checkpoint**: After every 2-3 features or when stuck, re-read rules.md, schema-first-execution.md, and testing-strategy.md.

---

## Current State Summary

### Phase 1A Complete ✅

**Maths KS4 Ingestion** (2025-12-08):

- ✅ **100 lessons** indexed with ELSER semantic_text
- ✅ **36 units** indexed
- ✅ **36 unit rollups** indexed with dense vectors
- ✅ **1 sequence facet** indexed
- ✅ Dense vectors generated successfully (384-dim E5)
- ✅ Basic BM25 search validated with representative queries
- ✅ All ES mappings compatible with app data definitions
- ℹ️ Programme factors (tier/exam_board/pathway) defined but not populated (expected)

**Infrastructure Built**:

- ✅ ELSER sparse embeddings configured (`.elser-2-elasticsearch`)
- ✅ Dense vector generation working (`.multilingual-e5-small-elasticsearch`)
- ✅ Two-way RRF query builders (BM25 + ELSER) - **needs API update**
- ✅ Three-way RRF query builders (BM25 + ELSER + Dense) - **ready for Phase 2**
- ✅ Document transforms with programme factor extraction
- ✅ Ingestion CLI validated (`pnpm es:ingest-live`)
- ✅ All quality gates passing (1,310+ tests)

**Current Blocker**:

- 🔴 RRF query builders use deprecated `rank` API (ES 8.11+ requires `retriever`)
- 🔴 Two-way hybrid search cannot be tested until RRF API updated

**Next Steps**:

- [ ] Update RRF query builders to use `retriever` API
- [ ] Test two-way hybrid search (BM25 + ELSER)
- [ ] Establish baseline metrics (MRR, NDCG@10)
- [ ] Decide: two-way sufficient OR evaluate three-way

### ES Serverless Status

**Deployment**: Elasticsearch Serverless operational (ES 8.11.0)  
**Indexes**: 6 indexes with Maths KS4 data (173 documents)  
**Last Ingestion**: 2025-12-08 14:19:38 (Maths KS4)  
**Inference Endpoints Available**:

| Endpoint                               | Type             | Status        | Use Case            |
| -------------------------------------- | ---------------- | ------------- | ------------------- |
| `.elser-2-elasticsearch`               | sparse_embedding | PRECONFIGURED | ELSER semantic ✅   |
| `.multilingual-e5-small-elasticsearch` | text_embedding   | PRECONFIGURED | Dense vectors (TBD) |
| `.rerank-v1-elasticsearch`             | rerank           | TECH PREVIEW  | ReRank (later)      |

**Quality Gates**: All 10 gates passing (1,310+ tests)

---

## Next Steps

### Phase 1B: Fix RRF API (Immediate Blocker)

**Status**: ✅ Data ingested, 🔴 RRF API blocking two-way hybrid testing

**Current Issue**:

```typescript
// Old API (deprecated in ES 8.11+)
{
  rank: {
    rrf: { window_size: 60, rank_constant: 60 },
    queries: [...]
  }
}
```

**Error**:

```
parsing_exception: Unknown key for a START_OBJECT in [rank]
Deprecated field [rank] used, replaced by [retriever]
```

**Fix Required**:

1. Research ES 8.11+ `retriever` API syntax for RRF
2. Update `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders.ts`
3. Update `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders-three-way.ts`
4. Test with Maths KS4 data
5. Duration: 0.5-1 day

**Files to Update**:

- `rrf-query-builders.ts` (two-way: BM25 + ELSER)
- `rrf-query-builders-three-way.ts` (three-way: BM25 + ELSER + Dense)

### Phase 1C: Establish Baseline Metrics (After RRF Fix)

**Goal**: Measure two-way hybrid (BM25 + ELSER) search quality.

#### Step 1: Test Two-Way Hybrid Search

Representative queries (already validated with basic BM25):

- "quadratic equations" ✅ Works with BM25
- "Pythagoras theorem" ✅ Works with BM25
- "trigonometry" ✅ Works with BM25
- "solving simultaneous equations" ✅ Works with BM25
- "expanding brackets algebra" ✅ Works with BM25

#### Step 2: Measure Baseline Metrics

Create E2E test to capture:

- **Mean Reciprocal Rank (MRR)** - Target: > 0.70
- **NDCG@10** - Target: > 0.75
- **Zero-hit rate** - Target: < 10%
- **p95 latency** - Target: < 300ms

#### Step 3: Decision Point

**If two-way meets targets**:

- ✅ Proceed with two-way as production approach
- ✅ Skip Phase 2 (dense vectors)
- ✅ Document decision in ADR
- ✅ Move to Phase 3+ features

**If two-way doesn't meet targets**:

- Move to Phase 2: Enable three-way hybrid
- Dense vector infrastructure already built ✅
- Compare three-way vs two-way metrics
- Document decision

### Phase 2: Three-Way Hybrid (Only If Two-Way Insufficient)

**Pre-condition**: Phase 1C baseline doesn't meet quality targets.

**Already Built**:

- ✅ Dense vector generation working
- ✅ Three-way RRF query builders implemented
- ✅ Dense vectors in Maths KS4 data

**Steps**:

1. Update three-way RRF builders with new `retriever` API
2. Test three-way hybrid search
3. Compare metrics against Phase 1C baseline
4. Document decision in ADR
5. Duration: 0.5 day

---

## Key File Locations

### SDK (Type Generation)

```
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/
│   ├── field-definitions/
│   │   └── curriculum.ts          ← ADD NEW FIELDS HERE
│   ├── es-field-overrides/        ← ES overrides (split structure)
│   │   ├── index.ts
│   │   ├── common.ts
│   │   ├── lessons-overrides.ts
│   │   ├── units-overrides.ts
│   │   ├── unit-rollup-overrides.ts
│   │   └── ... (other overrides)
│   ├── es-mapping-from-fields.ts  ← Mapping generator
│   └── zod-schema-generator.ts    ← Zod generator
└── src/types/generated/search/    ← GENERATED (don't edit)
```

### App (Indexing & Search)

```
apps/oak-open-curriculum-semantic-search/
├── src/lib/
│   ├── indexing/
│   │   ├── document-transform-helpers.ts
│   │   ├── document-transforms.ts
│   │   └── dense-vector-generation.ts  ← For Phase 2 if needed
│   ├── hybrid-search/
│   │   ├── rrf-query-builders.ts       ← Two-way (BM25 + ELSER)
│   │   └── rrf-query-builders-three-way.ts  ← Three-way (for Phase 2)
│   └── elasticsearch/
│       ├── client.ts
│       └── setup/
│           ├── cli.ts
│           ├── cli-commands.ts
│           └── cli-output.ts
└── e2e-tests/                   ← E2E tests
```

---

## Quality Gates

Run after EVERY piece of work, one at a time, with no filters:

```bash
pnpm type-gen          # Makes changes
pnpm build             # Makes changes
pnpm type-check        # Zero type errors
pnpm lint:fix          # Makes changes
pnpm format:root       # Makes changes
pnpm markdownlint:root # Makes changes
pnpm test              # 1,310+ tests must pass
pnpm test:e2e          # E2E in dev mode
pnpm test:e2e:built    # E2E with built code
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

**NO EXCEPTIONS**. If any gate fails, STOP and fix before proceeding.

---

## Troubleshooting Quick Reference

| Problem                            | Solution                                                 |
| ---------------------------------- | -------------------------------------------------------- |
| `strict_dynamic_mapping_exception` | Add field to `field-definitions.ts`, run `pnpm type-gen` |
| Generator/generated drift          | Update generators, never edit generated files            |
| Lint errors after `type-gen`       | Fix generator templates                                  |
| Tests failing                      | Run quality gates one at a time to isolate               |
| Port conflict in smoke tests       | Kill process using port 3333                             |
| ES Serverless `_cluster/health`    | Use `/` or `/_cat/indices?v` instead                     |

---

## Documentation Links

### Primary Documents

| Document                               | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| **`maths-ks4-implementation-plan.md`** | Complete implementation roadmap (MAIN PLAN) |
| **`README.md`**                        | Navigation hub for all planning docs        |
| **`data-completeness-policy.md`**      | What data we upload in full                 |
| **`es-serverless-feature-matrix.md`**  | Feature tracking matrix                     |

### Foundation Documents (Re-read Regularly)

| Document                        | Purpose                               |
| ------------------------------- | ------------------------------------- |
| **`rules.md`**                  | TDD, quality gates, no type shortcuts |
| **`schema-first-execution.md`** | All types from field definitions      |
| **`testing-strategy.md`**       | Test types and TDD approach           |

### ADRs Written

| ADR     | Title                                | Status      |
| ------- | ------------------------------------ | ----------- |
| **071** | Elastic-Native Dense Vector Strategy | ✅ Complete |
| **072** | Three-Way Hybrid Search Architecture | ✅ Complete |
| **073** | Dense Vector Field Configuration     | ✅ Complete |
| **074** | Elastic-Native First Philosophy      | ✅ Complete |

---

## Environment Setup

**Required Variables** in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

**Verify Setup**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Check ES connection and indexes
```

---

## Success Criteria

### Phase 1A: Data Ingestion ✅ COMPLETE

- [x] Maths KS4 ingested (100 lessons, 36 units, 36 rollups)
- [x] All 6 indexes have Maths KS4 data (173 documents total)
- [x] Dense vectors generated successfully
- [x] Basic BM25 search validated with representative queries
- [x] All quality gates passing
- ℹ️ Tier/exam_board/pathway fields defined but not populated (expected for this dataset)

### Phase 1B: RRF API Update (In Progress)

- [ ] Research ES 8.11+ `retriever` API syntax
- [ ] Update `rrf-query-builders.ts` to use new API
- [ ] Update `rrf-query-builders-three-way.ts` to use new API
- [ ] Test two-way hybrid search with Maths KS4

### Phase 1C: Baseline Metrics (Next)

- [ ] Two-way hybrid baseline metrics established
- [ ] MRR, NDCG@10, zero-hit rate, latency measured
- [ ] Search quality validated with test queries
- [ ] Decision documented: two-way sufficient OR proceed to Phase 2

### Full Project Complete When:

- [ ] Production-ready search for Maths KS4
- [ ] MRR: target > 0.70
- [ ] NDCG@10: target > 0.75
- [ ] Zero-hit rate: <10%
- [ ] p95 latency: <300ms
- [ ] All quality gates passing

---

## What To Do If Stuck

1. **Re-read foundation documents** - rules.md, schema-first, testing-strategy
2. **Check main plan** - maths-ks4-implementation-plan.md for detailed guidance
3. **Review existing patterns** - Look at similar implementations in codebase
4. **Run quality gates** - Isolate which gate is failing
5. **Check ADRs** - Previous decisions documented

---

**Remember**:

- TDD is mandatory (RED → GREEN → REFACTOR)
- All quality gates must pass
- No type shortcuts
- Schema-first approach for all types
- Re-read foundation documents regularly
- **Start simple (two-way), only add complexity if it delivers value**

**Now go build something deeply impressive.** 🚀

---

**End of Entry Point**
