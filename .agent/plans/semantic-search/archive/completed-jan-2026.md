# Semantic Search — Completed Work (Archived)

> **Archived**: 2026-01-27
>
> This file has been archived. It captures work completed during the initial ground truth development phase (Jan 2026). The metrics and MRR values cited here are **stale** — the ground truth structure was completely redesigned on 2026-01-25/26 and these historical values no longer apply to the current system.
>
> **Why archived**: The document was growing long with increasingly outdated historical detail that is not useful for current work. Key decisions are captured in ADRs; the execution history here is now purely historical.
>
> For current state, see:
> - [roadmap.md](../roadmap.md)
> - [current-state.md](../current-state.md)
> - [ground-truth-redesign-plan.md](../active/ground-truth-redesign-plan.md)

---

**Original Last Updated**: 2026-01-27

Historical record of completed milestones from the initial development phase.

---

## ✅ Subject Filter Fix — KS4 Science (2026-01-27)

**Status**: ✅ Complete  
**ADRs**: [ADR-101](../../../docs/architecture/architectural-decisions/101-subject-hierarchy-for-search-filtering.md), [ADR-105](../../../docs/architecture/architectural-decisions/105-sdk-generated-search-constants.md)  
**Archive**: [subject-filter-fix-plan.md](archive/completed/subject-filter-fix-plan.md)

Fixed incorrect subject filtering that prevented granular KS4 science queries.

### The Problem

KS4 science sub-disciplines (physics, chemistry, biology, combined-science) were normalised to "science" during indexing, losing the original subject slug. This blocked 11 ground truth queries.

### What Was Fixed

| Phase | Change |
|-------|--------|
| 1. SDK Generator | Created `generate-subject-hierarchy.ts` — exports `SUBJECT_TO_PARENT`, `isKs4ScienceVariant()`, types |
| 2. Indexing | `subject_slug` preserves original (e.g., `physics`), `subject_parent` derived from lookup |
| 3. Query Helpers | Smart filtering: KS4 variant at KS4 → `subject_slug`, otherwise → `subject_parent` |
| 4. Re-index | Bulk re-indexed with correct values |

### Verification

| Subject | Lessons | subject_parent |
|---------|---------|----------------|
| physics | 176 | science |
| chemistry | 83 | science |
| biology | 39 | science |
| combined-science | 301 | science |
| **Total science** | **1,278** | — |

---

## ✅ Ground Truth Review Sessions 6-9 (2026-01-16 — 2026-01-17)

**Status**: ✅ Complete (9/30 subject-phases reviewed)  
**Checklist**: [ground-truth-review-checklist.md](active/ground-truth-review-checklist.md)

Deep exploration reviews using enhanced methodology (5-10 MCP summaries, comparison tables, unit ordering verification).

### Sessions Completed

| Session | Subject-Phase | MRR | Key Changes |
|---------|---------------|-----|-------------|
| 6 | cooking-nutrition/primary | 0.563 | Added 5 new slugs, revealed ranking weakness |
| 7 | cooking-nutrition/secondary | 0.833 | cross-topic corrected (theory → cooking+nutrition) |
| 8 | design-technology/primary | 0.875 | Added `rotary-motion`, upgraded `card-slider-mechanisms` |
| 9 | design-technology/secondary | 0.875 | Added `empathy`, `material-sustainability`, `realistic-rendering-techniques` |

### Key Learnings

1. **Low MRR with high R@10** indicates results ARE found but poorly ranked — search quality insight, not ground truth error
2. **Unit structure analysis** critical for skill-level queries (beginner/intro) — use `get-units-summary` to verify lesson ordering
3. **Key learning points** reveal relevance not visible in titles — scan full curriculum, not just title searches

---

## ✅ Complete Subject Synonym Coverage (2026-01-17)

**Status**: ✅ Complete  
**ADR**: [ADR-100](../../../docs/architecture/architectural-decisions/100-complete-subject-synonym-coverage.md)  
**Archive**: [synonym-complete-coverage.md](archive/completed/synonym-complete-coverage.md)

