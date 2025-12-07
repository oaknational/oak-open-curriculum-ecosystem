# ADR-074: Elastic-Native-First Philosophy

**Status**: Accepted  
**Date**: 2025-12-07  
**Decision Makers**: Development Team  
**Related**: [ADR-071](071-elastic-native-dense-vector-strategy.md), [ADR-072](072-three-way-hybrid-search-architecture.md)

## Context

Modern search applications increasingly require advanced AI/ML capabilities: semantic understanding, entity extraction, knowledge graphs, conversational interfaces, and retrieval-augmented generation (RAG). The traditional approach involves integrating multiple external AI services (OpenAI, Cohere, HuggingFace, etc.), each with their own APIs, pricing models, and data governance implications.

Elasticsearch Serverless has evolved significantly, offering native AI/ML capabilities through:

- Inference API with preconfigured models (E5, ELSER, LLM)
- Model deployment within the cluster (NER, custom models)
- Graph API for relationship discovery
- `semantic_text` fields for automatic chunking and embeddings
- Native reranking capabilities

This raises a fundamental question: **How far can we go using ONLY Elasticsearch Serverless features?**

## Problem Statement

Should we default to external AI services (OpenAI, Cohere, etc.) or explore the limits of Elastic-native capabilities first?

## Decision

**We adopt an "Elastic-Native-First" philosophy for all AI/ML features in this project.**

When evaluating any AI/ML capability, we follow this **decision hierarchy**:

### 1. Elastic-Native (Strongly Preferred)

Preconfigured endpoints that require zero setup:

- `.multilingual-e5-small-elasticsearch` (dense embeddings)
- `.elser-2-elasticsearch` (sparse embeddings)
- `.rerank-v1-elasticsearch` (result reranking)
- `.gp-llm-v2-chat_completion` (LLM chat)

**Why preferred**:

- Included in Serverless subscription (no per-token costs)
- Zero external dependencies
- Data never leaves our cluster
- Lowest latency (no external API calls)

### 2. Deployed on Elastic (Acceptable)

Open source models deployed within the Elasticsearch cluster:

- NER models (e.g., `elastic__distilbert-base-cased-finetuned-conll03-english`)
- Custom fine-tuned models
- Domain-specific embeddings

**Why acceptable**:

- Still within our cluster (data sovereignty)
- No per-request API costs
- Manageable deployment complexity
- No external network dependencies

### 3. External APIs (Avoid Unless Necessary)

Services that require external API calls:

- OpenAI (GPT, embeddings)
- Cohere (rerank, embeddings)
- HuggingFace Inference API
- Anthropic, etc.

**Why avoid**:

- Additional costs (per-token pricing)
- External dependencies and SLAs
- Data leaves our infrastructure
- Additional latency (external roundtrips)
- More complex architecture

**Exception criteria**: Only use external APIs when:

1. Elastic-native quality is demonstrably insufficient for our use case
2. The feature is not available within Elasticsearch ecosystem
3. The cost/benefit analysis strongly favors external service

## Hypothesis

**We suspect Elasticsearch Serverless can handle much more than typically assumed:**

| Capability                                      | Hypothesis  | Status      |
| ----------------------------------------------- | ----------- | ----------- |
| **Curriculum vocabulary** (keyword definitions) | ✅ Proven   | Available   |
| **Hybrid search** (BM25 + ELSER)                | ✅ Proven   | Complete    |
| **Three-way hybrid** (+ dense vectors)          | ✅ Likely   | In Progress |
| **Advanced relevance** (reranking)              | ✅ Likely   | Planned     |
| **Knowledge graphs** (ES Graph API)             | 🤔 Possible | Planned     |
| **RAG** (Elastic Native LLM + chunks)           | 🤔 Possible | Planned     |
| **Graph RAG** (knowledge + RAG)                 | 🤔 Possible | Planned     |
| **Chat-based search** (conversational)          | 🤔 Possible | Planned     |
| **Entity extraction** (deployed NER)            | 🤔 Possible | Planned     |

**This project exists to test these hypotheses systematically.**

## Architecture

### Current Implementation (Phase 1A)

```typescript
// Three-way hybrid using ONLY Elastic-native services
const results = await buildThreeWayLessonRrfRequest(esClient, {
  text: 'pythagoras theorem',
  size: 20,
  subject: 'maths',
  keyStage: 'ks4',
});

// All three search strategies use Elastic-native features:
// 1. BM25 (built-in)
// 2. ELSER (.elser-2-elasticsearch)
// 3. E5 dense vectors (.multilingual-e5-small-elasticsearch)
```

### Planned Implementation (Phase 1B-3)

```typescript
// Phase 1B: Elastic Native ReRank
const reranked = await applyElasticRerank(results, {
  query: 'pythagoras theorem',
  endpoint: '.rerank-v1-elasticsearch',
});

// Phase 2A: Entity extraction (deployed on Elastic)
const entities = await extractEntities(transcript, {
  model: 'elastic__distilbert-base-cased-finetuned-conll03-english',
});

// Phase 3: RAG with Elastic Native LLM
const answer = await generateRAGResponse(query, {
  llm: '.gp-llm-v2-chat_completion',
  retrievalStrategy: 'three-way-hybrid',
  contextWindow: 5,
});
```

