# Making Ontology and Knowledge Graph Complementary by Construction

This document analyses how the ontology data and knowledge graph can be designed to be **complementary by construction** — meaning their separation of concerns is clear, intentional, and non-overlapping.

---

## 1. The Complementary Design Principle

### 1.1 Core Distinction

| Ontology               | Knowledge Graph        |
| ---------------------- | ---------------------- |
| **What things mean**   | **How things connect** |
| Human understanding    | Machine navigation     |
| Guidance and workflows | Structure and mappings |
| Rich descriptions      | Terse relationships    |
| Domain expertise       | API architecture       |

### 1.2 The Two Questions They Answer

**Ontology answers**: "I'm new to Oak. What should I understand about the curriculum before I start?"

**Knowledge Graph answers**: "I understand Oak. Which endpoint should I call to get Unit data, and what schema will it return?"

---

## 2. Content Allocation Analysis

### 2.1 Concepts — Where Should Definitions Live?

Currently, both contain concept information:

**Ontology** (detailed):

```typescript
keyStages: [
  {
    slug: 'ks1',
    name: 'Key Stage 1',
    ageRange: '5-7',
    years: [1, 2],
    phase: 'primary',
    description: 'Foundation stage covering basic literacy and numeracy',
  },
  // ...
];
```

**Knowledge Graph** (terse):

```typescript
{
  id: 'concept_keystage',
  type: 'Concept',
  label: 'KeyStage',
  description: 'A formal stage of education (KS1–KS4).'
}
```

**Recommendation**:

- Ontology owns **rich concept definitions** with examples, context, and usage guidance
- Knowledge Graph owns **concept identifiers** and their **relationships**
- Knowledge Graph can reference ontology sections: "See ontology.curriculumStructure.keyStages for details"

### 2.2 Relationships — Clear Ownership

**Ontology** (implicit via structure):

```typescript
entityHierarchy: {
  levels: [
    { entity: 'Subject', contains: 'Sequences', schemaRef: '...' },
    { entity: 'Sequence', contains: 'Units', note: '...' },
    // ...
  ];
}
```

**Knowledge Graph** (explicit via edges):

```typescript
{
  id: 'edge_subject_sequence',
  from: 'concept_subject',
  to: 'concept_sequence',
  label: 'has sequences'
}
```

**Recommendation**:

- Ontology describes **what the hierarchy means** and **why it matters**
- Knowledge Graph provides **navigable structure** for programmatic traversal
- Remove `schemaRef` from ontology (belongs in graph)

### 2.3 API Mappings — Knowledge Graph Only

The knowledge graph uniquely provides:

- Endpoint → Schema relationships
- Schema → Concept relationships
- Concept → Endpoint relationships

This information doesn't belong in the ontology, which is about domain understanding.

**Current ontology** (tool references):

```typescript
lessonComponents: [
  { name: 'Slide deck', tool: 'get-lessons-assets' },
  { name: 'Starter quiz', tool: 'get-lessons-quiz' },
  // ...
];
```

**Recommendation**:

- Keep tool references in ontology for guidance purposes
- Knowledge Graph provides the authoritative endpoint mappings
- These serve different purposes and can coexist

### 2.4 Workflows and Guidance — Ontology Only

The ontology uniquely provides:

```typescript
toolUsageGuidance: {
  discoveryWorkflow: { ... },
  browsingWorkflow: { ... },
  progressionWorkflow: { ... },
  lessonPlanningWorkflow: { ... },
}
```

This doesn't belong in the knowledge graph. The graph is about structure, not process.

### 2.5 Context and Synonyms — Ontology Only

```typescript
ukEducationContext: { ... },
synonyms: { ... },
canonicalUrls: { ... },
```

These help agents understand the domain — clearly ontology territory.

---

## 3. Proposed Content Separation

### 3.1 Ontology Should Own

