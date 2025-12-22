# Semantic Search Current State

**Last Updated**: 2025-12-22 (verified via ES query)
**Measured Against**: Maths KS4 (vertical slice) — **COMPLETE INDEX**

This is THE authoritative source for current system metrics. All other documents reference this file.

---

## Quality Gate Status

**✅ ALL QUALITY GATES PASS (2025-12-22 18:51 UTC)**

| Gate                     | Status                         |
| ------------------------ | ------------------------------ |
| `pnpm type-gen`          | ✅                             |
| `pnpm build`             | ✅                             |
| `pnpm type-check`        | ✅                             |
| `pnpm lint:fix`          | ✅                             |
| `pnpm format:root`       | ✅                             |
| `pnpm markdownlint:root` | ✅                             |
| `pnpm test`              | ✅ (504 tests across 89 files) |
| `pnpm test:e2e`          | ✅                             |
| `pnpm test:e2e:built`    | ✅ (4 tests)                   |
| `pnpm test:ui`           | ✅ (26 tests)                  |
| `pnpm smoke:dev:stub`    | ✅                             |

---

## Current Metrics

**✅ INGESTION COMPLETE (2025-12-22)**: Index verified against bulk download data with **436** unique Maths KS4 lessons across **36 units**.

**Last Ingestion**: 2025-12-22 18:47:08 UTC (v2025-12-22-184708)  
**Validation**: Bulk download data (2025-12-07) confirms 436 unique lessons, 36 units ✅

### Overall Performance

| Metric                | Value  | Target  | Status           | Notes                         |
| --------------------- | ------ | ------- | ---------------- | ----------------------------- |
| Lesson Hard Query MRR | 0.316  | ≥0.50   | ❌ Gap: 37%      | Measured 2025-12-22 20:29 UTC |
| Unit Hard Query MRR   | 0.856  | ≥0.50   | ✅ Met (+13%)    | Measured 2025-12-22 20:29 UTC |
| Lesson Std Query MRR  | 0.944  | ≥0.92   | ✅ Met           | Hybrid superiority validated  |
| Unit Std Query MRR    | 0.988  | ≥0.92   | ✅ Met           | Near perfect performance      |
| Zero-hit Rate         | 0%     | 0%      | ✅ Met           |                               |
| p95 Latency           | ~450ms | ≤1500ms | ✅ Within budget | After ELSER warmup            |

**Note on complete data impact**:
- **Standard queries**: Excellent performance (MRR 0.944 lessons, 0.988 units)
- **Hard queries**: Lesson MRR decreased slightly (0.327→0.316, -3.4%), Unit MRR improved significantly (0.761→0.856, +12.5%)
- **Interpretation**: More complete unit data improves unit search; more lessons indexed increases search space complexity for lessons

### Per-Category Breakdown (Lesson Hard Queries)

_To be remeasured against complete index._

---

## Index Status

**✅ ALL DATA CORRECT**: Verified via ES query, smoke tests, and bulk download validation 2025-12-22.

**Last Ingestion**: 2025-12-22 18:47:08 UTC (v2025-12-22-184708)

Current document counts for Maths KS4:

| Index                 | Live Docs | Stored Docs | Status                                  |
| --------------------- | --------- | ----------- | --------------------------------------- |
| `oak_lessons`         | 436       | 8736\*      | ✅ Complete (validated vs bulk DL)     |
| `oak_units`           | 36        | 36          | ✅ All lesson_counts correct           |
| `oak_unit_rollup`     | 36\*\*    | 357         | ✅ All lesson_counts correct           |
| `oak_threads`         | 201       | 201         | ✅ Complete                            |
| `oak_sequences`       | 2         | 2           | ✅ Complete                            |
| `oak_sequence_facets` | 1         | 1           | ✅ Complete                            |

\*Stored docs (8736) include all subjects; 436 are Maths KS4 (verified via `subject_slug:maths AND key_stage:ks4`)  
\*\*357 rollups across all subjects/keystages, 36 are Maths KS4

**Bulk Download Validation** (2025-12-07 snapshot):
- Unique lessons: 436 ✅ Matches ES
- Units: 36 ✅ Matches ES
- Total lesson-unit entries: 809 (includes multi-tier variants)

Verify with: `pnpm es:status` (from `apps/oak-open-curriculum-semantic-search`)

---