All 17 subjects now have domain-specific synonym files, unblocking ground truth review.

### What Was Added

| Subjects | Files Added | Approximate Entries |
|----------|-------------|---------------------|
| Art, D&T, PE | 3 files | ~130 entries |
| Citizenship, French, German, Spanish | 4 files | ~105 entries |
| Religious Education, RSHE/PSHE | 2 files (HIGH sensitivity) | ~95 entries |

### Impact

- Ground truth re-review for sessions 1-5 completed with new synonyms deployed
- All subject-phases now have synonym support for search queries
- **Total corpus**: ~580 synonym entries across 17 subjects

---

## ✅ Transcript-Aware RRF Score Normalisation (2026-01-13)

**Status**: ✅ Complete  
**ADR**: [ADR-099](../../../docs/architecture/architectural-decisions/099-transcript-aware-rrf-normalisation.md)  
**Archive**: [transcript-aware-rrf.md](archive/completed/transcript-aware-rrf.md)

The 4-way RRF was architecturally broken — documents without transcripts were penalised by 50%.

### What Was Fixed

| Issue | Fix |
|-------|-----|
| Documents without transcripts could only appear in 2/4 retrievers | Post-RRF score normalisation |
| MFL subjects (0% transcript coverage) structurally disadvantaged | Scores now correctly normalised |
| PE subjects (~0.6% transcript coverage) structurally disadvantaged | Scores now correctly normalised |

### Deliverables

| Deliverable | Status |
|-------------|--------|
| `normaliseRrfScores()` pure function | ✅ `rrf-score-normaliser.ts` |
| Unit tests (17 tests) | ✅ `rrf-score-normaliser.unit.test.ts` |
| Integration tests (6 tests) | ✅ `lessons.integration.test.ts` |
| DI refactor per ADR-078 | ✅ All search functions injectable |
| ADR-099 created | ✅ Complete |
| All quality gates | ✅ Passing |

### Key Insight

**Unit search does NOT need normalisation** — units aggregate lesson content, so `unit_content` is always present. Only lessons have the transcript/no-transcript variation.

---

## ✅ Phase 1: Ground Truth Pruning & Curation (2026-01-12)

**Status**: ✅ Structure Complete → 🔄 Now validating through benchmarking

All 30 subject-phase entries restructured and AI-curated. Now iterating through benchmarks to validate.

| Metric | Value |
|--------|-------|
| Subject-phase entries | 30 |
| Categories per entry | 4 |
| Queries per category | 1 |
| **Total queries** | **120** |
| AI-curated | 100% |
| Quality gates | All passing |
| **Benchmark validated** | ⏳ In progress |

### What Was Done

1. **Restructured** all ground truths from topic-based to category-based files
2. **Pruned** from ~480 queries to exactly 120 (1 per category per entry)
3. **AI-as-judge curation** for each query comparing expected vs actual results
4. **Updated documentation** (GROUND-TRUTH-PROCESS.md, current-state.md)
5. **Cleaned up exports** removing legacy `_STANDARD_QUERIES`, `_HARD_QUERIES`

### Next Step: Benchmark & Iterate

Ground truths are assumed good, but need validation. Run `pnpm benchmark --all` and iterate until failures are caused by search quality, not ground truth quality.

### Category Structure

| Category | Purpose |
|----------|---------|
| `precise-topic` | Curriculum-aligned terminology |
| `natural-expression` | Teacher natural language |
| `imprecise-input` | Typos, misspellings |
| `cross-topic` | Concept intersections |

### Limitations Documented

Ground truths measure expected slug position, NOT user satisfaction. All reporting must include scope disclaimer.

---

## Previous: Three-Stage Ground Truth Validation (Superseded)

**Status**: ⚠️ **Superseded** — Replaced by Phase 1 restructure
**Original Completion Date**: 2026-01-09

### Three-Stage Validation Model

