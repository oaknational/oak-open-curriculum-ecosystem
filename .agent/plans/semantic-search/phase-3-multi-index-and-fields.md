# Phase 3: Multi-Index Search & Fields

**Status**: Part 3.0 ✅ COMPLETE | Parts 3a & 3b 🔲 PENDING  
**Estimated Effort**: 2-3 days remaining (3a + 3b)  
**Prerequisites**: Phase 1 & 2 complete (two-way hybrid confirmed optimal)  
**Last Updated**: 2025-12-15

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

### Current State

| Index             | Hybrid Search | Proven Working | Notes                                          |
| ----------------- | ------------- | -------------- | ---------------------------------------------- |
| `oak_lessons`     | BM25 + ELSER  | ⚠️ Not proven  | Code uses hybrid, but BM25 vs ELSER not tested |
| `oak_unit_rollup` | BM25 + ELSER  | ⚠️ Not proven  | Code uses hybrid, but BM25 vs ELSER not tested |
| `oak_units`       | BM25 only     | ❌ Not tested  | No semantic field                              |
| `oak_sequences`   | BM25 + ELSER  | ❌ Not tested  | `sequence_semantic` exists                     |
| `oak_threads`     | BM25 + ELSER  | ❌ Not tested  | `thread_semantic` exists                       |

**Note**: "Code uses hybrid" is not the same as "hybrid is proven to work". We need to run BM25-only, ELSER-only, and hybrid queries against ground truth to prove ELSER contributes meaningfully.

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

### Implementation Tasks (3.0)

| Task                                   | Description                                                                   | Effort | Priority     | Status     |
| -------------------------------------- | ----------------------------------------------------------------------------- | ------ | ------------ | ---------- |
| **BM25 vs ELSER vs Hybrid experiment** | Prove hybrid is superior to either method alone                               | Medium | **CRITICAL** | 🔲 Pending |
| **Prove lesson-only search**           | Smoke test verifying lesson search returns only lessons with correct doc_type | Low    | **CRITICAL** | 🔲 Pending |
| **Prove unit-only search**             | Smoke test verifying unit search returns only units with correct doc_type     | Low    | **CRITICAL** | 🔲 Pending |
| **Prove joint search**                 | Smoke test verifying mixed results are properly categorised                   | Medium | **CRITICAL** | 🔲 Pending |
| **Prove lesson filter by unit**        | Smoke test verifying unit filter restricts lesson results correctly           | Low    | **CRITICAL** | 🔲 Pending |
| **Add `doc_type` field**               | Re-index with doc_type if not present in ES (schema exists, data may not)     | Medium | **HIGH**     | 🔲 Pending |
| **ADR: unified vs separate endpoints** | Document architectural decision on search endpoint strategy                   | Low    | Medium       | 🔲 Pending |
| **Experiment with unit reranking**     | Test reranking with `rollup_text` (~300 chars/lesson) using ES native rerank  | Low    | Medium       | 🔲 Pending |

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

### Success Criteria (3.0)

**Verification (MUST complete before Part 3a)**:

- [ ] BM25 vs ELSER vs Hybrid experiment proves hybrid is superior
- [ ] Lesson-only search verified (returns only lessons)
- [ ] Unit-only search verified (returns only units)
- [ ] Joint search verified (returns both types, properly categorised)
- [ ] Lesson filter by unit verified (filters work correctly)

**Infrastructure**:

- [ ] `doc_type` field present in ES indexes (requires re-index if not)
- [ ] Decision on unified vs separate endpoints documented (ADR)
- [ ] Unit reranking experiment completed

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

**Schema analysis (2025-12-13)** revealed these fields are essential for KS4 curriculum navigation:

#### What IS in the Schema

| Field               | Location                             | Purpose                                   |
| ------------------- | ------------------------------------ | ----------------------------------------- |
| `tiers[]`           | `SequenceUnitsResponseSchema`        | Array of tier objects (Foundation/Higher) |
| `tiers[].tierTitle` | Tier object                          | Human-readable tier name                  |
| `tiers[].tierSlug`  | Tier object                          | `"foundation"` or `"higher"`              |
| `examBoardTitle`    | `LessonSearchResponseSchema.units[]` | `string \| null`                          |
| `ks4Options`        | Sequence schemas                     | Contains `title` and `slug` for pathway   |
| `ks4Options.slug`   | ks4Options                           | **This IS the "pathway" concept**         |
| `ks4Options.title`  | ks4Options                           | Human-readable pathway name               |

#### Schema Clarifications

**IMPORTANT**: Previous code assumed a `programmeFactors` object with `tier`, `examBoard`, and `pathway` fields. This object **does NOT exist** in the schema.

| Concept            | Reality                                                 |
| ------------------ | ------------------------------------------------------- |
| `programmeFactors` | **Never existed** — remove any references               |
| `pathway`          | Is `ks4Options.slug` — not a separate concept           |
| `tier`             | Derive from `tiers[]` array or parse from sequence slug |
| `examBoard`        | Use `examBoardTitle` from search results                |

