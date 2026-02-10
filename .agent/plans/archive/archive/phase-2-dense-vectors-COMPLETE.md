# Phase 2: Evaluate Dense Vectors (IF NEEDED)

**Status**: ✅ COMPLETE | E5 Dense Vectors Provide No Benefit  
**Last Updated**: 2025-12-11

---

## Read First

**Foundation documents** (MUST read before any work):

1. `.agent/directives/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives/schema-first-execution.md` - All types from field definitions
3. `.agent/directives/testing-strategy.md` - Test types and TDD approach

---

## Goal

Evaluate whether E5 dense vectors and/or reranking improve upon two-way hybrid (BM25 + ELSER).

**Conclusion**: Neither E5 dense vectors nor reranking improved results. **Two-way hybrid (BM25 + ELSER) remains optimal.**

---

## Prerequisites

- [x] Phase 1 smoke tests run with baseline metrics
- [x] NDCG@10 < 0.75 (0.725 measured, justifying exploration)
- [x] RRF parameter tuning attempted (minimal impact)
- [x] Three-way hybrid evaluated
- [x] Reranking evaluated

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

## Implementation Steps

Phase 1 baseline is established. Before proceeding to three-way hybrid:

### Step 0: Low-Effort Tuning First

1. **Review ground truth** - Ensure expected results match actual curriculum content
2. **Tune RRF parameters** - Adjust `rank_window_size` and `rank_constant`
3. **Re-run smoke tests** - May close the 2.5% NDCG gap without added complexity

### Step 1: If Tuning Insufficient, Enable Three-Way

1. Enable dense vector generation during ingestion
2. Re-ingest Maths KS4 with E5 embeddings
3. Switch to three-way RRF query builders
4. Run smoke tests and record metrics

### Step 2: Compare and Decide

1. Compare against two-way baseline (see template above)
2. Document decision in ADR
3. If keeping three-way, update all RRF query builders

**TDD Required**: Any new code must follow RED → GREEN → REFACTOR per `testing-strategy.md`.

---

## Results (2025-12-11)

### Full Experimental Comparison

| Configuration             | MRR       | NDCG@10   | Latency   | Decision         |
| ------------------------- | --------- | --------- | --------- | ---------------- |
| **2-way (BM25 + ELSER)**  | **0.900** | **0.716** | **153ms** | ✅ **OPTIMAL**   |
| 3-way (BM25 + ELSER + E5) | 0.892     | 0.715     | 180ms     | ❌ No benefit    |
| 2-way + rerank            | 0.893     | 0.683     | 1546ms    | ❌ Hurts quality |
| 3-way + rerank            | 0.888     | 0.681     | 808ms     | ❌ Worst quality |

### Key Findings

1. **E5 dense vectors provide no benefit** - Slight degradation in both MRR (-0.008) and NDCG (-0.001)
2. **Reranking hurts quality** - NDCG dropped from 0.716 → 0.683 when using `lesson_title`
3. **Reranker field selection is critical** - Full transcripts cause 22+ second latency; titles lack semantic signal
4. **RRF parameter tuning has minimal impact** - Variations in `rank_window_size` and `rank_constant` produced <1% change

### Decision: Stay with Two-Way Hybrid

**Two-way hybrid (BM25 + ELSER) without reranking** is the production configuration:

- Best quality metrics (MRR 0.900, NDCG 0.716)
- Fastest latency (153ms)
- Simplest architecture (no dense vector generation at query time)
- Most cost-effective (no reranker compute costs)

---

## Files

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders-three-way.ts  # Three-way RRF (ready)
├── rrf-query-helpers.ts             # Shared helpers
└── dense-vector-generation.ts       # E5 embedding generation
```

---

## Success Criteria

- [x] Three-way hybrid metrics measured
- [x] Comparison against Phase 1 baseline documented
- [x] Reranking evaluated
- [x] RRF parameter tuning attempted
- [x] Decision documented (two-way hybrid is optimal)
- [x] Full findings documented in `.agent/research/elasticsearch/hybrid-search-reranking-evaluation.md`

---

## Potential Phase 3 Integration

The following learnings from Phase 2 may inform Phase 3 work:

### Deferred to Upstream API

| Item                      | Description                                                                                   | Why Deferred                                                                        |
| ------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **Combined rerank field** | Add `rerank_summary` (~200 tokens: title + keywords + learning outcomes + transcript excerpt) | Requires upstream API pre-processing. Added to `upstream-api-metadata-wishlist.md`. |

### Phase 3.0 Priority

| Item                          | Description                                                                                             | Priority     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- | ------------ |
| **Unit hybrid search**        | Verify and ensure units use BM25 + ELSER                                                                | **CRITICAL** |
| **Unit reranking experiment** | Test reranking with `rollup_text` (~300 chars/lesson) - field already has good length for cross-encoder | **HIGH**     |

### Not Worth Pursuing

| Item                             | Reason                                  |
| -------------------------------- | --------------------------------------- |
| E5 dense vectors                 | Proven ineffective for this dataset     |
| Three-way hybrid                 | Adds complexity with no quality benefit |
| Reranking on lesson short fields | Needs upstream `rerank_summary` field   |
| RRF parameter tuning             | Minimal impact (<1%)                    |
