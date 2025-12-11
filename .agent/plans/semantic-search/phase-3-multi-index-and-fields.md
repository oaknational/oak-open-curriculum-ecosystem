# Phase 3: Multi-Index Search & Fields

**Status**: 📋 PLANNED  
**Estimated Effort**: 2-3 days  
**Prerequisites**: Phase 1 & 2 complete (two-way hybrid confirmed optimal)  
**Last Updated**: 2025-12-11

---

## Phase 3 Goal

**Enable a `semantic_search` MCP tool** that searches lessons and units with filters.

This is Part 1 of the remaining semantic search work (MCP Prerequisites). After Phase 3, the MCP tool can be created and full curriculum ingest becomes valuable.

---

## Data Strategy

**Continue with Maths KS4** for Phase 3. Rationale:

1. Phase 3 is infrastructure (code changes), not data volume
2. Ground truth exists for Maths KS4 (314 lessons, 36 units)
3. Faster iteration (5-10 min re-index vs hours for full curriculum)
4. Test patterns first, then scale

**After Phase 3**: Move to full curriculum ingest when MCP tool is ready.

---

## Foundation Documents (MUST READ)

Before starting any work on this phase:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

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

| Index             | Hybrid Search | Tested        | Notes                               |
| ----------------- | ------------- | ------------- | ----------------------------------- |
| `oak_lessons`     | BM25 + ELSER  | ✅ Extensive  | 314 Maths KS4 lessons               |
| `oak_unit_rollup` | BM25 + ELSER  | ❌ Not tested | `unit_semantic` exists but untested |
| `oak_units`       | BM25 only     | ❌ Not tested | No semantic field                   |
| `oak_sequences`   | BM25 + ELSER  | ❌ Not tested | `sequence_semantic` exists          |
| `oak_threads`     | BM25 + ELSER  | ❌ Not tested | `thread_semantic` exists            |

### Questions & Answers

#### 1. Can ES distinguish result types?

**Answer**: Yes. Each index has distinct structure. Options:

- **`_index` field**: Every ES hit includes `_index` in response - tells you which index the result came from
- **Explicit `doc_type` field**: Add `doc_type: 'lesson' | 'unit' | 'sequence'` to each document
- **Field presence**: Lessons have `lesson_slug`, units have `unit_slug`, etc.

**Recommendation**: Use `_index` (already available) + add explicit `doc_type` field for clarity.

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

**Current state**: `oak_unit_rollup` has `unit_semantic` field with `copy_to` from title + rollup.
**Unknown**: Whether the unit search endpoint actually uses RRF with ELSER.
**Action needed**: Audit and test unit search implementation.

### Implementation Tasks (3.0)

| Task                                 | Description                                                                                   | Effort | Priority     |
| ------------------------------------ | --------------------------------------------------------------------------------------------- | ------ | ------------ |
| **Verify unit hybrid search**        | Confirm `runUnitsSearch` uses RRF with ELSER (BM25 + ELSER)                                   | Low    | **CRITICAL** |
| **Test unit hybrid search**          | Create ground truth and smoke tests for units                                                 | Medium | **HIGH**     |
| **Experiment with unit reranking**   | Test reranking with `rollup_text` (~300 chars/lesson) - field already exists with good length | Low    | **HIGH**     |
| **Add `doc_type` field**             | Add to all index schemas via field definitions                                                | Low    | Medium       |
| **Add unit filter to lesson search** | Allow `?unit=slug` parameter                                                                  | Low    | Medium       |
| **Unified search endpoint**          | Single endpoint returning mixed results with type                                             | Medium | Medium       |

**Note**: Lesson reranking deferred to upstream API (needs `rerank_summary` field). Unit reranking is feasible NOW because `rollup_text` already has appropriate length (~300 chars/lesson).

### Success Criteria (3.0)

- [ ] Unit search confirmed using hybrid (BM25 + ELSER)
- [ ] `doc_type` field added to all indexes
- [ ] Lesson search supports unit filter
- [ ] Unit search has ground truth and metrics
- [ ] Decision on unified vs separate endpoints documented (ADR)

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

- [ ] OWA aliases merged into synonym system
- [ ] `pupilLessonOutcome` indexed and queryable
- [ ] Title fields added to lesson documents
- [ ] Unit description fields indexed
- [ ] ADR documenting field additions
- [ ] All quality gates pass

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
pnpm type-gen                                     # Generate types
pnpm build                                        # Build all
pnpm type-check                                   # TypeScript validation
pnpm lint:fix                                     # Auto-fix linting
pnpm format:root                                  # Format code
pnpm markdownlint:root                            # Markdown lint
pnpm test                                         # Unit + integration
pnpm test:e2e                                     # E2E tests
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
