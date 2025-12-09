# Semantic Search - Fresh Chat Entry Point

**Git Version**: See `git log` for commit history  
**Purpose**: Quick start for Maths KS4 semantic search implementation  
**Status**: Phase 1E (Search Foundation) ← **ARCHITECTURAL FIX REQUIRED** - Must implement before re-ingestion

---

## ⚠️ BLOCKING ISSUE (2025-12-09)

**Phase 1C (Baseline Metrics) CANNOT start until this is resolved:**

| ID      | Issue                                                                | Priority | Status               |
| ------- | -------------------------------------------------------------------- | -------- | -------------------- |
| **5.2** | **Lessons API pagination** - Only 5 of 36 lesson groups returned     | HIGH     | 🔧 NEEDS ARCH FIX    |
| **5.1** | Units missing `key_stage_slug` - investigation found naming mismatch | MEDIUM   | ✅ RESOLVED (naming) |
| **5.3** | No fuzzy matching configured - misspellings return 0 hits            | HIGH     | ✅ FIXED             |
| **5.4** | Thread canonical URL bug causing ingestion crashes                   | FIXED    | ✅ FIXED             |

### ROOT CAUSE ANALYSIS (2025-12-09)

**Issue 5.2: Lessons Not Being Indexed - REQUIRES ARCHITECTURAL FIX**

Investigation revealed the root cause:

1. **Symptom**: Only 100 lessons indexed despite 36 units being processed
2. **Ingestion Log**: Showed `units: 36` but `lessonGroups: 5` - mismatch!
3. **Root Cause**: The Oak API endpoint `/key-stages/{ks}/subject/{subject}/lessons` has **pagination** (limit 100, no offset parameter). It returns only 5 lesson groups (100 lessons), but Maths KS4 has 36 units worth of lessons.

**Current Data Flow (BROKEN)**:

```
/key-stages/ks4/subject/maths/lessons → Only returns 5 lesson groups (paginated)
                                        ↓
buildLessonDocuments() → Processes only those 5 groups
                                        ↓
Result: 31 units have ZERO lessons indexed (including Pythagoras/Trigonometry)
```

**Required Fix (ARCHITECTURAL CHANGE)**:

Derive lesson slugs from unit summaries instead of the incomplete lessons endpoint:

```
For each unit in /key-stages/ks4/subject/maths/units:
    1. Fetch unit summary → get unitLessons array (contains ALL lesson slugs)
    2. For each lesson slug in unitLessons:
        - Fetch /lessons/{slug}/summary → rich pedagogical data
        - Create lesson document with complete data
```

**Schema Comparison - What Data We Get**:

| Field                             | Unit Summary `unitLessons` | Lesson Summary (`/lessons/{slug}/summary`) |
| --------------------------------- | -------------------------- | ------------------------------------------ |
| `lessonSlug`                      | ✓                          | ✓ (via param)                              |
| `lessonTitle`                     | ✓                          | ✓                                          |
| `lessonOrder`                     | ✓                          | ✗                                          |
| `state`                           | ✓ (published/new)          | ✗                                          |
| `lessonKeywords`                  | ✗                          | ✓ (with descriptions)                      |
| `keyLearningPoints`               | ✗                          | ✓                                          |
| `misconceptionsAndCommonMistakes` | ✗                          | ✓                                          |
| `pupilLessonOutcome`              | ✗                          | ✓                                          |

**Conclusion**: We need BOTH - unit summaries for complete lesson list, lesson summaries for rich data.

**Files to Modify**:

- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts` - Change lesson source
- `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts` - May need new adapter function
- `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts` - Update data flow

### RESOLVED ISSUES

**5.1: key_stage field naming** ✅ RESOLVED

- Investigation found the code uses `key_stage` (not `key_stage_slug`) and correctly populates it
- The "only 5 of 25 units" symptom was misattributed - actual cause was Issue 5.2

**5.3: No fuzzy matching** ✅ FIXED (2025-12-09)

- Added `fuzziness: 'AUTO'` to BM25 `multi_match` queries
- Files modified:
  - `rrf-query-helpers.ts` - `createLessonBm25Retriever()`, `createUnitBm25Retriever()`
  - `rrf-query-builders.ts` - `createSequenceRetriever()`
  - `rrf-query-builders.unit.test.ts` - TDD tests added first
- All quality gates passing

**5.4: Thread canonical URL bug** ✅ FIXED (2025-12-09)

- Updated generator to return `null` for threads (no website equivalent)
- Throws `TypeError` for missing required context (fail-fast, per rules.md)
- Files modified:
  - `type-gen/typegen/routing/generate-url-helpers.ts` (generator)
  - `src/types/generated/api-schema/routing/url-helpers.ts` (regenerated)
  - `src/types/test-generated/url-helpers.unit.test.ts` (tests expect throws)
  - `src/response-augmentation.unit.test.ts` (tests expect throws)
  - `apps/oak-curriculum-mcp-stdio/src/tools/index.unit.test.ts` (proper mock data)
- All quality gates passing

---

## Quick Start

**Current Phase**: Phase 1E (Search Foundation) ← **IMPLEMENT ARCHITECTURAL FIX FIRST**

**⚠️ CRITICAL**: Cannot re-ingest data until the lessons API architectural fix is implemented. The current ingestion only gets 100 of ~500+ Maths KS4 lessons.

**Implementation Status**:

1. **Phase 1A: Data Ingestion** ⚠️ PARTIAL - NEEDS ARCHITECTURAL FIX
   - ✅ Ingestion pipeline works (100 lessons, 36 units, 36 rollups, 201 threads)
   - ✅ Dense vectors generated successfully
   - ✅ Ingestion completes without crashing (thread bug fixed)
   - ⚠️ **BLOCKING**: Only 5 of 36 lesson groups being fetched (API pagination issue)
   - ⚠️ **FIX REQUIRED**: Derive lessons from unit summaries, not paginated lessons endpoint
   - ℹ️ Programme factors NOT populated (expected - not in this dataset)

2. **Phase 1B: RRF API Update** ✅ COMPLETE (2025-12-08)
   - ✅ Updated to ES 8.11+ `retriever` API
   - ✅ Two-way RRF query builders updated
   - ✅ Three-way RRF query builders updated
   - ✅ Validated against live ES Serverless

3. **Phase 1D: Missing Indices** ✅ COMPLETE (2025-12-09)
   - ✅ `oak_threads` mapping generator created
   - ✅ `oak_sequences` document builder implemented
   - ✅ `oak_threads` document builder implemented + API integration
   - ✅ Reference index mappings generated
   - ✅ Reference document builders implemented with TDD

4. **Phase 1D Blocking Issues** ✅ ALL 12 RESOLVED (2025-12-09)
   - ✅ All 12 schema/facet/integrity issues resolved
   - ✅ Search quality infrastructure created (`src/lib/search-quality/`)
   - ✅ MRR and NDCG metrics implemented with TDD (13 unit tests)

5. **Phase 1E: Search Foundation** ← **CURRENT**
   - ✅ Fuzzy matching configured (`fuzziness: 'AUTO'` in BM25 queries)
   - ✅ Canonical URL generator fixed (fail-fast for missing context)
   - ✅ All tests updated to expect fail-fast behavior
   - ✅ All quality gates passing (1,300+ tests)
   - [ ] **NEXT**: Implement architectural fix for lessons ingestion
   - [ ] Reset ES indices
   - [ ] Re-ingest Maths KS4 data with complete lessons
   - [ ] Verify search returns expected results

6. **Phase 1C: Baseline Metrics** ← BLOCKED (waiting on Phase 1E completion)
   - Create ground truth data for Maths KS4 queries
   - Establish baseline with two-way hybrid (BM25 + ELSER)
   - Calculate MRR, NDCG@10, zero-hit rate, latency
   - Duration: 0.5-1 day

7. **Phase 2: Evaluate Dense Vectors** (only if two-way insufficient)
   - Dense vector infrastructure already built ✅
   - Only activate if Phase 1C baseline doesn't meet targets
   - Duration: 0.5 day

8. **Phase 3: Reference Indices** (Future)
   - Populate `oak_ref_subjects`, `oak_ref_key_stages`, `oak_curriculum_glossary`
   - Data source: Existing ontology data (`ontology-data.ts`, `knowledge-graph-data.ts`)
   - No stats extraction needed - use static curriculum metadata
   - Duration: 0.5-1 day

9. **Phase 4+**: Additional features (ReRank, filtered kNN, etc.)
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
- ✅ All quality gates passing (1,265+ tests)

**Phase 1B Complete** (2025-12-08):

- ✅ RRF query builders updated from deprecated `rank` API to ES 8.11+ `retriever` API
- ✅ Two-way hybrid search validated against live ES Serverless
- ✅ Query returned 21 results for "pythagoras theorem"

**Next Steps** (Phase 1C):

- [ ] Test two-way hybrid search with representative queries
- [ ] Establish baseline metrics (MRR, NDCG@10, zero-hit, latency)
- [ ] Decide: two-way sufficient OR evaluate three-way

---

## Resolved Issues (2025-12-09)

All 12 blocking issues identified during deep review have been resolved. Phase 1C can now proceed.

### Category 1: Schema/Field Issues ✅ RESOLVED

| ID  | Issue                                                                        | Resolution                                                                                             |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 1.1 | Missing `pathway` field in unit_rollup                                       | ✅ Added `pathway` to `UNIT_ROLLUP_INDEX_FIELDS` and `unit-rollup-overrides.ts`                        |
| 1.2 | `thread_slugs`, `thread_titles`, `thread_orders` defined but never populated | ✅ Created `extractThreadInfo()` in `thread-and-pedagogical-extractors.ts`, integrated into transforms |
| 1.3 | Dense vector field naming inconsistency                                      | ✅ Added TSDoc documenting naming convention (lesson/title for lessons, unit/rollup for unit_rollup)   |

### Category 2: Aggregation/Facet Issues ✅ RESOLVED

| ID  | Issue                                           | Resolution                                                                                 |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 2.1 | Lesson facets missing tier, exam_board, pathway | ✅ Added `tier`, `exam_board`, `pathway` aggregations to `createLessonFacets()`            |
| 2.2 | No unit facets exist                            | ✅ Created `createUnitFacets()` and added `includeFacets` param to `buildUnitRrfRequest()` |
| 2.3 | Sequence facets defined but unused              | ✅ Added TSDoc noting sequence faceted search is future work                               |

### Category 3: Data Integrity Issues ✅ RESOLVED

| ID  | Issue                                | Resolution                                                                                  |
| --- | ------------------------------------ | ------------------------------------------------------------------------------------------- |
| 3.1 | Hardcoded `subjectSlugs: ['maths']`  | ✅ Parameterised via `FetchThreadsOptions` with optional `subjectSlugs` array               |
| 3.2 | `buildThreadOps` returns `unknown[]` | ✅ Replaced with explicit `ThreadBulkOperation[]` type                                      |
| 3.3 | Rollup text missing pedagogical data | ✅ Created `extractPedagogicalData()` and `createEnrichedRollupText()` in extractors module |

### Category 4: Phase/Status Issues ✅ RESOLVED

| ID  | Issue                                     | Resolution                                                                            |
| --- | ----------------------------------------- | ------------------------------------------------------------------------------------- |
| 4.1 | Phase 1C marked "CURRENT" but not started | ✅ Status corrected in all documents                                                  |
| 4.2 | Missing search-quality infrastructure     | ✅ Created `src/lib/search-quality/` with `ground-truth.ts`, `metrics.ts`, `index.ts` |
| 4.3 | Missing IR metrics implementation         | ✅ Implemented `calculateMRR()` and `calculateNDCG()` with TDD (13 unit tests)        |

### Files Created/Modified

**New Files**:

- `src/lib/search-quality/ground-truth.ts` - Ground truth interfaces
- `src/lib/search-quality/metrics.ts` - MRR and NDCG@10 implementations
- `src/lib/search-quality/metrics.unit.test.ts` - 13 unit tests for metrics
- `src/lib/search-quality/index.ts` - Module exports
- `src/lib/indexing/thread-and-pedagogical-extractors.ts` - Thread info and pedagogical data extraction
- `src/lib/indexing/thread-and-pedagogical-extractors.unit.test.ts` - Tests for extractors
- `src/lib/indexing/summary-reader-helpers.ts` - Summary reader utilities (refactored from document-transform-helpers)

**Modified Files**:

- `field-definitions/curriculum.ts` - Added `pathway` field
- `unit-rollup-overrides.ts` - Added `pathway` keyword override
- `lessons-overrides.ts` - Added `pathway` keyword override
- `rrf-query-helpers.ts` - Added facets for tier, exam_board, pathway
- `rrf-query-builders.ts` - Added `createUnitFacets()` and `includeFacets` param
- `thread-bulk-helpers.ts` - Parameterised subject extraction, fixed return type
- `document-transforms.ts` - Updated to use new extractors
- `document-transform-helpers.ts` - Refactored for file size compliance

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

**Quality Gates**: All 11 gates passing (1,265+ tests)

---

## Next Steps

### Phase 1E: Implement Architectural Fix ← **CURRENT PRIORITY**

**Goal**: Fix lesson ingestion to get ALL lessons, not just first 100 from paginated API.

**Prerequisites Completed**:

- ✅ Thread canonical URL bug fixed (returns `null` for threads, throws for missing context)
- ✅ Fuzzy matching configured (`fuzziness: 'AUTO'` in BM25 queries)
- ✅ All tests updated for fail-fast behavior
- ✅ All quality gates passing

---

#### Task 1: Implement Lessons-from-Unit-Summaries Architecture

**Problem**: The `/key-stages/{ks}/subject/{subject}/lessons` endpoint has pagination (limit 100) and returns only 5 of 36 lesson groups. This means 31 units have ZERO lessons indexed.

**Solution**: Derive lessons from unit summaries instead of the paginated lessons endpoint.

**Implementation Approach (TDD)**:

1. **Write failing tests first** (RED):
   - Test that `buildLessonDocuments` processes lessons from ALL unit summaries
   - Test that lesson slugs are extracted from `unitLessons` array in each unit summary

2. **Modify data flow** (GREEN):

   ```typescript
   // Current (broken):
   const lessonGroups = await client.getLessonsByKeyStageAndSubject(ks, subject);
   // Only returns ~100 lessons due to pagination

   // Fixed:
   for (const unitSummary of unitSummaries.values()) {
     const unitLessons = extractUnitLessons(unitSummary); // Already have this!
     for (const lesson of unitLessons) {
       const lessonSummary = await client.getLessonSummary(lesson.lessonSlug);
       // Create lesson document with full pedagogical data
     }
   }
   ```

3. **Refactor** (REFACTOR):
   - Clean up now-unused `getLessonsByKeyStageAndSubject` if no longer needed
   - Update function signatures and types

**Files to modify**:

| File                                     | Change Required                                              |
| ---------------------------------------- | ------------------------------------------------------------ |
| `src/lib/indexing/index-bulk-helpers.ts` | Change `buildLessonDocuments` to iterate over unit summaries |
| `src/lib/index-oak-helpers.ts`           | Update `fetchPairData` to not fetch from lessons endpoint    |
| `src/adapters/oak-adapter-sdk.ts`        | May need `getLessonSummary` adapter (check if exists)        |

**Key Functions**:

- `extractUnitLessons()` - Already exists in `document-transform-helpers.ts`
- `processUnitSummary()` - Already fetches unit summaries
- Need to chain: unit summary → lesson slugs → lesson summary fetch → lesson document

---

#### Task 2: Reset ES Indices and Re-ingest

**After architectural fix is implemented and tests pass**:

```bash
cd apps/oak-open-curriculum-semantic-search

