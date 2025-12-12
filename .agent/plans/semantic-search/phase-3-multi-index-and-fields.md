# Phase 3: Multi-Index Search & Fields

**Status**: 🔄 IN PROGRESS  
**Estimated Effort**: 2-3 days  
**Prerequisites**: Phase 1 & 2 complete (two-way hybrid confirmed optimal)  
**Last Updated**: 2025-12-12

---

## Completed Work

- ✅ Verified and confirmed unit hybrid search uses BM25 + ELSER (two-way)
- ✅ Removed unused three-way RRF code (dense vectors provided no benefit)
- ✅ Updated smoke test documentation to accurately reflect two-way hybrid
- ✅ Aligned code with Phase 2 findings (documentation now matches implementation)
- ✅ Expanded unit ground truth from 16 to 43 queries (verified against Oak API)
- ✅ Fixed incorrect unit slugs in ground truth files
- ✅ Unit search smoke tests passing: MRR 0.915, NDCG@10 0.924
- ✅ All quality gates passing

---

## Remaining Work Summary

### Part 3.0: Multi-Index Infrastructure (5 tasks)

| Task                                | Priority | Status     |
| ----------------------------------- | -------- | ---------- |
| BM25 vs ELSER vs Hybrid experiment  | **HIGH** | 🔲 Pending |
| Add `doc_type` field to all indexes | **HIGH** | 🔲 Pending |
| Verify unit filter on lesson search | Medium   | 🔲 Pending |
| ADR: unified vs separate endpoints  | Medium   | 🔲 Pending |
| Unit reranking experiment           | Medium   | 🔲 Pending |

### Part 3a: Feature Parity Quick Wins (5 tasks)

| Task                       | Priority | Status     |
| -------------------------- | -------- | ---------- |
| OWA aliases import         | **HIGH** | 🔲 Pending |
| `pupilLessonOutcome` field | **HIGH** | 🔲 Pending |
| Display title fields       | Medium   | 🔲 Pending |
| Unit enrichment fields     | Medium   | 🔲 Pending |
| ADR: field additions       | Medium   | 🔲 Pending |

**Total remaining: 10 tasks**

---

## Phase 3 Goal

**Enable a `semantic_search` MCP tool** that searches lessons and units with filters.

This is Part 1 of the remaining semantic search work (MCP Prerequisites). After Phase 3, the MCP tool can be created and full curriculum ingest becomes valuable.

---

## Foundation Documents (MUST READ FIRST)

Before starting any work on this phase, read these foundation documents:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

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

| Index             | Hybrid Search | Tested        | Notes                      |
| ----------------- | ------------- | ------------- | -------------------------- |
| `oak_lessons`     | BM25 + ELSER  | ✅ Extensive  | 314 Maths KS4 lessons      |
| `oak_unit_rollup` | BM25 + ELSER  | ✅ Confirmed  | Two-way hybrid verified    |
| `oak_units`       | BM25 only     | ❌ Not tested | No semantic field          |
| `oak_sequences`   | BM25 + ELSER  | ❌ Not tested | `sequence_semantic` exists |
| `oak_threads`     | BM25 + ELSER  | ❌ Not tested | `thread_semantic` exists   |

### Technical Background

#### Two-Way Hybrid Search (BM25 + ELSER)

We use Elasticsearch's Reciprocal Rank Fusion (RRF) to combine:

1. **BM25** - Lexical/keyword matching (built-in)
2. **ELSER** - Sparse semantic embeddings via `.elser-2-elasticsearch` inference endpoint

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html

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

**Confirmed**: `oak_unit_rollup` has `unit_semantic` field with `copy_to` from title + rollup.
**Status**: ✅ Unit search endpoint uses two-way RRF (BM25 + ELSER).
**Verified**: Code audited and aligned with Phase 2 findings.

### Implementation Tasks (3.0)

