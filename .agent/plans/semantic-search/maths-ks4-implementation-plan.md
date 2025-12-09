# Maths KS4 Complete Implementation Plan

**Git Version**: See `git log` for commit history  
**Status**: Phase 1A ✅ | Phase 1B ✅ | Phase 1D ✅ | Blocking Issues ✅ | Phase 1C READY TO START  
**Priority**: HIGH  
**Foundation Alignment**: ✅ rules.md | schema-first-execution.md | testing-strategy.md

---

## Executive Summary

This plan implements semantic search for Maths KS4, starting with the **simplest approach that delivers value** (two-way hybrid: BM25 + ELSER) and only adding complexity when validated necessary.

### First Question

**Could it be simpler without compromising quality?**

We start with two-way hybrid search (BM25 + ELSER) and only add dense vectors if baseline metrics don't meet targets.

### Strategic Goal

Create a production-ready demo that proves ES Serverless as the **definitive platform** for intelligent curriculum search using Maths KS4 as a complete vertical slice.

### Why Maths KS4 Vertical Slice?

Given the **Oak API 1000 requests/hour limit**, full ingestion of 340 combinations would take 17-24 hours. Maths KS4 provides:

- ✅ **Maximum complexity**: Tiers (Foundation/Higher), pathways, exam boards, threads
- ✅ **High value**: Exam preparation content teachers actively need
- ✅ **Complete feature coverage**: Tests all search, faceting, and semantic capabilities
- ✅ **Manageable scope**: ~100-200 requests = 10-20 minutes to ingest
- ✅ **Foundation for expansion**: Patterns scale to full curriculum

### What We're Building (Phased Approach)

**Phase 1 - Foundation**: Two-way hybrid search (BM25 + ELSER) with Maths KS4 data  
**Phase 2 - Validation**: Evaluate if dense vectors add value (only if Phase 1 insufficient)  
**Phase 3+ - Enhancement**: Elastic Native ReRank, NER entity extraction, RAG, knowledge graph

**Key Principle**: Validate each layer before adding the next.

---

## Technical Debt Resolved ✅ (2025-12-09)

All 12 blocking issues identified during deep review have been resolved. Phase 1C can now proceed.

| ID  | Category     | Issue                                           | Resolution                                                   |
| --- | ------------ | ----------------------------------------------- | ------------------------------------------------------------ |
| 1.1 | Schema/Field | Missing `pathway` field in unit_rollup          | ✅ Added to `UNIT_ROLLUP_INDEX_FIELDS` and ES overrides      |
| 1.2 | Schema/Field | `thread_slugs/titles/orders` never populated    | ✅ `extractThreadInfo()` created, integrated into transforms |
| 1.3 | Schema/Field | Dense vector field naming inconsistency         | ✅ Documented in TSDoc comments                              |
| 2.1 | Facets       | Lesson facets missing tier, exam_board, pathway | ✅ Added to `createLessonFacets()`                           |
| 2.2 | Facets       | No unit facets exist                            | ✅ Created `createUnitFacets()` with `includeFacets` param   |
| 2.3 | Facets       | Sequence facets defined but unused              | ✅ Documented as future work in TSDoc                        |
| 3.1 | Data         | Hardcoded `subjectSlugs: ['maths']`             | ✅ Parameterised via `FetchThreadsOptions`                   |
| 3.2 | Data         | `buildThreadOps` returns `unknown[]`            | ✅ Replaced with `ThreadBulkOperation[]` type                |
| 3.3 | Data         | Rollup text missing pedagogical data            | ✅ `extractPedagogicalData()` + `createEnrichedRollupText()` |
| 4.1 | Status       | Phase 1C marked "CURRENT" but not started       | ✅ Status corrected in all documents                         |
| 4.2 | Status       | Missing search-quality infrastructure           | ✅ Created `src/lib/search-quality/` with types and exports  |
| 4.3 | Status       | Missing IR metrics implementation               | ✅ MRR and NDCG@10 implemented with TDD (13 unit tests)      |

---

## Foundation Document Alignment

### Schema-First Execution (Mandatory)

**Cardinal Rule**: Every byte of runtime behavior flows from generated artifacts at `pnpm type-gen` time.

**Compliance Requirements**:

1. **New field definitions** (dense vectors, entities, etc.) → `field-definitions/curriculum.ts`
2. **ES mappings auto-generate** from field definitions via `es-mapping-from-fields.ts`
3. **Zod schemas auto-generate** from field definitions via `zod-schema-generator.ts`
4. **Inference configurations** → Type-gen generates type-safe inference endpoint descriptors
5. **Never edit generated files** - update generators only, run `pnpm type-gen`

### TDD at ALL Levels (Mandatory)

**Test-First Approach**:

1. **Unit tests** for extraction functions (RED → GREEN → REFACTOR)
2. **Integration tests** for document transforms with new fields
3. **E2E tests** for new search endpoints before implementation
4. **No mocks in unit tests** - pure functions only
5. **Simple mocks in integration tests** - injected as arguments

### Documentation Requirements (Mandatory)

**For Every Feature**:

1. **TSDoc comments** with examples in all functions/modules
2. **Authored documentation** in `apps/oak-open-curriculum-semantic-search/docs/`
3. **ADR creation** for architectural decisions (see ADR checklist per phase)
4. **Update semantic-search.prompt.md** with new capabilities
5. **typedoc-compatible** documentation for public APIs

---

## Implementation Timeline

**Total Duration**: 4-5 weeks (22-29 days)

### Phase Overview

| Phase | Focus                              | Duration | Key ES Features                                  | ADRs |
| ----- | ---------------------------------- | -------- | ------------------------------------------------ | ---- |
| **1** | Two-Way Hybrid + Maths KS4 Ingest  | 1-2 days | BM25 + ELSER RRF, baseline metrics               | 1    |
| **2** | Evaluate Dense Vectors (if needed) | 1 day    | Only if Phase 1 insufficient                     | 1    |
| **3** | Relevance Enhancement              | 2-3 days | Elastic Native ReRank, filtered kNN, query rules | 2    |
| **4** | Entity Extraction & Graph          | 3-4 days | NER models, Graph API, enrich processor          | 3    |
| **5** | Reference Indices & Threads        | 2-3 days | 5 new indices, thread support                    | 1    |
| **6** | RAG Infrastructure                 | 4-5 days | ES Playground, semantic_text, chunking           | 2    |
| **7** | Knowledge Graph                    | 5-6 days | Triple store, entity resolution                  | 2    |
| **8** | Advanced Features                  | 3-4 days | LTR foundations, multi-vector                    | 2    |

### Week-by-Week Breakdown

| Week  | Focus     | Deliverables                                                             |
| ----- | --------- | ------------------------------------------------------------------------ |
| **1** | Phase 1-3 | Two-way hybrid, Maths KS4 ingestion, baseline, reranking, 4 ADRs, 4 docs |
| **2** | Phase 4-5 | Entity extraction, Graph API, reference indices, 4 ADRs, 5 docs          |
| **3** | Phase 6   | RAG infrastructure, ES Playground, chunked transcripts, 2 ADRs, 3 docs   |
| **4** | Phase 7   | Knowledge graph, triple store, entity resolution, 2 ADRs, 2 docs         |
| **5** | Phase 8   | LTR foundations, multi-vector, polish, 2 ADRs, 2 docs                    |

**Aggressive**: 3 weeks with parallel work  
**Conservative**: 6 weeks with thorough validation

**Key Principle**: Complete Phase 1 baseline before proceeding. Each phase validates assumptions before adding complexity.

---

## Pre-Phase: ES Field Overrides Audit (BLOCKING)

### Goal

Ensure `es-field-overrides.ts` contains all required field type overrides before any ingestion or query implementation.

### Current State (2025-12-08)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

The following overrides exist:

| Index                             | Fields with overrides                                     |
| --------------------------------- | --------------------------------------------------------- |
| `LESSONS_FIELD_OVERRIDES`         | `lesson_dense_vector`, `tier`, `exam_board`, `pathway` ✅ |
| `UNIT_ROLLUP_FIELD_OVERRIDES`     | `unit_dense_vector`, `tier`, `exam_board` ✅              |
| `UNITS_FIELD_OVERRIDES`           | (none for new fields)                                     |
| `SEQUENCES_FIELD_OVERRIDES`       | (none for new fields)                                     |
| `SEQUENCE_FACETS_FIELD_OVERRIDES` | (none for new fields)                                     |

### Missing Overrides (Must Add)

```typescript
// LESSONS_FIELD_OVERRIDES - add:
title_dense_vector: { type: 'dense_vector', dims: 384, index: true, similarity: 'cosine' },

// UNIT_ROLLUP_FIELD_OVERRIDES - add:
pathway: { type: 'keyword' },

// UNITS_FIELD_OVERRIDES - add:
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },
unit_type: { type: 'keyword' },

// SEQUENCES_FIELD_OVERRIDES - add:
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },

// SEQUENCE_FACETS_FIELD_OVERRIDES - add:
tiers_available: { type: 'keyword' },
exam_boards_available: { type: 'keyword' },
pathways_available: { type: 'keyword' },
```

### Implementation Steps

1. **Add missing overrides** to `es-field-overrides.ts`
2. **Run `pnpm type-gen`** to regenerate ES mappings
3. **Verify generated mappings** include correct field types
4. **Run quality gates** to ensure no regressions

### Success Criteria

- [x] Core keyword fields have `type: 'keyword'` in overrides (lessons, unit_rollup) ✅
- [x] All dense vector fields have `type: 'dense_vector'` with 384 dims ✅
- [x] `pnpm type-gen` produces correct mappings ✅
- [x] All quality gates pass ✅

**Remaining for Phase 2B**: keyword overrides for units, sequences, sequence_facets indexes.

---

## Phase 1: Two-Way Hybrid Search with Maths KS4

### Phase 1A: Data Ingestion ✅ COMPLETE (2025-12-08)

**Goal**: Ingest Maths KS4 data with dense vector generation and ELSER semantic text.

**Status**: Complete - 173 documents successfully indexed.

### Phase 1B: RRF API Update ✅ COMPLETE (2025-12-08)

**Goal**: Update RRF query builders to use ES 8.11+ `retriever` API instead of deprecated `rank` API.

**Completed**:

- ✅ Updated `EsSearchRequest` type in `elastic-http.ts` to use `retriever` property
- ✅ Updated `rrf-query-builders.ts` with new `retriever` structure
- ✅ Updated `rrf-query-builders-three-way.ts` with new `retriever` structure
- ✅ Extracted shared helpers to `rrf-query-helpers.ts`
- ✅ Updated all unit tests to expect `retriever` structure
- ✅ Validated against live ES Serverless (21 results for "pythagoras theorem")
- ✅ All quality gates passing

### Phase 1C: Baseline Metrics 🟢 READY TO START

**Goal**: Establish baseline metrics with **two-way hybrid search (BM25 + ELSER)** before considering additional complexity.

**Prerequisites** ✅ ALL RESOLVED (2025-12-09):

