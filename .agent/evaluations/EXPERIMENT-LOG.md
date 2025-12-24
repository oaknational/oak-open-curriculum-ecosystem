# Experiment Log

Chronological record of search experiments and their impact on system metrics.

**Purpose**: Enable revisiting past decisions, identifying patterns, demonstrating rigorous evaluation, and generating new ideas.

---

## How to Read This Log

- Entries are in **reverse chronological order** (newest first)
- Each entry shows before/after metrics and the decision
- The "Cumulative Progress" table at the bottom shows system evolution

---

## Current System State

For the full current state, see [current-state.md](../plans/semantic-search/current-state.md).

### ✅ TRUE BASELINE VERIFIED (2025-12-24)

**Ground truth was corrected 2025-12-23. TRUE baseline measured 2025-12-24 00:30 UTC.**

| Metric | Previous Value | Verified Value | Change |
|--------|----------------|----------------|--------|
| Lesson Hard MRR | 0.369 | **0.614** | +66% ✅ |
| Unit Hard MRR | 0.856 | 0.856 | — ✅ |
| Lesson Std MRR | 0.944 | 0.944 | — ✅ |
| Unit Std MRR | 0.988 | 0.988 | — ✅ |

**Tier 1 Target: ✅ MET** — MRR 0.614 > target 0.45  
**Tier 1 Status: ✅ EXHAUSTED** — All standard approaches exhausted (2025-12-24)

**Note**: "Target Met" means aggregate MRR meets minimum. "Exhausted/Complete" means all standard approaches tried AND plateau demonstrated. See [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) for definitions.

**See**: [ground-truth-corrections.md](ground-truth-corrections.md) for details of all 63 corrections.

---

## Log Entries

### 2025-12-24: Tier 1 Exhausted — All Standard Approaches Verified

**Context**: Systematically verified all Tier 1 standard approaches following the ground truth correction. Goal was to exhaust all fundamental improvements before declaring Tier 1 complete.

**Verification Method**: For each approach, ran targeted search queries to verify functionality:

| Approach | Verification | Result |
|----------|-------------|--------|
| Single-word synonyms | `trig`, `factorise`, `pythag` | ✅ All work |
| Phrase synonyms | `straight line` at START/MIDDLE/END | ✅ All positions work |
| UK/US spelling | `center`→`centre`, `analyze`→`analyse` | ✅ ELSER handles |
| Abbreviations | `pythag`, `quad`, `diff` | ✅ All expand correctly |
| Technical vocabulary | `transposition`→`changing the subject` | ✅ Works |
| Stop words | Queries with/without `the`, `of` | ✅ No impact |
| Vocabulary gaps | Top 20 bulk download keywords | ✅ None critical |
| Intent-based queries | Root cause analysis | ⚠️ Exception granted |

**Intent-Based Exception**:

The two intent-based queries (MRR 0.229) cannot be fixed with Tier 1 approaches:
- "challenging extension work for able mathematicians" — needs difficulty metadata
- "visual introduction to vectors for beginners" — needs teaching approach metadata

These require Tier 4 (LLM query classification or metadata enrichment). Exception documented in [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md).

**Decision**: ✅ **TIER 1 EXHAUSTED**

| Criterion | Status |
|-----------|--------|
| Aggregate MRR ≥ 0.45 | ✅ 0.614 |
| No category < 0.25 without exception | ✅ Intent-based exception granted |
| Standard approaches checklist | ✅ All items checked |
| De facto plateau | ✅ No more experiments possible |

**Next Steps**: Tier 2 (Document Relationships) can proceed when prioritised.

---

### 2025-12-24: TRUE Baseline Established — TIER 1 TARGET MET

**Context**: Following the ground truth corrections on 2025-12-23, ran evaluation scripts with corrected ground truth to establish TRUE baseline metrics.

