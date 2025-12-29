# Phase 3: Multi-Index Search & Fields

**Status**: Part 3.0 ✅ COMPLETE | Part 3a ✅ IMPLEMENTED | Part 3b ⚠️ NEEDS REWORK | Part 3c 🔲 NEW  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Prerequisites**: Phase 1 & 2 complete (two-way hybrid confirmed optimal)  
**Last Updated**: 2025-12-16

---

## 📋 Detailed Execution Plan

**For ES reset, re-indexing, and re-validation work, follow the detailed plan:**

`.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md`

This plan includes:

- **Phase 0**: Redis Cache TTL configuration (update to 14 days with ±12 hour jitter)
- **Phase A**: Pre-work quality gates (baseline)
- **Phase B**: Dense vector code removal (TDD)
- **Phase C**: Type generation and build
- **Phase D**: ES reset and re-indexing
- **Phase E**: Re-validation (smoke tests)
- **Phase F**: Post-work quality gates
- **Phase G**: Analysis and documentation

**Acceptance criteria and foundation document re-commitment checkpoints** are defined in the detailed plan.

---

## ⚠️ Before Starting (Fresh Chat)

**Significant code changes have occurred.** Before any feature work:

1. **Follow the detailed plan** at `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md`
2. **Run full quality gates** from repo root (see prompt for commands)
3. **Resolve any issues** gate-by-gate
4. **ALWAYS re-index fresh** before validation - stale indices invalidate all metrics:

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   pnpm es:setup        # Ensure indices exist with correct mappings
   pnpm es:ingest-live -- --subject maths --keystage ks4  # Fresh data (~5-10 min)
   pnpm es:status       # Verify document counts
   ```

5. **Check Redis cache TTL** for SDK responses (should be 14 days with jitter per ADR-079)

**⚠️ CRITICAL**: Never run search quality smoke tests against stale indices. Results are meaningless without fresh data that matches the current schema and transform logic.

See `.agent/prompts/semantic-search/semantic-search.prompt.md` for detailed steps.

---

## 🚀 Quick Start: Part 3a (Current Work)

**Part 3.0 is complete.** The immediate work is **Part 3a: Feature Parity**.

### Priority Order

1. **KS4 Metadata Denormalisation** (CRITICAL) — [Jump to Task 5](#task-5-index-ks4-options-and-tiers-new---critical)
   - Add sequence traversal to ingestion pipeline
   - Build `UnitContextMap` from sequence data
   - Decorate documents with `tiers[]`, `examBoards[]`, `ks4Options[]`
   - See [ADR-080](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)

2. **OWA Aliases Import** (HIGH) — [Jump to Task 1](#task-1-owa-alias-system-import-manual-one-time)
   - Index `OWA-xxx` identifiers for exact ID matching

3. **Lesson Fields** (HIGH) — [Jump to Task 2](#task-2-add-pupillessonoutcome-to-lesson-index)
   - Add `pupilLessonOutcome` field

4. **Display Titles** (MEDIUM) — [Jump to Task 3](#task-3-add-display-title-fields)
   - Add `subjectTitle`, `keyStageTitle` for UI display

5. **Unit Enrichment** (MEDIUM) — [Jump to Task 4](#task-4-add-unit-enrichment-fields)
   - Add `description`, `whyThisWhyNow`, `categories`, etc.

### Key Files to Modify

| File | Purpose |
|------|---------|
| `packages/sdks/oak-curriculum-sdk/src/field-definitions/curriculum.ts` | Add new field definitions |
| `apps/.../src/utils/document-transforms/*.ts` | Transform API data → ES docs |
| `apps/.../src/services/ingest/*.ts` | Add sequence traversal |
| `apps/.../tests/smoke/*.test.ts` | Add smoke tests for new filters |

### TDD Approach

- **Unit tests**: Field extraction, `UnitContextMap` building
- **Smoke tests**: KS4 filtering works in ES queries
- **No mocking ES** — use real Elasticsearch in smoke tests

---

## Phase 3 Goal

**Prove that multi-index search infrastructure works correctly** by verifying:

1. **Hybrid search correctness** - BM25 and ELSER both contribute measurably to search quality
2. **Lesson-only search** - Can search lessons in isolation
3. **Unit-only search** - Can search units in isolation
4. **Joint lesson+unit search** - Can search both with results properly categorised by `doc_type`
5. **Lesson search filtered by unit** - Can filter lessons to a specific unit

This phase delivers **verified, working search infrastructure**. MCP tool creation is separate work coordinated in `.agent/plans/sdk-and-mcp-enhancements/`.

---

## Completed Work

- ✅ Removed unused three-way RRF code (dense vectors provided no benefit)
- ✅ Updated smoke test documentation to accurately reflect two-way hybrid
- ✅ Aligned code with Phase 2 findings (documentation now matches implementation)
- ✅ Expanded unit ground truth from 16 to 43 queries (verified against Oak API)
- ✅ Fixed incorrect unit slugs in ground truth files
- ✅ Unit search smoke tests passing: MRR 0.915, NDCG@10 0.924
- ✅ All quality gates passing
- ✅ BM25 vs ELSER vs Hybrid experiment completed (lessons: hybrid superior; units: mixed)
- ✅ Verified `doc_type` field already exists in indexes
- ✅ Created ADR-075 (dense vector removal), ADR-076 (ELSER-only), ADR-077 (semantic summaries)
- ✅ **Part 3.0 Verification complete** (2025-12-15): lesson-only, unit-only, joint search, filter by unit all verified
- ✅ Redis cache TTL updated to 14 days with ±12 hour jitter (ADR-079)
- ✅ Created `pnpm cache:reset-ttls` dev tool to refresh TTLs without re-downloading data
- ✅ Smoke test env loading fixed (`smoke-test.setup.ts` loads `.env.local`)

---

## Remaining Work Summary

**📋 Detailed plan with acceptance criteria**: `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md`

### Phase 0: Redis Cache TTL Configuration ✅ COMPLETE

| Task                                          | Priority | Status       |
| --------------------------------------------- | -------- | ------------ |
| **Investigate current Redis TTL config**      | **HIGH** | ✅ Complete  |
| **Update TTL to 14 days with ±12 hour jitter**| **HIGH** | ✅ Complete  |
| **Create ADR-079 for TTL jitter**             | **HIGH** | ✅ Complete  |
| **Update SDK-CACHING.md documentation**       | **HIGH** | ✅ Complete  |

**Implementation (2025-12-15)**: `calculateTtlWithJitter()` pure function in `src/adapters/sdk-cache/ttl-jitter.ts` with per-entry jitter for true stampede prevention. See ADR-079.

### Part 3.0: Verification & Multi-Index Infrastructure ✅ COMPLETE

| Task                                         | Priority     | Status       |
| -------------------------------------------- | ------------ | ------------ |
| **BM25 vs ELSER vs Hybrid experiment**       | **CRITICAL** | ✅ Complete  |
| **Prove lesson-only search works**           | **CRITICAL** | ✅ Complete  |
| **Prove unit-only search works**             | **CRITICAL** | ✅ Complete  |
| **Prove joint search with `doc_type` works** | **CRITICAL** | ✅ Complete  |
| **Prove lesson filter by unit works**        | **CRITICAL** | ✅ Complete  |
| Add `doc_type` field to all indexes          | **HIGH**     | ✅ Exists    |
| ADR: unified vs separate endpoints           | Medium       | 🔲 Deferred  |
| Unit reranking experiment                    | Medium       | 🔲 Deferred  |

**Verification completed 2025-12-15** with fresh Maths KS4 data (314 lessons, 36 units). See `.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md` for full results.

### Part 3a: Feature Parity ✅ IMPLEMENTED

| Task                                   | Priority     | Status       |
| -------------------------------------- | ------------ | ------------ |
| OWA aliases import                     | **HIGH**     | ✅ Complete  |
| `pupilLessonOutcome` field             | **HIGH**     | ✅ Complete  |
| Display title fields                   | Medium       | ✅ Complete  |
| Unit enrichment fields                 | Medium       | ✅ Complete  |
| **KS4 sequence traversal**             | **CRITICAL** | ✅ Complete  |
| **UnitContextMap building**            | **CRITICAL** | ✅ Complete  |
| **KS4 field definitions (arrays)**     | **HIGH**     | ✅ Complete  |
| **Document decoration with KS4 data**  | **HIGH**     | ✅ Complete  |
| **KS4 filtering smoke tests**          | **HIGH**     | ✅ Complete  |
| ADR-080: Denormalisation strategy      | **HIGH**     | ✅ Complete  |

**Implementation files**:
- `ks4-context-builder.ts` - Traverses sequences, builds UnitContextMap
- `ks4-context-types.ts` - Types for KS4 context
- `semantic-summary-generator.ts` - Lesson and unit summary templates
- `document-transform-helpers.ts` - `extractUnitEnrichmentFields()`, `extractKs4DocumentFields()`
- `ks4-filtering.smoke.test.ts` - Smoke tests for KS4 filtering

### Part 3b: Semantic Summary Enhancement ⚠️ NEEDS REWORK

| Task                                 | Priority | Status       |
| ------------------------------------ | -------- | ------------ |
| **Remove dense vector code**         | **HIGH** | ✅ Complete  |
| **Lesson semantic summary template** | **HIGH** | ✅ Complete  |
| **Unit semantic summary template**   | **HIGH** | ✅ Complete  |
| **`lesson_summary_semantic` field**  | **HIGH** | ✅ Complete  |
| Redis caching for summaries          | Medium   | 🔲 Deferred  |
| Compare summary vs transcript ELSER  | Medium   | 🔲 Deferred  |
| ADR-075: Dense vector removal        | **HIGH** | ✅ Implemented |
| ADR-076: ELSER-only strategy         | **HIGH** | ✅ Complete  |
| ADR-077: Semantic summary generation | **HIGH** | ✅ Complete  |

**⚠️ ISSUE IDENTIFIED**: `unit_semantic` was incorrectly replaced with curated summary instead of adding a new field. This breaks the content vs structure separation. Fix required in Part 3c.

**Existing Implementation** (needs update):
- `generateLessonSemanticSummary()` - ~200 token summary from lesson data
- `generateUnitSemanticSummary()` - ~200 token summary from unit data
- Templates need expansion to include ALL API fields

### Part 3c: Four-Retriever Architecture 🔲 NEW

**Purpose**: Implement comprehensive hybrid search with both content-based and structure-based matching.

| Task | Priority | Status |
| ---- | -------- | ------ |
| Rename fields to consistent nomenclature | **CRITICAL** | 🔲 Pending |
| Add `lesson_structure` field (BM25 text) | **CRITICAL** | 🔲 Pending |
| Add `unit_structure` field (BM25 text) | **CRITICAL** | 🔲 Pending |
| Restore `unit_content_semantic` to rollup content | **CRITICAL** | 🔲 Pending |
| Add `unit_structure_semantic` field | **CRITICAL** | 🔲 Pending |
| Update summary templates to include ALL API fields | **HIGH** | 🔲 Pending |
| Update query builders to use four retrievers | **HIGH** | 🔲 Pending |
| Update ES mappings via `pnpm type-gen` | **HIGH** | 🔲 Pending |
| Re-index with new field schema | **HIGH** | 🔲 Pending |
| **Prove KS4 filtering works** | **CRITICAL** | 🔲 Pending |
| Run search quality benchmarks (MRR/NDCG) | **HIGH** | 🔲 Pending |

See [Part 3c: Four-Retriever Architecture](#part-3c-four-retriever-architecture) section below for full implementation details.

#### Smoke Test Architecture

There are **two categories** of smoke tests with different requirements:

| Category            | Tests                                                      | Requirements                            |
| ------------------- | ---------------------------------------------------------- | --------------------------------------- |
| **API-based**       | `scope-verification`, `search-quality`, `unit-search-*`    | Next.js dev server running + fresh ES   |
| **Direct ES**       | `hybrid-superiority`                                       | ES credentials in `.env.local` (no server) |

**API-based tests** hit `/api/search` endpoint → test the full stack including query builders, response transforms.

**Direct ES tests** talk to Elasticsearch Serverless directly → test raw ES queries, prove retriever behaviour.

Both require **fresh indices** to produce meaningful results.

#### Verification Sequence

1. **Re-index fresh**: `pnpm es:ingest-live -- --subject maths --keystage ks4`
2. **Run direct ES tests**: `pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority` (no server needed)
3. **Start server**: `pnpm dev` (for API-based tests)
4. **Run API-based tests**: `pnpm vitest run -c vitest.smoke.config.ts scope-verification`

### Part 3a: Feature Parity (After Verification Complete)

| Task                                   | Priority     | Status     |
| -------------------------------------- | ------------ | ---------- |
| OWA aliases import                     | **HIGH**     | 🔲 Pending |
| `pupilLessonOutcome` field             | **HIGH**     | 🔲 Pending |
| **KS4 Options & Tiers indexing (NEW)** | **CRITICAL** | 🔲 Pending |
| Display title fields                   | Medium       | 🔲 Pending |
| Unit enrichment fields                 | Medium       | 🔲 Pending |
| ADR: field additions                   | Medium       | 🔲 Pending |

### Part 3b: Semantic Summary Enhancement (NEW)

| Task                                 | Priority | Status       |
| ------------------------------------ | -------- | ------------ |
| **Remove dense vector code**         | **HIGH** | ✅ Complete  |
| **Lesson semantic summary template** | **HIGH** | 🔲 Pending   |
| **Unit semantic summary template**   | **HIGH** | 🔲 Pending   |
| Redis caching for summaries          | Medium   | 🔲 Pending   |
| Compare summary vs transcript ELSER  | Medium   | 🔲 Pending   |
| ADR-075: Dense vector removal        | **HIGH** | ✅ Implemented |
| ADR-076: ELSER-only strategy         | **HIGH** | ✅ Complete  |
| ADR-077: Semantic summary generation | **HIGH** | ✅ Complete  |

**Part 3a and 3b work begins only after Part 3.0 verification is complete.**

---

## Foundation Documents (MUST READ FIRST)

Before starting any work on this phase, read these foundation documents:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**Source of truth** for all types and available data:

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - **The OpenAPI schema**
- `.agent/plans/external/upstream-api-metadata-wishlist.md` - Fields to request from upstream API

**All quality gates must pass. No exceptions.**

---

## Elasticsearch Documentation References

For implementation, consult the official ES documentation:

| Topic                        | URL                                                                                          |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| **Hybrid Search (RRF)**      | https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html                     |
| **Semantic Search Overview** | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html         |
| **ELSER (Sparse Vectors)**   | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html   |
| **Semantic Reranking**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html      |
| **Retriever API**            | https://www.elastic.co/guide/en/elasticsearch/reference/current/retriever.html               |
| **Multi-index Search**       | https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html |

---

## Data Strategy

**Continue with Maths KS4** for Phase 3. Rationale:

1. Phase 3 is infrastructure (code changes), not data volume
2. Ground truth exists for Maths KS4 (314 lessons, 36 units)
3. Faster iteration (5-10 min re-index vs hours for full curriculum)
4. Test patterns first, then scale

**After Phase 3**: Move to full curriculum ingest when MCP tool is ready.

---

## Overview

This phase addresses two critical gaps identified after Phase 1/2:

1. **Multi-Index Search Generality (3.0)**: All Phase 1/2 work focused exclusively on lesson search. Teachers need to search across multiple content types.
2. **Feature Parity Quick Wins (3a)**: Immediate improvements using available Open API data.

### Vision: Curriculum Resource Discovery

Teachers don't just want to find lessons - they want to discover **curriculum resources**:

- Lessons (individual teaching sessions)
- Units (themed lesson collections)
- Curricula/Programmes (year-long pathways)
- Worksheets & downloadable resources
- Quizzes & assessments
- Transcripts (searchable video content)

---

## Part 3.0: Multi-Index Search Generality

**Priority**: CRITICAL - Foundation for all search features

### Current State (Post Part 3.0 Verification)

| Index             | Hybrid Search | Verified       | Notes                                          |
| ----------------- | ------------- | -------------- | ---------------------------------------------- |
| `oak_lessons`     | BM25 + ELSER  | ✅ Verified    | Hybrid superior (MRR 0.908)                    |
| `oak_unit_rollup` | BM25 + ELSER  | ✅ Verified    | ELSER slightly better MRR, hybrid better NDCG  |
| `oak_units`       | BM25 only     | ✅ Verified    | Functional, no semantic field                  |
| `oak_sequences`   | BM25 + ELSER  | ❌ Untested    | `sequence_semantic` exists, not validated      |
| `oak_threads`     | BM25 + ELSER  | ❌ Untested    | `thread_semantic` exists, not validated        |

**Part 3.0 verification completed 2025-12-15.** Lesson and unit search are proven working. Sequence/thread indices are out of scope for Phase 3.

### Technical Background

#### Two-Way Hybrid Search (BM25 + ELSER)

We use Elasticsearch's Reciprocal Rank Fusion (RRF) to combine **multiple retrievers within a single index**.

**Key clarification**: RRF combines **retrievers** (search methods), not indices. All retrievers query the same index (e.g., `oak_lessons`) using different matching strategies.

| Retriever | Type            | Field(s)                                             | Purpose           |
| --------- | --------------- | ---------------------------------------------------- | ----------------- |
| BM25      | Lexical         | `lesson_title`, `lesson_keywords`, `transcript_text` | Keyword matching  |
| ELSER     | Sparse semantic | `lesson_semantic` (full transcript)                  | Semantic matching |

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "multi_match": { "query": "quadratic equations", "fields": ["title", "transcript"] }
            }
          }
        },
        {
          "standard": {
            "query": { "semantic": { "field": "lesson_semantic", "query": "quadratic equations" } }
          }
        }
      ],
      "rank_window_size": 100,
      "rank_constant": 60
    }
  }
}
```

**Future (Part 3b)**: With semantic summaries, we add a third ELSER retriever for `lesson_summary_semantic`. This "three-way" = BM25 + transcript ELSER + summary ELSER, **NOT** dense vectors (which were removed per ADR-075).

### Questions & Answers

#### 1. Can ES distinguish result types in multi-index search?

**Answer**: Yes. Options per ES documentation:

- **`_index` field**: Every ES hit includes `_index` in response - tells you which index the result came from
- **Explicit `doc_type` field**: Add `doc_type: 'lesson' | 'unit' | 'sequence'` to each document at index time
- **Field presence**: Lessons have `lesson_slug`, units have `unit_slug`, etc.

**Recommendation**: Use `_index` (already available) + add explicit `doc_type` field for clarity.

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/search-multiple-indices.html

#### 2. Can we filter to only lessons or only units?

**Answer**: Yes. Multiple approaches:

- **Separate endpoints**: Current approach - `/api/search` handles lessons, separate endpoint for units
- **Index targeting**: Query specific index: `POST /oak_lessons/_search` vs `POST /oak_units/_search`
- **Multi-index with filter**: `POST /oak_lessons,oak_units/_search` with `doc_type` filter in query

**Recommendation**: Support both separate endpoints (simple) AND unified endpoint with type filter (flexible).

#### 3. Can we search lessons within a specified unit?

**Answer**: Yes. Lessons already have `unit_ids` field (array of unit slugs).

```json
{
  "query": {
    "bool": {
      "must": [{ "multi_match": { "query": "quadratic equations" } }],
      "filter": [{ "term": { "unit_ids": "solving-quadratics-higher" } }]
    }
  }
}
```

**Note**: This works with RRF by adding filter to each retriever.

#### 4. Is unit search using hybrid?

**Code review**: `oak_unit_rollup` has `unit_semantic` field; `runUnitsSearch` uses two-way RRF.
**Status**: ⚠️ Code uses hybrid, but **not yet proven** that ELSER contributes meaningfully.
**Required**: BM25 vs ELSER vs Hybrid experiment to prove hybrid is superior.

### Implementation Tasks (3.0) ✅ COMPLETE

| Task                                   | Description                                                                   | Effort | Priority     | Status       |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------ | ------------ | ------------ |
| **BM25 vs ELSER vs Hybrid experiment** | Prove hybrid is superior to either method alone                               | Medium | **CRITICAL** | ✅ Complete  |
| **Prove lesson-only search**           | Smoke test verifying lesson search returns only lessons with correct doc_type | Low    | **CRITICAL** | ✅ Complete  |
| **Prove unit-only search**             | Smoke test verifying unit search returns only units with correct doc_type     | Low    | **CRITICAL** | ✅ Complete  |
| **Prove joint search**                 | Smoke test verifying mixed results are properly categorised                   | Medium | **CRITICAL** | ✅ Complete  |
| **Prove lesson filter by unit**        | Smoke test verifying unit filter restricts lesson results correctly           | Low    | **CRITICAL** | ✅ Complete  |
| **`doc_type` field exists**            | Field present in all indexes (verified during 3.0)                            | Medium | **HIGH**     | ✅ Exists    |
| **ADR: unified vs separate endpoints** | Document architectural decision on search endpoint strategy                   | Low    | Medium       | 🔲 Deferred  |
| **Experiment with unit reranking**     | Test reranking with `rollup_text` (~300 chars/lesson) using ES native rerank  | Low    | Medium       | 🔲 Deferred  |

#### BM25 vs ELSER vs Hybrid Experiment (CRITICAL)

**Purpose**: Prove that hybrid search actually uses both retrieval methods and provides measurable benefit over either in isolation.

**What we need to prove**:

1. BM25-only returns results (lexical matching works)
2. ELSER-only returns results (semantic matching works)
3. Hybrid returns results combining both
4. Hybrid MRR/NDCG exceeds both BM25-only and ELSER-only

**Approach** (following ES documentation patterns):

1. Create a smoke test that runs the same ground truth queries against:
   - BM25 only (lexical) - standard retriever with multi_match
   - ELSER only (semantic) - standard retriever with semantic query
   - Hybrid (BM25 + ELSER via RRF) - existing two-way implementation
2. Measure MRR, NDCG@10, zero-hit rate for each configuration
3. Compare results to prove hybrid is superior
4. If hybrid is NOT superior, investigate why (ELSER not working, field misconfiguration, etc.)

**Success criteria**: Hybrid MRR > max(BM25-only MRR, ELSER-only MRR)

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html#semantic-search-hybrid

#### Search Functionality Verification (CRITICAL)

**Purpose**: Prove each search mode works correctly before adding more features.

| Search Mode                 | Verification                                            | Success Criteria                             |
| --------------------------- | ------------------------------------------------------- | -------------------------------------------- |
| **Lesson-only search**      | Search with `scope: 'lessons'`, verify only lessons     | All results have `doc_type: 'lesson'`        |
| **Unit-only search**        | Search with `scope: 'units'`, verify only units         | All results have `doc_type: 'unit'`          |
| **Joint search**            | Search across both, verify results are categorised      | Results include both types, `doc_type` field |
| **Lesson filtered by unit** | Search lessons with `unitSlug` filter, verify all match | All lessons belong to specified unit         |

**Implementation**: Smoke tests that verify each mode returns correctly typed and filtered results.

#### Unit Reranking Experiment (Last Item)

**Purpose**: Test if reranking improves unit search quality.

**ES Native ReRank**: Use `.rerank-v1-elasticsearch` inference endpoint (included in ES Serverless at $0 cost).

**Reranking field**: `rollup_text` (~300 chars/lesson) - already indexed and suitable length.

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html

```json
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          /* existing hybrid retriever */
        }
      },
      "field": "rollup_text",
      "inference_id": ".rerank-v1-elasticsearch",
      "inference_text": "user query here",
      "rank_window_size": 100
    }
  }
}
```

### Success Criteria (3.0) ✅ COMPLETE

**Verification (completed 2025-12-15)**:

- [x] BM25 vs ELSER vs Hybrid experiment proves hybrid is superior
- [x] Lesson-only search verified (returns only lessons)
- [x] Unit-only search verified (returns only units)
- [x] Joint search verified (returns both types, properly categorised)
- [x] Lesson filter by unit verified (filters work correctly)

**Infrastructure**:

- [x] `doc_type` field present in ES indexes
- [ ] Decision on unified vs separate endpoints documented (ADR) — **Deferred**
- [ ] Unit reranking experiment completed — **Deferred**

---

## Part 3a: Feature Parity Quick Wins

**Priority**: HIGH - Immediate value with low effort

These enhancements address gaps identified in the Feature Parity Analysis and can be implemented immediately using available Open API data.

### Task 1: OWA Alias System Import (Manual, One-Time)

Import the rich alias system from OWA's `oakCurriculumData.ts` into our synonym system.

**Source**: `reference/Oak-Web-Application/src/context/Search/suggestions/oakCurriculumData.ts`

**Target**: `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/`

**OWA Aliases Include**:

```typescript
// Subject aliases
{ slug: 'maths', aliases: ['mathematics', 'math', 'numeracy'] }
{ slug: 'english', aliases: ['literacy', 'ela', 'english language'] }
{ slug: 'science', aliases: ['stem'] }

