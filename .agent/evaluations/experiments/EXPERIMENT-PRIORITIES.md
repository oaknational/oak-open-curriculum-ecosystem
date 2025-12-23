# Search Experiment Priorities

**Status**: 🔄 RE-BASELINE REQUIRED — Ground truth corrected, all measurements need verification  
**Last Updated**: 2025-12-23 23:00 UTC  
**Principle**: Master fundamentals before adding complexity  
**Governing ADR**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## 🔴 CRITICAL: Ground Truth Corrections Applied (2025-12-23)

**All previous MRR measurements are UNVERIFIED.** A comprehensive audit revealed **63 invalid slugs** (15% of ground truth data) — lesson references that didn't exist in the Oak Curriculum API.

### What Happened

1. Ground truth queries referenced slugs that were fabricated or incorrectly named
2. MRR calculations scored against phantom lessons that don't exist
3. "Failing" queries may have been correct — they couldn't find lessons that don't exist
4. "Passing" queries may have been accidental — correct by luck, not algorithm

### What Was Fixed

1. ✅ **63 slugs corrected** across `hard-queries.ts`, `diagnostic-synonym-queries.ts`, `diagnostic-multi-concept-queries.ts`
2. ✅ **Integration test created** (`ground-truth.integration.test.ts`) validates all slugs exist via Oak API
3. ✅ **Unit and sequence ground truth added** with full validation
4. ✅ **All quality gates pass** including the new validation tests

### What Must Happen Now

**Re-run ALL experiments with corrected ground truth** to establish TRUE baselines:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # New hard query baseline (lessons)
pnpm eval:diagnostic      # New diagnostic baseline
```

**Then**: Update all metrics in documentation with actual measured values.

### What We Keep

We are **NOT going back in time**. We preserve:

- ✅ All implementation work (B.4 noise filtering, B.5 phrase boosting)
- ✅ All architectural decisions (ADR-082, ADR-083, ADR-084)
- ✅ The tier-based strategy (fundamentals first)
- ✅ The learnings (generic AI reranking failed, phrase synonyms need special handling)

We are going **forward with enhanced understanding** — now we can trust our measurements.

---

## Philosophy

> "We should be able to do an excellent job with traditional methods, and an _amazing_ job with non-AI recent search methods, and a _phenomenal_ job once we take that already optimised approach and add AI into the mix."

This document organises experiments into **tiers** based on the principle that:

1. **Fundamentals first**: Synonyms, phrase matching, noise filtering, cross-referencing
2. **Structure second**: Exploiting the rich relationships in our data
3. **Modern techniques third**: Advanced ES features (RRF, Linear, etc.)
4. **AI last**: Reranking, query expansion, RAG — only when fundamentals are exhausted

---

## The Search Excellence Pyramid

```
                           ┌─────────────────┐
                           │   PHENOMENAL    │  ← Tier 4: AI Enhancement
                           │                 │     Reranking, RAG, Query Expansion
                           │                 │     ONLY after lower tiers mastered
                       ┌───┴─────────────────┴───┐
                       │       EXCELLENT         │  ← Tier 3: Modern ES Features
                       │                         │     RRF optimisation, Linear, MLT
                       │                         │     Requires Tier 2 complete
                   ┌───┴─────────────────────────┴───┐
                   │           VERY GOOD             │  ← Tier 2: Document Relationships
                   │                                 │     Cross-referencing, joins
                   │                                 │     Requires Tier 1 complete
               ┌───┴─────────────────────────────────┴───┐
               │              GOOD                       │  ← Tier 1: Search Fundamentals
               │                                         │     Synonyms, phrases, noise
               │              ← WE ARE HERE              │
               └─────────────────────────────────────────┘
```

---

## Current Status (2025-12-23)

| Tier  | Name          | Status                  | Previous MRR | Verified MRR | Target | Notes                              |
| ----- | ------------- | ----------------------- | ------------ | ------------ | ------ | ---------------------------------- |
| **1** | Fundamentals  | 🔄 NEEDS RE-MEASUREMENT | 0.369        | ???          | ≥0.45  | B.4 + B.5 implemented, unverified  |
| **2** | Relationships | ❌ Not Started          | —            | —            | ≥0.55  | Cross-referencing not exploited    |
| **3** | Modern ES     | ⚠️ Partial              | —            | —            | ≥0.60  | RRF working, Linear not tested     |
| **4** | AI            | ⏸️ NEEDS RE-EVALUATION  | -16.8%       | ???          | ≥0.75  | May have been wrongly rejected     |

**Next Priority**: Re-establish baselines with corrected ground truth

---

## Re-Baseline Plan

### Step 1: Establish TRUE Baselines

Run all evaluation scripts against corrected ground truth:

```bash
cd apps/oak-open-curriculum-semantic-search

