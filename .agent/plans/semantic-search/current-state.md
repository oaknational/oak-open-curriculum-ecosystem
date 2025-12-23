# Semantic Search Current State

**Last Updated**: 2025-12-23 23:00 UTC  
**Measured Against**: Maths KS4 (vertical slice) — **COMPLETE INDEX**  
**Ground Truth Status**: ✅ **CORRECTED** — All slugs validated

This is THE authoritative source for current system metrics. All other documents reference this file.

---

## 🔴 CRITICAL: All Metrics Need Re-Measurement (2025-12-23)

**Ground truth was corrected. All previous MRR measurements are UNVERIFIED.**

### What Happened

A comprehensive audit revealed **63 invalid slugs** (15% of ground truth data) — lesson references that didn't exist in the Oak Curriculum API:

| Category | Affected Queries | Missing Slugs |
|----------|-----------------|---------------|
| synonym | 9 queries | 29 slugs |
| multi-concept | 9 queries | 24 slugs |
| naturalistic | 3 queries | 3 slugs |
| colloquial | 2 queries | 2 slugs |
| intent-based | 1 query | 3 slugs |
| misspelling | 2 queries | 2 slugs |

### What Was Fixed

- ✅ **63 slugs corrected** in lesson ground truth files
- ✅ **Unit slugs validated** — all 36 exist
- ✅ **Sequence ground truth created** — 41 queries, ~50 slugs
- ✅ **Integration test created** — `ground-truth.integration.test.ts`
- ✅ **All quality gates pass**

### What Must Happen Now