// Key stage aliases with year group mappings
{ slug: 'ks1', aliases: ['key stage 1', 'keystage 1', 'y1', 'y2', 'year 1', 'year 2'] }
{ slug: 'ks2', aliases: ['key stage 2', 'keystage 2', 'y3', 'y4', 'y5', 'y6'] }
{ slug: 'ks3', aliases: ['key stage 3', 'keystage 3', 'y7', 'y8', 'y9'] }
{ slug: 'ks4', aliases: ['key stage 4', 'keystage 4', 'y10', 'y11', 'gcse'] }

// Exam board aliases
{ slug: 'aqa', aliases: ['aqa exam board'] }
{ slug: 'edexcel', aliases: ['edexcel exam board', 'pearson'] }
{ slug: 'ocr', aliases: ['ocr exam board'] }
```

**Implementation**:

1. Extract aliases from `oakCurriculumData.ts`
2. Merge with existing synonyms in SDK
3. Ensure no duplicates or conflicts
4. Update synonym generation script if needed
5. Run `pnpm type-gen` to regenerate

**Benefit**: Enables direct PF (Programme Factor) matching from search queries, e.g., "y5 maths" → `keyStage: ks2, subject: maths`

### Task 2: Add `pupilLessonOutcome` to Lesson Index

**Source**: Open API `/lessons/{lesson}/summary` → `pupilLessonOutcome`

**Purpose**: Search result snippets and highlighting (production uses this for result display)

**Implementation**:

- Add field to lesson document schema (`field-definitions/curriculum.ts`)
- Update `document-transforms.ts` to extract from lesson summary
- Consider boosting in BM25 query (production boosts 3x)

**Impact**: HIGH - Key UX improvement for search results

### Task 3: Add Display Title Fields

Add human-readable title fields that production uses for UI display:

| Field           | Source                      | Purpose                           |
| --------------- | --------------------------- | --------------------------------- |
| `subjectTitle`  | `/lessons/{lesson}/summary` | Display "Mathematics" not "maths" |
| `keyStageTitle` | `/lessons/{lesson}/summary` | Display "Key Stage 2" not "ks2"   |

**Benefit**: Eliminates lookup overhead in consuming applications

### Task 4: Add Unit Enrichment Fields

From `/units/{unit}/summary`:

| Field                          | Purpose                          |
| ------------------------------ | -------------------------------- |
| `description`                  | Unit search snippets             |
| `whyThisWhyNow`                | Pedagogical context for teachers |
| `categories[]`                 | Additional filtering dimension   |
| `priorKnowledgeRequirements[]` | Prerequisite discovery           |
| `nationalCurriculumContent[]`  | NC alignment search              |

### Task 5: Index KS4 Options and Tiers (NEW - CRITICAL)

**Schema analysis (2025-12-13)** revealed these fields are essential for KS4 curriculum navigation.  
**Denormalisation strategy documented (2025-12-15)** in [ADR-080](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md).

#### Architectural Decision

See **[ADR-080: KS4 Metadata Denormalisation Strategy](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)** for full details.

**Key decision**: Denormalise KS4 metadata at ingest time by traversing sequences and building lookup tables. Index as **arrays** to respect many-to-many relationships.

#### Upstream Enhancement Request

🔴 **HIGH PRIORITY** enhancement request documented in [upstream-api-metadata-wishlist.md](../external/upstream-api-metadata-wishlist.md).

Until upstream provides flat fields, we use sequence traversal as workaround.

#### The Many-to-Many Reality

The V0 API wisely handles KS4 attributes **top-down** (via sequences) because relationships are **many-to-many**:

| Relationship           | Cardinality   | Example                                           |
| ---------------------- | ------------- | ------------------------------------------------- |
| Lesson → Tiers         | Many-to-many  | Same lesson appears in Foundation AND Higher      |
| Lesson → Exam Boards   | Many-to-many  | Same lesson appears in AQA AND Edexcel sequences  |
| Lesson → Units         | Many-to-many  | Same lesson can appear in multiple units          |
| Unit → Programmes      | Many-to-many  | Same unit appears in multiple programme contexts  |

**Bottom-up** queries have multiple valid answers.  
**Top-down** traversal follows a deterministic path.

**Implication**: We must index with **arrays of all applicable values**, not flat fields.

#### Search vs Filtering: Why Both Matter

| Concern       | Purpose                                       | Technical Need                          | Example                                    |
| ------------- | --------------------------------------------- | --------------------------------------- | ------------------------------------------ |
| **Search**    | Find relevant content by meaning/keywords     | Full-text fields, semantic embeddings   | "quadratic equations" → ranked results     |
| **Filtering** | Narrow results by exact categorical criteria  | Keyword/enum fields for faceting        | tier="foundation" AND examBoard="aqa"      |

**Search** is about *relevance ranking*—which results best match the query?  
**Filtering** is about *inclusion/exclusion*—which results meet exact criteria?

Both are orthogonal and both are essential.

#### API Data Available for Sequence Traversal

**`/subjects` endpoint** provides sequence slugs with KS4 context:

```json
{
  "subjectSlug": "science",
  "sequenceSlugs": [
    {
      "sequenceSlug": "science-secondary-aqa",
      "ks4Options": { "title": "AQA GCSE Science", "slug": "aqa-gcse-science" }
    }
  ]
}
```

**`/sequences/{sequence}/units?year={year}` endpoint** provides hierarchical KS4 data:

```text
KS4 Sciences: year → examSubjects[] → tiers[] → units[]
KS4 Maths:    year → tiers[] → units[]
KS1-KS3:      year → units[] (no KS4 context)
```

**Exam board** is encoded in sequence slug (e.g., `science-secondary-aqa` → "aqa").

#### Sequence Traversal Process (NEW)

The sequence traversal is **in addition to** existing ingestion, not a replacement:

```text
┌─────────────────────────────────────────────────────────────────┐
│ PHASE 1: Reference Data (existing)                               │
│ ├── GET /subjects           → Subject list                       │
│ ├── GET /subjects/{subject} → Subject details                    │
│ └── GET /threads            → Thread list                        │
│                                                                   │
│ PHASE 2: Sequence Metadata (NEW - for KS4 subjects)              │
│ ├── For each KS4 sequence (from /subjects response):             │
│ │   ├── GET /sequences/{seq}/units?year=10                       │
│ │   │   └── Build: unit → tier/examBoard/examSubject mapping     │
│ │   └── GET /sequences/{seq}/units?year=11                       │
│ │       └── Build: unit → tier/examBoard/examSubject mapping     │
│ │                                                                 │
│ │   Response structure varies by subject:                        │
│ │   ┌─────────────┬──────────────────────────────────────┐       │
│ │   │ Subject     │ Structure                            │       │
│ │   ├─────────────┼──────────────────────────────────────┤       │
│ │   │ Sciences    │ examSubjects[] → tiers[] → units[]   │       │
│ │   │ Maths       │ tiers[] → units[] (no examSubjects)  │       │
│ │   │ Others      │ units[] (no tiers)                   │       │
│ │   └─────────────┴──────────────────────────────────────┘       │
│ │                                                                 │
│ └── Build UnitContextMap (unit slug → all contexts)              │
│                                                                   │
│ PHASE 3: Curriculum Content (existing)                           │
│ ├── GET /key-stages/{ks}/subjects/{subject}/units                │
│ ├── GET /units/{unit}/summary                                    │
│ └── GET /lessons/{lesson}/summary                                │
│                                                                   │
│ PHASE 4: Decorate and Index (ENHANCED)                           │
│ ├── For each unit:                                               │
│ │   └── Look up tiers/examBoards from UnitContextMap             │
│ │   └── Add arrays to unit document                              │
│ ├── For each lesson:                                             │
│ │   └── Inherit from parent unit(s)                              │
│ │   └── Add arrays to lesson document                            │
│ └── Index to Elasticsearch                                       │
└─────────────────────────────────────────────────────────────────┘
```

#### Index Schema (Denormalised)

```typescript
interface LessonDocument {
  // ... existing fields ...
  
