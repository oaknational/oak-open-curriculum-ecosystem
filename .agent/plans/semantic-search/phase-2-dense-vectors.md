# Phase 2: Evaluate Dense Vectors (IF NEEDED)

**Status**: ⏸️ BLOCKED - Awaiting Phase 1 metrics  
**Last Updated**: 2025-12-10

---

## Goal

**Only proceed if Phase 1 baseline doesn't meet targets** (MRR < 0.70 or NDCG@10 < 0.75).

Add E5 dense vectors and compare three-way hybrid against two-way baseline to determine if added complexity delivers value.

---

## Prerequisites

- [ ] Phase 1 smoke tests run with baseline metrics
- [ ] MRR < 0.70 OR NDCG@10 < 0.75 (justifying complexity)
- [ ] Current two-way setup fully tuned first

---

## What's Already Built

The infrastructure for Phase 2 exists and is ready if needed:

### Dense Vector Generation ✅

```typescript
// E5 endpoint (preconfigured, $0 cost)
const E5_ENDPOINT_ID = '.multilingual-e5-small-elasticsearch';
const E5_DIMENSIONS = 384;
```

### Three-Way RRF Query Builders ✅

```typescript
{
  retriever: {
    rrf: {
      retrievers: [
        { standard: { query: { multi_match: { ... } } } },     // BM25
        { standard: { query: { text_expansion: { ... } } } },  // ELSER
        { knn: { field: 'lesson_dense_vector', ... } }         // Dense
      ]
    }
  }
}
```

### Field Definitions ✅

- `lesson_dense_vector` (384-dim, E5)
- `unit_dense_vector` (384-dim, E5)
- ES overrides configured

---

## Decision: Elastic-Native E5 vs OpenAI

| Factor       | OpenAI            | E5 (Chosen)                  |
| ------------ | ----------------- | ---------------------------- |
| External API | Required          | **None**                     |
| Dimensions   | 1536              | **384**                      |
| Billing      | Per-token         | **Included in subscription** |
| Setup        | Register endpoint | **PRECONFIGURED**            |

---

## Implementation Steps (When Unblocked)

1. **Run Phase 1 smoke tests** and record baseline
2. **If targets not met**:
   - Enable three-way RRF queries
   - Run same test queries
   - Compare metrics
3. **Document decision** in ADR

---

## Comparison Template

| Metric      | Phase 1 (Two-Way) | Phase 2 (Three-Way) | Delta | Decision |
| ----------- | ----------------- | ------------------- | ----- | -------- |
| MRR         | ?                 | ?                   | ?     | ?        |
| NDCG@10     | ?                 | ?                   | ?     | ?        |
| Zero-hit    | ?                 | ?                   | ?     | ?        |
| p95 latency | ?                 | ?                   | ?     | ?        |

**Decision Criteria**:

- Three-way shows +10% MRR or +10% NDCG@10 → Keep three-way
- No significant improvement OR >50ms latency increase → Stay with two-way

---

## Files

```
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders-three-way.ts  # Three-way RRF (ready)
├── rrf-query-helpers.ts             # Shared helpers
└── dense-vector-generation.ts       # E5 embedding generation
```

---

## Success Criteria

- [ ] Three-way hybrid metrics measured
- [ ] Comparison against Phase 1 baseline documented
- [ ] Decision documented in ADR
- [ ] All quality gates passing