| ID  | Issue                                                            | Resolution                                                   |
| --- | ---------------------------------------------------------------- | ------------------------------------------------------------ |
| 1.1 | Missing `pathway` field in unit_rollup                           | ✅ Added to `UNIT_ROLLUP_INDEX_FIELDS` and ES overrides      |
| 1.2 | `thread_slugs`, `thread_titles`, `thread_orders` never populated | ✅ `extractThreadInfo()` created, integrated into transforms |
| 3.1 | Hardcoded `subjectSlugs: ['maths']`                              | ✅ Parameterised via `FetchThreadsOptions`                   |
| 3.2 | `buildThreadOps` returns `unknown[]`                             | ✅ Replaced with `ThreadBulkOperation[]` type                |
| 4.2 | Missing search-quality infrastructure                            | ✅ Created `src/lib/search-quality/` with ground-truth.ts    |
| 4.3 | Missing IR metrics implementation                                | ✅ MRR and NDCG@10 implemented with TDD (13 unit tests)      |

**Detailed Implementation Guide**: See `.agent/prompts/semantic-search/semantic-search.prompt.md` for:

- IR metrics explanation (MRR, NDCG@10, what they mean)
- Ground truth creation (relevance judgment methodology)
- Metrics calculation code examples
- E2E test suite implementation

### First Question Applied

**Could it be simpler?** Yes - start with two-way hybrid (BM25 + ELSER) which is already implemented. Only add dense vectors if baseline metrics don't meet targets.

### Key Decision: Simpler First (2025-12-08)

Start with two-way hybrid (BM25 + ELSER) instead of immediately implementing three-way:

| Approach             | Complexity | Dependencies    | Risk               |
| -------------------- | ---------- | --------------- | ------------------ |
| Two-way (BM25+ELSER) | Low        | None additional | Validated approach |
| Three-way (+dense)   | Medium     | E5 inference    | May not add value  |

**Rationale**: Validate that simpler approach meets quality targets before adding complexity.

### Quick Start Checklist

#### Phase 1A Prerequisites ✅ Complete

- [x] Re-read foundation documents (rules.md, schema-first-execution.md, testing-strategy.md)
- [x] Elasticsearch Serverless running with ELSER configured
- [x] Two-way RRF query builders implemented (needs API update for ES 8.11+)
- [x] Tier, exam_board, pathway field extraction implemented
- [x] Document transforms ready
- [x] All current quality gates passing

#### Step-by-Step Execution

**Phase 1A: Data Ingestion ✅ Complete**

- [x] Verified ES connection
- [x] Ingested Maths KS4: `pnpm es:ingest-live --subject maths --keystage ks4 --verbose`
- [x] **Results**: 100 lessons, 36 units, 36 rollups, 1 sequence facet = 173 documents
- [x] Dense vectors generated successfully (384-dim E5)
- [x] Basic BM25 search validated with representative queries
- [x] All quality gates passing

**Phase 1B: RRF API Update ✅ Complete (2025-12-08)**

- [x] Researched ES 8.11+ `retriever` API syntax for RRF
- [x] Updated `rrf-query-builders.ts` (two-way: BM25 + ELSER)
- [x] Updated `rrf-query-builders-three-way.ts` (three-way: BM25 + ELSER + Dense)
- [x] Updated `elastic-http.ts` to support `retriever` property
- [x] Updated unit tests to expect new `retriever` structure
- [x] Tested RRF queries with Maths KS4 data against live ES Serverless
- [x] All quality gates passing

**Phase 1C: Baseline Metrics ⏭️ Current**

**Step 1: Test Two-Way Hybrid Search**

Representative queries (already validated with basic BM25):

- "quadratic equations" ✅
- "Pythagoras theorem" ✅
- "trigonometry" ✅
- "solving simultaneous equations" ✅

**Step 2: Capture Baseline Metrics**

- Mean Reciprocal Rank (MRR) - target: > 0.70
- NDCG@10 - target: > 0.75
- Zero-hit rate - target: < 10%
- p95 latency - target: < 300ms

**Step 3: Decision Point**

- **If targets met**: Proceed with two-way hybrid, skip Phase 2
- **If targets not met**: Proceed to Phase 2 to evaluate dense vectors (infrastructure already built)

### ES Serverless Features Used (Phase 1)

1. **BM25 Lexical Search** - Standard text matching with field boosting
2. **ELSER Sparse Embeddings** - Semantic understanding via `.elser-2-elasticsearch`
3. **Two-Way RRF** - Fuse lexical + ELSER results
4. **Faceting** - Tier, exam_board, pathway filters

### Available Endpoints

| Endpoint                               | Type                     | Status        | Phase 1 Use |
| -------------------------------------- | ------------------------ | ------------- | ----------- |
| `.elser-2-elasticsearch`               | sparse_embedding         | PRECONFIGURED | ✅ Active   |
| `.multilingual-e5-small-elasticsearch` | text_embedding (384-dim) | PRECONFIGURED | Phase 2     |
| `.rerank-v1-elasticsearch`             | rerank                   | TECH PREVIEW  | Phase 3     |

### Implementation Steps

#### Step 1: Ingest Maths KS4 (Current)

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:status  # Verify connection
pnpm es:ingest-live --subject maths --keystage ks4 --verbose
```

#### Step 2: Validate Search Quality

Test representative queries and capture results:

- "quadratic equations"
- "Pythagoras theorem"
- "trigonometry foundation tier"
- "solving simultaneous equations"

#### Step 3: Establish Baseline Metrics

- Mean Reciprocal Rank (MRR) - target: > 0.70
- NDCG@10 - target: > 0.75
- Zero-hit rate - target: < 10%
- p95 latency - target: < 300ms

#### Step 4: Decision Point

**If two-way meets targets**: Proceed with two-way for production, skip Phase 2
**If two-way insufficient**: Proceed to Phase 2 to evaluate dense vectors

### Field Additions Summary

**Implemented (2025-12-07)**:

| Index             | Current Fields | Phase 1A Adds | New Total |
| ----------------- | -------------- | ------------- | --------- |
| `oak_lessons`     | 21             | +4            | **25**    |
| `oak_unit_rollup` | 18             | +3            | **21**    |

**Fields Added**:

- `lesson_dense_vector` (384-dim, E5)
- `tier` (keyword)
- `exam_board` (keyword)
- `pathway` (keyword, lessons only)
- `unit_dense_vector` (384-dim, E5, unit_rollup only)

**Deferred to Later Phases**: Additional fields for units, sequences, and sequence_facets.

### Field Additions (Schema-First)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

#### Lessons Index

```typescript
// Add to LESSONS_INDEX_FIELDS
// Note: zodType is for Zod schema generation; ES types are set via es-field-overrides.ts
{ name: 'lesson_dense_vector', zodType: 'array-number', optional: true },  // ES: dense_vector (384-dim)
{ name: 'title_dense_vector', zodType: 'array-number', optional: true },   // ES: dense_vector (384-dim)
{ name: 'tier', zodType: 'string', optional: true },            // ES: keyword (faceting)
{ name: 'exam_board', zodType: 'string', optional: true },      // ES: keyword (faceting)
{ name: 'pathway', zodType: 'string', optional: true },         // ES: keyword (faceting)
{ name: 'difficulty_level', zodType: 'string', optional: true }, // ES: keyword (faceting)
{ name: 'estimated_duration_minutes', zodType: 'number', optional: true },
{ name: 'resource_types', zodType: 'string-array', optional: true },         // ES: keyword[] (faceting)
{ name: 'prerequisite_lesson_ids', zodType: 'string-array', optional: true }, // ES: keyword[] (IDs)
{ name: 'related_lesson_ids', zodType: 'string-array', optional: true },      // ES: keyword[] (IDs)
```

#### Units Index

```typescript
// Add to UNITS_INDEX_FIELDS
{ name: 'unit_dense_vector', zodType: 'array-number', optional: true },      // ES: dense_vector
{ name: 'tier', zodType: 'string', optional: true },              // ES: keyword (faceting)
{ name: 'exam_board', zodType: 'string', optional: true },        // ES: keyword (faceting)
{ name: 'pathway', zodType: 'string', optional: true },           // ES: keyword (faceting)
{ name: 'unit_type', zodType: 'string', optional: true },         // ES: keyword (faceting)
{ name: 'estimated_total_hours', zodType: 'number', optional: true },
{ name: 'assessment_included', zodType: 'boolean', optional: true },
{ name: 'resource_types', zodType: 'string-array', optional: true },         // ES: keyword[]
{ name: 'prerequisite_unit_ids', zodType: 'string-array', optional: true },  // ES: keyword[] (IDs)
```

#### Unit Rollup Index

```typescript
// Add to UNIT_ROLLUP_INDEX_FIELDS
{ name: 'rollup_dense_vector', zodType: 'array-number', optional: true },    // ES: dense_vector
{ name: 'tier', zodType: 'string', optional: true },              // ES: keyword (faceting)
{ name: 'exam_board', zodType: 'string', optional: true },        // ES: keyword (faceting)
{ name: 'pathway', zodType: 'string', optional: true },           // ES: keyword (faceting)
{ name: 'unit_type', zodType: 'string', optional: true },         // ES: keyword (faceting)
{ name: 'total_lesson_count', zodType: 'number', optional: true },
{ name: 'combined_misconceptions', zodType: 'string-array', optional: true }, // ES: text[] (searchable)
{ name: 'combined_keywords', zodType: 'string-array', optional: true },       // ES: keyword[] (faceting)
{ name: 'combined_resource_types', zodType: 'string-array', optional: true }, // ES: keyword[]
{ name: 'average_difficulty', zodType: 'string', optional: true },            // ES: keyword
{ name: 'estimated_total_hours', zodType: 'number', optional: true },
```

#### Sequences Index

```typescript
// Add to SEQUENCES_INDEX_FIELDS
{ name: 'sequence_dense_vector', zodType: 'array-number', optional: true },  // ES: dense_vector
{ name: 'tier', zodType: 'string', optional: true },              // ES: keyword (faceting)
{ name: 'exam_board', zodType: 'string', optional: true },        // ES: keyword (faceting)
{ name: 'pathway', zodType: 'string', optional: true },           // ES: keyword (faceting)
{ name: 'threads_covered', zodType: 'string-array', optional: true },  // ES: keyword[] (faceting)
{ name: 'total_unit_count', zodType: 'number', optional: true },
{ name: 'progression_summary', zodType: 'text', optional: true },      // ES: text (full-text)
```

#### Sequence Facets Index

```typescript
// Add to SEQUENCE_FACETS_INDEX_FIELDS
{ name: 'tiers_available', zodType: 'string-array', optional: true },       // ES: keyword[]
{ name: 'exam_boards_available', zodType: 'string-array', optional: true }, // ES: keyword[]
{ name: 'pathways_available', zodType: 'string-array', optional: true },    // ES: keyword[]
{ name: 'threads_available', zodType: 'string-array', optional: true },     // ES: keyword[]
{ name: 'total_sequence_count', zodType: 'number', optional: true },
```

### ES Field Overrides

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

```typescript
// Add dense vector overrides
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
title_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
unit_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
rollup_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},
sequence_dense_vector: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
},