  // KS4 metadata (arrays for many-to-many)
  tiers: string[];             // ["foundation", "higher"]
  tierTitles: string[];        // ["Foundation", "Higher"]
  examBoards: string[];        // ["aqa", "edexcel"]
  examBoardTitles: string[];   // ["AQA", "Edexcel"]
  examSubjects: string[];      // ["biology", "chemistry"] (sciences only)
  examSubjectTitles: string[]; // ["Biology", "Chemistry"]
  ks4Options: string[];        // ["aqa-gcse-science"]
  ks4OptionTitles: string[];   // ["AQA GCSE Science"]
}
```

#### Redis Caching

**All SDK requests continue to be cached in Redis** per [ADR-066](../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md):

- Sequence endpoint responses cached with 14-day TTL + jitter ([ADR-079](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md))
- No special treatment—same cache infrastructure
- ~200 additional API calls per full ingest (cached on subsequent runs)

#### ES Filtering Semantics

With arrays, ES uses "any match" semantics:

```json
{
  "query": {
    "bool": {
      "filter": [
        { "term": { "tiers": "foundation" } },
        { "term": { "examBoards": "aqa" } }
      ]
    }
  }
}
```

This matches lessons that appear in Foundation tier AND appear in AQA sequences.

For **exclusive** filtering ("Foundation only, not Higher"):

```json
{
  "bool": {
    "filter": [{ "term": { "tiers": "foundation" } }],
    "must_not": [{ "term": { "tiers": "higher" } }]
  }
}
```

#### Data Available from OpenAPI Schema (Complete Reference)

**Source**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

| Endpoint                         | Response Schema                  | KS4-Relevant Fields                              |
| -------------------------------- | -------------------------------- | ------------------------------------------------ |
| `GET /subjects`                  | `AllSubjectsResponseSchema`      | `sequenceSlugs[].ks4Options` (nullable)          |
| `GET /subjects/{subject}`        | `SubjectResponseSchema`          | `sequenceSlugs[].ks4Options` (nullable)          |
| `GET /sequences/{seq}/units`     | `SequenceUnitsResponseSchema`    | Complex union (see below)                        |
| `GET /search/lessons`            | `LessonSearchResponseSchema`     | `units[].examBoardTitle` (string \| null)        |

**SequenceUnitsResponseSchema structure** (varies by subject and year):

```text
// KS1-KS3 or non-tiered KS4 subjects
{ year, units: [{ unitSlug, unitTitle, categories?, threads? }] }

