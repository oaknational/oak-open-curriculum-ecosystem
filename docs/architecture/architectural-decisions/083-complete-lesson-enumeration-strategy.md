# ADR-083: Complete Lesson Enumeration Strategy

**Status**: Accepted  
**Date**: 2025-12-20  
**Deciders**: Development Team  
**Related**: [ADR-069](069-systematic-ingestion-progress-tracking.md), [ADR-067](067-sdk-generated-elasticsearch-mappings.md)

## Context

During search quality analysis (December 2025), we discovered that our ingestion was indexing only ~314 lessons for Maths KS4 when there should be ~650+ lessons. Investigation revealed:

1. **Ingestion derived lessons from the wrong data source**
2. **~52% of lessons were missing** from the search index
3. **All MRR metrics were measured against an incomplete index**

### Root Cause Investigation

We examined the upstream Oak API code (`reference/oak-openapi/`) and identified the architectural reason:

#### Unit Summary Endpoint

The `/units/{unit}/summary` endpoint:

- Uses `sequenceView` (a materialized view: `published_mv_curriculum_sequence_b_13_0_17`)
- The `lessons` field is a **JSON array embedded in the sequence record**
- This is a **denormalised snapshot** created when the view is materialised
- The snapshot is **truncated** — designed for quick overview, not complete enumeration

```text
Unit Summary → sequenceView.lessons[] → TRUNCATED (2 lessons for algebraic-fractions)
```

#### Lessons Endpoint

The `/key-stages/{ks}/subject/{subject}/lessons` endpoint:

- Uses `unitVariantLessonsView` (a different materialized view: `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0`)
- This is a **normalised, flattened view** with one row per lesson-unit variant
- Supports proper pagination via GraphQL `offset` and `limit`
- Returns **complete data** when paginated fully

```text
Lessons Endpoint → unitVariantLessonsView → COMPLETE (10 lessons for algebraic-fractions)
```

### The Historical Misunderstanding

Our codebase contained comments suggesting the lessons endpoint was abandoned because of "pagination limits":

> "This replaces the previous approach of fetching lesson groups from the `/key-stages/{ks}/subject/{subject}/lessons` endpoint, which only returns a paginated subset of lessons (limit 100)."

This reasoning was **inverted**:

- The lessons endpoint IS paginated but returns **complete data** when exhausted
- The unit summary is NOT paginated but returns **truncated data**

## Decision

### 1. Use Paginated Lessons Endpoint for Complete Enumeration

Change the ingestion flow from:

```text
❌ CURRENT: /units → /units/{slug}/summary → unitLessons[] (TRUNCATED)
```

To:

```text
✅ CORRECT: /key-stages/{ks}/subject/{subject}/lessons (with pagination) → COMPLETE
```

### 2. Aggregate Lesson-Unit Relationships, Do Not Simply Deduplicate

**Critical nuance**: Lessons can legitimately belong to multiple units, tiers, and programmes. The `unitVariantLessonsView` returns one row per **(lesson, unit variant)** pair.

When building lesson documents:

1. **Index each unique lesson ONCE** by `lessonSlug`
2. **Aggregate all unit relationships** — collect ALL units a lesson belongs to
3. **Preserve tier/programme context** — don't discard variant information

```typescript
// WRONG: Simple deduplication
const uniqueLessons = new Set(lessons.map((l) => l.lessonSlug));

// CORRECT: Aggregate by lessonSlug, collect all units
const lessonMap = new Map<
  string,
  {
    lessonSlug: string;
    lessonTitle: string;
    units: Set<string>; // All units this lesson belongs to
    // ... other aggregated metadata
  }
>();

for (const row of lessons) {
  const existing = lessonMap.get(row.lessonSlug);
  if (existing) {
    existing.units.add(row.unitSlug);
  } else {
    lessonMap.set(row.lessonSlug, {
      lessonSlug: row.lessonSlug,
      lessonTitle: row.lessonTitle,
      units: new Set([row.unitSlug]),
    });
  }
}
```

### 3. Keep Unit Summaries for Unit-Level Metadata

Unit summaries (`/units/{slug}/summary`) remain valuable for:

- Unit descriptions and why-this-why-now
- Thread associations
- Prior knowledge requirements
- National curriculum statements

The fix is about **lesson enumeration**, not replacing unit data entirely.

### 4. Pagination Strategy

Exhaust the lessons endpoint with:

- `limit=100` per page
- Increment `offset` until empty response
- Deduplicate within pages (API may return same lesson across tier variants)

