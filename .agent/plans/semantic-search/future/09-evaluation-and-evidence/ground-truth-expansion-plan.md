# Ground Truth Expansion Plan

**Status**: Future work (not started)  
**Prerequisite**: Phase 1 complete (30 foundational ground truths)  
**Last Updated**: 2026-02-10

---

## Context

Phase 1 established the Foundational Ground Truths system with 30 lesson ground truths (one per subject-phase), plus 2 unit, 8 thread, and 1 sequence ground truths. After the title-echoing correction ([ADR-106 refinement](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md#refinement-title-echoing-circularity-2026-02-09)), the lesson baseline is MRR=0.983, NDCG@10=0.944, P@3=0.767, R@10=1.000.

This plan outlines expansion opportunities for when deeper coverage is needed. Ground truth expansion should be planned ahead of major search-tuning phases wherever practical.

---

## Expansion Opportunities

### 1. KS4 Science Variants

Three KS4 science variants were excluded from Phase 1:

| Subject | Phase | Status | Notes |
|---------|-------|--------|-------|
| physics | secondary | Not started | KS4 only, specific physics queries |
| chemistry | secondary | Not started | KS4 only, specific chemistry queries |
| biology | secondary | Not started | KS4 only, specific biology queries |

These would benefit teachers searching specifically for exam-board aligned content.

### 2. Multiple Queries Per Subject-Phase

Expand from 1 ground truth to 3-5 per subject-phase to test different query patterns:

- Precise topic queries (current)
- Natural expression queries ("how do I teach X")
- Imprecise input queries (partial terms, typos)
- Cross-topic queries (concepts spanning units)

### 3. Category Diversity

The archived system (`ground-truth-archive/`) had 4 categories per subject-phase:

| Category | Description | Example |
|----------|-------------|---------|
| precise-topic | Exact curriculum terminology | "dividing fractions reciprocals" |
| natural-expression | Teacher vernacular | "how to explain fractions" |
| imprecise-input | Partial or misspelled | "fraction dividing" |
| cross-topic | Multi-unit concepts | "fractions in real world problems" |

This could be selectively restored for priority subjects.

### 4. Graded Relevance Refinement

Current ground truths capture top-3 results. Future expansion could:

- Increase to top-10 with full relevance grading
- Add negative examples (results that should NOT appear)
- Add position-specific expectations (must be #1 vs acceptable in top-5)

---

## Reference: Archived System

The previous multi-category approach is preserved at:

```text
src/lib/search-quality/ground-truth-archive/
```

This contains:

- **401 TypeScript files**
- **120 queries** (30 subject-phases × 4 categories)
- **Split architecture**: `.query.ts` + `.expected.ts` per query

### Restoration

If the archived approach is needed:

```bash
# Copy specific entries back
cp ground-truth-archive/maths/secondary/natural-expression.* ground-truth/entries/

# Or restore entire archive
mv ground-truth-archive/* ground-truth/
```

Note: Restoration requires updating imports and benchmark adapters.

---

## Implementation Approach

When expanding ground truths:

1. **Follow Known-Answer-First methodology** (see [ADR-106](../../../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md))
2. **Test via 4-way RRF** (`test-query.ts`), not raw ES
3. **Record in entries/** with consistent naming
4. **Run benchmark** to validate metrics remain healthy
5. **Document in queries-redesigned.md**

---

## Priority Order

Recommended expansion priority based on user value:

1. **High-traffic subjects** (maths, english, science) — more queries
2. **KS4 science variants** — specific exam content
3. **Natural expression queries** — how teachers actually search
4. **Cross-topic queries** — concept connections

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ground-truth-redesign-plan.md](../../archive/completed/ground-truth-redesign-plan.md) | Phase 1 completion record |
| [ground-truth-protocol.md](../../../../../apps/oak-search-cli/docs/ground-truths/ground-truth-protocol.md) | The protocol |
| [ADR-106](../../../../../docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology decision |
| [ground-truth-archive/README.md](../../../../../apps/oak-search-cli/src/lib/search-quality/ground-truth-archive/README.md) | Archive reference |
