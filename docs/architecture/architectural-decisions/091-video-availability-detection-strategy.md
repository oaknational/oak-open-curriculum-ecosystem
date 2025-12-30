# ADR-091: Video Availability Detection Strategy

**Status**: Superseded by ADR-093 (Bulk-First Ingestion)  
**Date**: 2025-12-29  
**Superseded**: 2025-12-30  
**Related**: ADR-088 (Result Pattern), ADR-083 (Complete Lesson Enumeration), ADR-093 (Bulk-First Ingestion)

> ⚠️ **NOTE**: This ADR describes an optimization that is **no longer needed** with the bulk-first ingestion strategy (ADR-093). The bulk download contains transcripts directly, eliminating the need to pre-check video availability. The code in `video-availability.ts` can be removed.

## Context

During implementation of the "Efficient API Traversal" plan, we attempted to use the bulk assets endpoint (`/key-stages/{ks}/subject/{subject}/assets`) to pre-determine which lessons have videos, avoiding unnecessary transcript fetch attempts.

### The Problem

The assets endpoint returned only **15-35%** of lessons for non-maths subjects:

| Subject   | Key Stage | Assets Endpoint | Expected     | Coverage |
| --------- | --------- | --------------- | ------------ | -------- |
| Art       | KS2       | 36 lessons      | 102 lessons  | 35%      |
| Computing | KS3       | 60 lessons      | ~116 lessons | ~52%     |

### Root Cause Investigation

Analysis of the upstream API code (`reference/oak-openapi/src/lib/queryGate.ts`) revealed this is **intentional filtering**, not a bug:

```typescript
// Third Party Content (TPC) license audit filter
const supportedSubjects = ['maths']; // Only maths fully cleared

// Lessons only returned if:
// 1. Subject is 'maths' (fully TPC-cleared), OR
// 2. Unit is in supportedUnits.json (213 units cleared), OR
// 3. Lesson is in supportedLessons.json (4,559 lessons cleared)
```

**Key insight**: The assets endpoint returns lessons **cleared for asset download**, not all lessons with assets. A lesson may have video content but not yet have TPC clearance for its downloadable assets.

### Comparison with Other Data Issues

This is **distinct from** the materialized view issues:

| Issue                        | Root Cause                 | Intentional?                   |
| ---------------------------- | -------------------------- | ------------------------------ |
| Unit summary truncation      | Materialized view snapshot | Unclear (likely design choice) |
| Pagination missing 5 lessons | View filtering bug         | No (bug)                       |
| Assets endpoint incomplete   | TPC license filter         | **Yes** (correct behavior)     |

## Decision

### Strategy: Safe Default for Unknown Lessons

The `hasVideo()` function returns a **tri-state** value:

```typescript
interface VideoAvailabilityMap {
  hasVideo: (lessonSlug: string) => boolean | undefined;
  // Returns:
  // - true:  Lesson is in assets response WITH video asset
  // - false: Lesson is in assets response WITHOUT video asset
  // - undefined: Lesson NOT in assets response (unknown)
}
```

**Usage in ingestion**:

```typescript
const hasVideo = videoMap?.hasVideo(lesson.lessonSlug);

if (hasVideo === false) {
  // Skip transcript fetch - lesson confirmed to have no video
} else {
  // Fetch transcript - either has video (true) or unknown (undefined)
}
```

### Rationale

1. **Avoid data loss**: Lessons not in assets response may have videos — we can't know from this endpoint alone
2. **Graceful degradation**: The optimization works for TPC-cleared content (primarily maths)
3. **No false positives**: We never skip a transcript fetch unless we're certain there's no video
4. **Correctness over efficiency**: Prefer extra API calls over missing transcript data

## Consequences

### Positive

- **Complete transcript data**: No transcripts missed due to TPC filtering
- **Correct semantics**: `undefined` means "we don't know" rather than "no video"
- **Works for maths**: Full optimization for the fully-cleared subject
- **Future-proof**: As more subjects get TPC clearance, optimization improves automatically

### Negative

- **Limited optimization scope**: Only ~35% efficiency gain for non-maths subjects
- **Extra API calls**: Most lessons still require individual transcript fetch attempts
- **404 errors for no-video lessons**: Still hit 404s for lessons without videos in non-cleared subjects

### Neutral

- **Upstream fix requested**: Added to wishlist for `hasVideo` boolean flag on lesson lists (Item 13)
- **TPC clearance progress**: As Oak clears more content, this optimization becomes more effective

## Implementation

### ~~Code Changes~~ — REMOVED (2025-12-30)

The following files have been **removed** as part of the bulk-first ingestion pivot:

1. ~~**`video-availability.ts`**~~ — **Deleted**
2. ~~**`video-availability.unit.test.ts`**~~ — **Deleted**
3. **`lesson-materials.ts`** — `hasVideo` parameter preserved but no longer used
4. **`index-oak-helpers.ts`** — Video availability fetching removed

The transcript optimization is no longer needed because bulk download data contains transcripts directly.

## Alternatives Considered

### Alternative 1: Assume No Video for Unknown Lessons

```typescript
hasVideo: (lessonSlug: string) => videoLessonSlugs.has(lessonSlug); // false for unknown
```

**Rejected**: Would skip transcript fetches for lessons that actually have videos, causing data loss.

### Alternative 2: Fetch All Transcripts (No Optimization)

Skip the assets endpoint entirely and fetch transcripts for all lessons.

**Rejected**: Wasteful for maths (fully cleared) and loses optimization opportunity.

### Alternative 3: Wait for Upstream Fix

Delay implementation until API provides complete video availability data.

**Rejected**: Unknown timeline; current approach works and is future-compatible.

## Related Documents

- [Efficient API Traversal Plan (ARCHIVED)](../../../.agent/plans/semantic-search/archive/completed/efficient-api-traversal.md)
- [ADR-093: Bulk-First Ingestion Strategy](./093-bulk-first-ingestion-strategy.md) — Supersedes this ADR
- [API Wishlist: Boolean Resource Flags](../../../.agent/plans/external/ooc-api-wishlist/05-medium-priority-requests.md#13-add-boolean-resource-flags-to-lesson-list-responses)
- [queryGate.ts](../../../reference/oak-openapi/src/lib/queryGate.ts) — Upstream TPC filtering
