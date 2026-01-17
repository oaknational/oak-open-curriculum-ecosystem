# Advanced Features

**Stream**: extensions  
**Status**: ⏸️ Future  
**Parent**: [README.md](README.md) | [../../roadmap.md](../../roadmap.md)  
**Created**: 2026-01-03  
**Last Updated**: 2026-01-17

---

## Overview

This document covers advanced features planned for after Level 4 (AI Enhancement) is complete.

**Prerequisites**:

- Level 4 complete (LLM pre-processing operational)
- Core search quality optimised (Levels 1-4)
- MCP search tool operational

---

## Feature 1: RAG Infrastructure

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

### Checklist

- [ ] Chunked transcripts indexed with semantic_text
- [ ] RAG endpoint implemented
- [ ] Ontology index created
- [ ] LLM integration working

---

## Feature 2: Knowledge Graph Evolution

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

---

## Feature 3: MCP Graph Tools

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

## Feature 4: Features Requiring Upstream API Changes

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

## Timeline Context

```
Now:       Ground Truth Review (Prerequisite)
           ↓
Next:      SDK Extraction (Prerequisite)
           ↓
Then:      Levels 2-3
           ↓
Then:      Level 4 (AI Enhancement)
           ↓
Finally:   ADVANCED FEATURES (this plan)
```

---

## Related Documents

| Document                                                                                      | Purpose              |
| --------------------------------------------------------------------------------------------- | -------------------- |
| [../roadmap.md](../roadmap.md)                                                                | Linear milestone sequence |
| [README.md](README.md)                                                                        | Post-SDK overview    |
| [ai-enhancement.md](../search-quality/ai-enhancement.md)                                      | Prerequisite level   |
| [mcp-search-tool.md](mcp-search-tool.md)                                                      | Related MCP work     |
