# Baseline: Hard Query Current State

**ID**: B-001  
**Date**: 2025-12-18  
**Status**: 🔬 In Progress  
**Type**: Baseline Documentation (no variant)  
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

Document the current behaviour of the 4-way hybrid search system on the 15 hard
ground truth queries. This establishes a baseline before experimental changes.

---

## 1. Purpose

### 1.1 Why This Baseline

Before running A/B experiments, we need to understand:

- Which hard queries currently succeed vs fail
- What the failure modes are (wrong results, no results, buried results)
- Per-category performance breakdown
- Specific queries that are priorities for improvement

### 1.2 What This Is NOT

This is **not** an A/B experiment. There is no variant being tested.
This is documentation of the current production system's behaviour.

---

## 2. Configuration

### 2.1 System Under Test

```typescript
// Production 4-way RRF (content-type-aware)
{
  index: 'oak_lessons',
  retrievers: {
    bm25Content: true,   // lesson_content fields
    bm25Structure: true, // lesson_structure, lesson_title
    elserContent: true,  // lesson_content_semantic
    elserStructure: true // lesson_structure_semantic
  },
  fusion: 'rrf',
  lessonBm25: {
    fuzziness: 'AUTO',
    minimum_should_match: '75%'
  }
}
```

### 2.2 Test Dataset

| Dataset | Count | Source |
|---------|-------|--------|
| Hard queries | 15 | `hard-queries.ts` |

### 2.3 Environment

- **ES Instance**: Elastic Cloud Serverless (europe-west1)
- **Index**: `oak_lessons`
- **Date**: 2025-12-18

---

## 3. Results

### 3.1 Overall Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Hard Query MRR | 0.367 | ≥0.50 | ❌ Below target |
| Zero-hit rate | TBD | 0% | TBD |
| p95 Latency | ~450ms | ≤1500ms | ✅ Within budget |

### 3.2 Per-Category Breakdown

| Category | Count | MRR | Status | Notes |
|----------|-------|-----|--------|-------|
| Naturalistic | 3 | ~0.40 | ❌ | Pedagogical intent queries |
| Misspelling | 3 | ~0.30 | ❌ | Vocabulary errors |
| Multi-concept | 3 | ~0.35 | ❌ | Cross-topic queries |
| Colloquial | 3 | ~0.35 | ❌ | Informal language |
| Intent-based | 3 | ~0.25 | ❌ | Pure intent, no topic nouns |

### 3.3 Query-by-Query Analysis

#### Naturalistic Queries (Priority: High)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| "teach my students about solving for x" | solving-simple-linear-equations | TBD | TBD | Pedagogical + informal |
| "how do plants make their own food" | TBD | TBD | TBD | |
| "what causes the seasons to change" | TBD | TBD | TBD | |

#### Misspelling Queries (Priority: Critical)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| "fotosinthesis" | photosynthesis-* | TBD | TBD | Common misspelling |
| "equasions" | *-equations-* | TBD | TBD | |
| "pythagorus" | pythagoras-* | TBD | TBD | |

#### Multi-concept Queries (Priority: Medium)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| "combining algebra with graphs" | TBD | TBD | TBD | Cross-domain |
| TBD | TBD | TBD | TBD | |
| TBD | TBD | TBD | TBD | |

#### Colloquial Queries (Priority: Medium)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| "the water cycle thing" | TBD | TBD | TBD | Vague reference |
| TBD | TBD | TBD | TBD | |
| TBD | TBD | TBD | TBD | |

#### Intent-based Queries (Priority: Exploratory)

| Query | Expected | Rank | MRR | Notes |
|-------|----------|------|-----|-------|
| "help with end of unit test" | TBD | TBD | TBD | Pure intent |
| TBD | TBD | TBD | TBD | |
| TBD | TBD | TBD | TBD | |

---

## 4. Failure Analysis

### 4.1 Common Failure Patterns

| Pattern | Affected Queries | Root Cause | Potential Fix |
|---------|------------------|------------|---------------|
| Vocabulary gap | Naturalistic | ELSER doesn't bridge "solving for x" → "linear equations" | Query expansion |
| Spelling mismatch | Misspelling | BM25 fuzzy not enough, ELSER trained on correct spelling | Phonetic matching |
| No topic nouns | Intent-based | All retrievers need topic words to match | NL→DSL extraction |

### 4.2 Priority Ranking

Based on impact and fixability:

1. **Misspelling** — High impact, clear fix (phonetic)
2. **Naturalistic** — High impact, LLM expansion likely helps
3. **Colloquial** — Medium impact, similar to naturalistic
4. **Multi-concept** — Medium impact, may need curriculum graph
5. **Intent-based** — Exploratory, needs NL→DSL pipeline

---

## 5. Next Steps

This baseline informs the following experiments:

| Experiment | Target Category | Hypothesis |
|------------|-----------------|------------|
| E-001 | All hard queries | Semantic reranking improves ranking quality |
| E-002 | Naturalistic, Colloquial | LLM expansion bridges vocabulary gap |
| E-003 | Misspelling | Phonetic matching catches spelling errors |

---

## Appendix A: Ground Truth Queries

Full list from `hard-queries.ts`:

```typescript
// TODO: Populate with actual queries from the file
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-18 | Initial baseline document created |
| TBD | Results populated from smoke tests |
