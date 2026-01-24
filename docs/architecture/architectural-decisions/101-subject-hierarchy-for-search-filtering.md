# ADR-101: Subject Hierarchy for Search Filtering

## Status

Accepted and Implemented (2026-01-22)

## Context

[ADR-080](./080-curriculum-data-denormalization-strategy.md) documents the comprehensive KS4 denormalisation strategy, including how Science KS4 fragments into exam subjects (biology, chemistry, physics, combined-science) at the **ingestion** level. The ingestion pipeline correctly stores these lessons with their actual `subject_slug` values.

However, during ground truth evaluation (2026-01-22), we discovered a **search filtering gap**:

### The Problem

When users or the benchmark search for "science" at secondary level, the query creates:

```json
{ "term": { "subject_slug": "science" } }
```

This **only matches KS3 Science lessons** because:

| Subject Slug       | Key Stage | Matched by `subject_slug: science`? |
| ------------------ | --------- | ----------------------------------- |
| `science`          | KS3       | ✓ Yes                               |
| `physics`          | KS4       | ✗ No — filtered out                 |
| `chemistry`        | KS4       | ✗ No — filtered out                 |
| `biology`          | KS4       | ✗ No — filtered out                 |
| `combined-science` | KS4       | ✗ No — filtered out                 |

### Evidence

From Science Secondary ground truth evaluation:

- **39 expected slugs** in ground truths
- **22 slugs** (56%) have `subject_slug: science` — found
- **17 slugs** (44%) have other subjects — **filtered out**

Example: Query "what makes things hot or cold" returned MRR 0.000 because expected slugs `thermal-conduction-and-insulation` and `heating-different-substances` have `subject_slug: physics`.

### User Mental Model Mismatch

A teacher searching for "thermal conduction" in "Science" at secondary level expects to find physics lessons. The index correctly stores the data, but the search filter doesn't capture the hierarchical relationship.

### Existing Domain Knowledge

The codebase already contains this hierarchy mapping:

```typescript
// apps/oak-open-curriculum-semantic-search/src/adapters/bulk-transform-helpers.ts
const BULK_SUBJECT_TO_API_SUBJECT: Readonly<Record<string, string>> = {
  'combined-science': 'science',
  biology: 'science',
  chemistry: 'science',
  physics: 'science',
};
```

This is used for API normalisation but **not for search enrichment**.

## Decision

### Add `subject_parent` Field at Index Time

Enrich lesson and unit documents with a `subject_parent` field computed at index time:

```typescript
interface LessonDocument {
  // Existing field - actual subject
  subject_slug: string; // e.g., "physics"

  // NEW - parent subject for hierarchical search
  subject_parent: string; // e.g., "science"
}
```

### Population Logic

```typescript
function computeSubjectParent(subjectSlug: string): string {
  const SUBJECT_PARENT_MAP: Record<string, string> = {
    'combined-science': 'science',
    biology: 'science',
    chemistry: 'science',
    physics: 'science',
  };
  return SUBJECT_PARENT_MAP[subjectSlug] ?? subjectSlug;
}
```

For most subjects, `subject_parent === subject_slug`. Only Science KS4 variants have a different parent.

### Search Filter Update

When searching for "science" at secondary level, use `subject_parent`:

```json
{
  "bool": {
    "filter": [
      { "term": { "subject_parent": "science" } },
      { "terms": { "key_stage": ["ks3", "ks4"] } }
    ]
  }
}
```

This matches:

- KS3 Science lessons (`subject_slug: science`, `subject_parent: science`)
- KS4 Physics lessons (`subject_slug: physics`, `subject_parent: science`)
- KS4 Chemistry lessons (`subject_slug: chemistry`, `subject_parent: science`)
- etc.

### Why Index-Time Enrichment?

Following Elasticsearch idioms ([ADR-080](./080-curriculum-data-denormalization-strategy.md)):

| Option                            | Pros                                      | Cons                                                        |
| --------------------------------- | ----------------------------------------- | ----------------------------------------------------------- |
| **Query-time expansion**          | No re-index                               | Domain knowledge scattered; every consumer needs workaround |
| **Index-time `subject_parent`** ✓ | Centralised; simple queries; ES idiomatic | Requires re-index                                           |
| **Ground truth restriction**      | No changes                                | Limits test coverage; defeats purpose                       |

**Compute once at index time, query simply forever.**

## Relationship to Maths KS4

Maths KS4 has a **different** type of complexity:

| Subject | KS4 Complexity                                   | Field                  |
| ------- | ------------------------------------------------ | ---------------------- |
| Science | Subject fragments into physics/chemistry/biology | `subject_parent` (new) |
| Maths   | Tiers within same subject (foundation/higher)    | `tiers[]` (existing)   |

Maths does **not** have subject fragmentation — `subject_slug` remains `maths` at KS4. The `tiers` array field (already implemented per ADR-080) handles Maths KS4 complexity.

This ADR addresses Science-specific subject hierarchy. No changes needed for Maths.

## Implementation

### Phase 1: Schema Enhancement

1. Add `subject_parent` to ES mapping (`keyword` type)
2. Update `SearchLessonsIndexDoc` type
3. Update document builder to compute `subject_parent`

### Phase 2: Query Enhancement

1. Update `createLessonFilters()` to use `subject_parent` when appropriate
2. Update benchmark request builder for science secondary

### Phase 3: Re-Index

Run full ingestion to populate `subject_parent` for all lessons.

### Phase 4: Validation

Verify Science secondary ground truths now pass.

## Consequences

### Positive

1. **User mental model preserved** — "Science" search finds physics/chemistry/biology
2. **Domain knowledge centralised** — Hierarchy defined once at index time
3. **Query layer stays thin** — No special-casing in every consumer
4. **Builds on existing pattern** — Same approach as tier denormalisation in ADR-080
5. **Ground truths become valid** — Science secondary 44% exclusion fixed

### Negative

1. **Requires re-index** — One-time operation
2. **Additional field** — Minimal storage increase (keyword field)

### Neutral

1. **Most subjects unaffected** — `subject_parent === subject_slug` for 16 of 17 subjects
2. **Backwards compatible** — `subject_slug` still available for specific filtering

## Related Decisions

- [ADR-080](./080-curriculum-data-denormalization-strategy.md) — Comprehensive KS4 denormalisation (parent ADR)
- [ADR-067](./067-sdk-generated-elasticsearch-mappings.md) — SDK-generated ES mappings
- [ADR-089](./089-index-everything-principle.md) — Index-time enrichment philosophy

## Implementation

**Completed**: 2026-01-22

See: [subject-hierarchy-enhancement.md](../../../.agent/plans/semantic-search/archive/completed/subject-hierarchy-enhancement.md)

### Files Modified

| File                                                                                       | Change                                               |
| ------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/field-definitions/curriculum.ts` | Added `subject_parent` field definition              |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/lesson-document-core.ts`        | Compute `subject_parent` at build time               |
| `apps/oak-open-curriculum-semantic-search/src/lib/indexing/unit-document-core.ts`          | Compute `subject_parent` at build time               |
| `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts`      | Filter by `subject_parent` instead of `subject_slug` |

### Verification

Post-ingestion benchmark confirmed filtering works correctly:

- All 12 science secondary queries return science content
- Remaining quality gaps are search ranking issues, not filtering issues
