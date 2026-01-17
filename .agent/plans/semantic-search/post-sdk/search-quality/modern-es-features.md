# Modern ES Features — HIGHEST ROI

**Stream**: search-quality  
**Level**: 3  
**Status**: 📋 Pending — After Level 2  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17  
**Research**: [elasticsearch-approaches.md](../../../research/elasticsearch/oak-data/elasticsearch-approaches.md)

---

## Overview

This plan applies ES-native features to maximize retrieval quality. **These are the highest-ROI changes** per research recommendations. Semantic reranking and query rules are NOT AI features — they are Elastic-native capabilities.

**Prerequisite**: [Document Relationships](document-relationships.md) should complete first.

**Exit Criteria** (from [search-acceptance-criteria.md](../../search-acceptance-criteria.md)):

| Criterion          | Target | Current | Status             |
| ------------------ | ------ | ------- | ------------------ |
| Aggregate Hard MRR | ≥ 0.60 | 0.614   | ✅ Already exceeded |
| Level 2 exhausted  | Complete | Pending | ⏸️ Blocked by Level 2 |

---

## Standard Approaches Checklist

All items must be attempted and documented before this level can be declared "exhausted":

### 🔴 HIGHEST Priority

- [ ] **Semantic reranking** (`text_similarity_reranker`) — Research #1 recommendation
- [ ] **Query rules** (rule retriever for deterministic intent) — Research #2 recommendation
- [ ] **Definition retrieval** — See [definition-retrieval.md](definition-retrieval.md)
- [ ] **Negative controls** — Subject/phase mismatch penalties

### 🟡 MEDIUM Priority

- [ ] RRF k-parameter tuning experiments
- [ ] Per-field boost weight optimisation
- [ ] Query-time synonym expansion (vs index-time)
- [ ] Relationship channel (dedicated field + retriever)
- [ ] kNN vector search evaluation

---

## 🔴 HIGHEST: Semantic Reranking

### What It Is

The `text_similarity_reranker` is an **Elastic-native retriever** that provides two-stage semantic reranking:

```
Stage 1: RRF fusion (current architecture)
         ↓
Stage 2: text_similarity_reranker (re-scores top-K)
```

### Why It Matters

From research ([elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md)):

- Works on top of existing RRF without replacing it
- Jina AI models (`jina-reranker-v2-base-multilingual`) available in ES Serverless
- Typical improvement: 5-15% MRR lift on educational content
- Often the biggest "it understands me" improvement for NL queries

### Implementation Pattern

```json
{
  "retriever": {
    "text_similarity_reranker": {
      "retriever": {
        "rrf": {
          "retrievers": [
            { "standard": { "query": { "match": { "lesson_structure": "fractions for beginners" } } } },
            { "standard": { "query": { "semantic": { "field": "lesson_structure_semantic", "query": "fractions for beginners" } } } }
          ]
        }
      },
      "field": "lesson_structure",
      "inference_id": "jina-reranker",
      "inference_text": "fractions for beginners",
      "rank_window_size": 50
    }
  }
}
```

### Experiment Design

