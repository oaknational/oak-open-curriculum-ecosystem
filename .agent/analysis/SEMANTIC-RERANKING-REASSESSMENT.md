# Semantic Reranking Reassessment (2025-12-22)

**Question**: Should we re-evaluate semantic reranking now that we have complete data?

**Short Answer**: **NO — Defer until Tiers 1-3 complete per ADR-082**

---

## Context

### Original Experiment (2025-12-19)

| Metric | Control (RRF Only) | With Reranking | Change |
|--------|-------------------|----------------|--------|
| Lesson Hard MRR | 0.367 | 0.305 | **-16.8%** ❌ |
| Unit Hard MRR | 0.811 | 0.806 | -0.7% |

**Status**: REJECTED  
**Index State**: INCOMPLETE (314/436 lessons, ~28% missing)  
**See**: [semantic-reranking.experiment.md](../../evaluations/experiments/semantic-reranking.experiment.md)

### Current State (2025-12-22)

| Metric | Value | Change vs Original Baseline |
|--------|-------|----------------------------|
| Lesson Hard MRR | 0.316 | **-13.9%** (0.367→0.316) |
| Unit Hard MRR | 0.856 | +5.5% (0.811→0.856) |
| Lesson Std MRR | 0.944 | ✅ Excellent |
| Unit Std MRR | 0.988 | ✅ Near perfect |

**Index State**: COMPLETE (436/436 lessons, validated vs bulk download)

---

## Analysis

### Question 1: Was the failure due to incomplete data?

**Answer: NO**

Evidence:
1. **Lesson MRR got WORSE with complete data** (0.367→0.316), not better
2. **The failure mode was qualitative, not quantitative**: The reranker promoted histogram lessons for "sohcahtoa"
3. **Root cause was lack of curriculum domain knowledge**, not missing lessons

From original experiment:
> "The generic cross-encoder does not understand curriculum-specific pedagogical relationships. It sees 'sohcahtoa' and promotes histograms because they're both 'maths', not because they're semantically related."

### Question 2: Have fundamentals improved since rejection?

**Answer: YES, but not enough**

| Fundamental | Status |
|-------------|--------|
| Complete data | ✅ 436 lessons indexed |
| Synonym coverage | ✅ 40+ Maths KS4 synonyms |
| Noise filtering | ❌ Not implemented |
| Phrase matching | ❌ Not implemented |
| Cross-referencing | ❌ Not implemented |
| Thread context | ❌ Not implemented |

**Tier 1 (Fundamentals)**: INCOMPLETE — Still need B.4 (noise), B.5 (phrases)  
**Tier 2 (Relationships)**: NOT STARTED — Cross-referencing, threads  
**Tier 3 (Modern ES)**: PARTIAL — RRF works, Linear not tested

### Question 3: What does ADR-082 say?

**Answer: Explicit — AI is Tier 4, only after Tiers 1-3 plateau**

From [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md):

> **Tier 4: AI Enhancement (DEFERRED)**  
> Only pursue when Tiers 1-3 show diminishing returns.  
> **Entry Criteria**: Tiers 1-3 complete; MRR plateau demonstrated (≤5% improvement in last 3 experiments)

Current progress: **Tier 1 incomplete** (0% progress on B.4, B.5)

### Question 4: What changed between then and now?

| Factor | Then (2025-12-19) | Now (2025-12-22) | Impact on Reranking? |
|--------|-------------------|------------------|---------------------|
| Lessons indexed | 314 | 436 | ⚠️ More noise to rank |
| Lesson Hard MRR | 0.367 | 0.316 | ❌ Worse baseline |
| Synonyms | 8 rules | 40+ rules | ✅ Vocabulary better |
| Fundamentals | Incomplete | Still incomplete | ❌ Same weak foundation |

**Key insight**: More lessons = more complexity = harder ranking task for a generic reranker

---

## Decision: DO NOT RE-EVALUATE YET

### Rationale

1. **Strategic Alignment**: ADR-082 explicitly defers AI to Tier 4. We're still in Tier 1.

2. **Root Cause Still Present**: The reranker lacks curriculum domain knowledge. This hasn't changed.

3. **Fundamentals Still Weak**: 
   - No noise filtering (colloquial queries still fail)
   - No phrase matching (multi-word terms treated as bag-of-words)
   - No cross-referencing (unit context not used)

4. **Worse Starting Point**: Lesson MRR is now LOWER (0.316 vs 0.367), suggesting more work needed on fundamentals

5. **ADR-082 Principle**: "AI on weak fundamentals = amplified weakness"

### When to Reconsider

Re-evaluate semantic reranking **IF AND ONLY IF**:

✅ **Tier 1 complete**
- ✅ B.3: Synonyms (done)
- ❌ B.4: Noise phrase filtering (pending)
- ❌ B.5: Phrase query enhancement (pending)
- ❌ B.6: Tier 1 validation (MRR ≥0.45)

✅ **Tier 2 complete**
- ❌ C.1: Unit→Lesson cross-reference
- ❌ C.2: Thread-based relevance
- ❌ C.3: More Like This
- ❌ C.4: Tier 2 validation (MRR ≥0.55)

✅ **Tier 3 complete**
- ❌ D.1: RRF parameter optimisation
- ❌ D.2: Linear Retriever
- ❌ D.3: Field boosting refinement
- ❌ D.4: Tier 3 validation (MRR ≥0.60)

✅ **Plateau demonstrated**
- Last 3 experiments show ≤5% improvement

### Alternative: Domain-Aware Reranking

If we do eventually return to reranking, consider:

1. **Fine-tuned model**: Train on Oak curriculum data with pedagogical relationships
2. **Prompt-based approach**: Use LLM with curriculum context, not generic cross-encoder
3. **Hybrid stage**: Rerank AFTER fundamentals boost results, not instead of

---

## Recommendation

**Next Steps** (in priority order):

1. ✅ **B.4: Noise phrase filtering** — Remove colloquial filler (Tier 1)
2. ✅ **B.5: Phrase query enhancement** — Multi-word term detection (Tier 1)
3. ✅ **B.6: Validate Tier 1** — Measure MRR, advance if ≥0.45
4. ✅ **C.1: Unit→Lesson cross-reference** — Exploit document relationships (Tier 2)
5. ⏸️ **Semantic reranking** — Revisit ONLY after Tiers 1-3 plateau

---

## References

- [ADR-082: Fundamentals-First Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)
- [Semantic Reranking Experiment](../../evaluations/experiments/semantic-reranking.experiment.md)
- [Part 1: Search Excellence](part-1-search-excellence.md)
- [EXPERIMENT-PRIORITIES.md](../../evaluations/experiments/EXPERIMENT-PRIORITIES.md)

---

**Assessment Date**: 2025-12-22 20:35 UTC  
**Next Review**: After Tier 1 validation (B.6)

