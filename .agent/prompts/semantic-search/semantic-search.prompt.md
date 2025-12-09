# Semantic Search - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Quick start for Maths KS4 semantic search implementation  
**Status**: Phase 1D Complete ✅ - Ready for Baseline Metrics (Phase 1C NOT STARTED)

---

## Quick Start

**Current Phase**: Baseline Metrics (Phase 1C) ← NOT STARTED

**Implementation Status**:

1. **Phase 1A: Data Ingestion** ✅ COMPLETE
   - ✅ Maths KS4 ingested (100 lessons, 36 units, 36 rollups)
   - ✅ Dense vectors generated successfully
   - ✅ All quality gates passing
   - ⚠️ Programme factors NOT populated (expected - not in this dataset)

2. **Phase 1B: RRF API Update** ✅ COMPLETE (2025-12-08)
   - ✅ Updated to ES 8.11+ `retriever` API
   - ✅ Two-way RRF query builders updated
   - ✅ Three-way RRF query builders updated
   - ✅ Validated against live ES Serverless

3. **Phase 1D: Missing Indices** ✅ COMPLETE (2025-12-09)
   - ✅ `oak_threads` mapping generator created
   - ✅ `oak_sequences` document builder implemented
   - ✅ `oak_threads` document builder implemented + API integration
   - ✅ Reference index mappings generated (`oak_ref_subjects`, `oak_ref_key_stages`, `oak_curriculum_glossary`)
   - ✅ Reference document builders implemented with TDD

4. **Phase 1C: Baseline Metrics** ← NOT STARTED
   - Create `e2e-tests/` and `src/lib/search-quality/` directories
   - Establish baseline with two-way hybrid (BM25 + ELSER)
   - Calculate MRR, NDCG@10, zero-hit rate, latency
   - Duration: 0.5-1 day

5. **Phase 2: Evaluate Dense Vectors** (only if two-way insufficient)
   - Dense vector infrastructure already built ✅
   - Only activate if Phase 1C baseline doesn't meet targets
   - Duration: 0.5 day

6. **Phase 3: Reference Indices** (Future)
   - Populate `oak_ref_subjects`, `oak_ref_key_stages`, `oak_curriculum_glossary`
   - Data source: Existing ontology data (`ontology-data.ts`, `knowledge-graph-data.ts`)
   - No stats extraction needed - use static curriculum metadata
   - Duration: 0.5-1 day

7. **Phase 4+**: Additional features (ReRank, filtered kNN, etc.)
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
- ✅ Two-way RRF query builders (BM25 + ELSER) - **updated to `retriever` API**
- ✅ Three-way RRF query builders (BM25 + ELSER + Dense) - **updated to `retriever` API**
- ✅ Document transforms with programme factor extraction
- ✅ Ingestion CLI validated (`pnpm es:ingest-live`)
- ✅ All quality gates passing (1,310+ tests)

**Phase 1B Complete** (2025-12-08):

- ✅ RRF query builders updated from deprecated `rank` API to ES 8.11+ `retriever` API
- ✅ Two-way hybrid search validated against live ES Serverless
- ✅ Query returned 21 results for "pythagoras theorem"

**Next Steps** (Phase 1C):

- [ ] Test two-way hybrid search with representative queries
- [ ] Establish baseline metrics (MRR, NDCG@10, zero-hit, latency)
- [ ] Decide: two-way sufficient OR evaluate three-way

---

## Known Issues Requiring Resolution

The following issues were identified during deep review (2025-12-09) and must be addressed before proceeding with Phase 1C or later phases.

### Category 1: Schema/Field Issues

| ID  | Issue                                                                        | Location                                                                                                                                                | Fix Required                                                                |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| 1.1 | Missing `pathway` field in unit_rollup                                       | `field-definitions/curriculum.ts`, `unit-rollup-overrides.ts`                                                                                           | Add pathway field to UNIT_ROLLUP_INDEX_FIELDS and overrides                 |
| 1.2 | `thread_slugs`, `thread_titles`, `thread_orders` defined but never populated | `document-transforms.ts`                                                                                                                                | Extract thread data from API response and populate in unit rollup documents |
| 1.3 | Dense vector field naming inconsistency                                      | `lessons-overrides.ts` has `lesson_dense_vector` and `title_dense_vector`; `unit-rollup-overrides.ts` has `unit_dense_vector` and `rollup_dense_vector` | Document convention in TSDoc comments                                       |

### Category 2: Aggregation/Facet Issues

| ID  | Issue                                           | Location                                      | Fix Required                                                   |
| --- | ----------------------------------------------- | --------------------------------------------- | -------------------------------------------------------------- |
| 2.1 | Lesson facets missing tier, exam_board, pathway | `rrf-query-helpers.ts` createLessonFacets()   | Add aggregations for these fields                              |
| 2.2 | No unit facets exist                            | `rrf-query-builders.ts` buildUnitRrfRequest() | Create createUnitFacets() function and add to unit RRF builder |
| 2.3 | Sequence facets defined but unused              | `rrf-query-helpers.ts` createSequenceFacets() | Document as future work in plans                               |