# Reset indices (will delete current data)
npx tsx src/lib/elasticsearch/setup/cli.ts reset

# Re-ingest with fixed architecture
pnpm es:ingest-live --subject maths --keystage ks4 --verbose 2>&1 | tee /tmp/ingest-log.txt

# Review full log for errors
cat /tmp/ingest-log.txt
```

---

#### Task 3: Verify Complete Ingestion

**Success criteria** (verify all):

```bash
# Start server and run discovery
cd apps/oak-open-curriculum-semantic-search
pnpm dev &
sleep 5
TEST_BASE_URL=http://localhost:3003 npx tsx scripts/discover-lessons.ts
```

- [ ] All 36 Maths KS4 units have lessons indexed
- [ ] "Pythagoras theorem" returns Pythagoras lessons (from `right-angled-trigonometry` unit)
- [ ] "pythagorus" (misspelling) returns results (fuzzy match working)
- [ ] Ingestion log shows `lessonGroups: 36` (not 5)
- [ ] Total lessons indexed matches expected count (~500+ for Maths KS4)

---

#### Task 4: Run Full Quality Gates

After verification:

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

All gates must pass before proceeding to Phase 1C.

---

### Phase 1C: Establish Baseline Metrics ← BLOCKED (waiting on Phase 1E)

**Goal**: Measure two-way hybrid (BM25 + ELSER) search quality.

**Prerequisites**: Phase 1E complete (all blocking issues fixed).

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

#### Implementation Steps (after Phase 1E)

**Step 0: Discover actual data** (MUST DO FIRST)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm dev &  # Start server
sleep 5
npx tsx scripts/discover-lessons.ts
```

