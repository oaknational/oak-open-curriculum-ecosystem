# Subject Filter Fix Plan

**Created**: 2026-01-27  
**Completed**: 2026-01-27  
**Status**: ✅ Complete  
**Priority**: High — Blocks 11 ground truth queries  
**Effort**: ~3-4 hours implementation + re-indexing

---

## Quick Start (Standalone Entry Point)

This plan is self-contained. To implement this fix:

1. **Read this entire document** — it contains all context needed
2. **Run quality gates first**: `pnpm type-check && pnpm lint && pnpm test`
3. **Implement in phase order** (SDK first, then indexing, then query helpers)
4. **Write tests before code** (TDD)
5. **Re-index after code changes**: `pnpm --filter oak-search-cli ingest:all`

### Codebase Context

| Path | Purpose |
|------|---------|
| `packages/sdks/oak-curriculum-sdk/` | SDK with type-gen (types flow from here) |
| `packages/sdks/oak-curriculum-sdk/type-gen/` | Type generation code |
| `apps/oak-search-cli/` | Semantic search app |
| `apps/.../src/adapters/` | Bulk data transformers |
| `apps/.../src/lib/indexing/` | Document builders for ES |
| `apps/.../src/lib/hybrid-search/` | Query construction |

### Key Files to Understand First

1. `apps/.../src/adapters/bulk-transform-helpers.ts` — Contains `normaliseSubjectSlug()` (the problem)
2. `apps/.../src/lib/indexing/lesson-document-core.ts` — Document builder (where fix lands)
3. `apps/.../src/lib/hybrid-search/rrf-query-helpers.ts` — Query filters (smart filtering)
4. `docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md` — ADR with correct design

---

## The Problem

ADR-101 specifies a subject hierarchy design where:

- `subject_slug` = the actual subject (e.g., `physics`, `chemistry`, `biology`)
- `subject_parent` = the parent subject for hierarchical filtering (e.g., `science`)

**However, the current implementation does not match the ADR.**

### Current (Incorrect) Implementation

```text
bulk-lesson-transformer.ts:
  normalisedSubject = normaliseSubjectSlug(lesson.subjectSlug)
                    = "combined-science" → "science"  ← LOSES ORIGINAL VALUE

lesson-document-core.ts:
  subject_slug: subjectSlug        = "science"  ← ALREADY NORMALISED
  subject_parent: subjectSlug      = "science"  ← SAME AS subject_slug
```

**Result**: Both fields contain "science". The original subject (physics/chemistry/biology/combined-science) is **lost**.

### Correct (ADR-101) Design

```text
bulk-lesson-transformer.ts:
  originalSubject = lesson.subjectSlug           = "physics"
  parentSubject = SUBJECT_TO_PARENT[...]         = "science"

lesson-document-core.ts:
  subject_slug: originalSubject    = "physics"  ← PRESERVED
  subject_parent: parentSubject    = "science"  ← FROM LOOKUP TABLE
```

**Result**: Both fields have different values. Filtering on `subject_parent: science` returns all science. Filtering on `subject_slug: physics` returns only physics.

---

## Impact

| Query | Current Result | Expected Result |
|-------|---------------|-----------------|
| Filter: `science` at secondary | All science (KS3 + KS4 variants) | All science ✓ |
| Filter: `physics` at KS4 | **Nothing** (no physics in index) | Only physics ❌ |
| Filter: `chemistry` at KS4 | **Nothing** | Only chemistry ❌ |
| Filter: `biology` at KS4 | **Nothing** | Only biology ❌ |
| Filter: `combined-science` at KS4 | **Nothing** | Only combined-science ❌ |

**Blocked Ground Truths**: 11 KS4 science queries cannot be created until this is fixed.

---

## Solution Overview

### The Key Insight: Single Subject Input, Smart Filtering

Users (UI/CLI/API) specify ONE subject value. Both `science` and `physics` are valid inputs at any key stage. The system decides which ES field to filter on based on context.

| User Input | Key Stage | Filter Applied | Rationale |
|------------|-----------|----------------|-----------|
| `physics` | KS4 | `subject_slug: physics` | Physics exists at KS4 |
| `physics` | KS3 | `subject_parent: science` | No physics at KS3, use parent |
| `physics` | KS2 | `subject_parent: science` | No physics at primary |
| `science` | any | `subject_parent: science` | Broad filter, catches all |
| `maths` | any | `subject_parent: maths` | Same as subject_slug |

### ES Document Structure (per ADR-101)

```typescript
{
  subject_slug: 'physics',      // Original value from curriculum
  subject_parent: 'science',    // Parent for hierarchical filtering
}
```

---

## Implementation

### Phase 1: SDK Type-Gen — Subject Hierarchy Lookup Tables

Add a hardcoded lookup in SDK type-gen that generates these exports:

```typescript
// packages/sdks/oak-curriculum-sdk/src/types/generated/search/subject-hierarchy.ts

/**
 * Maps every valid subject (including KS4 variants) to its parent subject.
 * Generated at SDK compile time from hardcoded domain knowledge.
 * 
 * For most subjects, parent === subject. Only science has children.
 */
export const SUBJECT_TO_PARENT = {
  // Science hierarchy
  'science': 'science',
  'physics': 'science',
  'chemistry': 'science',
  'biology': 'science',
  'combined-science': 'science',
  // All other subjects map to themselves
  'art': 'art',
  'citizenship': 'citizenship',
  'computing': 'computing',
  'cooking-nutrition': 'cooking-nutrition',
  'design-technology': 'design-technology',
  'english': 'english',
  'french': 'french',
  'geography': 'geography',
  'german': 'german',
  'history': 'history',
  'maths': 'maths',
  'music': 'music',
  'physical-education': 'physical-education',
  'religious-education': 'religious-education',
  'rshe-pshe': 'rshe-pshe',
  'spanish': 'spanish',
} as const;

/** All valid subject values (21 total: 17 canonical + 4 KS4 science variants) */
export const ALL_SUBJECTS = Object.keys(SUBJECT_TO_PARENT) as readonly AllSubjectSlug[];

/** Type for all valid subject slugs including KS4 variants */
export type AllSubjectSlug = keyof typeof SUBJECT_TO_PARENT;

/** Type for parent/canonical subjects only (the 17 from OpenAPI) */
export type ParentSubjectSlug = typeof SUBJECT_TO_PARENT[AllSubjectSlug];

/**
 * Maps parent subjects to all their children (including themselves).
 * Useful for understanding what subjects fall under a parent.
 */
export const PARENT_TO_SUBJECTS: Record<ParentSubjectSlug, readonly AllSubjectSlug[]> = {
  'science': ['science', 'physics', 'chemistry', 'biology', 'combined-science'],
  'art': ['art'],
  'citizenship': ['citizenship'],
  'computing': ['computing'],
  'cooking-nutrition': ['cooking-nutrition'],
  'design-technology': ['design-technology'],
  'english': ['english'],
  'french': ['french'],
  'geography': ['geography'],
  'german': ['german'],
  'history': ['history'],
  'maths': ['maths'],
  'music': ['music'],
  'physical-education': ['physical-education'],
  'religious-education': ['religious-education'],
  'rshe-pshe': ['rshe-pshe'],
  'spanish': ['spanish'],
} as const;

/** KS4 science variant subjects (children of 'science') */
export const KS4_SCIENCE_VARIANTS = ['physics', 'chemistry', 'biology', 'combined-science'] as const;
export type Ks4ScienceVariant = typeof KS4_SCIENCE_VARIANTS[number];

/** Check if a subject is a KS4 science variant */
export function isKs4ScienceVariant(subject: string): subject is Ks4ScienceVariant {
  return KS4_SCIENCE_VARIANTS.includes(subject as Ks4ScienceVariant);
}

/** Get parent subject for any subject */
export function getSubjectParent(subject: AllSubjectSlug): ParentSubjectSlug {
  return SUBJECT_TO_PARENT[subject];
}
```

### Phase 2: Update Indexing — Preserve Original Subject

#### Step 2a: Update CreateLessonDocParams

```typescript
// lesson-document-core.ts
export interface CreateLessonDocParams {
  readonly subjectSlug: AllSubjectSlug;      // Original: "physics"
  readonly subjectParent: ParentSubjectSlug; // Parent: "science"
  // ... rest unchanged
}
```

#### Step 2b: Update buildLessonDocument()

```typescript
// lesson-document-core.ts
export function buildLessonDocument(params: CreateLessonDocParams): SearchLessonsIndexDoc {
  return {
    subject_slug: params.subjectSlug,       // Original value
    subject_parent: params.subjectParent,   // From lookup table
    // ...
  };
}
```

#### Step 2c: Update Bulk Transformer

```typescript
// bulk-lesson-transformer.ts
import { SUBJECT_TO_PARENT, isKs4ScienceVariant } from '@oaknational/oak-curriculum-sdk';

const originalSubject = lesson.subjectSlug;
const subjectParent = SUBJECT_TO_PARENT[originalSubject] ?? originalSubject;

return buildLessonDocument({
  subjectSlug: originalSubject,   // Preserve original
  subjectParent: subjectParent,   // From SDK lookup
  // ...
});
```

### Phase 3: Update Query Helpers — Smart Filtering

```typescript
// rrf-query-helpers.ts
import { SUBJECT_TO_PARENT, isKs4ScienceVariant, type AllSubjectSlug } from '@oaknational/oak-curriculum-sdk';

export interface SearchFilterOptions {
  subject?: AllSubjectSlug;  // Accept any subject (including KS4 variants)
  keyStage?: KeyStage;
  // ...
}

export function createLessonFilters(options: SearchFilterOptions): QueryContainer[] {
  const filters: QueryContainer[] = [];
  
  if (options.subject) {
    // Determine which field to filter on based on subject and key stage
    const filterField = determineSubjectFilterField(options.subject, options.keyStage);
    const filterValue = filterField === 'subject_slug' 
      ? options.subject 
      : SUBJECT_TO_PARENT[options.subject];
    
    filters.push({ term: { [filterField]: filterValue } });
  }
  
  // ... other filters
  return filters;
}

/**
 * Determines which ES field to use for subject filtering.
 * 
 * - KS4 science variant at KS4 → use subject_slug (specific)
 * - KS4 science variant at other KS → use subject_parent (no specific content exists)
 * - Parent subject at any KS → use subject_parent (broad)
 * - Non-science subject → use subject_parent (same as subject_slug)
 */
function determineSubjectFilterField(
  subject: AllSubjectSlug, 
  keyStage?: KeyStage
): 'subject_slug' | 'subject_parent' {
  // If it's a KS4 science variant AND we're filtering at KS4, use specific field
  if (isKs4ScienceVariant(subject) && keyStage === 'ks4') {
    return 'subject_slug';
  }
  // Otherwise, always use parent (broad matching)
  return 'subject_parent';
}
```