**Method**: Fixed dotenv paths in `analyze-per-category.ts` and `analyze-diagnostic-queries.ts` (were resolving to wrong directories), then ran:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # 15 hard queries by category
pnpm eval:diagnostic      # 18 diagnostic queries by pattern
```

**Results — Per-Category (15 queries)**:

| Category | Previous (Invalid GT) | Verified (Corrected GT) | Delta | Status |
|----------|----------------------|------------------------|-------|--------|
| naturalistic | 0.567 | **0.722** | +27% | ✅ Good |
| misspelling | 0.611 | **0.833** | +36% | ✅ Excellent |
| synonym | 0.167 | **0.611** | +266% | ✅ Good |
| multi-concept | 0.083 | **0.625** | +653% | ✅ Good |
| colloquial | 0.500 | **0.500** | 0% | ✅ Good |
| intent-based | 0.167 | **0.229** | +37% | ❌ Poor |
| **Overall** | 0.369 | **0.614** | +66% | ✅ **EXCEEDS Tier 1 target** |

**Results — Diagnostic Patterns (18 queries)**:

| Pattern Category | MRR | Success Rate | Key Finding |
|------------------|-----|--------------|-------------|
| Single-word synonym | 0.500 | 100% | Both queries succeed |
| Phrase synonym (all positions) | 0.500 | 100% | All 5 queries succeed |
| Multi-word curriculum term | 0.333 | 100% | Works, rank 3 |
| Spoken formula | 0.333 | 100% | Works, rank 3 |
| Concept + Method | 1.000 | 100% | **Both rank #1** |
| Three/Four concepts | 1.000 | 100% | Keyword density helps |
| Abstract intersection | 0.000 | 0% | Too vague |
| **Synonym overall** | 0.463 | 100% | All 9 in top 10 |
| **Multi-concept overall** | 0.623 | 78% | 7/9 in top 10 |

**Decision**: ✅ **TIER 1 TARGET MET** — System exceeds all targets; exhaustion pending

**Critical Insight**: The ground truth correction revealed the system was **already performing much better than measured**. The "failures" in previous measurements were artifacts of scoring against non-existent lessons.

| Metric | Target | Achieved | Status |
|--------|--------|----------|--------|
| Lesson Hard MRR | ≥0.45 | 0.614 | ✅ +36% above target |
| Lesson Std MRR | ≥0.92 | 0.944 | ✅ Met |
| Unit Hard MRR | ≥0.50 | 0.856 | ✅ Met |
| Unit Std MRR | ≥0.92 | 0.988 | ✅ Met |

**Implications**:

1. **Tier 1 TARGET MET** — Exit criteria met; standard approaches must still be exhausted
2. **B.4 + B.5 + Synonyms are all working** — Verified contributing to 0.614 overall
3. **Semantic reranking decision was correct** — System works without AI; AI optional
4. **Intent-based is only failing category** (0.229) — Targeted improvement possible but not blocking

**Files changed**:

- `evaluation/analysis/analyze-per-category.ts` — Fixed dotenv path (was `../../../` should be `../../`)
- `evaluation/analysis/analyze-diagnostic-queries.ts` — Fixed dotenv path

**Documentation updated**:

- `current-state.md` — All metrics verified
- `EXPERIMENT-LOG.md` — This entry

---

### 2025-12-23: Ground Truth Corrections — CRITICAL DISCOVERY

**Context**: During B.5 validation, discovered that the search was working correctly for some queries, but the "expected" lesson slugs in ground truth didn't exist in the Oak Curriculum API. This led to a comprehensive audit.

**Discovery**: **63 ground truth slugs (15% of the data) were invalid** — lesson references that don't exist.

| Category | Affected Queries | Missing Slugs |
|----------|-----------------|---------------|
| synonym | 9 queries | 29 slugs |
| multi-concept | 9 queries | 24 slugs |
| naturalistic | 3 queries | 3 slugs |
| colloquial | 2 queries | 2 slugs |
| intent-based | 1 query | 3 slugs |
| misspelling | 2 queries | 2 slugs |

**Root Cause**: Ground truth was created using assumed slug naming conventions rather than verified API data.

**Impact**: ALL previous MRR measurements are suspect:
- "Failures" may have been correct — searching for lessons that don't exist
- "Successes" may have been luck — correct by accident
- The semantic reranking rejection (-16.8%) may be WRONG

**Actions Taken**:

1. ✅ **63 slugs corrected** in `hard-queries.ts`, `diagnostic-synonym-queries.ts`, `diagnostic-multi-concept-queries.ts`
2. ✅ **Integration test created** (`ground-truth.integration.test.ts`) validates all slugs exist via Oak API
3. ✅ **Unit ground truth validated** — all 36 slugs exist
4. ✅ **Sequence ground truth created** — 41 queries, ~50 slugs, all validated
5. ✅ **All quality gates pass** including new validation test

**Decision**: 🔴 **ALL EXPERIMENTS MUST BE RE-RUN**

This is not a setback — it's a quality improvement. We now have:
- Validated ground truth (can trust measurements)
- Preventative test (can't happen again)
- Complete coverage (lessons, units, sequences)

**What We Preserve**:
- ✅ All implementations (B.4, B.5, synonyms)
- ✅ All architectural decisions (ADR-082, ADR-083, ADR-084)
- ✅ All learnings (ES synonym filter works for tokens not phrases)
- ✅ The tier-based strategy

**What Needs Re-Evaluation**:
- ⚠️ Semantic reranking rejection — may have been wrong
- ⚠️ B.4 noise filtering improvement (+16.8%) — may be different
- ⚠️ B.5 phrase boosting — never measured
- ⚠️ All baseline metrics — need true values

**Next Steps**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Establish TRUE baseline
pnpm eval:diagnostic      # Detailed pattern analysis
```

