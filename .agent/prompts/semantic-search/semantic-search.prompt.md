# Semantic Search - Fresh Chat Entry Point

**Status**: Part 1 PAUSED — Ingestion data quality fixes required  
**Architecture**: Four-Retriever Hybrid (BM25 + ELSER on Content + Structure)  
**Strategy**: [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)  
**Last Updated**: 2025-12-20

---

## 🔴 TL;DR — What's Blocking

**Search experimentation is PAUSED until ingestion data quality issues are fixed.**

| Issue | Impact | Status |
|-------|--------|--------|
| ~~Lesson count truncated~~ | ~~314 → 431 lessons~~ | ✅ Fixed (ADR-083) |
| Unit `lesson_count` wrong | 25/36 units have wrong counts | ❌ Blocking |
| Thread field naming error | `sequence_ids` should be `thread_slugs` | ❌ Blocking |
| ~~Dead `extractTier()` code~~ | File deleted | ✅ Deleted |
| Vestigial `tier` field | Singular field should be removed | 🧹 Cleanup |

**Full analysis**: [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)

**Fix required before resuming search experiments**: Derive unit `lesson_count` from aggregated lesson data, rename fields per [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary).

---

## 🔴 BLOCKING: Test Failures (2025-12-21)

**Architecture fixes complete, but tests still failing:**

```bash
pnpm build      # ✅ PASSES
pnpm type-check # ✅ PASSES  
pnpm lint:fix   # ✅ PASSES
pnpm test       # ❌ FAILS - 2 tests fail when run with full suite
```

### What Was Fixed

1. ✅ **OOM crash resolved** - removed process isolation (`isolate: false`, `pool: 'threads'`)
2. ✅ **Global state cleaned up** - removed `process.env` mutations from `test.setup.ts`
3. ✅ **Type shortcuts fixed** - replaced `unknown[]` with proper `BulkOperations` type
4. ✅ **Memory usage** - ~500MB (single process) vs ~4.4GB (89 processes)

### What's Still Blocking

**2 tests fail when run together, pass in isolation:**
- `ThemeSystemPreference.integration.test.tsx` (uses fake timers)
- `SearchPageLayout.error.unit.test.tsx` (uses multiple providers)

**Root cause**: Test interaction/pollution - some preceding test isn't cleaning up properly.

**See**: [test-isolation-architecture-fix.md](../../plans/semantic-search/test-isolation-architecture-fix.md) for investigation details.

**Next**: Fix test interactions, THEN resume data quality fixes (Phase 2-4).

---

## ⚠️ ASSUMPTIONS TO VERIFY (Next Session)

The previous session made the following assumptions. **Verify these before proceeding**:

### Tier Data Assumptions

| Assumption | How to Verify |
|------------|---------------|
| `tiers[]` array is correctly populated | `curl oak_lessons/_search` → check `tiers: ["foundation", "higher"]` |
| `tier_titles[]` array is correctly populated | Same query → check `tier_titles: ["Foundation", "Higher"]` |
| Tier comes from `/sequences/{sequence}/units` | Read `ks4-context-builder.ts` → `buildKs4ContextMap()` |
| `buildKs4ContextMap()` is called during ingestion | Read `index-oak.ts` → find call to `buildKs4ContextMap` |
| Tier data ends up in lesson documents | Read `document-transforms.ts` → `extractKs4DocumentFields()` call |

### Vestigial `tier` Field Assumptions

| Assumption | How to Verify |
|------------|---------------|
| `programme-factor-extractors.ts` is deleted | `ls apps/.../lib/indexing/programme-factor-extractors.ts` → should not exist |
| `tier` (singular) field still in schema | Read `type-gen/.../curriculum.ts` → look for `{ name: 'tier', ...}` |
| `tier` still referenced in document creation | `grep -r "tier: f.tier\|tier: fields.tier" apps/` |
| Tests still reference `extractTier` | `grep -r "extractTier" apps/.../indexing/*.test.ts` |

### Lesson Aggregation Assumptions

| Assumption | How to Verify |
|------------|---------------|
| `fetchAllLessonsWithPagination()` returns complete data | Read function in `fetch-all-lessons.ts` |
| `aggregateLessonsBySlug()` preserves all unit relationships | Read function + tests in `lesson-aggregation.ts` |
| Aggregated data is available for unit document building | Read `index-oak-helpers.ts` → check data flow |