# Lesson hard queries (15 queries, 6 categories)
pnpm eval:per-category

# Diagnostic queries (18 queries, detailed patterns)
pnpm eval:diagnostic

# Unit queries (if script exists)
# TODO: Create unit evaluation script if needed
```

Document actual measured values in:
- `current-state.md` — metrics tables
- `EXPERIMENT-LOG.md` — new entry for "Ground Truth Correction Baseline"
- `hard-query-baseline.md` — full update with new numbers

### Step 2: Validate Implementation Impact

With true baselines established, measure the impact of implemented features:

| Feature | Status | Claimed Impact | True Impact |
|---------|--------|----------------|-------------|
| B.4 Noise Filtering | ✅ Implemented | +16.8% | ??? (re-measure) |
| B.5 Phrase Boosting | ✅ Implemented | (never measured) | ??? (measure) |
| Synonyms (163 entries) | ✅ Deployed | Working | ??? (validate) |

### Step 3: Re-Evaluate Rejected Experiments

| Experiment | Original Decision | Action |
|------------|-------------------|--------|
| **Semantic Reranking** | ❌ REJECTED (-16.8%) | **MUST RE-RUN** — decision may be wrong |
| B.3 Synonym Coverage | ✅ ACCEPTED (+3.5%) | Verify improvement holds |
| B.4 Noise Filtering | ✅ ACCEPTED (+16.8%) | Verify improvement holds |

**Critical**: The semantic reranking rejection was based on invalid ground truth. We may have discarded a working approach.

---

## Tier 1: Search Fundamentals (Priority: CRITICAL)

These are non-AI techniques with decades of proven value.

### Comprehensive Synonym Coverage

**Status**: ✅ Implemented, 🔄 NEEDS RE-MEASUREMENT  
**Effort**: Medium  
**Previous Impact**: +3.5% (UNVERIFIED)

| Before                | After                                                 |
| --------------------- | ----------------------------------------------------- |
| 8 maths synonym rules | 40+ curriculum-specific rules                         |
| Generic English       | Maths KS4 vocabulary (sohcahtoa, solving for x, etc.) |

**Qualitative wins to verify with correct ground truth**:
- "sohcahtoa" → Should return trigonometry
- "solving for x" → Should find linear equations
- "straight line graphs" → Should find linear graphs

**Details**: See [comprehensive-synonym-coverage.experiment.md](./comprehensive-synonym-coverage.experiment.md)

---

### Noise Phrase Filtering (B.4)

**Status**: ✅ Implemented, 🔄 NEEDS RE-MEASUREMENT  
**Effort**: Low  
**Previous Impact**: +16.8% naturalistic improvement (UNVERIFIED)

| Query                                   | Noise               | Signal                |
| --------------------------------------- | ------------------- | --------------------- |
| "that sohcahtoa stuff for triangles"    | "that...stuff for"  | "sohcahtoa triangles" |
| "the bit where you complete the square" | "the bit where you" | "complete the square" |

**Implementation**: `removeNoisePhrases()` pure function with 8 colloquial patterns.

---

### Phrase Query Enhancement (B.5)

**Status**: ✅ Implemented, ❌ NEVER MEASURED  
**Effort**: Low  
**Expected Impact**: Unknown (measure with corrected ground truth)

| Query                    | Should Match As          |
| ------------------------ | ------------------------ |
| "completing the square"  | Exact phrase, high boost |
| "simultaneous equations" | Exact phrase, high boost |
| "circle theorems"        | Exact phrase, high boost |

**Implementation**: `detectCurriculumPhrases()` + `createPhraseBoosters()` in RRF builders.

**ADR**: [ADR-084: Phrase Query Boosting](../../../docs/architecture/architectural-decisions/084-phrase-query-boosting.md)

---

## Tier 2: Document Relationships (Priority: HIGH)

Exploit the rich structure we already have. **Not started — awaiting Tier 1 completion.**

### Unit → Lesson Cross-Reference

**Status**: 📋 Planned  
**Effort**: Medium  
**Expected Impact**: High (once baselines established)

---

### Thread-Based Relevance

**Status**: 📋 Planned  
**Effort**: Medium  
**Expected Impact**: High (for disambiguation)

---

## Tier 3: Modern ES Features (Priority: MEDIUM)

Advanced search techniques that don't require AI. **Awaiting Tier 2.**

---

## Tier 4: AI Enhancement (Priority: RE-EVALUATE)

### Semantic Reranking

**Status**: ❌ REJECTED (2025-12-19), 🔄 **NEEDS RE-EVALUATION**  
**Previous Result**: -16.8% regression  
**Problem**: Decision was based on INVALID ground truth

**The rejection may be wrong.** We need to:
1. Establish true baseline with corrected ground truth
2. Re-run the semantic reranking experiment
3. Make a new decision based on valid measurements

**Do NOT implement semantic reranking yet** — but keep the code for re-evaluation.

---

## Experiment Execution Order (Updated)

```
PHASE 0: RE-BASELINE (Target: Verified Metrics)
═══════════════════════════════════════════════════════════════
  └─► Run all evaluation scripts with corrected ground truth    🔴 IMMEDIATE
  └─► Document true baseline metrics                            🔴 IMMEDIATE  
  └─► Update all documentation with verified numbers            🔴 IMMEDIATE

