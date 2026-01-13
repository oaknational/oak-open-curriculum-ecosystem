# MFL Multilingual Embeddings

**Status**: 📋 Planned — HIGH PRIORITY post-SDK extraction
**Priority**: HIGH — Addresses known 0.19-0.29 MRR for language subjects
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03
**Prerequisite**: SDK extraction complete

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

## 🔍 ROOT CAUSE DISCOVERY (2026-01-03)

### MFL Lessons Have Almost NO Transcripts

**Critical finding**: MFL lessons lack transcript data entirely.

| Subject | Lessons | With Transcripts | Coverage |
|---------|---------|------------------|----------|
| **French** | 417 | 1 | **0.2%** |
| **Spanish** | 525 | 1 | **0.2%** |
| **German** | 411 | 1 | **0.2%** |
| Maths | 2,307 | 2,302 | 99.8% |
| Science | 1,280 | 1,280 | 100% |

### What MFL Lessons DO Have

| Field | Coverage | Language |
|-------|----------|----------|
| `lessonTitle` | 100% | Mixed (English + target language) |
| `pupilLessonOutcome` | 100% | English |
| `lessonKeywords` | 100% | English (grammar terms) |
| `keyLearningPoints` | 100% | English |
| `teacherTips` | 100% | English |
| `misconceptions` | 0% | N/A |
| `transcript_sentences` | **0.2%** | N/A |

### Implications

1. **~90% less searchable text** — MFL lessons have only metadata; no rich transcript content
2. **Metadata is in English** — Outcomes, keywords, tips are all in English

### Root Cause Verified via API (2026-01-03)

**The transcript API returns errors for MFL lessons**:

| Language | Sample Lesson | Transcript API | Video Asset |
|----------|---------------|----------------|-------------|
| French | er-verbs-3rd-persons | **500 error** | ✅ Exists |
| Spanish | gustar-type-verbs | **404 not available** | ❌ 404 |
| German | weak-verbs-1st-3rd | **500 error** | ✅ Exists |
| Maths | solving-quadratics | ✅ Full transcript | ✅ Exists |

**Conclusion**: This is an **upstream Oak data issue**, not an ELSER or search problem.

### Why MFL Transcripts Don't Exist

Likely cause: **Automatic captioning doesn't work for non-English speech**

1. MFL lesson videos contain significant target language content (French/Spanish/German speech)
2. Speech-to-text services (Whisper, ASR, etc.) trained on English produce garbage or fail
3. Oak hasn't manually transcribed MFL videos
4. The API either returns 500 errors or 404 "not available"

### Implications for Search

1. **Missing transcripts are upstream data** — MFL lessons have no transcript content
2. **MFL search relies on metadata** — titles, outcomes, keywords, tips (all English)

---

## Potential Solutions

### Option 1: Adaptive RRF Weights

Adapt retriever weights based on content availability:

```typescript
// Pseudo-code for content-aware RRF
if (hasTranscript) {
  // Use all 4 retrievers with standard weights
  return buildFourWayRrf(query);
} else {
  // Boost structure retrievers, reduce/skip content retrievers
  return buildStructureWeightedRrf(query);
}
```

### Option 2: Multilingual Sparse Embeddings

Add a multilingual model alongside ELSER for MFL content:

| Model | Type | Languages | Notes |
|-------|------|-----------|-------|
| multilingual-e5-base | Dense | 100+ languages | Requires dense vector field |
| cohere-multilingual-v3 | Dense | 100+ languages | External API |
| Future multilingual ELSER | Sparse | TBD | When/if Elastic releases |

**Implementation**:

```typescript
// Pseudo-code for MFL-specific search
if (subject.isMFL) {
  // Use multilingual model for semantic matching
  return buildMultilingualHybridSearch(query);
} else {
  // Use standard ELSER
  return buildStandardHybridSearch(query);
}
```

### Option 3: MFL-Specific BM25 Boosting

For MFL lessons:

1. Boost structure-based retrievers
2. Boost BM25 for title fields (which contain target language vocabulary)
3. Add MFL-specific synonyms (French infinitives, German cases, etc.)

**Pros**: No new infrastructure
**Cons**: Relies on limited metadata fields

### Option 4: Query-Time Translation

Translate user queries to target language before search:

```typescript
// User query: "how to form questions in French"
// Translated: "comment former des questions en français"
// Search both versions
```

**Pros**: Works with existing infrastructure
**Cons**: Adds latency, translation errors, requires LLM

### Option 5: Hybrid Approach

Different strategy based on query content:

| Query Type | Strategy |
|------------|----------|
| English query about French | BM25 on English fields + ELSER |
| French vocabulary query | Multilingual embeddings |
| Mixed | Both approaches, merge results |

---

## Implementation Considerations

### Dense Vectors in ELSER-Only System

Adding multilingual embeddings requires **dense vector fields** which we removed in [ADR-075](../../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md).

**Options**:

1. **Selective re-introduction**: Add dense vectors for MFL indices only
2. **Separate MFL index**: Create `oak_mfl_lessons` with different field configuration
3. **Hybrid index**: Add optional dense vector field to existing index

### Cost Implications

| Approach | Infrastructure Cost | API Cost | Latency |
|----------|---------------------|----------|---------|
| Multilingual embeddings | Higher storage | None (self-hosted) | +50-100ms |
| External API (Cohere) | None | Per-query | +100-300ms |
| Query translation | None | Per-query | +200-500ms |

---

## Acceptance Criteria

- [ ] Hypothesis verified through documentation and empirical testing
- [ ] Root cause of MFL poor performance confirmed
- [ ] Solution selected based on evidence
- [ ] Implementation completed
- [ ] MFL MRR improved to ≥0.5 (currently 0.19-0.29)
- [ ] No regression in non-MFL subjects

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| French MRR | 0.190 | ≥0.500 |
| German MRR | 0.194 | ≥0.500 |
| Spanish MRR | 0.294 | ≥0.500 |
| Non-MFL regression | N/A | ≤2% |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-076: ELSER-Only Strategy](../../../../docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md) | Current architecture |
| [ADR-075: Dense Vector Removal](../../../../docs/architecture/architectural-decisions/075-dense-vector-removal.md) | Why we removed dense vectors |
| [EXPERIMENTAL-PROTOCOL.md](../../../evaluations/EXPERIMENTAL-PROTOCOL.md) | How to test hypotheses |
| [../roadmap.md](../roadmap.md) | Master plan |

---

## Elastic Documentation References

To verify hypothesis, consult:

- [ELSER model documentation](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser)
- [Elasticsearch multilingual search](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-lang-analyzer.html)
- [E5 multilingual model](https://www.elastic.co/search-labs/blog/multilingual-vector-search-e5-embedding-model)