// Add keyword overrides for faceting
tier: { type: 'keyword' },
exam_board: { type: 'keyword' },
pathway: { type: 'keyword' },
unit_type: { type: 'keyword' },
difficulty_level: { type: 'keyword' },
resource_types: { type: 'keyword' },  // Array of keywords
tiers_available: { type: 'keyword' },
exam_boards_available: { type: 'keyword' },
pathways_available: { type: 'keyword' },
threads_available: { type: 'keyword' },
```

### Extraction Functions (TDD)

#### 1. Write Tests FIRST (RED)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.unit.test.ts`

```typescript
describe('extractTier', () => {
  it('should extract foundation tier from programme factors', () => {
    const lessonData = createLessonData({
      programmeFactors: { tier: 'foundation' },
    });
    expect(extractTier(lessonData)).toBe('foundation');
  });

  it('should extract higher tier', () => {
    const lessonData = createLessonData({
      programmeFactors: { tier: 'higher' },
    });
    expect(extractTier(lessonData)).toBe('higher');
  });

  it('should return undefined if no tier', () => {
    const lessonData = createLessonData({ programmeFactors: {} });
    expect(extractTier(lessonData)).toBeUndefined();
  });
});

describe('extractExamBoard', () => {
  it('should extract exam board from programme factors', () => {
    const lessonData = createLessonData({
      programmeFactors: { examBoard: 'aqa' },
    });
    expect(extractExamBoard(lessonData)).toBe('aqa');
  });

  it('should handle missing exam board', () => {
    const lessonData = createLessonData({ programmeFactors: {} });
    expect(extractExamBoard(lessonData)).toBeUndefined();
  });
});

describe('extractDifficultyLevel', () => {
  it('should compute difficulty from tier and year', () => {
    expect(extractDifficultyLevel('higher', '11')).toBe('advanced');
    expect(extractDifficultyLevel('foundation', '10')).toBe('intermediate');
    expect(extractDifficultyLevel('foundation', '9')).toBe('basic');
  });

  it('should handle missing data', () => {
    expect(extractDifficultyLevel(undefined, '10')).toBeUndefined();
  });
});

describe('extractResourceTypes', () => {
  it('should extract resource types from lesson components', () => {
    const lessonData = createLessonData({
      lessonComponents: {
        video: true,
        worksheet: true,
        exitQuiz: true,
      },
    });
    expect(extractResourceTypes(lessonData)).toEqual(['video', 'worksheet', 'quiz']);
  });

  it('should return empty array if no resources', () => {
    const lessonData = createLessonData({ lessonComponents: {} });
    expect(extractResourceTypes(lessonData)).toEqual([]);
  });
});
```

#### 2. Implement Extraction Functions (GREEN)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transform-helpers.ts`

````typescript
import type { LessonData } from '@oaknational/oak-curriculum-sdk/public/search';

/**
 * Extracts tier from lesson programme factors.
 *
 * @see ADR-073 - Dense Vector Field Strategy
 * @example
 * ```typescript
 * const tier = extractTier(lessonData);
 * // 'foundation' | 'higher' | undefined
 * ```
 */
export function extractTier(lessonData: LessonData): 'foundation' | 'higher' | undefined {
  const tier = lessonData.programmeFactors?.tier;
  if (tier === 'foundation' || tier === 'higher') {
    return tier;
  }
  return undefined;
}

/**
 * Extracts exam board from lesson programme factors.
 */
export function extractExamBoard(lessonData: LessonData): string | undefined {
  return lessonData.programmeFactors?.examBoard;
}

/**
 * Computes difficulty level from tier and year.
 *
 * Foundation Year 9-10 → basic
 * Foundation Year 11 → intermediate
 * Higher Year 10 → intermediate
 * Higher Year 11 → advanced
 */
export function extractDifficultyLevel(
  tier: 'foundation' | 'higher' | undefined,
  year: string | undefined,
): 'basic' | 'intermediate' | 'advanced' | undefined {
  if (!tier || !year) return undefined;

  const yearNum = parseInt(year, 10);
  if (isNaN(yearNum)) return undefined;

  if (tier === 'foundation') {
    return yearNum <= 10 ? 'basic' : 'intermediate';
  }

  // higher tier
  return yearNum <= 10 ? 'intermediate' : 'advanced';
}

/**
 * Extracts resource types from lesson components.
 *
 * Maps component flags to searchable resource type keywords.
 */
export function extractResourceTypes(lessonData: LessonData): string[] {
  const types: string[] = [];
  const components = lessonData.lessonComponents;

  if (!components) return types;

  if (components.video) types.push('video');
  if (components.worksheet) types.push('worksheet');
  if (components.presentation) types.push('slides');
  if (components.starterQuiz || components.exitQuiz) types.push('quiz');

  return types;
}
````

#### 3. Dense Vector Extraction (OpenAI Integration)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts` (NEW)

````typescript
import type { Client } from '@elastic/elasticsearch';
import { generateEmbedding } from '@oaknational/oak-curriculum-sdk/elasticsearch/inference';

/**
 * Generates dense vector embedding for lesson content.
 *
 * Combines title + summary into embedding text, calls OpenAI via ES Inference API.
 *
 * @see ADR-071 - OpenAI Inference API Integration
 * @see ADR-072 - Three-Way Hybrid Search
 *
 * @example
 * ```typescript
 * const vector = await generateLessonEmbedding(esClient, lessonData);
 * // number[] of length 384, or undefined on error
 * ```
 */
export async function generateLessonEmbedding(
  esClient: Client,
  lessonData: { title: string; summary?: string },
): Promise<number[] | undefined> {
  const text = [lessonData.title, lessonData.summary].filter(Boolean).join(' ');

  if (!text.trim()) return undefined;

  try {
    return await generateEmbedding(esClient, {
      endpointId: '.multilingual-e5-small-elasticsearch',
      text,
    });
  } catch (error) {
    // Graceful degradation: Continue without dense vector
    return undefined;
  }
}

/**
 * Generates dense vector for lesson title only.
 *
 * Used for title-specific semantic matching.
 */
export async function generateTitleEmbedding(
  esClient: Client,
  title: string,
): Promise<number[] | undefined> {
  if (!title.trim()) return undefined;

  try {
    return await generateEmbedding(esClient, {
      endpointId: '.multilingual-e5-small-elasticsearch',
      text: title,
    });
  } catch (error) {
    return undefined;
  }
}
````

### Integration into Document Transforms

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`

Update `createLessonDocument` to include new fields:

```typescript
import {
  extractTier,
  extractExamBoard,
  extractDifficultyLevel,
  extractResourceTypes,
} from './document-transform-helpers.js';
import { generateLessonEmbedding, generateTitleEmbedding } from './dense-vector-extraction.js';

export async function createLessonDocument(
  esClient: Client,
  lessonData: LessonData,
): Promise<LessonDocument> {
  const tier = extractTier(lessonData);
  const examBoard = extractExamBoard(lessonData);
  const year = lessonData.year;

  return {
    // ... existing fields ...
    tier,
    exam_board: examBoard,
    pathway: lessonData.programmeFactors?.pathway,
    difficulty_level: extractDifficultyLevel(tier, year),
    estimated_duration_minutes: lessonData.estimatedDuration,
    resource_types: extractResourceTypes(lessonData),
    prerequisite_lesson_ids: [], // Phase 2
    related_lesson_ids: [], // Phase 2
    lesson_dense_vector: await generateLessonEmbedding(esClient, lessonData),
    title_dense_vector: await generateTitleEmbedding(esClient, lessonData.title),
  };
}
```

### Three-Way RRF Query Implementation

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/three-way-rrf.ts` (NEW)

````typescript
import type { Client } from '@elastic/elasticsearch';
import { generateEmbedding } from '@oaknational/oak-curriculum-sdk/elasticsearch/inference';

/**
 * Executes three-way hybrid search with RRF fusion.
 *
 * Combines:
 * 1. BM25 lexical search (multi_match)
 * 2. ELSER sparse semantic search (text_expansion)
 * 3. Dense vector semantic search (knn)
 *
 * @see ADR-072 - Three-Way Hybrid Search
 *
 * @example
 * ```typescript
 * const results = await threeWayHybridSearch(esClient, {
 *   index: 'oak_lessons',
 *   query: 'How do I teach Pythagoras theorem?',
 *   size: 20,
 *   filters: { tier: 'higher' },
 * });
 * ```
 */
export async function threeWayHybridSearch(
  esClient: Client,
  params: {
    index: SearchIndexName;
    query: string;
    size?: number;
    filters?: SearchFilters;
  },
): Promise<SearchResults> {
  const { index, query, size = 20, filters } = params;

  // Generate query embedding
  const queryVector = await generateEmbedding(esClient, {
    endpointId: '.multilingual-e5-small-elasticsearch',
    text: query,
  });

  const response = await esClient.search({
    index,
    size,
    query: {
      bool: {
        // Apply filters
        filter: filters ? buildFilterClauses(filters) : undefined,
      },
    },
    // Three-way RRF
    sub_searches: [
      // 1. BM25 lexical
      {
        query: {
          multi_match: {
            query,
            fields: ['title^3', 'summary^2', 'transcript_text'],
          },
        },
      },
      // 2. ELSER sparse semantic
      {
        query: {
          text_expansion: {
            'ml.inference.title_expanded.predicted_value': {
              model_id: '.elser_model_2_linux-x86_64',
              model_text: query,
            },
          },
        },
      },
      // 3. Dense vector semantic
      queryVector
        ? {
            query: {
              knn: {
                field: 'lesson_dense_vector',
                query_vector: queryVector,
                k: 50,
                num_candidates: 100,
              },
            },
          }
        : undefined,
    ].filter(Boolean),
    rank: {
      rrf: {
        window_size: 50,
        rank_constant: 60,
      },
    },
  });

  return parseSearchResponse(response);
}
````

### ADRs to Create

1. **ADR-071: OpenAI Inference API Integration**
   - Decision: Use ES Inference API for OpenAI embeddings
   - Rationale: Native ES integration, better performance, unified error handling
   - Alternatives: Direct OpenAI SDK calls (more latency, separate retry logic)

2. **ADR-072: Three-Way Hybrid Search**
   - Decision: Combine BM25 + ELSER + Dense vectors via RRF
   - Rationale: 15-25% relevance improvement, captures multiple semantic signals
   - Tradeoffs: +50ms latency, OpenAI API cost

3. **ADR-073: Dense Vector Field Strategy**
   - Decision: Store lesson-level and title-level dense vectors
   - Rationale: Title vectors for precise matching, full vectors for broad semantic
   - Alternatives: Single vector per document (less flexible)

### Testing Requirements

1. **Unit tests**: 20+ tests for extraction functions
2. **Integration tests**: 5+ tests for document transforms with new fields
3. **E2E tests**:
   - Baseline metrics with two-way hybrid (BM25 + ELSER)
   - Three-way hybrid metrics (BM25 + ELSER + dense vectors)
   - Comparison documented in ADR

### Documentation to Create

1. `docs/search/three-way-hybrid-search.md` - User guide with examples
2. `docs/search/dense-vector-configuration.md` - Setup and tuning guide
3. `docs/search/inference-api-setup.md` - OpenAI API key configuration

