# Missing Transcript Handling (Option D)

**Status**: 🚨 **BLOCKING** — Must complete before re-ingest
**Created**: 2025-12-31
**Updated**: 2026-01-01
**ADR**: [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)

---

## 🚨 BLOCKING WORK — DO NOT RE-INGEST UNTIL COMPLETE

All items below are **blocking**. Do not proceed to re-ingestion until every item is marked complete.

**ES documentation research complete** — see [ADR-095](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md) for findings confirming omitting fields is safe.

---

## Problem

Current code puts `"[No transcript available]"` into `lesson_content` and `lesson_content_semantic`:

```typescript
// apps/.../bulk-lesson-transformer.ts line 165 (current - incorrect)
const transcriptText = lesson.transcript_sentences ?? '[No transcript available]';
```

This pollutes:

- BM25 index with garbage tokens ("No", "transcript", "available")
- ELSER with garbage embeddings of meaningless placeholder

---

## Solution

**Option D: Conditional Retriever** — Omit content fields for lessons without transcripts.

---

## 🚨 BLOCKING: Implementation Checklist

### Step 1: TDD — Update Unit Tests FIRST ⬜

**Write failing tests before any code changes:**

```typescript
// bulk-lesson-transformer.unit.test.ts

describe('buildLessonContentFields', () => {
  it('includes content fields when transcript exists', () => {
    const lesson = createBulkLesson({ transcript_sentences: 'Hello world' });
    const result = buildLessonContentFields(lesson);
    
    expect(result.has_transcript).toBe(true);
    expect(result.lesson_content).toBe('Hello world');
    expect(result.lesson_content_semantic).toBe('Hello world');
  });

  it('omits content fields when transcript is null', () => {
    const lesson = createBulkLesson({ transcript_sentences: null });
    const result = buildLessonContentFields(lesson);
    
    expect(result.has_transcript).toBe(false);
    expect(result.lesson_content).toBeUndefined();
    expect(result.lesson_content_semantic).toBeUndefined();
  });

  it('omits content fields when transcript is undefined', () => {
    const lesson = createBulkLesson({ transcript_sentences: undefined });
    const result = buildLessonContentFields(lesson);
    
    expect(result.has_transcript).toBe(false);
    expect(result.lesson_content).toBeUndefined();
    expect(result.lesson_content_semantic).toBeUndefined();
  });

  it('omits content fields when transcript is empty string', () => {
    const lesson = createBulkLesson({ transcript_sentences: '' });
    const result = buildLessonContentFields(lesson);
    
    expect(result.has_transcript).toBe(false);
    expect(result.lesson_content).toBeUndefined();
    expect(result.lesson_content_semantic).toBeUndefined();
  });

  it('always includes structure fields regardless of transcript', () => {
    const lesson = createBulkLesson({ transcript_sentences: null });
    const result = buildLessonContentFields(lesson);
    
    expect(result.lesson_structure).toBeDefined();
    expect(result.lesson_structure_semantic).toBeDefined();
  });
});
```

**Then delete/update the existing tests that assert `[No transcript available]` behavior:**

- Lines 185-207 in `bulk-lesson-transformer.unit.test.ts` — these validate the WRONG behavior

### Step 2: Make Transcript Fields Optional in Search Schema ⬜

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

Update field definitions to mark transcript-related fields as optional with explanatory TSDoc:

```typescript
/**
 * Full transcript text for BM25 keyword matching.
 * 
 * **Optional**: MFL lessons (French, Spanish, German) and some practical
 * lessons (PE, cooking) do not have transcripts. When absent, this field
 * is omitted entirely to avoid polluting the BM25 index with placeholder text.
 * 
 * @see ADR-095 for rationale on conditional field inclusion
 */
lesson_content?: string;

/**
 * Transcript text for ELSER semantic embeddings.
 * 
 * **Optional**: Same rationale as `lesson_content`. When absent, no ELSER
 * inference is performed and the document won't match semantic queries
 * on this field (but can still match via `lesson_structure_semantic`).
 * 
 * @see ADR-095 for rationale on conditional field inclusion
 */
lesson_content_semantic?: string;
```

**Run `pnpm type-gen` after making changes.**

### Step 3: Add `has_transcript` Field to Search Schema ⬜

