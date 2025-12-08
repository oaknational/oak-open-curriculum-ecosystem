# Approaches to Knowledge

**Type**: Concept Exploration & Research  
**Scope**: MCP × Hybrid Search × Knowledge Graphs × Atomic Concepts  
**Context**: Open curriculum data, globally applicable  
**Status**: Research Phase

---

## Executive Summary

Explore the interplay between Model Context Protocol (MCP), hybrid search, knowledge graphs, and a proposed "Atomic Concepts" framework for representing curriculum data in a universal, context-independent way.

**Core Hypothesis**: There exists a minimal, complete, orthogonal set of educational concepts ("Atomic Concepts") that can encode any curriculum resource, regardless of country, pedagogical approach, or subject matter.

---

## Atomic Concepts: Definition

### What Are Atomic Concepts?

**Atomic Concepts** are the fundamental, irreducible building blocks of educational knowledge representation. They are:

1. **Large enough** to be useful ideas that can be reasoned about
2. **Small enough** to be truly atomic (cannot be meaningfully subdivided)
3. **Universal enough** to apply across all education systems globally
4. **Orthogonal enough** that they form a complete, non-overlapping set
5. **Complete enough** that any curriculum resource can be encoded using them

### Analogy: Chemical Elements

Just as the periodic table provides ~118 elements that can combine to form all known matter, Atomic Concepts would provide a finite set of educational primitives that can combine to form all curriculum content.

### Examples (Hypothetical)

Potential Atomic Concepts might include:

| Concept Type       | Examples                                                     |
| ------------------ | ------------------------------------------------------------ |
| **Cognitive**      | `RECALL`, `APPLY`, `ANALYZE`, `CREATE`, `EVALUATE`           |
| **Content**        | `QUANTITY`, `SPACE`, `TIME`, `CHANGE`, `PATTERN`             |
| **Pedagogical**    | `PREREQUISITE`, `MISCONCEPTION`, `SCAFFOLD`, `ASSESSMENT`    |
| **Structural**     | `SEQUENCE`, `HIERARCHY`, `NETWORK`, `PROGRESSION`            |
| **Social**         | `COLLABORATION`, `INDIVIDUAL`, `DISCUSSION`, `DEMONSTRATION` |
| **Representation** | `SYMBOLIC`, `VISUAL`, `KINESTHETIC`, `VERBAL`, `NUMERICAL`   |

### Non-Examples (Too Specific)

❌ "Pythagoras' Theorem" - too specific to Euclidean geometry  
❌ "GCSE Foundation Tier" - too specific to UK system  
❌ "Year 7" - too specific to age-based systems  
✅ "SPATIAL_RELATIONSHIP" - universal, atomic

---

## The Four Pillars: How They Interact

### 1. MCP (Model Context Protocol)

**Role**: Discovery, access, and contextual reasoning over curriculum data

**MCP Tools for Atomic Concepts**:

- `discover-atomic-concepts` - Find all atomic concepts in a resource
- `map-resource-to-atoms` - Decompose curriculum content into atomic representation
- `find-by-atomic-pattern` - Search for resources matching atomic concept combinations
- `infer-prerequisites` - Use atomic concept relationships to infer learning dependencies
- `translate-across-systems` - Map curriculum from one system to another via shared atoms

**MCP Resources**:

- `atomic-concept://ontology` - The complete atomic concept ontology
- `atomic-concept://mappings/{curriculum-system}` - How different systems map to atoms
- `atomic-concept://graph` - The knowledge graph of atomic concept relationships

### 2. Hybrid Search

**Role**: Multi-modal retrieval across lexical, semantic, and structural dimensions

**Search Strategies**:

| Strategy             | Purpose                                     | Example                                            |
| -------------------- | ------------------------------------------- | -------------------------------------------------- |
| **Lexical (BM25)**   | Find explicit mentions of atomic concepts   | "PREREQUISITE" keyword in metadata                 |
| **Semantic (ELSER)** | Find implicit atomic patterns               | Lesson teaches APPLY even without using the word   |
| **Dense Vectors**    | Find conceptually similar atomic signatures | Resources with similar atomic concept embeddings   |
| **Graph Traversal**  | Navigate atomic concept relationships       | Find all resources requiring RECALL before APPLY   |
| **Structural**       | Match atomic concept sequences/hierarchies  | Learning pathways with specific atomic progression |