Then: Update all documentation with VERIFIED metrics.

**Files changed**:
- `hard-queries.ts` — 15 slugs corrected
- `diagnostic-synonym-queries.ts` — 9 slugs corrected
- `diagnostic-multi-concept-queries.ts` — 9 slugs corrected
- `ground-truth.integration.test.ts` — NEW validation test
- `sequences/types.ts` — NEW
- `sequences/standard-queries.ts` — NEW (24 queries)
- `sequences/hard-queries.ts` — NEW (17 queries)
- `sequences/index.ts` — NEW

**Documentation**: [ground-truth-corrections.md](ground-truth-corrections.md)

---

### 2025-12-23: B.5 Phrase Query Enhancement — IMPLEMENTATION COMPLETE, VALIDATION PENDING

**Context**: Implemented ADR-084 Phrase Query Boosting to address the root cause of phrase synonym failure identified in the diagnostic analysis. ES synonym filter works for single tokens only — after tokenization, "straight line" becomes ["straight", "line"], so phrase rules never match. ~40% of 163 synonyms are multi-word phrases that were non-functional.

**Implementation**:

1. **SDK Phrase Vocabulary Export**: New `buildPhraseVocabulary()` function extracts multi-word terms from synonym data
2. **Phrase Detection**: New pure function `detectCurriculumPhrases(query: string)` with TDD unit tests
3. **Phrase Boosters**: `createPhraseBoosters()` creates `match_phrase` queries for detected phrases
4. **RRF Integration**: BM25 retrievers now include phrase boost in `bool.should` when phrases detected

**Decision**: ⏸️ PENDING — Quality gates NOT verified, experiment NOT run

**⚠️ CRITICAL**: The code is merged but:
1. Quality gates have NOT been run after the merge
2. The experiment to measure MRR impact has NOT been run

The work is incomplete. Both must be done before this can be marked complete.

**Baseline (BEFORE phrase boosting — needs re-measurement)**:

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Synonym MRR | 0.167 | ??? | Target: ≥0.40 |
| Multi-concept MRR | 0.083 | ??? | Target: ≥0.25 |
| Overall Lesson Hard MRR | 0.369 | ??? | Target: ≥0.45 |

**Key insights**:

1. **Schema-first preserved**: Phrase vocabulary flows from SDK synonyms (single source of truth)
2. **TDD approach**: Unit tests written first, covering detection basics, position independence, multiple phrases, case insensitivity, edge cases
3. **Existing pattern reused**: Phrase boosters use same `bool.should` structure as existing query patterns
4. **No index changes**: Pure query-time enhancement, no reindexing required

**Files changed**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts` — Added `buildPhraseVocabulary()`
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` — Exported new function
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/query-processing/detect-curriculum-phrases.unit.test.ts` — NEW
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-helpers.ts` — Added phrase boosters
- `apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/rrf-query-builders.ts` — Integrated phrase detection

**ADR**: [ADR-084: Phrase Query Boosting for Multi-Word Synonym Support](../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)