1. **Baseline**: Current RRF without reranking
2. **Test**: Add `text_similarity_reranker` with various `rank_window_size` values [25, 50, 100]
3. **Measure**: MRR per category, latency
4. **Document**: [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

**References**:
- [Semantic reranking](https://www.elastic.co/docs/solutions/search/ranking/semantic-reranking)
- [`text_similarity_reranker` retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/text-similarity-reranker-retriever)

---

## 🔴 HIGHEST: Query Rules

### What It Is

The Rule Retriever applies deterministic rules for specific query patterns:

- **Definition queries**: "what is a coefficient?" → boost glossary/definition content
- **Navigational queries**: "Year 5 fractions" → apply year filter automatically
- **Pinning**: Specific queries → guaranteed results

### Why It Matters

From research ([elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md)):

- Deterministic, predictable behaviour for known query patterns
- No LLM cost or latency for intent handling
- **Must be outermost retriever layer**

### Implementation Pattern

```json
{
  "retriever": {
    "rule": {
      "match_criteria": [
        { "type": "contains", "metadata": "query", "contains": "what is" }
      ],
      "ruleset_ids": ["definition-queries"],
      "retriever": {
        "text_similarity_reranker": {
          "retriever": { "rrf": { "..." } }
        }
      }
    }
  }
}
```

### Rule Categories to Create

| Category | Trigger | Action |
|----------|---------|--------|
| Definition | "what is", "what does X mean" | Boost definition fields |
| Year-level | "year 5", "Y5", "KS2" | Apply filter automatically |
| Beginner | "introduction", "beginner", "first lesson" | Boost lesson_order=1 |
| Advanced | "challenging", "extension", "advanced" | Boost later lessons in unit |

**References**:
- [Rule retriever](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rule-retriever)
- [Semantic search + Query rules](https://www.elastic.co/search-labs/blog/semantic-search-query-rules)

---

## 🔴 HIGHEST: Negative Controls

### The Problem

Current search only **boosts** relevant results. It doesn't **penalise** irrelevant ones.

Without negative controls:
- Ambiguous queries drift toward overly broad results
- Sensitive domains risk over-recall
- Subject/phase mismatches go unpenalised

### Implementation: Subject Mismatch Penalty

```json
{
  "query": {
    "bool": {
      "must": [{ "/* main query */" }],
      "must_not": [
        { "/* exclusion rules */" }
      ],
      "should": [
        { "term": { "subject_slug": { "value": "maths", "boost": 1.5 } } }
      ],
      "negative_boost": {
        "query": { "/* subject mismatch */" },
        "negative_boost": 0.5
      }
    }
  }
}
```

### Negative Control Categories

| Control | Trigger | Action |
|---------|---------|--------|
| Subject mismatch | Query implies subject X, result is subject Y | Demote by 0.5 |
| Phase mismatch | Query implies KS3, result is KS4 | Demote by 0.7 |
| Sensitivity filter | Query + sensitive subject | Apply stricter relevance threshold |
| Known bad match | Specific query + specific doc | Exclude |

### When to Demote vs Exclude

| Severity | Action | Example |
|----------|--------|---------|
| Wrong subject | Demote | "maths fractions" matching English lesson |
| Wrong phase | Demote | "KS2 photosynthesis" matching KS4 content |
| Dangerous mismatch | Exclude | Sensitive content in wrong context |

---

## 🟡 MEDIUM: RRF Parameter Tuning

### Current Configuration

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

**Protocol**:
1. Baseline with k=60
2. Test k values: [20, 40, 60, 80, 100]
3. Measure MRR per category
4. Select optimal k

---

## 🟡 MEDIUM: Field Boost Optimisation

### Current Boosts

```typescript
const fields = [
  'title^3',
  'lesson_description^2',
  'key_learning_points^2',
  'transcript_sentences^1',
];
```

### Optimisation Approach

1. **Ablation study**: Remove each boost, measure impact
2. **Sensitivity analysis**: Test boost values [1, 2, 3, 4, 5]
3. **Per-query-type optimisation**: Different boosts for different intent

---

## 🟡 MEDIUM: Relationship Channel

### From Research

Instead of encoding relationships as synonyms, create a dedicated channel:

1. Index relationship terms into `related_terms` field
2. Add retriever targeting that field
3. Fuse via RRF
4. Let reranking decide ordering

This captures domain adjacency without polluting equivalence logic.

---

## Evaluation Requirements

For each Level 3 experiment:

1. **Design**: Create experiment file with hypothesis
2. **Baseline**: Run `pnpm benchmark --all`
3. **Implement**: Make the configuration change
4. **Measure**: Run benchmark again
5. **Analyse**: Per-category breakdown
6. **Record**: [EXPERIMENT-LOG.md](../../evaluations/EXPERIMENT-LOG.md)

---

## Success Criteria

Level 3 is "exhausted" when:

1. All checklist items attempted and documented
2. No further MRR improvement possible from ES-native changes
3. ≤5% aggregate MRR improvement across 3 consecutive experiments

At this point, Level 4 (AI Enhancement) begins.

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [elasticsearch-approaches.md](../../research/elasticsearch/oak-data/elasticsearch-approaches.md) | Detailed ES patterns |
| [uses-of-structured-domain-knowledge.md](../../research/elasticsearch/oak-data/uses-of-structured-domain-knowledge.md) | All vocabulary levers |
| [definition-retrieval.md](definition-retrieval.md) | Definition capability |
| [search-decision-model.md](search-decision-model.md) | Query shape taxonomy |
| [../../search-acceptance-criteria.md](../../search-acceptance-criteria.md) | Level 3 checklist |
| [ADR-082](../../../../docs/architecture/architectural-decisions/082-fundamentals-first-search-strategy.md) | Fundamentals-first |