| Section                 | Purpose                                          |
| ----------------------- | ------------------------------------------------ |
| `curriculumStructure`   | Rich definitions of key stages, phases, subjects |
| `threads`               | What threads are, why they matter, examples      |
| `programmesVsSequences` | Critical distinction for understanding           |
| `ks4Complexity`         | Programme factors explained                      |
| `entityHierarchy`       | Conceptual explanation (without schemaRefs)      |
| `unitTypes`             | Simple/variant/optionality explained             |
| `lessonComponents`      | The 8 components and their purposes              |
| `contentGuidance`       | Supervision levels explained                     |
| `toolUsageGuidance`     | All workflow guidance                            |
| `idFormats`             | How to construct prefixed IDs                    |
| `ukEducationContext`    | National curriculum context                      |
| `canonicalUrls`         | How to link to Oak website                       |
| `synonyms`              | Alternative terms mapping                        |

### 3.2 Knowledge Graph Should Own

| Node Type      | Purpose                                     |
| -------------- | ------------------------------------------- |
| `Concept`      | Concept identifiers with brief descriptions |
| `Endpoint`     | All API endpoints with paths and methods    |
| `Schema`       | All response schemas                        |
| `ExternalLink` | Documentation URLs                          |

| Edge Type          | Purpose                             |
| ------------------ | ----------------------------------- |
| Concept → Concept  | Domain relationships                |
| Concept → Endpoint | "Which endpoint returns this?"      |
| Endpoint → Schema  | "What schema does this return?"     |
| Schema → Concept   | "What concepts does this describe?" |

### 3.3 Shared Identifiers (The Bridge)

To make them complementary, use consistent identifiers:

```typescript
// Ontology
curriculumStructure.keyStages[].slug === 'ks1'

// Knowledge Graph
nodes.find(n => n.id === 'concept_keystage').label === 'KeyStage'

// Bridge mapping (could be in either or separate)
{
  conceptId: 'concept_keystage',
  ontologyPath: 'curriculumStructure.keyStages',
  instances: ['ks1', 'ks2', 'ks3', 'ks4']
}
```

---

## 4. Migration from Current State

### 4.1 Ontology Changes (Minimal)

The current ontology is well-structured for its purpose. Minor changes:

1. **Remove schemaRef fields** from entityHierarchy (move to graph)
2. **Keep tool references** in lessonComponents (useful for guidance)
3. **Add version/metadata** for complementary tool awareness

### 4.2 Knowledge Graph Changes

1. **Remove SourceDoc nodes** — Research provenance, not useful for agents
2. **Simplify concept descriptions** — Reference ontology for details
3. **Add cross-references** — Link concepts to ontology sections
4. **Ensure all endpoints present** — Validate against OpenAPI spec
5. **Ensure all schemas present** — Validate against OpenAPI spec

### 4.3 New: Bridge Metadata

Consider a small bridge structure:

```typescript
export const ontologyGraphBridge = {
  // Maps graph concept IDs to ontology data paths
  conceptToOntology: {
    concept_keystage: 'curriculumStructure.keyStages',
    concept_subject: 'curriculumStructure.subjects',
    concept_thread: 'threads',
    concept_programme: 'programmesVsSequences.programme',
    concept_sequence: 'programmesVsSequences.sequence',
    // ...
  },
  // Maps ontology sections to related graph subgraphs
  ontologyToGraph: {
    curriculumStructure: [
      'concept_keystage',
      'concept_phase',
      'concept_subject',
      'concept_yeargroup',
    ],
    entityHierarchy: ['concept_subject', 'concept_sequence', 'concept_unit', 'concept_lesson'],
    // ...
  },
} as const;
```

---

## 5. Agent Usage Patterns

### 5.1 Starting a Conversation

```
Agent: "I'll start by understanding the Oak curriculum..."
       → Call get-ontology for domain understanding
       → Learn what key stages, subjects, threads mean
       → Understand workflows and ID formats
```

### 5.2 Planning API Calls