TIER 1: FUNDAMENTALS (Target: MRR 0.45+, VERIFIED)
═══════════════════════════════════════════════════════════════
  └─► Synonym Coverage — verify improvement holds               🔄 NEEDS VERIFICATION
  └─► Noise Filtering (B.4) — verify improvement holds          🔄 NEEDS VERIFICATION
  └─► Phrase Matching (B.5) — measure actual impact             🔄 NEVER MEASURED

TIER 4: RE-EVALUATION
═══════════════════════════════════════════════════════════════
  └─► Semantic Reranking — re-run with correct ground truth     ⚠️ MAY HAVE BEEN WRONGLY REJECTED

TIER 2: RELATIONSHIPS (Target: MRR 0.55+)
═══════════════════════════════════════════════════════════════
  └─► Unit→Lesson Cross-Reference (two-stage search)            📋 After Tier 1 verified
  └─► Thread-Based Relevance (progression context)              📋 After Tier 1 verified
  └─► More Like This (related content)                          📋 After Tier 1 verified

TIER 3: OPTIMISATION (Target: MRR 0.60+)
═══════════════════════════════════════════════════════════════
  └─► RRF Parameter Tuning                                      📋 After Tier 2
  └─► Linear Retriever (if RRF insufficient)                    📋 After Tier 2
  └─► Field Boosting Refinement                                 📋 After Tier 2
```

---

## Decision Log

| Date       | Decision                                  | Rationale                                                                 |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| 2025-12-23 | **RE-RUN ALL EXPERIMENTS**                | Ground truth had 63 invalid slugs (15%) — all measurements suspect        |
| 2025-12-23 | Created ground truth integration test     | Prevent future data quality issues                                        |
| 2025-12-22 | Do NOT re-eval semantic reranking         | ~~Fundamentals still weak~~ **SUPERSEDED** — need re-evaluation           |
| 2025-12-22 | Resume Tier 1 experiments                 | ~~Ingestion complete~~ **Still valid**                                    |
| 2025-12-19 | Semantic reranking rejected               | ~~-16.8% regression~~ **DECISION MAY BE WRONG** — based on invalid GT     |
| 2025-12-19 | AI experiments deferred                   | ~~Focus on fundamentals~~ **Still valid principle**                       |
| 2025-12-19 | Created Tier system                       | Discipline: master basics before complexity — **Still valid**             |

---

## Related Documents

| Document                                                                                                  | Purpose                                               |
| --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| [ground-truth-corrections.md](../ground-truth-corrections.md)                                             | **NEW** — Details of all 63 slug corrections          |
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)   | **Governing ADR** — Strategy rationale and principles |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation mechanics — metrics, harness, templates    |
| [Hard Query Baseline](../baselines/hard-query-baseline.md)                                                | Baseline data — **NEEDS RE-MEASUREMENT**              |
| [Semantic Reranking](./semantic-reranking.experiment.md)                                                  | Why AI reranking failed — **NEEDS RE-EVALUATION**     |

---

## Key Insight: We Are Going Forward, Not Back

The ground truth correction is a **quality improvement**, not a setback. We now have:

1. **Validated ground truth** — Every slug verified against live API
2. **Preventative test** — `ground-truth.integration.test.ts` ensures this can't happen again
3. **Complete coverage** — Lessons, units, AND sequences now have ground truth
4. **Clear path forward** — Re-measure, validate, then continue

**The implementations are still valid. The learnings are still valid. Only the measurements are suspect.**

---

**Remember**: We have world-class educational content, expert-curated metadata, and rich curriculum structure. Now we also have **verified ground truth** to measure against. We should be able to build world-class search by using this data well.
