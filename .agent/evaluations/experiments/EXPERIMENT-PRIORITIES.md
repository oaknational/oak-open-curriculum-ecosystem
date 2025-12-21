# Search Experiment Priorities

**Status**: 🔄 Active  
**Last Updated**: 2025-12-20  
**Principle**: Master fundamentals before adding complexity  
**Governing ADR**: [ADR-082: Fundamentals-First Search Strategy](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md)

---

## 🔴 BLOCKING: Incomplete Index

**All experiments below are against an incomplete index. Prioritise fixing ingestion before further experiments.**

The ingestion process uses `/units/{slug}/summary` which returns **truncated** lesson data. For Maths KS4:

- Indexed: ~314 lessons
- Actual: ~650+ lessons

**Fix**: Refactor ingestion to use paginated `/key-stages/{ks}/subject/{subject}/lessons` endpoint.

**ADR**: [ADR-083: Complete Lesson Enumeration Strategy](../../../docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md)

---

## Philosophy

> "We should be able to do an excellent job with traditional methods, and an _amazing_ job with non-AI recent search methods, and a *phenomenal* job once we take that already optimised approach and add AI into the mix."

This document organises experiments into **tiers** based on the principle that:

1. **Fundamentals first**: Synonyms, phrase matching, noise filtering, cross-referencing
2. **Structure second**: Exploiting the rich relationships in our data
3. **Modern techniques third**: Advanced ES features (RRF, Linear, etc.)
4. **AI last**: Reranking, query expansion, RAG — only when fundamentals are exhausted

---

## The Search Excellence Pyramid

```
                           ┌─────────────────┐
                           │   PHENOMENAL    │  ← Tier 4: AI Enhancement
                           │                 │     Reranking, RAG, Query Expansion
                           │                 │     ONLY after lower tiers mastered
                       ┌───┴─────────────────┴───┐
                       │       EXCELLENT         │  ← Tier 3: Modern ES Features
                       │                         │     RRF optimisation, Linear, MLT
                       │                         │     Requires Tier 2 complete
                   ┌───┴─────────────────────────┴───┐
                   │           VERY GOOD             │  ← Tier 2: Document Relationships
                   │                                 │     Cross-referencing, joins
                   │                                 │     Requires Tier 1 complete
               ┌───┴─────────────────────────────────┴───┐
               │              GOOD                       │  ← Tier 1: Search Fundamentals
               │                                         │     Synonyms, phrases, noise
               │              ← WE ARE HERE              │
               └─────────────────────────────────────────┘
```

---

## Current Status

| Tier | Name | Status | Notes |
|------|------|--------|-------|
| **1** | Fundamentals | ⚠️ In Progress | Synonyms complete (+3.5% MRR), phrase matching & noise filtering pending |
| **2** | Relationships | ❌ Not Started | Cross-referencing not exploited |
| **3** | Modern ES | ⚠️ Partial | RRF working, Linear not tested |
| **4** | AI | ❌ Rejected | Premature — fundamentals not mastered |

---

## Tier 1: Search Fundamentals (Priority: CRITICAL)

These are non-AI techniques with decades of proven value.

### Comprehensive Synonym Coverage
**Status**: ✅ Complete (2025-12-19)  
**Effort**: Medium  
**Actual Impact**: ⭐⭐⭐⭐ (+3.5% MRR lessons, +4.1% MRR units)

| Before | After |
|--------|-------|
| 8 maths synonym rules | 40+ curriculum-specific rules |
| Generic English | Maths KS4 vocabulary (sohcahtoa, solving for x, etc.) |

**Results**:
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Lesson Hard MRR | 0.367 | 0.380 | +3.5% |
| Unit Hard MRR | 0.811 | 0.844 | +4.1% |
| Vocabulary gap tests | 3/11 | 11/11 | +8 tests |

**Key Fixes**:
- "sohcahtoa" → Was returning histograms, now returns trigonometry (rank 1)
- "solving for x" → Now finds linear equations (rank 1)
- "straight line graphs" → Now finds linear graphs (rank 2)

**Details**: See [comprehensive-synonym-coverage.experiment.md](./comprehensive-synonym-coverage.experiment.md)

---

### Noise Phrase Filtering
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐⭐⭐

**Problem**: Colloquial queries fail because filler phrases dilute signal.

| Query | Noise | Signal |
|-------|-------|--------|
| "that sohcahtoa stuff for triangles" | "that...stuff for" | "sohcahtoa triangles" |
| "the bit where you complete the square" | "the bit where you" | "complete the square" |

**Approach**:
1. Pre-process queries to remove common noise patterns
2. Patterns: `^the (bit|part|thing) (where|about|with)`, `that .* stuff`
3. Test on colloquial hard queries

