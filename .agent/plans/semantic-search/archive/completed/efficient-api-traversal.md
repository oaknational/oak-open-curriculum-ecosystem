# Efficient API Traversal

**Status**: ✅ COMPLETE WITH LIMITATIONS — TPC filtering limits optimization scope (2025-12-29)
**Priority**: HIGH — Ingestion efficiency
**Parent**: [roadmap.md](../roadmap.md)
**Created**: 2025-12-29
**Updated**: 2025-12-29
**Principle**: Make as few API calls as possible; use bulk endpoints; analyse before fetching

---

## ROOT CAUSE DISCOVERY (2025-12-29)

### Assets Endpoint: Third Party Content (TPC) License Filtering

Investigation of the upstream API code (`reference/oak-openapi/src/lib/queryGate.ts`) revealed that the assets endpoint is **intentionally filtering** based on TPC license clearance:

```typescript
const supportedSubjects = ['maths'];  // Only maths fully TPC-cleared

// Lessons returned only if:
// 1. Subject is 'maths' (fully cleared), OR
// 2. Unit is in supportedUnits.json (213 units), OR
// 3. Lesson is in supportedLessons.json (4,559 lessons)
```

**This is NOT a bug** — it's correct license compliance behavior.

| Subject | Key Stage | Assets Endpoint | Actual Lessons | Coverage |
|---------|-----------|-----------------|----------------|----------|
| **Maths** | Any | ~100% | ~100% | **Full optimization** |
| Art | KS2 | 36 lessons | 102 lessons | ~35% (partial) |
| Computing | KS3 | 60 lessons | ~116 lessons | ~52% (partial) |

### Why This Matters

- **Maths**: Full video availability detection works — all lessons TPC-cleared
- **Other subjects**: Only ~35-52% coverage — cannot skip transcript fetches for unknown lessons

### Decision: Tri-State `hasVideo()` with Safe Default

See [ADR-091: Video Availability Detection Strategy](../../../../docs/architecture/architectural-decisions/091-video-availability-detection-strategy.md)

```typescript
hasVideo(lessonSlug): boolean | undefined
// true:  Lesson in assets response WITH video (skip transcript = safe)
// false: Lesson in assets response WITHOUT video (skip transcript = safe)  
// undefined: Lesson NOT in assets (unknown — FETCH transcript to be safe)
```

### Current Optimization Impact

| Subject | Optimization Level | Notes |
|---------|-------------------|-------|
| Maths | **HIGH** | Full TPC clearance — all video availability known |
| English units in supportedUnits.json | Medium | ~213 units cleared |
| Other subjects | Low | Only individual lessons in supportedLessons.json |

The optimization automatically improves as Oak completes more TPC audits.

---

## Problem Statement

The current ingestion pipeline makes unnecessary API calls:

1. **Transcript fetch without video check** — We call `/lessons/{lesson}/transcript` for every lesson, even those without videos. Computing lessons are known to lack videos, causing many 404s.

2. **Per-lesson API calls** — We fetch transcript + summary per lesson, but bulk endpoints exist that could reduce call count.

3. **No progressive analysis** — We don't analyse metadata from earlier stages to inform later fetches.

---

## Verified Insights from OpenAPI Schema (2025-12-29)

Analysis of `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` confirms:

### Bulk Endpoints Available

| Endpoint | Returns | Use Case |
| -------- | ------- | -------- |
| `/key-stages/{ks}/subject/{subject}/assets` | All assets for all lessons in subject/keystage | **PRIMARY** — Check video availability for entire subject |
| `/key-stages/{ks}/subject/{subject}/lessons` | All lessons grouped by unit (paginated, limit 100) | Already used for lesson enumeration |
| `/key-stages/{ks}/subject/{subject}/units` | All units for subject/keystage | Already used by pattern-aware traversal |
| `/sequences/{sequence}/assets` | All assets for all lessons in sequence | Alternative for sequence-based traversal |

