# Search Experiment Priorities

**Status**: ✅ Tier 1 EXHAUSTED (KS4 Maths) — Need ground truths for full curriculum
**Last Updated**: 2026-01-02
**Principle**: Master fundamentals before adding complexity
**Governing ADR**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## Ground Truth Status (2026-01-02)

### ✅ Corrected Ground Truth (KS4 Maths)

Ground truth slugs were corrected (2025-12-23):
- **63 invalid slugs fixed** — All now validated via API
- **Integration test created** — Prevents future issues
- **Measurements verified** — MRR 0.614 for KS4 Maths

### ⚠️ Gap: Cross-Curriculum Ground Truths

**Ground truth covers KS4 Maths ONLY.**

Full curriculum indexed (16,414 documents) but evaluation is limited to 1 subject.

**Milestone 3** will address:
- Ground truths for all 17 subjects
- Ground truths for all key stages (KS1-4)
- Benchmarks grouped by user story

See [roadmap.md](../../plans/semantic-search/roadmap.md).

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

## Current Status (2026-01-02)

| Tier  | Name          | Status                  | MRR | Target | Notes                              |
| ----- | ------------- | ----------------------- | --- | ------ | ---------------------------------- |
| **1** | Fundamentals  | ✅ EXHAUSTED (KS4 Maths) | 0.614 | ≥0.45 | All standard approaches tried |
| **2** | Relationships | ❌ Not Started          | — | ≥0.55 | Thread context indexed but not exploited |
| **3** | Modern ES     | ⚠️ Partial              | — | ≥0.60 | RRF working, tuning needed |
| **4** | AI            | ⏸️ DEFERRED             | — | ≥0.75 | After Tier 1-3 exhausted |

**Critical Gap**: Ground truths cover KS4 Maths only. Need comprehensive coverage before claiming cross-curriculum quality.

**Next Priority**: Milestone 3 — Create ground truths for all subjects, establish baselines, optimize synonyms.

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
