# Bulk-API Ingestion Parity Requirements

**Status**: 📋 SPECIFICATION — Mandatory before implementation  
**Created**: 2025-12-31  
**Last Updated**: 2025-12-31  
**Related ADR**: ADR-093 Bulk-First Ingestion Strategy

---

## Purpose

This document specifies the **exact parity requirements** between bulk download ingestion and API-based ingestion. Both paths MUST produce identical Elasticsearch document structures.

This specification serves as:
1. The **contract** that TDD tests prove
2. The **checklist** for code review
3. The **source of truth** for acceptance criteria

---

## Foundation Documents

Before any implementation work, re-read and recommit to:

1. **[rules.md](../../../directives-and-memory/rules.md)** — First Question: "Could it be simpler?"
2. **[testing-strategy.md](../../../directives-and-memory/testing-strategy.md)** — TDD at all levels
3. **[schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

---

## Index Overview

| Index | Purpose | Document Type | Authoritative Schema |
|-------|---------|---------------|---------------------|
| `oak_lessons` | Lesson search (BM25 + ELSER) | `SearchLessonsIndexDoc` | SDK `SearchLessonsIndexDocSchema` |
| `oak_units` | Unit metadata | `SearchUnitsIndexDoc` | SDK `SearchUnitsIndexDocSchema` |
| `oak_unit_rollup` | Unit search with lesson content | `SearchUnitRollupDoc` | SDK `SearchUnitRollupDocSchema` |
| `oak_threads` | Thread/sequence navigation | `SearchThreadIndexDoc` | SDK `SearchThreadIndexDocSchema` |

---

## 1. Lesson Document Parity (`oak_lessons`)

### Schema Source

```
@oaknational/oak-curriculum-sdk/public/search.js → SearchLessonsIndexDocSchema
```

### Field Requirements

| Field | Type | Required | Bulk Source | API Source | Bulk Status |
|-------|------|----------|-------------|------------|-------------|
| `lesson_id` | string | ✅ | `lesson.lessonSlug` | `lessonSlug` | ✅ OK |
| `lesson_slug` | string | ✅ | `lesson.lessonSlug` | `lessonSlug` | ✅ OK |
| `lesson_title` | string | ✅ | `lesson.lessonTitle` | `lessonTitle` | ✅ OK |
| `subject_slug` | Subject enum | ✅ | `lesson.subjectSlug` (normalised) | `subjectSlug` | ✅ OK |
| `subject_title` | string | ⚪ | `lesson.subjectTitle` | `subjectTitle` | ✅ OK |
| `key_stage` | KeyStage enum | ✅ | `lesson.keyStageSlug` | `keyStageSlug` | ✅ OK |
| `key_stage_title` | string | ⚪ | `lesson.keyStageTitle` | `keyStageTitle` | ✅ OK |
| `years` | string[] | ⚪ | From parent unit | `year`/`yearSlug` | ✅ OK |
| `unit_ids` | string[] | ✅ | `[lesson.unitSlug]` | All unit relationships | ✅ OK |
| `unit_titles` | string[] | ✅ | `[lesson.unitTitle]` | All unit titles | ✅ OK |
| `unit_urls` | string[] | ✅ | Generated from unitSlug | `canonicalUrl` | ✅ OK |
| `unit_count` | number | ⚪ | Count from parent unit | `unitLessons.length` | ⚪ Missing |
| `lesson_keywords` | string[] | ⚪ | `lesson.lessonKeywords[].keyword` | Same | ✅ OK |
| `key_learning_points` | string[] | ⚪ | `lesson.keyLearningPoints[].keyLearningPoint` | Same | ✅ OK |
| `misconceptions_and_common_mistakes` | string[] | ⚪ | `lesson.misconceptionsAndCommonMistakes[].misconception` | Same | ✅ OK |
| `teacher_tips` | string[] | ⚪ | `lesson.teacherTips[].teacherTip` | Same | ✅ OK |
| `content_guidance` | string[] | ⚪ | `lesson.contentGuidance[].contentGuidanceLabel` | Same | ✅ OK |
| `lesson_content` | string | ✅ | `lesson.transcript_sentences` | Transcript API | ✅ OK |
| **`lesson_structure`** | string | ⚪ | **MUST GENERATE** from pedagogical fields | `generateLessonSemanticSummary()` | 🚨 **MISSING** |
| `lesson_content_semantic` | string | ⚪ | `lesson.transcript_sentences` | Transcript | ✅ OK |
| **`lesson_structure_semantic`** | string | ⚪ | **MUST GENERATE** from pedagogical fields | `generateLessonSemanticSummary()` | 🚨 **MISSING** |
| `lesson_url` | string | ✅ | Generated from lessonSlug | `canonicalUrl` | ✅ OK |
| `pupil_lesson_outcome` | string | ⚪ | `lesson.pupilLessonOutcome` | Same | ✅ OK |
| `supervision_level` | string | ⚪ | `lesson.supervisionLevel` (NULL→null) | Same | ✅ OK |
| `downloads_available` | boolean | ⚪ | `lesson.downloadsavailable` | `downloadsAvailable` | ✅ OK |
| `thread_slugs` | string[] | ⚪ | From parent unit threads | From unit | ⚪ Missing |
| `thread_titles` | string[] | ⚪ | From parent unit threads | From unit | ⚪ Missing |
| `tiers` | string[] | ⚪ | API supplementation (maths KS4) | From unit context | ✅ OK |
| `tier_titles` | string[] | ⚪ | API supplementation | From unit context | ✅ OK |
| `exam_boards` | string[] | ⚪ | From unit examBoards | From unit context | ✅ OK |
| `exam_board_titles` | string[] | ⚪ | From unit examBoards | From unit context | ✅ OK |
| `exam_subjects` | string[] | ⚪ | From unit examBoards | From unit context | ✅ OK |
| `exam_subject_titles` | string[] | ⚪ | From unit examBoards | From unit context | ✅ OK |
| `ks4_options` | string[] | ⚪ | From file ks4Options | From context | ⚪ Missing |
| `ks4_option_titles` | string[] | ⚪ | From file ks4Options | From context | ⚪ Missing |
| `title_suggest` | CompletionPayload | ⚪ | Generated | Generated | ✅ OK |
| `doc_type` | string | ✅ | `'lesson'` | `'lesson'` | ✅ OK |

### Critical Gap: `lesson_structure` and `lesson_structure_semantic`

**Current bulk implementation** (in `bulk-lesson-transformer.ts` lines 86-88):
```typescript
lesson_structure: undefined,
lesson_structure_semantic: undefined,
```

**Required implementation**: Generate semantic summary from available pedagogical data:

```typescript
// Pseudocode - actual implementation must use existing generateLessonSemanticSummary pattern
const semanticSummary = generateBulkLessonSemanticSummary({
  lessonTitle: lesson.lessonTitle,
  keyStageTitle: lesson.keyStageTitle,
  subjectTitle: lesson.subjectTitle,
  unitTitle: lesson.unitTitle,
  keyLearningPoints: lesson.keyLearningPoints,
  lessonKeywords: lesson.lessonKeywords,
  misconceptionsAndCommonMistakes: lesson.misconceptionsAndCommonMistakes,
  teacherTips: lesson.teacherTips,
  contentGuidance: lesson.contentGuidance,
  pupilLessonOutcome: lesson.pupilLessonOutcome,
});

return {
  // ...other fields
  lesson_structure: semanticSummary,
  lesson_structure_semantic: semanticSummary,
};
```

**Acceptance Criteria**:
- [ ] `lesson_structure` MUST contain a semantic summary of ~200-400 tokens
- [ ] `lesson_structure_semantic` MUST equal `lesson_structure` (same content, different ES field usage)
- [ ] Semantic summary MUST include: context line, key learning points, keywords, misconceptions, teacher tips
- [ ] ELSER structure retriever MUST return non-zero results

---

## 2. Unit Document Parity (`oak_units`)

### Schema Source

```
@oaknational/oak-curriculum-sdk/public/search.js → SearchUnitsIndexDocSchema
```

### Field Requirements

| Field | Type | Required | Bulk Source | API Source | Bulk Status |
|-------|------|----------|-------------|------------|-------------|
| `unit_id` | string | ✅ | `unit.unitSlug` | `unitSlug` | ✅ OK |
| `unit_slug` | string | ✅ | `unit.unitSlug` | `unitSlug` | ✅ OK |
| `unit_title` | string | ✅ | `unit.unitTitle` | `unitTitle` | ✅ OK |
| `subject_slug` | Subject enum | ✅ | Derived from sequenceSlug | `subjectSlug` | ✅ OK |
| `subject_title` | string | ⚪ | `file.subjectTitle` | `subjectTitle` | ✅ OK |
| `key_stage` | KeyStage enum | ✅ | `unit.keyStageSlug` | `keyStageSlug` | ✅ OK |
| `key_stage_title` | string | ⚪ | Generated from keyStage | `keyStageTitle` | ✅ OK |
| `years` | string[] | ⚪ | `unit.year`/`unit.yearSlug` | Same | ✅ OK |
| `lesson_ids` | string[] | ✅ | `unit.unitLessons[].lessonSlug` | Same | ✅ OK |
| `lesson_count` | number | ✅ | `unit.unitLessons.length` | Same | ✅ OK |
| `unit_topics` | string[] | ⚪ | **NOT IN BULK** | `categories[].categoryTitle` | ⚪ Missing |
| `unit_url` | string | ✅ | Generated | `canonicalUrl` | ✅ OK |
| `subject_programmes_url` | string | ✅ | Generated | Generated | ✅ OK |
| `sequence_ids` | string[] | ⚪ | `unit.threads[].slug` | `threads[].slug` | ✅ OK |
| `thread_slugs` | string[] | ⚪ | `unit.threads[].slug` | `threads[].slug` | ✅ OK |
| `thread_titles` | string[] | ⚪ | `unit.threads[].title` | `threads[].title` | ✅ OK |
| `thread_orders` | number[] | ⚪ | `unit.threads[].order` | `threads[].order` | ✅ OK |
| `description` | string | ⚪ | `unit.description` | `description` | ✅ OK |
| `why_this_why_now` | string | ⚪ | `unit.whyThisWhyNow` | `whyThisWhyNow` | ✅ OK |
| `categories` | string[] | ⚪ | **NOT IN BULK** | `categories` | ⚪ Missing |
| `prior_knowledge_requirements` | string[] | ⚪ | `unit.priorKnowledgeRequirements` | Same | ✅ OK |
| `national_curriculum_content` | string[] | ⚪ | `unit.nationalCurriculumContent` | Same | ✅ OK |
| `tiers` | string[] | ⚪ | API supplementation (maths KS4) | From context | ✅ OK |
| `tier_titles` | string[] | ⚪ | API supplementation | From context | ✅ OK |
| `exam_boards` | string[] | ⚪ | `unit.examBoards[].slug` | From context | ✅ OK |
| `exam_board_titles` | string[] | ⚪ | `unit.examBoards[].title` | From context | ✅ OK |
| `exam_subjects` | string[] | ⚪ | `unit.examBoards[].examSubjectTitle` | From context | ✅ OK |
| `exam_subject_titles` | string[] | ⚪ | `unit.examBoards[].examSubjectTitle` | From context | ✅ OK |
| `ks4_options` | string[] | ⚪ | `file.ks4Options[].slug` | From context | ⚪ Missing |
| `ks4_option_titles` | string[] | ⚪ | `file.ks4Options[].title` | From context | ⚪ Missing |
| `title_suggest` | CompletionPayload | ⚪ | Generated | Generated | ✅ OK |
| `doc_type` | string | ✅ | `'unit'` | `'unit'` | ✅ OK |

### Known Limitations (Bulk Data Gaps)

- `unit_topics` / `categories`: Not present in bulk download (requires API or acceptance of gap)
- `ks4_options` / `ks4_option_titles`: Available at file level, not currently propagated

---

## 3. Unit Rollup Document Parity (`oak_unit_rollup`)

### Schema Source

```
@oaknational/oak-curriculum-sdk/public/search.js → SearchUnitRollupDocSchema
```

### Current Status

🚨 **CRITICAL**: Bulk ingestion does NOT create `oak_unit_rollup` documents at all.

The API mode creates rollup documents via `buildRollupDocuments()` in `index-bulk-helpers.ts`. Bulk mode has no equivalent.

### Field Requirements

| Field | Type | Required | Bulk Source | API Source | Bulk Status |
|-------|------|----------|-------------|------------|-------------|
| `unit_id` | string | ✅ | `unit.unitSlug` | `unitSlug` | 🚨 **NOT CREATED** |
| `unit_slug` | string | ✅ | `unit.unitSlug` | `unitSlug` | 🚨 **NOT CREATED** |
| `unit_title` | string | ✅ | `unit.unitTitle` | `unitTitle` | 🚨 **NOT CREATED** |
| `subject_slug` | Subject enum | ✅ | Derived | `subjectSlug` | 🚨 **NOT CREATED** |
| `subject_title` | string | ⚪ | `file.subjectTitle` | `subjectTitle` | 🚨 **NOT CREATED** |
| `key_stage` | KeyStage enum | ✅ | `unit.keyStageSlug` | `keyStageSlug` | 🚨 **NOT CREATED** |
| `key_stage_title` | string | ⚪ | Generated | `keyStageTitle` | 🚨 **NOT CREATED** |
| `years` | string[] | ⚪ | `unit.year`/`yearSlug` | Same | 🚨 **NOT CREATED** |
| `lesson_ids` | string[] | ✅ | `unit.unitLessons[].lessonSlug` | Same | 🚨 **NOT CREATED** |
| `lesson_count` | number | ✅ | `unit.unitLessons.length` | Same | 🚨 **NOT CREATED** |
| `unit_topics` | string[] | ⚪ | **NOT IN BULK** | `categories` | 🚨 **NOT CREATED** |
| **`unit_content`** | string | ✅ | **MUST BUILD** from lesson snippets | `createEnrichedRollupText()` | 🚨 **NOT CREATED** |
| **`unit_structure`** | string | ⚪ | **MUST BUILD** semantic summary | `generateUnitSemanticSummary()` | 🚨 **NOT CREATED** |
| **`unit_content_semantic`** | string | ⚪ | Same as `unit_content` | Same | 🚨 **NOT CREATED** |
| **`unit_structure_semantic`** | string | ⚪ | Same as `unit_structure` | Same | 🚨 **NOT CREATED** |
| `unit_url` | string | ✅ | Generated | `canonicalUrl` | 🚨 **NOT CREATED** |
| `subject_programmes_url` | string | ✅ | Generated | Generated | 🚨 **NOT CREATED** |
| `sequence_ids` | string[] | ⚪ | `unit.threads[].slug` | `threads` | 🚨 **NOT CREATED** |
| `thread_slugs` | string[] | ⚪ | `unit.threads[].slug` | `threads` | 🚨 **NOT CREATED** |
| `thread_titles` | string[] | ⚪ | `unit.threads[].title` | `threads` | 🚨 **NOT CREATED** |
| `thread_orders` | number[] | ⚪ | `unit.threads[].order` | `threads` | 🚨 **NOT CREATED** |
| `description` | string | ⚪ | `unit.description` | `description` | 🚨 **NOT CREATED** |
| `why_this_why_now` | string | ⚪ | `unit.whyThisWhyNow` | `whyThisWhyNow` | 🚨 **NOT CREATED** |
| `categories` | string[] | ⚪ | **NOT IN BULK** | `categories` | 🚨 **NOT CREATED** |
| `prior_knowledge_requirements` | string[] | ⚪ | `unit.priorKnowledgeRequirements` | Same | 🚨 **NOT CREATED** |
| `national_curriculum_content` | string[] | ⚪ | `unit.nationalCurriculumContent` | Same | 🚨 **NOT CREATED** |
| KS4 fields | various | ⚪ | API supplementation | From context | 🚨 **NOT CREATED** |
| `title_suggest` | CompletionPayload | ⚪ | Generated | Generated | 🚨 **NOT CREATED** |
| `doc_type` | string | ✅ | `'unit'` | `'unit'` | 🚨 **NOT CREATED** |

### Rollup Content Generation Requirements

The rollup document requires **aggregated lesson content**:

1. **`unit_content`**: Concatenated lesson planning snippets
   - For each lesson in unit: extract snippet from `key_learning_points` → `teacher_tips` → `lesson_keywords` → fallback to transcript
   - Limit each snippet to ~300 characters
   - Join with double newlines
   - Combine with pedagogical summary (misconceptions, prior knowledge, NC content)

2. **`unit_structure`**: Semantic summary for ELSER
   - Use `generateUnitSemanticSummary()` pattern
   - Include: unit context, overview, description, prior knowledge, NC content, threads, topics, lesson titles

**Acceptance Criteria**:
- [ ] `oak_unit_rollup` index MUST be populated during bulk ingestion
- [ ] Document count MUST match `oak_units` document count
- [ ] `unit_content` MUST contain lesson planning snippets (~300 chars per lesson)
- [ ] `unit_structure` MUST contain semantic summary for ELSER
- [ ] Unit search MUST return non-zero results

---

## 4. Thread Document Parity (`oak_threads`)

### Schema Source

```
@oaknational/oak-curriculum-sdk/public/search.js → SearchThreadIndexDocSchema
```

### Current Status

✅ Bulk ingestion creates thread documents via `extractThreadsFromBulkFiles()` and `buildThreadBulkOperations()`.

### Field Requirements

| Field | Type | Required | Bulk Source | API Source | Bulk Status |
|-------|------|----------|-------------|------------|-------------|
| `thread_slug` | string | ✅ | `unit.threads[].slug` | `threads[].slug` | ✅ OK |
| `thread_title` | string | ✅ | `unit.threads[].title` | `threads[].title` | ✅ OK |
| `unit_count` | number | ✅ | Aggregated count | Aggregated | ✅ OK |
| `subject_slugs` | string[] | ⚪ | Aggregated | Aggregated | ✅ OK |
| `thread_semantic` | string | ⚪ | Generated | Generated | ⚪ Check |
| `thread_url` | string | ✅ | Generated | Generated | ✅ OK |
| `title_suggest` | CompletionPayload | ⚪ | Generated | Generated | ⚪ Check |

---

## 5. Data Volume Requirements

### Expected Counts (from bulk download analysis)

| Metric | Expected | Current (Bulk) | Gap |
|--------|----------|----------------|-----|
| Total lessons | ~12,833 | 2,884 | **~78% missing** |
| Total units | ~1,665 | 1,635 | ~2% (acceptable) |
| Total threads | ~164 | 164 | ✅ OK |
| Subjects indexed | 16 | 14 | **PE, Spanish missing** |
| Unit rollups | ~1,665 | **0** | **100% missing** |

### Subject Validation

All 16 subjects with bulk files MUST be indexed:

| Subject | Primary File | Secondary File | Expected Status |
|---------|--------------|----------------|-----------------|
| art | ✅ | ✅ | Must index |
| citizenship | — | ✅ | Must index |
| computing | ✅ | ✅ | Must index |
| cooking-nutrition | ✅ | ✅ | Must index |
| design-technology | ✅ | ✅ | Must index |
| english | ✅ | ✅ | Must index |
| french | ✅ | ✅ | Must index |
| geography | ✅ | ✅ | Must index |
| german | — | ✅ | Must index |
| history | ✅ | ✅ | Must index |
| maths | ✅ | ✅ | Must index |
| music | ✅ | ✅ | Must index |
| **physical-education** | ✅ | ✅ | 🚨 **Currently 0** |
| religious-education | ✅ | ✅ | Must index |
| science | ✅ | ✅ | Must index |
| **spanish** | ✅ | ✅ | 🚨 **Currently 0** |
| rshe-pshe | ❌ | ❌ | Not in bulk (expected) |

---

## 6. Retriever Validation Requirements

After ingestion, all retrievers MUST return non-zero results for standard test queries.

| Retriever | Index | Current MRR | Required |
|-----------|-------|-------------|----------|
| `bm25_content` | `oak_lessons` | 0.456 | ≥ 0.40 |
| `elser_content` | `oak_lessons` | 0.393 | ≥ 0.35 |
| `bm25_structure` | `oak_lessons` | 0.440 | ≥ 0.40 |
| `elser_structure` | `oak_lessons` | **0.000** 🚨 | ≥ 0.30 |
| Unit search (any) | `oak_unit_rollup` | **0.000** 🚨 | ≥ 0.30 |

---

## 7. Acceptance Criteria Summary

### Must Pass Before Implementation is Complete

- [ ] **Lesson structure fields populated**: `lesson_structure` and `lesson_structure_semantic` contain semantic summaries
- [ ] **Unit rollup index populated**: `oak_unit_rollup` contains documents for all units
- [ ] **All 16 subjects indexed**: Including PE and Spanish
- [ ] **~12,000+ lessons indexed**: Not 2,884
- [ ] **ELSER structure retriever works**: Non-zero MRR
- [ ] **Unit search works**: Non-zero MRR
- [ ] **All quality gates pass**: type-gen, build, type-check, lint, format, test, e2e

### Test Coverage Requirements

Each requirement MUST have:
1. **Unit test**: Proves the pure transformation function works
2. **Integration test**: Proves the assembled pipeline produces correct documents
3. **E2E test**: Proves the running system returns expected search results

---

## 8. Implementation Order

Based on dependencies and impact:

1. **Investigate lesson count discrepancy** — find why 78% are missing
2. **Fix PE and Spanish** — find why these subjects produce 0 lessons
3. **Implement `lesson_structure` generation** — enables ELSER structure retriever
4. **Implement `oak_unit_rollup` creation** — enables unit search
5. **Add missing lesson fields** — `thread_slugs`, `thread_titles`, `ks4_options`
6. **Add missing unit fields** — `ks4_options`, `ks4_option_titles`
7. **Run full validation** — retriever ablation, quality gates

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [roadmap.md](../roadmap.md) | Master plan |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Session context |
| [complete-data-indexing.md](./complete-data-indexing.md) | Implementation plan |
| [07-bulk-download-data-quality-report.md](../../research/ooc/07-bulk-download-data-quality-report.md) | Data quality analysis |
| ADR-093 | Bulk-First Ingestion Strategy |

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial specification created | Agent |

