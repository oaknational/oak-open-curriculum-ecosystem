# Search Baselines

Baseline measurements documenting current system behaviour for comparison.

---

## 🔴 CRITICAL: All Baselines Need Re-Measurement (2025-12-23)

**Ground truth had 63 invalid slugs (15% of the data).** All previous baseline measurements are UNVERIFIED.

### What Happened

A comprehensive audit revealed that many "expected" lesson slugs in the ground truth queries **do not exist** in the Oak Curriculum API. MRR calculations were scoring against phantom lessons.

### Impact

| Category | Affected Queries | Missing Slugs |
|----------|-----------------|---------------|
| synonym | 9 queries | 29 slugs |
| multi-concept | 9 queries | 24 slugs |
| naturalistic | 3 queries | 3 slugs |
| colloquial | 2 queries | 2 slugs |
| intent-based | 1 query | 3 slugs |
| misspelling | 2 queries | 2 slugs |

### What Was Fixed

- ✅ 63 slugs corrected across `hard-queries.ts`, `diagnostic-synonym-queries.ts`, `diagnostic-multi-concept-queries.ts`
- ✅ Integration test created (`ground-truth.integration.test.ts`) validates all slugs
- ✅ Unit and sequence ground truth added with full validation

### What Must Happen

**Re-run all baseline measurements** against corrected ground truth:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm eval:per-category    # New hard query baseline (lessons)
pnpm eval:diagnostic      # New diagnostic baseline
```

**See**: [ground-truth-corrections.md](../ground-truth-corrections.md) for full details

---

## All Baselines

| Baseline | Last Measured | Status | Action Required |
|----------|---------------|--------|-----------------|
| [Hard Query Baseline](./hard-query-baseline.md) | 2025-12-23 | ⚠️ **UNVERIFIED** | 🔄 Re-measure with corrected GT |

---

## Hard Query Baseline

**Purpose**: Establish baseline performance on challenging queries (misspellings, synonyms, multi-concept, colloquial, intent-based).

**Previous Findings** (UNVERIFIED — based on invalid ground truth):
- 4-way hybrid RRF achieves Lesson MRR 0.369, Unit MRR 0.856
- 5 of 8 lesson failures attributed to vocabulary gaps
- Misspellings appeared to cause 3 of 8 failures

**⚠️ WARNING**: These findings may be incorrect. Some "failures" may have been queries looking for lessons that don't exist.

**Used By**:
- [Comprehensive Synonym Coverage](../experiments/comprehensive-synonym-coverage.experiment.md) — Needs re-verification
- [Semantic Reranking](../experiments/semantic-reranking.experiment.md) — **Rejection may be wrong**

---

## What We Preserve

While the measurements are suspect, the following remain valid:

1. **Implementations** — B.4 noise filtering, B.5 phrase boosting, synonyms are all deployed
2. **Architecture** — Four-retriever hybrid design is sound
3. **Learnings** — ES synonym filter works for tokens not phrases (this is a true ES limitation)
4. **Strategy** — Fundamentals-first approach (ADR-082) is still correct

We are going **forward with enhanced understanding**, not going back.

---

## Re-Baseline Plan

### Step 1: Run Evaluation Scripts

```bash
cd apps/oak-open-curriculum-semantic-search

# Lesson hard queries (15 queries, 6 categories)
pnpm eval:per-category

# Diagnostic queries (18 queries, detailed patterns)  
pnpm eval:diagnostic
```

### Step 2: Update Documentation

1. Update `hard-query-baseline.md` with new measurements
2. Update `current-state.md` with verified metrics
3. Add entry to `EXPERIMENT-LOG.md`: "Ground Truth Correction Baseline"

### Step 3: Compare to Previous (Informational Only)

Note the differences between old (invalid) and new (valid) measurements. This tells us how much the ground truth issues distorted our understanding.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ground-truth-corrections.md](../ground-truth-corrections.md) | Details of all 63 corrections |
| [Experiments](../experiments/index.md) | A/B experiments — **ALL NEED RE-RUNNING** |
| [EXPERIMENT-PRIORITIES.md](../experiments/EXPERIMENT-PRIORITIES.md) | Strategic roadmap |
