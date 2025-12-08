# Semantic Search - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Quick start for Maths KS4 semantic search implementation  
**Status**: Ready for Maths KS4 Two-Way Hybrid Ingestion

---

## Quick Start

**Current Phase**: Two-way hybrid search with Maths KS4 ingestion.

**Implementation Order** (simpler first):

1. **Phase 1: Two-Way Hybrid with Maths KS4** ← CURRENT FOCUS
   - Ingest Maths KS4 with BM25 + ELSER (two-way hybrid)
   - Establish baseline metrics (MRR, NDCG@10)
   - Validate search quality with simpler approach first
   - Duration: 1-2 days

2. **Phase 2: Evaluate Dense Vectors** (only if two-way insufficient)
   - If two-way baseline doesn't meet quality targets, add E5 dense vectors
   - Compare three-way vs two-way metrics
   - Document decision in ADR
   - Duration: 1 day

3. **Phase 3+**: Additional features (ReRank, filtered kNN, etc.)
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

### Infrastructure Ready ✅

**Built**:

- ✅ ELSER sparse embeddings configured (`.elser-2-elasticsearch`)
- ✅ Two-way RRF query builders (BM25 + ELSER) implemented
- ✅ Tier, exam_board, pathway field extraction for Maths KS4
- ✅ Document transforms ready
- ✅ Ingestion CLI ready (`pnpm es:ingest-live`)
- ✅ All quality gates passing (1,310+ tests)

**NOT YET DONE**:

- [ ] Maths KS4 data ingested
- [ ] Two-way hybrid search baseline metrics established
- [ ] Search quality validated

### ES Serverless Status

**Deployment**: Elasticsearch Serverless operational  
**Indexes**: 6 indexes with English KS2 test data  
**Inference Endpoints Available**:

| Endpoint                               | Type             | Status        | Use Case            |
| -------------------------------------- | ---------------- | ------------- | ------------------- |
| `.elser-2-elasticsearch`               | sparse_embedding | PRECONFIGURED | ELSER semantic ✅   |
| `.multilingual-e5-small-elasticsearch` | text_embedding   | PRECONFIGURED | Dense vectors (TBD) |
| `.rerank-v1-elasticsearch`             | rerank           | TECH PREVIEW  | ReRank (later)      |

**Quality Gates**: All 10 gates passing (1,310+ tests)

---

## Next Steps

### Phase 1: Two-Way Hybrid with Maths KS4 (1-2 days)

**Goal**: Validate that BM25 + ELSER (two-way hybrid) delivers good search quality before adding complexity.

#### Step 1: Ingest Maths KS4

```bash
cd apps/oak-open-curriculum-semantic-search

# Check prerequisites
pnpm es:status

# Ingest Maths KS4 with two-way hybrid (BM25 + ELSER)
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

**Expected**:

- ~50-100 lessons indexed
- ~15-25 units indexed
- ~15-25 unit rollups indexed
- Duration: 10-20 minutes

#### Step 2: Validate Search Quality

Test representative queries:

- "quadratic equations"
- "Pythagoras theorem"
- "trigonometry foundation tier"
- "solving simultaneous equations"
- "expanding brackets algebra"

#### Step 3: Establish Baseline Metrics

Create E2E test to capture:

- Mean Reciprocal Rank (MRR)
- NDCG@10
- Zero-hit rate
- p95 latency

#### Step 4: Decision Point

**If two-way delivers acceptable quality** (target: MRR > 0.70, NDCG@10 > 0.75):

- ✅ Proceed with two-way as production approach
- Document success in ADR
- Move to Phase 3+ features (ReRank, etc.)

**If two-way doesn't meet targets**:

- Move to Phase 2: Evaluate dense vectors
- Re-ingest with three-way hybrid
- Compare metrics

### Phase 2: Evaluate Dense Vectors (Only If Needed)

**Only proceed here if Phase 1 baseline doesn't meet quality targets.**

1. Enable dense vector generation during ingestion
2. Re-ingest Maths KS4 with three-way hybrid
3. Compare metrics against Phase 1 baseline
4. Document decision in ADR

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

### Phase 1 Complete When:

- [ ] Maths KS4 ingested with two-way hybrid (BM25 + ELSER)
- [ ] All 5 indexes have Maths KS4 data
- [ ] Tier/exam_board/pathway fields populated (>60% coverage)
- [ ] Two-way hybrid baseline metrics established
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
