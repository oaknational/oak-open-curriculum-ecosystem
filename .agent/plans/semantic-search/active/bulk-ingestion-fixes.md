# Bulk Ingestion Fixes

**Status**: ✅ IMPLEMENTED
**Created**: 2025-12-31
**Principle**: Complete the existing implementation, don't restructure

---

## Foundation Documents (MANDATORY)

1. **[rules.md](../../../directives-and-memory/rules.md)** — "Could it be simpler?"
2. **[testing-strategy.md](../../../directives-and-memory/testing-strategy.md)** — TDD at ALL levels
3. **[schema-first-execution.md](../../../directives-and-memory/schema-first-execution.md)** — Generator is source of truth

---

## Problem Summary

The bulk ingestion path is **incomplete**, not fundamentally wrong. It needs:

1. **Semantic summary generation** — `lesson_structure` explicitly set to `undefined`
2. **Rollup document creation** — Not implemented for bulk path
3. **"NULL" string handling** — Transcript fields not using `nullSentinelSchema`

## Why NOT Architectural Restructure

An earlier proposal suggested creating "normalised interfaces" shared by bulk and API paths. This would:

- ❌ Create hand-authored types (violates cardinal rule)
- ❌ Create a compatibility layer (explicitly prohibited)
- ❌ Add complexity instead of simplicity

The bulk and API schemas are **different by design**. Each path should use its own generated types.

---

## Fix 1: Transcript NULL Handling (SDK)

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/bulk/bulk-schemas.ts`

**Problem**: `transcript_sentences` and `transcript_vtt` use `z.string().optional()` but bulk data contains literal "NULL" strings.

**Current** (line 263-264):
```typescript
transcript_sentences: z.string().optional(),
transcript_vtt: z.string().optional(),
```

**Fix**: Use `nullSentinelSchema`:
```typescript
transcript_sentences: nullSentinelSchema,
transcript_vtt: nullSentinelSchema,
```

**Impact**: After this change, `Lesson.transcript_sentences` will be `string | null` instead of `string | undefined`, and "NULL" literals will be transformed to `null` at parse time.

**TDD**:
1. Write test: bulk file with "NULL" transcript parses to `null`
2. Update schema
3. Verify test passes

---

## Fix 2: Semantic Summary Generation (App)

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.ts`

**Problem**: Lines 86-88 explicitly skip structure fields:
```typescript
lesson_structure: undefined,
lesson_structure_semantic: undefined,
```

**Fix**: Generate semantic summary from bulk lesson's pedagogical fields.

**Approach**: Create `generateBulkLessonSemanticSummary(lesson: Lesson): string` that extracts and formats:
- `lessonTitle`, `keyStageTitle`, `subjectTitle`, `unitTitle` (context line)
- `keyLearningPoints` (learning objectives)
- `lessonKeywords` (vocabulary)
- `misconceptionsAndCommonMistakes` (misconceptions)
- `teacherTips` (tips)
- `contentGuidance` (guidance)
- `pupilLessonOutcome` (outcome)

This is ~30 lines of string formatting. It's NOT duplication to have bulk-specific and API-specific versions — they use different types.

**TDD**:
1. Write test: bulk lesson produces non-empty semantic summary
2. Implement `generateBulkLessonSemanticSummary`
3. Update `buildLessonContentFields` to call it
4. Verify test passes

---

## Fix 3: Rollup Document Creation (App)

**Location**: `apps/oak-open-curriculum-semantic-search/src/lib/indexing/bulk-ingestion.ts`

**Problem**: Bulk path creates `oak_units` but not `oak_unit_rollup`.

**Fix**: Add rollup document creation to bulk ingestion pipeline.

**Approach**:
1. Aggregate lesson planning snippets per unit
2. Build rollup documents with:
   - `unit_content`: Aggregated lesson snippets + pedagogical data
   - `unit_structure`: Semantic summary of unit
   - Both `*_semantic` fields

**What rollup needs** (from unit data):
- `unitSlug`, `unitTitle`, `description`, `whyThisWhyNow`
- `threads`, `priorKnowledgeRequirements`, `nationalCurriculumContent`
- Aggregated lesson snippets

**TDD**:
1. Write E2E test: bulk ingestion produces rollup documents
2. Add `generateBulkUnitSemanticSummary` for unit summaries
3. Add `selectBulkLessonPlanningSnippet` for lesson snippets
4. Wire into bulk ingestion pipeline
5. Verify E2E test passes

---

## Implementation Order

| # | Fix | Risk | Complexity |
|---|-----|------|------------|
| 1 | Transcript NULL handling | Low | Low |
| 2 | Semantic summary generation | Medium | Low |
| 3 | Rollup document creation | Medium | Medium |

Each fix is independent and can be merged separately.

---

## Acceptance Criteria

- [x] `lesson_structure` populated for all bulk lessons
- [x] `lesson_structure_semantic` populated for all bulk lessons
- [x] `oak_unit_rollup` populated with enriched content
- [x] MFL lessons have semantic summary from pedagogical fields (even without transcript)
- [x] "NULL" transcript strings handled correctly
- [x] All quality gates pass
- [x] TDD followed at all levels (with pragmatic recovery for wiring phase)

---

## Files to Modify

| File | Change |
|------|--------|
| `packages/sdks/.../bulk-schemas.ts` | Fix 1: nullSentinelSchema for transcripts |
| `apps/.../bulk-lesson-transformer.ts` | Fix 2: Add semantic summary generation |
| `apps/.../bulk-ingestion.ts` | Fix 3: Add rollup creation |

**Note**: This is a COMPLETION of existing work, not architectural restructure.

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Initial specification | Agent |
| 2025-12-31 | Implementation complete - all fixes applied, quality gates pass | Agent |