### Phase 4: Re-Index

After all code changes pass quality gates:

```bash
# Verify quality gates pass
pnpm type-check && pnpm lint && pnpm test

# Re-generate SDK types (includes new subject hierarchy)
pnpm --filter @oaknational/oak-curriculum-sdk type-gen

# Re-index all content with correct subject values
pnpm --filter oak-search-cli ingest:all
```

---

## Verification Plan

### Unit Tests

1. `SUBJECT_TO_PARENT['physics']` returns `'science'`
2. `SUBJECT_TO_PARENT['maths']` returns `'maths'`
3. `isKs4ScienceVariant('physics')` returns `true`
4. `isKs4ScienceVariant('maths')` returns `false`
5. `determineSubjectFilterField('physics', 'ks4')` returns `'subject_slug'`
6. `determineSubjectFilterField('physics', 'ks3')` returns `'subject_parent'`
7. `determineSubjectFilterField('science', 'ks4')` returns `'subject_parent'`

### Integration Tests

1. ES documents have distinct `subject_slug` and `subject_parent` for KS4 physics lessons
2. Filter `subject: physics, keyStage: ks4` returns only physics lessons
3. Filter `subject: physics, keyStage: ks3` returns all science lessons (via parent)
4. Filter `subject: science` returns all science (KS3 + all KS4 variants)

### Ground Truth Validation

After re-indexing, verify with a manual search:

```bash
# In apps/oak-search-cli
pnpm dev

# Then test these queries (via API or benchmark):
# 1. subject=science, keyStage=ks4 → should return physics + chemistry + biology + combined-science lessons
# 2. subject=physics, keyStage=ks4 → should return ONLY physics lessons
# 3. subject=physics, keyStage=ks3 → should return all KS3 science lessons (via parent)
```

---

## Success Criteria

| Criterion | How to Verify |
|-----------|---------------|
| SDK exports `SUBJECT_TO_PARENT` | Import works: `import { SUBJECT_TO_PARENT } from '@oaknational/oak-curriculum-sdk'` |
| ES documents have correct values | Query ES: physics lesson has `subject_slug: physics`, `subject_parent: science` |
| `science` filter returns all science | Search with `subject=science` returns KS3 science + KS4 variants |
| `physics` filter at KS4 is specific | Search with `subject=physics, keyStage=ks4` returns only physics |
| `physics` filter at KS3 uses parent | Search with `subject=physics, keyStage=ks3` returns all KS3 science |
| All quality gates pass | `pnpm type-check && pnpm lint && pnpm test` exits 0 |

---

## Files to Modify

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/` | Add subject hierarchy generator |
| `packages/sdks/oak-curriculum-sdk/src/types/generated/search/` | Generated output location |
| `apps/.../src/lib/indexing/lesson-document-core.ts` | Accept separate `subjectParent` param |
| `apps/.../src/lib/indexing/unit-document-core.ts` | Same changes for units |
| `apps/.../src/adapters/bulk-lesson-transformer.ts` | Use SDK lookup, pass both values |
| `apps/.../src/adapters/bulk-unit-transformer.ts` | Use SDK lookup, pass both values |
| `apps/.../src/adapters/bulk-transform-helpers.ts` | Remove `normaliseSubjectSlug()` usage |
| `apps/.../src/lib/hybrid-search/rrf-query-helpers.ts` | Smart filtering logic |
| `apps/.../src/adapters/sdk-guards.ts` | Update `isSubject()` to accept all subjects |

---

## Benefits of This Approach

1. **Single subject input** — UI/CLI/API users specify one value, system handles complexity
2. **All subjects valid everywhere** — `physics` is valid at KS2 (maps to parent)
3. **SDK-generated lookup** — Types flow from SDK, available to all consumers
4. **`science` continues to work** — This is a new system where `science` correctly returns all science content (KS3 + all KS4 variants)
5. **Future-proof** — If other subjects get KS4 variants, add to lookup table

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md) | Subject hierarchy design (correct intent) |
| [ADR-080](../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) | KS4 denormalisation strategy |
| [ground-truth-redesign-plan.md](ground-truth-redesign-plan.md) | Lists this as a blocker |
| [queries-redesigned.md](../../../apps/oak-search-cli/docs/ground-truths/queries-redesigned.md) | 11 blocked KS4 science queries |
