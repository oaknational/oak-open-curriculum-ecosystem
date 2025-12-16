# Phase 3: Multi-Index Search & KS4 Filtering

**Status**: 3.0 ✅ | 3a ✅ | 3b ⚠️ | 3c 🔲  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Last Updated**: 2025-12-16

---

## Overview

Phase 3 implements multi-index search infrastructure with KS4 filtering capability.

**Key ADR**: [ADR-080: KS4 Metadata Denormalisation](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) - Defines the filtering architecture with Mermaid diagrams.

**Goal**: Prove that multi-index search infrastructure works correctly by verifying:

1. **Hybrid search correctness** - BM25 and ELSER both contribute measurably to search quality
2. **Lesson-only search** - Can search lessons in isolation
3. **Unit-only search** - Can search units in isolation
4. **Joint lesson+unit search** - Can search both with results properly categorised by `doc_type`
5. **Lesson search filtered by unit** - Can filter lessons to a specific unit
6. **KS4 filtering** - Can filter by tier, examBoard, examSubject, ks4Option

---

## ⚠️ Critical Gap: Tier Filtering Not Wired Through API

**Status**: KS4 metadata is indexed but **cannot be filtered** via the API.

| Component | Status | Issue |
| --------- | ------ | ----- |
| KS4 metadata indexed | ✅ | `tiers[]`, `exam_boards[]`, etc. are in documents |
| `SearchStructuredRequestSchema` | ❌ | Missing `tier`, `examBoard`, `examSubject`, `ks4Option` fields |
| `createLessonFilters()` | ❌ | Does not apply tier filter |
| `createUnitFilters()` | ❌ | Does not apply tier filter |
| Smoke tests | ⚠️ | Pass `tier` in request body but it's silently ignored |

