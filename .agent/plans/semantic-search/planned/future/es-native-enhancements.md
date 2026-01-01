# ES Native Search Enhancements (Phase 3e)

**Status**: 🔄 Partial — Phase A complete (+29% MRR), Phase B reverted  
**Priority**: Medium — Addresses BM25 contribution to hybrid  
**Dependencies**: Milestone 1 (complete ingestion)  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md)  
**Source**: Recovered from `phase-3-multi-index-and-fields.md` backup  
**Last Updated**: 2025-12-29

---

## Overview

Phase 3e enhances BM25 lexical search through native Elasticsearch features to improve handling of typos, misspellings, synonyms, and naturalistic queries.

**Problem Addressed**: The four-retriever ablation study showed that single ELSER retrievers outperformed the four-way hybrid on hard queries — indicating BM25 was adding noise rather than signal for naturalistic queries.

**Goal**: Improve BM25 contribution so that hybrid search consistently outperforms single ELSER on all query types.

### Further Reading

See also [advanced-features.md](../planned/future/advanced-features.md) for further reading.

---

## Results Summary

### Phase A: Query-Time Changes (No Reindex) — ✅ COMPLETE

| Configuration | Hard MRR | Hard NDCG | Std MRR | Std NDCG |
|---------------|----------|-----------|---------|----------|
| Baseline (before 3e) | 0.250 | 0.212 | 0.931 | 0.749 |
| After 3e.1+3e.2+3e.6 | **0.323** | 0.240 | 0.938 | 0.746 |

**Result**: +29.2% improvement on hard queries. Four-way hybrid now outperforms single ELSER (0.323 > 0.290).

### Phase B: Analyzer Changes (Reindex Required) — ❌ REVERTED

| Configuration | Hard MRR | Notes |
|---------------|----------|-------|
| After 3e.3 (stemming + stop words) | 0.301 | **Regressed** -6.8% from Phase A |
| **REVERTED** | 0.323 | Restored Phase A config |

**Reason for Revert**: Stop word removal was too aggressive for naturalistic queries. BM25 structure zero-hit rate increased to 33.3%.

---

## Task Status

### Phase A Tasks (Implemented)

| Task | Description | Status |
|------|-------------|--------|
| 3e.1 | Enhanced fuzzy configuration (`AUTO:3,6`, `prefix_length: 1`) | ✅ Complete |
| 3e.2 | Phrase prefix boost (secondary `phrase_prefix` match at 0.5 boost) | ✅ Complete |
| 3e.6 | `minimum_should_match: '75%'` | ✅ Complete |

### Phase B Tasks (Deferred/Reverted)

| Task | Description | Status |
|------|-------------|--------|
| 3e.3 | Stemming + stop words | ❌ Reverted — caused regression |
| 3e.4 | Phonetic matching (`double_metaphone`) | 📋 Deferred |
| 3e.5 | `search_as_you_type` fields | 📋 Deferred |

---

## Key Implementation Details

### 3e.1: Enhanced Fuzzy Configuration

```typescript
multi_match: {
  query: text,
  type: 'best_fields',
  tie_breaker: 0.2,
  fuzziness: 'AUTO:3,6',      // Fuzzy for 3+ char words (vs default 5+)
  prefix_length: 1,            // Require first char match
  fuzzy_transpositions: true,  // Allow ab→ba
  fields,
}
```

### 3e.2: Phrase Prefix Boost

Wrapped BM25 query in `bool.should` with secondary `phrase_prefix` match:

```typescript
bool: {
  should: [
    { multi_match: { /* standard fuzzy match */ } },
    { multi_match: { query: text, type: 'phrase_prefix', fields, boost: 0.5 } },
  ],
  minimum_should_match: 1,
}
```

---

## Learnings

1. **Query-time enhancements are low-risk** — No reindex required, easy to A/B test
2. **Stemming can harm naturalistic queries** — Stop word removal removes important context
3. **BM25 zero-hit rate is a canary** — >30% indicates over-aggressive filtering
4. **Measure every change** — Without ablation, we wouldn't know 3e.3 regressed

---

## Next Steps (Phase 3f Considerations)

If further improvement needed after current milestones:

1. **Query classification** — Route naturalistic queries to ELSER-only
2. **Reranking** — Use `.rerank-v1-elasticsearch` cross-encoder
3. **Query expansion** — LLM-based expansion for naturalistic queries
4. **Adaptive RRF** — Dynamic weighting based on query characteristics

---

## Evaluation Requirements

Before any further Phase 3e work:

- [ ] Establish baseline metrics on full-curriculum index (not just Maths KS4)
- [ ] Create ablation test suite for each configuration
- [ ] Record all results in [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

---

## Files Modified

| File | Purpose |
|------|---------|
| `src/lib/hybrid-search/rrf-query-helpers.ts` | BM25 retriever configuration |

---

## Related Documents

- [four-retriever-implementation.md](../archive/completed/four-retriever-implementation.md) — Phase 3.0-3d archive
- [ADR-080](../../../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md) — KS4 filtering architecture
- [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md) — Experiment history