## Consequences

### Positive

1. **Simplified architecture**: One platform handles search, embeddings, reranking, LLM, graphs
2. **Cost efficiency**: Resource-based billing only, no per-token charges (potentially $1,260/month savings)
3. **Data sovereignty**: All processing within our ES cluster, no external data sharing
4. **Lower latency**: No external API roundtrips (typical savings: 100-200ms per request)
5. **Fewer dependencies**: Single point of integration, monitoring, and maintenance
6. **Graceful degradation**: If inference fails, fall back to lexical search
7. **Vendor leverage**: Forces us to deeply understand Elasticsearch capabilities
8. **Innovation forcing function**: Pushes us to be creative with native features
9. **Future-proof**: As Elasticsearch adds features, we can adopt without architectural changes

### Negative

1. **Potentially lower quality**: Native models may underperform specialized services
2. **Limited flexibility**: Can't easily switch models or fine-tune
3. **Learning curve**: Requires deep Elasticsearch expertise
4. **Feature gaps**: Some capabilities may not exist natively
5. **Risk of constraint**: May limit innovation if native features are insufficient

### Mitigations

1. **Quality baseline**: Establish performance benchmarks (MRR, NDCG) before eliminating external options
2. **Escape hatches**: Design architecture to allow external API integration if needed
3. **Continuous evaluation**: Regularly reassess if native features meet quality bar
4. **Hybrid approach**: Allow external services where demonstrably superior
5. **Documentation**: Thoroughly document Elastic-native patterns for team knowledge
6. **Community engagement**: Share learnings to help others evaluate Elastic-native approaches

## Validation Criteria

This philosophy is successful when:

1. **Feature coverage**: >80% of planned AI/ML features implemented using Elastic-native or deployed-on-Elastic approaches
2. **Quality targets met**: MRR ≥0.80, NDCG@10 ≥0.85, zero-hit rate <5% using only Elastic features
3. **Cost efficiency**: $0 external API costs (vs ~$1,260/month baseline with external services)
4. **Latency targets met**: p95 search latency <300ms including all AI/ML enhancements
5. **Stakeholder satisfaction**: Demo impresses stakeholders without revealing implementation details
6. **Team confidence**: Engineers confident in Elastic-native approach for future features

## Review Points

We will explicitly review this decision at:

1. **Phase 1B complete**: After implementing Elastic Native ReRank - does quality meet bar?
2. **Phase 2A complete**: After entity extraction - do deployed models work well enough?
3. **Phase 3 complete**: After RAG implementation - is Elastic Native LLM sufficient?
4. **Final demo**: Do stakeholders see gaps that require external services?

At each review, we ask:

- Have we hit quality or performance issues that require external services?
- Are we constraining innovation by avoiding external tools?
- Do cost savings justify any quality tradeoffs?

## Success Stories (Planned)

By project end, we aim to demonstrate:

1. **Curriculum vocabulary integration** enriching embeddings with expert-curated definitions
2. **Three-way hybrid search** matching or exceeding external embedding quality
3. **Elastic Native ReRank** delivering top-K relevance improvements
4. **Knowledge graph discovery** via ES Graph API revealing curriculum relationships
5. **RAG responses** via Elastic Native LLM with acceptable accuracy
6. **Chat-based search** providing conversational interface
7. **$0 external API costs** while maintaining quality targets

## Exception Process

To override this philosophy and use an external API, the team must:

1. **Document the gap**: What Elastic-native feature is insufficient and why?
2. **Quantify the delta**: Measurable quality/latency improvement from external service
3. **Estimate the cost**: Financial and architectural costs of the external dependency
4. **Consider alternatives**: Have we exhausted Elastic-native options?
5. **Get explicit approval**: Document the exception in an ADR

## References

- [Elasticsearch Inference API](https://www.elastic.co/guide/en/elasticsearch/reference/current/inference-apis.html)
- [Elasticsearch NLP Capabilities](https://www.elastic.co/docs/explore-analyze/machine-learning/nlp/ml-nlp-overview)
- [Elasticsearch Graph API](https://www.elastic.co/guide/en/elasticsearch/reference/current/graph-explore-api.html)
- [ADR-071: Elastic-Native Dense Vector Strategy](071-elastic-native-dense-vector-strategy.md)
- [ADR-072: Three-Way Hybrid Search Architecture](072-three-way-hybrid-search-architecture.md)

## Related Documents

- `apps/oak-open-curriculum-semantic-search/README.md` - Project overview with philosophy
- `.agent/plans/semantic-search/maths-ks4-implementation-plan.md` - Implementation plan
- `.agent/plans/semantic-search/ELASTIC-NATIVE-MIGRATION-COMPLETE.md` - Migration summary

---

**Key Insight**: This is not religious dogma - it's a hypothesis-driven exploration. We're testing how far Elasticsearch Serverless can take us. If we discover gaps, we'll document them thoroughly and make informed decisions about external services. But we start by assuming Elasticsearch is capable until proven otherwise.
