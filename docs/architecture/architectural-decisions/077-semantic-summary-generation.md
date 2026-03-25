# ADR-077: Local Semantic Summary Generation at Ingest Time

**Status**: Accepted  
**Date**: 2025-12-12  
**Decision Makers**: Development Team  
**Related**: [ADR-076](076-elser-only-embedding-strategy.md), [ADR-066](066-sdk-response-caching.md)

## Context

Semantic search quality depends on having information-dense text for embedding creation. Currently:

| Resource | ELSER Field       | Content                        | Issue                                |
| -------- | ----------------- | ------------------------------ | ------------------------------------ |
| Lessons  | `lesson_semantic` | Full transcript (~5000 tokens) | Too long, dilutes pedagogical signal |
| Units    | `unit_semantic`   | `rollupText` (~200-400 tokens) | Aggregated from lessons, not curated |

The upstream Oak API does not provide `semantic_summary` fields optimised for embeddings. Until it does, we need to generate these locally at ingest time.

## Problem Statement

How do we create high-quality semantic summaries for ELSER embeddings without:

1. Waiting for upstream API changes
2. Adding excessive complexity to ingestion
3. Degrading search quality

## Decision

**Generate semantic summaries locally at ingest time using deterministic template-based composition.**

Update 2026-03-21: the enduring part of this ADR is local deterministic summary
generation. The current bulk-first implementation routes that through
`semantic-summary-generator.ts` and document transforms; it does not depend on
a standalone Redis semantic-summary cache. Threads now have their own semantic
retrieval path (see ADR-110). Sequences remain lexical-only today but the
replacement contract is now permanent in ADR-139 and summarised in
`apps/oak-search-cli/docs/INDEXING.md`.

### Original Phase 3 Scope: Lessons and Units Only

For the original Phase 3 implementation, we focused on lessons and units only.
Update 2026-03-21: threads are no longer deferred (ADR-110). Sequences are
still deferred from semantic retrieval until the locked `sequence_semantic`
follow-up lands.

### Generation Strategy

#### Template-Based Composition (Phase 3)

Compose summaries using available API fields with templates:

**Lesson Summary Template (~150-250 tokens)**:

```text
{lessonTitle} is a {keyStage} {subject} lesson for {yearGroup}.

Key learning: {keyLearningPoints[0..2]}.

Keywords: {keywords with definitions}.

Prior knowledge required: {priorKnowledge}.

Common misconception: {misconceptions[0]}.

Pupil outcome: {pupilLessonOutcome}.
```

**Unit Summary Template (~200-300 tokens)**:

```text
{unitTitle} is a {keyStage} {subject} unit containing {lessonCount} lessons.

Unit overview: {whyThisWhyNow}.

Key concepts: {derived from lesson titles and keywords}.

Prior knowledge: {priorKnowledgeRequirements}.

National curriculum: {nationalCurriculumContent[0..2]}.

Lessons: {lessonTitles as comma-separated list}.
```

#### LLM-Enhanced Generation (Future)

For richer summaries, an LLM step can synthesise fields into coherent prose:

```typescript
// Future enhancement
const llmSummary = await generateLLMSummary({
  endpoint: '.gp-llm-v2-chat_completion',
  prompt: `Summarise this lesson for semantic search: ${JSON.stringify(lessonData)}`,
  maxTokens: 250,
});
```

This adds compute cost but produces more natural, information-dense summaries.

### Caching Strategy (historical design note)

The Redis-backed approach below reflects the original design exploration. The
current bulk-first implementation does not rely on a standalone semantic-summary
cache, so treat this section as historical context unless caching is
reintroduced deliberately.

Semantic summary generation was originally planned to be cached in Redis (same
instance used for curriculum API caching per ADR-066):

```typescript
// Cache key pattern
const cacheKey = `semantic_summary:lesson:${lessonSlug}:v1`;
const cacheKey = `semantic_summary:unit:${unitSlug}:v1`;

// Cache TTL: Same as curriculum data (24 hours or until next ingest)
```

**Benefits**:

- Avoid regenerating summaries for unchanged lessons
- Share summaries across re-indexing runs
- Enable incremental ingestion
- Version cache keys to invalidate on template changes

### Dual ELSER Fields (historical design exploration)

> The `lesson_summary_semantic` field described below was part of the original
> three-way retrieval design. The current implementation uses four-way retrieval
> for lessons (BM25 + ELSER on content and structure fields) without a separate
> summary semantic field. Treat the tables below as historical context.

For lessons, we maintain both:

| Field                     | Content                         | Purpose                         |
| ------------------------- | ------------------------------- | ------------------------------- |
| `lesson_semantic`         | Full transcript                 | Detailed content matching       |
| `lesson_summary_semantic` | Generated summary (~200 tokens) | Conceptual/pedagogical matching |

For units, we compare:

| Field           | Content                         | Purpose                 |
| --------------- | ------------------------------- | ----------------------- |
| `unit_semantic` | Generated summary (~250 tokens) | Primary semantic search |
| `rollup_text`   | Legacy aggregated text          | Comparison baseline     |

The `rollup_text` field is retained for side-by-side performance comparison.