### Category 3: Data Integrity Issues

| ID  | Issue                                | Location                                    | Fix Required                                                                  |
| --- | ------------------------------------ | ------------------------------------------- | ----------------------------------------------------------------------------- |
| 3.1 | Hardcoded `subjectSlugs: ['maths']`  | `thread-bulk-helpers.ts` line 21            | Dynamic subject extraction from thread data                                   |
| 3.2 | `buildThreadOps` returns `unknown[]` | `thread-bulk-helpers.ts`                    | Replace with specific type from schema (type broadening violation)            |
| 3.3 | Rollup text missing pedagogical data | `document-transforms.ts` createRollupText() | Include unit-level prior knowledge, key concepts, national curriculum content |

### Category 4: Phase/Status Issues

| ID  | Issue                                     | Location      | Fix Required                                                                                      |
| --- | ----------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------- |
| 4.1 | Phase 1C marked "CURRENT" but not started | Multiple docs | Change status to NOT STARTED (DONE in this update)                                                |
| 4.2 | Missing search-quality infrastructure     | N/A           | Create `e2e-tests/` and `src/lib/search-quality/` directories with ground-truth.ts and metrics.ts |
| 4.3 | Missing IR metrics implementation         | N/A           | Implement per TDD approach (write failing tests FIRST)                                            |

### All Issues Are Blocking

**All 12 issues are strategically vital and must be resolved before Phase 1C can proceed.**

Issue IDs: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 4.1, 4.2, 4.3

---

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

### Phase 1C: Establish Baseline Metrics ← NOT STARTED

**Goal**: Measure two-way hybrid (BM25 + ELSER) search quality.

**BLOCKING**: Before starting Phase 1C, resolve ALL 12 Known Issues (1.1-1.3, 2.1-2.3, 3.1-3.3, 4.2-4.3) listed in the Known Issues section above.

**📖 MUST READ**: See **`.agent/plans/semantic-search/reference-ir-metrics-guide.md`** for:

- What MRR and NDCG@10 mean (plain English explanations)
- How to create ground truth (relevance judgments)
- Metrics calculation code (copy-paste ready)
- E2E test suite template

---

#### Quick Summary of Metrics

| Metric          | What It Measures                          | Target  | Interpretation                        |
| --------------- | ----------------------------------------- | ------- | ------------------------------------- |
| **MRR**         | How quickly first relevant result appears | > 0.70  | First relevant result in position 1-2 |
| **NDCG@10**     | Overall ranking quality of top 10         | > 0.75  | Highly relevant results near top      |
| **Zero-hit**    | % of queries with no results              | < 10%   | Most queries return something         |
| **p95 latency** | Response time (95th percentile)           | < 300ms | Good user experience                  |

---

#### Implementation Steps

**Step 0: Discover actual data** (MUST DO FIRST)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm dev &  # Start server
sleep 5
npx tsx scripts/discover-lessons.ts  # Create this script - see reference doc
```

This shows you actual lesson slugs in Maths KS4 - you need these for ground truth.

**Step 1: Create ground truth** - Judge relevance of actual results

- File: `src/lib/search-quality/ground-truth.ts`
- Use slugs from Step 0, NOT placeholder slugs
- Score each result: 3=perfect, 2=good, 1=maybe, 0=wrong (implicit)

**Step 2: Implement metrics** - MRR and NDCG calculation

- File: `src/lib/search-quality/metrics.ts`
- Copy code from reference doc

**Step 3: Create E2E test suite**

- File: `e2e-tests/search-quality.e2e.test.ts`
- Uses POST `/api/search` with `scope: 'lessons'`

**Step 4: Run and record**

```bash
pnpm test:e2e -- search-quality
```

**Step 5: Analyze and decide**

- **If targets met** (MRR > 0.70, NDCG@10 > 0.75) → Proceed with two-way, skip Phase 2
- **If targets not met** → Evaluate three-way hybrid (Phase 2)
- **Document decision** in ADR

### Phase 2: Three-Way Hybrid (Only If Two-Way Insufficient)

**Pre-condition**: Phase 1C baseline doesn't meet quality targets.

**Already Built**:

- ✅ Dense vector generation working
- ✅ Three-way RRF query builders implemented (updated to `retriever` API)
- ✅ Dense vectors in Maths KS4 data

**Steps**:

1. Test three-way hybrid search (already updated to `retriever` API)
2. Compare metrics against Phase 1C baseline
3. Document decision in ADR
4. Duration: 0.5 day

### Phase 3: Reference Indices (Future)

**Purpose**: Populate reference indices with curriculum metadata for faceted navigation and glossary search.

**Indices**:

| Index                     | Data Source                                   | Purpose             |
| ------------------------- | --------------------------------------------- | ------------------- |
| `oak_ref_subjects`        | `ontologyData.curriculumStructure.subjects`   | Subject metadata    |
| `oak_ref_key_stages`      | `ontologyData.curriculumStructure.keyStages`  | Key stage metadata  |
| `oak_curriculum_glossary` | `ontologyData.synonyms` + concept definitions | Vocabulary/glossary |

**Data Already Available**:

- ✅ ES mappings generated for all 3 indices
- ✅ Document builders implemented with TDD
- ✅ Source data exists in `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`
- ✅ Concept relationships in `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

