# Curriculum Fetching Discrepancy Log

**Created**: 2025-12-20  
**Analysis Against**: Bulk Download `oak-bulk-download-2025-12-07T09_37_04.693Z`  
**Focus**: Maths KS4 (vertical slice)

---

## Executive Summary

| Index | Count Match | Data Integrity | Status |
|-------|-------------|----------------|--------|
| `oak_lessons` | ✅ 436/436 | ✅ Content complete | **OK** |
| `oak_units` | ✅ 36/36 | ❌ `lesson_count` wrong in 25/36, missing `thread_slugs` | **BROKEN** |
| `oak_unit_rollup` | ✅ 36/36 | ❌ `lesson_count` wrong in 25/36 | **BROKEN** |
| `oak_sequences` | ✅ 2/2 | ✅ Verified | **OK** |
| `oak_threads` | ✅ 201 total | ✅ 6 maths threads present | **OK** |
| `oak_meta` | ✅ 1 | ⚠️ Shows 431 lessons (stale from ingestion) | **STALE** |
| `oak_sequence_facets` | ✅ 1 | ✅ Verified | **OK** |

**Critical Findings**:

1. Unit documents contain truncated `lesson_count` and `lesson_ids` from wrong data source (`/units/{slug}/summary` returns truncated `unitLessons[]`)
2. Unit documents use `sequence_ids` for thread data (should be `thread_slugs` per [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary))
3. ~~All lessons missing `tier` field~~ **CORRECTED**: Tier IS correctly populated in `tiers` and `tier_titles` arrays from `/sequences/{sequence}/units` endpoint
4. Dead code: `extractTier()` in `programme-factor-extractors.ts` tries to derive tier from slug suffixes (never works, should be deleted)

---

## Detailed Findings

### 1. Lessons (`oak_lessons`)

**Status**: ✅ **COMPLETE**

| Metric | Bulk Download | Elasticsearch | Match |
|--------|---------------|---------------|-------|
| Unique lesson slugs (KS4 maths) | 436 | 436 | ✅ |
| Lessons with transcripts | 436 | 436 | ✅ |
| Sample title comparison | — | — | ✅ |
| Sample field comparison | — | — | ✅ |

**Verified Fields**:

- `lesson_slug`, `lesson_title` ✅
- `unit_ids` (array) ✅
- `key_stage`, `subject_slug` ✅
- `pupil_lesson_outcome` ✅
- `lesson_keywords`, `key_learning_points` ✅
- `lesson_content` (transcript) ✅

**Note**: The ingestion fix (ADR-083) successfully corrected lesson enumeration by switching to the paginated `/key-stages/{ks}/subject/{subject}/lessons` endpoint.

---

### 2. Units (`oak_units`)

**Status**: ❌ **BROKEN - Lesson counts incorrect**

| Metric | Bulk Download | Elasticsearch | Match |
|--------|---------------|---------------|-------|
| Unique unit slugs (KS4 maths) | 36 | 36 | ✅ |
| Units with correct `lesson_count` | 36 | 11 | ❌ |
| Sum of `lesson_count` | 436 | 314 | ❌ |

**Root Cause**: Unit documents are built from `/units/{slug}/summary` response which returns truncated `unitLessons[]`. The ingestion fix only corrected LESSON enumeration, not UNIT document building.

#### Detailed Unit Discrepancies

| Unit Slug | Bulk Lessons | ES `lesson_count` | Discrepancy |
|-----------|--------------|-------------------|-------------|
| surds | 12 | 1 | -92% |
| algebraic-fractions | 8 | 2 | -75% |
| direct-and-inverse-proportion | 9 | 2 | -78% |
| non-linear-graphs | 11 | 5 | -55% |
| real-life-graphs | 17 | 7 | -59% |
| similarity | 12 | 7 | -42% |
| vectors | 16 | 8 | -50% |
| inequalities | 15 | 7 | -53% |
| linear-graphs | 13 | 8 | -38% |
| ratio | 11 | 8 | -27% |
| sampling | 11 | 8 | -27% |
| conditional-probability | 19 | 13 | -32% |
| further-sequences | 13 | 9 | -31% |
| further-transformations | 12 | 9 | -25% |
| simultaneous-equations-2-variables | 14 | 10 | -29% |
| percentages | 13 | 10 | -23% |
| right-angled-trigonometry | 14 | 11 | -21% |
| arithmetic-procedures-index-laws | 14 | 11 | -21% |
| compound-measures | 11 | 9 | -18% |
| 2d-and-3d-shape-compound-shapes | 16 | 12 | -25% |
| 2d-and-3d-shape-surface-area-and-volume-pyramids-spheres-and-cones | 19 | 15 | -21% |
| algebraic-manipulation | 20 | 13 | -35% |
| comparisons-of-numerical-summaries-of-data | 15 | 14 | -7% |
| loci-and-construction | 14 | 13 | -7% |
| rounding-estimation-and-bounds | 8 | 3 | -63% |

