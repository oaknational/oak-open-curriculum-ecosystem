# Experiment: Phonetic Enhancement

**Tier**: Search Fundamentals (Tier 1)  
**Date**: 2025-12-19  
**Status**: 📋 Planned  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

_To be completed after experiment execution._

> We will evaluate phonetic analysis (Metaphone/Soundex) for misspelled queries.
> [Results TBD]. **Decision: TBD**.

---

## 1. Introduction

### 1.1 Motivation

Misspelled queries like "fotosinthesis" and "pythagorus" fail because:

- BM25 fuzzy matching has limited edit distance (AUTO = 1-2 edits)
- ELSER was trained on correctly spelled text

Phonetic matching encodes words by their pronunciation, catching spelling
variations that sound alike.

### 1.2 Hypothesis

Adding a phonetic retriever using Metaphone/Soundex encoding will improve
Misspelling Query MRR by ≥25%.

### 1.3 Success Criteria

| Criterion | Threshold | Rationale |
|-----------|-----------|-----------|
| Misspelling MRR | ≥+25% | Primary target for improvement |
| Standard Query MRR | ≥0.92 (no regression) | Protect baseline performance |
| p95 Latency | ≤600ms | Minimal overhead expected |

---

## 2. Methodology

### 2.1 Control Configuration

```typescript
// Production 4-way RRF
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
}
```

### 2.2 Variant Configuration

```typescript
// Variant: Add phonetic retriever
{
  retrievers: [
    'bm25Content',
    'bm25Structure',
    'elserContent',
    'elserStructure',
    'phoneticContent',  // New 5th retriever
  ],
  fusion: 'rrf',
  phoneticAnalyser: 'metaphone',  // or 'soundex'
}
```

### 2.3 Prerequisites

1. Verify `analysis-phonetic` plugin available in ES Serverless
2. Create phonetic analysers in index mapping
3. Add phonetic field variants to index schema

### 2.4 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Misspelling queries | ~5 | Subset of `hard-queries.ts` |
| Standard queries | N | `standard-queries.ts` |

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

- Requires index schema changes (add phonetic fields)
- May need re-indexing to populate phonetic field values
- Consider query-side only phonetic expansion as alternative

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-19 | Placeholder created |