## Current Tier Status

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier  | Name                   | Status         | Exit Criteria     |
| ----- | ---------------------- | -------------- | ----------------- |
| **1** | Search Fundamentals    | 🔄 In Progress | MRR ≥0.45         |
| **2** | Document Relationships | 📋 Pending     | MRR ≥0.55         |
| **3** | Modern ES Features     | 📋 Pending     | MRR ≥0.60         |
| **4** | AI Enhancement         | ⏸️ Deferred    | Tiers 1-3 plateau |

---

## Known Issues

### Ingestion Gap (Lessons) — RESOLVED ✅

**Status**: ✅ RESOLVED (lessons complete)
**Fixed**: 2025-12-20  
**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

| Before                  | After                  | Fix                      |
| ----------------------- | ---------------------- | ------------------------ |
| 314 lessons (truncated) | 436 lessons (complete) | Pagination + aggregation |

---

### Ingestion Data Quality Issues — ✅ RESOLVED

**Status**: ✅ RESOLVED (2025-12-22 18:51 UTC)  
**Discovered**: 2025-12-20  
**Full Analysis**: [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)

**Summary**: All ingestion data quality issues have been resolved. Unit documents now have correct lesson counts and thread fields.

#### Issue 1: Unit `lesson_count` and `lesson_ids` Truncated — ✅ FIXED

| Metric                            | Before   | After      | Status      |
| --------------------------------- | -------- | ---------- | ----------- |
| Units with correct `lesson_count` | 11/36    | 36/36      | ✅ Fixed    |
| Lessons indexed                   | 431      | 436        | ✅ Complete |
| Example: `surds`                  | 1 lesson | 12 lessons | ✅ Correct  |

**Root cause discovered**: Upstream API `/key-stages/{ks}/subject/{subject}/lessons` endpoint has a bug where unfiltered pagination returns incomplete data (431 lessons instead of 436 for Maths KS4). However, filtering by unit returns complete data.

**Fix implemented**:

- Created `fetchAllLessonsByUnit()` function that fetches lessons unit-by-unit instead of using buggy unfiltered pagination
- Updated ingestion to use this workaround
- Added comprehensive unit and integration tests
- **Documented upstream bug** in `.agent/plans/external/ooc-api-wishlist/00-overview-and-known-issues.md`

**Files changed**:

- `src/lib/indexing/fetch-all-lessons.ts` - Added `fetchAllLessonsByUnit()` with full documentation
- `src/lib/index-oak-helpers.ts` - Updated to use unit-by-unit fetching
- `src/lib/indexing/fetch-all-lessons.unit.test.ts` - Added 8 unit tests
- `src/lib/indexing/unit-lesson-count-correctness.integration.test.ts` - Added 2 integration tests

**Verification**: All smoke tests pass, including `ingestion-validation.smoke.test.ts` which validates all 36 units have correct lesson counts.

#### Issue 2: Thread Field Naming Error — ✅ FIXED

| Field           | Before            | After               | Status   |
| --------------- | ----------------- | ------------------- | -------- |
| `thread_slugs`  | undefined (units) | Correctly populated | ✅ Fixed |
| `thread_titles` | undefined (units) | Correctly populated | ✅ Fixed |
| `thread_orders` | undefined (units) | Correctly populated | ✅ Fixed |

**Fix implemented**: Unit documents now correctly populate thread fields using `extractThreadInfo()` helper (same pattern as rollups).

#### Issue 3: `tier` Field — ✅ ALREADY CORRECT

Per ADR-080, tier is **many-to-many**. The schema correctly defines:

- `tiers` (array) ← ✅ Correctly populated in ES: `["foundation", "higher"]`
- `tier_titles` (array) ← ✅ Correctly populated in ES: `["Foundation", "Higher"]`

**VERIFIED 2025-12-22**: No vestigial `tier` (singular) field exists in the schema (`curriculum.ts`). The schema only defines the correct array fields. No cleanup needed.

#### Actions Completed (2025-12-22)

1. [x] ~~**Test isolation fix**~~ ✅ COMPLETE (2025-12-22)
2. [x] ~~**VERIFY tier cleanup**~~ ✅ COMPLETE — Schema correct, no vestigial field
3. [x] ~~**FIX**: Derive unit `lesson_count`/`lesson_ids` from aggregated lesson data~~ ✅ COMPLETE
   - Implemented `fetchAllLessonsByUnit()` to work around upstream API bug
   - Updated ingestion to fetch lessons unit-by-unit
   - Added comprehensive unit and integration tests
4. [x] ~~**FIX**: Populate `thread_slugs`, `thread_titles`, `thread_orders` in unit documents~~ ✅ COMPLETE
   - Unit documents now use `extractThreadInfo()` helper
   - All thread fields correctly populated