---

### Phrase Query Enhancement
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐⭐

**Problem**: Multi-word terms are searched as bag-of-words, not phrases.

| Query | Should Match As |
|-------|-----------------|
| "completing the square" | Exact phrase, high boost |
| "simultaneous equations" | Exact phrase, high boost |
| "circle theorems" | Exact phrase, high boost |

**Approach**:
1. Detect multi-word curriculum terms in queries
2. Add `match_phrase` with boost for detected phrases
3. Maintain bag-of-words as fallback

---

## Tier 2: Document Relationships (Priority: HIGH)

Exploit the rich structure we already have.

### Unit → Lesson Cross-Reference
**Status**: 📋 Planned  
**Effort**: Medium  
**Expected Impact**: ⭐⭐⭐⭐⭐

**Current State**:
- Lessons have `unit_ids[]` field
- Units have `lesson_ids[]` field
- We search these indices SEPARATELY

**Opportunity**:
```
User: "quadratic equations"
↓
1. Search oak_unit_rollup → "Solving Quadratic Equations" unit (rank 1)
2. Unit has lesson_ids: ["solving-quadratics-by-factorising", "quadratic-formula", ...]
3. Boost those lessons in oak_lessons search
↓
Result: Lessons from the best-matching unit are promoted
```

**Implementation Options**:

**Option A: Two-Stage Search**
```typescript
async function searchWithUnitContext(query: string) {
  // Stage 1: Find best matching units
  const units = await searchUnits(query, { size: 3 });
  const lessonIdsFromTopUnits = units.flatMap(u => u.lesson_ids);
  
  // Stage 2: Search lessons, boosting those in top units
  const lessons = await searchLessons(query, {
    should: [
      { terms: { lesson_slug: lessonIdsFromTopUnits, boost: 2.0 } }
    ]
  });
  return lessons;
}
```

**Option B: Terms Lookup Query**
```json
{
  "query": {
    "bool": {
      "must": { "multi_match": { "query": "quadratic equations" } },
      "should": {
        "terms": {
          "lesson_slug": {
            "index": "oak_unit_rollup",
            "id": "<top-unit-id>",
            "path": "lesson_ids"
          },
          "boost": 2.0
        }
      }
    }
  }
}
```

**Option C: Denormalised Unit Quality Score**
At index time, compute a "unit relevance" score for each lesson based on how well-structured its parent unit is.

---

### Thread-Based Relevance
**Status**: 📋 Planned  
**Effort**: Medium  
**Expected Impact**: ⭐⭐⭐⭐

**Current State**:
- Units have `thread_slugs[]`, `thread_titles[]`
- Threads represent curriculum progression ("Number: Multiplication and Division")
- We don't use this for lesson search

**Opportunity**:
```
User: "multiplication" (ambiguous - could be year 2 or year 10)
↓
1. Detect user context (if available) or ask
2. Use thread to disambiguate: "Number: Multiplication" thread
3. Boost lessons in that thread
↓
Result: Coherent results within curriculum progression
```

---

### More Like This for Related Content
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐⭐

**Use Case**: After finding one good result, find related lessons.

```json
{
  "query": {
    "more_like_this": {
      "fields": ["lesson_keywords", "lesson_structure", "unit_topics"],
      "like": [{ "_index": "oak_lessons", "_id": "found-lesson-id" }],
      "min_term_freq": 1,
      "min_doc_freq": 1
    }
  }
}
```

---

## Tier 3: Modern ES Features (Priority: MEDIUM)

Advanced search techniques that don't require AI.

### RRF Parameter Optimisation
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐⭐

**Current**: `rank_constant: 60`, `rank_window_size: 80`

**Experiment**: Test different values:
| Config | rank_constant | rank_window_size | Hypothesis |
|--------|---------------|------------------|------------|
| Baseline | 60 | 80 | Current |
| Tighter | 20 | 50 | Emphasise top ranks |
| Wider | 100 | 200 | More diverse fusion |

---

### Linear Retriever (Weighted Fusion)
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐⭐

**Rationale**: ELSER outperforms BM25 on hard queries (0.287 vs 0.080). Weighting ELSER higher may help.

**Note**: Only pursue AFTER Tier 1 and Tier 2 are complete.

---

### Field Boosting Optimisation
**Status**: 📋 Planned  
**Effort**: Low  
**Expected Impact**: ⭐⭐

**Current**:
```typescript
const fields = [
  'lesson_title^3',
  'lesson_keywords^2',
  'key_learning_points^2',
  // ... others at ^1
];
```