// KS4 Maths (tiered, no exam subjects)
{ year, tiers: [{ tierSlug, tierTitle, units: [...] }] }

// KS4 Sciences (tiered with exam subjects)
{ year, examSubjects: [{ examSubjectSlug, examSubjectTitle, tiers: [{ tierSlug, tierTitle, units: [...] }] }] }
```

**Exam board extraction**:

| Method                        | Data Source                      | Reliability |
| ----------------------------- | -------------------------------- | ----------- |
| Parse from sequence slug      | `science-secondary-aqa` → "aqa"  | High        |
| `ks4Options.slug`             | `/subjects` response             | Medium      |
| `examBoardTitle`              | `/search/lessons` response       | Medium      |

**Known exam boards** (for slug parsing): `aqa`, `edexcel`, `ocr`, `eduqas`, `edexcelb`

**Known tiers**: `foundation`, `higher`

#### Schema Clarifications

| Concept            | Reality                                               |
| ------------------ | ----------------------------------------------------- |
| `programmeFactors` | **Never existed** — remove any references             |
| `pathway`          | Is `ks4Options.slug` — not a separate concept         |
| `tier`             | Derive from sequence traversal (`tiers[].tierSlug`)   |
| `examBoard`        | Parse from sequence slug (e.g., `science-secondary-aqa`) |
| `examSubject`      | From sequence response (`examSubjects[].examSubjectSlug`) |

#### Implementation Tasks ✅ COMPLETE

1. [x] Add sequence traversal to ingestion pipeline (`index-oak.ts`, `index-oak-helpers.ts`)
2. [x] Build `UnitContextMap` from sequence data (`ks4-context-builder.ts`)
3. [x] Update field definitions in SDK (`field-definitions/curriculum.ts`, `unit-enrichment-fields.ts`)
4. [x] Decorate documents during `createLessonDocument()` / `createUnitDocument()` / `createRollupDocument()`
5. [x] Update ES mappings via `pnpm type-gen`
6. [x] Add unit tests for lookup table building (`ks4-context-builder.unit.test.ts`)
7. [x] Add smoke tests for KS4 filtering (`ks4-filtering.smoke.test.ts`)

**Benefit**: Enables critical KS4 filtering for GCSE content (tiers, exam boards, exam subjects).

**Limitation**: Coverage depends on sequence data availability. Some units/lessons outside KS4 sequences will have empty arrays (correct—they have no KS4 context).

### Success Criteria (3a) ✅ ACHIEVED

- [x] OWA aliases merged into synonym system (subjects, key stages, exam boards)
- [x] `pupilLessonOutcome` indexed and queryable
- [x] Display title fields (`subjectTitle`, `keyStageTitle`) added to all documents
- [x] Unit enrichment fields indexed (`description`, `whyThisWhyNow`, `categories`, `priorKnowledgeRequirements`, `nationalCurriculumContent`)
- [x] **Sequence traversal implemented** (builds UnitContextMap)
- [x] **KS4 Options indexed** as arrays (`ks4Options[]`, `ks4OptionTitles[]`)
- [x] **Tiers indexed** as arrays (`tiers[]`, `tierTitles[]`)
- [x] **Exam boards indexed** as arrays (`examBoards[]`, `examBoardTitles[]`)
- [x] **Exam subjects indexed** as arrays (`examSubjects[]`, `examSubjectTitles[]`)
- [x] Derived fields documented in upstream wishlist
- [x] **[ADR-080](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)** documenting denormalisation strategy
- [x] All SDK requests cached in Redis (including sequences)
- [x] All quality gates pass
- [ ] **Re-indexing completed with KS4 metadata populated** ⚠️ VERIFICATION PENDING

### Success Criteria (3b) ✅ ACHIEVED (code complete)

- [x] Dense vector code removed from codebase
- [x] Lesson semantic summary template implemented
- [x] Unit semantic summary template implemented
- [ ] Redis caching for semantic summaries working (deferred)
- [ ] A/B comparison: summary-based vs transcript-based ELSER (deferred)
- [ ] Quality improvement measured (MRR/NDCG delta) ⚠️ VERIFICATION PENDING
- [x] All quality gates pass

---

## Part 3b: Semantic Summary Enhancement

**Priority**: HIGH - Improve embedding quality for pedagogical matching

### Background

Current embedding strategy uses ELSER on:

- **Lessons**: Full transcript (~5000 tokens) - dilutes pedagogical signal
- **Units**: `rollupText` (~200-400 tokens) - aggregated from lessons, not curated

Semantic summaries provide information-dense text (~200 tokens) optimised for embeddings.

### ADRs

| ADR     | Title                              | Status         |
| ------- | ---------------------------------- | -------------- |
| ADR-075 | Dense Vector Code Removal          | ✅ Implemented |
| ADR-076 | ELSER-Only Embedding Strategy      | ✅ Accepted    |
| ADR-077 | Semantic Summary Generation        | ✅ Accepted    |
| ADR-079 | SDK Cache TTL Jitter               | ✅ Implemented |
| ADR-080 | KS4 Metadata Denormalisation       | ✅ Accepted    |

**Dev Tools Added**:

- `pnpm cache:reset-ttls` - Reset TTLs on existing cached entries to current config (14 days with jitter)

### Task 1: Remove Dense Vector Code ✅ COMPLETE

**Rationale**: Phase 2 showed E5 dense vectors provide no benefit. Code has been removed.

**Completed**: 2025-12-15

**Changes made**:

| File | Status |
|------|--------|
| `document-transforms.ts` | ✅ Removed `generateDenseVector()` calls |
| `dense-vector-generation.ts` | ✅ **Deleted** |
| `dense-vector-generation.unit.test.ts` | ✅ **Deleted** |
| SDK field definitions | ✅ Removed `*_dense_vector` fields |
| `document-transforms.unit.test.ts` | ✅ Removed dense vector expectations |
| Rerank experiment scripts | ✅ Simplified to 2-way only |

**Verification complete**: `grep -r "dense_vector\|generateDenseVector" apps/oak-open-curriculum-semantic-search/src` returns no matches.

**All quality gates passing**.

### Task 2: Lesson Semantic Summary Template

**Purpose**: Generate ~200 token summary for pedagogical/structural matching (SEPARATE from transcript content).

**Template** (comprehensive - include ALL available fields):

```text
{lessonTitle} is a {keyStageTitle} {subjectTitle} lesson.