**Hybrid Query Example**:

```
Find resources that:
- Require [RECALL + QUANTITY] as prerequisite (graph)
- Teach [APPLY + SPATIAL_RELATIONSHIP] (semantic)
- Suitable for [INDIVIDUAL + VISUAL] learners (facets)
- In algebra domain (lexical)
```

### 3. Knowledge Graphs

**Role**: Encode relationships between atomic concepts and curriculum resources

**Graph Structure**:

```typescript
// Atomic Concept Ontology
{
  nodes: [
    { id: 'RECALL', type: 'cognitive', level: 1 },
    { id: 'APPLY', type: 'cognitive', level: 2 },
    { id: 'QUANTITY', type: 'content', domain: 'mathematics' },
    { id: 'PREREQUISITE', type: 'pedagogical', meta: true },
  ],
  edges: [
    { from: 'RECALL', to: 'APPLY', relation: 'PREREQUISITE_OF', strength: 0.95 },
    { from: 'APPLY', to: 'QUANTITY', relation: 'OPERATES_ON', contexts: ['all'] },
    { from: 'APPLY', to: 'CREATE', relation: 'ENABLES', conditions: ['mastery'] },
  ]
}

// Resource-to-Atomic-Concept Mapping
{
  resource: 'oak:lesson:pythagoras-theorem',
  atomic_signature: [
    { concept: 'SPATIAL_RELATIONSHIP', weight: 0.9, role: 'primary' },
    { concept: 'APPLY', weight: 0.8, role: 'cognitive' },
    { concept: 'PATTERN', weight: 0.6, role: 'secondary' },
  ],
  prerequisites: ['RECALL:right-angle', 'APPLY:squares'],
}
```

**Graph Queries**:

- **Prerequisite chains**: What atomic concepts must be mastered before X?
- **Concept co-occurrence**: Which atomic concepts frequently appear together?
- **Learning pathways**: Optimal progression through atomic concept space
- **Cross-system mapping**: How does "KS4 Higher Tier" map to "Grade 10 Advanced"?

### 4. Atomic Concepts Framework

**Role**: Universal representation layer enabling interoperability

**Key Properties**:

1. **Compositionality**: Complex concepts = combinations of atomic concepts
2. **Context Independence**: Atomic concepts transcend specific curricula
3. **Bidirectional Mapping**: Any resource ↔ atomic signature
4. **Inference**: Relationships between atoms enable reasoning
5. **Measurability**: Atomic concept mastery can be assessed

---

## Research Questions

### Foundational

1. **Can atomic concepts be discovered empirically?**
   - Analyze Oak + curricula from 10+ countries
   - Use NLP/ML to extract recurring primitives
   - Validate orthogonality and completeness

2. **What is the minimal complete set?**
   - Start with 100 candidates
   - Reduce through equivalence analysis
   - Aim for 30-50 true atoms

3. **How stable are atomic concepts across domains?**
   - Do the same atoms work for Maths, English, Science, History?
   - Domain-specific atoms vs universal atoms

### Technical

4. **How do we embed atomic concepts in vector space?**
   - Train embeddings where distance = conceptual similarity
   - Atomic concept vectors as basis functions
   - Resource embeddings as weighted sums of atomic vectors

5. **Can hybrid search effectively retrieve by atomic signature?**
   - Query: `[APPLY:0.8, VISUAL:0.6, COLLABORATION:0.4]`
   - Find resources matching this atomic pattern

6. **How do we build the atomic concept knowledge graph?**
   - Explicit relationships (curated ontology)
   - Discovered relationships (co-occurrence, prerequisite inference)
   - Continuous refinement from usage data

### Practical

7. **Can we translate curricula via atomic concepts?**
   - UK National Curriculum → Atomic Signature → Indian CBSE
   - Test with Pythagoras Theorem across 5 systems

8. **Does atomic representation improve search quality?**
   - Compare: Traditional search vs Atomic-enhanced hybrid search
   - Metrics: Precision, Recall, Cross-system discoverability

9. **Can LLMs reason about atomic concepts?**
   - "This lesson requires [RECALL, PATTERN]. What prerequisites?"
   - Generate explanations in atomic concept language

---

## Exploration Methodology

