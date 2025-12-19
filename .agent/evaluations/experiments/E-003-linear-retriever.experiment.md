# Experiment: Linear Retriever Fusion

**ID**: E-003  
**Date**: 2025-12-19  
**Status**: 📋 Planned  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

_To be completed after experiment execution._

> We will evaluate linear retriever fusion with weighted ELSER as an alternative
> to RRF. [Results TBD]. **Decision: TBD**.

---

## 1. Introduction

### 1.1 Motivation

RRF treats all retrievers equally (rank-based fusion). Research shows ELSER
outperforms BM25 on hard queries (0.287 vs 0.080 MRR). Linear retriever allows
explicit weighting to amplify ELSER's contribution.

### 1.2 Hypothesis

Using linear retriever fusion with ELSER weighted 2x higher than BM25 will
improve Hard Query MRR by ≥10% compared to RRF.

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Hard Query MRR | ≥+10% | Measurable improvement |
| Standard Query MRR | ≥0.92 (no regression) | Protect baseline performance |
| p95 Latency | ≤500ms | No latency overhead expected |

---

## 2. Methodology

### 2.1 Control Configuration

```typescript
// Production 4-way RRF
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  rrfK: 60,
}
```

### 2.2 Variant Configuration

```typescript
// Variant: Linear retriever with ELSER weighting
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'linear',
  weights: {
    bm25Content: 0.15,
    bm25Structure: 0.15,
    elserContent: 0.35,
    elserStructure: 0.35,
  },
  normaliser: 'minmax',
}
```

### 2.3 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Standard queries | N | `standard-queries.ts` |
| Hard queries | 15 | `hard-queries.ts` |

---

## 3. Results

_To be completed after experiment execution._

---

## 4. Discussion

_To be completed after experiment execution._

---

## 5. Conclusion

### 5.1 Decision

**TBD**: Accept / Reject / Inconclusive

---

## Notes

- Linear retriever requires ES 8.18+ or 9.0 (verify availability)
- Multiple weight configurations may be tested (e.g., 60/40, 70/30)

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-19 | Placeholder created |