### Success Criteria

- [x] All field definitions added to SDK ✅
- [x] `pnpm type-gen` generates correct mappings and Zod schemas ✅
- [x] All extraction functions have passing unit tests ✅
- [x] Document transforms include new fields ✅
- [x] Three-way RRF query implemented ✅
- [ ] Baseline metrics established with two-way hybrid (Phase 1C-A)
- [ ] Three-way metrics compared and documented (Phase 1C-B)
- [ ] Decision documented in ADR if three-way doesn't improve metrics
- [x] All quality gates passing ✅
- [x] 4 ADRs written and reviewed (071-074) ✅
- [ ] 3 docs created with examples

### Phase 1A Enhancement: Curriculum Vocabulary Integration

**Quick Win**: Leverage existing `lessonKeywords` with descriptions for richer embeddings and future features.

#### Current State

Every lesson in the API includes `lessonKeywords` as an array of objects:

```typescript
{
  keyword: 'quadratic equations',
  description: 'An equation where the highest power of the variable is 2, in the form ax² + bx + c = 0'
}
```

We currently extract only the keyword strings, discarding the expert-curated definitions.

#### Enhancement 1: Rich Embeddings (Immediate - Phase 1A)

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-generation.ts`

Add helper function:

```typescript
/**
 * Prepares text for embedding generation by combining title, summary, and keyword definitions.
 *
 * Including keyword definitions improves semantic understanding of curriculum-specific terminology.
 *
 * @example
 * const text = prepareTextForEmbedding({
 *   title: 'Solving quadratic equations',
 *   summary: 'Learn to solve ax² + bx + c = 0',
 *   keywords: [{
 *     keyword: 'quadratic equations',
 *     description: 'An equation where the highest power of the variable is 2...'
 *   }]
 * });
 * // Returns: "Solving quadratic equations\n\nLearn to solve ax² + bx + c = 0\n\nKeywords: quadratic equations: An equation where..."
 */
export function prepareTextForEmbedding(params: {
  title: string;
  summary?: string;
  keywords?: Array<{ keyword: string; description: string }>;
}): string {
  const parts = [params.title];

  if (params.summary) {
    parts.push(params.summary);
  }

  if (params.keywords?.length) {
    const keywordText = params.keywords.map((k) => `${k.keyword}: ${k.description}`).join('. ');
    parts.push(`Keywords: ${keywordText}`);
  }

  return parts.join('\n\n');
}
```

Update `generateDenseVector` to use this helper:

```typescript
export async function generateDenseVector(
  esClient: ElasticsearchClient,
  text: string,
  inferenceId = '.multilingual-e5-small-elasticsearch',
): Promise<number[]> {
  // existing implementation unchanged
}
```

Call from document transforms:

```typescript
const embeddingText = prepareTextForEmbedding({
  title: lesson.title,
  summary: lesson.lessonSummary,
  keywords: lesson.lessonKeywords,
});
const vector = await generateDenseVector(esClient, embeddingText);
```

**Benefit**: Dense vectors understand semantic meaning of curriculum terms, improving recall for terminology-based queries.

**Testing**:

- Unit test `prepareTextForEmbedding` with various input combinations
- Integration test verifies keywords included in embedding text

#### Enhancement 2: Store Nested Keyword Objects (Phase 1C)

During ingestion, preserve full keyword objects for future features:

- Glossary index (Phase 2B)
- Keyword-based knowledge graph
- Completion with definition previews
- "Define X" queries

**Field definition** (deferred to Phase 1C schema updates):

```typescript
{
  name: 'lesson_keywords_detailed',
  zodType: 'array-object',
  optional: true,
  esMapping: { type: 'nested' }
}
```

#### Enhancement 3: Curriculum Glossary Index (Phase 2B)

New index `oak_curriculum_glossary` aggregates keywords across all lessons:

```typescript
{
  term: 'quadratic equations',
  definition: 'An equation where the highest power of the variable is 2...',
  lesson_ids: ['lesson-1', 'lesson-2'],
  subject: 'maths',
  key_stage: 'ks4',
  usage_count: 12
}
```

**Features enabled**:

- "Define [term]" queries → instant curriculum definitions
- Cross-reference lessons by shared vocabulary
- Subject-specific vocabulary lists
- Keyword co-occurrence graph (concepts that appear together)

#### Success Criteria

- [x] Identified `lessonKeywords` structure from API schema ✅
- [x] `prepareTextForEmbedding` function with unit tests ✅
- [x] Document transforms updated to use rich embeddings ✅
- [ ] Integration test verifies keyword definitions included in vectors
- [ ] Nested keyword storage planned for Phase 1C
- [ ] Glossary index planned for Phase 2B

---

## Phase 3: Relevance Enhancement

### Goal

Boost relevance of top-K results using Elastic Native ReRank and optimize constrained searches with filtered kNN.

### ES Serverless Features Integrated

1. **Elastic Native ReRank** - Cross-encoder model via Inference API for top-K reranking
2. **Filtered kNN** - Apply filters during vector search (not post-filter)
3. **Semantic Query Rules** - Define rules for specific query patterns

### Elastic Native ReRank Integration

**ADR-074: Elastic Native ReRank Integration**

````typescript
/**
 * Reranks top-K results using Elastic Native ReRank-english-v3.0 model.
 *
 * @see ADR-074 - Elastic Native ReRank Integration
 *
 * @example
 * ```typescript
 * const results = await threeWayHybridSearch(esClient, { query: '...' });
 * const reranked = await cohereRerank(esClient, {
 *   query: '...',
 *   documents: results.hits,
 *   topN: 10,
 * });
 * ```
 */
export async function cohereRerank(
  esClient: Client,
  params: {
    query: string;
    documents: SearchHit[];
    topN?: number;
  },
): Promise<SearchHit[]> {
  const { query, documents, topN = 10 } = params;

  const response = await esClient.inference.inference({
    inference_id: 'cohere-rerank-english-v3',
    input: {
      query,
      documents: documents.map((doc) => doc._source.title),
    },
  });

  // Sort by relevance scores, return top N
  return applyRerankScores(documents, response.scores).slice(0, topN);
}
````

### Filtered kNN Optimization

**ADR-075: Filtered kNN Query Optimization**

Instead of post-filtering:

```typescript
// ❌ SLOW: Post-filter after kNN
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [...]
  },
  filter: { term: { tier: 'higher' } }  // Applied AFTER vector search
}

// ✅ FAST: Filter during kNN (50% faster)
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [...],
    filter: { term: { tier: 'higher' } }  // Applied DURING vector search
  }
}
```

### Semantic Query Rules

**Examples**:

- Query pattern: "pythagoras" → Add filter `{ tier: 'higher' }` (KS4 only)
- Query pattern: "fractions" + "ks4" → Boost `tier: foundation`
- Query pattern contains exam board → Filter by that board

### Success Criteria

- [ ] Elastic Native ReRank integrated and tested
- [ ] Filtered kNN implementation with performance benchmarks
- [ ] 5+ semantic query rules defined
- [ ] MRR improves by 10-25% on top-10 results
- [ ] Filtered searches 50% faster
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Phase 2: Evaluate Dense Vectors (Only If Phase 1 Insufficient)

### Goal

**Only proceed to this phase if Phase 1 baseline metrics don't meet targets.**

Add E5 dense vectors and compare three-way hybrid against two-way baseline to determine if added complexity delivers value.

### Prerequisites

- [ ] Phase 1 complete with baseline metrics established
- [ ] Phase 1 baseline doesn't meet targets (MRR < 0.70 or NDCG@10 < 0.75)
- [x] Dense vector generation code ready and tested

### Key Decision: Elastic-Native Dense Vectors

If we proceed to this phase, use E5 instead of OpenAI:

| Factor       | OpenAI            | E5 (Chosen)                  |
| ------------ | ----------------- | ---------------------------- |
| External API | Required          | **None**                     |
| Dimensions   | 1536              | **384**                      |
| Billing      | Per-token         | **Included in subscription** |
| Setup        | Register endpoint | **PRECONFIGURED**            |

See ADR-071 for full rationale.

### Dense Vector TDD Examples (Reference)

The following tests and implementation are ready if Phase 2 is needed:

#### Unit Test: Dense Vector Extraction

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.unit.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { generateDenseVector, prepareTextForEmbedding } from './dense-vector-extraction.js';
import { createMockEsClient } from '../test-utils/mock-es-client.js';

describe('Dense Vector Extraction (E5 Elastic-Native)', () => {
  describe('generateDenseVector', () => {
    it('should generate 384-dimensional vector from text', async () => {
      const mockClient = createMockEsClient({
        inferenceResponse: { text_embedding: [Array(384).fill(0.1)] },
      });

      const vector = await generateDenseVector(
        mockClient,
        'How do I teach Pythagoras theorem to Foundation tier?',
      );

      expect(vector).toHaveLength(384);
    });

    it('should return undefined on inference failure (graceful degradation)', async () => {
      const mockClient = createMockEsClient({
        inferenceError: new Error('Inference failed'),
      });

      const vector = await generateDenseVector(mockClient, 'test query');

      expect(vector).toBeUndefined();
    });
  });

  describe('prepareTextForEmbedding', () => {
    it('should combine title and summary for lesson embedding', () => {
      const text = prepareTextForEmbedding({
        title: 'Introduction to Fractions',
        summary: 'Learn about numerators and denominators',
      });

      expect(text).toBe('Introduction to Fractions\n\nLearn about numerators and denominators');
    });
  });
});
```

#### Implementation: Dense Vector Generation

**File**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/dense-vector-extraction.ts`

```typescript
import type { Client } from '@elastic/elasticsearch';

const E5_ENDPOINT_ID = '.multilingual-e5-small-elasticsearch';
export const E5_DIMENSIONS = 384;

export async function generateDenseVector(
  client: Client,
  text: string,
): Promise<number[] | undefined> {
  if (!text || text.trim().length === 0) {
    return undefined;
  }

  try {
    const response = await client.inference.inference({
      inference_id: E5_ENDPOINT_ID,
      input: text.trim(),
    });

    const embeddings = response.text_embedding;
    if (Array.isArray(embeddings) && embeddings.length > 0) {
      return embeddings[0] as number[];
    }

    return undefined;
  } catch {
    // Graceful degradation - search still works via BM25 + ELSER
    return undefined;
  }
}

export function prepareTextForEmbedding(params: { title: string; summary?: string }): string {
  if (params.summary) {
    return `${params.title}\n\n${params.summary}`;
  }
  return params.title;
}
```

### Implementation Steps

#### Step 1: Re-ingest with Dense Vectors

```bash
cd apps/oak-open-curriculum-semantic-search

# Re-ingest Maths KS4 with dense vectors enabled
pnpm es:ingest-live \
  --subject maths \
  --keystage ks4 \
  --verbose