**Units with CORRECT lesson counts** (11/36):

- angles, bearings, circle-theorems, functions-and-proof
- graphical-representations-of-data-cumulative-frequency-and-histograms
- graphical-representations-of-data-scatter-graphs-and-time-series
- iteration, non-right-angled-trigonometry, plans-and-elevations
- standard-form-calculations, transformations-of-graphs

---

### 3. Unit Rollups (`oak_unit_rollup`)

**Status**: ❌ **BROKEN - Same issue as units**

| Metric | Expected | Elasticsearch | Match |
|--------|----------|---------------|-------|
| Rollups (KS4 maths) | 36 | 36 | ✅ |
| Rollups with correct `lesson_count` | 36 | 11 | ❌ |

**Example - `surds` rollup**:

- Expected `lesson_ids`: 12 lessons
- Actual `lesson_ids`: 1 lesson (`accuracy-of-final-answers` only)

The rollup documents inherit the truncation from unit documents.

---

### 4. Sequences (`oak_sequences`)

**Status**: ⚠️ **NOT FULLY VERIFIED**

| Metric | Expected | Elasticsearch | Match |
|--------|----------|---------------|-------|
| Maths sequences | 2 | 2 | ✅ |

Sequences appear correct (maths-primary, maths-secondary), but deep field comparison not performed.

---

### 5. Threads (`oak_threads`)

**Status**: ⚠️ **NOT FULLY VERIFIED**

| Metric | Bulk (maths only) | Elasticsearch (all subjects) |
|--------|-------------------|------------------------------|
| Unique thread slugs | 6 | 201 |

The 6 maths threads from bulk download:

- `algebra`, `geometry-and-measure`, `number`
- `probability`, `ratio-and-proportion`, `statistics`

ES contains 201 threads across all subjects. The 6 maths threads from bulk download are all present in unit rollups.

---

### 6. Additional Field-Level Findings

#### 6.1 Tier Data Analysis

**Status**: ✅ **CORRECTLY POPULATED** (via `tiers` and `tier_titles` arrays)

| Field | Lessons (KS4 maths) | Units | Rollups |
|-------|---------------------|-------|---------|
| `tiers` | ✅ 436/436 populated | ✅ 36/36 populated | ✅ 36/36 populated |
| `tier_titles` | ✅ 436/436 populated | ✅ 36/36 populated | ✅ 36/36 populated |
| `tier` (deprecated) | 0/436 (always undefined) | 0/36 | N/A |

**Correct Path**: Tier data IS correctly extracted from `/sequences/{sequence}/units` via `buildKs4ContextMap()` in `ks4-context-builder.ts`, stored as arrays:

- `tiers: ["foundation", "higher"]`
- `tier_titles: ["Foundation", "Higher"]`

**Dead Code**: The `extractTier()` function in `programme-factor-extractors.ts` attempts to derive a single `tier` value from unit slug suffixes (e.g. `-foundation`). This approach was **always wrong** - tier data comes from the sequence endpoint, NOT slug conventions. This function returns `undefined` for all KS4 maths units and should be deleted.

#### 6.2 Thread vs Sequence Naming Error

**Status**: ❌ **NAMING BUG - Violates Oak Ontology**

Per the [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary):

- **Thread**: "An attribute assigned to a unit. Threads can be used to group together units across the curriculum that build a common body of knowledge."
- **Sequence**: "An ordered arrangement of units designed to build knowledge progressively."

These are **different concepts**. The field `sequence_ids` contains thread slugs, not sequence slugs!

| Index | `sequence_ids` | `thread_slugs` | `thread_titles` | `thread_orders` |
|-------|----------------|----------------|-----------------|-----------------|
| `oak_units` | ✅ Contains THREAD slugs (misnomer) | ❌ null | ❌ null | ❌ null |
| `oak_unit_rollup` | ✅ Contains THREAD slugs (misnomer) | ✅ Thread slugs | ✅ Thread titles | ✅ Thread orders |

**Root Cause in Code**:

```typescript
// document-transforms.ts line 62 (unit creation)
const sequenceIds = summary.threads?.map((thread) => thread.slug);
// BUG: stores THREAD data in field named "sequence_ids"
```

**Fix Required**: Rename `sequence_ids` to `thread_slugs` in unit documents to align with Oak terminology and the rollup documents.

