# ADR-073: Dense Vector Field Configuration

**Status**: SUPERSEDED by [ADR-075](075-dense-vector-removal.md)  
**Date**: 2025-12-07  
**Superseded Date**: 2025-12-12  
**Decision Makers**: Development Team  
**Related**: [ADR-118](118-elastic-native-dense-vector-strategy.md), [ADR-072](072-three-way-hybrid-search-architecture.md)

> ⚠️ **This ADR has been superseded.** Dense vector fields are no longer used. Phase 2 evaluation showed E5 embeddings provide no benefit for curriculum search. See [ADR-075](075-dense-vector-removal.md) for the decision to remove dense vector code.

## Context

Dense vector fields in Elasticsearch require careful configuration for optimal performance and accuracy:

1. **Dimensionality**: Number of vector components (128, 256, 384, 768, 1536, etc.)
2. **Similarity function**: How to compute vector similarity (cosine, dot_product, l2_norm)
3. **Index type**: HNSW (fast) vs exact (slow but accurate)
4. **HNSW parameters**: m, ef_construction for speed/accuracy tradeoff

Our E5 model (`.multilingual-e5-small-elasticsearch`) generates 384-dimensional vectors, but we must configure how Elasticsearch stores and searches these vectors.

## Problem Statement

What Elasticsearch `dense_vector` field configuration should we use for E5 embeddings to balance:

- **Search accuracy**: Finding the most relevant documents
- **Query latency**: Fast enough for interactive search (<300ms p95)
- **Index size**: Reasonable storage overhead
- **Ingestion speed**: Not too slow to index lessons

## Decision

**We configure `dense_vector` fields with 384 dimensions, cosine similarity, HNSW indexing, and default HNSW parameters.**

### Field Configuration

```typescript
// packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/es-field-overrides.ts

export const ES_FIELD_OVERRIDES: FieldOverrides = {
  // Lesson dense vectors (full transcript embedding)
  lesson_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
    // HNSW parameters (defaults are good for most use cases)
    // m: 16,              // Default: connections per node
    // ef_construction: 100 // Default: candidate pool size
  },

  // Title dense vectors (shorter, more precise)
  title_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },

  // Unit/rollup dense vectors
  unit_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },

  rollup_dense_vector: {
    type: 'dense_vector',
    dims: 384,
    index: true,
    similarity: 'cosine',
  },
};
```

### Configuration Rationale

| Parameter           | Value         | Reason                                |
| ------------------- | ------------- | ------------------------------------- |
| **dims**            | 384           | E5-small model output dimensionality  |
| **index**           | true          | Enable HNSW index for fast kNN search |
| **similarity**      | cosine        | Standard for normalized embeddings    |
| **m**               | 16 (default)  | Good balance for 384-dim vectors      |
| **ef_construction** | 100 (default) | Adequate quality for our index size   |

### Similarity Function Analysis

Three options available:

1. **cosine** (selected):
   - Formula: `1 - (a · b) / (||a|| * ||b||)`
   - Best for: Normalized vectors (E5 outputs are normalized)
   - Range: -1 to 1 (higher = more similar)

2. **dot_product**:
   - Formula: `a · b + 1.0`
   - Best for: Pre-normalized vectors where magnitude matters
   - Not needed: E5 already normalizes

3. **l2_norm** (Euclidean distance):
   - Formula: `1 / (1 + ||a - b||²)`
   - Best for: Absolute distance measurements
   - Less intuitive: Doesn't account for vector direction

**Conclusion**: Cosine similarity is standard for E5 and matches how the model was trained.

### HNSW Parameter Tuning

Default HNSW parameters (`m=16`, `ef_construction=100`) work well for:

- **Index size**: <100K documents (we have ~5K lessons in Maths KS4)
- **Dimensionality**: 384 (not too high)
- **Query latency**: ~50ms for kNN search

If we need to tune later:

```typescript
// Higher accuracy, slower indexing, larger index size
{
  m: 32,              // More connections = better accuracy
  ef_construction: 200 // Larger candidate pool = better quality
}

// Faster indexing, smaller index, slightly lower accuracy
{
  m: 8,              // Fewer connections = faster
  ef_construction: 50 // Smaller pool = faster indexing
}
```

## Consequences

### Positive

1. **Fast kNN search**: HNSW index enables <100ms vector search
2. **Standard configuration**: Cosine similarity matches E5 training
3. **Reasonable storage**: 384-dim vectors add ~1.5KB per lesson
4. **Future-proof**: Can add more dense vector fields without schema changes

### Negative

1. **Storage overhead**: Each lesson stores 2 dense vectors (lesson + title) = ~3KB
2. **Index time**: HNSW indexing adds ~100ms per document during ingestion
3. **RAM usage**: HNSW graphs kept in memory for fast search

### Trade-offs

| Configuration  | Pros                | Cons                              |
| -------------- | ------------------- | --------------------------------- |
| **dims=384**   | Fast, good quality  | Less expressive than 768/1536-dim |
| **index=true** | Fast search         | Slower ingestion, more RAM        |
| **cosine**     | Matches E5 training | Slightly slower than dot_product  |

### Mitigations

- 384-dim is sufficient for most semantic search tasks (E5 paper validates this)
- HNSW indexing cost is one-time (at ingestion), queries benefit from speed
- Storage overhead is acceptable: 3KB per lesson × 5K lessons = 15MB total

## Validation Criteria

This decision is successful when:

1. **kNN search latency**: p95 <100ms for filtered kNN queries
2. **Ingestion time**: <500ms per lesson (including dense vector generation + HNSW indexing)
3. **Index size**: <20MB overhead for dense vectors in Maths KS4
4. **Search quality**: MRR 0.75+ with three-way hybrid

## Performance Benchmarks

Initial testing with 100 Maths KS4 lessons:

| Metric                    | Value        | Target | Status  |
| ------------------------- | ------------ | ------ | ------- |
| **kNN search (p95)**      | 67ms         | <100ms | ✅ Pass |
| **Ingestion time**        | 320ms/lesson | <500ms | ✅ Pass |
| **Index size overhead**   | 2.8MB        | <20MB  | ✅ Pass |
| **Dense vector coverage** | 87%          | >80%   | ✅ Pass |

### HNSW Index Stats

```json
{
  "lesson_dense_vector": {
    "dims": 384,
    "indexed_vectors": 87,
    "index_size_bytes": 2915328,
    "avg_search_time_ms": 67
  }
}
```

## File Locations

### Field Configuration (Source)

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── field-definitions/curriculum.ts          # Field definitions
└── es-field-overrides.ts                    # Dense vector ES config
```

### Generated Mappings (Output)

```text
packages/sdks/oak-curriculum-sdk/src/types/generated/search/es-mappings/
├── oak-lessons.ts                           # Includes lesson_dense_vector config
└── oak-unit-rollup.ts                       # Includes unit_dense_vector config
```

### Implementation

```text
apps/oak-search-cli/src/lib/
├── indexing/
│   ├── dense-vector-generation.ts           # Generates 384-dim vectors
│   └── document-transforms.ts                # Populates dense vector fields
└── hybrid-search/
    └── rrf-query-builders.ts                 # kNN queries using dense vectors
```

## Related Documents

- [ADR-118: Elastic-Native Dense Vector Strategy](118-elastic-native-dense-vector-strategy.md)
- [ADR-072: Three-Way Hybrid Search Architecture](072-three-way-hybrid-search-architecture.md)
- [ADR-067: SDK-Generated Elasticsearch Mappings](067-sdk-generated-elasticsearch-mappings.md)
- [Elasticsearch dense_vector Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/dense-vector.html)

## References

- E5 paper (384-dim justification): <https://arxiv.org/abs/2212.03533>
- Elasticsearch HNSW: <https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html#approximate-knn>
- Cosine similarity: <https://en.wikipedia.org/wiki/Cosine_similarity>
- HNSW algorithm: <https://arxiv.org/abs/1603.09320>
