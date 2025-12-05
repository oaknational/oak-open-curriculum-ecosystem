# Making Ontology and Knowledge Graph Complementary by Construction

> **STATUS: V1 DESIGN DOCUMENT**
>
> This document defines how ontology and knowledge graph complement each other.
> For comprehensive synthesis, see `knowledge-graph-analysis-synthesis.md`.

This document analyses how the ontology data and knowledge graph can be designed to be **complementary by construction** — meaning their separation of concerns is clear, intentional, and non-overlapping.

**Last Updated**: December 2025 (corrected to focus on concept relationships, not API mappings)

---

## Terminology: Schema-Level Knowledge Graph

The **Oak Curriculum Knowledge Graph (schema-level)** is the structure and form of the domain model — how concept types relate. It is NOT populated with instances (specific lessons, units).

In formal knowledge representation terms:

- **TBox (Terminological)**: Schema, types, class relationships → Our **Knowledge Graph**
- **ABox (Assertional)**: Instances, actual entities → Partially in our **Ontology** (enumerated values)
- **Guidance**: Workflows, definitions, tips → Our **Ontology**

The two artifacts are complementary: the ontology provides meaning and instances, the graph provides navigable structure.

---

## 1. The Complementary Design Principle

### 1.1 Core Distinction

| Ontology                  | Knowledge Graph             |
| ------------------------- | --------------------------- |
| **What things mean**      | **How things connect**      |
| Rich prose definitions    | Terse relationships (edges) |
| Guidance and workflows    | Navigable structure         |
| Enumerated values (lists) | Inferred relationships      |
| Domain expertise as text  | Domain structure as graph   |

### 1.2 The Two Questions They Answer

**Ontology answers**: "I'm new to Oak. What should I understand about the curriculum before I start?"

**Knowledge Graph answers**: "How do curriculum concepts relate to each other? What builds on what?"

**NOT what the graph answers**: ~~"Which endpoint returns Unit data?"~~ — agents already know this from `tools/list`.

---

## 2. Content Allocation Analysis

### 2.1 Concepts — Where Should Definitions Live?

Both contain concept information, but with different purposes:

**Ontology** (rich definitions):

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

**Knowledge Graph** (identity + relationships):

```typescript
{
  id: 'keystage',
  label: 'KeyStage',
  brief: 'A formal stage of education (KS1–KS4).'
}
// Plus edges showing relationships
```

**Allocation**:

- Ontology owns **rich definitions** with examples, context, enumerated values
- Graph owns **concept identifiers** and **edges to other concepts**
- Brief descriptions in graph are for context, not duplication

### 2.2 Relationships — Clear Ownership

**Ontology** describes hierarchy in prose:

```typescript
entityHierarchy: {
  description: 'Curriculum content is organised in a hierarchy',
  levels: [
    { entity: 'Subject', contains: 'Sequences', note: '...' },
    { entity: 'Sequence', contains: 'Units', note: '...' },
  ];
}
```

**Knowledge Graph** provides navigable edges:

```typescript
{ from: 'subject', to: 'sequence', rel: 'hasSequences' }
{ from: 'sequence', to: 'unit', rel: 'containsUnits' }
```

**Allocation**:

- Ontology explains **what the hierarchy means** in prose
- Graph provides **traversable structure** via edges
- Consider trimming prose hierarchy if graph captures it adequately

### 2.3 API Mappings — NOT in Knowledge Graph

**Previous (incorrect) approach**: Graph contained Endpoint and Schema nodes.

**Correct approach**: Agents learn about endpoints from `tools/list`. The graph should NOT duplicate this.

**Ontology** can reference tools for guidance:

```typescript
lessonComponents: [
  { name: 'Slide deck', tool: 'get-lessons-assets' },
  { name: 'Starter quiz', tool: 'get-lessons-quiz' },
];
```

This is **guidance** about which tool to use, not API architecture.

### 2.4 Workflows and Guidance — Ontology Only

