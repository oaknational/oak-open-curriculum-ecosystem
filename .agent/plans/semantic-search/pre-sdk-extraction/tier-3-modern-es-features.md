# Tier 3: Modern ES Features

**Status**: 📋 Planned — Prerequisite: Tier 2 complete
**Priority**: MEDIUM — Final tier before AI enhancement
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03 (Extracted from search-acceptance-criteria.md)

---

## Overview

Tier 3 tunes ES-native features (RRF weights, field boosts, kNN) to maximize retrieval quality before considering AI enhancement.

**Prerequisite**: [Tier 2: Document Relationships](tier-2-document-relationships.md) should complete first.

**Exit Criteria** (from [search-acceptance-criteria.md](../search-acceptance-criteria.md)):

| Criterion          | Target | Current | Status             |
| ------------------ | ------ | ------- | ------------------ |
| Aggregate Hard MRR | ≥ 0.60 | 0.614   | ✅ Already exceeded |
| Tier 2 exhausted   | Complete | Pending | ❌ Blocked by Tier 2 |

---

## Standard Approaches Checklist

All items must be attempted and documented before Tier 3 can be declared "exhausted":

- [ ] RRF k-parameter tuning experiments
- [ ] Per-field boost weight optimisation
- [ ] Query-time synonym expansion (vs index-time)
- [ ] kNN vector search evaluation

---

## RRF Parameter Tuning

### Current Configuration

The current RRF configuration uses default k=60:

```typescript
const rrfConfig = {
  rank: {
    rrf: {
      rank_constant: 60, // Default, not tuned
      window_size: 100,
    },
  },
};
```

### Experiment Design

| k Value | Expected Behaviour                    |
| ------- | ------------------------------------- |
| k=1     | Winner-takes-all, first rank dominates |
| k=60    | Default, balanced fusion              |
| k=100+  | More weight to lower-ranked results   |

**Experiment protocol**:

1. Baseline with k=60
2. Test k values: [20, 40, 60, 80, 100]
3. Measure MRR per category
4. Select optimal k

---

## Field Boost Optimization

### Current Boosts

```typescript
const fields = [
  'title^3',
  'lesson_description^2',
  'key_learning_points^2',
  'transcript_sentences^1',
  // ...
];
```

### Optimization Approach

1. **Ablation study**: Remove each boost, measure impact
2. **Sensitivity analysis**: Test boost values [1, 2, 3, 4, 5]
3. **Per-query-type optimization**: Different boosts for different intent

---

## Query-Time vs Index-Time Synonyms

### Current: Index-Time

Synonyms are applied at index time via analyzer:

```typescript
const synonymAnalyzer = {
  tokenizer: 'standard',
  filter: ['lowercase', 'curriculum_synonyms'],
};
```

**Pros**: Fast query execution
**Cons**: Requires reindex for changes

### Alternative: Query-Time

```typescript
const queryTimeSynonyms = {
  match: {
    title: {
      query: userQuery,
      analyzer: 'curriculum_synonym_analyzer',
    },
  },
};
```

**Pros**: No reindex needed, can A/B test
**Cons**: Slight query latency increase

### Experiment Design

1. Create identical index without index-time synonyms
2. Apply synonyms at query time
3. Compare MRR and latency
4. Document trade-offs in ADR

---

## kNN Vector Search Evaluation

### Current: ELSER Sparse Vectors

We use ELSER for semantic search via sparse vectors:

```typescript
const elserQuery = {
  sparse_vector: {
    field: 'title_semantic',
    inference_id: '.elser-2-elasticsearch',
    query: userQuery,
  },
};
```

### Alternative: Dense kNN

```typescript
const knnQuery = {
  knn: {
    field: 'title_dense_vector',
    query_vector_builder: {
      text_embedding: {
        model_id: 'sentence-transformers__all-MiniLM-L6-v2',
        model_text: userQuery,
      },
    },
    k: 10,
    num_candidates: 100,
  },
};
```

### When to Consider kNN

| Scenario                        | Recommendation |
| ------------------------------- | -------------- |
| ELSER MRR plateau               | Evaluate kNN   |
| Specific query types underperform | Hybrid kNN + ELSER |
| Latency requirements strict     | Dense vectors faster |

---

## Deferred ES Enhancements (From M3)

These were deferred from Phase 3e pending full ground truth coverage:

| Task | Description                          | Prerequisite                 |
| ---- | ------------------------------------ | ---------------------------- |
| 3e.4 | Phonetic matching (`double_metaphone`) | Full cross-curriculum GT    |
| 3e.5 | `search_as_you_type` fields          | Completion feature requirements |

---

## Evaluation Requirements

For each Tier 3 experiment:

1. **Design**: Create experiment file with hypothesis
2. **Baseline**: Run `pnpm eval:per-category`
3. **Implement**: Make the configuration change
4. **Measure**: Run evaluation again
5. **Analyse**: Per-category breakdown
6. **Record**: [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

---

## Success Criteria

Tier 3 is "exhausted" when:

1. All checklist items attempted and documented
2. No further MRR improvement possible from ES-native changes
3. ≤5% aggregate MRR improvement across 3 consecutive experiments

At this point, and only at this point, Tier 4 (AI Enhancement) may be considered.

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../search-acceptance-criteria.md](../search-acceptance-criteria.md)                          | Tier 3 checklist     |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first   |
| [ES RRF documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html) | RRF reference        |
| [ELSER documentation](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/elser) | ELSER reference      |