```typescript
async function fetchAllLessons(
  client: OakClient,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
): Promise<Map<string, AggregatedLesson>> {
  const lessonMap = new Map<string, AggregatedLesson>();
  let offset = 0;
  const limit = 100;

  while (true) {
    const response = await client.getLessonsByKeyStageAndSubject(keyStage, subject, {
      limit,
      offset,
    });
    if (response.length === 0) break;

    // Aggregate by lessonSlug
    for (const unitGroup of response) {
      for (const lesson of unitGroup.lessons) {
        const existing = lessonMap.get(lesson.lessonSlug);
        if (existing) {
          existing.unitSlugs.add(unitGroup.unitSlug);
        } else {
          lessonMap.set(lesson.lessonSlug, {
            lessonSlug: lesson.lessonSlug,
            lessonTitle: lesson.lessonTitle,
            unitSlugs: new Set([unitGroup.unitSlug]),
          });
        }
      }
    }

    offset += limit;
  }

  return lessonMap;
}
```

## Rationale

### Why Not Fix Unit Summary?

The upstream API's design is intentional:

- `sequenceView` is optimised for **quick unit overview** (not lesson enumeration)
- `unitVariantLessonsView` is designed for **complete lesson access**

This is not a bug — it's a data access pattern we were using incorrectly.

### Why Aggregate Instead of Just Deduplicate?

A lesson appearing in multiple units is **semantically meaningful**:

- Search should know ALL units where a lesson appears
- Unit rollups should include lessons even if they appear elsewhere
- The `unit_ids[]` field on lesson documents should be complete

Simple deduplication (keeping first occurrence) would incorrectly drop unit relationships.

### Why Still Use Unit Summaries?

Unit-level metadata (description, threads, curriculum statements) is valuable and only available from unit summaries. The fix specifically targets **lesson enumeration**, not unit metadata.

## Consequences

### Positive

- ✅ **Complete Data**: All ~650+ Maths KS4 lessons will be indexed (vs. 314)
- ✅ **Accurate Metrics**: MRR measurements against complete index
- ✅ **Correct Relationships**: Lesson documents include ALL unit associations
- ✅ **Future-Proof**: Pagination handles any data growth

### Negative

- ⚠️ **More API Calls**: Requires paginating (7 calls vs. 0 for lessons)
- ⚠️ **Refactoring Needed**: `deriveLessonGroupsFromUnitSummaries` must be replaced
- ⚠️ **Re-indexing Required**: Full re-ingestion after fix

### Neutral

- ℹ️ **Unit Summaries Unchanged**: Still used for unit-level metadata
- ℹ️ **Existing Code Still Works**: Just with wrong data source

## Implementation Notes

### Files to Modify

1. `apps/oak-open-curriculum-semantic-search/src/lib/index-oak-helpers.ts`
   - Replace `deriveLessonGroupsFromUnitSummaries` call
   - Add `fetchAllLessons` pagination function

2. `apps/oak-open-curriculum-semantic-search/src/lib/indexing/index-bulk-helpers.ts`
   - Update or remove `deriveLessonGroupsFromUnitSummaries`
   - Add aggregation logic for lesson-unit relationships

3. `apps/oak-open-curriculum-semantic-search/src/adapters/oak-adapter-sdk.ts`
   - Ensure `getLessonsByKeyStageAndSubject` supports pagination parameters

### TDD Approach

1. **RED**: Write integration test that asserts `algebraic-fractions` returns 8+ lessons
2. **GREEN**: Implement pagination and aggregation
3. **REFACTOR**: Clean up old `deriveLessonGroupsFromUnitSummaries` approach

### Verification

After implementation:

```bash
# Re-index with corrected source
pnpm es:ingest-live -- --subject maths --keystage ks4

# Verify complete data
pnpm es:status
# Expected: oak_lessons: ~650+ (was: 314)

# Re-measure MRR baseline
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

## Related Work

- **Upstream Wishlist**: Added request for documentation of `unitLessons` truncation
- **ADR-082**: This fix supports the Fundamentals-First strategy by ensuring complete data
- **ADR-069**: Systematic ingestion will re-ingest with corrected source

## Update: Bulk Download as Alternative Enumeration Source (2025-12-30)

**See ADR-093**: The bulk download (`reference/bulk_download_data/`) provides an alternative complete lesson enumeration source that avoids API pagination entirely:

| Source              | Lessons | Pagination         | Notes                           |
| ------------------- | ------- | ------------------ | ------------------------------- |
| **Bulk Download**   | ~12,783 | None (local files) | Missing tier info, unit options |
| **API (paginated)** | ~12,316 | Required           | 5 lessons missing due to bug    |

The bulk-first approach (ADR-093) uses bulk download for enumeration, with API only for supplementary structural data (tier info, unit options).

## References

- Upstream API code: `reference/oak-openapi/src/lib/handlers/units/units.ts`
- Upstream API code: `reference/oak-openapi/src/lib/handlers/keyStageSubjectLessons/keyStageSubjectLessons.ts`
- Materialized views: `sequenceView` vs `unitVariantLessonsView` in `reference/oak-openapi/src/lib/owaClient.ts`
- API Wishlist: `.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md`

---

**Decision Made By**: Development Team  
**Date**: 2025-12-20  
**Review Date**: 2026-06-20 (or when ingestion patterns change significantly)
