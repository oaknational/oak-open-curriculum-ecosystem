# Advanced Features

**Status**: 📋 FUTURE — Post-SDK stabilization
**Priority**: LOW — Documented ideas for future consideration
**Parent**: [README.md](README.md) | [../roadmap.md](../roadmap.md)
**Created**: 2026-01-03 (Consolidated from advanced-features.md, knowledge-graph-evolution.md, mcp-graph-tools.md)

---

## Overview

This document covers advanced features planned for after SDK extraction and core search stabilization.

**Prerequisites**:

- SDK extraction complete
- Core search quality optimized (Tiers 1-3)
- MCP search tool operational

---

## Phase 1: RAG Infrastructure

### ES Playground

Low-code RAG prototyping using Elastic's built-in tools.

### `semantic_text` Field

Auto-chunking transcripts for better retrieval:

```typescript
const semantic_text_field = {
  type: 'semantic_text',
  inference_id: '.elser-2-elasticsearch',
  // Auto-chunks long text into searchable segments
};
```

### LLM Chat Completion

Elastic Native LLM integration for curriculum-aware responses:

```typescript
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

### Success Criteria

- [ ] Chunked transcripts indexed with semantic_text
- [ ] RAG endpoint implemented
- [ ] Ontology index created
- [ ] LLM integration working

---

## Phase 2: Knowledge Graph Evolution

### Current State: Property Graph

```typescript
// knowledge-graph-data.ts — Schema only
{ id: 'keyword', label: 'Keyword', brief: 'Critical vocabulary' }
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' }
```

Defines **types and relationships**, but contains **no instances**.

### Target State: True Knowledge Graph

```
SCHEMA: "Lesson hasKeywords Keyword"
INSTANCE: lesson:ks3-bio-1 → hasKeywords → keyword:photosynthesis
```

Schema + instances = true knowledge graph = graph-based queries.

### Capabilities Enabled

| Capability                               | Without True KG | With True KG     |
| ---------------------------------------- | --------------- | ---------------- |
| "What keywords does this lesson teach?"  | Manual lookup   | Graph query      |
| "Which lessons address this misconception?" | Text search   | Edge traversal   |
| "What concepts lead to this one?"        | Prerequisite only | Multi-hop reasoning |
| "Related concepts to X"                  | N/A             | Graph neighbour query |

### Implementation Phases

1. **Rename and Document** — `knowledge-graph-data.ts` → `curriculum-property-graph.ts`
2. **Schema Validation** — Validate extracted entities match schema-defined types
3. **Generate Instance Edges** — Create instance relationships
4. **Unified Export** — Combined schema + instances export
5. **Graph Query Interface** — API for graph queries
6. **MCP Tool Integration** — New MCP tool: `get-curriculum-graph`

### Success Criteria

- [ ] Property graph clearly distinguished from knowledge graph
- [ ] Extracted entities validated against schema types
- [ ] Instance edges generated from implicit relationships
- [ ] At least 2 graph query functions implemented

---

## Phase 3: Advanced ES Features

### Learning to Rank (LTR) Foundations

Prepare for future ML-based ranking:

- Click-through data collection
- Feature extraction for model training
- A/B testing infrastructure

### Multi-Vector Fields

Separate vectors for different aspects:

```typescript
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

### Runtime Fields

Computed fields at query time:

```typescript
{
  runtime_mappings: {
    keyStageShortCode: {
      type: 'keyword',
      script: "emit(doc['key_stage_slug'].value.toUpperCase())",
    },
  },
}
```

### Success Criteria

- [ ] Click tracking implemented
- [ ] Multi-vector fields tested
- [ ] Runtime field patterns documented

---

## Phase 4: MCP Graph Tools

### Existing Tools (Complete)

| Tool                      | Status      |
| ------------------------- | ----------- |
| `get-thread-progressions` | ✅ Complete |
| `get-prerequisite-graph`  | ✅ Complete |

### Planned Tools

| Tool                     | User Need                              | Size Consideration |
| ------------------------ | -------------------------------------- | ------------------ |
| `get-misconception-graph` | "What mistakes should I watch for?"   | ~2MB, must filter  |
| `get-vocabulary-graph`   | "What vocabulary is taught?"           | ~3MB, must filter  |
| `get-nc-coverage-graph`  | "Does this cover the NC?"              | ~300KB, return full |

### Size Strategy

For large graphs:

1. Return summary/stats by default
2. Support filtering by subject/keyStage/year
3. Offer subgraph queries (e.g., "fractions prerequisites only")

---

## Features Requiring Upstream API Changes

These features **cannot be implemented** without changes to the Open API:

### HIGH PRIORITY — Blocking Key Features

| Feature                     | Missing Data     | Impact                         |
| --------------------------- | ---------------- | ------------------------------ |
| **Multi-pathway results**   | `pathways[]` array | Cannot show tier/examboard variants |
| **Exact OWA URL generation**| `programmeSlug`  | Must generate URLs differently |
| **Programme-based filtering**| Full programme context | Cannot filter by tier/examboard |

### MEDIUM PRIORITY — Would Improve Experience

| Feature                    | Missing Data     | Impact                         |
| -------------------------- | ---------------- | ------------------------------ |
| **Year group display**     | `yearTitle`      | Must derive "Year 3" from year number |
| **Tier display**           | `tierTitle`      | Cannot show "Foundation"/"Higher" |

---

## Research References

| Research Document                                                                            | Topic                    |
| -------------------------------------------------------------------------------------------- | ------------------------ |
| [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md) | KG integration          |
| [enhanced-search-elasticsearch-neo4j-with-links.md](../../../research/elasticsearch/graphs/enhanced-search-elasticsearch-neo4j-with-links.md) | ES + Neo4j             |
| [elastic-cloud-graph-search.md](../../../research/elasticsearch/graphs/elastic-cloud-graph-search.md) | ES graph capabilities |

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

| Feature                  | Value                                 | Status               |
| ------------------------ | ------------------------------------- | -------------------- |
| **ELSER sparse vectors** | Semantic understanding                | ✅ Validated         |
| **RRF hybrid search**    | Superior result fusion                | ✅ Optimal config    |
| **Full transcripts**     | 45+ min searchable content per lesson | ✅ Indexed           |
| **Query-time synonyms**  | Domain-specific expansion             | ✅ Operational       |
| **Completion suggestions**| Search-as-you-type                   | ✅ Implemented       |
| **Curriculum ontology**  | Structured domain knowledge           | ✅ In SDK            |

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Linear milestone sequence |
| [README.md](README.md)                                                                        | Post-SDK overview    |
| [four-retriever-implementation.md](../archive/completed/four-retriever-implementation.md)     | Hybrid search foundation |

