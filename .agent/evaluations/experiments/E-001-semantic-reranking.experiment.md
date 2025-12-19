# Experiment: Semantic Reranking

**ID**: E-001  
**Date**: 2025-12-18  
**Status**: 🔬 In Progress  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

_To be completed after experiment execution._

> We evaluated semantic reranking using `.rerank-v1-elasticsearch` on hard
> queries. [Results TBD]. **Decision: TBD**.

---

## 1. Introduction

### 1.1 Motivation

The current 4-way hybrid search achieves good results on standard topic queries
(MRR 0.931) but struggles with hard queries (MRR 0.367). The RRF fusion treats
all retrievers equally and uses rank-based scoring, which may not capture
nuanced relevance for complex queries.

Semantic reranking uses a cross-encoder model to re-score the top N results
based on query-document relevance. This should help when:

- The correct result is retrieved but ranked too low
- RRF fusion doesn't weight retrievers optimally for a query type
- Subtle semantic relationships need cross-attention to capture

### 1.2 Hypothesis

Adding semantic reranking with `.rerank-v1-elasticsearch` will improve Hard
Query MRR by ≥15% because:

1. Cross-encoders capture nuanced query-document relationships
2. Reranking can promote buried relevant results
3. The model was trained on diverse search scenarios

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Hard Query MRR | ≥+15% (0.367 → 0.422) | Primary improvement target |
| Standard Query MRR | ≥0.92 (no regression) | Protect baseline performance |
| p95 Latency | ≤2000ms | Allow +500ms overhead for reranking |

---

## 2. Methodology

### 2.1 Control Configuration

```typescript
// Production 4-way RRF (no reranking)
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  reranking: false,
}
```

### 2.2 Variant Configuration

```typescript
// Variant: Add semantic reranking
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  reranking: true,
  rerankModel: '.rerank-v1-elasticsearch',
  rerankWindowSize: 50,  // Rerank top 50 results
}
```

### 2.3 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Standard queries | N | `standard-queries.ts` |
| Hard queries | 15 | `hard-queries.ts` |

### 2.4 Execution Environment

- **ES Instance**: Elastic Cloud Serverless (europe-west1)
- **Index**: `oak_lessons`
- **Date**: TBD
- **Tool**: Kibana Playground → Smoke Tests

### 2.5 Procedure

1. **Playground validation** (Day 1)
   - Configure Playground with `oak_lessons`
   - Add `.rerank-v1-elasticsearch` to query
   - Run 5 representative hard queries manually
   - Check: Does reranking change rankings? Better or worse?

2. **Smoke test validation** (Day 2)
   - Implement reranking variant in ablation test
   - Run full hard query suite
   - Compute MRR, compare to control

3. **Standard query regression check** (Day 2)
   - Run standard queries with reranking
   - Confirm MRR ≥0.92

---

## 3. Results

### 3.1 Summary Metrics

| Metric | Control | Variant | Delta | Significant? |
|--------|---------|---------|-------|--------------|
| Standard MRR | 0.931 | TBD | TBD | TBD |
| Hard MRR | 0.367 | TBD | TBD | TBD |
| p95 Latency | ~450ms | TBD | TBD | — |

### 3.2 Per-Category Breakdown

| Category | Control MRR | Variant MRR | Delta | Notes |
|----------|-------------|-------------|-------|-------|
| Naturalistic | ~0.40 | TBD | TBD | |
| Misspelling | ~0.30 | TBD | TBD | |
| Multi-concept | ~0.35 | TBD | TBD | |
| Colloquial | ~0.35 | TBD | TBD | |
| Intent-based | ~0.25 | TBD | TBD | |

### 3.3 Query-Level Analysis

| Query | Control Rank | Variant Rank | Correct | Winner |
|-------|--------------|--------------|---------|--------|
| "teach students solving for x" | TBD | TBD | 1 | TBD |
| "fotosinthesis" | TBD | TBD | 1 | TBD |
| "combining algebra with graphs" | TBD | TBD | 1 | TBD |

### 3.4 Failure Analysis

_What didn't work? Any surprising results?_

---

## 4. Discussion

### 4.1 Interpretation

_What do the results tell us? Why did we see these outcomes?_

### 4.2 Limitations

- Reranking only helps if the correct result is retrieved (in top N)
- Cross-encoder may not understand Oak-specific curriculum terminology
- Window size (50) is a tunable parameter not explored here

### 4.3 Comparison to Hypothesis

_Did the results match our hypothesis? Why or why not?_

---

## 5. Conclusion

### 5.1 Decision

**TBD**: Accept / Reject / Inconclusive

_Justification based on success criteria._

### 5.2 Implementation Notes

If accepted:

- [ ] Add reranking step to `buildLessonRrfRequest`
- [ ] Configure `rerankWindowSize` as parameter
- [ ] Add latency monitoring for reranking step
- [ ] Update ADR-081 with final results

### 5.3 Follow-up Experiments

| ID | Experiment | Rationale |
|----|------------|-----------|
| E-002 | LLM Query Expansion | If reranking helps, expansion might help more |
| E-001b | Rerank Window Size | If accepted, tune window size (25, 50, 100) |

---

## Appendix A: Raw Data

_Playground queries, ES responses, timing data._

## Appendix B: Reproduction Steps

```bash
# Run semantic reranking ablation
pnpm smoke:dev:stub -- --grep "reranking"

# Or manually in Playground:
# 1. Navigate to Kibana → Search → Playground
# 2. Select oak_lessons index
# 3. Add reranker: .rerank-v1-elasticsearch
# 4. Run queries
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-18 | Initial experiment design |
| TBD | Playground validation results |
| TBD | Smoke test results |
| TBD | Decision made |