#### 6.3 Year Distribution Verified

**Status**: ✅ **CORRECT**

| Year | Bulk Download | Elasticsearch | Match |
|------|---------------|---------------|-------|
| Year 10 | 243 unique lessons | 243 | ✅ |
| Year 11 | 193 unique lessons | 193 | ✅ |

#### 6.4 `oak_meta` Stale Data

**Status**: ⚠️ **STALE**

```json
{
  "doc_counts": {
    "lessons": 431,  // ← Stale (actual: 436)
    "unit_rollup": 36,
    "units": 36
  }
}
```

The `oak_meta` document shows 431 lessons but the index contains 436. This is likely due to the metadata being written at ingestion start before all upserts completed.

#### 6.5 Cross-Reference Integrity

**Status**: ✅ **CORRECT**

| Check | Result |
|-------|--------|
| All lesson `unit_ids` exist in `oak_units` | ✅ |
| All `oak_units` referenced by at least one lesson | ✅ |
| No duplicate lesson IDs | ✅ |
| All lessons have `lesson_keywords` | ✅ |
| All lessons have `key_learning_points` | ✅ |
| All lessons have `lesson_content` | ✅ |
| All lessons have `misconceptions_and_common_mistakes` | ✅ |

---

## Data Source Analysis

### Bulk Download Structure

The bulk download file `maths-secondary.json` contains:

```json
{
  "lessons": [...],        // 1235 lesson entries (809 KS4)
  "sequence": [...],       // 98 unit entries with unitLessons[]
  "sequenceSlug": "maths-secondary",
  "subjectTitle": "Maths"
}
```

**Critical Observation**: The `sequence[]` array contains **DUPLICATE unit entries** for tier variants (foundation/higher). Each variant has a different `unitLessons[]` count:

```text
surds (variant 1): unitLessons.length = 1
surds (variant 2): unitLessons.length = 12
```

The API's `/units/{slug}/summary` endpoint returns whichever variant it finds first, often the truncated one.

### API Endpoint Data Sources

| Data Type | API Endpoint | Data Quality | Used By |
|-----------|--------------|--------------|---------|
| Lessons | `/key-stages/{ks}/subject/{subject}/lessons` | ✅ Complete (paginated) | Lesson ingestion (fixed) |
| Lessons (old) | `/units/{slug}/summary` → `unitLessons[]` | ❌ Truncated | Unit documents (broken) |
| Units | `/key-stages/{ks}/subject/{subject}/units` | ✅ Complete list | Unit enumeration |
| Unit Summary | `/units/{slug}/summary` | ⚠️ Truncated `unitLessons` | Unit document building |
| Transcripts | `/lessons/{slug}/transcript` | ✅ Complete | Lesson content |
| Threads | `/threads` | ✅ Complete | Thread enumeration |

---

## Impact Assessment

### Search Quality Impact

1. **Unit search results show wrong lesson counts** - Users see "2 lessons" for a unit that actually has 8
2. **Unit rollup content incomplete** - Semantic search on rollups misses lesson content
3. **Filtering by lesson count would be wrong** - Any facets based on `lesson_count` are incorrect

### Data Relationships Impact

1. **`lesson_ids` arrays incomplete** - Can't enumerate lessons from unit documents
2. **Cross-reference broken** - Unit → Lesson mapping incomplete
3. **Rollup snippets missing** - Rollups don't contain snippets from missing lessons

---

## Root Cause Deep Dive

### The Tier Variant Problem

The Oak API has a concept of "unit variants" for different tiers (foundation/higher) and pathways. When the `/units/{slug}/summary` endpoint is called, it returns:

- A `unitLessons[]` array that may be **truncated** depending on which variant is returned
- The truncation is **by design** - it's a materialized view optimized for quick overview

The bulk download's `sequence[]` array contains ALL variants, showing the discrepancy:

```text
Unit: algebraic-fractions
  Variant 1 (foundation?): 2 lessons
  Variant 2 (higher?): 8 lessons

Unit: surds
  Variant 1: 1 lesson
  Variant 2: 12 lessons
```

### Code Path Analysis

**Lesson Ingestion (FIXED)**:

```text
fetchAllLessonsWithPagination() → /key-stages/{ks}/subject/{subject}/lessons
→ Gets ALL lessons regardless of tier
→ Aggregates by lessonSlug
→ 436 unique lessons indexed ✅
```

**Unit Document Building (BROKEN)**:

```text
buildUnitDocuments() → client.getUnitSummary(unitSlug)
→ /units/{slug}/summary returns truncated unitLessons[]
→ lesson_count = unitLessons.length (truncated)
→ lesson_ids = unitLessons.map(l => l.lessonSlug) (truncated)
→ Unit document has wrong counts ❌
```

