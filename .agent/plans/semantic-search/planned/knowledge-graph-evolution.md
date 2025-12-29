# Knowledge Graph Evolution

**Status**: 📋 Planned  
**Parent**: [README.md](../README.md) | [roadmap.md](../roadmap.md) (Milestone 10)  
**Priority**: Medium  
**Dependencies**: Vocabulary mining complete

---

## Goal

Evolve the current "knowledge graph" from a **property graph** (schema-only) to a **true knowledge graph** (schema + instances), enabling graph-based search and discovery.

This is about connecting some summary views of the data e.g., keywords, outcomes, misunderstandings, etc. back to the ontology, to enable efficient graph-type queries based on structural relationships between concepts, rather than on lexical similarity or semantic similarity. This is in contrast to more graph-native approaches as discussed in [knowledge-graph-integration-opportunities.md](../../../research/semantic-search/knowledge-graph-integration-opportunities.md) and [enhanced-search-elasticsearch-neo4j-with-links.md](../../../research/elasticsearch/graphs/enhanced-search-elasticsearch-neo4j-with-links.md) and [elastic-cloud-graph-search.md](../../../research/elasticsearch/graphs/elastic-cloud-graph-search.md).

---

## The Problem

### Current State: Property Graph

```typescript
// knowledge-graph-data.ts — Schema only
{ id: 'keyword', label: 'Keyword', brief: 'Critical vocabulary' }
{ from: 'lesson', to: 'keyword', rel: 'hasKeywords' }
```

Defines **types and relationships**, but contains **no instances**.

### What We Have: Instance Data (Disconnected)

```typescript
// vocabulary-graph-data.ts — Instance data
{ term: "photosynthesis", definition: "...", lessonSlugs: ["ks3-bio-1"] }
```

These are **instances**, but they're **not connected** to the schema.

### Target State: True Knowledge Graph

```
SCHEMA: "Lesson hasKeywords Keyword"
INSTANCE: lesson:ks3-bio-1 → hasKeywords → keyword:photosynthesis
```

Schema + instances = true knowledge graph = graph-based queries.

---

## Intended Impact

| Capability | Without True KG | With True KG |
|------------|-----------------|--------------|
| "What keywords does this lesson teach?" | Manual lookup | Graph query |
| "Which lessons address this misconception?" | Text search | Edge traversal |
| "What concepts lead to this one?" | Prerequisite only | Multi-hop reasoning |
| "Related concepts to X" | N/A | Graph neighbour query |

---

## Phases

### Phase 1: Rename and Document

- Rename `knowledge-graph-data.ts` → `curriculum-property-graph.ts`
- Document distinction between property graph and knowledge graph

### Phase 2: Schema Validation

- Validate extracted entities match schema-defined types
- Catch extraction errors early

### Phase 3: Generate Instance Edges

```typescript
// curriculum-instance-edges.ts
export const instanceEdges = [
  { from: "lesson:ks3-bio-1", to: "keyword:photosynthesis", rel: "hasKeywords" },
];
```

### Phase 4: Unified Knowledge Graph Export

```typescript
export const curriculumKnowledgeGraph = {
  schema: { concepts, relationships },
  instances: { keywords, misconceptions },
  edges: instanceEdges,
};
```

### Phase 5: Graph Query Interface

```typescript
function getKeywordsForLesson(lessonSlug: string): Keyword[];
function getLessonsForMisconception(id: string): Lesson[];
function getRelatedConcepts(id: string, hops?: number): Concept[];
```

### Phase 6: MCP Tool Integration

New MCP tool: `get-curriculum-graph`

---

## User Value

| Persona | Benefit |
|---------|---------|
| **Teacher** | "What vocabulary do I need to introduce for this lesson?" |
| **Student** | "What should I know before studying this topic?" |
| **Curriculum Planner** | "How are concepts connected across subjects?" |
| **AI Agent** | Structured reasoning over curriculum relationships |

---

## Success Criteria

- [ ] Property graph clearly distinguished from knowledge graph
- [ ] Extracted entities validated against schema types
- [ ] Instance edges generated from implicit relationships
- [ ] Unified knowledge graph export available
- [ ] At least 2 graph query functions implemented
- [ ] Quality gates pass

---

## Evaluation Requirements

Graph evolution creates new query capabilities:

1. **Create ground truths** for graph queries:
   - "What keywords does lesson X teach?" → Expected keyword list
   - "What lessons address misconception Y?" → Expected lesson list

2. **Before**: Document that these queries return null/error
3. **After**: Verify queries return correct results
4. **Record**: [EXPERIMENT-LOG.md](../../../evaluations/EXPERIMENT-LOG.md)

**Success metric**: Graph queries return correct results (100% accuracy for structured lookups)

---

## Related Documents

- [roadmap.md](../roadmap.md) — Linear execution path
- [mcp-graph-tools.md](mcp-graph-tools.md) — MCP tool integration