```typescript
workflows: {
  findLessons: { steps: [...] },
  lessonPlanning: { steps: [...] },
  trackProgression: { steps: [...] },
}
```

Workflows are about **how to use tools**. This belongs in ontology, not graph.

### 2.5 Context and Synonyms — Ontology Only

```typescript
ukEducationContext: { ... },
synonyms: { ... },
canonicalUrls: { ... },
```

These help agents understand the domain context — clearly ontology territory.

### 2.6 Inferred Relationships — Knowledge Graph Only

The graph captures relationships that aren't explicit in API or prose:

```typescript
// Programme is a derived concept (not a direct API entity)
{ from: 'programme', to: 'tier', rel: 'uses', inferred: true }
{ from: 'programme', to: 'examboard', rel: 'uses', inferred: true }

// Unit belongs to contexts (inferred from placement)
{ from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true }
{ from: 'unit', to: 'keystage', rel: 'belongsTo', inferred: true }
```

These inferred relationships are valuable domain knowledge that the graph makes explicit.

---

## 3. Proposed Content Separation

### 3.1 Ontology Should Own

| Section                 | Purpose                                           |
| ----------------------- | ------------------------------------------------- |
| `curriculumStructure`   | Rich definitions of key stages, phases, subjects  |
| `threads`               | What threads are, why they matter, examples       |
| `programmesVsSequences` | Critical distinction for understanding            |
| `ks4Complexity`         | Programme factors explained                       |
| `entityHierarchy`       | Conceptual explanation (what the hierarchy means) |
| `unitTypes`             | Simple/variant/optionality explained              |
| `lessonComponents`      | The 8 components and their purposes               |
| `contentGuidance`       | Supervision levels explained                      |
| `workflows`             | All workflow guidance                             |
| `idFormats`             | How to construct prefixed IDs                     |
| `ukEducationContext`    | National curriculum context                       |
| `canonicalUrls`         | How to link to Oak website                        |
| `synonyms`              | Alternative terms mapping                         |

### 3.2 Knowledge Graph Should Own (Revised)

**Concepts only** — no API nodes:

| Node Type  | Purpose                                         |
| ---------- | ----------------------------------------------- |
| `Concept`  | Concept identifiers with brief descriptions     |
| (optional) | `ExternalLink` for documentation URLs if useful |

**Concept-to-concept edges only** — no API mappings:

| Edge Type         | Purpose                                  |
| ----------------- | ---------------------------------------- |
| Concept → Concept | Domain relationships (contains, uses)    |
| Concept → Concept | Inferred relationships (belongsTo, etc.) |

**NOT in graph:**

- ~~Endpoint nodes~~ — agents see `tools/list`
- ~~Schema nodes~~ — internal API detail
- ~~Concept → Endpoint edges~~ — not needed
- ~~Endpoint → Schema edges~~ — not needed

### 3.3 Shared Identifiers (The Bridge)

Use consistent concept IDs between ontology and graph:

```typescript
// Ontology references concepts
curriculumStructure.keyStages[].slug === 'ks1'  // Instance
entityHierarchy.levels[].entity === 'Subject'   // Concept type

// Knowledge Graph uses matching IDs
concepts: [{ id: 'keystage', label: 'KeyStage', ... }]
concepts: [{ id: 'subject', label: 'Subject', ... }]

// Edges connect concepts
edges: [{ from: 'subject', to: 'sequence', rel: 'hasSequences' }]
```

The ontology provides the **instances** (ks1, ks2, maths, history).
The graph provides the **concept structure** (KeyStage, Subject, how they relate).

---

## 4. Migration from Current State

### 4.1 Ontology Changes

The current ontology is well-structured. Consider:

1. **Review entityHierarchy** — prose explanation is valuable, but consider if graph edges make some of it redundant
2. **Remove schemaRef fields** — these are API implementation details
3. **Keep tool references** in lessonComponents (useful for guidance)

### 4.2 Knowledge Graph Changes (Major Restructure)