**Fix required in Part 3c** - see [Task: Wire KS4 Filtering Through API](#task-wire-ks4-filtering-through-api).

---

## Progress Summary

| Part | Name | Status | Description |
| ---- | ---- | ------ | ----------- |
| 3.0 | Verification | ✅ Complete | BM25/ELSER/Hybrid experiment, scope filtering |
| 3a | Feature Parity | ✅ Complete | KS4 metadata indexed, unit enrichment fields |
| 3b | Semantic Summaries | ⚠️ Needs Rework | Field naming incorrect |
| 3c | Four-Retriever + API Wiring | 🔲 Pending | Implement four-retriever, wire KS4 filtering |

---

## Part 3.0: Verification ✅ COMPLETE

**Completed 2025-12-15.**

| Task | Status |
| ---- | ------ |
| BM25 vs ELSER vs Hybrid experiment | ✅ Hybrid superior for lessons |
| Lesson-only search verification | ✅ Returns only lessons |
| Unit-only search verification | ✅ Returns only units |
| Joint search with `doc_type` | ✅ Properly categorised |
| Lesson filter by unit | ✅ Filter works |
| Redis cache TTL 14 days + jitter | ✅ ADR-079 implemented |

### BM25 vs ELSER vs Hybrid Experiment

**Purpose**: Prove that hybrid search actually uses both retrieval methods and provides measurable benefit over either in isolation.

**Results**:
- **Lessons**: Hybrid is superior (MRR 0.908)
- **Units**: Mixed (ELSER slightly better MRR, hybrid better NDCG@10)

---

## Part 3a: Feature Parity ✅ COMPLETE

**Implementation complete, but tier filtering not wired through API.**

| Task | Status | Implementation |
| ---- | ------ | -------------- |
| OWA aliases import | ✅ | `mcp/synonyms/` |
| `pupilLessonOutcome` field | ✅ | Field definition + transform |
| Display title fields | ✅ | `subject_title`, `key_stage_title` |
| Unit enrichment fields | ✅ | `description`, `why_this_why_now`, etc. |
| KS4 sequence traversal | ✅ | `ks4-context-builder.ts` |
| UnitContextMap building | ✅ | Maps unit → KS4 metadata |
| KS4 field definitions | ✅ | `tiers[]`, `exam_boards[]`, etc. |
| Document decoration | ✅ | `extractKs4DocumentFields()` |
| KS4 filtering smoke tests | ⚠️ | Tests exist but filtering not wired |

### KS4 Filterable Fields

See [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) for complete field list and Mermaid diagrams.

| Field | Type | Values |
| ----- | ---- | ------ |
| `tiers` | string[] | `["foundation", "higher"]` |
| `tier_titles` | string[] | `["Foundation", "Higher"]` |
| `exam_boards` | string[] | `["aqa", "edexcel", "ocr", "eduqas", "edexcelb"]` |
| `exam_board_titles` | string[] | `["AQA", "Edexcel", "OCR", "Eduqas", "Edexcel B"]` |
| `exam_subjects` | string[] | `["biology", "chemistry", "physics"]` |
| `exam_subject_titles` | string[] | `["Biology", "Chemistry", "Physics"]` |
| `ks4_options` | string[] | Programme pathway slugs |
| `ks4_option_titles` | string[] | Programme pathway titles |

**Additional filterable fields** (from sequence response):
- `thread_slugs` / `thread_titles` - Curriculum threads
- `categories` - Unit categories

---

## Part 3b: Semantic Summaries ⚠️ NEEDS REWORK

**Issue**: `unit_semantic` was incorrectly replaced with summary instead of adding a new field.

| Task | Status | Issue |
| ---- | ------ | ----- |
| Dense vector code removed | ✅ | ADR-075 |
| Lesson summary template | ✅ | Exists but field naming wrong |
| Unit summary template | ✅ | Exists but field naming wrong |
| Field naming | ❌ | Not following content/structure pattern |

### Structural Summary Content

Summaries should include **ALL available API fields**, tolerating missing optional fields gracefully.

**Lesson Structure Summary** (from `/lessons/{lesson}/summary`):

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

**Unit Structure Summary** (from `/units/{unit}/summary`):

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

**Principle**: Include ALL fields. Users may search by misconception, by curriculum alignment, by thread, or by lesson title. Comprehensive coverage maximises match potential.

---

## Part 3c: Four-Retriever + API Wiring 🔲 PENDING

### Task: Rename Fields to Consistent Nomenclature

Pattern: `<entity>_content|structure[_semantic]`

| Current Field | New Field | Change |
| ------------- | --------- | ------ |
| `transcript_text` | `lesson_content` | Rename |
| `lesson_semantic` | `lesson_content_semantic` | Rename |
| `lesson_summary_semantic` | `lesson_structure_semantic` | Rename |
| (new) | `lesson_structure` | Add |
| `rollup_text` | `unit_content` | Rename |
| `unit_semantic` | `unit_content_semantic` | **Restore to rollup content** |
| (new) | `unit_structure` | Add |
| (new) | `unit_structure_semantic` | Add |

**Files to modify**:
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/indexing/document-transforms.ts`
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders.ts`

### Task: Wire KS4 Filtering Through API

1. **Update `SearchStructuredRequestSchema`** in `packages/sdks/oak-curriculum-sdk/src/types/generated/search/requests.ts`:

```typescript
// Add to schema
tier: z.string().optional(),
examBoard: z.string().optional(),
examSubject: z.string().optional(),
ks4Option: z.string().optional(),
```

2. **Update `StructuredQuery` interface** and `buildStructuredQuery()` in `apps/oak-open-curriculum-semantic-search/app/api/search/search-service.ts` to extract these fields.

3. **Update filter functions** in `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts`:

```typescript
// In createLessonFilters() and createUnitFilters()
if (query.tier) {
  filters.push({ term: { tiers: query.tier } });
}
if (query.examBoard) {
  filters.push({ term: { exam_boards: query.examBoard } });
}
if (query.examSubject) {
  filters.push({ term: { exam_subjects: query.examSubject } });
}
if (query.ks4Option) {
  filters.push({ term: { ks4_options: query.ks4Option } });
}
```

4. **Update smoke tests** to verify filtering actually works (not just that tests pass).

### Task: Update Query Builders for Four Retrievers

Update `rrf-query-builders.ts` to use four retrievers:

```typescript
const retrievers = [
  // BM25 on content
  createBm25Retriever(['lesson_content', 'lesson_title'], query, filter),
  // BM25 on structure
  createBm25Retriever(['lesson_structure'], query, filter),
  // ELSER on content
  createElserRetriever('lesson_content_semantic', query, filter),
  // ELSER on structure
  createElserRetriever('lesson_structure_semantic', query, filter),
];
```

### RRF Query Structure

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        { "standard": { "query": { "multi_match": { "query": "...", "fields": ["lesson_content", "lesson_title"] } }, "filter": [...] } },
        { "standard": { "query": { "multi_match": { "query": "...", "fields": ["lesson_structure"] } }, "filter": [...] } },
        { "standard": { "query": { "semantic": { "field": "lesson_content_semantic", "query": "..." } }, "filter": [...] } },
        { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "..." } }, "filter": [...] } }
      ],
      "rank_window_size": 100,
      "rank_constant": 60
    }
  }
}
```

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>

### Success Criteria

1. ✅ Four retrievers configured for lessons and units
2. ✅ Field names follow `<entity>_content|structure[_semantic]` pattern
3. ✅ KS4 filtering works via API (`tier`, `examBoard`, `examSubject`, `ks4Option`)
4. ✅ Smoke tests verify filtering actually filters (not just doesn't error)
5. ✅ MRR ≥ 0.70, NDCG@10 ≥ 0.75 maintained
6. ✅ All quality gates pass

---

## Implementation Files

### Core Implementation

| File | Purpose |
| ---- | ------- |
| `src/lib/indexing/ks4-context-builder.ts` | Sequence traversal, UnitContextMap |
| `src/lib/indexing/ks4-context-types.ts` | KS4 type definitions |
| `src/lib/indexing/document-transforms.ts` | Document creation |
| `src/lib/indexing/document-transform-helpers.ts` | `extractKs4DocumentFields()` |
| `src/lib/indexing/semantic-summary-generator.ts` | `generateLessonSemanticSummary()`, `generateUnitSemanticSummary()` |
| `src/lib/hybrid-search/rrf-query-builders.ts` | RRF query construction |
| `src/lib/hybrid-search/rrf-query-helpers.ts` | Filter creation |

### Schema Definitions

| File | Purpose |
| ---- | ------- |
| `type-gen/typegen/search/field-definitions/curriculum.ts` | Index field definitions |
| `src/types/generated/search/requests.ts` | `SearchStructuredRequestSchema` |

### API Layer

| File | Purpose |
| ---- | ------- |
| `app/api/search/route.ts` | Next.js API route handler |
| `app/api/search/search-service.ts` | `buildStructuredQuery()`, `parseSearchRequest()` |

### Tests

| File | Purpose |
| ---- | ------- |
| `smoke-tests/ks4-filtering.smoke.test.ts` | KS4 filtering verification |
| `smoke-tests/search-quality.smoke.test.ts` | Lesson MRR/NDCG |
| `smoke-tests/unit-search-quality.smoke.test.ts` | Unit MRR/NDCG |
| `smoke-tests/scope-verification.smoke.test.ts` | Scope filtering |
| `smoke-tests/hybrid-superiority.smoke.test.ts` | Direct ES tests |
| `src/lib/indexing/ks4-context-builder.unit.test.ts` | Unit tests for context building |

All paths relative to `apps/oak-open-curriculum-semantic-search/`.

---

## Verification Sequence

```bash
cd apps/oak-open-curriculum-semantic-search