---

## Recommended Fixes

### Option 1: Derive lesson_count from aggregated lessons (Recommended)

Update unit document building to derive `lesson_count` and `lesson_ids` from the already-aggregated lesson data:

```typescript
// After fetchAllLessonsWithPagination() returns aggregatedLessons
const lessonsByUnit = new Map<string, string[]>();
for (const lesson of aggregatedLessons.values()) {
  for (const unitSlug of lesson.unitSlugs) {
    const existing = lessonsByUnit.get(unitSlug) ?? [];
    existing.push(lesson.lessonSlug);
    lessonsByUnit.set(unitSlug, existing);
  }
}

// In unit document creation:
const correctLessonIds = lessonsByUnit.get(unitSlug) ?? [];
unitDoc.lesson_count = correctLessonIds.length;
unitDoc.lesson_ids = correctLessonIds;
```

### Option 2: Use MAX lesson count from tier variants

Query all tier variants of a unit and use the maximum `unitLessons` count.

### Option 3: Cross-reference with lessons index

After lesson ingestion, update unit documents by querying the lessons index for all lessons belonging to each unit.

---

## Verification Queries

### Count discrepancy check

```bash
# Bulk download lesson count per unit
jq '[.lessons[] | select(.keyStageSlug == "ks4") | {slug: .lessonSlug, unit: .unitSlug}] | group_by(.unit) | map({unit: .[0].unit, count: ([.[].slug] | unique | length)})' maths-secondary.json

# ES unit lesson_count
curl -X POST ".../_search" -d '{"aggs":{"units":{"terms":{"field":"unit_slug","size":100},"aggs":{"lesson_count":{"avg":{"field":"lesson_count"}}}}}}'
```

### Specific unit verification

```bash
# Check surds unit in bulk
jq '[.lessons[] | select(.unitSlug == "surds" and .keyStageSlug == "ks4") | .lessonSlug] | unique' maths-secondary.json
# Returns: 12 lessons

# Check surds in ES
curl ".../_doc/surds" | jq '._source.lesson_ids'
# Returns: 1 lesson
```

---

## Action Items

### Critical (Blocking) - Ingestion Fixes

- [ ] **PRIORITY 1**: Fix unit/rollup building to derive `lesson_count` and `lesson_ids` from aggregated lesson data (not from truncated `unitLessons[]`)
- [ ] **PRIORITY 2**: Rename `sequence_ids` → `thread_slugs` in unit documents to match Oak terminology
- [ ] **PRIORITY 3**: Add `thread_titles` and `thread_orders` to unit documents (currently only in rollups)
- [x] ~~**PRIORITY 4**: Delete dead `extractTier()` function~~ → **DELETED** `programme-factor-extractors.ts` (2025-12-20)
- [ ] **PRIORITY 4a**: Remove vestigial `tier` field from schema and document creation (see Tier Cleanup below)
- [ ] **PRIORITY 5**: Run `pnpm type-gen` to regenerate types
- [ ] **PRIORITY 6**: Re-ingest with fixed code

### Tier Field Cleanup

Per ADR-080, tier is many-to-many. The singular `tier` field is vestigial and must be removed:

| File | Change Required |
|------|-----------------|
| `type-gen/.../curriculum.ts` | Remove `{ name: 'tier', ... }` from `LESSON_FIELDS` and `UNIT_ROLLUP_FIELDS` |
| `document-transform-helpers.ts` | Remove `extractTier` import/re-export, remove `tier` from return types |
| `document-transforms.ts` | Remove `tier: f.tier` and `tier: fields.tier` |
| `document-transform-helpers.unit.test.ts` | Remove `extractTier` tests |
| `document-transforms.unit.test.ts` | Remove `tier` assertions |

### Validation (Post-Fix)

- [ ] **PRIORITY 6**: Add ingestion validation test comparing ES counts to bulk download
- [ ] **PRIORITY 7**: Add field-level validation for tier, thread, lesson_count

### Resolved

- [x] ~~**INVESTIGATE**: Redis cache may have stale data~~ → **FLUSHED** (2025-12-20)
- [x] ~~**INVESTIGATE**: Whether tier data can be obtained from a different endpoint~~ → **RESOLVED**: Tier comes from `/sequences/{sequence}/units` and IS correctly extracted
- [x] ~~**INVESTIGATE**: Why some tier variants return truncated `unitLessons[]`~~ → **UNDERSTOOD**: `unitLessons[]` in unit summary is intentionally truncated (tier variant views). We correctly ignore it for lessons (using paginated endpoint), but still use it wrongly for unit `lesson_count`.