**Implementation**: Simple transformation from existing static ontology data - NO extraction or aggregation during ingestion needed.

**Steps**:

1. Create importers that read from `ontology-data.ts` and `knowledge-graph-data.ts`
2. Transform to ES documents using existing builders
3. Add to ingestion pipeline as simple step
4. Duration: 0.5-1 day

---

## Key File Locations

### SDK (Type Generation)

```text
packages/sdks/oak-curriculum-sdk/
├── type-gen/typegen/search/
│   ├── field-definitions/
│   │   ├── curriculum.ts          ← ADD NEW FIELDS HERE
│   │   ├── thread.ts              ← Phase 1D: thread field defs
│   │   └── reference.ts           ← Phase 1D: ref index field defs
│   ├── es-field-overrides/        ← ES overrides (split structure)
│   │   ├── index.ts
│   │   ├── common.ts
│   │   ├── lessons-overrides.ts
│   │   ├── units-overrides.ts
│   │   ├── unit-rollup-overrides.ts
│   │   ├── threads-overrides.ts   ← Phase 1D: thread overrides
│   │   ├── reference-overrides.ts ← Phase 1D: ref index overrides
│   │   └── ... (other overrides)
│   ├── es-mapping-generators.ts   ← Mapping generators
│   ├── es-mapping-generators-reference.ts ← Ref index generators
│   └── zod-schema-generator.ts    ← Zod generator
├── src/types/generated/search/
│   └── es-mappings/               ← GENERATED (don't edit)
│       ├── oak-threads.ts         ← Phase 1D generated
│       ├── oak-ref-subjects.ts    ← Phase 1D generated
│       ├── oak-ref-key-stages.ts  ← Phase 1D generated
│       └── oak-curriculum-glossary.ts ← Phase 1D generated
└── src/mcp/
    ├── ontology-data.ts           ← Phase 3 data source for ref indices
    └── knowledge-graph-data.ts    ← Phase 3 data source for glossary
```

### App (Indexing & Search)

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/
│   ├── indexing/
│   │   ├── document-transform-helpers.ts
│   │   ├── document-transforms.ts
│   │   ├── dense-vector-generation.ts   ← For Phase 2 if needed
│   │   ├── sequence-document-builder.ts ← Phase 1D: oak_sequences docs
│   │   ├── sequence-bulk-helpers.ts     ← Phase 1D: sequence bulk ops
│   │   ├── thread-document-builder.ts   ← Phase 1D: oak_threads docs
│   │   ├── thread-bulk-helpers.ts       ← Phase 1D: thread API + bulk ops
│   │   └── reference-document-builders.ts ← Phase 3: ref index docs
│   ├── hybrid-search/
│   │   ├── rrf-query-builders.ts        ← Two-way (BM25 + ELSER)
│   │   ├── rrf-query-helpers.ts         ← Shared helpers
│   │   └── rrf-query-builders-three-way.ts ← Three-way (for Phase 2)
│   └── elasticsearch/
│       ├── client.ts
│       └── setup/
│           ├── cli.ts
│           ├── cli-commands.ts
│           └── cli-output.ts
├── src/adapters/
│   ├── oak-adapter-sdk.ts        ← SDK client with thread APIs
│   └── oak-adapter-sdk-threads.ts ← Thread API functions
└── e2e-tests/                    ← E2E tests
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

### Phase 1B: RRF API Update ✅ COMPLETE (2025-12-08)

- [x] Researched ES 8.11+ `retriever` API syntax
- [x] Updated `rrf-query-builders.ts` to use new `retriever` API
- [x] Updated `rrf-query-builders-three-way.ts` to use new `retriever` API
- [x] Updated `elastic-http.ts` to support `retriever` property
- [x] Updated unit tests to expect new `retriever` structure
- [x] Validated two-way hybrid search against live ES Serverless
- [x] All quality gates passing

### Phase 1C: Baseline Metrics ← NOT STARTED

**Prerequisites** (All 12 Issues Must Be Resolved First):

- [ ] Issue 1.1: Add pathway field to unit_rollup schema
- [ ] Issue 1.2: Populate thread_slugs/titles/orders in unit rollup documents
- [ ] Issue 1.3: Document dense vector naming convention in TSDoc
- [ ] Issue 2.1: Add tier, exam_board, pathway to createLessonFacets()
- [ ] Issue 2.2: Create createUnitFacets() function
- [ ] Issue 2.3: Document sequence facets as future work
- [ ] Issue 3.1: Replace hardcoded ['maths'] with dynamic subject extraction
- [ ] Issue 3.2: Fix buildThreadOps return type from unknown[] to specific type
- [ ] Issue 3.3: Include pedagogical data in rollup text
- [ ] Issue 4.2: Create e2e-tests/ and src/lib/search-quality/ directories
- [ ] Issue 4.3: Implement ground-truth.ts and metrics.ts with TDD

**Phase 1C Tasks**:

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
