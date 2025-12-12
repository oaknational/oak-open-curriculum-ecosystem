# ADR-077: Local Semantic Summary Generation at Ingest Time

**Status**: Accepted  
**Date**: 2025-12-12  
**Decision Makers**: Development Team  
**Related**: [ADR-076](076-elser-only-embedding-strategy.md), [ADR-066](066-sdk-response-caching.md)

## Context

Semantic search quality depends on having information-dense text for embedding creation. Currently:

| Resource | ELSER Field       | Content                         | Issue                              |
| -------- | ----------------- | ------------------------------- | ---------------------------------- |
| Lessons  | `lesson_semantic` | Full transcript (~5000 tokens)  | Too long, dilutes pedagogical signal |
| Units    | `unit_semantic`   | `rollupText` (~200-400 tokens)  | Aggregated from lessons, not curated |

The upstream Oak API does not provide `semantic_summary` fields optimised for embeddings. Until it does, we need to generate these locally at ingest time.

## Problem Statement

How do we create high-quality semantic summaries for ELSER embeddings without:

1. Waiting for upstream API changes
2. Adding excessive complexity to ingestion
3. Degrading search quality

## Decision

**Generate semantic summaries locally at ingest time using template-based composition, with Redis caching.**

### Phase 3 Scope: Lessons and Units Only

For Phase 3, we focus on lessons and units only. Other resource types (programmes, threads, sequences) are deferred.

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

### Caching Strategy

Semantic summary generation is cached in Redis (same instance used for curriculum API caching per ADR-066):

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

### Dual ELSER Fields

For lessons, we maintain both:

| Field                     | Content                        | Purpose                       |
| ------------------------- | ------------------------------ | ----------------------------- |
| `lesson_semantic`         | Full transcript                | Detailed content matching     |
| `lesson_summary_semantic` | Generated summary (~200 tokens)| Conceptual/pedagogical matching |

For units, we compare:

| Field                   | Content                            | Purpose                  |
| ----------------------- | ---------------------------------- | ------------------------ |
| `unit_semantic`         | Generated summary (~250 tokens)    | Primary semantic search  |
| `rollup_text`           | Legacy aggregated text             | Comparison baseline      |

The `rollup_text` field is retained for side-by-side performance comparison.

## Architecture

### Ingestion Flow

```text
1. Fetch lesson/unit from API
2. Check Redis cache for existing summary
3. If not cached:
   a. Compose summary from template
   b. Cache in Redis
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

### Search Query Enhancement

With semantic summaries, lesson search uses **three retrievers within the same `oak_lessons` index**:

| Retriever | Type | Field | Purpose |
| --------- | ---- | ----- | ------- |
| BM25 | Lexical | `lesson_title`, `lesson_keywords`, etc. | Keyword matching |
| ELSER (transcript) | Sparse semantic | `lesson_semantic` | Detailed content matching |
| ELSER (summary) | Sparse semantic | `lesson_summary_semantic` | Conceptual/pedagogical matching |

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
4. **Cacheable**: Redis caching avoids repeated generation
5. **Upgradeable**: Can swap template for LLM generation later
6. **Measurable**: Can A/B test summary-based vs transcript-based search

### Negative

1. **Maintenance burden**: Template logic must be maintained
2. **Cache management**: Redis storage for summaries
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
apps/oak-open-curriculum-semantic-search/src/lib/indexing/
├── semantic-summary-generation.ts     # NEW: Template-based summary generation
├── semantic-summary-generation.unit.test.ts
├── document-transforms.ts             # UPDATE: Add summary fields
└── document-transform-helpers.ts      # UPDATE: Summary composition helpers
```

## Related Documents

- [ADR-066](066-sdk-response-caching.md) - Redis caching strategy
- [ADR-076](076-elser-only-embedding-strategy.md) - ELSER-only embedding strategy
- [Upstream API Wishlist](../../.agent/plans/external/upstream-api-metadata-wishlist.md) - Request for native `semantic_summary`

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

See: `.agent/plans/external/upstream-api-metadata-wishlist.md` for the full request.
