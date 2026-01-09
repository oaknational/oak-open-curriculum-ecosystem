# Search Acceptance Criteria

**Last Updated**: 2026-01-08
**Status**: Active — Phase 8 Ready (Ground truth remediation complete)
**Purpose**: Defines what "exhausted" means for each tier, vs "target met"

---

## ✅ Ground Truth Validation Infrastructure COMPLETE (2026-01-08)

**Ground truth validation infrastructure rebuilt and all quality issues fixed.** 431 queries across 30 entries pass all 17 validation checks.

| Dimension | Before | After | Status |
|-----------|--------|-------|--------|
| Validation script | ❌ Broken | ✅ 17 checks | ✅ Fixed |
| Invalid slugs | 66 (5.2%) | 0 | ✅ Fixed |
| Empty expectedRelevance | 12 queries | 0 | ✅ Fixed |
| Missing categories | 130 queries | 0 | ✅ Fixed |
| Short queries | 78 queries | 0 | ✅ Fixed |
| Uniform scores | 47 queries | 0 | ✅ Fixed |
| Missing priority | 34 queries | 0 | ✅ Fixed |
| Total queries | 263 | **431** | ✅ Expanded |
| Quality errors | 408 | **0** | ✅ Complete |

**Infrastructure** (`ground-truths/generation/`):

- Type generation from bulk data (12,320 slugs)
- Zod schema validation
- Cross-subject contamination detection
- Analysis script for quality breakdown by entry

**Scripts**:

```bash
pnpm ground-truth:validate  # Run all 17 validation checks
pnpm ground-truth:analyze   # Detailed quality breakdown by entry
```

**Implication**: Benchmarks can now proceed. Ground truths are production-ready.

---

## 📐 Ground Truth Quality Requirements (2026-01-08)

**Quality analysis finding**: Ground truths fall into two distinct quality tiers.

| Quality | Entries | Uniform% | HasCat% | Characteristics |
|---------|---------|----------|---------|-----------------|
| **High** | 20/28 | 0% | 100% | Curated, specific queries, graded relevance |
| **Low** | 8/28 | 3-48% | 27-67% | Bulk-generated, topic-matching queries |

### Design Rules for Ground Truths

Ground truths must test **ranking quality**, not just topic presence.

#### Query Design Requirements

| Rule | Requirement | Rationale |
|------|-------------|-----------|
| Length | 3-7 words | Short enough to be realistic, long enough to be specific |
| Specificity | Only 2-4 lessons highly relevant | Tests ranking, not topic matching |
| Realism | Would a teacher type this? | Ground truths must reflect real usage |
| Single-word | Only for misspelling category | Single words are too ambiguous for ranking tests |

#### Expected Results Requirements

| Rule | Requirement | Rationale |
|------|-------------|-----------|
| Maximum slugs | 5 per query | More indicates query is too broad |
| Score=3 required | At least one | Ensures we're testing for a clear "right answer" |
| Graded relevance | Mix of 3s, 2s, and 1s | Tests ranking quality, not just presence |
| Verified slugs | Each against bulk data | Prevents invalid ground truth |

#### Review Checklist

Before committing any ground truth:

- [ ] Would a teacher actually type this query?
- [ ] Does at least one lesson directly answer the query (score=3)?
- [ ] Are other lessons appropriately scored (2 for related, 1 for tangential)?
- [ ] Is the query specific enough to test ranking, not just topic presence?
- [ ] Does the query have 3-7 words (or is misspelling category)?
- [ ] Are there 5 or fewer expected slugs?