This shows you actual lesson slugs in Maths KS4 - you need these for ground truth.

**Step 1: Create ground truth** - Judge relevance of actual results

- File: `src/lib/search-quality/ground-truth.ts` ✅ EXISTS (interfaces ready)
- Use slugs from Step 0, NOT placeholder slugs
- Score each result: 3=perfect, 2=good, 1=maybe, 0=wrong (implicit)
- Add your ground truth data entries to the file

**Step 2: Implement metrics** ✅ COMPLETE

- File: `src/lib/search-quality/metrics.ts` ✅ EXISTS
- `calculateMeanReciprocalRank()` implemented with TDD
- `calculateNormalizedDiscountedCumulativeGain()` implemented with TDD
- 13 unit tests passing

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
pnpm test              # 1,265+ tests must pass
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

### Phase 1E: Search Foundation ← **CURRENT**

**Issues discovered and resolved (2025-12-09)**:

- [x] Issue 5.4: Thread canonical URL bug ✅ FIXED
  - Generator now returns `null` for threads, throws for missing context (fail-fast)
  - All tests updated to expect `TypeError` for missing data
- [x] Issue 5.3: No fuzzy matching ✅ FIXED
  - Added `fuzziness: 'AUTO'` to BM25 `multi_match` queries
  - TDD tests added first, then implementation