**Location**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts`

Add new boolean field:

```typescript
/**
 * Indicates whether this lesson has transcript content available.
 * 
 * Used for:
 * - Search filtering (e.g., "only show lessons with transcripts")
 * - Debug and diagnostic queries
 * - UI indication of content availability
 * - Explaining RRF behavior (why some lessons rank differently)
 * 
 * @see ADR-094 for field rationale
 */
has_transcript: boolean;
```

**Run `pnpm type-gen` after making changes.**

### Step 4: Verify ES Mapping Includes `has_transcript` ⬜

After `pnpm type-gen`:

1. Check generated mapping in `packages/sdks/oak-curriculum-sdk/src/types/generated/search/mappings.ts`
2. Verify `has_transcript: { type: 'boolean' }` is present

### Step 5: Update Transformer ⬜

**Location**: `apps/oak-open-curriculum-semantic-search/src/adapters/bulk-lesson-transformer.ts`

Update `buildLessonContentFields()`:

```typescript
function buildLessonContentFields(lesson: Lesson): LessonContentFields {
  const hasTranscript = typeof lesson.transcript_sentences === 'string' 
    && lesson.transcript_sentences.length > 0;
  
  const structureSummary = generateBulkLessonSemanticSummary(lesson);
  
  return {
    has_transcript: hasTranscript,
    // Only include content fields if transcript exists
    ...(hasTranscript ? {
      lesson_content: lesson.transcript_sentences,
      lesson_content_semantic: lesson.transcript_sentences,
    } : {}),
    // Structure fields always populated
    lesson_structure: structureSummary,
    lesson_structure_semantic: structureSummary,
    lesson_url: generateLessonUrl(lesson.lessonSlug),
    pupil_lesson_outcome: lesson.pupilLessonOutcome || undefined,
    supervision_level: normaliseSupervisionLevel(lesson.supervisionLevel),
    downloads_available: lesson.downloadsavailable,
  };
}
```

### Step 6: Check DRY — Single Source of Truth for Content Field Logic ⬜

**Issue**: There are two places where lesson documents are built:

1. `src/adapters/bulk-lesson-transformer.ts` — Bulk ingestion (PRIMARY)
2. `src/lib/indexing/document-transforms.ts` — API ingestion (DEPRECATED?)

**Action required**: Investigate whether `document-transforms.ts` is still used:

- If API ingestion is deprecated, document this fact
- If both are used, extract shared logic to avoid duplicate code
- **Minimum fix**: Ensure both use the same conditional logic for content fields

**DO NOT** implement the fix in two places separately.

### Step 7: Add Upstream API Wishlist Item ⬜

**Location**: `.agent/plans/external/ooc-api-wishlist/04-high-priority-requests.md`

Add new item requesting:

> **Mark transcript fields as optional in lesson schemas**
>
> Currently `transcript_sentences` appears to be implicitly optional (can be null/undefined)
> but this is not explicitly documented in the OpenAPI schema.
>
> **Request**: In both API responses and bulk download files:
> 1. Explicitly mark `transcript_sentences` as optional in the schema
> 2. Document which lesson types typically lack transcripts (MFL, practical lessons)
> 3. Consider adding a `has_transcript` boolean field natively
>
> **Impact**: Enables consumers to handle missing transcripts correctly without guessing

### Step 8: Run Quality Gates ⬜

```bash
# From repo root, one at a time
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
```

**All gates must pass before proceeding.**

---

## Acceptance Criteria

- [ ] Unit tests written FIRST (TDD red phase)
- [ ] `lesson_content` and `lesson_content_semantic` made optional in schema
- [ ] `has_transcript` field added to schema and mapping
- [ ] Transformer updated to conditionally include content fields
- [ ] DRY issue investigated and resolved
- [ ] Upstream API wishlist item added
- [ ] All quality gates pass

---

## Related Documents

**For RRF behavior explanation**, see [ADR-095 § RRF Behavior](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md#rrf-behavior).

- [ADR-094: `has_transcript` Field](../../../../docs/architecture/architectural-decisions/094-has-transcript-field.md)
- [ADR-095: Missing Transcript Handling](../../../../docs/architecture/architectural-decisions/095-missing-transcript-handling.md)
- [ES null_value documentation](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/null-value)
- [bulk-ingestion-fixes.md (archived)](../archive/completed/bulk-ingestion-fixes.md)