```

**Note**: Dense vector generation is integrated into document transforms - no special flag needed.

#### Step 2: Measure Three-Way Metrics

Run same test queries as Phase 1 using three-way RRF builders.

#### Step 3: Compare Against Baseline

| Metric      | Phase 1 (Two-Way) | Phase 2 (Three-Way) | Delta | Decision |
| ----------- | ----------------- | ------------------- | ----- | -------- |
| MRR         | ?                 | ?                   | ?     | ?        |
| NDCG@10     | ?                 | ?                   | ?     | ?        |
| Zero-hit    | ?                 | ?                   | ?     | ?        |
| p95 latency | ?                 | ?                   | ?     | ?        |

#### Step 4: Decision Point

**If three-way shows measurable improvement** (MRR +10% or NDCG@10 +10%):

- ✅ Keep three-way hybrid for production
- Document findings in ADR

**If no significant improvement** or **unacceptable latency increase** (>50ms):

- ⚠️ Stay with two-way hybrid for production
- Document decision and rationale in ADR
- Dense vector infrastructure remains available for future use

### Success Criteria for Phase 2

- [ ] Three-way hybrid metrics measured
- [ ] Comparison against Phase 1 baseline documented
- [ ] Decision documented in ADR
- [ ] All quality gates passing

---

## Phase 4: Entity Extraction & Graph Discovery

### Goal

Extract curriculum entities from content and discover non-obvious relationships using ES Graph API.

### ES Serverless Features Integrated

1. **NER Models** - NER model deployed on Elasticsearch via Inference API for entity extraction
2. **Graph API** - Discover co-occurrence relationships within data
3. **Enrich Processor** - Join reference data at ingest time
4. **Significant Terms Aggregation** - Find unusual terms that characterize documents

### Entity Discovery Pipeline

Entities come from three sources:

1. **Static entities** (compile time): Subjects, key stages, years → from SDK generation
2. **Explicit entities** (ingest time): Lesson slugs, unit slugs, keywords → from API structure
3. **Discovered entities** (post-ingest): Concepts, topics, terms → from content analysis

### NER Integration

**ADR-076: NER Entity Extraction**

````typescript
/**
 * Extracts named entities from lesson transcript using NER model deployed on Elasticsearch model.
 *
 * @see ADR-076 - NER Entity Extraction
 *
 * @example
 * ```typescript
 * const entities = await extractEntities(esClient, transcript);
 * // [{ text: 'Pythagoras', type: 'CONCEPT', confidence: 0.95 }, ...]
 * ```
 */
export async function extractEntities(esClient: Client, text: string): Promise<Entity[]> {
  const response = await esClient.inference.inference({
    inference_id: 'huggingface-ner',
    input: text,
  });

  return parseNerResponse(response)
    .filter((entity) => entity.confidence > 0.7)
    .map((entity) => ({
      text: entity.word,
      type: entity.entity_group,
      confidence: entity.score,
    }));
}
````

### Graph API Discovery

**ADR-077: Graph API for Curriculum Relationships**

````typescript
/**
 * Discovers concept relationships using ES Graph API.
 *
 * Finds co-occurring concepts within Maths KS4 lessons.
 *
 * @see ADR-077 - Graph API for Curriculum Relationships
 *
 * @example
 * ```typescript
 * const graph = await discoverConceptGraph(esClient, {
 *   startConcept: 'pythagoras',
 *   depth: 2,
 * });
 * // { nodes: [...], edges: [...] }
 * ```
 */
export async function discoverConceptGraph(
  esClient: Client,
  params: { startConcept: string; depth: number },
): Promise<ConceptGraph> {
  const response = await esClient.graph.explore({
    index: 'oak_lessons',
    query: {
      match: { entities: params.startConcept },
    },
    controls: {
      sample_size: 100,
    },
    connections: {
      vertices: [
        {
          field: 'entities',
          size: 10,
          min_doc_count: 3,
        },
      ],
    },
    vertices: [
      {
        field: 'entities',
        include: [params.startConcept],
      },
    ],
  });

  return buildGraphFromResponse(response);
}
````

### Enrich Processor

**ADR-078: Enrich Processor for Reference Data**

At ingest time, join subject metadata from `oak_ref_subjects`:

```typescript
PUT _ingest/pipeline/enrich-lesson-metadata
{
  "processors": [
    {
      "enrich": {
        "policy_name": "subject-metadata-policy",
        "field": "subject_slug",
        "target_field": "subject_metadata",
        "max_matches": "1"
      }
    }
  ]
}
```

### New Fields for Entity Storage

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'entities', zodType: 'string-array', optional: true },  // Extracted entities
{ name: 'entity_types', zodType: 'string-array', optional: true },  // CONCEPT, PERSON, etc.
{ name: 'significant_terms', zodType: 'string-array', optional: true },  // Unusual terms
{ name: 'related_concepts', zodType: 'string-array', optional: true },  // From Graph API
```

### Implementation Steps

1. Register NER model deployed on Elasticsearch inference endpoint
2. Extract entities from transcripts during ingestion
3. Store entities in new fields
4. Run Graph API exploration to discover relationships
5. Store discovered relationships
6. Create enrich processor for reference data

### Success Criteria

- [ ] NER model integrated and tested
- [ ] Entities extracted from >80% of Maths KS4 lessons
- [ ] Graph API discovers >20 concept relationships
- [ ] Enrich processor joins subject metadata
- [ ] Concept-based search working (query by entity)
- [ ] 3 ADRs written
- [ ] 3 docs created

---

## Phase 5: Reference Indices, Thread Support & Curriculum Metadata

### Goal

Create searchable reference indices and leverage **untapped API schema fields** for enhanced curriculum search.

### Schema Fields to Index

The Oak API provides rich pedagogical metadata that is NOT currently indexed. See `.agent/research/elasticsearch/curriculum-schema-field-analysis.md` for complete analysis.

#### Lesson-Level Fields (From API Schema)

| Field                          | Source     | Search Enhancement        |
| ------------------------------ | ---------- | ------------------------- |
| `pupilLessonOutcome`           | L5972-5975 | "I can..." outcome search |
| `misconceptions[].response`    | L5963      | Teaching strategy search  |
| `starterQuiz`, `exitQuiz`      | L5400-5746 | Assessment content search |
| `contentGuidance` (structured) | L5999-6014 | Safeguarding filters      |
| `supervisionLevel`             | L6030-6039 | Content safety filtering  |
| `downloadsAvailable`           | L6041-6044 | Practical filtering       |

#### Unit-Level Fields (From API Schema)

| Field                        | Source     | Search Enhancement               |
| ---------------------------- | ---------- | -------------------------------- |
| `priorKnowledgeRequirements` | L6275-6286 | Prerequisite search, graph edges |
| `nationalCurriculumContent`  | L6287-6298 | Standards alignment search       |
| `whyThisWhyNow`              | L6299-6302 | Pedagogical context              |
| `threads`                    | L6303-6331 | Curriculum coherence, graph      |
| `notes`, `description`       | L6267-6273 | Additional context               |

### New Indices

1. **`oak_ref_subjects`** - Subject metadata with lesson counts
2. **`oak_ref_key_stages`** - Key stage metadata
3. **`oak_ref_years`** - Year group metadata
4. **`oak_maths_topics`** - Maths topic taxonomy (KS4-specific)
5. **`oak_threads`** - Curriculum threads (Number, Algebra, Geometry, etc.)
6. **`oak_curriculum_glossary`** - Keywords with definitions (from `lessonKeywords`)
7. **`oak_curriculum_standards`** - National curriculum statements

### Field Additions Summary

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'pupil_lesson_outcome', zodType: 'text', optional: true },           // ES: text (full-text searchable)
{ name: 'misconception_responses', zodType: 'string-array', optional: true }, // ES: text[] (full-text)
{ name: 'quiz_question_count', zodType: 'number', optional: true },
{ name: 'quiz_question_types', zodType: 'string-array', optional: true },    // ES: keyword[] (faceting)
{ name: 'quiz_questions_text', zodType: 'string-array', optional: true },    // ES: text[] (full-text)
{ name: 'content_guidance_areas', zodType: 'string-array', optional: true }, // ES: keyword[] (faceting)
{ name: 'supervision_level', zodType: 'number', optional: true },
{ name: 'downloads_available', zodType: 'boolean', optional: true },
{ name: 'lesson_keywords_detailed', zodType: 'nested', optional: true },     // ES: nested

// Add to UNITS_INDEX_FIELDS
{ name: 'prior_knowledge_requirements', zodType: 'string-array', optional: true }, // ES: text[] (semantic)
{ name: 'national_curriculum_content', zodType: 'string-array', optional: true },  // ES: keyword[] (exact match)
{ name: 'why_this_why_now', zodType: 'text', optional: true },                     // ES: text (semantic)
{ name: 'threads', zodType: 'nested', optional: true },                            // ES: nested
{ name: 'unit_notes', zodType: 'text', optional: true },                           // ES: text
{ name: 'unit_description', zodType: 'text', optional: true },                     // ES: text
```

### ES Field Overrides for Phase 2B

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts`

```typescript
// Phase 2B: keyword fields for faceting (exact match, aggregations)
quiz_question_types: { type: 'keyword' },        // ['multiple-choice', 'match', 'order']
content_guidance_areas: { type: 'keyword' },     // ['safeguarding', 'sensitive-content']
national_curriculum_content: { type: 'keyword' }, // Exact match on curriculum statements

// Phase 2B: nested fields for structured objects
lesson_keywords_detailed: { type: 'nested' },
threads: { type: 'nested' },
```

### Extraction Functions (TDD)

#### Quiz Content Extraction

````typescript
/**
 * Extracts searchable content from quiz questions.
 *
 * @example
 * ```typescript
 * const quizData = extractQuizContent(lesson.starterQuiz, lesson.exitQuiz);
 * // { questionCount: 10, questionTypes: ['match', 'multiple-choice'], questionsText: [...] }
 * ```
 */
export function extractQuizContent(
  starterQuiz: QuizQuestion[],
  exitQuiz: QuizQuestion[],
): QuizContentData {
  const allQuestions = [...starterQuiz, ...exitQuiz];
  return {
    questionCount: allQuestions.length,
    questionTypes: [...new Set(allQuestions.map((q) => q.questionType))],
    questionsText: allQuestions.map((q) => q.question),
  };
}
````

#### Prior Knowledge Extraction

````typescript
/**
 * Extracts prior knowledge requirements for prerequisite search.
 *
 * @example
 * ```typescript
 * const priorKnowledge = extractPriorKnowledge(unitSummary);
 * // ['A simple sentence makes complete sense.', 'Any simple sentence contains one verb...']
 * ```
 */
export function extractPriorKnowledge(unitData: UnitSummary): string[] {
  return unitData.priorKnowledgeRequirements ?? [];
}
````

#### National Curriculum Extraction

````typescript
/**
 * Extracts national curriculum statements for standards-aligned search.
 *
 * Enables: "Which lessons cover [curriculum objective]?" queries
 *
 * @example
 * ```typescript
 * const standards = extractNationalCurriculumContent(unitSummary);
 * // ['Articulate and justify answers', 'Speak audibly and fluently...']
 * ```
 */
export function extractNationalCurriculumContent(unitData: UnitSummary): string[] {
  return unitData.nationalCurriculumContent ?? [];
}
````

### Thread Support for Maths KS4

Maths threads (from API `threads` field):

- Number
- Algebra
- Geometry and Measures
- Statistics and Probability
- Ratio and Proportion

