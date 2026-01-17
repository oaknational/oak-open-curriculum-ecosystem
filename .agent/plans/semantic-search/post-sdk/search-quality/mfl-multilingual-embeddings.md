# MFL Multilingual Embeddings

**Stream**: search-quality  
**Status**: 📋 Pending — Can run alongside Level 3  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17  
**Research**: [elasticsearch-approaches.md](../../../research/elasticsearch/oak-data/elasticsearch-approaches.md) §5

---

## Problem Statement

Modern Foreign Language (MFL) subjects have the poorest search performance:

| Subject | MRR | Baseline Date |
|---------|-----|---------------|
| French | 0.190 | 2026-01-03 |
| German | 0.194 | 2026-01-03 |
| Spanish | 0.294 | 2026-01-03 |

This is significantly worse than other subjects (Art: 0.741, D&T: 0.815).

---

## Root Cause: Missing Transcripts

**Critical finding**: MFL lessons lack transcript data entirely.

| Subject | Lessons | With Transcripts | Coverage |
|---------|---------|------------------|----------|
| **French** | 417 | 1 | **0.2%** |
| **Spanish** | 525 | 1 | **0.2%** |
| **German** | 411 | 1 | **0.2%** |
| Maths | 2,307 | 2,302 | 99.8% |
| Science | 1,280 | 1,280 | 100% |

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

From [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) §5:

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
| French MRR | 0.190 | ≥ 0.500 |
| German MRR | 0.194 | ≥ 0.500 |
| Spanish MRR | 0.294 | ≥ 0.500 |
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
| [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | EIS/dense embeddings |
| [ADR-076: ELSER-Only Strategy](../../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | Current architecture |
| [ADR-075: Dense Vector Removal](../../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Why we removed dense vectors |
| [ai-enhancement.md](ai-enhancement.md) | Query translation |
| [../roadmap.md](../roadmap.md) | Master plan |
