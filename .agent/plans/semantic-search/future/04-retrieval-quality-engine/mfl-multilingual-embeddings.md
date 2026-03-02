# MFL Multilingual Embeddings

**Boundary**: retrieval-quality-engine  
**Legacy Stream Label**: search-quality  
**Status**: 📋 Pending — Can run alongside Level 3  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17  
**Research**: [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) §5

---

## Problem Statement

Modern Foreign Language (MFL) entries remain materially under target in the current measured baselines:

| Entry | MRR | Baseline Date |
|-------|-----|---------------|
| French (primary) | 0.250 | 2026-01-13 |
| French (secondary) | 0.250 | 2026-01-13 |
| German (secondary) | 0.063 | 2026-01-13 |
| Spanish (primary) | 0.292 | 2026-01-13 |
| Spanish (secondary) | 0.250 | 2026-01-13 |

Source: `apps/oak-search-cli/evaluation/baselines/baselines.json`

---

## Root Cause: Near-Zero Transcript Coverage

**Critical finding**: MFL lessons have near-zero transcript coverage in local bulk downloads.

| Subject/Phase | Lessons | With Transcripts | Coverage |
|---------------|---------|------------------|----------|
| **French (primary)** | 105 | 0 | **0.0%** |
| **French (secondary)** | 417 | 1 | **0.2%** |
| **Spanish (primary)** | 112 | 1 | **0.9%** |
| **Spanish (secondary)** | 413 | 0 | **0.0%** |
| **German (secondary)** | 411 | 1 | **0.2%** |
| Maths (primary) | 1,072 | 1,067 | 99.5% |
| Maths (secondary) | 1,236 | 1,236 | 100% |
| Science (primary) | 390 | 390 | 100% |
| Science (secondary) | 889 | 889 | 100% |

### Why MFL Transcripts Don't Exist

Likely cause: **Automatic captioning doesn't work for non-English speech**

1. MFL lesson videos contain significant target language content (French/Spanish/German speech)
2. Speech-to-text services trained on English produce garbage or fail
3. Oak hasn't manually transcribed MFL videos
4. The API either returns 500 errors or 404 "not available"

**Conclusion**: This is an **upstream Oak data issue**, not an ELSER or search problem.

---

## Potential Solutions

### Option 1: Dense Embeddings via EIS (Research Recommended)

From [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) §5:

Elastic Inference Service provides multilingual dense embeddings:

```typescript
// Create inference endpoint for Jina multilingual
await esClient.inference.put({
  inference_id: 'jina-multilingual',
  task_type: 'text_embedding',
  service: 'elasticsearch',
  service_settings: {
    model_id: 'jina-embeddings-v2-base-multilingual',
  },
});
```

**Pros**:
- Handles multilingual content natively
- Works well with paraphrase-heavy queries
- Elastic-native (no external services)

**Cons**:
- Additional index storage
- Inference latency

### Option 2: Adaptive RRF Weights

Adapt retriever weights based on content availability:

```typescript
// For MFL subjects, weight structure-based retrievers higher
const mflWeights = {
  structure_bm25: 1.5,  // Boost
  structure_elser: 1.5, // Boost
  content_bm25: 0.5,    // Demote (mostly missing)
  content_elser: 0.5,   // Demote (mostly missing)
};
```

### Option 3: MFL-Specific BM25 Boosting

Boost structure-based retrievers and BM25 for title fields:

```typescript
const mflBoosts = {
  'lesson_title': 5.0,      // Very high
  'lesson_keywords': 4.0,   // High
  'lesson_structure': 3.0,  // High
  'lesson_content': 1.0,    // Normal (mostly empty)
};
```

### Option 4: Query-Time Translation (Future)

Translate user queries to target language before search:

```
User: "French numbers 1-10"
→ LLM: "nombres français un à dix"
→ Search both English and French versions
```

This requires Level 4 (LLM pre-processing).

---

## Recommended Approach

1. **Immediate**: Implement Option 2 (adaptive RRF weights) — quick win
2. **Level 3**: Evaluate Option 1 (EIS dense embeddings) via experiment
3. **Level 4**: Implement Option 4 (query translation) as part of LLM pre-processing

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| French primary MRR | 0.250 | ≥ 0.500 |
| French secondary MRR | 0.250 | ≥ 0.500 |
| German secondary MRR | 0.063 | ≥ 0.500 |
| Spanish primary MRR | 0.292 | ≥ 0.500 |
| Spanish secondary MRR | 0.250 | ≥ 0.500 |
| Non-MFL regression | N/A | ≤ 2% |

---

## Checklist

- [ ] Experiment with adaptive RRF weights for MFL
- [ ] Evaluate EIS dense embeddings for multilingual
- [ ] Benchmark MFL MRR improvements
- [ ] Ensure no regression on non-MFL subjects
- [ ] Document optimal MFL retrieval strategy

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | EIS/dense embeddings |
| [ADR-076: ELSER-Only Strategy](../../../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | Current architecture |
| [ADR-075: Dense Vector Removal](../../../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Why we removed dense vectors |
| [ai-enhancement.md](ai-enhancement.md) | Query translation |
| [../roadmap.md](../../roadmap.md) | Master plan |