| Stage | What It Proves | Status |
|-------|----------------|--------|
| **1. Type-Check** | Data integrity (required fields) | ✅ PASS |
| **2. Runtime Validation** | Semantic rules (16 checks) | ✅ PASS |
| **3. Qualitative Review** | Production readiness | ⚠️ **INCOMPLETE** |

### Stage 3 Qualitative Review (2026-01-09) — INCOMPLETE

| Metric | Claimed | Actual |
|--------|---------|--------|
| Total queries reviewed | 474 | ~50 (5 entries only) |
| Subject/phase entries reviewed | 30 | 5 |

**Only reviewed**: art/primary, art/secondary, computing/primary, computing/secondary, french/secondary

### Remediation Results (2026-01-08)

| Issue | Before | After | Status |
|-------|--------|-------|--------|
| Invalid slugs | 66 | 0 | ✅ |
| Empty expectedRelevance | 12 | 0 | ✅ |
| Missing categories | 130 | 0 | ✅ |
| Short queries | 78 | 0 | ✅ |
| Uniform scores | 47 | 0 | ✅ |
| Missing priority | 34 | 0 | ✅ |
| Single-slug queries | 10 | 0 | ✅ |
| No score=3 | 21 | 0 | ✅ |
| Missing descriptions | 275 | 0 | ✅ |
| Category coverage gaps | 43 | 0 | ✅ |

---

## Test Coverage (2026-01-07)

| Component | Tests | Status |
|-----------|-------|--------|
| `safeGet` | 3 unit tests | ✅ Complete |
| SDK API Methods (error) | 8 unit tests | ✅ Complete |
| SDK API Methods (success) | 8 unit tests | ✅ Complete |
| SDK Retry Middleware | 13 integration tests | ✅ Complete |
| Lesson Materials | 12 unit tests | ✅ Complete |

**Decision**: Test through **integration at consumer level**, not direct unit tests.

---

## Milestone 1: Complete ES Ingestion ✅

| Metric | Value |
|--------|-------|
| Documents indexed | 16,414 |
| Initial failures | 17 (0.10%) |
| Final failures | 0 |
| Duration | ~22 minutes |

See [ADR-096](../../../docs/architecture/architectural-decisions/096-es-bulk-retry-strategy.md).

---

## Milestone 2: Sequence Indexing ✅

| Index | Count |
|-------|-------|
| `oak_sequences` | 30 |
| `oak_sequence_facets` | 57 |

---

## Milestone 4: DRY/SRP Refactoring ✅

All document builders follow the shared pattern.

---

## Milestone 5: Data Completeness ✅

All fields resolved with appropriate sources (API supplementation, bulk data extraction).

---

## Result Pattern Compliance ✅ (2026-01-07)

Network error handling per ADR-088:

| Component | Change |
|-----------|--------|
| SDK Retry Middleware | Catches and retries network exceptions |
| `safeGet` Helper | Wraps `client.GET`, converts exceptions to `Result.Err` |
| SDK API Methods | All 8 `makeGet...` functions use `safeGet` |
| File Split | `sdk-api-methods.ts` → 4 smaller modules |

---

## M3 Phases (Infrastructure)

| Phase | Focus | Status |
|-------|-------|--------|
| 1-4 | SDK, Indexing, Filters, CLI | ✅ Complete |
| 5a | Ground truth restructure (ks→phase) | ✅ Complete (2026-01-05) |
| 5b-d | Create ALL ground truths | ✅ Complete (structure only) |
| 6 | ES Re-index (add phase_slug) | ⏸️ Cancelled |
| 7 | Unified evaluation infrastructure | ✅ Complete (2026-01-06) |

---

## Key Findings (Unverified)

**Note**: These findings need re-verification after ground truth review.

- **Creative subjects excel**: Art (0.741), Music (0.722), D&T (0.815) MRR
- **Languages struggle**: French (0.190), Spanish (0.294), German (0.194)
- **Misspelling universal weakness**: PE, Languages fail on typos
- **Synonym gaps**: "coding"→"programming", "saying no"→"negation"