#### Update Lessons/Units with Thread Associations

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'threads', zodType: 'nested', optional: true },

// Extraction function
export function extractThreads(unitData: UnitSummary): Thread[] {
  return unitData.threads ?? [];
}
```

### Reference Index Schemas

#### `oak_ref_subjects`

```typescript
{
  subject_slug: 'maths',
  display_name: 'Mathematics',
  key_stages: ['ks1', 'ks2', 'ks3', 'ks4'],
  lesson_count: 450,
  unit_count: 80,
  description: 'Mathematics curriculum content...',
}
```

#### `oak_threads`

```typescript
{
  thread_slug: 'number',
  display_name: 'Number',
  subject: 'maths',
  description: 'Place value, operations, fractions, decimals...',
  lesson_count: 120,
  unit_count: 15,
  typical_year_groups: ['7', '8', '9', '10', '11'],
}
```

#### `oak_curriculum_glossary`

```typescript
{
  term: 'quadratic equations',
  definition: 'An equation where the highest power of the variable is 2...',
  lesson_ids: ['lesson-1', 'lesson-2'],
  subject: 'maths',
  key_stage: 'ks4',
  usage_count: 12,
}
```

#### `oak_curriculum_standards`

```typescript
{
  statement_id: 'nc-maths-ks4-001',
  statement: 'Articulate and justify answers, arguments and opinions',
  subject: 'maths',
  key_stage: 'ks4',
  unit_ids: ['unit-1', 'unit-2'],
  lesson_count: 25,
}
```

### Population Strategy

1. Generate reference data at type-gen time from SDK enums
2. Extract fields during ingestion using new extraction functions
3. Augment with counts via aggregation queries against main indices
4. Ingest into reference indices

### Search Use Cases Enabled

| Query Type          | Fields Used                    | Example                                           |
| ------------------- | ------------------------------ | ------------------------------------------------- |
| Outcome search      | `pupil_lesson_outcome`         | "Lessons where students learn to solve equations" |
| Standards search    | `national_curriculum_content`  | "Which lessons cover KS4 algebra objectives?"     |
| Prerequisite search | `prior_knowledge_requirements` | "What do students need before trigonometry?"      |
| Assessment search   | `quiz_questions_text`          | "Find multiple-choice questions on fractions"     |
| Thread navigation   | `threads`                      | "Show Number thread progression KS3→KS4"          |
| Glossary lookup     | `oak_curriculum_glossary`      | "Define quadratic equations"                      |
| Safety filtering    | `supervision_level`            | Filter content by safeguarding requirements       |

### ADRs to Create

1. **ADR-079: Reference Indices for Enum Data**
   - Decision: Create separate indices for reference data
   - Rationale: Enable autocomplete, faceting, and enrichment
   - Alternatives: Hardcode in UI (less flexible, no search)

2. **ADR-086: Curriculum Metadata Indexing Strategy**
   - Decision: Index all available API schema fields for comprehensive search
   - Rationale: Expert-curated data outperforms AI-generated; zero additional cost
   - Fields covered: priorKnowledge, nationalCurriculum, threads, quizzes, outcomes

### Success Criteria

- [ ] 7 reference indices created with mappings
- [ ] All new extraction functions have unit tests
- [ ] Prior knowledge requirements indexed on units
- [ ] National curriculum content indexed on units
- [ ] Quiz content extracted and searchable
- [ ] Pupil lesson outcomes indexed
- [ ] Thread support added to lessons/units
- [ ] Thread-based search working
- [ ] Curriculum glossary populated from lessonKeywords
- [ ] Standards index populated from nationalCurriculumContent
- [ ] Autocomplete for subjects/threads/topics/standards
- [ ] 2 ADRs written
- [ ] 3 docs created

---

## Phase 6: RAG Infrastructure

### Goal

Build production-ready RAG capabilities using ES Playground, chunked transcripts, and ontology grounding.

### ES Serverless Features Integrated

1. **ES Playground** - Low-code RAG prototyping UI
2. **`semantic_text` Field** - Auto-chunking with embeddings
3. **LLM Chat Completion** - Elastic Native LLM integration via Inference API
4. **Multi-Retriever Queries** - Combine multiple search strategies

### Chunked Transcripts

Instead of storing full transcript as one field, chunk it:

```typescript
// Add new field
{ name: 'transcript_chunks', zodType: 'semantic_text', optional: true },

// ES field override
transcript_chunks: {
  type: 'semantic_text',
  inference_id: '.multilingual-e5-small-elasticsearch',
  model_settings: {
    task_type: 'text_embedding',
  },
}
```

Elasticsearch automatically:

- Chunks the text into ~250-word segments
- Generates embeddings for each chunk
- Stores chunks with embeddings

At query time:

- Search finds relevant chunks
- RAG injects chunks into LLM context

### ES Playground Setup

1. Navigate to Kibana → Search → Playground
2. Create retriever configuration:
   - Index: `oak_lessons`
   - Retrieval: Three-way hybrid RRF
   - Text field: `transcript_chunks`
3. Test queries and iterate on prompt templates

### LLM Integration

````typescript
/**
 * Executes RAG query with Elastic Native LLM.
 *
 * @see ADR-080 - ES Playground RAG Integration
 *
 * @example
 * ```typescript
 * const answer = await ragQuery(esClient, {
 *   query: 'How do I teach Pythagoras to struggling students?',
 *   conversationId: 'user-123',
 * });
 * ```
 */
export async function ragQuery(
  esClient: Client,
  params: { query: string; conversationId: string },
): Promise<RagResponse> {
  // 1. Retrieve relevant chunks
  const chunks = await threeWayHybridSearch(esClient, {
    index: 'oak_lessons',
    query: params.query,
    size: 5,
  });

  // 2. Build context from chunks
  const context = chunks.hits.map((hit) => hit._source.transcript_chunks).join('\n\n');

  // 3. Call Elastic Native LLM with context
  const response = await esClient.inference.inference({
    inference_id: '.gp-llm-v2-chat_completion',
    input: {
      messages: [
        {
          role: 'system',
          content: 'You are an expert teaching assistant...',
        },
        {
          role: 'user',
          content: `Context:\n${context}\n\nQuestion: ${params.query}`,
        },
      ],
    },
  });

  return {
    answer: response.choices[0].message.content,
    sources: chunks.hits.map((hit) => ({
      title: hit._source.title,
      url: hit._source.canonical_url,
    })),
  };
}
````

### Ontology Grounding

Create `oak_ontology` index for domain knowledge:

```typescript
{
  concept_id: 'pythagoras-theorem',
  display_name: 'Pythagoras\' Theorem',
  definition: 'In a right-angled triangle, a² + b² = c²...',
  key_stage: 'ks4',
  tier: 'higher',
  common_misconceptions: [
    'Students apply it to non-right-angled triangles',
    'Confusion about which side is the hypotenuse',
  ],
  teaching_tips: [
    'Use visual proofs with squares',
    'Practice identifying the hypotenuse',
  ],
}
```

At RAG time, enrich context with ontology snippets.

### ADRs to Create

1. **ADR-080: ES Playground RAG Integration**
   - Decision: Use ES Playground for RAG prototyping
   - Rationale: 10x faster iteration, low-code, built-in monitoring

2. **ADR-081: Chunked Transcript Storage**
   - Decision: Use `semantic_text` field for transcripts
   - Rationale: Auto-chunking, per-chunk embeddings, better RAG context
   - Tradeoffs: Larger index size (~30% increase)

### Success Criteria

- [ ] `semantic_text` field added for transcripts
- [ ] Transcripts chunked and re-ingested
- [ ] ES Playground configured with Maths KS4 retriever
- [ ] RAG query endpoint implemented
- [ ] `oak_ontology` index created and populated (Maths KS4 concepts)
- [ ] RAG responses grounded with ontology
- [ ] 2 ADRs written
- [ ] 3 docs created

---

## Phase 7: Knowledge Graph

### Goal

Build explicit knowledge graph with triples, entity resolution, and multi-hop reasoning.

### ES Serverless Features Integrated

1. **Triple Store Index** - Store subject-predicate-object triples
2. **Entity Resolution** - Deduplicate and link entities across lessons
3. **Graph Traversal** - Multi-hop relationship queries

### Triple Store Schema

**Index**: `oak_curriculum_graph`

```typescript
{
  subject: 'lesson:maths-ks4-pythagoras',
  predicate: 'prerequisite_of',
  object: 'lesson:maths-ks4-trigonometry',
  confidence: 1.0,
  source: 'explicit',  // or 'inferred'
}
```

### Entity Resolution

Merge extracted entities:

```text
'pythagoras' (from lesson A)
'Pythagoras theorem' (from lesson B)
'Pythagoras\' Theorem' (from lesson C)
  ↓
  Canonical: 'pythagoras-theorem'
```

```typescript
/**
 * Resolves entity mentions to canonical entity IDs.
 *
 * @see ADR-082 - Entity Resolution Strategy
 */
export async function resolveEntity(
  esClient: Client,
  mention: string,
): Promise<string | undefined> {
  // 1. Normalize mention (lowercase, remove punctuation)
  const normalized = normalizeMention(mention);

  // 2. Search oak_entities for matches
  const matches = await esClient.search({
    index: 'oak_entities',
    query: {
      bool: {
        should: [{ term: { canonical_name: normalized } }, { match: { aliases: mention } }],
      },
    },
  });

  // 3. Return canonical ID if confident match
  if (matches.hits.hits[0]?._score > 0.8) {
    return matches.hits.hits[0]._source.entity_id;
  }

  return undefined;
}
```

### Multi-Hop Reasoning

````typescript
/**
 * Finds learning pathway from concept A to concept B.
 *
 * @see ADR-083 - Knowledge Graph Multi-Hop Queries
 *
 * @example
 * ```typescript
 * const path = await findLearningPath(esClient, {
 *   from: 'fractions',
 *   to: 'calculus',
 *   maxHops: 3,
 * });
 * // ['fractions', 'algebra', 'functions', 'calculus']
 * ```
 */
export async function findLearningPath(
  esClient: Client,
  params: { from: string; to: string; maxHops: number },
): Promise<string[]> {
  // Use Graph API with hop controls
  const response = await esClient.graph.explore({
    index: 'oak_curriculum_graph',
    query: {
      term: { subject: params.from },
    },
    controls: {
      max_depth: params.maxHops,
      sample_size: 100,
    },
    connections: {
      vertices: [
        {
          field: 'object',
          size: 10,
        },
      ],
    },
  });

  return extractShortestPath(response, params.from, params.to);
}
````

### Triple Extraction

Generate triples from:

1. **Explicit relationships** (API data):
   - `lesson -> part_of -> unit`
   - `unit -> part_of -> sequence`
   - `lesson -> covers_topic -> topic`
   - `lesson -> has_prerequisite -> lesson`

2. **Inferred relationships** (Graph API):
   - `concept -> co_occurs_with -> concept`
   - `topic -> related_to -> topic`

3. **Ontology relationships** (static):
   - `concept -> is_a -> concept_type`
   - `key_stage -> contains -> key_stage`

### ADRs to Create

1. **ADR-082: Entity Resolution Strategy**
   - Decision: Canonical entity index with aliases
   - Rationale: Deduplicate, enable precise matching

2. **ADR-083: Knowledge Graph Multi-Hop Queries**
   - Decision: Use Graph API for traversal
   - Rationale: Native ES support, efficient

### Success Criteria

- [ ] `oak_curriculum_graph` index created
- [ ] Triples extracted and ingested
- [ ] Entity resolution working (>90% precision)
- [ ] Multi-hop queries implemented
- [ ] Learning pathway discovery working
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Phase 8: Advanced Features

### Goal

Add Learning to Rank foundations, multi-vector fields, and runtime field optimizations.

### ES Serverless Features Integrated

1. **Learning to Rank (LTR) Foundations** - Click-through data collection
2. **Multi-Vector Fields** - Store multiple embeddings per document
3. **Runtime Fields** - Computed fields at query time
4. **Scripted Similarity** - Custom scoring functions

### LTR Foundations

#### Click-Through Data Collection

**Index**: `oak_search_events`

```typescript
{
  session_id: 'uuid',
  query: 'pythagoras theorem',
  timestamp: '2025-12-10T10:30:00Z',
  results_shown: ['lesson-1', 'lesson-2', 'lesson-3'],
  clicked: 'lesson-2',
  position: 1,  // 0-indexed
  dwell_time_seconds: 45,
}
```

#### Feature Extraction for LTR Model

```typescript
/**
 * Extracts features for Learning to Rank model training.
 *
 * @see ADR-084 - Learning to Rank Foundations
 */