Key learning: {keyLearningPoints[*].keyLearningPoint}.

Keywords: {lessonKeywords[*].keyword} - {description}.

Common misconceptions: {misconceptionsAndCommonMistakes[*].misconception} (Response: {response}).

Teacher tips: {teacherTips[*].teacherTip}.

Content guidance: {contentGuidance[*].contentGuidanceLabel} - {contentGuidanceDescription}.

Supervision level: {supervisionLevel}.

Pupil outcome: {pupilLessonOutcome}.

Unit context: {unitTitle} ({unitSlug}).
```

**API fields used** (from `/lessons/{lesson}/summary`):

| Field | Required | Use |
|-------|----------|-----|
| `lessonTitle` | ✓ | Title |
| `unitSlug`, `unitTitle` | ✓ | Unit context |
| `subjectSlug`, `subjectTitle` | ✓ | Subject context |
| `keyStageSlug`, `keyStageTitle` | ✓ | Key stage context |
| `lessonKeywords[]` | ✓ | Keywords with definitions |
| `keyLearningPoints[]` | ✓ | Learning objectives |
| `misconceptionsAndCommonMistakes[]` | ✓ | Misconceptions with responses |
| `teacherTips[]` | ✓ | Teaching guidance |
| `contentGuidance[]` | ✓ | Content warnings (null if none) |
| `supervisionLevel` | ✓ | Supervision requirement (null if none) |
| `downloadsAvailable` | ✓ | Asset availability |
| `pupilLessonOutcome` | Optional | Expected learning outcome |

**Principle**: Include ALL fields, tolerate missing optional fields gracefully. Users may search by misconception, by curriculum alignment, by teacher tip, or by lesson title.

**Index field**: `lesson_structure_semantic` (renamed from `lesson_summary_semantic`, ELSER)

**BM25 field**: `lesson_structure` (NEW, plain text copy for BM25 matching)

### Task 3: Unit Semantic Summary Template

**Purpose**: Generate ~200 token summary for conceptual matching (SEPARATE from rollup content).

**⚠️ CORRECTION**: Original plan said "replace `rollupText`" - this was incorrect. The summary should be a NEW field, not a replacement. The rollup content remains the primary content field.

**Template** (comprehensive - include ALL available fields):

```text
{unitTitle} is a {keyStageSlug} {subjectSlug} unit for {year} containing {lessonCount} lessons.

