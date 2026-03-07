---
prompt_id: approaches-to-knowledge
title: "Approaches to Knowledge"
type: handover
status: active
last_updated: 2026-02-27
---

# Approaches to Knowledge

**Type**: Concept Exploration & Research  
**Scope**: MCP × Hybrid Search × Knowledge Graphs × Atomic Concepts  
**Context**: Open curriculum data, globally applicable  
**Status**: Research Phase

---

## Executive Summary

We are building an MCP server that provides access to high-quality curriculum resources (Oak National Academy). Alongside this, we're implementing:

1. **Hybrid semantic search** - Multi-modal retrieval (BM25 + ELSER + dense vectors)
2. **Ontologies** - Structured representations of curriculum concepts and relationships
3. **Knowledge graphs** - Rich networks of curriculum entities and their connections
4. **Atomic Concepts** - A proposed universal vocabulary for curriculum representation

**Core Question**: How does the Model Context Protocol tie all of these capabilities together? What does MCP enable that wouldn't be possible otherwise?

---

## The Big Picture: MCP as Quality Gateway

### The Reality: Teachers Are Already Using AI

Teachers are already using ChatGPT, Claude, and other AI tools to help create lesson content. This is happening now, at scale, and it's not going to stop. The question isn't whether teachers will use AI - **they already are**.

**The problem**: Generic AI tools lack:

- Curriculum-aligned foundations
- Pedagogical guardrails
- Age-appropriate calibration
- Subject-specific accuracy
- Educational rigor

**Our opportunity**: Not to replace this behavior, but to **support it with quality and rigor**.

> "You're already using AI to create lessons. Here are resources, tools, and validation to ensure what you create is **actually good for your pupils**."

### What We're Building

We're not building "another AI lesson generator." We're building **infrastructure for quality** that supports however teachers choose to use AI:

- **Use ChatGPT?** Here's curriculum content to ground your prompts
- **Use Claude?** Here's a knowledge graph to validate your outputs
- **Use any AI?** Here's a quality API to check what you've created

**What we're really doing**:

Taking API content, ontologies, knowledge graphs, semantic search, and atomic concepts and making it **ALL discoverable and usable** through MCP's two-way communication mechanism.

**Another way of saying this**:

> "Here's how we present, and allow you to interact with, our structured data within an AI assistant. You can **read it, remix it, riff on it, transform and reuse it** - but we provide:
>
> 1. **The quality foundation** - Expert-curated curriculum content
> 2. **The means to traverse it** - Lexically, semantically, and conceptually
> 3. **The pedagogical context** - To ensure the output is **also** high quality"

**The Quality Pipeline**:

```text
┌─────────────────────────────────────────────────────────────┐
│  HIGH-QUALITY FOUNDATION                                    │
│  • Oak's expert-curated curriculum                          │
│  • Structured ontologies & concept graphs                   │
│  • Knowledge graphs of content relationships                │
│  • Pedagogical metadata (prerequisites, misconceptions)     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  INPUT QUALITY GATE: MODERATION API                         │
│  • Safety check: Is the query appropriate?                  │
│  • Relevance check: Is this education-related?              │
│  • Scope check: Can we serve this request?                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  MCP: STRUCTURED TRAVERSAL & DISCOVERY                      │
│  • Lexical: Find by keywords, exact matches                 │
│  • Semantic: Find by meaning, intent, context               │
│  • Conceptual: Navigate ontology & concept graphs           │
│  • Graph: Traverse knowledge graph content relationships    │
│  • Atomic: Universal vocabulary for cross-system reasoning  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  OUTPUT QUALITY GATE: PEDAGOGICAL QUALITY API               │
│  • Accuracy: Is it factually correct?                       │
│  • Appropriateness: Right for the age/level?                │
│  • Alignment: Matches curriculum objectives?                │
│  • Pedagogy: Educationally sound?                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  HIGH-QUALITY OUTPUT                                        │
│  • AI outputs grounded in expert curriculum                 │
│  • Pedagogically validated recommendations                  │
│  • Traceable to authoritative sources                       │
│  • Safe and appropriate for educational context             │
└─────────────────────────────────────────────────────────────┘
```text