export function extractLtrFeatures(query: string, document: LessonDocument): LtrFeatures {
  return {
    // Query-document features
    title_match_score: computeBm25(query, document.title),
    elser_score: document._score, // From ELSER
    dense_score: computeCosineSimilarity(queryVector, document.lesson_dense_vector),

    // Document features
    tier: document.tier === 'higher' ? 1 : 0,
    has_video: document.resource_types?.includes('video') ? 1 : 0,
    estimated_duration: document.estimated_duration_minutes ?? 0,

    // Context features
    query_length: query.split(' ').length,
    has_exam_board: document.exam_board ? 1 : 0,
  };
}
```

Later (Phase 6+), train XGBoost model on click data and deploy as ES script.

### Multi-Vector Fields

Store multiple embeddings per lesson:

```typescript
// Add to LESSONS_INDEX_FIELDS
{ name: 'multi_vectors', zodType: 'array-array-number', optional: true },

// ES override
multi_vectors: {
  type: 'dense_vector',
  dims: 384,
  index: true,
  similarity: 'cosine',
  element_type: 'float',
}

// Store title, summary, key points as separate vectors
multi_vectors: [
  [...],  // title embedding
  [...],  // summary embedding
  [...],  // key points embedding
]
```

Query against multi-vector:

```typescript
{
  knn: {
    field: 'multi_vectors',
    query_vector: [...],
    k: 50,
  }
}
```

ES automatically finds best matching vector per document.

### Runtime Fields

Compute derived fields at query time:

```typescript
// Add runtime field to query
{
  runtime_mappings: {
    relevance_score: {
      type: 'double',
      script: {
        source: `
          double elser = doc['_score'].value;
          double hasTier = doc['tier'].size() > 0 ? 1.2 : 1.0;
          double hasVideo = doc['resource_types'].contains('video') ? 1.1 : 1.0;
          return elser * hasTier * hasVideo;
        `,
      },
    },
  },
  sort: [
    { relevance_score: 'desc' },
  ],
}
```

### ADRs to Create

1. **ADR-084: Learning to Rank Foundations**
   - Decision: Collect click-through data now, train model later
   - Rationale: Need 1000+ events before training viable

2. **ADR-085: Multi-Vector and Runtime Fields**
   - Decision: Use multi-vector for aspect-based retrieval
   - Rationale: Match on title OR summary OR key points

### Success Criteria

- [ ] `oak_search_events` index created
- [ ] Click-through tracking implemented
- [ ] Multi-vector fields added (optional, for experimentation)
- [ ] Runtime field examples documented
- [ ] 2 ADRs written
- [ ] 2 docs created

---

## Quality Gates (ALL Phases)

After each phase, run ALL quality gates one at a time:

```bash
# From repo root
pnpm type-gen        # Generate artifacts
pnpm build           # Compile
pnpm type-check      # Zero type errors
pnpm lint:fix        # Zero lint violations
pnpm format:root     # Code formatting
pnpm markdownlint:root  # Doc formatting
pnpm test            # Unit + integration (1,265+ tests must pass)
pnpm test:e2e        # E2E in dev mode
pnpm test:e2e:built  # E2E with built code
```

**NO EXCEPTIONS. All gates must be green before proceeding.**

---

## Success Metrics

### Technical

- [ ] 23 new ES features integrated
- [ ] 15 ADRs written (071-085)
- [ ] 135+ new tests passing
- [ ] 17 new docs created
- [ ] Zero type shortcuts
- [ ] All quality gates passing

### Search Quality

- [ ] Mean Reciprocal Rank (MRR): 0.65 → 0.80 (+23%)
- [ ] NDCG@10: 0.70 → 0.85 (+21%)
- [ ] Zero-hit rate: 15% → <5%
- [ ] p95 latency: <300ms

### Business

- [ ] Impressive stakeholder demo ready
- [ ] Production-ready code
- [ ] Scalable to full curriculum
- [ ] <$100/month operational cost (excluding Elastic Native LLM RAG)

---

## Cost Estimates

### One-Time (Maths KS4 Ingestion)

- E5 embeddings: $0 (Elastic-native, included in ES Serverless subscription)
- NER extraction: $0 (deployed within Elasticsearch cluster)
- **Total**: $0

### Ongoing (Monthly, Full Curriculum)

- E5 embeddings: $0 (Elastic-native, included in subscription)
- Elastic Native ReRank: $0 (`.rerank-v1-elasticsearch`, included in subscription)
- NER models: $0 (deployed within Elasticsearch cluster)
- Elastic Native LLM: $0 (`.gp-llm-v2-chat_completion`, included in subscription)
- **Total**: $0/month (all AI/ML features included in ES Serverless subscription)

**Cost Note**:

All AI/ML inference features (E5 embeddings, ELSER, ReRank, LLM chat completion, NER models deployed in cluster) are included in the Elasticsearch Serverless subscription at no additional cost. The only external costs are:

- Oak Curriculum API calls (within existing quota)
- Elasticsearch Serverless subscription itself (resource-based billing)

---

## Risk Mitigation

### High Risk

1. **Elasticsearch Serverless Availability**
   - **Mitigation**: Graceful degradation (disable dense vectors/rerank if inference unavailable), caching, monitoring

2. **Latency Regression**
   - **Mitigation**: Two-stage retrieval (fast first-pass, slow rerank on top-K), performance testing, feature flags

### Medium Risk

4. **Entity Extraction Accuracy**
   - **Mitigation**: Confidence thresholds (>0.7), manual validation for Maths KS4

5. **Complexity Burden**
   - **Mitigation**: Comprehensive docs, ADRs, TDD, regular code reviews

---

## Implementation Checklist

### Phase 1A: Data Ingestion ✅ COMPLETE (2025-12-08)

- [x] Re-read foundation documents
- [x] Field definitions added to SDK (tier, exam_board, pathway, dense vectors)
- [x] `pnpm type-gen` completed
- [x] Extraction functions implemented with unit tests
- [x] Document transforms updated
- [x] Two-way RRF query builders implemented
- [x] All quality gates passing
- [x] **Ingest Maths KS4**: `pnpm es:ingest-live --subject maths --keystage ks4`
  - [x] 100 lessons indexed
  - [x] 36 units indexed
  - [x] 36 unit rollups indexed
  - [x] 1 sequence facet indexed
  - [x] Dense vectors generated (384-dim E5)
- [x] Basic BM25 search validated with test queries

### Phase 1B: RRF API Update ✅ COMPLETE (2025-12-08)

- [x] Researched ES 8.11+ `retriever` API syntax
- [x] Updated `apps/.../hybrid-search/rrf-query-builders.ts` to use `retriever` instead of `rank`
- [x] Updated `apps/.../hybrid-search/rrf-query-builders-three-way.ts` to use `retriever` instead of `rank`
- [x] Updated `apps/.../lib/elastic-http.ts` to support `retriever` property
- [x] Extracted shared helpers to `apps/.../hybrid-search/rrf-query-helpers.ts`
- [x] Updated unit tests to expect new `retriever` structure
- [x] Tested two-way RRF with Maths KS4 data against live ES Serverless
- [x] Validated: 21 results returned for "pythagoras theorem"
- [x] All quality gates passing

### Phase 1D: Missing Indices ✅ COMPLETE (2025-12-09)

- [x] Created `oak_threads` mapping generator (`createThreadsMappingModule()`)
- [x] Created `threads-overrides.ts` with field overrides
- [x] Implemented `sequence-document-builder.ts` with TDD
- [x] Implemented `thread-document-builder.ts` with TDD
- [x] Implemented `thread-bulk-helpers.ts` for API integration
- [x] Added `/threads` API client functions (`getAllThreads`, `getThreadUnits`)
- [x] Integrated thread ingestion into `buildIndexBulkOps()` pipeline
- [x] Created reference index mappings (subjects, key_stages, glossary)
- [x] Implemented reference document builders with TDD
- [x] All quality gates passing

**Reference Indices Ready (Phase 3)**:

- `oak_ref_subjects` - mapping + builder ready
- `oak_ref_key_stages` - mapping + builder ready
- `oak_curriculum_glossary` - mapping + builder ready
- Data source: `ontology-data.ts` and `knowledge-graph-data.ts`

### Blocking Issues ✅ ALL RESOLVED (2025-12-09)

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
- [x] Issue 4.3: Implement metrics.ts with TDD (MRR and NDCG@10, 13 tests)

**Files Created**:

- `src/lib/search-quality/ground-truth.ts` - Ground truth interfaces
- `src/lib/search-quality/metrics.ts` - MRR and NDCG@10 implementations
- `src/lib/search-quality/metrics.unit.test.ts` - 13 unit tests
- `src/lib/search-quality/index.ts` - Module exports
- `src/lib/indexing/thread-and-pedagogical-extractors.ts` - Thread info extraction
- `src/lib/indexing/summary-reader-helpers.ts` - Summary reader utilities

### Phase 1C: Baseline Metrics 🟢 READY TO START (0.5 days)

**Phase 1C Tasks** (Ready to Execute):

- [ ] Create ground truth data for Maths KS4 queries using `scripts/discover-lessons.ts`
- [ ] Test two-way hybrid search (BM25 + ELSER) with RRF
- [ ] Establish baseline metrics (MRR, NDCG@10, zero-hit rate, latency)
- [ ] Document baseline metrics
- [ ] Decision: Two-way sufficient OR proceed to Phase 2

### Phase 2: Evaluate Dense Vectors (1 day) - Only If Needed

**Only proceed if Phase 1 baseline doesn't meet targets (MRR < 0.70 or NDCG@10 < 0.75)**

- [ ] Verify inference endpoints available
- [ ] Re-ingest with dense vectors: `pnpm es:ingest-live --subject maths --keystage ks4`
- [ ] Measure three-way hybrid metrics
- [ ] Compare against Phase 1 baseline
- [ ] Document findings and decision in ADR

### Phase 3: Relevance Enhancement (2-3 days)

- [ ] Verify `.rerank-v1-elasticsearch` endpoint available
- [ ] Implement rerank function using Elastic Native ReRank (TDD)
- [ ] Implement filtered kNN (TDD)
- [ ] Define 5+ semantic query rules
- [ ] Run performance benchmarks
- [ ] Run all quality gates
- [ ] Write ADR-075 (ReRank Integration)
- [ ] Create 2 docs

### Infrastructure Already Built (Reference)

The following infrastructure was built during Phase 1A/1B preparation and is available:

- [x] Dense vector generation code (`dense-vector-generation.ts`)
- [x] Two-way RRF query builders (`rrf-query-builders.ts`) - updated to `retriever` API
- [x] Three-way RRF query builders (`rrf-query-builders-three-way.ts`) - updated to `retriever` API
- [x] Shared RRF helpers (`rrf-query-helpers.ts`)
- [x] ADR-071 (Elastic-Native Dense Vector Strategy)
- [x] ADR-072 (Three-Way Hybrid Search Architecture)
- [x] ADR-073 (Dense Vector Field Configuration)
- [x] ADR-074 (Elastic-Native First Philosophy)

### Phase 4: Entity Extraction & Graph (3-4 days)

- [ ] Register NER model deployed on Elasticsearch endpoint
- [ ] Add entity fields to SDK
- [ ] Run `pnpm type-gen`
- [ ] Implement entity extraction (TDD)
- [ ] Implement Graph API discovery (TDD)
- [ ] Create enrich processor
- [ ] Re-ingest with entity extraction
- [ ] Run all quality gates
- [ ] Write ADR-076, ADR-077, ADR-078
- [ ] Create 3 docs

### Phase 5: Reference Indices & Threads (2-3 days)

- [ ] Define reference index schemas
- [ ] Add thread fields to SDK
- [ ] Run `pnpm type-gen`
- [ ] Generate reference data
- [ ] Ingest reference indices
- [ ] Update document transforms with threads
- [ ] Test thread-based search
- [ ] Run all quality gates
- [ ] Write ADR-079
- [ ] Create 2 docs

### Phase 6: RAG Infrastructure (4-5 days)

- [ ] Add `semantic_text` field to SDK
- [ ] Run `pnpm type-gen`
- [ ] Re-ingest with chunked transcripts
- [ ] Configure ES Playground
- [ ] Test RAG queries in Playground
- [ ] Implement RAG endpoint (TDD)
- [ ] Create `oak_ontology` index
- [ ] Populate ontology (Maths KS4 concepts)
- [ ] Integrate ontology grounding
- [ ] Run all quality gates
- [ ] Write ADR-080, ADR-081
- [ ] Create 3 docs

### Phase 7: Knowledge Graph (5-6 days)

- [ ] Define triple store schema
- [ ] Create `oak_curriculum_graph` index
- [ ] Extract triples from API data
- [ ] Extract triples from Graph API
- [ ] Ingest triples
- [ ] Implement entity resolution (TDD)
- [ ] Implement multi-hop queries (TDD)
- [ ] Test learning pathway discovery
- [ ] Run all quality gates
- [ ] Write ADR-082, ADR-083
- [ ] Create 2 docs

### Phase 8: Advanced Features (3-4 days)

- [ ] Create `oak_search_events` index
- [ ] Implement click-through tracking (TDD)
- [ ] Add multi-vector fields (optional)
- [ ] Document runtime field patterns
- [ ] Run all quality gates
- [ ] Write ADR-084, ADR-085
- [ ] Create 2 docs

---

## Demo Scenarios

### Technical Validation Scenarios

After implementation, validate these technical scenarios work:

#### 1. Three-Way Hybrid Search

**Query**: "How do I teach Pythagoras theorem to struggling students?"

**Expected**:

- Dense vector captures semantic intent ("teach", "struggling")
- ELSER captures Maths domain ("Pythagoras", "theorem")
- BM25 captures exact phrase matches
- Results include Foundation tier lessons, teaching tips, misconceptions

#### 2. Tier-Filtered kNN

**Query**: "trigonometry" + Filter: `{ tier: 'higher' }`

**Expected**:

- Vector search applies filter DURING search (not post-filter)
- Results are 50% faster than unfiltered search
- Only Higher tier lessons returned

#### 3. Elastic Native ReRank

**Query**: "solving quadratic equations"

**Expected**:

- Three-way hybrid returns 50 results
- Elastic Native ReRank (`.rerank-v1-elasticsearch`) reorders top-10 for better relevance
- MRR improves by 10-25%

#### 4. Entity-Based Discovery

**Query**: "pythagoras"

**Expected**:

- NER identifies "Pythagoras' Theorem" entity
- Graph API discovers related concepts: "right-angled triangles", "trigonometry"
- Results include lessons covering related concepts

#### 5. Thread-Based Navigation

**Filter**: `{ threads: ['geometry'] }`

**Expected**:

- Returns all Geometry lessons in Maths KS4
- Facets show other available threads
- Can refine by tier within thread

#### 6. RAG Query

**Query**: "What are common misconceptions about fractions in Year 10?"

**Expected**:

- Retrieves relevant transcript chunks
- Ontology provides domain context
- Elastic Native LLM generates answer with sources
- Response cites specific lessons

#### 7. Learning Pathway

**Query**: Find pathway from "fractions" to "calculus"

**Expected**:

- Knowledge graph traversal finds intermediate concepts
- Returns: fractions → algebra → functions → differentiation
- Each step links to relevant lessons

### User-Focused Demo Scenarios (Stakeholder Presentation)

These scenarios demonstrate the system from a teacher's perspective for stakeholder demos:

#### Scenario 1: Teacher Looking for Trigonometry Lessons

**User Story**: "I'm teaching Foundation tier and need trigonometry lessons"

**Query**: "trigonometry foundation tier"

**Experience**:

1. Structured search returns relevant lessons
2. Facets show Foundation/Higher split
3. Thread filter shows "Geometry" thread
4. Results display:
   - Foundation tier trig lessons with clear tier badges
   - Related units showing progression
   - Sequence context (where in pathway)
5. Click lesson → see full metadata, transcript, resources
6. "More like this" suggests related geometry topics

**Value Demonstrated**: Precise filtering, semantic understanding, contextual navigation

#### Scenario 2: Finding Prerequisite Knowledge

**User Story**: "I need to know what students should learn before Pythagoras"

**Query**: "What do students need to know before Pythagoras?"

**Experience**:

1. Natural language search understands intent
2. Ontology provides "Pythagoras theorem" definition
3. Knowledge graph shows prerequisites:
   - Right-angled triangles
   - Square numbers
   - Square roots
4. Returns lessons covering each prerequisite
5. Shows progression path through concepts
6. Suggests assessment resources for prerequisite knowledge

**Value Demonstrated**: RAG capabilities, knowledge graph, prerequisite mapping, AI-powered understanding

#### Scenario 3: Planning a Unit on Algebra

**User Story**: "I'm planning a unit on factorisation for Higher tier"

**Query**: "algebra factorisation higher tier"

**Experience**:

1. Search returns:
   - Relevant units with factorisation focus
   - Individual lessons in logical sequence
   - Full sequences showing broader context
2. Thread view shows "Algebra" thread
3. Topic hierarchy shows factorisation subtopics (single brackets, quadratics, difference of squares)
4. Results include:
   - Common misconceptions (e.g., sign errors)
   - Teacher tips for each lesson
   - Prerequisite topics (expanding brackets)
5. "More like this" suggests related algebra topics (solving equations, completing the square)
6. Can export lesson sequence for planning

**Value Demonstrated**: Multi-index search, thread navigation, pedagogical metadata, comprehensive planning support

#### Scenario 4: Exploring Mathematical Concepts

**User Story**: "I want to understand how simultaneous equations are taught across tiers"

**Query**: "simultaneous equations"

**Experience**:

1. Ontology provides concept definition
2. Shows coverage in Foundation vs Higher:
   - Foundation: Graphical and substitution methods
   - Higher: Elimination, more complex systems
3. Lists all lessons/units covering this concept
4. Shows prerequisite concepts (solving linear equations, coordinates)
5. Suggests related topics (e.g., substitution, elimination, matrices)
6. Links to actual lesson content with transcripts
7. Displays common misconceptions across tiers

**Value Demonstrated**: Cross-tier analysis, ontology integration, comprehensive concept coverage, differentiation support

---

## Common Issues & Solutions

### Issue: E5 inference returns empty response

**Solution**: Check text input is not empty and endpoint is available.

```typescript
// Test E5 endpoint manually
const response = await esClient.inference.inference({
  inference_id: '.multilingual-e5-small-elasticsearch',
  input: 'Test query for embedding',
});