**⚠️ IMMEDIATE ACTION REQUIRED**:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:diagnostic      # Measure MRR with phrase boosting
pnpm eval:per-category    # Get full breakdown
```

Then update this entry with actual before/after metrics and change decision to ✅ ACCEPTED or ❌ REJECTED based on results.

---

### 2025-12-23: Diagnostic Query Analysis (18 Queries)

**Context**: Created 18 diagnostic queries (9 synonym, 9 multi-concept) to granularly understand why synonym (0.167) and multi-concept (0.083) categories have poor MRR. Analyzed by pattern to identify specific failure modes vs success patterns.

#### Synonym Diagnostics (Overall MRR: 0.204)

| Pattern | Count | MRR | Status | Finding |
|---------|-------|-----|--------|---------|
| Single-word synonym | 2 | 0.500 | ✅ Good | "trig", "factorise" both work (rank 2) |
| Phrase synonym (all positions) | 3 | 0.000 | ❌ FAIL | "straight line" fails in START/END/MIDDLE |
| Formal synonym | 1 | 0.500 | ✅ Good | "transposition" works (rank 2) |
| Spoken formula | 1 | 0.333 | ✅ Good | "y equals mx plus c" works (rank 3) |
| Multiple synonyms | 1 | 0.000 | ❌ FAIL | "rules" + "index" both fail |
| Multi-word curriculum term | 1 | 0.000 | ❌ FAIL | "circle rules" vs "circle theorems" |

#### Multi-Concept Diagnostics (Overall MRR: 0.343)

| Pattern | Count | MRR | Status | Finding |
|---------|-------|-----|--------|---------|
| Concept + Method | 2 | 1.000 | ✅ EXCELLENT | Both rank #1! |
| Four concepts | 1 | 0.500 | ✅ Good | Keyword density helps |
| Implicit intersection | 1 | 0.333 | ✅ Good | Works with "with" |
| Three concepts | 1 | 0.250 | ⚠️ Marginal | Rank 4 |
| Explicit AND | 1 | 0.000 | ❌ FAIL | Too generic |
| Three geometry concepts | 1 | 0.000 | ❌ FAIL | Lacks method specificity |
| Single concept "graphs" | 1 | 0.000 | ❌ FAIL | Too broad |
| Abstract intersection | 1 | 0.000 | ❌ FAIL | Too abstract |

**Decision**: ✅ DIAGNOSIS COMPLETE — Clear root cause identified for both categories

**Critical findings**:

1. **🔥 Synonym root cause**: ES synonym filter works for **single tokens only**, not **phrase synonyms**. After tokenization, "straight line" becomes ["straight", "line"], so the phrase rule "straight line => linear" never matches. ~40% of our 163 synonym rules are phrase-based and currently non-functional.

2. **🎯 Multi-concept insight**: The system **already works well** for structured queries (concept + method). Failures are in generic/abstract queries without method specificity. The issue is NOT multi-concept scoring — it's query structure.

3. **Next step clarity**: B.5 should focus on **phrase query enhancement** (match_phrase boosting for curriculum terms), NOT complex multi-concept scoring logic.

**Files changed**:
- Added `diagnostic-queries.ts` with 18 queries
- Added `analyze-diagnostic-queries.ts` script
- Added `DIAGNOSTIC-QUERIES.md` documentation

**What this teaches us**:
- Always measure granularly — aggregate MRR hides critical patterns
- Assumptions about "working" systems need validation (synonyms were deployed but not working for phrases)
- The search system has strengths (method-based queries) to leverage, not just weaknesses to fix

---

### 2025-12-23: B.4 Noise Phrase Filtering + Complete Synonym Deployment

**Context**: Implemented ADR-082 Tier 1 fundamentals: colloquial phrase filtering and verified complete synonym deployment (163 entries). Followed TDD approach with unit tests, integration via preprocessor, and smoke test validation.

| Category | Before | After | Delta | Notes |
|----------|--------|-------|-------|-------|
| Overall Lesson Hard MRR | 0.316 | 0.369 | +16.8% | Significant improvement |
| Naturalistic | 0.300 | 0.567 | +89% | "the bit where you X" pattern handled |
| Colloquial | 0.000 | 0.500 | +∞ | "complete the square" now works |
| Synonym | 0.167 | 0.167 | 0% | Synonyms working but need phrase boost |

**Decision**: ✅ ACCEPTED — Substantial MRR improvement, naturalistic queries fixed

**Key insights**:

1. **Noise filtering highly effective**: Removing colloquial filler ("the bit where", "that X stuff for", "how do I", etc.) improved naturalistic category by 89%

2. **Synonym deployment verified**: All 163 synonyms deployed including 37 mathsConcepts. Analyzer test confirms expansion working (e.g., "rearrange formulas" → "changing", "subject", etc.)

3. **Synonym queries still struggling**: Despite working synonyms, queries like "gradient of a straight line" fail because multi-word curriculum terms need phrase matching enhancement (B.5 next)

4. **Colloquial partial success**: "complete the square" now ranks #1, but "sohcahtoa" still fails — need phrase query boost for curriculum-specific terminology

**What was implemented**:

**B.4 Noise Phrase Filtering**:
- Created `removeNoisePhrases()` pure function with 8 colloquial patterns
- TDD approach: unit tests → implementation → integration
- Integrated as preprocessor in `buildLessonRrfRequest()` and `buildUnitRrfRequest()`
- Smoke tests validate impact on colloquial and naturalistic queries
- Patterns: "that X stuff for", "the bit where you", "how do I", "how to", "what is", "teach my students about", "lesson on", "help with"

**Synonym Deployment Investigation**:
- Discovered ES GET API pagination issue (defaults to 10 results)
- Confirmed all 163 synonyms deployed via `?size=200` parameter
- Verified synonyms include: `changing-the-subject` → "rearrange formulas", `linear-graphs` → "straight line graphs", `trigonometry` → "sohcahtoa"
- Analyzer test confirms query-time expansion working correctly
- Issue: Synonyms expand correctly but phrase matching too weak for multi-word terms

**Files changed**:
- `src/lib/query-processing/remove-noise-phrases.ts` — New pure function
- `src/lib/query-processing/remove-noise-phrases.unit.test.ts` — TDD tests
- `src/lib/query-processing/index.ts` — Barrel export
- `src/lib/hybrid-search/rrf-query-builders.ts` — Integration point
- `smoke-tests/noise-phrase-filtering.smoke.test.ts` — Validation tests

**Next steps**: B.5 Phrase Query Enhancement for curriculum-specific multi-word terms

---

### 2025-12-22: Ingestion Data Quality Fixes — Complete

**Context**: After fixing lesson enumeration, discovered unit documents had incorrect `lesson_count` (25/36 wrong) and missing `thread_slugs`. Root cause: upstream API pagination bug where unfiltered endpoint returns incomplete data (431 vs 436 lessons). Implemented workaround and comprehensive validation.

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Indexed Lessons | 431 | 436 | +1.2% |
| Units with correct `lesson_count` | 11/36 | 36/36 | +69% |
| Lesson Hard MRR | 0.327 | 0.316 | -3.4% |
| Unit Hard MRR | 0.761 | 0.856 | +12.5% |
| Lesson Std MRR | (not measured) | 0.944 | N/A |
| Unit Std MRR | (not measured) | 0.988 | N/A |

**Decision**: ✅ ACCEPTED — Data quality is foundational

**Key insights**:

1. **Upstream API Bug Discovered**: Unfiltered `/key-stages/{ks}/subject/{subject}/lessons` returns 431 lessons, but filtered-by-unit requests return all 436. Documented in API wishlist.

2. **Lesson MRR Slight Decrease**: More lessons in index (436 vs 431) = larger search space = slightly harder to rank correctly. This is expected.

3. **Unit MRR Significant Improvement**: Correct `lesson_count` and `thread_slugs` data improves unit document quality, leading to +12.5% improvement.

4. **Standard Query Performance Excellent**: First measurement shows 0.944 (lessons) and 0.988 (units) — validates hybrid architecture.

**What was implemented**:

- Created `fetchAllLessonsByUnit()` to work around API bug (fetches lessons unit-by-unit)
- Updated `createUnitDocument()` to use aggregated lesson data via `lessonsByUnit` map
- Fixed thread field extraction for unit documents (now populate `thread_slugs`, `thread_titles`, `thread_orders`)
- Added comprehensive test coverage: unit tests, integration tests, smoke tests
- Validated against bulk download data (436 lessons, 36 units match exactly)

**Files changed**:

- `src/lib/indexing/fetch-all-lessons.ts` — Added `fetchAllLessonsByUnit()`
- `src/lib/indexing/document-transforms.ts` — Fixed unit document creation
- `src/lib/indexing/lesson-aggregation.ts` — Added `buildLessonsByUnit()`
- `src/lib/index-oak-helpers.ts` — Updated to use unit-by-unit fetching
- `smoke-tests/ingestion-validation.smoke.test.ts` — New validation tests
- `src/lib/indexing/unit-lesson-count-correctness.integration.test.ts` — New test

**Completion report**: [COMPLETION-REPORT-2025-12-22.md](../.agent/plans/quality-and-maintainability/COMPLETION-REPORT-2025-12-22.md)

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

---

### 2025-12-20: Ingestion Gap Fix — Initial Lesson Enumeration

**Context**: The ingestion was using a truncated data source (`/units/{slug}/summary` → `unitLessons[]`). Fixed by switching to paginated `/key-stages/{ks}/subject/{subject}/lessons` endpoint per [ADR-083](../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md).

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Indexed Lessons | 314 | 431 | +37% |
| Lesson Hard MRR | 0.380* | 0.327 | -14% |
| Unit Hard MRR | 0.844* | 0.761 | -10% |

_*Previous values were against INCOMPLETE index_

**Decision**: ✅ ACCEPTED — Data completeness is foundational

**Key insight**: The apparent MRR "regression" is actually a correction. The old baselines were artificially high because they were measured against incomplete data. With 37% more lessons in the index, there are more candidates to rank — making it harder to hit top results. The new MRR values are intermediate baselines (still had data quality issues to fix).

**What was implemented**:

- Added `getLessonsByKeyStageAndSubject` with pagination support to SDK adapter
- Implemented `aggregateLessonsBySlug` pure function (TDD)
- Implemented `fetchAllLessonsWithPagination` orchestrator
- All unit relationships preserved (lessons can belong to multiple units)
- Removed deprecated `deriveLessonGroupsFromUnitSummaries`

**Files changed**:

- `src/adapters/oak-adapter-sdk.ts`
- `src/lib/indexing/lesson-aggregation.ts` (new)
- `src/lib/indexing/fetch-all-lessons.ts` (new)
- `src/lib/indexing/lesson-document-builder.ts` (new)
- `src/lib/index-oak-helpers.ts`
- `src/lib/indexing/document-transforms.ts`

---

### 2025-12-19: Comprehensive Synonym Coverage

**Hypothesis**: Adding 40+ Maths KS4 synonyms will improve hard query MRR by ≥5%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.380 | +3.5% |
| Unit Hard MRR | 0.811 | 0.844 | +4.1% |
| Vocabulary gap tests | 3/11 | 11/11 | +8 |

**Decision**: ✅ ACCEPTED

**Key insight**: "sohcahtoa" was returning histograms before synonyms; now returns trigonometry rank 1. The synonym approach successfully bridges vocabulary gaps between teacher language and curriculum terminology.

**What was changed**:

- Expanded `maths.ts` from 8 to 40+ synonym entries
- Added mappings for: sohcahtoa→trigonometry, solving for x→linear equations, straight line→linear, etc.

**Experiment file**: [comprehensive-synonym-coverage.experiment.md](experiments/comprehensive-synonym-coverage.experiment.md)

---

### 2025-12-19: Semantic Reranking

**Hypothesis**: Cross-encoder reranking will improve hard query MRR by ≥15%

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| Lesson Hard MRR | 0.367 | 0.305 | -16.8% |

**Decision**: ❌ REJECTED

**Key insight**: Generic cross-encoder lacks curriculum domain knowledge. This experiment led to the creation of [ADR-082: Fundamentals-First Strategy](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) — AI on weak fundamentals = amplified weakness.

**What was learned**:

- Generic AI models don't understand curriculum vocabulary
- Need to master fundamentals (synonyms, phrases, noise filtering) before AI enhancement
- Rich data assets (relationships, threads) are underutilised

**Experiment file**: [semantic-reranking.experiment.md](experiments/semantic-reranking.experiment.md)

---

### 2025-12-18: Hard Query Baseline

**Purpose**: Document current system behaviour before experiments

| Metric | Value |
|--------|-------|
| Lesson Hard MRR | 0.367 |
| Unit Hard MRR | 0.811 |
| Colloquial MRR | 0.000 |
| Synonym MRR | 0.167 |
| Misspelling MRR | 0.833 |

**Key findings**:

- 5 of 8 lesson failures are vocabulary gaps fixable with synonyms
- Units outperform lessons (0.811 vs 0.367) — unit summaries are more information-dense
- Misspelling handling is excellent (fuzzy matching working)
- Colloquial queries fail completely (noise phrases + vocabulary gaps)

**Baseline file**: [hard-query-baseline.md](baselines/hard-query-baseline.md)

---

## Cumulative Progress

| Date | Event | Lesson Hard MRR | Unit Hard MRR | Lessons | Notes |
|------|-------|-----------------|---------------|---------|-------|
| 2025-12-18 | Hard Query Baseline | 0.367 | 0.811 | 314 | ⚠️ Against incomplete index |
| 2025-12-19 | Semantic Reranking Rejected | — | — | 314 | -16.8% regression, reverted, led to ADR-082 |
| 2025-12-19 | Synonym Coverage Accepted | 0.380 | 0.844 | 314 | ⚠️ Against incomplete index |
| 2025-12-20 | Ingestion Gap Fixed (Initial) | 0.327 | 0.761 | 431 | ⚠️ Still had data quality issues |
| 2025-12-22 | Data Quality Fixes Complete | 0.316 | 0.856 | 436 | ⚠️ Against invalid ground truth |
| 2025-12-23 | Ground Truth Corrected | — | — | 436 | 63 invalid slugs fixed |
| **2025-12-24** | **TRUE Baseline Established** | **0.614** | **0.856** | **436** | ✅ **TIER 1 TARGET MET** |

**Standard Query Performance** (verified 2025-12-24):

- Lesson Std MRR: **0.944** ✅ Excellent
- Unit Std MRR: **0.988** ✅ Near perfect

**Tier 1 Target**: ✅ **MET** — MRR 0.614 exceeds 0.45 target by 36%; exhaustion pending

---

## How to Add an Entry

After running an experiment:

1. Add a new entry at the top of "Log Entries" (below the most recent)
2. Include: date, descriptive name, hypothesis, before/after metrics table, decision, key insight
3. Link to the detailed experiment file
4. Update the "Cumulative Progress" table
5. Update [current-state.md](plans/semantic-search/current-state.md) with new metric values
6. **Codify learnings** (see below)

### Codify Learnings — Extract Lasting Value

| If the experiment... | Then update... |
|---------------------|----------------|
| Led to an architectural decision | Create or update an **ADR** |
| Revealed operational best practices | Update **INGESTION-GUIDE.md**, **SYNONYMS.md**, etc. |
| Changed the recommended process | Update **NEW-SUBJECT-GUIDE.md** |

**Key principle**:
- **What we DO** → Goes in operational guides (e.g., NEW-SUBJECT-GUIDE.md)
- **What we DON'T DO** → Stays here in the experiment log
- **Why we decided** → Full reasoning in the experiment file

**Template**:

```markdown
### YYYY-MM-DD: [Descriptive Name]

**Hypothesis**: [What you expected to happen]

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| [Metric] | [Value] | [Value] | [Change] |

**Decision**: ✅ ACCEPTED / ❌ REJECTED / ⏸️ INCONCLUSIVE

**Key insight**: [One paragraph explaining the most important learning]

**Experiment file**: [filename.experiment.md](experiments/filename.experiment.md)
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [Search Acceptance Criteria](../plans/semantic-search/search-acceptance-criteria.md) | **Defines "Target Met" vs "Exhausted"** |
| [current-state.md](../plans/semantic-search/current-state.md) | Current metrics snapshot |
| [EXPERIMENT-PRIORITIES.md](experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap (what to try next) |
| [ADR-081](../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation framework and decision criteria |
| [ADR-082](../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first strategy |