### Unit `lesson_count` Problem

| Assumption | How to Verify |
|------------|---------------|
| Unit documents use truncated `unitLessons[]` | Read `document-transforms.ts` → `createUnitDocument()` |
| Rollup documents use truncated `unitLessons[]` | Read `document-transform-helpers.ts` → `extractRollupDocumentFields()` |
| 25/36 units have wrong counts | ES query or compare to bulk download |

**If any assumption is wrong, update the plan before proceeding.**

---

## Before You Start (MANDATORY)

### 1. Read Foundation Documents

These are non-negotiable. Read them before ANY work:

1. **[rules.md](../../directives-and-memory/rules.md)** — TDD, quality gates, no type shortcuts
2. **[testing-strategy.md](../../directives-and-memory/testing-strategy.md)** — Test types and TDD at ALL levels
3. **[schema-first-execution.md](../../directives-and-memory/schema-first-execution.md)** — Generator-first architecture
4. **[ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)** — Fundamentals-first strategy

### 2. The First Question

Before every change, ask: **"Could it be simpler without compromising quality?"**

### 3. Cardinal Rule

If the upstream schema or SDK changes, running `pnpm type-gen` followed by `pnpm build` MUST be sufficient to bring all workspaces into alignment.

---

## Current State

For current metrics, index status, and known issues, see:

**[current-state.md](../../plans/semantic-search/current-state.md)** — THE single source of truth for current metrics

Quick summary:

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Lesson Hard MRR | 0.327 | ≥0.50 | ❌ Gap |
| Unit Hard MRR | 0.761 | ≥0.50 | ✅ Met |
| Indexed Lessons | 431 | 431 | ✅ Complete |
| Unit `lesson_count` Correct | 11/36 | 36/36 | ❌ **Blocking** |

### Two Distinct Work Streams

**Stream 1: Ingestion Data Quality (BLOCKING)**

Unit documents have incorrect data. Search experimentation cannot proceed until fixed.

See: [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)

**Stream 2: Search Optimisation (PAUSED)**

Tier 1-4 experiments per ADR-082. Paused until Stream 1 complete.

See: [part-1-search-excellence.md](../../plans/semantic-search/part-1-search-excellence.md)

---

## 🔴 REQUIRED ACTIONS: Ingestion Data Quality Fixes

Before continuing with Tier 1 search experiments, complete these actions:

### Action 1: Review Documentation

