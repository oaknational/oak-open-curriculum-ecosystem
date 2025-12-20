# Experiment: Semantic Reranking

**Tier**: AI Enhancement (Tier 4)
**Date**: 2025-12-19
**Status**: ❌ Rejected
**Related ADR**: [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md)

## Abstract

> We evaluated semantic reranking using `.rerank-v1-elasticsearch` on hard
> queries. The results show a **-16.8% regression** in lesson hard query MRR
> (0.367 → 0.305) and a -0.7% regression in unit MRR (0.811 → 0.806).
> **Decision: REJECT** - semantic reranking harms performance on hard queries.

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
  rankWindowSize: 80,
  reranking: false,
}
```

### 2.2 Variant Configuration

```typescript
// Variant: Add semantic reranking
{
  retrievers: ['bm25Content', 'bm25Structure', 'elserContent', 'elserStructure'],
  fusion: 'rrf',
  rankWindowSize: 50,  // Reduced to keep latency manageable
  reranking: true,
  rerankModel: '.rerank-v1-elasticsearch',
  rerankWindowSize: 20,  // Rerank top 20 results
  rerankField: 'lesson_structure',  // Curated pedagogical summary
}
```

### 2.3 Test Dataset

| Dataset | Query Count | Source |
|---------|-------------|--------|
| Hard queries (lessons) | 15 | `hard-queries.ts` |
| Hard queries (units) | 15 | `hard-queries.ts` (units) |

### 2.4 Execution Environment

- **ES Instance**: Elastic Cloud Serverless (europe-west1)
- **ES Version**: 8.11.0
- **Index**: `oak_lessons` (6,335 docs), `oak_unit_rollup` (284 docs)
- **Date**: 2025-12-19
- **Tool**: Smoke Tests (`semantic-reranking-experiment.smoke.test.ts`)

### 2.5 Procedure

1. **Playground validation** (completed)
   - Verified `.rerank-v1-elasticsearch` endpoint exists and works
   - Tested simple queries with reranking (single retriever)
   - Cold start latency ~13s, subsequent ~500ms
   - 4-way RRF + reranking initially timed out (30s+)

2. **Smoke test validation** (completed)
   - Implemented `reranking-query-builders.ts` with TDD
   - Reduced rank_window_size to 50 (inner RRF) and 20 (reranker)
   - Ran full 30-query experiment (15 lessons + 15 units)
   - Total execution time: ~226 seconds

---

## 3. Results

### 3.1 Summary Metrics

| Metric | Control | Variant | Delta | Significant? |
|--------|---------|---------|-------|--------------|
| Lesson Hard MRR | 0.367 | 0.305 | **-16.8%** | ✅ Yes (regression) |
| Unit Hard MRR | 0.811 | 0.806 | -0.7% | ❌ No |
| Max Latency | ~450ms | 14,277ms | +13,827ms | ❌ Exceeds threshold |

### 3.2 Query-Level Analysis (Lessons)

| Query | Control Rank | Rerank Rank | Winner |
|-------|--------------|-------------|--------|
| "teach my students about solving for x" | N/A | 5 | Rerank |
| "lesson on working out missing angles" | N/A | N/A | Tie |
| "what to teach before quadratic formula" | 1 | 1 | Tie |
| "simulatneous equasions substitution method" | 1 | 1 | Tie |
| "circel theorms tangent" | 2 | 2 | Tie |
| "standerd form multiplying dividing" | 1 | 1 | Tie |
| "finding the gradient of a straight line" | N/A | N/A | Tie |
| "rules for powers and indices" | N/A | N/A | Tie |
| "how to rearrange formulas" | 2 | 2 | Tie |
| "combining algebra with graphs" | N/A | N/A | Tie |
| "probability with tree diagrams" | 2 | 4 | **Control** |
| "that sohcahtoa stuff for triangles" | N/A | N/A | Tie |
| "the bit where you complete the square" | N/A | N/A | Tie |
| "challenging extension work for able maths" | 1 | 8 | **Control** |
| "visual introduction to vectors for beginners" | N/A | N/A | Tie |

**Summary**: 10 ties, 2 wins for Control, 1 win for Rerank, 2 no effect.

### 3.3 Query-Level Analysis (Units)

| Query | Control Rank | Rerank Rank | Winner |
|-------|--------------|-------------|--------|
| "simultanous equasions" | 2 | 1 | Rerank |
| "graphs and algebra together" | 3 | 1 | Rerank |
| "trigonomatry sohcahtoa" | 1 | 2 | Control |
| "working out unknown angles" | 1 | 2 | Control |
| "that thing with triangles and squares" | 2 | 4 | Control |
| Others | 1 | 1 | Tie |

**Summary**: Mixed results, slight overall regression (-0.7%).

### 3.4 Failure Analysis

**Major regressions observed**:

1. **"challenging extension work for able maths students"**:
   Control rank 1 → Rerank rank 8. The reranker appears to have
   misunderstood the intent and demoted the correct result.

2. **"probability with tree diagrams and fractions"**:
   Control rank 2 → Rerank rank 4. Minor regression.

**Hypothesis for failures**:

- The `.rerank-v1-elasticsearch` model may not understand educational
  terminology or UK curriculum vocabulary (e.g., "able", "extension work")
- The `lesson_structure` field may not contain enough context for the
  cross-encoder to make accurate relevance judgements
- The reduced rank_window_size (50 → 20) may have excluded some candidates

---

## 4. Discussion

### 4.1 Interpretation

The results clearly contradict our hypothesis. Semantic reranking using
`.rerank-v1-elasticsearch` on the `lesson_structure` field:

1. **Harms lesson hard query performance** (-16.8% MRR)
2. **Does not help unit queries** (-0.7%, within noise)
3. **Adds significant latency** (14s cold start, ~500ms warm)

The cross-encoder model appears to be making worse relevance judgements
than the RRF fusion for our specific domain. This suggests the model's
training data does not include educational content similar to Oak's curriculum.

### 4.2 Limitations

- Only tested with `lesson_structure` field (not `lesson_content`)
- Used reduced rank window sizes to avoid timeouts
- Cold start latency (14s) would be unacceptable in production regardless
- Did not test alternative reranking models or fine-tuned variants

### 4.3 Comparison to Hypothesis

❌ **Hypothesis disproven**: Cross-encoder reranking does NOT improve hard
query MRR. Instead, it causes a significant regression.

The fundamental assumption that "cross-encoders capture nuanced query-document
relationships better than RRF fusion" does not hold for our domain-specific
educational content.

---

## 5. Conclusion

### 5.1 Decision

**REJECT** ❌

Semantic reranking with `.rerank-v1-elasticsearch` should NOT be implemented
because:

1. It causes a -16.8% regression in lesson hard query MRR
2. It adds 500ms+ latency (up to 14s cold start)
3. The cross-encoder model does not understand educational content well

### 5.2 Implementation Notes

Since rejected, no implementation required. The experimental code remains in:

- `src/lib/hybrid-search/reranking-query-builders.ts`
- `smoke-tests/semantic-reranking-experiment.smoke.test.ts`

This code is retained for:

- Future experiments with different reranking models
- Comparison if Elastic releases education-tuned rerankers
- Reference for alternative approaches (E-003 LLM reranking)

### 5.3 Follow-up Experiments

| ID | Experiment | Rationale |
|----|------------|-----------|
| E-002 | LLM Query Expansion | May help colloquial/synonym queries without reranking overhead |
| E-003 | LLM-based Reranking | Domain-specific LLM may understand curriculum better |
| E-004 | Different Rerank Field | Try `lesson_content` instead of `lesson_structure` |

---

## Appendix A: Raw Data

**Execution Output**:

```text
Running E-001 Semantic Reranking Experiment...
Baseline: Lesson MRR=0.367, Unit MRR=0.811
Target: +15% improvement