5. [x] ~~**RE-INDEX**: Full re-ingestion after fixes~~ ✅ COMPLETE
   - Redis cache flushed
   - Full re-ingestion completed
   - 436 lessons indexed (up from 431)
6. [x] ~~**VALIDATE**: Add post-ingestion validation tests~~ ✅ COMPLETE
   - `ingestion-validation.smoke.test.ts` validates all unit lesson counts
   - `unit-lesson-count-correctness.integration.test.ts` validates the fix at integration level
   - All tests pass

**Cache Status**: Redis cache cleared 2025-12-20; fresh ingestion completed 2025-12-22 18:47 UTC

**Re-ingestion Required?**: ❌ NO - Current index is complete and correct (v2025-12-22-184708)

**Baseline Re-measurement**: ✅ COMPLETE - New baselines established 2025-12-22 20:29 UTC

**Search Experimentation Status**: ✅ **READY TO RESUME** - All blockers resolved, complete data indexed

---

## Verified Findings (2025-12-22 ES Query Session)

The following were **verified via direct Elasticsearch queries** on 2025-12-22:

### ✅ Confirmed Correct

| Finding                                        | Evidence                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------- |
| Lesson count is 436 (not 431)                  | `client.count({ index: 'oak_lessons' })` returns 436                              |
| All 436 lessons are Maths KS4                  | Aggregation by `subject_slug` shows only `maths`, by `key_stage` shows only `ks4` |
| `tiers[]` correctly populated                  | Sample lesson: `tiers: ["foundation", "higher"]`                                  |
| `tier_titles[]` correctly populated            | Sample lesson: `tier_titles: ["Foundation", "Higher"]`                            |
| No vestigial `tier` (singular) field in schema | `curriculum.ts` defines only `tiers` and `tier_titles` arrays                     |

### ❌ Confirmed Broken

| Finding                                            | Evidence                                                                               |
| -------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 25/36 units have wrong `lesson_count`              | ES validation: Correct=11, Wrong=25                                                    |
| `surds` unit: stored=1, actual=12                  | Direct ES query confirms discrepancy                                                   |
| Unit docs have `thread_slugs: undefined`           | Sample unit query: `thread_slugs: undefined`                                           |
| Unit docs populate `sequence_ids` with thread data | Sample: `sequence_ids: ["geometry-and-measure"]` (this is a thread, not sequence)      |
| Rollup docs have BOTH fields                       | Sample: `sequence_ids: ["number"], thread_slugs: ["number"]` (inconsistent with units) |

### Code Analysis Findings

| Component                          | Finding                                                        | Location                                        |
| ---------------------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Unit `lesson_ids`                  | Derived from truncated `summary.unitLessons.map(...)`          | `document-transforms.ts` line 61                |
| Unit `lesson_count`                | Uses `lessonIds.length` (truncated)                            | `document-transforms.ts` line 79                |
| Unit `sequence_ids`                | Incorrectly set from `summary.threads`                         | `document-transforms.ts` line 64                |
| Unit `thread_slugs`                | NOT POPULATED in unit docs                                     | `createUnitDocument()` doesn't set it           |
| Rollup has correct thread fields   | Uses `extractThreadInfo()`                                     | `document-transform-helpers.ts` lines 186-198   |
| Schema defines both fields         | `sequence_ids` AND `thread_slugs` both exist                   | `curriculum.ts` lines 118-121                   |
| Aggregation code exists            | `fetchAllLessonsWithPagination()` + `aggregateLessonsBySlug()` | `fetch-all-lessons.ts`, `lesson-aggregation.ts` |
| Aggregated data NOT used for units | Unit docs don't consume aggregated lesson data                 | Data flow gap in `index-oak-helpers.ts`         |

### Remaining Assumptions (Unverified)

| Assumption                 | Status                                          |
| -------------------------- | ----------------------------------------------- |
| All quality gates pass     | ⚠️ Not verified this session — run `pnpm check` |
| Test isolation is restored | ⚠️ Not verified — check `vitest.config.ts`      |

---

## Historical Context

For the full history of experiments and their impact on these metrics, see:

- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological experiment history
- **[EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md)** — Strategic roadmap

---

## How to Update This Document

When metrics change (after an experiment or system change):

1. Run the relevant smoke tests to measure new values
2. Update the metrics tables above
3. Update the "Last Updated" date
4. Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

```bash
# Measure current metrics
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```