- **Discrepancy Analysis**: [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)
- **Current State**: [current-state.md](../../plans/semantic-search/current-state.md)
- **ADR-083**: [Complete Lesson Enumeration Strategy](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

### Action 2: Fix Unit `lesson_count` (TDD)

Unit documents derive `lesson_count` from truncated `unitLessons[]`. Fix by deriving from aggregated lesson data:

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
// Use lessonsByUnit for unit document lesson_count and lesson_ids
```

### Action 3: Fix Thread Field Naming

Per [Oak Glossary](https://open-api.thenational.academy/docs/about-oaks-data/glossary):

- `sequence_ids` contains THREAD data (wrong name)
- Rename to `thread_slugs`, add `thread_titles`, `thread_orders`

### Action 4: Remove Vestigial `tier` Field

The singular `tier` field is vestigial (per ADR-080, tier is many-to-many). Complete cleanup:

| File | Change |
|------|--------|
| ~~`programme-factor-extractors.ts`~~ | ✅ Already deleted |
| `type-gen/.../curriculum.ts` | Remove `{ name: 'tier', ...}` from `LESSON_FIELDS` and `UNIT_ROLLUP_FIELDS` |
| `document-transform-helpers.ts` | Remove `tier` from return types, remove `extractTier` import |
| `document-transforms.ts` | Remove `tier: f.tier` and `tier: fields.tier` |
| `*.unit.test.ts` | Remove `extractTier` tests and `tier` assertions |

After changes: `pnpm type-gen` to regenerate types.

### Action 5: Re-ingest and Validate

```bash
redis-cli FLUSHALL  # Flush stale cache (already done 2025-12-20)
cd apps/oak-open-curriculum-semantic-search
pnpm index:maths:ks4
# Run validation tests from discrepancy log
```

### Completed Actions ✅

- ✅ **Lesson ingestion fixed**: 314 → 431 lessons (ADR-083)
- ✅ **Redis cache flushed** (2025-12-20)
- ✅ **Discrepancy analysis complete**: See [curriculum-fetching-discrepancy-log.md](../../evaluations/baselines/curriculum-fetching-discrepancy-log.md)
- ✅ **Tier data verified**: Correctly populated via `tiers`/`tier_titles` from KS4 context map (ASSUMPTION - verify)
- ✅ **Dead code deleted**: `programme-factor-extractors.ts` removed

---

## Historical Context

For the full history of experiments and their impact:

**[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological experiment history

---

## Current Work

The active plan with detailed tasks:

**[Part 1: Search Excellence](../../plans/semantic-search/part-1-search-excellence.md)**

Current tier: **Tier 1 — Search Fundamentals**

Next tasks:

- B.4 Noise phrase filtering
- B.5 Phrase query enhancement
- B.6 Validate Tier 1 (MRR ≥0.45)

---

## Fresh Chat First Steps (MANDATORY)

### 1. Run Quality Gates (from repo root)

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**All gates must pass. Fail fast. No exceptions.**

### 2. Re-Index Fresh Data (Before Any Search Experiments)

**Never run search quality smoke tests against stale indices.**

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm es:setup
pnpm es:ingest-live -- --subject maths --keystage ks4
pnpm es:status
```

### 3. Run Smoke Tests

```bash
pnpm vitest run -c vitest.smoke.config.ts hybrid-superiority
pnpm vitest run -c vitest.smoke.config.ts hard-query-baseline
```

---

## Test Types for Search Work

| Test Type | What It Tests | File Pattern |
|-----------|---------------|--------------|
| **Unit** | Pure functions, no mocks, no IO | `*.unit.test.ts` |
| **Integration** | Units + simple injected mocks | `*.integration.test.ts` |
| **Smoke** | Running ES with real data | `smoke-tests/*.smoke.test.ts` |

**Critical**: Smoke tests are out-of-process tests against a running Elasticsearch instance.

---

## Key File Locations

### Current State & History

| File | Purpose |
|------|---------|
| [current-state.md](../../plans/semantic-search/current-state.md) | Current metrics, index status, known issues |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Chronological experiment history |
| [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |

### Active Plan

| File | Purpose |
|------|---------|
| [README.md](../../plans/semantic-search/README.md) | Navigation hub |
| [part-1-search-excellence.md](../../plans/semantic-search/part-1-search-excellence.md) | Current work |

### Synonyms

```text
packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/
├── maths.ts     # Maths KS4 synonyms (40+ entries)
└── index.ts     # Barrel export
```

### Implementation

```text
apps/oak-open-curriculum-semantic-search/
├── src/lib/hybrid-search/      # RRF query builders
├── src/lib/search-quality/     # Ground truth, metrics
├── smoke-tests/                # Search quality benchmarks
└── docs/                       # INGESTION-GUIDE, SYNONYMS, etc.
```

---

## Key ADRs

| ADR | Title |
|-----|-------|
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Fundamentals-First Strategy** |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Search Evaluation Framework |
| [ADR-063](../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) | SDK Domain Synonyms |

---

## Environment

Required in `apps/oak-open-curriculum-semantic-search/.env.local`:

```bash
ELASTICSEARCH_URL=https://your-elasticsearch-url-here
ELASTICSEARCH_API_KEY=your_elasticsearch_api_key_here
OAK_API_KEY=your_oak_api_key_here
SEARCH_API_KEY=your_search_api_key_here
LOG_LEVEL=info
```

---

## Principles (from Foundation Documents)

1. **First Question**: Could it be simpler without compromising quality?
2. **TDD at ALL levels**: RED → GREEN → REFACTOR, tests FIRST
3. **Schema-first**: All types flow from schema via `pnpm type-gen`
4. **No type shortcuts**: Never `as`, `any`, `!`, `Record<string, unknown>`
5. **Fail fast**: Never silently fail, helpful error messages
6. **No global state in tests**: Config as parameters, simple injected mocks
7. **Delete dead code**: If unused, delete it

---

**Ready?** Start with [Part 1: Search Excellence](../../plans/semantic-search/part-1-search-excellence.md)