console.log('Embedding length:', response.text_embedding?.[0]?.length);
// Expected: 384
```

### Issue: Embeddings not generated during ingestion

**Solution**: Check ES client is passed to document transform functions.

```typescript
// In createLessonDocument, ensure esClient is available
const doc = await createLessonDocument({
  // ... other params
  esClient, // ← Must be provided for dense vector generation
});
```

### Issue: Type errors after `pnpm type-gen`

**Solution**: Check field-definitions.ts and es-field-overrides.ts syntax.

```bash
# Validate field definitions
pnpm type-check packages/sdks/oak-curriculum-sdk
```

### Issue: kNN query fails

**Solution**: Ensure dense_vector field has `index: true` in ES mapping.

```typescript
// Check mapping in es-field-overrides.ts
lesson_dense_vector: {
  type: 'dense_vector',
  dims: 384,  // Must match E5 dimensions
  index: true,  // ← Required for kNN
  similarity: 'cosine',
},
```

---

## Supporting Documents

### Reference Documents

- `reference-data-completeness-policy.md` - What data we upload in full vs summarize
- `reference-es-serverless-feature-matrix.md` - Feature adoption tracking matrix

### Foundation Documents (Re-read Regularly)

- `.agent/directives-and-memory/rules.md`
- `.agent/directives-and-memory/schema-first-execution.md`
- `.agent/directives-and-memory/testing-strategy.md`

---

## Conclusion

This plan transforms the Maths KS4 vertical slice into a **comprehensive showcase of Elasticsearch Serverless capabilities**. By integrating 23 additional ES features while maintaining strict adherence to foundation documents, we create:

1. **Technical Excellence** - TDD, schema-first, zero shortcuts
2. **Production Quality** - Comprehensive docs, ADRs, tests
3. **Impressive Demo** - Cutting-edge search capabilities
4. **Scalable Foundation** - Patterns applicable to full curriculum

**The plan is ambitious but achievable** with disciplined execution and regular foundation document review.

---

**Ready to begin Phase 1A when you are.**

See `.agent/prompts/semantic-search/semantic-search.prompt.md` for practical TDD examples and quick start guidance.

---

**End of Plan**
