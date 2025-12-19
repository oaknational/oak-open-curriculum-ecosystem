# Search Experiment Template

Use this template for **search relevance evaluations**. For other experiment types,
see [`template-for-experiments.md`](template-for-experiments.md).

File naming: `[topic].experiment.md`

---

# Experiment: [Name]

**ID**: E-XXX (sequential)  
**Date**: YYYY-MM-DD  
**Status**: 🔬 In Progress | ✅ Complete | ❌ Abandoned  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

_2-3 sentences summarising what was tested, the key finding, and the decision._

> Example: We evaluated semantic reranking using `.rerank-v1-elasticsearch` on
> hard queries. Reranking improved MRR by +18.5% with acceptable latency
> (+120ms). **Decision: Accept for implementation.**

---

## 1. Introduction

### 1.1 Motivation

_Why are we running this experiment? What problem are we trying to solve?_

### 1.2 Hypothesis

_What do we expect to happen? Be specific and falsifiable._

> Example: "Adding semantic reranking will improve Hard Query MRR by ≥15%
> because the cross-encoder can capture nuanced relevance that RRF misses."

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Hard Query MRR | ≥+15% | Primary target for improvement |
| Standard Query MRR | ≥0.92 (no regression) | Protect baseline performance |
| p95 Latency | ≤1500ms | User experience constraint |

---

## 2. Methodology

### 2.1 Control Configuration

_The baseline (production) configuration being compared against._

```typescript
// Production 4-way RRF
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  reranking: false,
}
```

### 2.2 Variant Configuration

_What specifically changed from control. Be precise._

```typescript
// Variant: Add semantic reranking
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  reranking: true,
  rerankModel: '.rerank-v1-elasticsearch',
  rerankWindowSize: 50,
}
```

### 2.3 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Standard queries | N | `standard-queries.ts` |
| Hard queries | 15 | `hard-queries.ts` |

### 2.4 Execution Environment

- **ES Instance**: Elastic Cloud Serverless (europe-west1)
- **Index**: `oak_lessons` / `oak_units`
- **Date**: YYYY-MM-DD
- **Tool**: Playground / Dev Tools / Smoke Tests

---

## 3. Results

### 3.1 Summary Metrics

| Metric | Control | Variant | Delta | Significant? |
|--------|---------|---------|-------|--------------|
| Standard MRR | 0.931 | 0.928 | -0.3% | ❌ No |
| Hard MRR | 0.367 | 0.435 | +18.5% | ✅ Yes |
| p95 Latency | 450ms | 570ms | +26.7% | — |

### 3.2 Per-Category Breakdown

| Category | Control MRR | Variant MRR | Delta | Notes |
|----------|-------------|-------------|-------|-------|
| Naturalistic | 0.40 | 0.52 | +30% | Best improvement |
| Misspelling | 0.30 | 0.38 | +26.7% | Moderate improvement |
| Multi-concept | 0.35 | 0.42 | +20% | Good improvement |
| Colloquial | 0.35 | 0.40 | +14.3% | Modest improvement |
| Intent-based | 0.25 | 0.28 | +12% | Smallest gain |

### 3.3 Query-Level Analysis

_Highlight specific queries that improved, regressed, or stayed the same._

| Query | Control Rank | Variant Rank | Correct | Winner |
|-------|--------------|--------------|---------|--------|
| "teach students solving for x" | 4 | 1 | 1 | ✅ Variant |
| "fotosinthesis" | 8 | 3 | 1 | ✅ Variant |
| "pythagoras" | 1 | 1 | 1 | Tie |

### 3.4 Failure Analysis

_What didn't work? Any surprising results?_

---

## 4. Discussion

### 4.1 Interpretation

_What do the results tell us? Why did we see these outcomes?_

### 4.2 Limitations

_What couldn't we test? What caveats apply to these results?_

### 4.3 Comparison to Hypothesis

_Did the results match our hypothesis? Why or why not?_

---

## 5. Conclusion

### 5.1 Decision

**Accept** / **Reject** / **Inconclusive**

_One paragraph justifying the decision based on success criteria._

### 5.2 Implementation Notes

_If accepted: what needs to happen to implement this change?_

- [ ] Implementation task 1
- [ ] Implementation task 2
- [ ] Update ADR-081 with final results

### 5.3 Follow-up Experiments

_What questions remain? What should we test next?_

| ID | Experiment | Rationale |
|----|------------|-----------|
| E-XXX | [Next experiment] | [Why it follows from this one] |

---

## Appendix A: Raw Data

_Optional: Include raw query results, ES responses, or other supporting data._

## Appendix B: Reproduction Steps

```bash
# Commands to reproduce this experiment
pnpm smoke:dev:stub -- --grep "reranking"
```

---

## Change Log

| Date | Change |
|------|--------|
| YYYY-MM-DD | Initial experiment design |
| YYYY-MM-DD | Results added |
| YYYY-MM-DD | Decision made |