## Architecture

### Ingestion Flow (historical sketch)

```text
1. Fetch lesson/unit from API
2. Compose summary from template
3. Optionally cache the summary
4. Index document with:
   - Original ELSER field (transcript/rollup)
   - New semantic summary field
```

### Index Mapping Changes

```typescript
// New fields for lessons
lesson_summary_semantic: {
  type: 'semantic_text',
  inference_id: '.elser-2-elasticsearch',
}

// New fields for units (rename existing)
unit_semantic: {
  type: 'semantic_text',
  inference_id: '.elser-2-elasticsearch',
}
// Keep rollup_text for BM25 and comparison
```

### Search Query Enhancement (historical design exploration)

> The three-retriever layout below reflects the original ADR-077 proposal.
> The current implementation uses **four-way** retrieval for lessons and units
> (BM25 Content + ELSER Content + BM25 Structure + ELSER Structure). See
> `ARCHITECTURE.md` for the current RRF table. The examples are retained as
> historical context.

With semantic summaries, lesson search uses **three retrievers within the same `oak_lessons` index**:

| Retriever          | Type            | Field                                   | Purpose                         |
| ------------------ | --------------- | --------------------------------------- | ------------------------------- |
| BM25               | Lexical         | `lesson_title`, `lesson_keywords`, etc. | Keyword matching                |
| ELSER (transcript) | Sparse semantic | `lesson_semantic`                       | Detailed content matching       |
| ELSER (summary)    | Sparse semantic | `lesson_summary_semantic`               | Conceptual/pedagogical matching |

```json
{
  "retriever": {
    "rrf": {
      "retrievers": [
        { "standard": { "query": { "multi_match": { "query": "...", "fields": [...] } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_semantic", "query": "..." } } } },
        { "standard": { "query": { "semantic": { "field": "lesson_summary_semantic", "query": "..." } } } }
      ]
    }
  }
}
```

**Key clarifications**:

1. **RRF combines retrievers, not indices**: All three retrievers query the same `oak_lessons` index
2. **"Three-way" = BM25 + transcript ELSER + summary ELSER**: This is NOT the same as the superseded three-way hybrid (BM25 + ELSER + E5 dense vectors) from ADR-072
3. **Dense vectors are removed**: See ADR-075 - E5 dense vectors provided no benefit

## Consequences

### Positive

1. **Higher quality embeddings**: Information-dense summaries improve semantic matching
2. **No API dependency**: Generate locally until upstream provides `semantic_summary`
3. **Fast iteration**: Template changes don't require API team coordination
4. **Cacheable if needed**: Deterministic summaries can be cached if a future
   implementation reintroduces that optimisation
5. **Upgradeable**: Can swap template for LLM generation later
6. **Measurable**: Can A/B test summary-based vs transcript-based search

### Negative

1. **Maintenance burden**: Template logic must be maintained
2. **Cache management if reintroduced**: A cache layer would add storage and
   invalidation complexity
3. **Not authoritative**: Generated summaries may differ from future API summaries
4. **Ingestion complexity**: Additional processing step

### Mitigations

- Templates are simple string interpolation (low maintenance)
- Redis already used for API caching (no new infrastructure)
- Version cache keys to handle template changes
- Document as interim solution; upstream `semantic_summary` is the goal

## Validation Criteria

This decision is successful when:

1. **Quality improvement**: MRR/NDCG improves vs transcript-only ELSER
2. **Cache hit rate**: >90% for stable curriculum data
3. **Ingestion time**: <10% overhead from summary generation
4. **Template coverage**: >95% of lessons/units successfully summarised

## Implementation Files

```text
apps/oak-search-cli/src/lib/indexing/
├── semantic-summary-generator.ts      # Template-based summary generation
├── semantic-summary-generator.unit.test.ts
├── document-transforms.ts             # Summary fields wired into indexed docs
└── document-transform-helpers.ts      # Summary composition helpers
```

## Related Documents

- [ADR-066](066-sdk-response-caching.md) - Redis caching strategy
- [ADR-076](076-elser-only-embedding-strategy.md) - ELSER-only embedding strategy
- [ADR-110](110-thread-search-architecture.md) - Thread semantic retrieval
- [ADR-139](139-sequence-semantic-contract-and-ownership.md) - Sequence semantic contract and ownership
- [`apps/oak-search-cli/docs/INDEXING.md`](../../../apps/oak-search-cli/docs/INDEXING.md) - Current indexing contract summary
- [Upstream API Wishlist](../../../.agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md) - Request for native `semantic_summary`

## References

- ELSER semantic_text: <https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-text.html>
- Elastic Native LLM (future): `.gp-llm-v2-chat_completion`
- Redis caching patterns: <https://redis.io/docs/manual/patterns/>

## Upstream API Request

This is an **interim solution**. The long-term goal is for the upstream Oak API to provide `semantic_summary` fields:

- Pre-computed at API level
- Authoritative and consistent
- Optimised for embedding creation
- Available for all resource types

See:
`../../../.agent/plans/external/ooc-api-wishlist/archive/upstream-api-metadata-wishlist.md`
for the full request.
