# Semantic Search Current State

**Last Updated**: 2025-12-20  
**Measured Against**: Maths KS4 (vertical slice) — **COMPLETE INDEX**

This is THE authoritative source for current system metrics. All other documents reference this file.

---

## Current Metrics

**✅ INGESTION GAP RESOLVED (2025-12-20)**: Metrics now measured against complete index with 431 unique Maths KS4 lessons (up from 314).

### Overall Performance

| Metric                | Value  | Target  | Status           | Notes                         |
| --------------------- | ------ | ------- | ---------------- | ----------------------------- |
| Lesson Hard Query MRR | 0.327  | ≥0.50   | ❌ Gap: 35%      | TRUE baseline (complete data) |
| Unit Hard Query MRR   | 0.761  | ≥0.50   | ✅ Met           | TRUE baseline (complete data) |
| Zero-hit Rate         | 0%     | 0%      | ✅ Met           |                               |
| p95 Latency           | ~450ms | ≤1500ms | ✅ Within budget | After ELSER warmup            |

**Note on baselines**: Previous baselines (Lesson MRR=0.367, Unit MRR=0.811) were measured against an INCOMPLETE index with only 314/431 lessons. The current values are the TRUE baselines against complete data.

### Per-Category Breakdown (Lesson Hard Queries)

_To be remeasured against complete index._

---

## Index Status

**✅ COMPLETE**: Ingestion gap resolved. Counts verified 2025-12-20.

Current document counts for Maths KS4:

| Index               | Count | Status      |
| ------------------- | ----- | ----------- |
| `oak_lessons`       | 431   | ✅ Complete |
| `oak_units`         | 36    | ✅ Complete |
| `oak_unit_rollup`   | 36    | ✅ Complete |
| `oak_threads`       | 201   | ✅ Complete |
| `oak_sequences`     | 2     | ✅ Complete |
| `oak_sequence_facets` | 1   | ✅ Complete |

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

| Before | After | Fix |
| ------ | ----- | --- |
| 314 lessons (truncated) | 431 lessons (complete) | Pagination + aggregation |

---

### Ingestion Data Quality Issues — BLOCKING ❌

**Status**: ❌ BLOCKING (search experimentation paused until resolved)
**Discovered**: 2025-12-20  
**Full Analysis**: [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)

**Summary**: While lesson COUNT is now correct, unit documents still contain incorrect data from truncated API responses.

#### Issue 1: Unit `lesson_count` and `lesson_ids` Truncated

| Metric | Expected | Actual | Gap |
| ------ | -------- | ------ | --- |
| Units with correct `lesson_count` | 36/36 | 11/36 | **25 units wrong** |
| Example: `surds` | 12 lessons | 1 lesson | -92% |

**Root cause**: Unit documents still derive `lesson_count` from `/units/{slug}/summary` → `unitLessons[]` which is truncated.

**Fix required**: Derive `lesson_count` and `lesson_ids` from the already-aggregated lesson data.

#### Issue 2: Thread Field Naming Error

| Field | Content | Issue |
| ----- | ------- | ----- |
| `sequence_ids` | Thread slugs | **WRONG NAME** - per [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary), these are threads not sequences |
| `thread_slugs` | null (units), thread slugs (rollups) | Inconsistent |

**Fix required**: Rename `sequence_ids` → `thread_slugs` in unit documents.

#### Issue 3: Dead `tier` Field and Code — BUILD BROKEN ❌

**STATUS**: `pnpm build` WILL FAIL until cleanup is complete.

The previous session deleted `programme-factor-extractors.ts` but did NOT complete the cleanup. The import still exists in `document-transform-helpers.ts`.

Per ADR-080, tier is **many-to-many** (a lesson can be in BOTH Foundation AND Higher). The schema has:

- `tier` (singular string) ← ❌ WRONG model, populated by dead code
- `tiers` (array) ← ✅ CORRECT model, populated by `buildKs4ContextMap()`

| Component | Status | Action |
|-----------|--------|--------|
| `programme-factor-extractors.ts` | ✅ DELETED | Was dead code |
| `extractTier` import in helpers | ❌ **BUILD FAILS** | Remove import and re-export |
| `tier` field in schema | ❌ Still exists | Remove from `curriculum.ts` |
| `tier: f.tier` in document creation | ❌ Still exists | Remove |
| `tier: extractTier()` in helpers | ❌ Still exists | Remove |

#### Actions Required (IN ORDER)

1. [ ] **URGENT - BUILD BROKEN**: Complete tier cleanup (remove `extractTier` import, remove `tier` field from schema + code)
2. [ ] **RUN**: `pnpm type-gen` to regenerate types
3. [ ] **RUN**: Quality gates to verify build passes
4. [ ] **FIX**: Derive unit `lesson_count`/`lesson_ids` from aggregated lesson data
5. [ ] **FIX**: Rename `sequence_ids` → `thread_slugs` in unit documents
6. [ ] **RE-INDEX**: Full re-ingestion after fixes
7. [ ] **VALIDATE**: Add post-ingestion validation tests

**Note**: Search experimentation is PAUSED until these ingestion issues are resolved. Optimising search against incomplete/incorrect data is wasteful.

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