**Implementation**:

1. Index `tiers[]` data for filtering (Foundation vs Higher)
2. Index `ks4Options` for pathway filtering
3. Use `examBoardTitle` for exam board facets
4. Update extractors to use actual schema fields
5. Document any derivations in upstream wishlist

**Benefit**: Enables critical KS4 filtering for GCSE content (tiers, exam boards, pathways).

### Success Criteria (3a)

- [ ] OWA aliases merged into synonym system (subjects, key stages, exam boards)
- [ ] `pupilLessonOutcome` indexed and queryable with BM25 boost
- [ ] Display title fields (`subjectTitle`, `keyStageTitle`) added to lesson documents
- [ ] Unit enrichment fields indexed (`description`, `whyThisWhyNow`, `categories`, `priorKnowledgeRequirements`, `nationalCurriculumContent`)
- [ ] **KS4 Options indexed** (`ks4Options.slug`, `ks4Options.title`) for pathway filtering
- [ ] **Tiers indexed** (`tierSlug`, `tierTitle`) for Foundation/Higher filtering
- [ ] **Exam board indexed** (`examBoardTitle`) where available
- [ ] Programme factor extractors use actual schema fields (not fictional `programmeFactors`)
- [ ] Derived fields documented in upstream wishlist
- [ ] ADR documenting field additions and rationale
- [ ] All quality gates pass
- [ ] Re-indexing completed with new fields populated

### Success Criteria (3b)

- [ ] Dense vector code removed from codebase
- [ ] Lesson semantic summary template implemented
- [ ] Unit semantic summary template implemented
- [ ] Redis caching for semantic summaries working
- [ ] A/B comparison: summary-based vs transcript-based ELSER
- [ ] Quality improvement measured (MRR/NDCG delta)
- [ ] All quality gates pass

---

## Part 3b: Semantic Summary Enhancement

**Priority**: HIGH - Improve embedding quality for pedagogical matching

### Background

Current embedding strategy uses ELSER on:

- **Lessons**: Full transcript (~5000 tokens) - dilutes pedagogical signal
- **Units**: `rollupText` (~200-400 tokens) - aggregated from lessons, not curated

Semantic summaries provide information-dense text (~200 tokens) optimised for embeddings.

### ADRs

| ADR     | Title                         | Status         |
| ------- | ----------------------------- | -------------- |
| ADR-075 | Dense Vector Code Removal     | ✅ Implemented |
| ADR-076 | ELSER-Only Embedding Strategy | ✅ Accepted    |
| ADR-077 | Semantic Summary Generation   | ✅ Accepted    |
| ADR-079 | SDK Cache TTL Jitter          | ✅ Implemented |

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

**Purpose**: Generate ~200 token summary for pedagogical matching.

**Template**:

```text
{lessonTitle} is a {keyStage} {subject} lesson for Year {year}.

Key learning: {keyLearningPoints[0..2]}.

Keywords: {keywords with descriptions}.

Prior knowledge: {priorKnowledge}.

Common misconception: {misconceptions[0]}.

Pupil outcome: {pupilLessonOutcome}.
```

**API fields used**:

- `lessonTitle`, `keyStage`, `subject`, `year` - Context
- `keyLearningPoints` - Learning objectives
- `lessonKeywords` - Vocabulary with definitions
- `priorKnowledge` - Prerequisites
- `misconceptionsAndCommonMistakes` - What to avoid
- `pupilLessonOutcome` - Expected outcome

**Index field**: `lesson_summary_semantic` (new, ELSER)

### Task 3: Unit Semantic Summary Template

**Purpose**: Replace `rollupText` with curated summary.

**Template**:

```text
{unitTitle} is a {keyStage} {subject} unit containing {lessonCount} lessons.

Overview: {whyThisWhyNow}.

Key concepts: {derived from lesson titles and keywords}.

Prior knowledge: {priorKnowledgeRequirements[0..2]}.

National curriculum: {nationalCurriculumContent[0..2]}.

Lessons: {lessonTitles as comma-separated list}.
```

**API fields used**:

- `unitTitle`, `keyStage`, `subject` - Context
- `unitLessons` - Lesson titles
- `whyThisWhyNow` - Pedagogical rationale
- `priorKnowledgeRequirements` - Prerequisites
- `nationalCurriculumContent` - NC alignment

**Index field**: `unit_semantic` (replace existing content)

**Comparison field**: Keep `rollup_text` for side-by-side comparison.

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

- [Requirements](./requirements.md) - Business context and success criteria
- [Feature Parity Analysis](../../research/feature-parity-analysis.md) - Gap analysis with OWA
- [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) - Fields needing API changes
- [Prompt Entry Point](../../prompts/semantic-search/semantic-search.prompt.md) - Fresh chat starting point
- [Navigation Hub](./README.md) - All phases overview
- **[ES Reset & Re-Validation Plan](.cursor/plans/es_reset_and_re-validation_2c12716d.plan.md)** - Detailed execution plan with acceptance criteria