**Key Insight**: MCP isn't just about exposing data. It's about **ensuring quality propagates through the entire AI interaction** - from curated foundation, through input moderation, structured traversal, output validation, to trustworthy results.

**The complete quality guarantee**:

- ✅ **Quality foundation**: Expert-curated, curriculum-aligned content
- ✅ **Input moderation**: User queries checked for safety and relevance
- ✅ **Structured access**: Multiple traversal modes (lexical, semantic, conceptual, graph)
- ✅ **Output validation**: AI responses checked for pedagogical quality
- ✅ **Traceable results**: Everything links back to authoritative sources

---

## The Systems We're Building

### 1. MCP Server for Curriculum Resources

An MCP server exposing Oak National Academy's curriculum as:

- **Tools**: Search, query, transform, analyze curriculum data
- **Resources**: Lessons, units, sequences, threads, keywords
- **Prompts**: Guided workflows for curriculum discovery and planning

### 2. Hybrid Semantic Search

Multi-modal retrieval combining:

- **BM25**: Traditional keyword matching
- **ELSER**: Elastic's sparse semantic embeddings
- **Dense Vectors**: E5 multilingual embeddings (384-dim)
- **RRF**: Reciprocal Rank Fusion combining all signals

### 3. Ontologies & Concept Graphs

The **vocabulary and schema** of curriculum knowledge:

- **Curriculum ontology**: Subjects, key stages, years, threads
- **Pedagogical ontology**: Prerequisites, misconceptions, outcomes
- **Content ontology**: Topics, concepts, skills
- **Concept graphs**: Relationships between concepts in the ontology (IS-A, PART-OF, RELATED-TO)

**Note**: Concept graphs are part of the ontology - they define **what concepts exist** and **how they relate** at the schema level.

### 4. Knowledge Graphs

**Triples expressed in terms of the ontology**, enabling graph traversal of actual **content**:

- **Content triples**: `lesson:pythagoras` → `teaches` → `concept:right-triangle`
- **Relationship triples**: `unit:trigonometry` → `requires-prerequisite` → `unit:pythagoras`
- **Structural triples**: `lesson:X` → `part-of` → `unit:Y` → `part-of` → `sequence:Z`

**Key distinction**:

| Aspect        | Concept Graphs (Ontology)          | Knowledge Graphs (Content)                  |
| ------------- | ---------------------------------- | ------------------------------------------- |
| **What**      | Schema/vocabulary of concepts      | Triples about actual resources              |
| **Purpose**   | Define what concepts exist         | Express relationships between content items |
| **Example**   | "Pythagoras is a Geometry concept" | "Lesson X teaches Pythagoras to Year 10"    |
| **Changes**   | Rarely (curated vocabulary)        | Often (as content is added/updated)         |
| **Traversal** | Navigate concept relationships     | Navigate content relationships              |

### 5. Moderation API (Input Quality)

Checks **user input** before processing:

- **Safety**: Inappropriate content, harmful requests
- **Relevance**: Is this an education-related query?
- **Scope**: Is this within our curriculum coverage?
- **Intent**: What is the user trying to accomplish?

### 6. Pedagogical Quality API (Output Quality)

Validates **AI-generated output** before returning to users:

- **Accuracy**: Is the content factually correct?
- **Appropriateness**: Is it suitable for the age/level?
- **Alignment**: Does it align with curriculum objectives?
- **Pedagogy**: Is it educationally sound?