# 1. Re-index fresh data
pnpm es:setup
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm es:status  # Expect ~314 lessons, ~36 units

# 2. Direct ES tests (no server needed)
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority

# 3. Start server (in separate terminal)
pnpm dev

# 4. API tests
pnpm vitest run -c vitest.smoke.config.ts scope-verification
pnpm vitest run -c vitest.smoke.config.ts ks4-filtering
pnpm vitest run -c vitest.smoke.config.ts search-quality
pnpm vitest run -c vitest.smoke.config.ts unit-search-quality
```

### KS4 Filtering Verification Checklist

| Test | Query | Expected Behaviour |
| ---- | ----- | ------------------ |
| Tier filtering | `tier: "foundation"` | Only Foundation tier lessons |
| Tier filtering | `tier: "higher"` | Only Higher tier lessons |
| Exam board filtering | `examBoard: "aqa"` | Only AQA sequence lessons |
| Exam subject filtering | `examSubject: "biology"` | Only Biology lessons (sciences) |
| KS4 option filtering | `ks4Option: "gcse-combined-science"` | Only Combined Science lessons |
| Combined filters | `tier: "foundation", examBoard: "aqa"` | Foundation tier AND AQA |

---

## Note: Next.js App is Deprecated

The `app/` folder is a **deprecated Next.js frontend**. All actual functionality is in:

- `src/` - Core implementation
- `scripts/` - CLI tools

**Phase 4** will delete the Next.js app and create a proper SDK + CLI.

---

## Data Strategy

**Continue with Maths KS4** for Phase 3. Rationale:

1. Phase 3 is infrastructure (code changes), not data volume
2. Ground truth exists for Maths KS4 (314 lessons, 36 units)
3. Faster iteration (5-10 min re-index vs hours for full curriculum)
4. Test patterns first, then scale

**After Phase 3**: Move to full curriculum ingest when MCP tool is ready.

---

## TDD Requirements

Per `testing-strategy.md`, all work MUST follow TDD at the appropriate level:

| Change Type | Test Level | Write First |
| ----------- | ---------- | ----------- |
| New field extraction function | Unit | Unit test for pure transform |
| Unit search endpoint changes | Integration | Integration test for query building |
| Multi-index search behaviour | E2E/Smoke | Smoke test specifying new behaviour |
| Ground truth for unit search | Smoke | Define expected results first |

**Sequence**:

1. Write test specifying desired behaviour (RED)
2. Run test - it MUST fail
3. Implement code (GREEN)
4. Run test - it MUST pass
5. Refactor if needed - tests MUST stay green

---

## Related Documents

| Document | Purpose |
| -------- | ------- |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-ks4-metadata-denormalization-strategy.md) | KS4 filtering architecture (with Mermaid diagrams) |
| [ADR-075](../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Dense vector removal |
| [ADR-076](../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | ELSER-only strategy |
| [ADR-077](../../../docs/architecture/architectural-decisions/077-semantic-summary-generation.md) | Semantic summary generation |
| [ADR-079](../../../docs/architecture/architectural-decisions/079-sdk-cache-ttl-jitter.md) | SDK cache TTL jitter |
| [Prompt](../../prompts/semantic-search/semantic-search.prompt.md) | Fresh chat entry point |
| [README](README.md) | Navigation hub |
| [Requirements](requirements.md) | Business context |
| [Upstream API Wishlist](../external/upstream-api-metadata-wishlist.md) | Fields to request from Oak API |

---

## Quality Gates

Run after every piece of work, from repo root:

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