Overview: {whyThisWhyNow}.

Description: {description}.

Notes: {notes}.

Prior knowledge: {priorKnowledgeRequirements[*]}.

National curriculum: {nationalCurriculumContent[*]}.

Threads: {threads[*].title}.

Categories: {categories[*].categoryTitle}.

Lessons:
- {unitLessons[0].lessonTitle} ({lessonSlug})
- {unitLessons[1].lessonTitle} ({lessonSlug})
... [all lessons with title + slug]
```

**API fields used** (from `/units/{unit}/summary`):

| Field | Required | Use |
|-------|----------|-----|
| `unitSlug`, `unitTitle` | ✓ | Context |
| `yearSlug`, `year` | ✓ | Context |
| `phaseSlug`, `subjectSlug`, `keyStageSlug` | ✓ | Context |
| `priorKnowledgeRequirements[]` | ✓ | Prerequisites |
| `nationalCurriculumContent[]` | ✓ | NC alignment |
| `unitLessons[]` | ✓ | Lesson list (title + slug for each) |
| `notes` | Optional | Additional context |
| `description` | Optional | Unit description |
| `whyThisWhyNow` | Optional | Pedagogical rationale |
| `threads[]` | Optional | Thread associations |
| `categories[]` | Optional | Category classifications |

**Principle**: Include ALL fields, tolerate missing optional fields gracefully. Users may search from any perspective.

**Index field**: `unit_structure_semantic` (NEW field, ELSER)

**Content field**: `unit_content_semantic` should contain rollup text (restored from incorrect change).

### Task 4: Redis Caching

**Purpose**: Avoid regenerating summaries on each ingestion.

**Cache key pattern**:

```typescript
const lessonCacheKey = `semantic_summary:lesson:${lessonSlug}:v1`;
const unitCacheKey = `semantic_summary:unit:${unitSlug}:v1`;
```

**TTL**: 14 days with ±12 hour jitter to prevent cache stampede (see ADR-079). Use `calculateTtlWithJitter()` function.

**Version key**: Increment on template changes to invalidate cache.

**Implementation**: Use existing Redis instance from ADR-066.

### Task 5: Compare Summary vs Transcript ELSER

**Purpose**: Measure quality improvement from semantic summaries.

**Experiment design**:

1. Run ground truth queries against:
   - Current: `lesson_semantic` (transcript)
   - New: `lesson_summary_semantic` (summary)
   - Combined: Both fields with RRF
2. Measure MRR, NDCG@10 for each
3. Document findings

**Success criteria**: Summary-based search improves MRR or NDCG vs transcript-only.

### Future Enhancement: LLM-Generated Summaries

Template-based composition is the starting point. Future enhancement:

```typescript
// Use Elastic-native LLM for richer summaries
const llmSummary = await esClient.inference.inference({
  inference_id: '.gp-llm-v2-chat_completion',
  input: `Summarise this lesson for semantic search in ~200 words: ${JSON.stringify(lessonData)}`,
});
```

**Benefits**:

- More natural, coherent prose
- Better semantic signal
- Can capture nuances templates miss

**Costs**:

- Compute time during ingestion
- Token costs (check ES Serverless pricing)
- Cache invalidation complexity

**Decision**: Defer to Phase 4+ after template approach is validated.

---

## Part 3c: Four-Retriever Architecture

**Status**: 🔲 NOT STARTED  
**Prerequisites**: Parts 3a and 3b code exists (needs refactoring)

### Architectural Decision

Both lessons and units use **four retrievers** combined via RRF:

1. **BM25 on Content** - Lexical matching on teaching material
2. **ELSER on Content** - Semantic matching on teaching material
3. **BM25 on Structure** - Lexical matching on metadata/summaries
4. **ELSER on Structure** - Semantic matching on metadata/summaries

**No reranker required initially** - RRF with four complementary retrievers provides good coverage. Add reranking only if quality metrics show diminishing returns.

### Field Nomenclature

Consistent pattern: `<entity>_content|structure[_semantic]`

#### Lesson Fields

| Field | Type | Content | Purpose |
|-------|------|---------|---------|
| `lesson_content` | Text | Full video transcript (~5000 tokens) | BM25 lexical matching on teaching content |
| `lesson_content_semantic` | semantic_text | Full video transcript | ELSER semantic matching on teaching content |
| `lesson_structure` | Text | Curated summary (~200 tokens) | BM25 lexical matching on pedagogical metadata |
| `lesson_structure_semantic` | semantic_text | Curated summary | ELSER semantic matching on pedagogical metadata |

#### Unit Fields (Rollup Index)

| Field | Type | Content | Purpose |
|-------|------|---------|---------|
| `unit_content` | Text | Aggregated lesson snippets + prior knowledge + NC (~200-400 tokens) | BM25 lexical matching on teaching content |
| `unit_content_semantic` | semantic_text | Aggregated lesson snippets + prior knowledge + NC | ELSER semantic matching on teaching content |
| `unit_structure` | Text | Curated summary (~200 tokens) | BM25 lexical matching on unit overview |
| `unit_structure_semantic` | semantic_text | Curated summary | ELSER semantic matching on unit overview |

### Field Rename Mapping

| Current Field | New Field | Action |
|---------------|-----------|--------|
| `transcript_text` | `lesson_content` | Rename |
| `lesson_semantic` | `lesson_content_semantic` | Rename |
| `lesson_summary_semantic` | `lesson_structure_semantic` | Rename |
| (none) | `lesson_structure` | **ADD** - BM25 text field |
| `rollup_text` | `unit_content` | Rename |
| `unit_semantic` | `unit_content_semantic` | **RESTORE** - was incorrectly changed to summary |
| (none) | `unit_structure` | **ADD** - BM25 text field |
| (none) | `unit_structure_semantic` | **ADD** - ELSER field |

### RRF Query Structure

```typescript
// Lesson search with four retrievers
{
  retriever: {
    rrf: {
      retrievers: [
        // BM25 on content
        { standard: { query: { multi_match: { query: text, fields: ['lesson_content', 'lesson_title'] } }, filter } },
        // BM25 on structure
        { standard: { query: { multi_match: { query: text, fields: ['lesson_structure'] } }, filter } },
        // ELSER on content
        { standard: { query: { semantic: { field: 'lesson_content_semantic', query: text } }, filter } },
        // ELSER on structure
        { standard: { query: { semantic: { field: 'lesson_structure_semantic', query: text } }, filter } }
      ],
      rank_window_size: 100,
      rank_constant: 60
    }
  }
}

