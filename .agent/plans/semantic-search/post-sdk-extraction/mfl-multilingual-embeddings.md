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
3. **ELSER hypothesis may be secondary** — Even if ELSER understood French, there's little French text to match

### Updated Root Cause Analysis

| Factor | Impact | Evidence |
|--------|--------|----------|
| **Missing transcripts** | HIGH | 0.2% coverage vs 100% for Maths |
| ELSER English-only | UNCLEAR | Metadata is English anyway |
| Target language vocab | LOW | Most searchable content is English |

---

## ⚠️ HYPOTHESIS: ELSER is English-Only (Lower Priority Now)

**Hypothesis**: ELSER v2 is trained on English text only and cannot effectively create semantic embeddings for French, German, or Spanish vocabulary.

**Status**: Lower priority given transcript discovery — but still worth verifying

### Why We Believed This

1. ADR-076 explicitly states: "No cross-lingual support: English-only (acceptable for UK curriculum)"
2. ELSER documentation describes it as trained on English language datasets
3. MFL subjects have the lowest MRR despite having similar lesson structure to other subjects

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

1. **ELSER is NOT the problem** — there's no transcript text to semantically match
2. **We cannot fix this in our codebase** — it's an upstream data issue
3. **MFL search relies entirely on metadata** — titles, outcomes, keywords, tips (all English)
4. **The 4-way RRF handles this** — `lesson_structure` and `lesson_structure_semantic` are always populated

### What We Will NOT Do

- ❌ **Add MFL vocabulary to synonyms** — Synonyms are for English query expansion, not target language vocabulary
- ❌ **Multilingual embeddings** — Moot since there's no target-language content to embed
- ❌ **Query-time translation** — Overkill for the limited MFL content

### Potential Improvements (Within Our Scope)

1. **Boost BM25 for titles** — Titles contain target language vocabulary
2. **Report to Oak** — Flag missing MFL transcripts as upstream data issue
3. **Rely on structure-based RRF** — The system already handles transcript-less lessons correctly

---

## Phase 0: Verify Hypothesis

### 0.1 Documentation Review

- [ ] Read official ELSER documentation for language support
- [ ] Check ELSER training data description
- [ ] Search for Elastic blog posts about multilingual support
- [ ] Document findings

### 0.2 Empirical Testing

| Experiment | Description | Expected Outcome |
|------------|-------------|------------------|
| ELSER-only | Run MFL queries with ELSER retriever only | Very poor (hypothesis: ELSER doesn't understand target language) |
| BM25-only | Run MFL queries with BM25 only | Moderate (hypothesis: BM25 handles vocabulary matches) |
| Current hybrid | Run MFL queries with current 4-way RRF | Poor (current state) |
| BM25-boosted | Run MFL with heavier BM25 weighting | Potentially better if ELSER hurts |

### 0.3 Failure Analysis

For each failing MFL query, analyze:

1. What language is the query in? (English or target language)
2. What language is the lesson content in? (Usually English with target language vocabulary)
3. Is ELSER returning irrelevant results or no results?
4. Is BM25 finding the right documents but ELSER demoting them?

---

## Potential Solutions

**Only proceed with these after hypothesis is verified.**

### Option 1: Multilingual Sparse Embeddings

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

### Option 2: MFL-Specific BM25 Boosting

If ELSER is actively harming MFL results, we could:

1. Reduce ELSER weight for MFL subjects
2. Boost BM25 for MFL-specific vocabulary
3. Add MFL-specific synonyms (French infinitives, German cases, etc.)

**Pros**: No new infrastructure
**Cons**: Loses semantic understanding entirely

### Option 3: Query-Time Translation

Translate user queries to target language before search:

```typescript
// User query: "how to form questions in French"
// Translated: "comment former des questions en français"
// Search both versions
```

**Pros**: Works with existing infrastructure
**Cons**: Adds latency, translation errors, requires LLM

### Option 4: Hybrid Approach

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