- [x] Issue 5.1: key_stage naming ✅ RESOLVED
  - Investigation found code uses `key_stage` not `key_stage_slug` - correct
- [ ] Issue 5.2: Lessons API pagination ⚠️ **NEEDS ARCHITECTURAL FIX**
  - Root cause: `/lessons` endpoint returns only 5 of 36 groups (paginated)
  - Fix: Derive lessons from unit summaries instead

**Phase 1E Tasks**:

- [x] Fix canonical URL generator (fail-fast, `null` for threads)
- [x] Update tests to expect fail-fast behavior (not error swallowing)
- [x] Configure fuzzy matching in ES query builders
- [x] Run all quality gates (all passing)
- [ ] **NEXT**: Implement architectural fix for lesson ingestion
- [ ] Reset ES indices
- [ ] Re-ingest Maths KS4 data with complete lessons
- [ ] Verify "Pythagoras theorem" returns Pythagoras lessons
- [ ] Verify "pythagorus" (misspelling) returns results

### Phase 1C: Baseline Metrics ← BLOCKED (waiting on Phase 1E)

**Prerequisites** (Phase 1D issues - ALL RESOLVED 2025-12-09):

- [x] Issue 1.1: Add pathway field to unit_rollup schema
- [x] Issue 1.2: Populate thread_slugs/titles/orders in unit rollup documents
- [x] Issue 1.3: Document dense vector naming convention in TSDoc
- [x] Issue 2.1: Add tier, exam_board, pathway to createLessonFacets()
- [x] Issue 2.2: Create createUnitFacets() function
- [x] Issue 2.3: Document sequence facets as future work
- [x] Issue 3.1: Replace hardcoded ['maths'] with dynamic subject extraction
- [x] Issue 3.2: Fix buildThreadOps return type from unknown[] to specific type
- [x] Issue 3.3: Include pedagogical data in rollup text
- [x] Issue 4.2: Create src/lib/search-quality/ directory with ground-truth.ts
- [x] Issue 4.3: Implement metrics.ts with TDD (MRR and NDCG@10)

**Phase 1C Tasks** (After Phase 1E):

- [ ] Create ground truth data for Maths KS4 queries using `scripts/discover-lessons.ts`
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
