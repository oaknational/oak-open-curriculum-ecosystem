# Efficient API Traversal

**Status**: 📋 PENDING — Next priority before ingestion
**Priority**: HIGH — Blocking ingestion
**Parent**: [roadmap.md](../roadmap.md)
**Created**: 2025-12-29
**Principle**: Make as few API calls as possible; use bulk endpoints; analyse before fetching

---

## Problem Statement

The current ingestion pipeline makes unnecessary API calls:

1. **Transcript fetch without video check** — We call `/lessons/{lesson}/transcript` for every lesson, even those without videos. Computing lessons are known to lack videos, causing many 404s.

2. **Per-lesson API calls** — We fetch transcript + summary per lesson, but bulk endpoints exist that could reduce call count.

3. **No progressive analysis** — We don't analyse metadata from earlier stages to inform later fetches.

---

## Key Insight from OpenAPI Schema

The API provides **bulk endpoints** that return data for multiple lessons at once:

| Endpoint | Returns | Use Case |
| -------- | ------- | -------- |
| `/key-stages/{ks}/subject/{subject}/assets` | All assets for all lessons in subject/keystage | Check video availability for entire subject |
| `/sequences/{sequence}/assets` | All assets for all lessons in sequence | Check video availability for sequence |
| `/lessons/{lesson}/assets` | Assets for one lesson | Fallback for individual check |

The `assets` response includes `type: "video"` for lessons with videos:

```json
{
  "assets": [
    { "type": "video", "label": "Video", "url": "..." },
    { "type": "worksheet", "label": "Worksheet", "url": "..." }
  ]
}
```

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

## Implementation Plan

### Phase 1: Add `getLessonAssets` to OakClient

1. Add method to `oak-adapter-types.ts`:

```typescript
readonly getLessonAssetsBySubjectAndKeystage: (
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
) => Promise<Result<SubjectAssetsResponse, SdkFetchError>>;
```

2. Implement in `sdk-api-methods.ts` using SDK method

### Phase 2: Build Video Availability Map

Create helper in `src/lib/indexing/video-availability.ts`:

```typescript
interface VideoAvailabilityMap {
  readonly hasVideo: (lessonSlug: string) => boolean;
  readonly totalLessons: number;
  readonly lessonsWithVideo: number;
}

export async function buildVideoAvailabilityMap(
  client: OakClient,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
): Promise<VideoAvailabilityMap>
```

### Phase 3: Update Ingestion to Use Map

Modify `lesson-materials.ts` to accept `hasVideo` predicate:

```typescript
export async function fetchLessonMaterials(
  client: OakClient,
  lessonSlug: string,
  context?: FetchContext,
  hasVideo?: boolean, // NEW: if false, skip transcript fetch
): Promise<{ transcript: string; summary: SearchLessonSummary } | null>
```

### Phase 4: Integrate into Ingestion Pipeline

Update `index-oak-helpers.ts` to:
1. Call `buildVideoAvailabilityMap` once per subject/keystage
2. Pass `hasVideo` to each lesson's material fetch
3. Log video availability statistics

---

## Expected Benefits

| Metric | Current | After | Improvement |
| ------ | ------- | ----- | ----------- |
| API calls for computing KS4 | ~528 transcript + 528 summary | 1 bulk assets + 528 summary | **~50% reduction** |
| 404 errors | Many | Zero | **100% reduction** |
| Cache pollution | 404s cached | No 404 caching needed | Cleaner cache |

---

## Acceptance Criteria

- [ ] `buildVideoAvailabilityMap` function implemented with tests
- [ ] Ingestion uses bulk assets endpoint before per-lesson fetches
- [ ] Transcript fetch skipped for lessons without video
- [ ] Logging shows video availability statistics per subject
- [ ] No regression in lesson document quality
- [ ] Quality gates passing

---

## Related Documents

- [complete-data-indexing.md](./complete-data-indexing.md) — Ingestion plan (depends on this)
- [ADR-066](../../../../docs/architecture/architectural-decisions/066-sdk-response-caching.md) — SDK caching (affected by this)
- OpenAPI Schema: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json`