### Phase 1: Discovery (Weeks 1-4)

**Goal**: Identify candidate atomic concepts from existing curriculum data

1. **Corpus Assembly**
   - Oak National Academy (UK)
   - Khan Academy (US)
   - NCERT (India)
   - IB Curriculum (International)
   - Sample from 5+ other countries

2. **Analysis**
   - Extract all pedagogical metadata
   - Identify recurring patterns across systems
   - Cluster similar concepts
   - Propose initial atomic concept set

3. **Validation**
   - Can we encode all resources using proposed atoms?
   - Are atoms orthogonal (minimal overlap)?
   - Are atoms complete (no gaps)?

### Phase 2: Graph Construction (Weeks 5-8)

**Goal**: Build atomic concept ontology and relationship graph

1. **Ontology Design**
   - Define atomic concept taxonomy
   - Specify relationship types
   - Create formal schema

2. **Relationship Discovery**
   - Prerequisites: Which atoms must precede others?
   - Co-occurrence: Which atoms frequently combine?
   - Enables: Which atoms unlock others?

3. **Population**
   - Encode Oak curriculum in atomic concepts
   - Build knowledge graph
   - Index for search

### Phase 3: Hybrid Search Integration (Weeks 9-12)

**Goal**: Enable search and retrieval via atomic concepts

1. **Embeddings**
   - Train atomic concept embeddings
   - Generate resource embeddings as atom combinations
   - Store in Elasticsearch dense_vector fields

2. **Query Builders**
   - Atomic concept query DSL
   - Translate natural language → atomic queries
   - Combine with traditional search

3. **Evaluation**
   - Test cross-system discoverability
   - Measure search quality improvements
   - User studies with teachers

### Phase 4: MCP Tool Development (Weeks 13-16)

**Goal**: Expose atomic concept reasoning via MCP

1. **Tool Design**
   - `discover-atomic-concepts`
   - `map-resource-to-atoms`
   - `find-by-atomic-pattern`
   - `translate-curriculum`

2. **Implementation**
   - Build against atomic concept knowledge graph
   - Integrate with hybrid search
   - Connect to LLM reasoning

3. **Validation**
   - Can LLMs effectively use atomic concept tools?
   - Do atomic queries outperform keyword queries?
   - Can we translate real curricula?

---

## Implementation Architecture

### Data Layer

```
Atomic Concept Ontology (Graph Database)
├── Concepts (nodes)
│   ├── Properties: id, type, definition, domain
│   └── Embeddings: dense_vector (384-dim)
├── Relationships (edges)
│   ├── PREREQUISITE_OF
│   ├── ENABLES
│   ├── CO_OCCURS_WITH
│   └── OPERATES_ON
└── Metadata
    ├── Source: curated vs discovered
    ├── Confidence: 0.0-1.0
    └── Evidence: supporting data

Resource Atomic Signatures (Elasticsearch)
├── resource_id
├── atomic_signature: [{ concept, weight, role }]
├── atomic_embedding: dense_vector (composite)
├── traditional_fields: title, subject, etc.
└── search_fields: all atomic concepts as keywords
```

### Search Layer

```
Hybrid Search with Atomic Concepts
├── BM25: Lexical match on atomic concept names
├── ELSER: Semantic match on atomic concept descriptions
├── Dense Vectors: Similarity in atomic concept space
├── Graph: Traversal of atomic concept relationships
└── RRF: Fuse all signals with rank fusion
```

### MCP Layer

```
MCP Server: Atomic Concepts
├── Tools
│   ├── discover-atomic-concepts(resource_id)
│   ├── map-resource-to-atoms(content)
│   ├── find-by-atomic-pattern(pattern)
│   ├── translate-curriculum(from, to, resource)
│   └── infer-prerequisites(atomic_signature)
├── Resources
│   ├── atomic-concept://ontology
│   ├── atomic-concept://mappings/{system}
│   └── atomic-concept://graph
└── Prompts
    ├── explain-atomic-concepts
    ├── curriculum-translation-workflow
    └── learning-pathway-generation
```

---

## Success Criteria

### Scientific

- [ ] Identified 30-50 atomic concepts with <10% overlap
- [ ] 95%+ of curriculum resources encodable with atoms
- [ ] Atomic concept relationships validated by domain experts
- [ ] Embeddings capture semantic distance between concepts