The current graph needs significant revision:

1. **Remove Endpoint nodes** (27 nodes) — agents see `tools/list`
2. **Remove Schema nodes** (24 nodes) — internal API detail
3. **Remove SourceDoc nodes** (4 nodes) — research provenance
4. **Remove all API-mapping edges** — Concept→Endpoint, Endpoint→Schema, etc.
5. **Keep Concept nodes** (28 nodes) — the domain model
6. **Keep concept-to-concept edges** — the valuable relationships
7. **Simplify node IDs** — `concept_subject` → `subject`

**Result**: From ~89 nodes + ~118 edges to ~28 concepts + ~40 edges.

### 4.3 Cross-References (Not a Bridge)

Rather than a complex bridge structure, use simple cross-references:

**In ontology tool response:**

```typescript
{
  structuredContent: { ...ontologyData },
  // Include hint
  seeAlso: 'Call get-knowledge-graph for concept relationships'
}
```

**In graph tool response:**

```typescript
{
  structuredContent: { ...conceptGraph },
  seeOntology: 'Call get-ontology for rich definitions and usage guidance'
}
```

The complementary relationship is maintained through authoring, not runtime bridges.

---

## 5. Agent Usage Patterns

### 5.1 Starting a Conversation

```
Agent: "I'll start by understanding the Oak curriculum..."
       → Call get-ontology for domain understanding
       → Learn what key stages, subjects, threads mean
       → Understand workflows and ID formats
```

### 5.2 Understanding Concept Relationships

```
Agent: "How do these concepts connect?"
       → Call get-knowledge-graph for structure
       → See: Subject → Sequence → Unit → Lesson hierarchy
       → See: Thread → Unit links (progression across years)
       → See: Programme → Tier/ExamBoard (KS4 complexity)
```

### 5.3 Exploring Progression

```
Agent: "What builds on the Unit concept?"
       → Graph shows: Unit → Lesson (contains), Unit → Thread (tagged)
       → Graph shows: Sequence → Unit (contains), Programme → Unit (contains)
       → Agent can reason about relationships
```

### 5.4 Combined Understanding

```
Agent: "What's the full picture of Threads?"
       → get-ontology: Rich explanation, examples, why they matter, how to use thread tools
       → get-knowledge-graph: Thread → Unit edges showing structural relationship
       → Complete understanding: meaning + structure
```

### 5.5 NOT How the Graph Should Be Used

```
❌ Agent: "Which endpoint returns Unit data?"
   → This is in tools/list, not the graph

❌ Agent: "What schema does GET /subjects return?"
   → This is API implementation detail, not domain knowledge
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
- [ ] Component purposes and tool references
- [ ] Supervision level meanings
- [ ] Enumerated values (key stages list, subjects list)

### Knowledge Graph Owns:

- [ ] Concept identifiers with brief labels
- [ ] Concept → Concept edges (hierarchy)
- [ ] Concept → Concept edges (inferred relationships)
- [ ] Inferred relationship flags
- [ ] Cross-reference to ontology

### Knowledge Graph Does NOT Own:

- [x] ~~Endpoint nodes~~ — agents see `tools/list`
- [x] ~~Schema nodes~~ — internal API detail
- [x] ~~Concept → Endpoint edges~~ — not needed
- [x] ~~Endpoint → Schema edges~~ — not needed
- [x] ~~SourceDoc nodes~~ — research provenance

### Neither Duplicates:

- [ ] Entity definitions (ontology has detail, graph has structure only)
- [ ] Hierarchy (ontology explains meaning, graph provides edges)
- [ ] Tool guidance (ontology only — graph doesn't mention tools)

---

## 9. Next Steps

1. **Review current ontology** for any content that belongs in graph
2. **Review current graph** for any content better expressed in ontology
3. **Define shared identifier scheme** for cross-referencing
4. **Create complementary tool descriptions** that guide agents to the right tool
5. **Test with agents** to validate the separation works in practice