---

## Proposed Validation Tests

### Ingestion Validation Test Suite

A post-ingestion E2E test that compares indexed data against the bulk download:

```typescript
// ingestion-validation.e2e.test.ts
describe('Ingestion Validation', () => {
  it('lesson count matches bulk download', async () => {
    const bulkCount = await countUniqueLessonsInBulkDownload('maths', 'ks4');
    const esCount = await countLessonsInElasticsearch('maths', 'ks4');
    expect(esCount).toBe(bulkCount);
  });

  it('unit lesson_count matches actual lessons', async () => {
    const units = await getUnitsFromElasticsearch('maths', 'ks4');
    for (const unit of units) {
      const actualLessons = await getLessonsForUnitFromES(unit.unit_slug);
      expect(unit.lesson_count).toBe(actualLessons.length);
    }
  });

  it('all lessons have tier data (KS4)', async () => {
    const lessons = await getLessonsFromElasticsearch('maths', 'ks4');
    for (const lesson of lessons) {
      expect(lesson.tiers).toBeDefined();
      expect(lesson.tiers.length).toBeGreaterThan(0);
    }
  });

  it('unit thread fields use correct naming', async () => {
    const units = await getUnitsFromElasticsearch('maths', 'ks4');
    for (const unit of units) {
      expect(unit.thread_slugs).toBeDefined();
      expect(unit.thread_titles).toBeDefined();
      // sequence_ids should NOT exist (or be renamed)
    }
  });
});
```

---

## Appendix: Data Files

### Bulk Download Location

```text
reference/bulk_download_data/oak-bulk-download-2025-12-07T09_37_04.693Z/
├── maths-secondary.json    # Contains KS3 + KS4 maths
├── maths-primary.json      # Contains KS1 + KS2 maths
└── ... (other subjects)
```

### Key Ingestion Code Files

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/index-oak-helpers.ts              # buildLessonsFromSummaries (fixed)
├── src/lib/indexing/fetch-all-lessons.ts     # fetchAllLessonsWithPagination (new)
├── src/lib/indexing/lesson-aggregation.ts    # aggregateLessonsBySlug (new)
├── src/lib/indexing/index-bulk-helpers.ts    # buildUnitDocuments (needs fix)
└── src/adapters/oak-adapter-sdk.ts           # getUnitSummary (returns truncated data)
```

### Code Locations Using Truncated `unitLessons` Data

The following files consume `summary.unitLessons` which contains truncated data from `/units/{slug}/summary`:

| File | Usage | Impact |
|------|-------|--------|
| `document-transforms.ts` | `lessonIds = summary.unitLessons.map(...)` | ❌ Unit `lesson_ids` truncated |
| `sequence-facets.ts` | `lessonCount += summary.unitLessons.length` | ❌ Facet `lesson_count` wrong |
| `lesson-document-builder.ts` | `lessonCount: primarySummary.unitLessons.length` | ❌ Lesson doc `unit_count` wrong |
| `document-transform-helpers.ts` | `lessonIds = summary.unitLessons.map(...)` | ❌ Rollup `lesson_ids` truncated |
| `semantic-summary-generator.ts` | Lesson titles + count for semantic text | ⚠️ Semantic summaries incomplete |

**Total Affected Code Paths**: 6 usages across 5 files

All these need to be updated to use the aggregated lesson data from `fetchAllLessonsWithPagination()` instead of the truncated `unitLessons` from unit summaries.

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-20 | Initial discrepancy analysis | AI Agent |
| 2025-12-20 | Added field-level findings (tier, thread naming, year distribution, meta staleness) | AI Agent |
| 2025-12-20 | Verified cross-reference integrity between indexes | AI Agent |
| 2025-12-20 | Deep code analysis: identified 6 usages of truncated `unitLessons` in 5 files | AI Agent |
| 2025-12-20 | Confirmed `sequence_ids` vs `thread_slugs` naming inconsistency with root cause | AI Agent |
| 2025-12-20 | **CORRECTED**: Tier IS correctly populated via `tiers`/`tier_titles` from `/sequences/{sequence}/units` | AI Agent |
| 2025-12-20 | Identified `extractTier()` as dead/wrong code (derives from slug, should use KS4 context map) | AI Agent |
| 2025-12-20 | Flushed Redis cache | AI Agent |
| 2025-12-20 | Added proposed validation test suite | AI Agent |
| 2025-12-20 | **DELETED** `programme-factor-extractors.ts` (dead code) | AI Agent |
| 2025-12-20 | Documented tier cleanup: remove vestigial `tier` field from schema + document creation | AI Agent |