**Re-run ALL experiments** to establish TRUE baselines:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # New hard query baseline
pnpm eval:diagnostic      # New diagnostic baseline
```

**Then update this file with VERIFIED metrics.**

**See**: [ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)

---

## Quality Gate Status

**✅ ALL QUALITY GATES PASS** (verified 2025-12-23 ~22:00 UTC)

| Gate                     | Status                       |
| ------------------------ | ---------------------------- |
| `pnpm type-gen`          | ✅ Pass                      |
| `pnpm build`             | ✅ Pass                      |
| `pnpm type-check`        | ✅ Pass                      |
| `pnpm lint:fix`          | ✅ Pass                      |
| `pnpm format:root`       | ✅ Pass                      |
| `pnpm markdownlint:root` | ✅ Pass                      |
| `pnpm test`              | ✅ Pass                      |
| `pnpm test:e2e`          | ✅ Pass                      |
| `pnpm test:e2e:built`    | ✅ Pass                      |
| `pnpm test:ui`           | ✅ Pass                      |
| `pnpm smoke:dev:stub`    | ✅ Pass                      |

---

## Current Metrics (⚠️ UNVERIFIED)

**✅ INGESTION COMPLETE (2025-12-22)**: Index verified against bulk download data with **436** unique Maths KS4 lessons across **36 units**.

**⚠️ ALL MRR VALUES BELOW ARE UNVERIFIED** — measured against invalid ground truth. Re-measure with corrected ground truth.

### Overall Performance

| Metric                | Previous Value | Verified Value | Target  | Notes                         |
| --------------------- | -------------- | -------------- | ------- | ----------------------------- |
| Lesson Hard MRR (agg) | 0.369          | ???            | ≥0.50   | Re-measure required           |
| Unit Hard Query MRR   | 0.856          | ???            | ≥0.50   | Re-measure required           |
| Lesson Std Query MRR  | 0.944          | ???            | ≥0.92   | Re-measure required           |
| Unit Std Query MRR    | 0.988          | ???            | ≥0.92   | Re-measure required           |
| Zero-hit Rate         | 0%             | ???            | 0%      | Re-measure required           |
| p95 Latency           | ~450ms         | ???            | ≤1500ms | Likely unchanged              |

### Per-Category Breakdown (Lesson Hard Queries) — ⚠️ UNVERIFIED

**These values were measured against INVALID ground truth.** Do NOT use for decisions until re-measured.

| Category       | Previous MRR | Verified MRR | Notes |
|----------------|--------------|--------------|-------|
| naturalistic   | 0.567        | ???          | Re-measure |
| misspelling    | 0.611        | ???          | Re-measure |
| synonym        | 0.167        | ???          | Re-measure |
| multi-concept  | 0.083        | ???          | Re-measure |
| colloquial     | 0.500        | ???          | Re-measure |
| intent-based   | 0.167        | ???          | Re-measure |

### Implementation Status (Still Valid)

| Feature | Status | Claimed Impact | Verified Impact |
|---------|--------|----------------|-----------------|
| B.4 Noise Filtering | ✅ Implemented | +16.8% | ??? (re-measure) |
| B.5 Phrase Boosting | ✅ Implemented | (never measured) | ??? (measure) |
| Synonyms (163 entries) | ✅ Deployed | Working | ??? (validate) |

---

## What We Preserve (Going Forward, Not Back)

While metrics need re-measurement, the following remain valid:

| Category | What We Keep |
|----------|--------------|
| **Implementations** | B.4, B.5, synonyms are all deployed and code-complete |
| **Architecture** | Four-retriever hybrid, RRF fusion |
| **Learnings** | ES synonym filter works for tokens not phrases |
| **Strategy** | Fundamentals-first (ADR-082) |
| **Index Data** | 436 lessons, 36 units, validated |
| **Ground Truth** | ✅ NOW VALIDATED — integration test ensures correctness |

---

## Index Status

**✅ ALL DATA CORRECT**: Verified via ES query, smoke tests, and bulk download validation 2025-12-22.

**Last Ingestion**: 2025-12-22 18:47:08 UTC (v2025-12-22-184708)

| Index                 | Live Docs | Stored Docs | Status                                  |
| --------------------- | --------- | ----------- | --------------------------------------- |
| `oak_lessons`         | 436       | 8736\*      | ✅ Complete (validated vs bulk DL)     |
| `oak_units`           | 36        | 36          | ✅ All lesson_counts correct           |
| `oak_unit_rollup`     | 36\*\*    | 357         | ✅ All lesson_counts correct           |
| `oak_threads`         | 201       | 201         | ✅ Complete                            |
| `oak_sequences`       | 2         | 2           | ✅ Complete                            |
| `oak_sequence_facets` | 1         | 1           | ✅ Complete                            |

\*Stored docs (8736) include all subjects; 436 are Maths KS4  
\*\*357 rollups across all subjects/keystages, 36 are Maths KS4

---

## Ground Truth Status

### ✅ NEW: Validated Ground Truth (2025-12-23)

| Ground Truth | Queries | Slugs | Validation |
|--------------|---------|-------|------------|
| Lesson standard | 40 | 298 | ✅ All exist |
| Lesson hard | 15 | ~60 | ✅ 15 corrected |
| Lesson diagnostic | 18 | ~40 | ✅ 18 corrected |
| Unit standard | Multiple | 36 | ✅ All exist |
| Unit hard | Multiple | 36 | ✅ All exist |
| **Sequence standard** | 24 | ~30 | ✅ **NEW** |
| **Sequence hard** | 17 | ~20 | ✅ **NEW** |

### Integration Test

`ground-truth.integration.test.ts` validates:
1. All slugs exist in Oak Curriculum API
2. Structural integrity (format, no duplicates, valid relevance scores)
3. Runs with `OAK_API_KEY` environment variable

---

## Current Tier Status

Per [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

| Tier  | Name                   | Status         | Exit Criteria     |
| ----- | ---------------------- | -------------- | ----------------- |
| **1** | Search Fundamentals    | 🔄 VERIFY      | MRR ≥0.45 (VERIFIED) |
| **2** | Document Relationships | 📋 Pending     | MRR ≥0.55         |
| **3** | Modern ES Features     | 📋 Pending     | MRR ≥0.60         |
| **4** | AI Enhancement         | ⚠️ RE-EVALUATE | Semantic reranking decision may be wrong |

**Current Task**: Re-establish baselines with corrected ground truth

---

## Experiments Needing Re-Evaluation

| Experiment | Previous Decision | Why Re-Evaluate |
|------------|-------------------|-----------------|
| **Semantic Reranking** | ❌ REJECTED (-16.8%) | Decision based on invalid GT |
| B.3 Synonym Coverage | ✅ ACCEPTED (+3.5%) | Verify improvement holds |
| B.4 Noise Filtering | ✅ ACCEPTED (+16.8%) | Verify improvement holds |
| B.5 Phrase Boosting | (never measured) | Get actual measurements |

---

## Immediate Action Required

### Step 1: Run Evaluation Scripts

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Lesson hard queries by category
pnpm eval:diagnostic      # Detailed pattern analysis
```

### Step 2: Update This Document

Replace all "???" values with actual measured numbers.

### Step 3: Update EXPERIMENT-LOG.md

Add entry: "Ground Truth Correction Baseline — 2025-12-23"

### Step 4: Decide on Semantic Reranking

Once true baselines are established, re-run the semantic reranking experiment.

---

## Historical Context

For the full history of experiments and their impact on these metrics, see:

- **[EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)** — Chronological experiment history
- **[ground-truth-corrections.md](../../evaluations/ground-truth-corrections.md)** — Details of the 63 corrections
- **[EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md)** — Strategic roadmap

---

## How to Update This Document

When metrics change (after an experiment or system change):

1. Run the relevant evaluation scripts to measure new values
2. Update the metrics tables above with **VERIFIED** values
3. Update the "Last Updated" date
4. **Add an entry to [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)**
5. Update [README.md](README.md) and [part-1-search-excellence.md](part-1-search-excellence.md) if needed

```bash
# Measure current metrics
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # Hard query baseline
pnpm eval:diagnostic      # Diagnostic analysis
```