**Prior art**: This builds on work done for [Aila](https://labs.thenational.academy/), Oak's AI-powered lesson assistant, which "draws on our extensive library of national curriculum-aligned resources, designed and tested by teachers and subject experts" to ensure "high-quality results made for UK pupils and classrooms."

### 7. Atomic Concepts (Proposed)

A universal vocabulary for curriculum representation. **Atomic Concepts** are the fundamental, irreducible building blocks of educational knowledge. They are:

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

## How MCP Ties Everything Together

### MCP as the Discovery Layer

**Problem**: We have multiple powerful systems (search, graphs, ontologies), but how does an AI agent discover and use them?

**Solution**: MCP provides a standardized protocol for:

- **Discovering capabilities**: What tools and resources are available?
- **Accessing data**: Structured access to curriculum resources
- **Composing operations**: Chain tools together for complex workflows
- **Contextual reasoning**: AI agents understand what each capability does

### MCP Makes Systems Discoverable

#### 1. Search via MCP Tools

```typescript
// MCP Tool: hybrid-search
{
  name: "search-curriculum",
  description: "Search curriculum using hybrid approach (BM25 + ELSER + dense vectors)",
  inputSchema: {
    query: "string",
    subject: "string?",
    keyStage: "string?",
    filters: "object?",
  }
}
```text

**What MCP enables**:

- AI agent discovers search capability automatically
- Can compose search with other tools (e.g., search → analyze → summarize)
- Search parameters are self-documenting via schema

#### 2. Ontologies via MCP Resources

```typescript
// MCP Resource: curriculum ontology
{
  uri: "ontology://curriculum/subjects",
  name: "Curriculum Subjects Ontology",
  description: "Hierarchical structure of subjects and their relationships",
  mimeType: "application/json+ld"
}
```text

**What MCP enables**:

- Ontologies become queryable resources
- AI agents can reason about structure before querying
- Version control and updates are transparent

#### 3. Knowledge Graphs via MCP Tools & Resources

```typescript
// MCP Tool: graph traversal
{
  name: "find-prerequisites",
  description: "Traverse knowledge graph to find prerequisite learning",
  inputSchema: {
    resourceId: "string",
    depth: "number?",
    relationTypes: "string[]?"
  }
}

// MCP Resource: knowledge graph
{
  uri: "graph://curriculum/prerequisites",
  name: "Curriculum Prerequisite Graph",
  description: "Graph of learning dependencies",
  mimeType: "application/vnd.graph+json"
}
```text

**What MCP enables**:

- Graph traversal becomes a composable operation
- AI agents can reason about relationships
- Multiple graph views (prerequisites, concepts, sequences) are discoverable

#### 4. Atomic Concepts via MCP

```typescript
// MCP Tool: atomic concept mapping
{
  name: "map-to-atomic-concepts",
  description: "Decompose curriculum resource into atomic concept representation",
  inputSchema: {
    resourceId: "string",
    includeWeights: "boolean?"
  }
}

// MCP Resource: atomic ontology
{
  uri: "atomic-concept://ontology",
  name: "Atomic Concepts Ontology",
  description: "Complete set of atomic educational concepts",
  mimeType: "application/json+ld"
}

// MCP Tool: atomic search
{
  name: "find-by-atomic-pattern",
  description: "Search resources matching atomic concept pattern",
  inputSchema: {
    pattern: "object", // { concept: weight }
    minMatch: "number?"
  }
}
```text

**What MCP enables**:

- Atomic concepts become a queryable abstraction layer
- AI agents can reason at the atomic concept level
- Cross-curriculum translation via shared atomic vocabulary

### MCP Enables Composition

**Example Workflow: Cross-Curriculum Discovery**

```typescript
// Agent workflow enabled by MCP:

1. Agent receives query: "Find equivalent of UK KS4 Pythagoras lesson for Indian CBSE"

2. Agent discovers available tools:
   - search-curriculum
   - map-to-atomic-concepts
   - find-by-atomic-pattern
   - translate-curriculum-system

3. Agent composes workflow:
   a. Search for "Pythagoras" in UK curriculum
      → Tool: search-curriculum(query="Pythagoras", system="uk")

   b. Map result to atomic concepts
      → Tool: map-to-atomic-concepts(resourceId=<found-lesson>)
      → Returns: [SPATIAL_RELATIONSHIP:0.9, APPLY:0.8, PATTERN:0.6]

   c. Search Indian curriculum by atomic pattern
      → Tool: find-by-atomic-pattern(
          pattern={SPATIAL_RELATIONSHIP:0.9, APPLY:0.8},
          system="cbse"
        )

   d. Return equivalent resources with explanation

4. All of this is possible because MCP made each capability:
   - Discoverable (agent found the tools)
   - Composable (agent chained them)
   - Self-documenting (agent understood parameters)
```text

### MCP Enables Contextual Reasoning

**Without MCP**: Separate APIs, manual integration, hardcoded workflows

```typescript
// Hardcoded, brittle approach:
async function findPrerequisites(lessonId: string) {
  // Direct API calls - no discovery, no composition
  const elasticResult = await elasticSearch({ id: lessonId });
  const graphResult = await neo4jQuery(`MATCH ...`);
  const ontologyResult = await axios.get(`ontology-api/...`);
  // Manually integrate results
  return mergeResults(elasticResult, graphResult, ontologyResult);
}
```

**With MCP**: AI agent discovers, composes, adapts

```typescript
// MCP-enabled, adaptive approach:
// Agent discovers what's available and composes dynamically
const tools = await mcp.listTools();
const searchTool = tools.find((t) => t.name === 'search-curriculum');
const graphTool = tools.find((t) => t.name === 'find-prerequisites');

// Agent adapts workflow based on available tools
if (graphTool) {
  // Use graph for precise prerequisite traversal
  result = await mcp.callTool(graphTool, { resourceId, depth: 2 });
} else {
  // Fallback to search-based prerequisite discovery
  result = await mcp.callTool(searchTool, {
    query: 'prerequisites for ' + resourceId,
  });
}
```

### MCP Makes Everything Queryable

| System          | Without MCP                      | With MCP                                       |
| --------------- | -------------------------------- | ---------------------------------------------- |
| Hybrid Search   | Direct Elasticsearch API         | `search-curriculum` tool, self-documenting     |
| Ontology        | Static files or custom API       | `ontology://{path}` resources, versioned       |
| Knowledge Graph | Neo4j queries, manual traversal  | `find-prerequisites` tool, composable          |
| Atomic Concepts | Custom logic, hardcoded mappings | `map-to-atomic-concepts` tool, discoverable    |
| Composition     | Manual orchestration in code     | Agent discovers and chains tools automatically |
| Cross-System    | Point-to-point integrations      | Shared protocol, any agent can use any system  |

### The Power of MCP: An Example

**Scenario**: Teacher asks AI agent: "What should students know before learning trigonometry in Year 10?"

**MCP-Enabled Workflow**:

1. **Discovery**: Agent discovers available capabilities
   - Hybrid search for "trigonometry Year 10"
   - Knowledge graph for prerequisite traversal
   - Ontology for Year 10 scope
   - Atomic concepts for universal representation

2. **Retrieval**: Agent uses hybrid search
   - Tool: `search-curriculum(query="trigonometry", keyStage="ks4", year="10")`
   - Gets lessons with full context

3. **Graph Traversal**: Agent explores prerequisites
   - Tool: `find-prerequisites(resourceId=<trig-lesson>, depth=2)`
   - Knowledge graph returns: right-angled triangles, Pythagoras, ratios

4. **Ontology Check**: Agent validates scope
   - Resource: `ontology://curriculum/ks4/year-10`
   - Confirms prerequisites are in scope

5. **Atomic Translation**: Agent explains in universal terms
   - Tool: `map-to-atomic-concepts(resourceId=<prerequisite>)`
   - Translates to: [SPATIAL_RELATIONSHIP, RECALL, APPLY]

6. **Synthesis**: Agent composes natural language answer
   - "Students should know: [prerequisite list]"
   - "These concepts involve: [atomic concepts]"
   - "Here are relevant lessons: [links]"

**None of this requires hardcoding**. The agent discovered capabilities, composed tools, and adapted to what was available - all through MCP.

---

## Research Questions

### MCP as Integration Layer

1. **What capabilities should be exposed via MCP?**
   - Which aspects of search, graphs, ontologies are tool-worthy?
   - What should be tools vs resources vs prompts?
   - How granular should tool operations be?

2. **How does MCP enable composition?**
   - What workflows become possible when systems are composable?
   - Can AI agents effectively chain our tools?
   - What guardrails are needed?

3. **What does discoverability enable?**
   - How does self-documentation change how agents use our systems?
   - Can agents adapt when capabilities change?
   - What level of schema detail is optimal?

### Hybrid Search & MCP

4. **How should search be exposed as MCP tools?**
   - Single `search` tool with parameters?
   - Separate tools for different search modalities?
   - How to expose search configuration (BM25 vs ELSER vs dense)?

5. **Can MCP enable search composition?**
   - Search → Filter → Rerank workflows
   - Combining searches across different indexes
   - Aggregating results from multiple search strategies

6. **How does MCP make search context-aware?**
   - Using conversation history to refine search
   - Personalizing search based on user context
   - Adapting search strategy based on query type

### Knowledge Graphs & MCP

7. **What graph operations should be MCP tools?**
   - Traversal (find prerequisites, find related)
   - Subgraph extraction (get learning pathway)
   - Graph queries (shortest path, centrality)

8. **How should graph data be exposed as MCP resources?**
   - Entire graph as resource? Too large?
   - Subgraphs on demand?
   - Graph schema as resource for agent reasoning?

9. **Can MCP enable graph-enhanced search?**
   - Search → Expand via graph → Rerank by relevance
   - Using graph structure to improve ranking
   - Multi-hop reasoning in agent workflows

### Ontologies & MCP

10. **How should ontologies be accessible via MCP?**
    - Static resources (full ontology dumps)?
    - Query tools (navigate ontology on demand)?
    - Both?

11. **Can ontologies improve agent reasoning?**
    - Agent queries ontology before searching
    - Validates query against curriculum structure
    - Suggests refinements based on ontology

12. **How do ontologies enable cross-curriculum work?**
    - Mapping between different curriculum systems
    - Finding equivalent concepts across regions
    - Universal vocabulary (atomic concepts) as ontology

### Atomic Concepts & MCP

13. **Can atomic concepts be discovered empirically?**
    - Analyze Oak + international curricula
    - Extract recurring primitives via NLP/ML
    - Validate orthogonality and completeness

14. **How should atomic concepts be exposed via MCP?**
    - Resource: `atomic-concept://ontology` (full vocabulary)
    - Tool: `map-to-atomic-concepts` (decompose resources)
    - Tool: `find-by-atomic-pattern` (search by atomic signature)

15. **Does atomic concept reasoning work via MCP?**
    - Can agents use atomic concepts to find equivalents?
    - Does cross-curriculum translation work?
    - Can agents explain concepts using atomic vocabulary?

### Quality Gates & MCP

16. **How should Moderation API integrate with MCP?**
    - Pre-tool middleware? Explicit tool?
    - What metadata does moderation produce?
    - How do agents know a query was moderated?

17. **How should Pedagogical Quality API integrate with MCP?**
    - Post-tool validation? Separate tool?
    - What happens when output fails validation?
    - How do we surface quality signals to agents?

18. **Can MCP enable quality-aware workflows?**
    - Agents that check moderation before searching
    - Agents that validate output before returning
    - Quality signals as part of tool responses

### Integration & Composition

19. **What workflows does MCP enable that weren't possible before?**
    - Search + Graph + Ontology composition
    - Cross-system curriculum translation
    - Adaptive learning pathway generation
    - Quality-gated content generation

20. **How does MCP make our systems more useful?**
    - Compared to direct API access
    - Compared to hardcoded integrations
    - Measured by: agent success rate, user satisfaction, output quality

21. **Can MCP enable a curriculum reasoning platform?**
    - Agents that understand curriculum structure
    - Tools that compose for complex tasks
    - Resources that provide rich context
    - Quality gates that ensure trustworthy output

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

```text
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

```text
Hybrid Search with Atomic Concepts
├── BM25: Lexical match on atomic concept names
├── ELSER: Semantic match on atomic concept descriptions
├── Dense Vectors: Similarity in atomic concept space
├── Graph: Traversal of atomic concept relationships
└── RRF: Fuse all signals with rank fusion
```

### MCP Layer

```text
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

## Exploration Focus

### For AI Agent

When exploring "how MCP ties everything together", please:

1. **Search the codebase** for:
   - Existing MCP tool definitions and patterns
   - Current MCP resource exposures
   - Hybrid search implementations that could become tools
   - Knowledge graph code that could be MCP-enabled
   - Ontology/schema definitions suitable for MCP resources

2. **Analyze MCP integration opportunities**:
   - Which search functions should be MCP tools?
   - How should hybrid search configuration be exposed?
   - What graph operations are tool-worthy?
   - How should ontologies be accessible as resources?
   - Where does atomic concept reasoning fit in MCP?

3. **Identify MCP composition patterns**:
   - What tool chains are useful? (e.g., search → graph → rank)
   - How can tools share context?
   - What resources enable better tool usage?
   - How do prompts guide multi-tool workflows?

4. **Propose specific MCP integrations**:
   - Tool signatures for key operations
   - Resource URIs and schemas for curriculum data
   - Prompt templates for guided workflows
   - Example agent workflows that compose tools

5. **Consider practical architecture**:
   - How to expose existing capabilities via MCP without major refactoring
   - What's the right granularity for tools?
   - How to version MCP interfaces as capabilities evolve
   - What documentation helps agents use tools effectively?

### Key Questions to Answer

1. **What makes MCP different from REST APIs?**
   - Discovery vs hardcoded endpoints
   - Composition vs point-to-point calls
   - Self-documentation vs external docs
   - Agent-friendly vs human-friendly

2. **How does MCP enable our vision?**
   - Universal curriculum access
   - Cross-system discovery
   - AI-powered curriculum reasoning
   - Composable education tools

3. **What's the right MCP surface area?**
   - Too few tools: Agents can't do much
   - Too many tools: Overwhelming, hard to discover
   - Too coarse: Inflexible
   - Too fine: Too many calls, slow

4. **How do we validate MCP design?**
   - Can real agents solve real tasks?
   - Are tools discoverable and understandable?
   - Do compositions work as expected?
   - Is performance acceptable?

### For Human

Refine the atomic concept framework by:

1. Reviewing academic literature on learning progressions
2. Consulting with curriculum experts from multiple countries
3. Analyzing existing curriculum alignment tools
4. Testing the hypothesis with a small pilot study

---

## References

- `.agent/plans/semantic-search/README.md` - Current semantic-search navigation, active plans, and roadmap entry points
- `.agent/research/elasticsearch/curriculum-schema-field-analysis.md` - Available API fields
- ADR-072: Three-Way Hybrid Search Architecture
- ADR-077: Graph API for Curriculum Relationships (future)

---

## Summary: MCP as Quality Gateway

### The Mission

**Teachers are already using AI.** Our job isn't to stop them or replace their tools - it's to ensure they have access to **quality foundations, structured curriculum data, and validation** wherever they choose to work.

### What We're Building

A system that provides **quality and rigor** for AI-assisted teaching:

1. **Quality foundations**: Expert-curated curriculum content as input
2. **Structured access**: Multiple ways to find and traverse curriculum (lexical, semantic, conceptual, graph)
3. **Input moderation**: Check that queries are safe and appropriate
4. **Output validation**: Verify that AI-generated content is pedagogically sound

### How MCP Makes This Possible

**MCP is the integration layer** that makes our quality systems available to any AI assistant:

| What Teachers Do                | What We Provide                                |
| ------------------------------- | ---------------------------------------------- |
| Use ChatGPT to draft lessons    | Curriculum content to ground their prompts     |
| Ask Claude for activity ideas   | Knowledge graph to validate suggestions        |
| Generate worksheets with any AI | Quality API to check the output                |
| Create quizzes                  | Pedagogical validation for age-appropriateness |

**The key insight**:

> MCP isn't just an API protocol. It's **quality infrastructure for educational AI** - ensuring that wherever teachers use AI, they have access to rigor, accuracy, and pedagogical soundness.

### This Exploration Asks

- How do we expose our systems (search, graphs, ontologies, quality APIs) through MCP?
- How do we support teachers who use ANY AI tool, not just ours?
- What MCP patterns best serve "quality as a service" use cases?
- How do we enable creativity (remix, riff, transform) while maintaining rigor?
- How do we become the **quality layer** for educational AI, regardless of which AI is used?

---

**This is a research and exploration prompt. The goal is to understand how MCP ties our systems together, not to immediately implement everything.**

**Start by**:

1. Searching the codebase for existing MCP patterns
2. Identifying capabilities that should be MCP-enabled
3. Proposing tool/resource designs
4. Imagining agent workflows that compose our tools
5. Validating that MCP adds value beyond traditional approaches

---

**End of Prompt**
