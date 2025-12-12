# ADR-072: Three-Way Hybrid Search Architecture

**Status**: SUPERSEDED by [ADR-075](075-dense-vector-removal.md)  
**Date**: 2025-12-07  
**Superseded Date**: 2025-12-12  
**Decision Makers**: Development Team  
**Related**: [ADR-071](071-elastic-native-dense-vector-strategy.md), [ADR-073](073-dense-vector-field-configuration.md)

> ⚠️ **This ADR has been superseded.** Phase 2 evaluation showed three-way hybrid (BM25 + ELSER + E5) provides no benefit over two-way hybrid (BM25 + ELSER). The architecture reverted to two-way hybrid. See [ADR-075](075-dense-vector-removal.md) for the decision to remove dense vector code.

## Context

The semantic search application currently uses two-way hybrid search combining:

1. **BM25 (lexical)**: Traditional keyword matching with tf-idf weighting
2. **ELSER (sparse embeddings)**: Learned sparse representations for semantic matching

This provides good results, but leaves semantic gaps:

- **BM25** excels at exact keyword matches but misses synonyms and paraphrases
- **ELSER** captures semantic relationships but can miss conceptual similarities
- Neither fully captures **dense semantic relationships** (e.g., "solving equations" → "algebra")

Elasticsearch Serverless supports **Reciprocal Rank Fusion (RRF)** to combine multiple search methods. We can add **dense vector search (kNN)** as a third retrieval method.

## Problem Statement

How do we integrate dense vector search into our existing two-way hybrid architecture while maintaining:

- **Graceful degradation** if dense vector generation fails
- **Performance targets** (p95 latency <300ms)
- **Simple query construction** for downstream consumers

## Decision

**We implement three-way hybrid search using Reciprocal Rank Fusion (RRF) to combine BM25, ELSER, and dense vector (kNN) retrieval.**

### Architecture

```typescript
// Three-way RRF query structure
const threeWayRank = {
  rrf: {
    window_size: 60,    // Consider top 60 results from each method
    rank_constant: 60   // RRF ranking parameter
  },
  queries: [
    // 1. BM25 lexical search
    {
      multi_match: {
        query: 'pythagoras theorem',
        type: 'best_fields',
        tie_breaker: 0.2,
        fields: [
          'lesson_title^3',
          'lesson_keywords^2',
          'key_learning_points^2',
          'transcript_text',
        ],
      },
    },

    // 2. ELSER sparse embeddings
    {
      semantic: {
        field: 'lesson_semantic',
        query: 'pythagoras theorem',
      },
    },

    // 3. Dense vector kNN (E5 embeddings)
    {
      knn: {
        field: 'lesson_dense_vector',
        query_vector: [0.1, 0.2, ...], // 384-dim E5 vector
        k: 60,
        num_candidates: 120,
        // Filtered kNN: apply filters DURING search
        filter: [
          { term: { subject_slug: 'maths' } },
          { term: { key_stage: 'ks4' } },
        ],
      },
    },
  ],
};
```

### RRF Score Combination

Reciprocal Rank Fusion combines scores using the formula:

```text
RRF_score(doc) = Σ (1 / (rank_constant + rank_i(doc)))
```

Where:

- `rank_i(doc)` = position of document in result set `i`
- `rank_constant = 60` (typical value, balances precision/recall)

**Example**: Document appears at position 5 in BM25, position 12 in ELSER, position 3 in kNN:

```text
RRF_score = 1/(60+5) + 1/(60+12) + 1/(60+3)
          = 1/65 + 1/72 + 1/63
          = 0.0154 + 0.0139 + 0.0159
          = 0.0452
```

Documents ranked highest by this combined score are returned.

### Graceful Degradation

If dense vector generation fails, the system automatically degrades to two-way hybrid:

```typescript
export async function buildThreeWayLessonRrfRequest(
  esClient: Client,
  params: LessonRrfParams,
): Promise<EsSearchRequest> {
  const queryVector = await generateDenseVector(esClient, params.text);

  const queries: QueryContainer[] = [
    // BM25 query
    {
      multi_match: {
        /* ... */
      },
    },
    // ELSER query
    {
      semantic: {
        /* ... */
      },
    },
  ];

  // Add kNN query only if vector generation succeeded
  if (queryVector) {
    queries.push({
      knn: {
        field: 'lesson_dense_vector',
        query_vector: queryVector,
        /* ... */
      },
    });
  }

  return {
    rank: { rrf: { window_size: 60, rank_constant: 60 }, queries },
    /* ... */
  };
}
```

### Filtered kNN Optimization

Filters are applied **DURING** kNN search, not post-filter, for ~50% latency reduction:

```typescript
// ✅ Good: Filtered kNN (filters applied during vector search)
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [0.1, 0.2, ...],
    k: 60,
    filter: [
      { term: { subject_slug: 'maths' } },
      { term: { key_stage: 'ks4' } },
    ],
  },
}

// ❌ Bad: Post-filter kNN (filters applied after vector search)
{
  knn: {
    field: 'lesson_dense_vector',
    query_vector: [0.1, 0.2, ...],
    k: 60,
  },
  // Filter outside knn block - applied AFTER search
}
```

## Consequences

### Positive

1. **Better semantic recall**: Captures conceptual relationships BM25/ELSER miss
2. **Complementary strengths**: Three methods cover different matching aspects
3. **Graceful degradation**: Falls back to two-way if dense vectors unavailable
4. **Simple API**: Downstream consumers call one function, get best results
5. **Proven approach**: RRF is well-tested in production ES deployments

### Negative

1. **Increased latency**: +60ms vs two-way (240ms vs 180ms p95)
2. **More complex queries**: Three sub-queries instead of two
3. **Higher compute cost**: kNN search adds vector distance calculations

### Mitigations

- Filtered kNN reduces latency by 50% vs post-filter approach
- Graceful degradation ensures service continuity
- Performance budgets established: p95 <300ms remains acceptable
- Three-way only used when dense vectors available (>80% coverage target)

## Validation Criteria

This decision is successful when:

1. **MRR improvement**: Three-way achieves MRR 0.75+ (vs 0.65 two-way baseline)
2. **Latency acceptable**: p95 latency <300ms for three-way queries
3. **Graceful degradation works**: System handles missing dense vectors without errors
4. **A/B test shows improvement**: Teachers prefer three-way results (subjective quality)

## Performance Benchmarks

Initial testing with 100 Maths KS4 lessons:

| Metric               | Two-Way       | Three-Way     | Change                  |
| -------------------- | ------------- | ------------- | ----------------------- |
| **MRR**              | 0.65          | 0.73          | +12.3% ✅               |
| **p95 Latency**      | 180ms         | 240ms         | +33% (within budget) ✅ |
| **Query Complexity** | 2 sub-queries | 3 sub-queries | +50%                    |

### Query-by-Query Comparison

| Query                         | Two-Way Rank | Three-Way Rank | Correct Rank | Winner       |
| ----------------------------- | ------------ | -------------- | ------------ | ------------ |
| "pythagoras theorem"          | 3            | 1              | 1            | Three-way ✅ |
| "solving quadratic equations" | 1            | 1              | 1            | Tie          |
| "fraction addition"           | 2            | 1              | 1            | Three-way ✅ |

## File Locations

### Implementation

```text
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts                    # Three-way RRF functions
└── rrf-query-builders.unit.test.ts          # Query structure tests
```

### Tests

```text
apps/oak-open-curriculum-semantic-search/e2e-tests/
└── three-way-hybrid.e2e.test.ts             # Three-way vs two-way comparison
```

## Related Documents

- [ADR-071: Elastic-Native Dense Vector Strategy](071-elastic-native-dense-vector-strategy.md)
- [ADR-073: Dense Vector Field Configuration](073-dense-vector-field-configuration.md)
- [Elasticsearch RRF Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html)
- [Elasticsearch kNN Search](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)

## References

- Reciprocal Rank Fusion paper: <https://plg.uwaterloo.ca/~gvcormac/cormacksigir09-rrf.pdf>
- Elasticsearch RRF implementation: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>
- Filtered kNN: <https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html#knn-search-filter>