```
Agent: "Now I need to find lessons about photosynthesis..."
       → Already have domain understanding from ontology
       → Optionally call get-knowledge-graph for API mappings
       → See that Lesson concept links to search and summary endpoints
       → Plan call sequence: search → fetch lesson summary
```

### 5.3 Debugging or Exploration

```
Agent: "I got back a SequenceUnitsResponse schema. What does it contain?"
       → Call get-knowledge-graph
       → Find schema_SequenceUnitsResponse node
       → See edges to concept_unit, concept_thread, concept_category
       → Understand the response structure
```

### 5.4 Combined Understanding

```
Agent: "What's the full picture of Threads?"
       → get-ontology: Rich explanation, examples, why they matter
       → get-knowledge-graph: Thread → Unit edges, Thread → endpoints, Thread → schemas
       → Complete understanding: meaning + structure + API surface
```

---

## 6. Implementation Approach

### 6.1 Phase 1: Standalone Complementary Tools

1. Create `get-knowledge-graph` following existing patterns
2. Ensure clear descriptions emphasise different purposes
3. Reference each other in tool descriptions

```typescript
// get-ontology description
'...For API structure and relationship mappings, use get-knowledge-graph.';

// get-knowledge-graph description
'...For rich domain understanding and workflows, use get-ontology.';
```

### 6.2 Phase 2: Cross-References (Optional)

Add explicit cross-references in responses:

```typescript
// get-ontology response includes
{
  relatedGraph: {
    conceptIds: ['concept_keystage', 'concept_phase', 'concept_subject'],
    note: 'Use get-knowledge-graph to see how these connect to API endpoints'
  }
}

// get-knowledge-graph response includes
{
  relatedOntology: {
    sections: ['curriculumStructure', 'entityHierarchy'],
    note: 'Use get-ontology for rich definitions and workflow guidance'
  }
}
```

### 6.3 Phase 3: Smart Guidance (Future)

Tool descriptions or responses could intelligently guide:

```typescript
// If agent hasn't called ontology
'PREREQUISITE: Call get-ontology first to understand domain concepts.';

// If agent has called ontology but needs API structure
'TIP: Use get-knowledge-graph to see which endpoints return this concept.';
```

---

## 7. Validation Criteria

The design is complementary by construction if:

### 7.1 No Semantic Duplication

- Concept **definitions** appear in one place only
- Relationship **structures** appear in one place only
- Both can reference the same **identifiers**

### 7.2 Clear Purpose Distinction

- "Should I change the ontology or the graph?" has an obvious answer
- Agent tool selection has clear criteria

### 7.3 Mutual Enhancement

- Knowing both is better than knowing either alone
- They don't contradict each other
- Cross-references are helpful, not confusing

### 7.4 Independent Correctness

- Ontology is complete for domain understanding
- Graph is complete for API navigation
- Neither requires the other to function

---

## 8. Summary Checklist

### Ontology Owns:

- [ ] Rich concept definitions with examples
- [ ] Workflow guidance and best practices
- [ ] UK education context
- [ ] Synonym mappings
- [ ] Canonical URL patterns
- [ ] ID format guidance
- [ ] Component purposes
- [ ] Supervision level meanings

### Knowledge Graph Owns:

- [ ] Concept identifiers and brief labels
- [ ] Endpoint nodes with paths/methods
- [ ] Schema nodes with names
- [ ] Concept → Concept edges
- [ ] Concept → Endpoint edges
- [ ] Endpoint → Schema edges
- [ ] Schema → Concept edges
- [ ] Inferred relationship flags

### Neither Duplicates:

- [ ] Entity definitions (ontology has detail, graph has structure)
- [ ] API references (ontology has guidance, graph has mappings)
- [ ] Hierarchy descriptions (ontology explains, graph represents)

---

## 9. Next Steps

1. **Review current ontology** for any content that belongs in graph
2. **Review current graph** for any content better expressed in ontology
3. **Define shared identifier scheme** for cross-referencing
4. **Create complementary tool descriptions** that guide agents to the right tool
5. **Test with agents** to validate the separation works in practice