// Unit search with four retrievers
{
  retriever: {
    rrf: {
      retrievers: [
        // BM25 on content
        { standard: { query: { multi_match: { query: text, fields: ['unit_content', 'unit_title'] } }, filter } },
        // BM25 on structure
        { standard: { query: { multi_match: { query: text, fields: ['unit_structure'] } }, filter } },
        // ELSER on content
        { standard: { query: { semantic: { field: 'unit_content_semantic', query: text } }, filter } },
        // ELSER on structure
        { standard: { query: { semantic: { field: 'unit_structure_semantic', query: text } }, filter } }
      ],
      rank_window_size: 100,
      rank_constant: 60
    }
  }
}
```

### Implementation Tasks

#### 1. Update Field Definitions (SDK)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

```typescript
// LESSONS_INDEX_FIELDS changes:
// - Rename transcript_text → lesson_content
// - Rename lesson_semantic → lesson_content_semantic
// - Rename lesson_summary_semantic → lesson_structure_semantic
// - ADD lesson_structure (text field)

// UNIT_ROLLUP_INDEX_FIELDS changes:
// - Rename rollup_text → unit_content
// - Rename unit_semantic → unit_content_semantic (restore to rollup content)
// - ADD unit_structure (text field)
// - ADD unit_structure_semantic (semantic_text field)
```

#### 2. Update Document Transforms

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`