| Task                                   | Description                                                                       | Effort | Priority     | Status      |
| -------------------------------------- | --------------------------------------------------------------------------------- | ------ | ------------ | ----------- |
| **Verify unit hybrid search**          | Confirm `runUnitsSearch` uses RRF with ELSER (BM25 + ELSER)                       | Low    | **CRITICAL** | ✅ COMPLETE |
| **Test unit hybrid search**            | Create ground truth and smoke tests for units                                     | Medium | **HIGH**     | ✅ COMPLETE |
| **BM25 vs ELSER vs Hybrid experiment** | Run comparative experiment showing difference between retrieval methods for units | Medium | **HIGH**     | 🔲 Pending  |
| **Add `doc_type` field**               | Add to all index schemas via field definitions                                    | Low    | **HIGH**     | 🔲 Pending  |
| **Add unit filter to lesson search**   | Allow `?unit=slug` parameter (verify existing implementation)                     | Low    | Medium       | 🔲 Pending  |
| **Unified search endpoint**            | Single endpoint returning mixed results with type                                 | Medium | Medium       | ✅ EXISTS   |
| **ADR: unified vs separate endpoints** | Document architectural decision on search endpoint strategy                       | Low    | Medium       | 🔲 Pending  |
| **Experiment with unit reranking**     | Test reranking with `rollup_text` (~300 chars/lesson) using ES native rerank      | Low    | Medium       | 🔲 Pending  |

#### BM25 vs ELSER vs Hybrid Experiment

**Purpose**: Demonstrate the value of hybrid search by comparing retrieval methods.

**Approach** (following ES documentation patterns):

1. Create a smoke test that runs the same queries against:
   - BM25 only (lexical)
   - ELSER only (semantic)
   - Hybrid (BM25 + ELSER via RRF)
2. Measure MRR, NDCG@10, zero-hit rate for each
3. Document findings showing hybrid superiority

See: https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html#semantic-search-hybrid

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

- [x] Unit search confirmed using hybrid (BM25 + ELSER)
- [x] Unit search has ground truth (43 queries) and metrics (MRR 0.915, NDCG@10 0.924)
- [ ] BM25 vs ELSER vs Hybrid comparative experiment completed
- [ ] `doc_type` field added to all indexes
- [ ] Lesson search with unit filter documented and tested
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

### Success Criteria (3a)

- [ ] OWA aliases merged into synonym system (subjects, key stages, exam boards)
- [ ] `pupilLessonOutcome` indexed and queryable with BM25 boost
- [ ] Display title fields (`subjectTitle`, `keyStageTitle`) added to lesson documents
- [ ] Unit enrichment fields indexed (`description`, `whyThisWhyNow`, `categories`, `priorKnowledgeRequirements`, `nationalCurriculumContent`)
- [ ] ADR documenting field additions and rationale
- [ ] All quality gates pass
- [ ] Re-indexing completed with new fields populated

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
- **Blocks**: Phase 4 (Search UI), Phase 7 (Query Enhancement)
- **Enables**: `semantic_search` MCP tool creation

---

## After Phase 3 Completion

1. **Create `semantic_search` MCP tool** in the SDK
2. **Full curriculum ingest** - 10,000 req/hr rate limit makes this feasible
3. **Test cross-subject search** - Validate patterns work beyond Maths KS4

---

## MCP Tool Preview

After Phase 3, the tool will support:

```typescript
{
  name: 'semantic_search',
  description: 'Search Oak curriculum lessons and units using semantic hybrid search',
  inputSchema: {
    properties: {
      query: { type: 'string', description: 'Search query' },
      types: { type: 'array', items: { enum: ['lesson', 'unit'] } },
      filters: {
        properties: {
          subject: { type: 'string' },
          keyStage: { type: 'string' },
          tier: { enum: ['foundation', 'higher'] },
          unit: { type: 'string', description: 'Filter lessons to specific unit' }
        }
      },
      limit: { type: 'number', default: 10 }
    },
    required: ['query']
  }
}
```

---

## Related Documents

- [Requirements](./requirements.md) - Business context and success criteria
- [Feature Parity Analysis](../../research/feature-parity-analysis.md) - Gap analysis with OWA
- [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) - Fields needing API changes
- [Prompt Entry Point](../../prompts/semantic-search/semantic-search.prompt.md) - Fresh chat starting point
- [Navigation Hub](./README.md) - All phases overview
