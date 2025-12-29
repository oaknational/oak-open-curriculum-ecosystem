# Future Roadmap: Advanced Features

**Status**: 📋 FUTURE  
**Parent**: [README.md](../../README.md) | [roadmap.md](../../roadmap.md) (Post-SDK work)  
**Estimated Effort**: 15-20 days total  
**Prerequisites**: Milestones 1-11 complete (full SDK extraction)  
**Last Updated**: 2025-12-29

---

## Foundation Documents (MUST READ)

Before starting any work on these phases:

1. `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
3. `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

**All quality gates must pass. No exceptions.**

---

## Overview

This document covers advanced features planned for later phases:

| Phase | Name                   | Focus                             | Estimated Effort |
| ----- | ---------------------- | --------------------------------- | ---------------- |
| 11    | RAG Infrastructure     | Retrieval-Augmented Generation    | 4-5 days         |
| 12    | Knowledge Graph        | Curriculum relationship graph     | 5-6 days         |
| 13    | Advanced Features      | LTR, multi-vector, runtime fields | 3-4 days         |
| 14    | Broader Resource Types | Worksheets, quizzes, sequences    | 3-4 days         |

---

## Phase 11: RAG Infrastructure (4-5 days)

### Features

#### 1. ES Playground

Low-code RAG prototyping using Elastic's built-in tools.

#### 2. `semantic_text` Field

Auto-chunking transcripts for better retrieval:

```typescript
// Field definition
const semantic_text_field = {
  type: 'semantic_text',
  inference_id: '.elser-2-elasticsearch',
  // Auto-chunks long text into searchable segments
};
```

#### 3. LLM Chat Completion

Elastic Native LLM integration for curriculum-aware responses:

```typescript
// Using Elastic's native LLM endpoint
const response = await esClient.inference.inference({
  inference_id: '.gp-llm-v2-chat_completion',
  input: {
    messages: [
      { role: 'system', content: 'You are a curriculum expert...' },
      { role: 'user', content: 'What are prerequisites for quadratics?' },
    ],
  },
});
```

**Reference**: OWA's `callModel.ts` uses LLM for filter suggestions.

#### 4. Ontology Grounding

Domain knowledge enhancement using curriculum ontology.

### Success Criteria (Phase 11)

- [ ] Chunked transcripts indexed with semantic_text
- [ ] RAG endpoint implemented
- [ ] Ontology index created
- [ ] LLM integration working

---

## Phase 12: Knowledge Graph (5-6 days)

**References**:

each requiring further research and investigation.

- [knowledge-graph-integration-opportunities.md](../../../../research/semantic-search/knowledge-graph-integration-opportunities.md) - Knowledge graph integration opportunities
- [enhanced-search-elasticsearch-neo4j-with-links.md](../../../../research/elasticsearch/graphs/enhanced-search-elasticsearch-neo4j-with-links.md) - Enhanced search with Elasticsearch Serverless and Neo4j Knowledge Graph
- [elastic-cloud-graph-search.md](../../../../research/elasticsearch/graphs/elastic-cloud-graph-search.md) - Elastic Cloud Graph and Relationship Search Capabilities using Elasticsearch Serverless features (Graph + “Graph-adjacent” features)

### Features

#### 1. Triple Store (`oak_curriculum_graph`)

Subject-predicate-object triples for curriculum relationships:

```typescript
interface Triple {
  subject: string; // 'quadratic-equations'
  predicate: string; // 'REQUIRES'
  object: string; // 'linear-equations'
  confidence: number; // 0.95
  source: string; // 'lesson-analysis' | 'manual' | 'inferred'
}
```

#### 2. Entity Resolution

Deduplicate entities across lessons:

```typescript
// Same concept, different mentions
('quadratic equations' === 'quadratics') === 'second-degree polynomials';
// → canonical_id: 'concept:quadratic-equations'
```

#### 3. Multi-Hop Reasoning

Find learning pathways via graph traversal:

```typescript
// Query: What chain leads to "calculus"?
// Result: arithmetic → algebra → functions → limits → calculus
const path = await traverseGraph({
  target: 'calculus',
  relationship: 'PREREQUISITE_OF',
  maxHops: 5,
});
```

**Note**: Could partially address pathway navigation without API changes.

### Success Criteria (Phase 12)

- [ ] Triple store populated
- [ ] Entity resolution >90% precision
- [ ] Multi-hop queries working

---

## Phase 13: Advanced Features (3-4 days)

### Features

#### 1. Learning to Rank (LTR) Foundations

Prepare for future ML-based ranking:

- Click-through data collection
- Feature extraction for model training
- A/B testing infrastructure

#### 2. Multi-Vector Fields

Separate vectors for different aspects:

```typescript
// Multiple vectors per document
{
  title_vector: [...],         // Title semantics
  summary_vector: [...],       // Summary semantics
  key_points_vector: [...],    // Key learning points
}

// Aspect-based retrieval
const results = await search({
  query: "teaching tips",
  vector_field: 'key_points_vector', // Focus on pedagogy
});
```

#### 3. Runtime Fields

Computed fields at query time:

```typescript
// Derive keyStageShortCode without storing
{
  runtime_mappings: {
    keyStageShortCode: {
      type: 'keyword',
      script: "emit(doc['key_stage_slug'].value.toUpperCase())",
    },
  },
}
```

### Success Criteria (Phase 13)

- [ ] Click tracking implemented
- [ ] Multi-vector fields tested
- [ ] Runtime field patterns documented

---

## Phase 14: Broader Resource Types (3-4 days)

### Resource Types to Index

| Resource Type   | Source                     | Search Use Cases                              |
| --------------- | -------------------------- | --------------------------------------------- |
| **Units**       | Already indexed            | "Find units on fractions"                     |
| **Sequences**   | `/sequences`               | "Browse Year 7 Science curriculum"            |
| **Worksheets**  | `/lessons/{lesson}/assets` | "Find downloadable worksheets"                |
| **Quizzes**     | `/lessons/{lesson}/quiz`   | "Find assessment questions on photosynthesis" |
| **Transcripts** | Already indexed            | Deep content search                           |

### Features

#### 1. Unified Search Endpoint

Search across all resource types with type faceting:

```typescript
GET /api/search?q=pythagoras&types=lesson,unit,worksheet
```

#### 2. Asset Discovery

Index downloadable resources:

```typescript
interface AssetDocument {
  lesson_slug: string;
  asset_type: 'worksheet' | 'slides' | 'video';
  format: 'pdf' | 'pptx' | 'mp4';
  title: string;
  download_url: string;
}
```

#### 3. Quiz Content Search

Index quiz questions and answers:

```typescript
interface QuizDocument {
  lesson_slug: string;
  question_text: string;
  answers: string[];
  correct_answer: string;
  topic_tags: string[];
}
```

### Success Criteria (Phase 14)

- [ ] Sequence search working
- [ ] Asset discovery indexed
- [ ] Quiz content searchable
- [ ] Unified search endpoint implemented

---

## Features Requiring Upstream API Changes

These features **cannot be implemented** without changes to the Open API.

### HIGH PRIORITY - Blocking Key Features

| Feature                          | Missing Data           | Impact                                    |
| -------------------------------- | ---------------------- | ----------------------------------------- |
| **"NEW" content badges**         | `cohort` field         | Cannot show promotional badges            |
| **Legacy curriculum filtering**  | `isLegacy` field       | Cannot filter 2020-2023 content           |
| **Multi-pathway search results** | `pathways[]` array     | Cannot show tier/examboard variants       |
| **Exact OWA URL generation**     | `programmeSlug`        | Must generate URLs differently            |
| **Programme-based filtering**    | Full programme context | Cannot filter by tier/examboard in search |

### MEDIUM PRIORITY - Would Improve Experience

| Feature                         | Missing Data         | Impact                                |
| ------------------------------- | -------------------- | ------------------------------------- |
| **Year group display**          | `yearTitle`          | Must derive "Year 3" from year number |
| **Tier display**                | `tierTitle`          | Cannot show "Foundation"/"Higher"     |
| **Thread progression metadata** | Enhanced thread data | Limited progression tracking          |
| **Resource timestamps**         | `lastUpdated`        | Cannot efficiently cache/invalidate   |

See [Upstream API Wishlist](../../../external/ooc-api-wishlist/index.md) for full details.

---

## Timeline Estimate (Future Phases)

| Phase | Focus                  | Duration | Dependencies |
| ----- | ---------------------- | -------- | ------------ |
| 11    | RAG Infrastructure     | 4-5 days | Phase 10     |
| 12    | Knowledge Graph        | 5-6 days | Phase 11     |
| 13    | Advanced Features      | 3-4 days | Phase 12     |
| 14    | Broader Resource Types | 3-4 days | Phase 13     |

**Total Future Work**: ~15-20 days

---

## Guiding Principles

1. **Validate before adding complexity**
2. **Measure impact of each phase**
3. **Document decisions in ADRs**
4. **All quality gates must pass**
5. **First Question**: Could it be simpler?
6. **Teachers want curriculum resources, not just lessons**
7. **SDK handles mechanics, apps handle policy**

---

## What We Have That Production Doesn't

| Feature                    | Value                                 | Status                   |
| -------------------------- | ------------------------------------- | ------------------------ |
| **ELSER sparse vectors**   | Semantic understanding                | ✅ Validated (Phase 1-2) |
| **RRF hybrid search**      | Superior result fusion                | ✅ Optimal config found  |
| **Full transcripts**       | 45+ min searchable content per lesson | ✅ Indexed               |
| **Query-time synonyms**    | Domain-specific expansion             | ✅ Operational           |
| **Completion suggestions** | Search-as-you-type                    | ✅ Implemented           |
| **Curriculum ontology**    | Structured domain knowledge           | ✅ In SDK                |

---

## Related Documents

- [roadmap.md](../../roadmap.md) — Linear milestone sequence
- [README.md](../../README.md) — Navigation hub
- [four-retriever-implementation.md](../../archive/completed/four-retriever-implementation.md) — Hybrid search foundation
- [Upstream API Wishlist](../../../external/ooc-api-wishlist/index.md) — Blocked features (upstream)