```typescript
// createLessonDocument():
// - lesson_content: transcript (was transcript_text)
// - lesson_content_semantic: transcript (was lesson_semantic)
// - lesson_structure: curated summary (NEW - use generateLessonSemanticSummary)
// - lesson_structure_semantic: curated summary (was lesson_summary_semantic)

// createRollupDocument():
// - unit_content: rollup text (was rollup_text)
// - unit_content_semantic: rollup text (RESTORE - was incorrectly changed to summary)
// - unit_structure: curated summary (NEW - use generateUnitSemanticSummary)
// - unit_structure_semantic: curated summary (NEW - use generateUnitSemanticSummary)
```

#### 3. Update Summary Generator

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/semantic-summary-generator.ts`

- Expand `generateLessonSemanticSummary()` to include ALL API fields
- Expand `generateUnitSemanticSummary()` to include ALL API fields including full lesson list

#### 4. Update Query Builders

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts`

- Update `buildLessonSemanticRetriever()` → `buildLessonContentRetriever()` + `buildLessonStructureRetriever()`
- Update `buildUnitSemanticRetriever()` → `buildUnitContentRetriever()` + `buildUnitStructureRetriever()`
- Update RRF builders to use four retrievers

#### 5. Update ES Mappings

Run `pnpm type-gen` to regenerate mappings from updated field definitions.

#### 6. Re-index and Verify

```bash
pnpm es:setup        # Recreate indices with new mappings
pnpm es:ingest-live -- --subject maths --keystage ks4  # Re-index data
pnpm smoke:dev:stub  # Run smoke tests including KS4 filtering
```

### KS4 Filtering Verification

**CRITICAL**: Must prove KS4 filtering works before declaring Phase 3 complete.

**Test queries**:

```typescript
// Filter by tier
{ subjectSlug: 'maths', keyStageSlug: 'ks4', tierSlug: 'foundation' }

// Filter by exam board
{ subjectSlug: 'science', keyStageSlug: 'ks4', examBoardSlug: 'aqa' }

// Filter by exam subject
{ subjectSlug: 'science', keyStageSlug: 'ks4', examSubjectSlug: 'gcse-biology' }

// Filter by KS4 option
{ subjectSlug: 'maths', keyStageSlug: 'ks4', ks4OptionSlug: 'higher' }
```

**Files**: `apps/oak-open-curriculum-semantic-search/smoke-tests/ks4-filtering.smoke.test.ts`

### Success Criteria

1. ✅ All four retrievers configured for both lessons and units
2. ✅ Field names follow consistent nomenclature
3. ✅ Structure summaries include ALL available API fields
4. ✅ KS4 filtering returns expected results
5. ✅ MRR ≥ 0.70, NDCG@10 ≥ 0.75 maintained or improved
6. ✅ All quality gates pass
7. ✅ Re-indexed Maths KS4 data passes smoke tests

---

## TDD Requirements

Per `testing-strategy.md`, all work MUST follow TDD at the appropriate level:

| Change Type                   | Test Level  | Write First                         |
| ----------------------------- | ----------- | ----------------------------------- |
| New field extraction function | Unit        | Unit test for pure transform        |
| Unit search endpoint changes  | Integration | Integration test for query building |
| Multi-index search behaviour  | E2E/Smoke   | Smoke test specifying new behaviour |
| Ground truth for unit search  | Smoke       | Define expected results first       |

**Sequence**:

1. Write test specifying desired behaviour (RED)
2. Run test - it MUST fail
3. Implement code (GREEN)
4. Run test - it MUST pass
5. Refactor if needed - tests MUST stay green

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

## Key Files

### Document Transforms

```text
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
└── document-transforms.ts          # createLessonDocument(), createUnitDocument()
```

### Field Definitions (Schema Source)

```text
packages/sdks/oak-curriculum-sdk/src/...
└── field-definitions/curriculum.ts # Index schemas - add new fields here
```

### Query Builders

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way hybrid (BM25 + ELSER)
└── rrf-query-helpers.ts            # Shared helpers
```

### Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── subjects.ts         # Subject name variations
├── key-stages.ts       # Key stage aliases
└── index.ts            # Barrel file
```

### Ground Truth

```text
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/ground-truth/
├── units/              # 43 unit queries (algebra, geometry, number, statistics, graphs)
└── ...                 # 40 lesson queries
```

### Smoke Tests

```text
apps/oak-open-curriculum-semantic-search/smoke-tests/
├── search-quality.smoke.test.ts           # Lesson search benchmarks
├── unit-search-quality.smoke.test.ts      # Unit search benchmarks
└── unit-search-verification.smoke.test.ts # Unit hybrid verification
```

---

## Dependencies

- **Upstream**: None (uses existing Open API data)
- **Blocks**: Phase 4 (Search SDK + CLI), Phase 5 (Search UI), Phase 8 (Query Enhancement)
- **Enables**: `semantic_search` MCP tool creation (coordinated in `.agent/plans/sdk-and-mcp-enhancements/`)

---

## After Phase 3 Completion

1. **MCP tool creation** - Coordinated separately in `.agent/plans/sdk-and-mcp-enhancements/`
2. **Full curriculum ingest** - 10,000 req/hr rate limit makes this feasible
3. **Test cross-subject search** - Validate patterns work beyond Maths KS4

---

## Related Documents

### Planning & Requirements

- [Requirements](./requirements.md) - Business context and success criteria
- [Feature Parity Analysis](../../research/feature-parity-analysis.md) - Gap analysis with OWA
- [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) - Fields needing API changes
- [Prompt Entry Point](../../prompts/semantic-search/semantic-search.prompt.md) - Fresh chat starting point
- [Navigation Hub](./README.md) - All phases overview
- **[ES Reset & Re-Validation Plan](.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md)** - Detailed execution plan with acceptance criteria

### ADRs

- [ADR-066: SDK Response Caching](../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) - Redis caching for SDK responses
- [ADR-075: Dense Vector Code Removal](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) - Why dense vectors were removed
- [ADR-076: ELSER-Only Embedding Strategy](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) - Sparse-only strategy
- [ADR-077: Semantic Summary Generation](../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) - Summary templates
- [ADR-079: SDK Cache TTL Jitter](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) - Cache TTL with jitter
- [ADR-080: KS4 Metadata Denormalisation](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) - Sequence traversal strategy