Running lesson experiments...
  "teach my students about solving for x..." Control: N/A, Rerank: 5
  "lesson on working out missing angles..." Control: N/A, Rerank: N/A
  "what to teach before quadratic formula..." Control: 1, Rerank: 1
  "simulatneous equasions substitution..." Control: 1, Rerank: 1
  "circel theorms tangent..." Control: 2, Rerank: 2
  "standerd form multiplying dividing..." Control: 1, Rerank: 1
  "finding the gradient of a straight line..." Control: N/A, Rerank: N/A
  "rules for powers and indices..." Control: N/A, Rerank: N/A
  "how to rearrange formulas..." Control: 2, Rerank: 2
  "combining algebra with graphs..." Control: N/A, Rerank: N/A
  "probability with tree diagrams..." Control: 2, Rerank: 4
  "that sohcahtoa stuff for triangles..." Control: N/A, Rerank: N/A
  "the bit where you complete the square..." Control: N/A, Rerank: N/A
  "challenging extension work..." Control: 1, Rerank: 8
  "visual introduction to vectors..." Control: N/A, Rerank: N/A

Running unit experiments...
  [15 unit queries run - see Section 3.3]

============================================================
E-001 EXPERIMENT RESULTS
============================================================
Lesson Control MRR:  0.367
Lesson Rerank MRR:   0.305
Lesson Delta:        -16.8%

Unit Control MRR:    0.811
Unit Rerank MRR:     0.806
Unit Delta:          -0.7%
============================================================

DECISION: REJECT - Regression detected
```

## Appendix B: Reproduction Steps

```bash
# Run semantic reranking experiment
cd apps/oak-open-curriculum-semantic-search
pnpm vitest run -c vitest.smoke.config.ts semantic-reranking-experiment
```

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-18 | Initial experiment design |
| 2025-12-19 | Playground validation completed |
| 2025-12-19 | TDD implementation of reranking builders |
| 2025-12-19 | Experiment executed, results recorded |
| 2025-12-19 | **Decision: REJECT** - regression detected |