**Full design rules**: See [ADR-085 Section 6](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md#6-ground-truth-design-rules)

---

## Critical Distinction: Target Met vs Exhausted

| Status | Definition |
|--------|------------|
| **Target Met** | Aggregate MRR meets minimum threshold for the tier |
| **Exhausted/Complete** | All standard approaches tried AND plateau demonstrated |

**A tier is NOT complete just because the target is met.** We must exhaust all reasonable fundamental improvements before declaring a tier complete.

---

## Metrics We Track

| Metric | Purpose | Primary Use |
|--------|---------|-------------|
| **MRR** | Finding first relevant result quickly | Main acceptance metric |
| **NDCG@10** | Overall ranking quality | Secondary quality metric |
| **Precision@10** | Proportion of relevant in top 10 | Noise detection |
| **Recall@10** | Proportion of relevant found | Completeness detection |
| **Zero-Hit Rate** | Queries returning nothing | Coverage gaps |
| **p95 Latency** | User experience | Performance budget |

> **Full definitions**: See [IR-METRICS.md](../../../apps/oak-open-curriculum-semantic-search/docs/IR-METRICS.md)

---

## Per-Category Thresholds

These thresholds apply to individual query categories within each tier:

| Threshold | MRR Value | Meaning |
|-----------|-----------|---------|
| **Critical** | < 0.25 | Blocks tier completion; requires investigation |
| **Investigation Required** | < 0.40 | Must analyse root cause; improvement expected |
| **Acceptable** | ≥ 0.40 | Good enough to proceed; may still improve |
| **Good** | ≥ 0.60 | Solid performance; no urgent action needed |
| **Excellent** | ≥ 0.80 | Outstanding; focus effort elsewhere |

### Current Category Status — Maths KS4 (2025-12-24)

| Category | MRR | Status |
|----------|-----|--------|
| Misspelling | 0.833 | Excellent |
| Naturalistic | 0.722 | Good |
| Multi-concept | 0.625 | Good |
| Synonym | 0.611 | Good |
| Colloquial | 0.500 | Acceptable |
| **Intent-based** | **0.229** | **Exception granted** (see below) |

### Cross-Curriculum Performance Tiers (2026-01-03)

| Tier | Subjects | Overall MRR |
|------|----------|-------------|
| ✅ Excellent | Maths, Art, Music, D&T, Citizenship | 0.61-0.82 |
| ⚠️ Acceptable | Computing, Cooking | 0.48-0.49 |
| ❌ Poor | French, Spanish, German, PE | 0.19-0.36 |
| ⏸️ Pending | English, Science, History, Geography, RE | — |

---

## Tier 1: Search Fundamentals

### Exit Criteria

| Criterion | Target | Current | Status |
|-----------|--------|---------|--------|
| Aggregate Hard MRR | ≥ 0.45 | 0.614 | ✅ Met |
| No category < 0.25 | All ≥ 0.25 | Intent=0.229 | ✅ Exception granted (see below) |
| Standard approaches exhausted | All checked | All checked | ✅ Exhausted |
| Plateau demonstrated | ≤5% improvement × 3 | Single measurement | ⚠️ Only 1 experiment with corrected GT |

### Standard Approaches Checklist

All items must be checked (attempted and documented) before Tier 1 can be declared "exhausted":

#### Synonym Coverage

- [x] Single-word synonyms — Verified: `trig`, `factorise`, `pythag` all work
- [x] Phrase synonyms — Verified via B.5: phrase boosting handles multi-word terms
- [x] UK/US spelling variants — Verified: ELSER handles `center`→`centre`, `analyze`→`analyse`
- [x] Abbreviation expansion — Verified: `pythag`→`Pythagoras`, `quad`→`quadratic`, `diff`→`difference` work
- [x] Technical vocabulary synonyms — Verified: `transposition`→`changing the subject` works

#### Query Processing

- [x] Noise phrase filtering (implemented B.4)
- [x] Phrase query boosting (implemented B.5)
- [x] Stop word handling review — Verified: "the", "of" don't affect results (2025-12-24)

#### Vocabulary Mining

- [x] Bulk download data mined for common terms — Top 20 keywords analysed (2025-12-24)
- [ ] Teacher query patterns analysed (if available) — No teacher query data available
- [x] Subject-specific vocabulary gaps identified — None critical found (reciprocal, scale factor, compound interest, Venn diagram, mutually exclusive all work)

#### Root Cause Analysis

- [x] Intent-based failure modes documented (see Documented Exceptions section)
- [x] Synonym diagnostic failures documented — None: all 9 queries pass (100% in top 10, MRR 0.463)
- [x] Each category < 0.40 has specific improvement plan — Only intent-based (0.229) is <0.40, exception granted

### Plateau Definition

Tier 1 is "exhausted" when:

1. All checklist items are checked (attempted and documented)
2. No category remains below critical threshold (< 0.25) without documented exception
3. ≤5% aggregate MRR improvement achieved across 3 consecutive experiments OR no more Tier 1 experiments possible
4. Root cause analysis complete for all poor-performing categories

### Plateau Status (2025-12-24)

**Status**: ✅ PLATEAU ACHIEVED (de facto)

While we only have one measurement with corrected ground truth (MRR 0.614), all Tier 1 approaches are exhausted:

| Approach | Status | Finding |
|----------|--------|---------|
| Synonyms (163 entries) | ✅ Complete | All patterns verified working |
| Noise filtering (B.4) | ✅ Implemented | +27% naturalistic category |
| Phrase boosting (B.5) | ✅ Implemented | All phrase positions work |
| UK/US variants | ✅ Verified | ELSER handles automatically |
| Abbreviations | ✅ Verified | `pythag`, `quad`, `diff` all work |
| Technical vocabulary | ✅ Verified | `transposition` works |
| Vocabulary mining | ✅ Complete | No critical gaps in top 20 keywords |
| Stop words | ✅ Verified | Not affecting results |
| Intent-based | ⚠️ Exception | Requires Tier 4 (no lesson metadata) |

**Conclusion**: No further Tier 1 experiments are possible. The plateau requirement is satisfied because all standard approaches have been attempted and no improvement opportunities remain at this tier.

---

## Documented Exceptions

### Intent-Based Category (0.229 MRR) — EXCEPTION GRANTED

**Investigated**: 2025-12-24  
**Decision**: Intent-based queries cannot be fixed with Tier 1 approaches

**Root Cause Analysis**:

The two intent-based queries express **pedagogical intent** (difficulty level, teaching approach) that requires metadata not present in the upstream Oak API:

| Query | Intent Type | Missing Capability |
|-------|-------------|-------------------|
| "challenging extension work for able mathematicians" | Difficulty + audience | No lesson difficulty/level field; "extension" ≠ "problem-solving" semantically |
| "visual introduction to vectors for beginners" | Teaching approach + sequence position | No teaching style metadata (visual/practical); no intro/consolidation classification |

**What We Have Indexed**:

- ✅ `tiers` — Foundation/Higher (unit-level, not lesson-level for all lessons)
- ✅ `lesson_keywords`, `key_learning_points`, `pupil_lesson_outcome`
- ✅ `teacher_tips`, `misconceptions` — pedagogical support

**What These Queries Need**:

- ❌ Lesson type classification (intro/consolidation/extension/problem-solving)
- ❌ Teaching approach metadata (visual/practical/discussion-based)
- ❌ Target audience indicators (beginners/advanced)
- ❌ NL→metadata mapping ("able mathematicians" → tier:higher)

**Why Synonyms Won't Help**:

- Adding `extension → problem-solving` conflates semantic meaning (extension = harder content ≠ problem-solving = application)
- "visual" and "beginners" have no curriculum equivalent to map to

**Actual Search Performance**:

- Query 1: Expected lesson at rank 3 (not complete failure)
- Query 2: Expected lesson at rank 8 (finding vectors, but can't filter by "visual" or "beginners")

**Tier Classification**:

- This is a **Tier 4 problem** requiring LLM query classification or metadata enrichment
- Ground truth marks priority as "exploratory" for this reason

**Conclusion**: Intent-based category exception is granted. The 0.229 MRR does NOT block Tier 1 completion because the failure mode is documented and cannot be addressed with Tier 1 approaches.

---

## Tier 2: Document Relationships

### Exit Criteria

| Criterion | Target | Current | Status |
|-----------|--------|---------|--------|
| Aggregate Hard MRR | ≥ 0.55 | 0.614 | ✅ Already exceeded |
| Tier 1 exhausted | Complete | ✅ Complete | 🔓 Ready to proceed |

### Standard Approaches Checklist

- [ ] Cross-reference boosting between lessons and units
- [ ] Prerequisite/successor relationship scoring
- [ ] Thread context integration
- [ ] Sequence context integration

---

## Tier 3: Modern ES Features

### Exit Criteria

| Criterion | Target | Current | Status |
|-----------|--------|---------|--------|
| Aggregate Hard MRR | ≥ 0.60 | 0.614 | ✅ Already exceeded |
| Tier 2 exhausted | Complete | Pending | ❌ Blocked by Tier 2 |

### Standard Approaches Checklist

- [ ] RRF k-parameter tuning experiments
- [ ] Per-field boost weight optimisation
- [ ] Query-time synonym expansion (vs index-time)
- [ ] kNN vector search evaluation

---

## Tier 4: AI Enhancement

### Entry Criteria

**Only consider Tier 4 if:**

1. Tiers 1-3 are exhausted (all checklists complete)
2. Aggregate MRR plateau demonstrated (≤5% improvement × 3)
3. Specific category gaps remain that cannot be addressed by traditional means
4. Cost/benefit analysis completed

### Approaches to Evaluate

- [x] ~~Semantic reranking with validated ground truth~~ — **DEFERRED** (revisit after Tier 2)
- [ ] Query expansion via LLM
- [ ] Pedagogical intent classification
- [ ] Lesson metadata enrichment

---

## Verification Method

To verify tier completion status:

```bash
# Run unified benchmark
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark --all                    # All subjects, all phases
pnpm benchmark --subject maths          # One subject
pnpm benchmark --phase secondary        # One phase

# Check results against this document
# - All categories meet thresholds
# - All checklist items completed
# - Plateau demonstrated (if claiming exhausted)
```

### Documentation Requirements

Each experiment must document:

1. What was attempted
2. Impact on metrics (aggregate and per-category)
3. Which checklist items were addressed
4. Decision (accepted/rejected) with rationale

**Where to Document**:

- Experiment design: [experiments/*.experiment.md](../../evaluations/experiments/)
- Results: [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)
- Ground truth corrections: [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)

---

## Experiment Protocol

**Canonical reference**: [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) — **Read this first**

For any search-affecting change:

1. **Design**: Create experiment file in [experiments/](../../evaluations/experiments/) using template
2. **Baseline**: Run `pnpm eval:per-category` and record results
3. **Implement**: Make the change
4. **Measure**: Run `pnpm eval:per-category` again
5. **Analyse**: Compare baseline vs new, per-category breakdown
6. **Record**: Update [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) with all results
7. **Decide**: Accept if improvement ≥ target, reject if regression

**Key principle**: No change is merged without measured impact.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [EXPERIMENTAL-PROTOCOL.md](../../evaluations/EXPERIMENTAL-PROTOCOL.md) | **Canonical**: How to run experiments |
| [ADR-081: Evaluation Framework](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Metrics and decision criteria |
| [ADR-082: Fundamentals-First](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Tier system rationale |
| [ADR-085: Ground Truth Discipline](../../../docs/architecture/architectural-decisions/085-ground-truth-validation-discipline.md) | Data integrity |
| [current-state.md](current-state.md) | Authoritative metrics |
| [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md) | Experiment history |
| [tier-1-fundamentals.md](archive/completed/tier-1-fundamentals.md) | Tier 1 plan (archived) |

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-07 | Added test coverage requirements section |
| 2026-01-03 | Updated: M3 ground truth expansion complete (263 queries, 16 subjects) |
| 2026-01-03 | Added cross-curriculum performance tiers |
| 2026-01-02 | Added critical gap section about ground truth coverage |
| 2025-12-24 | Added intent-based documented exception with root cause analysis |
| 2025-12-24 | Created — defines target met vs exhausted, per-category thresholds, standard approaches checklists |

---

## Test Coverage Requirements

### Ingestion Pipeline Test Coverage ✅

The ingestion pipeline has comprehensive test coverage at all levels (verified 2026-01-07):

| Component | Test Type | Status |
|-----------|-----------|--------|
| SDK Retry Middleware | Integration | ✅ 13 tests (HTTP + network exceptions) |
| Lesson Materials | Unit | ✅ 12 tests (all error kinds) |
| `safeGet` Helper | Unit | ✅ 3 tests (success, Error thrown, non-Error thrown) |
| SDK API Methods (error) | Unit | ✅ 8 tests |
| SDK API Methods (success) | Unit | ✅ 8 tests |

### Testing Generated Files

**Decision (2026-01-07)**: Test generated files through **integration at consumer level**, not via direct unit tests.

**Files affected**: `sdk-error-types.ts` (contains `classifyHttpError`, `classifyException`, etc.)

**Rationale**:

1. **Schema-first**: Generator is source of truth (`schema-first-execution.md`)
2. **Test behavior not implementation**: Direct tests couple to generated code structure
3. **Already covered**: `lesson-materials.unit.test.ts` exercises error classification behavior

### Acceptance Criteria for Test Coverage ✅

All criteria verified 2026-01-07:

- [x] All pure functions have unit tests
- [x] All integration points have integration tests
- [x] Error handling is tested at consumer level
- [x] No test gaps in critical paths (ingestion, search)