### Technical

- [ ] Hybrid search retrieves by atomic pattern with >80% precision
- [ ] Cross-system curriculum translation demonstrates >70% accuracy
- [ ] MCP tools enable LLM reasoning about atomic concepts
- [ ] Knowledge graph supports multi-hop prerequisite inference

### Practical

- [ ] Teachers can discover resources across curricula
- [ ] Learning pathways generated using atomic concept progression
- [ ] Search quality improves 20%+ with atomic concept enhancement
- [ ] Real curriculum (e.g., UK Maths KS4) fully mapped to atoms

---

## Related Work

### Academic

- Bloom's Taxonomy (cognitive dimension)
- Learning progressions research
- Curriculum alignment studies
- Ontology engineering in education

### Industry

- Khan Academy skill graphs
- Curriculum standards alignment (e.g., Common Core mappings)
- Adaptive learning platforms (e.g., ALEKS knowledge spaces)

### Oak Context

- Existing Oak lesson/unit/sequence structure
- Programme factors (tier, pathway, exam board)
- Lesson keywords with definitions
- Thread structure (Number, Algebra, etc.)

---

## Exploration Tasks

### Immediate (Week 1)

1. **Corpus Analysis**
   - Export Oak curriculum metadata
   - Gather sample curricula from 3 other countries
   - Extract all pedagogical metadata fields

2. **Pattern Identification**
   - List all recurring metadata types
   - Group by conceptual similarity
   - Propose initial atomic concept candidates (50-100)

3. **Feasibility Study**
   - Can we encode 10 sample lessons in atomic concepts?
   - Do atomic representations enable useful inferences?
   - What's missing from the initial set?

### Short Term (Weeks 2-4)

1. **Ontology Design**
   - Refine atomic concept set to 30-50
   - Define relationship types
   - Create formal schema

2. **Proof of Concept**
   - Encode entire Maths KS4 in atomic concepts
   - Build small knowledge graph
   - Test basic queries

3. **Validation**
   - Expert review of atomic concepts
   - Test encoding consistency across domains
   - Measure completeness and orthogonality

---

## Open Questions

1. **Granularity**: Where do we draw the line between atomic and compound?
2. **Universality**: Do atoms work equally well across STEM vs Humanities?
3. **Evolution**: How do atomic concepts evolve as pedagogy advances?
4. **Cultural**: Are there culturally-specific atoms, or are all truly universal?
5. **Practical**: Can non-expert users (teachers) understand and use atomic concepts?
6. **Scale**: Can this approach scale to millions of resources globally?
7. **Maintenance**: Who curates the atomic concept ontology?
8. **Standards**: Can atomic concepts become an open standard?

---

## Next Steps

### For AI Agent

When exploring this topic, please:

1. **Search the codebase** for:
   - Existing knowledge graph implementations
   - Hybrid search query builders
   - MCP tool definitions
   - Schema definitions that could encode atomic concepts

2. **Analyze current architecture** for:
   - Where atomic concepts could be integrated
   - What changes would be needed to data model
   - How MCP tools would access atomic concept reasoning

3. **Propose** specific:
   - Field definitions for atomic concept storage
   - ES mapping strategies for atomic concept search
   - MCP tool signatures for atomic concept operations
   - Knowledge graph schema for atomic concept relationships

4. **Consider** practical:
   - How to gradually introduce atomic concepts (backward compatible)
   - What tooling teachers would need
   - How to validate atomic concept mappings
   - Integration with existing Oak systems

### For Human

Refine the atomic concept framework by:

1. Reviewing academic literature on learning progressions
2. Consulting with curriculum experts from multiple countries
3. Analyzing existing curriculum alignment tools
4. Testing the hypothesis with a small pilot study

---

## References

- `.agent/plans/semantic-search/maths-ks4-implementation-plan.md` - Current search implementation
- `.agent/research/elasticsearch/curriculum-schema-field-analysis.md` - Available API fields
- ADR-072: Three-Way Hybrid Search Architecture
- ADR-077: Graph API for Curriculum Relationships (future)

---

**This is a research prompt. The goal is exploration, not immediate implementation.**

**Start by searching the codebase for concepts that relate to universal curriculum representation, knowledge graphs, and semantic search capabilities.**

---

**End of Prompt**