### SubjectAssetsResponseSchema (Verified)

The `/key-stages/{ks}/subject/{subject}/assets` endpoint returns an array of:

```typescript
{
  lessonSlug: string;      // Lesson identifier
  lessonTitle: string;     // Human-readable title
  attribution?: string[];  // Third-party content attribution
  assets: Array<{
    type: "slideDeck" | "exitQuiz" | ... | "video" | "worksheet" | ...;
    label: string;
    url: string;
  }>;
}
```

**Key insight**: If `assets` array contains an entry with `type: "video"`, the lesson has a video and therefore a transcript.

### No Bulk Summary Endpoint

There is **no bulk lesson summary endpoint**. The `/lessons/{lesson}/summary` endpoint must be called per-lesson. This is acceptable because:

1. Redis caching already handles repeat fetches
2. Summary data is required for all lessons (cannot be skipped)

### Additional Cross-Reference Opportunity

The assets endpoint returns `lessonSlug` for every lesson with assets. This can serve as a **cross-reference** against the lessons endpoint to catch any lessons missed due to the upstream API bug (see ADR-083).

---

## Current Flow (Inefficient)

```text
For each subject/keystage:
  1. Fetch units (pattern-aware)
  2. Fetch lessons per unit
  3. For EACH lesson:
     a. Fetch transcript ← WASTEFUL if no video
     b. Fetch summary
     c. Index document
```

**Problem**: Steps 3a makes ~12,000 API calls, many returning 404 for no-video lessons.

---

## Proposed Flow (Efficient)

```text
For each subject/keystage:
  1. Fetch units (pattern-aware)
  2. Fetch lessons per unit
  3. Fetch assets for subject/keystage ← ONE bulk call
  4. Build hasVideo map: lessonSlug → boolean
  5. For EACH lesson:
     a. IF hasVideo[slug]: fetch transcript
     b. Fetch summary
     c. Index document
```

**Benefit**: Step 3 is ONE API call per subject/keystage instead of ~12,000 individual calls.

---

## Investigation Tasks

### Task 1: Audit Current API Call Patterns

Count current API calls during a dry-run ingestion:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:ingest-live --subject computing --keystage ks4 --verbose --dry-run 2>&1 | grep -c "Fetching"
```

Document:
- Total transcript fetches attempted
- 404 responses received
- Time spent on transcript fetches

### Task 2: Test Bulk Assets Endpoint

Call `/key-stages/ks4/subject/computing/assets` via MCP to verify:
- Does it return all lessons?
- Does the response include `type: "video"` for lessons with videos?
- Response size and latency

```
mcp_ooc-http-dev-local_get-key-stages-subject-assets
  keyStage: ks4
  subject: computing
```

### Task 3: Compare Lesson Counts

Verify bulk endpoint returns same lessons as per-unit traversal:
- Count lessons from bulk assets endpoint
- Count lessons from current ingestion
- Identify any discrepancies

### Task 4: Identify Other Bulk Opportunities

Review these endpoints for additional efficiency gains:

| Endpoint | Current Usage | Potential Optimization |
| -------- | ------------- | ---------------------- |
| `/sequences/{seq}/assets` | Unused | Bulk asset check for sequences |
| `/sequences/{seq}/questions` | Unused | Could avoid per-lesson quiz fetch |
| `/key-stages/{ks}/subject/{sub}/questions` | Unused | Bulk quiz data |

---

## Implementation Plan (TDD) — COMPLETE ✅

### Phase 1: Add `getSubjectAssets` to OakClient — COMPLETE ✅

**TDD Approach**: Write unit tests first for the API method factory.

1. Add type definition to `oak-adapter-types.ts`:

```typescript
/** Asset entry from subject assets endpoint. */
export interface SubjectAssetEntry {
  readonly lessonSlug: string;
  readonly lessonTitle: string;
  readonly assets: readonly { readonly type: string; readonly label: string; readonly url: string }[];
}

