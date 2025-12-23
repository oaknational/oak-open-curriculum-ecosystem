# Semantic Search Current State

**Last Updated**: 2025-12-23 18:00 UTC (B.5 implementation complete, validation pending)
**Measured Against**: Maths KS4 (vertical slice) — **COMPLETE INDEX**

This is THE authoritative source for current system metrics. All other documents reference this file.

---

## ⚠️ B.5 Incomplete — Quality Gates + Validation Pending

**B.5 Phrase Query Enhancement code is merged.** BUT:
1. **Quality gates have NOT been verified** after the merge
2. **The experiment to measure MRR impact has NOT been run**

**IMMEDIATE ACTION REQUIRED** (in order):

**Step 1: Verify quality gates** (from repo root):

```bash
pnpm type-gen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm format:root && pnpm markdownlint:root && pnpm test && pnpm test:e2e && pnpm test:e2e:built && pnpm test:ui && pnpm smoke:dev:stub
```

Fix any failures before proceeding.

**Step 2: Run B.5 validation** (only after gates pass):

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:diagnostic      # Measure MRR with phrase boosting active
pnpm eval:per-category    # Get full category breakdown
```

**Then update this file with actual measured metrics.**

---

## Quality Gate Status

**⚠️ QUALITY GATES NOT VERIFIED AFTER B.5 MERGE**

Last verified run was 2025-12-22 18:51 UTC — BEFORE B.5 code was merged.

| Gate                     | Status                                    |
| ------------------------ | ----------------------------------------- |
| `pnpm type-gen`          | ❓ Not verified after B.5                 |
| `pnpm build`             | ❓ Not verified after B.5                 |
| `pnpm type-check`        | ❓ Not verified after B.5                 |
| `pnpm lint:fix`          | ❓ Not verified after B.5                 |
| `pnpm format:root`       | ❓ Not verified after B.5                 |
| `pnpm markdownlint:root` | ❓ Not verified after B.5                 |
| `pnpm test`              | ❓ Not verified after B.5                 |
| `pnpm test:e2e`          | ❓ Not verified after B.5                 |
| `pnpm test:e2e:built`    | ❓ Not verified after B.5                 |
| `pnpm test:ui`           | ❓ Not verified after B.5                 |
| `pnpm smoke:dev:stub`    | ❓ Not verified after B.5                 |

**Run full quality gate suite before proceeding with any work.**

---

## Current Metrics

**✅ INGESTION COMPLETE (2025-12-22)**: Index verified against bulk download data with **436** unique Maths KS4 lessons across **36 units**.

**Last Ingestion**: 2025-12-22 18:47:08 UTC (v2025-12-22-184708)  
**Validation**: Bulk download data (2025-12-07) confirms 436 unique lessons, 36 units ✅

### Overall Performance

**⚠️ IMPORTANT**: The aggregate "Lesson Hard MRR" hides massive category variation (naturalistic: 0.567 vs synonym: 0.167). **Always analyze by category.**

**⚠️ NOTE**: These metrics are BEFORE B.5 phrase boosting validation. B.5 code is merged but the experiment has not been run. Re-measure with `pnpm eval:per-category`.

| Metric                | Value  | Target  | Status           | Notes                         |
| --------------------- | ------ | ------- | ---------------- | ----------------------------- |
| Lesson Hard MRR (agg) | 0.369  | ≥0.50   | ❌ Gap: 26%      | ⚠️ BEFORE B.5 validation      |
| Unit Hard Query MRR   | 0.856  | ≥0.50   | ✅ Met (+13%)    | Measured 2025-12-22 20:29 UTC |
| Lesson Std Query MRR  | 0.944  | ≥0.92   | ✅ Met           | Hybrid superiority validated  |
| Unit Std Query MRR    | 0.988  | ≥0.92   | ✅ Met           | Near perfect performance      |
| Zero-hit Rate         | 0%     | 0%      | ✅ Met           |                               |
| p95 Latency           | ~450ms | ≤1500ms | ✅ Within budget | After ELSER warmup            |

**B.5 Targets** (after validation):
- **Synonym category**: 0.167 → Target ≥0.40
- **Multi-concept category**: 0.083 → Target ≥0.25
- **Overall Lesson Hard MRR**: 0.369 → Target ≥0.45

**Recent improvements** (by category, not aggregate):
- **Naturalistic category**: 0.300 → 0.567 (+89%) — B.4 noise phrase filtering highly effective
- **Colloquial category**: 0.000 → 0.500 (+∞) — "complete the square" now works
- **Synonym category**: Still 0.167 — Synonyms deployed (163 entries) and working, but phrase matching weak
- **Overall aggregate**: 0.316 → 0.369 (+16.8%) — Driven by naturalistic improvement

### Per-Category Breakdown (Lesson Hard Queries)

**Measured**: 2025-12-23 11:07 UTC against complete index (436 lessons)  
**After**: B.4 (Noise Phrase Filtering) + Complete Synonym Deployment (163 entries)

| Category       | Count | MRR   | Status       | Notes |
|----------------|-------|-------|--------------|-------|
| naturalistic   | 3     | 0.567 | ✅ Good       | +89% improvement from noise filtering |
| misspelling    | 3     | 0.611 | ✅ Good       | Fuzzy matching working well |
| synonym        | 3     | 0.167 | ❌ Poor       | Synonyms deployed but phrase matching weak |
| multi-concept  | 2     | 0.083 | ❌ Poor       | Cross-topic queries need work |
| colloquial     | 2     | 0.500 | ✅ Good       | "complete the square" works; "sohcahtoa" fails |
| intent-based   | 2     | 0.167 | ❌ Poor       | Abstract pedagogical queries challenging |

**Key Findings**:

1. **Naturalistic improvement (+89%)**: Noise phrase filtering successfully handles "the bit where you X", "that X stuff for Y" patterns
2. **Synonym category still poor (0.167)**: **ROOT CAUSE IDENTIFIED** — Single-word synonyms work (MRR 0.500), but phrase synonyms fail completely (MRR 0.000). See diagnostic analysis ↓
3. **Multi-concept remains challenging (0.083)**: **KEY INSIGHT** — Concept+Method queries work excellently (MRR 1.000), but generic/explicit AND queries fail (MRR 0.000). See diagnostic analysis ↓
4. **Colloquial partial success**: "complete the square" works, but "sohcahtoa" still fails — multi-word curriculum terms need phrase matching boost

### Diagnostic Query Analysis (2025-12-23 14:00 UTC)

**18 additional diagnostic queries** (9 synonym, 9 multi-concept) created to granularly understand failure modes and success patterns.

#### Synonym Diagnostics (Overall MRR: 0.204 across 9 queries)

| Pattern | Count | MRR | Status | Key Finding |
|---------|-------|-----|--------|-------------|
| Single-word synonym | 2 | 0.500 | ✅ **Good** | "trig" → "trigonometry", "factorise" → "factorising" both work (rank 2) |
| Phrase synonym (START) | 1 | 0.000 | ❌ **CRITICAL** | "straight line equations" fails despite "straight line" → "linear" synonym |
| Phrase synonym (END) | 1 | 0.000 | ❌ **CRITICAL** | "equations for straight lines" fails — position irrelevant |
| Phrase synonym (MIDDLE) | 1 | 0.000 | ❌ **CRITICAL** | "finding straight line slope" fails — same issue |
| Formal synonym | 1 | 0.500 | ✅ **Good** | "transposition" → "changing the subject" works (rank 2) |
| Spoken formula | 1 | 0.333 | ✅ **Good** | "y equals mx plus c" works (rank 3) |
| Multiple synonyms | 1 | 0.000 | ❌ Poor | "rules for index laws" fails — "rules" → "laws" not effective |
| Multi-word curriculum term | 1 | 0.000 | ❌ Poor | "circle rules" doesn't match "circle theorems" |

**🔥 CRITICAL FINDING**: Elasticsearch synonym filter works for **single tokens only**, not **phrase synonyms**. The 163 synonyms are deployed and active, but ES applies them at the token level after tokenization, not at the phrase level. Phrase "straight line" is tokenized to ["straight", "line"] before synonym expansion, so the phrase rule "straight line => linear" never matches.

**Impact**: All phrase-based synonym rules (approximately 40% of our 163 entries) are currently non-functional.

**Next step (B.5)**: Implement phrase query boost for known multi-word curriculum terms using match_phrase queries with boosting.

#### Multi-Concept Diagnostics (Overall MRR: 0.343 across 9 queries)

| Pattern | Count | MRR | Status | Key Finding |
|---------|-------|-----|--------|-------------|
| Concept + Method | 2 | 1.000 | ✅ **EXCELLENT** | "equations using substitution", "quadratics by completing square" both rank #1! |
| Four concepts | 1 | 0.500 | ✅ **Good** | "linear graphs algebra substitution" ranks 2 — keyword density helps |
| Implicit intersection | 1 | 0.333 | ✅ **Good** | "quadratics with graphs" works (rank 3) |
| Three concepts | 1 | 0.250 | ⚠️ Marginal | "probability fractions diagrams" ranks 4 — just below threshold |
| Explicit AND | 1 | 0.000 | ❌ Poor | "algebra and graphs" fails — too generic |
| Three geometry concepts | 1 | 0.000 | ❌ Poor | "angles triangles pythagoras" fails — lacks method specificity |
| Single concept baseline | 1 | 0.000 | ❌ Poor | "graphs" alone too generic — no discriminative power |
| Abstract intersection | 1 | 0.000 | ❌ Poor | "geometry and algebra together" fails — too abstract |

**🎯 KEY INSIGHT**: The search system **already understands curriculum structure** when queries include **method specificity** ("by substitution", "using completing square"). Generic concept combinations without method context fail.

**Impact**: The issue is not multi-concept scoring per se, but rather lack of semantic understanding for abstract/generic queries.

**Next step**: B.5 phrase query enhancement should focus on boosting **phrase matching** for curriculum terms, not complex multi-concept scoring.

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

**Current Task**: B.5 Phrase Query Enhancement — IMPLEMENTATION COMPLETE, VALIDATION PENDING

Run `pnpm eval:diagnostic` to measure impact of phrase boosting.

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

**Evaluation Tools** (reorganized 2025-12-23):
```bash
# Analysis scripts (measurement & reporting)
pnpm eval:diagnostic      # 18-query diagnostic analysis
pnpm eval:per-category    # Per-category MRR breakdown

# Experiments (hypothesis testing with vitest)
pnpm vitest run -c vitest.experiment.config.ts

# Operations (ingestion, monitoring, infrastructure)
pnpm ingest:verify        # Validate ingestion completeness
pnpm ops:generate-synonyms # Generate synonym JSON from SDK
```

See `evaluation/README.md` and `operations/README.md` for details.

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
4. **Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — This is the historical record
5. Update [README.md](README.md) and [part-1-search-excellence.md](part-1-search-excellence.md) if needed

**Critical**: Always update EXPERIMENT-LOG.md after completing experiments or making system changes. See "How to Add an Entry" section in that file.

```bash
# Measure current metrics
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```