**Experiment**: Test boosting pedagogical fields:
- `pupil_lesson_outcome^2` (learning outcomes)
- `misconceptions_and_common_mistakes^1.5` (common confusions)

---

## Tier 4: AI Enhancement (Priority: DEFERRED)

Only pursue after Tiers 1-3 show diminishing returns.

### Semantic Reranking
**Status**: ❌ Rejected  
**Result**: -16.8% regression on lesson MRR
**Lesson**: Generic cross-encoders don't understand curriculum

### LLM Query Expansion
**Status**: ⏸️ Deferred  
**Rationale**: May be unnecessary if Tier 1 synonyms solve vocabulary gap

### LLM Reranking (Domain-Specific)
**Status**: 📋 Planned (if Tier 1-3 insufficient)  
**Approach**: Use curriculum-aware LLM to judge relevance

---

## Experiment Execution Order

```
TIER 1: FUNDAMENTALS (Target: MRR 0.45+)
═══════════════════════════════════════════
  └─► Synonym Coverage (+50 rules targeting hard queries)      ✅ Complete
  └─► Noise Filtering (colloquial query preprocessing)         📋 Next
  └─► Phrase Matching (multi-word term detection)              📋

TIER 2: RELATIONSHIPS (Target: MRR 0.55+)
═══════════════════════════════════════════
  └─► Unit→Lesson Cross-Reference (two-stage search)
  └─► Thread-Based Relevance (progression context)
  └─► More Like This (related content)

TIER 3: OPTIMISATION (Target: MRR 0.60+)
═══════════════════════════════════════════
  └─► RRF Parameter Tuning
  └─► Linear Retriever (if RRF insufficient)
  └─► Field Boosting Refinement

TIER 4: AI (Target: MRR 0.70+)
═══════════════════════════════════════════
Only if Tiers 1-3 plateau:
  └─► LLM Query Expansion                                      ⏸️ Deferred
  └─► LLM Reranking (domain-aware)
  └─► RAG for answer synthesis
```

---

## What Does "Excellent Search" Look Like?

### Without Any AI (Target: MRR 0.55+)

| Query Type | Expected Behaviour |
|------------|-------------------|
| **Topic** | Exact match on curriculum vocabulary → rank 1 |
| **Synonym** | Vocabulary bridging via synonyms → rank 1-2 |
| **Misspelling** | Fuzzy + phonetic → rank 1-2 |
| **Colloquial** | Noise filtered + synonym → rank 1-3 |
| **Multi-concept** | Cross-reference identifies intersection → rank 1-3 |
| **Naturalistic** | Phrase matching + structure → rank 1-3 |

### With Modern ES (Target: MRR 0.65+)

| Enhancement | Impact |
|-------------|--------|
| Optimised RRF | Better fusion of lexical and semantic |
| Weighted Linear | ELSER prioritised for hard queries |
| Unit context | Lessons boosted by unit relevance |
| Thread context | Coherent curriculum progression |

### With AI (Target: MRR 0.80+)

| Enhancement | Impact |
|-------------|--------|
| Query expansion | Vocabulary gaps bridged automatically |
| LLM reranking | Curriculum-aware relevance judgement |
| RAG | Answer synthesis, not just ranking |

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-19 | Semantic reranking rejected | -16.8% regression, generic model |
| 2025-12-19 | AI experiments deferred | Focus on fundamentals first |
| 2025-12-19 | Created Tier system | Discipline: master basics before complexity |
| 2025-12-19 | Synonyms top priority | 5/8 lesson failures fixable with synonyms |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ADR-082](../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | **Governing ADR** — Strategy rationale and principles |
| [ADR-081](../../../docs/architecture/architectural-decisions/081-search-approach-evaluation-framework.md) | Evaluation mechanics — metrics, harness, templates |
| [Hard Query Baseline](../baselines/hard-query-baseline.md) | Baseline data showing failure patterns |
| [Semantic Reranking](./semantic-reranking.experiment.md) | Why AI reranking failed |
| [part-1-search-excellence.md](../../plans/semantic-search/part-1-search-excellence.md) | Overall search plan |
| [search-query-optimization-research.md](../../research/search-query-optimization-research.md) | Technical approaches |

---

## Questions to Answer

1. **Synonyms + noise + phrases**: Can we reach MRR 0.45 with Tier 1 alone?
2. **Cross-reference**: Does unit context improve lesson ranking?
3. **Threads**: Can curriculum structure disambiguate queries?
4. **AI threshold**: At what MRR does AI become worth the complexity?

---

**Remember**: We have world-class educational content, expert-curated metadata, and rich curriculum structure. We should be able to build world-class search by using this data well, before reaching for AI.