/** Fetches all assets for a subject/keystage. Returns Result per ADR-088. */
export type GetSubjectAssetsFn = (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
) => Promise<Result<readonly SubjectAssetEntry[], SdkFetchError>>;
```

2. Implement `makeGetSubjectAssets` in `sdk-api-methods.ts`
3. Add to `OakClient` interface in `oak-adapter.ts`
4. Add type guard in `sdk-guards.ts`

### Phase 2: Build Video Availability Map — COMPLETE ✅

**TDD Approach**: Write unit tests for pure map-building function first.

Created `src/lib/indexing/video-availability.ts`:

```typescript
/**
 * Video availability information for a subject/keystage.
 * Built from bulk assets endpoint data.
 */
export interface VideoAvailabilityMap {
  /** Check if a lesson has a video. */
  readonly hasVideo: (lessonSlug: string) => boolean;
  /** Total lessons in the assets response. */
  readonly totalLessons: number;
  /** Count of lessons with videos. */
  readonly lessonsWithVideo: number;
  /** All lesson slugs from assets endpoint (for cross-reference). */
  readonly lessonSlugs: ReadonlySet<string>;
}

/**
 * Builds video availability map from subject assets data.
 * Pure function - takes data, returns map.
 */
export function buildVideoAvailabilityMapFromAssets(
  assets: readonly SubjectAssetEntry[],
): VideoAvailabilityMap;

/**
 * Fetches assets and builds video availability map.
 * Orchestration function that calls the OakClient.
 */
export async function fetchVideoAvailabilityMap(
  client: OakClient,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
): Promise<Result<VideoAvailabilityMap, SdkFetchError>>;
```

### Phase 3: Update Ingestion to Use Map — COMPLETE ✅

**TDD Approach**: Update tests for `fetchLessonMaterials` first.

Modified `lesson-materials.ts`:

```typescript
export interface FetchContext {
  readonly keyStage?: KeyStage;
  readonly subject?: SearchSubjectSlug;
  readonly unitSlug?: string;
  readonly hasVideo?: boolean; // NEW: if false, skip transcript fetch
}
```

When `hasVideo` is explicitly `false`, transcript fetch is skipped entirely.

### Phase 4: Integrate into Ingestion Pipeline — COMPLETE ✅

Updated `index-oak-helpers.ts` to:
1. ✅ Call `fetchVideoAvailabilityMap` once per subject/keystage at start
2. ✅ Log video availability statistics
3. ✅ Pass `hasVideo` context to each lesson's material fetch
4. ✅ Log any discrepancies between assets and lessons endpoint counts
5. ✅ Graceful fallback if video availability fetch fails

---

## Expected Benefits

| Metric | Current | After | Improvement |
| ------ | ------- | ----- | ----------- |
| API calls for computing KS4 | ~528 transcript + 528 summary | 1 bulk assets + 528 summary | **~50% reduction** |
| 404 errors | Many | Zero | **100% reduction** |
| Cache pollution | 404s cached | No 404 caching needed | Cleaner cache |

---

## Acceptance Criteria

- [x] `getSubjectAssets` method added to OakClient with type guard
- [x] `buildVideoAvailabilityMapFromAssets` pure function with unit tests
- [x] `fetchVideoAvailabilityMap` orchestration function
- [x] `fetchLessonMaterials` updated to accept `hasVideo` in context
- [x] Ingestion pipeline calls `fetchVideoAvailabilityMap` once per subject/keystage
- [x] Transcript fetch skipped for lessons without video
- [x] Logging shows video availability statistics per subject
- [x] Cross-reference check logs any lesson count discrepancies
- [x] Graceful fallback if assets fetch fails
- [x] All quality gates passing (2025-12-29)

---

## Related Documents

- [complete-data-indexing.md](./complete-data-indexing.md) — Ingestion plan (depends on this)
- [ADR-066](../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) — SDK caching (affected by this)
- OpenAPI Schema: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

