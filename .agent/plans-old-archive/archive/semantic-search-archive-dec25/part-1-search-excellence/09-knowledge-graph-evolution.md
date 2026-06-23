# Sub-Plan 09: Knowledge Graph Evolution

**Status**: 📋 PLANNED  
**Priority**: Medium  
**Parent**: [README.md](README.md)  
**Created**: 2025-12-27  
**Research**: [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md)

---

## 🎯 Goal

Evolve the current "knowledge graph" from a **property graph** (schema-only) to a **true knowledge graph** (schema + instances), enabling graph-based search and discovery.

> **Scope**: ALL subjects, ALL key stages, ALL extracted instance data. Examples may reference specific subjects (e.g., "Year 5 maths") for illustration, but the knowledge graph encompasses the complete curriculum (~47K lessons, 13K keywords, 12K misconceptions across 30 bulk files).

---

## The Problem

### What We Currently Call a "Knowledge Graph"

```typescript
// knowledge-graph-data.ts — Schema/Property Graph
{ id: 'keyword', label: 'Keyword', brief: 'Critical vocabulary' }
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' }
```

This defines **types and relationships**, but contains **no instances**.

### What We Extracted from Bulk Data

```typescript
// vocabulary-graph-data.ts — Instance Data (disconnected)
{ term: "photosynthesis", definition: "...", lessonSlugs: ["ks3-bio-1", "ks4-sci-2"] }
```

These are **instances** (actual keywords), but they're **not connected** to the property graph schema.

### What a True Knowledge Graph Would Be

```
SCHEMA: "Lesson hasKeywords Keyword"
INSTANCE: lesson:ks3-bio-1 → hasKeywords → keyword:photosynthesis
```

Schema + instances = true knowledge graph = graph-based queries possible.

---

## 🚀 Intended Impact

| Capability | Without True KG | With True KG |
|------------|-----------------|--------------|
| "What keywords does this lesson teach?" | Manual lookup | Graph query |
| "Which lessons address this misconception?" | Text search | Edge traversal |
| "What concepts lead to this one?" | Prerequisite graph only | Multi-hop reasoning |
| "Is 'photosynthesis' a curriculum keyword?" | Check list | Type-validated query |
| "Show vocabulary for Year 5 maths" | Filter vocabulary graph | Contextual graph slice |
| "Related concepts to X" | N/A | Graph neighbour query |

### User Value

| Persona | Benefit |
|---------|---------|
| **Teacher** | "What vocabulary do I need to introduce for this lesson?" |
| **Student** | "What should I know before studying this topic?" |
| **Curriculum Planner** | "How are concepts connected across subjects?" |
| **AI Agent** | Structured reasoning over curriculum relationships |

---

## Phases

### Phase 1: Rename and Document (Immediate)

**Effort**: ~1 hour  
**Impact**: Conceptual clarity

1. Rename `knowledge-graph-data.ts` → `curriculum-property-graph.ts`
   - Update all imports
   - Document why it's a property graph, not a knowledge graph

2. Add documentation:
   ```markdown
   ## Property Graph vs Knowledge Graph
   
   - **Property Graph**: Defines entity types and relationship types (schema)
   - **Knowledge Graph**: Property graph + instance data (schema + data)
   
   Our current export is a property graph. Future work will connect instance
   data to create a true knowledge graph.
   ```

3. Keep backward-compatible export alias for `conceptGraph`

### Phase 2: Schema Validation for Extracted Data

**Effort**: ~2 hours  
**Impact**: Data quality

Validate that extracted entities match schema-defined types:

```typescript
// Before writing vocabulary-graph-data.ts:
const VALID_ENTITY_TYPES = conceptGraph.concepts.map(c => c.id);

function validateEntityType(extracted: string): boolean {
  return VALID_ENTITY_TYPES.includes(extracted);
}
```

**Benefits**:
- Catch extraction errors early
- Ensure generated data conforms to schema
- Enable type-safe graph queries later

### Phase 3: Generate Instance Edges

**Effort**: ~4 hours  
**Impact**: Enables graph queries

Currently, instance data has implicit relationships:

```typescript
// vocabulary-graph-data.ts (implicit edge)
{ term: "photosynthesis", lessonSlugs: ["ks3-biology-plants-1"] }
```

Generate explicit edge data:

```typescript
// curriculum-instance-edges.ts (explicit)
export const instanceEdges = [
  { from: "lesson:ks3-biology-plants-1", to: "keyword:photosynthesis", rel: "hasKeywords" },
  { from: "lesson:ks3-biology-plants-1", to: "misconception:plants-make-food", rel: "addresses" },
  // ...
];
```

### Phase 4: Unified Knowledge Graph Export

**Effort**: ~4 hours  
**Impact**: Single source of truth for graph data

```typescript
// curriculum-knowledge-graph.ts
export const curriculumKnowledgeGraph = {
  // Schema layer (from property graph)
  schema: {
    concepts: propertyGraph.concepts,
    relationships: propertyGraph.edges,
  },
  
  // Instance layer (from bulk mining)
  instances: {
    keywords: vocabularyGraph.keywords,
    misconceptions: misconceptionGraph.misconceptions,
    // ...
  },
  
  // Instance edges (generated)
  edges: instanceEdges,
} as const;
```

### Phase 5: Graph Query Interface

**Effort**: ~8 hours  
**Impact**: Enables AI agent graph reasoning

Create query functions:

```typescript
// Query: What keywords does this lesson teach?
function getKeywordsForLesson(lessonSlug: string): Keyword[];

// Query: Which lessons address this misconception?
function getLessonsForMisconception(misconceptionId: string): Lesson[];

// Query: What concepts are related to this one?
function getRelatedConcepts(conceptId: string, hops?: number): Concept[];

// Query: Learning path to target concept
function getLearningPath(from: string, to: string): Concept[];
```

### Phase 6: MCP Tool Integration

**Effort**: ~4 hours  
**Dependency**: MCP tool moratorium lifted  
**Impact**: AI agents can query curriculum graph

New MCP tool: `get-curriculum-graph`

```typescript
{
  name: 'get-curriculum-graph',
  description: 'Query the curriculum knowledge graph for relationships between concepts, lessons, keywords, and misconceptions.',
  inputSchema: {
    type: 'object',
    properties: {
      query: { 
        type: 'string', 
        enum: ['keywords-for-lesson', 'lessons-for-keyword', 'related-concepts', 'learning-path'] 
      },
      entity: { type: 'string', description: 'The entity slug to query about' },
      hops: { type: 'number', description: 'For related-concepts: how many relationship hops' },
    },
  },
}
```

---

## Definition of Done

- [ ] Property graph clearly distinguished from knowledge graph (documentation)
- [ ] Extracted entities validated against schema types
- [ ] Instance edges generated from implicit relationships
- [ ] Unified knowledge graph export available
- [ ] At least 2 graph query functions implemented
- [ ] (Deferred) MCP tool integration

---

## Related Documents

- [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md) — Research
- [knowledge-graph-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts) — Current property graph
- [vocabulary-graph-data.ts](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/vocabulary-graph-data.ts) — Instance data
- [08-mcp-graph-tools.md](08-mcp-graph-tools.md) — MCP tool integration (deferred)

---

## Change Log

| Date | Change |
|------|--------|
| 2025-12-27 | Initial plan created from knowledge graph reflection |

