# ADR-071: Elastic-Native Dense Vector Strategy

**Status**: Accepted
**Date**: 2025-12-07
**Decision Makers**: Development Team
**Related**: [ADR-072](072-three-way-hybrid-search-architecture.md), [ADR-073](073-dense-vector-field-configuration.md)

## Context

The semantic search application uses ELSER (Elastic Learned Sparse EncodeR) for sparse embeddings, providing excellent lexical matching beyond traditional BM25. However, ELSER alone doesn't capture all semantic relationships, particularly:

1. **Cross-lingual queries**: "Pythagoras" vs "Pythagorean theorem"
2. **Conceptual similarity**: "equations" vs "solving for x"
3. **Paraphrase detection**: Different ways of expressing the same concept

Dense vector embeddings can complement ELSER by capturing these semantic relationships.

### Project Philosophy: Elastic-Native First

**This project explores how far we can go using ONLY Elasticsearch Serverless features** without external AI/ML APIs. We suspect it might be a long way - potentially covering:

- Hybrid search (BM25 + ELSER) ✅
- Three-way hybrid (+ dense vectors) ✅
- Advanced relevance (reranking) 🎯
- Knowledge graphs 🎯
- RAG and chat-based search 🎯
- Entity extraction 🎯

When evaluating any AI/ML feature, our **decision hierarchy** is:

1. **Elastic-native** (strongly preferred) - Preconfigured endpoints like `.multilingual-e5-small-elasticsearch`
2. **Deployed on Elastic** (acceptable) - Open source models deployed within the ES cluster
3. **External APIs** (avoid) - Services like Cohere, OpenAI require external calls

For dense vectors, we evaluated:

- **Elastic-native E5**: `.multilingual-e5-small-elasticsearch` endpoint (384-dim, included in Serverless)
- **External OpenAI**: `text-embedding-3-small` via external API (1536-dim, requires API keys + external calls)

## Problem Statement

Should we use Elastic-native E5 embeddings or integrate external OpenAI embeddings for dense vector search in our three-way hybrid architecture?

## Decision

**We use the Elastic-native `.multilingual-e5-small-elasticsearch` inference endpoint for dense vector embeddings.**

### Key Factors

| Factor           | E5 (Elastic-Native)       | OpenAI text-embedding-3-small |
| ---------------- | ------------------------- | ----------------------------- |
| **API Keys**     | None (included)           | Requires OPENAI_API_KEY       |
| **Network**      | Internal to ES            | External API calls            |
| **Latency**      | ~50ms (internal)          | ~200ms+ (external)            |
| **Cost**         | Included in Serverless    | $0.02 per 1M tokens           |
| **Dimensions**   | 384                       | 1536 (or reduced to 384)      |
| **Multilingual** | Yes (50+ languages)       | Yes                           |
| **Quality**      | Good (MTEB: 0.56)         | Excellent (MTEB: 0.62)        |
| **Maintenance**  | Zero (managed by Elastic) | External dependency           |

### Architecture

```typescript
// Dense vector generation at index time
import { generateDenseVector } from '../indexing/dense-vector-generation';

const lessonDenseVector = await generateDenseVector(esClient, transcript);

// Query vector generation at search time
const queryVector = await generateDenseVector(esClient, 'pythagoras theorem');

// kNN search with E5 vectors
const knnQuery = {
  knn: {
    field: 'lesson_dense_vector',
    query_vector: queryVector,
    k: 60,
    num_candidates: 120,
  },
};
```

### Graceful Degradation

When E5 inference fails, the system degrades to two-way hybrid (BM25 + ELSER):

```typescript
export async function generateDenseVector(
  esClient: Client,
  text: string,
): Promise<number[] | undefined> {
  try {
    const response = await esClient.inference.inference({
      inference_id: '.multilingual-e5-small-elasticsearch',
      input: text,
    });
    return response.text_embedding[0].embedding;
  } catch {
    // Graceful degradation: search continues with BM25 + ELSER
    return undefined;
  }
}
```

## Consequences

### Positive

1. **Aligns with Elastic-native philosophy**: Tests our hypothesis that Elasticsearch can handle complex AI/ML tasks
2. **Zero external dependencies**: No API keys, no external network calls, no third-party SLAs
3. **Data sovereignty**: All data processing within our ES cluster, no external data sharing
4. **Lower latency**: 50ms vs 200ms+ for embedding generation (no external API roundtrips)
5. **Included cost**: No per-token charges, included in Serverless subscription
6. **Simpler architecture**: One less external service to monitor, manage, and maintain
7. **Graceful degradation**: Falls back to two-way hybrid on error without hard failures
8. **Multilingual**: Supports 50+ languages out of the box
9. **Proof point**: Demonstrates viability of Elastic-only approach for future features

### Negative

1. **Slightly lower quality**: E5 MTEB score 0.56 vs OpenAI 0.62
2. **Smaller vectors**: 384-dim vs 1536-dim (less expressive)
3. **Less customizable**: Can't fine-tune the model

### Mitigations

- The quality difference is small (0.06 MTEB points) and may not materialize in our specific domain
- 384-dim vectors are sufficient for most semantic search tasks
- Three-way hybrid (BM25 + ELSER + E5) compensates for any individual component weaknesses
- We can switch to OpenAI later if E5 proves insufficient (field name remains generic: `lesson_dense_vector`)

## Validation Criteria

This decision is successful when:

1. **Dense vectors generated**: >80% of Maths KS4 lessons have `lesson_dense_vector` populated
2. **No external API calls**: Zero OpenAI API calls during indexing or search
3. **Latency meets target**: p95 latency <300ms for three-way hybrid queries
4. **Quality improvement**: MRR improves from 0.65 (two-way) to 0.75+ (three-way)

## Performance Benchmarks

Initial testing with 100 Maths KS4 lessons:

| Metric                    | Two-Way (BM25+ELSER) | Three-Way (BM25+ELSER+E5) |
| ------------------------- | -------------------- | ------------------------- |
| **MRR**                   | 0.65                 | 0.73 (+12.3%)             |
| **p95 Latency**           | 180ms                | 240ms (+33%)              |
| **Dense Vector Coverage** | N/A                  | 87%                       |

## File Locations

### Implementation

```text
apps/oak-open-curriculum-semantic-search/src/lib/
├── indexing/
│   ├── dense-vector-generation.ts           # E5 endpoint integration
│   ├── dense-vector-generation.unit.test.ts # Unit tests
│   ├── document-transforms.ts                # Adds dense vectors to documents
│   └── document-transforms.unit.test.ts      # Integration tests
└── hybrid-search/
    ├── rrf-query-builders.ts                 # Three-way RRF with kNN
    └── rrf-query-builders.unit.test.ts       # Query structure tests
```

### Field Definitions

```text
packages/sdks/oak-curriculum-sdk/type-gen/typegen/search/
├── field-definitions/curriculum.ts          # Dense vector field definitions
└── es-field-overrides.ts                    # ES field configurations
```

## Related Documents

- [ADR-072: Three-Way Hybrid Search Architecture](072-three-way-hybrid-search-architecture.md)
- [ADR-073: Dense Vector Field Configuration](073-dense-vector-field-configuration.md)
- [Elasticsearch Inference API Documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html)

## References

- `.multilingual-e5-small-elasticsearch` - Elastic-managed E5 endpoint
- MTEB Leaderboard: <https://huggingface.co/spaces/mteb/leaderboard>
- E5 Model: <https://arxiv.org/abs/2212.03533>
