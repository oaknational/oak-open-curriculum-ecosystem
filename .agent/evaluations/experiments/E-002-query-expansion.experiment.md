# Experiment: LLM Query Expansion

**ID**: E-002  
**Date**: 2025-12-19  
**Status**: 📋 Planned  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

_To be completed after experiment execution._

> We will evaluate LLM-based query expansion for naturalistic and colloquial
> queries. [Results TBD]. **Decision: TBD**.

---

## 1. Introduction

### 1.1 Motivation

Naturalistic queries like "teach my students about solving for x" fail because
the vocabulary doesn't match lesson content. LLM expansion could bridge this gap
by generating relevant curriculum terms.

### 1.2 Hypothesis

Using `.gp-llm-v2-chat_completion` to expand naturalistic queries with
curriculum-relevant synonyms will improve Naturalistic Query MRR by ≥20%.

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Naturalistic MRR | ≥+20% | Primary target for improvement |
| Standard Query MRR | ≥0.92 (no regression) | Protect baseline performance |
| p95 Latency | ≤1500ms | Allow +200ms for LLM call |

---

## 2. Methodology

### 2.1 Control Configuration

```typescript
// Production 4-way RRF (no expansion)
{
  preProcessing: {
    queryExpansion: false,
  },
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
}
```

### 2.2 Variant Configuration

```typescript
// Variant: LLM query expansion
{
  preProcessing: {
    queryExpansion: true,
    expansionModel: '.gp-llm-v2-chat_completion',
  },
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
}
```

### 2.3 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Standard queries | N | `standard-queries.ts` |
| Hard queries (naturalistic focus) | 15 | `hard-queries.ts` |

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

## Dependencies

- Should run after E-001 (Semantic Reranking)
- If E-001 achieves target MRR, this experiment may be lower priority

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-19 | Placeholder created |
