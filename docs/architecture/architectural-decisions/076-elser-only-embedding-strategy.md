# ADR-076: ELSER-Only Embedding Strategy

**Status**: Accepted  
**Date**: 2025-12-12  
**Decision Makers**: Development Team  
**Related**: [ADR-074](074-elastic-native-first-philosophy.md), [ADR-075](075-dense-vector-removal.md), [ADR-077](077-semantic-summary-generation.md)

## Context

After Phase 2 evaluation showed E5 dense vectors provide no benefit for curriculum search (see ADR-075), we adopt a simplified embedding strategy using only ELSER (Elastic Learned Sparse EncodeR) for semantic matching.

### Current Implementation

| Resource | ELSER Field       | Content                         | Token Count |
| -------- | ----------------- | ------------------------------- | ----------- |
| Lessons  | `lesson_semantic` | Full video transcript           | ~5000       |
| Units    | `unit_semantic`   | `rollupText` (enriched summary) | ~200-400    |

### The Problem

**Lessons**: Full transcripts work well for ELSER but:

- No summary field exists for conceptual/pedagogical matching
- Long transcripts may dilute key pedagogical signals

**Units**: `rollupText` is aggregated from lesson data but:

- Composition logic is custom and maintenance-heavy
- No semantic summary capturing unit-level pedagogy

## Decision

**Use ELSER sparse embeddings exclusively for semantic search, with plans to add semantic summary fields.**

### Why ELSER, Not Dense Vectors?

Per Elasticsearch documentation, ELSER excels at:

1. **Domain-specific terminology**: Curriculum vocabulary (quadratic, denominator, photosynthesis)
2. **Exact concept matching**: "solving equations" matches lessons about algebraic solutions
3. **Out-of-vocabulary handling**: Graceful degradation for unusual terms

See: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>

Dense vectors (E5) are better for:

1. Cross-lingual queries (not needed - curriculum is English)
2. Abstract conceptual similarity (curriculum terms are specific)
3. Paraphrase detection (less important than exact curriculum matching)

### Current Architecture

**Key clarification**: RRF combines **retrievers** (search methods), not indices. All retrievers query the same `oak_lessons` index using different matching strategies.

| Retriever | Type            | Field(s)                                             | Purpose           |
| --------- | --------------- | ---------------------------------------------------- | ----------------- |
| BM25      | Lexical         | `lesson_title`, `lesson_keywords`, `transcript_text` | Keyword matching  |
| ELSER     | Sparse semantic | `lesson_semantic` (full transcript)                  | Semantic matching |

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        {
          "standard": {
            "query": {
              "multi_match": {
                "query": "quadratic equations",
                "fields": ["lesson_title^3", "lesson_keywords^2", "transcript_text"]
              }
            }
          }
        },
        {
          "standard": {
            "query": {
              "semantic": {
                "field": "lesson_semantic",
                "query": "quadratic equations"
              }
            }
          }
        }
      ],
      "rank_window_size": 100,
      "rank_constant": 60
    }
  }
}
```

### Planned Enhancement: Three-Way with Summary ELSER

With semantic summaries (ADR-077), we add a **third retriever** (still same index):

| Retriever          | Type            | Field                     | Purpose                         |
| ------------------ | --------------- | ------------------------- | ------------------------------- |
| BM25               | Lexical         | Multiple text fields      | Keyword matching                |
| ELSER (transcript) | Sparse semantic | `lesson_semantic`         | Detailed content matching       |
| ELSER (summary)    | Sparse semantic | `lesson_summary_semantic` | Conceptual/pedagogical matching |

**⚠️ Important terminology**: This "three-way" refers to BM25 + transcript ELSER + summary ELSER, **NOT** the superseded three-way hybrid with dense vectors (ADR-072). Dense vectors provided no benefit and are removed (ADR-075).

This enables queries to match:

- Keywords in lesson text (BM25)
- Detailed lesson content semantically (transcript ELSER)
- High-level lesson concepts semantically (summary ELSER)

**Status**: Under evaluation for Phase 3b.

## Consequences

### Positive

1. **Simpler architecture**: One embedding type (ELSER) to manage
2. **Lower latency**: No dense vector search overhead
3. **Elastic-native**: Uses included `.elser-2-elasticsearch` endpoint ($0 cost)
4. **Proven quality**: MRR 0.908 (lessons), 0.915 (units) with ELSER alone
5. **Domain-appropriate**: ELSER handles curriculum vocabulary well

### Negative

1. **No cross-lingual support**: English-only (acceptable for UK curriculum)
2. **Potential ceiling**: May hit quality limits for conceptual queries
3. **Transcript dependency**: Lesson quality depends on transcript availability

### Mitigations

- Monitor search quality metrics continuously
- Semantic summary fields will add pedagogical signal without dense vectors
- Dense vectors can be reintroduced if ELSER proves insufficient (unlikely based on results)

## Validation Criteria

This decision is successful when:

1. **MRR targets met**: Lessons >0.70, Units >0.60 using ELSER only
2. **Zero external API costs**: All embeddings via `.elser-2-elasticsearch`
3. **Latency targets met**: p95 <300ms for hybrid (BM25 + ELSER) queries

## Current Performance

| Search Type | MRR       | NDCG@10   | Latency (p95) |
| ----------- | --------- | --------- | ------------- |
| Lessons     | **0.908** | 0.725     | 367ms         |
| Units       | **0.915** | **0.924** | 196ms         |

Both exceed targets using ELSER-only semantic matching.

## File Locations

### ELSER Integration

```text
apps/oak-search-cli/src/lib/hybrid-search/
├── rrf-query-helpers.ts      # createLessonElserRetriever(), createUnitElserRetriever()
├── rrf-query-builders.ts     # Two-way RRF (BM25 + ELSER)
└── lessons.ts, units.ts      # Search implementations
```

### Document Transforms

```text
apps/oak-search-cli/src/lib/indexing/
├── document-transforms.ts    # Sets lesson_semantic, unit_semantic fields
└── document-transform-helpers.ts  # createEnrichedRollupText()
```

## Related Documents

- [ADR-074](074-elastic-native-first-philosophy.md) - Elastic-native philosophy
- [ADR-075](075-dense-vector-removal.md) - Dense vector removal rationale
- [ADR-077](077-semantic-summary-generation.md) - Semantic summary strategy
- [Elasticsearch ELSER Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html)

## References

- ELSER overview: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search-elser.html>
- Hybrid search with RRF: <https://www.elastic.co/guide/en/elasticsearch/reference/current/rrf.html>
- Semantic search patterns: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html>
