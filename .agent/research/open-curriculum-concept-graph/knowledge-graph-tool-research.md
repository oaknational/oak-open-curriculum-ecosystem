# Knowledge Graph Tool Research

> **STATUS: AUTHORITATIVE V1 DESIGN DOCUMENT**
>
> This document analyses agent support tool patterns and provides the design
> foundation for the `get-knowledge-graph` tool. For comprehensive synthesis
> of all findings, see `knowledge-graph-analysis-synthesis.md`.

This document analyses the existing agent support tool patterns and evaluates how a `get-knowledge-graph` tool should be designed to complement the existing `get-ontology` tool.

**Research Date**: December 2025  
**Status**: Analysis complete, ready for implementation  
**Last Updated**: December 2025 (corrected emphasis and OpenAI SDK understanding)

---

## 1. Executive Summary

The knowledge graph and ontology serve **complementary purposes**:

| Aspect       | get-ontology                               | get-knowledge-graph (proposed)                         |
| ------------ | ------------------------------------------ | ------------------------------------------------------ |
| **Purpose**  | Domain understanding & guidance            | Concept relationships & implicit domain knowledge      |
| **Content**  | What things mean, how to use tools         | How concepts connect, inferred relationships           |
| **Use case** | "What is a Thread? How do I find lessons?" | "How do concepts relate? What's the progression path?" |
| **Payload**  | ~15KB (426 lines)                          | Target ~8KB (concept-focused, no API plumbing)         |

**Key distinction**: The knowledge graph is about **domain relationships between curriculum concepts**, NOT about API endpoint mappings. Agents already know about endpoints from `tools/list`. The graph captures implicit knowledge that helps agents reason about the curriculum domain.

Both are agent support tools that help AI agents understand the Oak Curriculum system before making API calls.

### Terminology: Schema-Level Knowledge Graph

Formally, a knowledge graph contains both schema (types) and instances (actual entities). What we're building is the **Oak Curriculum Knowledge Graph (schema-level)** — it captures the **structure and form** of how concept types relate, but not the substance (specific lessons, units).

| Formal Term      | Our Artifact         | Contains                             |
| ---------------- | -------------------- | ------------------------------------ |
| TBox (schema)    | Knowledge Graph      | Concept types + type relationships   |
| ABox (instances) | Ontology (partially) | Enumerated values (ks1, maths, etc.) |
| Guidance         | Ontology             | Workflows, definitions, tips         |

This is still correctly called a "knowledge graph" because it captures domain knowledge in graph form, and industry usage includes schema-level representations.

---

## 2. Current Architecture Analysis

### 2.1 Agent Support Tool Category

The SDK defines an explicit `agentSupport` category in `tool-guidance-data.ts`:

```typescript
agentSupport: {
  tools: ['get-help', 'get-ontology'],
  description: 'Tools for understanding Oak Curriculum system and how to use the tools.',
  whenToUse: 'At conversation start, when user asks to "understand Oak", or to get context.',
  isAgentSupport: true,
}
```

A `get-knowledge-graph` tool would naturally join this category.

### 2.2 Aggregated Tool Pattern

Agent support tools follow the **aggregated tool pattern** (hand-authored, not generated from OpenAPI):

1. **Definition file** (`aggregated-{tool}.ts` or `aggregated-{tool}/definition.ts`)
   - Input schema (JSON Schema format)
   - Tool definition with description, annotations, \_meta fields
   - MCP annotations (readOnlyHint, idempotentHint, etc.)
   - OpenAI Apps SDK metadata (widget template, invocation status)

2. **Execution file** (`aggregated-{tool}.ts` or `aggregated-{tool}/execution.ts`)
   - Validation function
   - Run function returning `CallToolResult`

3. **Registration** in `universal-tools/definitions.ts`:

   ```typescript
   export const AGGREGATED_TOOL_DEFS = {
     search: { ... },
     fetch: { ... },
     'get-ontology': GET_ONTOLOGY_TOOL_DEF,
     'get-help': GET_HELP_TOOL_DEF,
   } as const;
   ```

4. **Type definition** in `tool-guidance-types.ts`:

   ```typescript
   export type AggregatedToolName = 'search' | 'fetch' | 'get-ontology' | 'get-help';
   ```

5. **Execution dispatch** in `universal-tools/executor.ts`:
   ```typescript
   if (name === 'get-ontology') {
     return runOntologyTool();
   }
   ```

### 2.3 Output Format Pattern (OpenAI Apps SDK)

Per the OpenAI Apps SDK documentation, tool results have three sibling payloads with **distinct audiences**:

| Field               | Audience             | Purpose                                              |
| ------------------- | -------------------- | ---------------------------------------------------- |
| `structuredContent` | **Model AND widget** | "concise JSON the widget uses _and_ the model reads" |
| `content`           | **Model**            | "optional narration (Markdown or plaintext)"         |
| `_meta`             | **Widget ONLY**      | "large or sensitive data exclusively for the widget" |

**Critical insight**: `structuredContent` is what the **model reasons about**. If we want agents to understand concept relationships, that information must be in `structuredContent`, NOT hidden in `_meta`.

Current agent support tools use `formatOptimizedResult()` which implements this pattern. For the knowledge graph:

- **`content`**: Brief summary ("Curriculum concept relationships loaded")
- **`structuredContent`**: The concept graph data that agents need to reason about
- **`_meta`**: Any widget-specific rendering hints (NOT the graph data itself)

### 2.4 Cross-Tool References

Tools reference each other through several mechanisms:

1. **PREREQUISITE_GUIDANCE constants** in `prerequisite-guidance.ts`
2. **Generated tool descriptions** append ontology reference
3. **CONTEXT_GUIDANCE** in tool responses: "If you have not already, use the get-help and get-ontology tools..."
4. **Documentation resources** reference tools by name
5. **Prompts** guide agents to use specific tools in workflows

---

## 3. Comparative Analysis: Ontology vs Knowledge Graph

### 3.1 What Each Artifact Should Contain

**Ontology** (prose-oriented, rich definitions):

- What things **mean** (definitions, examples, context)
- How to **use tools** (workflows, ID formats, tips)
- Domain **context** (UK education system, synonyms)
- **Enumerated values** (key stages, subjects, phases)

**Knowledge Graph** (structure-oriented, relationships):

- How concepts **relate** to each other
- **Inferred relationships** not explicit in prose
- **Progression paths** through the curriculum
- **Dependency chains** (what builds on what)

### 3.2 Current Problem: API-Heavy Graph

The current `kg-graph.ts` is heavily focused on API implementation details:

```
├── nodes[] (89 nodes)
│   ├── Concept (28) - ✅ domain entities (KEEP)
│   ├── Endpoint (27) - ❌ API paths (REMOVE - agents see tools/list)
│   ├── Schema (24) - ❌ response schemas (REMOVE - implementation detail)
│   ├── ExternalLink (5) - ⚠️ maybe keep for documentation links
│   └── SourceDoc (5) - ❌ research artifacts (REMOVE)
└── edges[] (118 edges)
    ├── Concept → Concept - ✅ domain relationships (KEEP)
    ├── Concept → Endpoint - ❌ API mapping (REMOVE)
    ├── Endpoint → Schema - ❌ API mapping (REMOVE)
    ├── Schema → Concept - ❌ API mapping (REMOVE)
```

**Why remove API mappings?** Agents already receive endpoint information from `tools/list`. Duplicating it in the graph adds tokens without value.

### 3.3 What the Knowledge Graph Should Capture

**Valuable concept-to-concept relationships:**

| Relationship                           | Value for Agents                   |
| -------------------------------------- | ---------------------------------- |
| `Subject → Sequence → Unit → Lesson`   | Core hierarchy navigation          |
| `Thread → Unit` (across years)         | Vertical progression understanding |
| `Programme → ExamBoard/Tier/Pathway`   | KS4 complexity (inferred)          |
| `Lesson → Quiz → Question → Answer`    | Assessment structure               |
| `Unit → Category`                      | Subject-specific groupings         |
| `EducationalMetadata → PriorKnowledge` | Pedagogical connections            |
| `ContentGuidance → SupervisionLevel`   | Safety relationships               |

**Inferred/implicit relationships worth capturing:**

- `Unit → Subject` (inferred from placement)
- `Unit → KeyStage` (inferred from year)
- `Programme → Unit` (derived view, not API entity)
- `Sequence → ExamSubject` (KS4 branching)

### 3.4 Complementary Value Analysis (Revised)

| Question                                      | Ontology answers                            | Knowledge Graph answers              |
| --------------------------------------------- | ------------------------------------------- | ------------------------------------ |
| What is a Thread?                             | ✅ Rich definition, examples, importance    | Terse label only                     |
| How do I find lessons?                        | ✅ discoveryWorkflow with steps             | ❌ Not its job                       |
| How are subjects related to key stages?       | ✅ curriculumStructure.subjects[].keyStages | ✅ Subject → KeyStage edge           |
| What's the tier/pathway/examBoard complexity? | ✅ Detailed prose explanation               | ✅ Programme → factors edges         |
| How does a thread connect units?              | Partial (characteristics list)              | ✅ Thread → Unit edges with order    |
| What concepts build on Unit?                  | ❌                                          | ✅ Traversable from Unit node        |
| What's the full assessment hierarchy?         | ❌ (components listed but not structured)   | ✅ Lesson → Quiz → Question → Answer |

### 3.5 Complementary by Construction

The ontology and knowledge graph stay complementary because **we author them together**:

| Ontology Owns                       | Knowledge Graph Owns                     |
| ----------------------------------- | ---------------------------------------- |
| Rich definitions with examples      | Concept identifiers with brief labels    |
| Workflow guidance                   | Edge structure (navigable relationships) |
| UK education context                | Inferred relationships (marked)          |
| Synonyms and canonical URLs         | Concept-to-concept edges                 |
| Tool usage patterns                 | Progression paths                        |
| Enumerated values (key stages list) | Structural queries (what connects to X?) |

---

## 4. Design Considerations

### 4.1 Payload Size: Optimize Ontology and Graph Together

Since both artifacts serve the model via `structuredContent`, we must optimize them **together** for token efficiency.

**Current state:**

- Ontology: ~15KB (~4K tokens)
- Graph (as-is): ~40KB (~10K tokens) - **too heavy, wrong focus**

**Target state:**

- Ontology: ~12KB (~3K tokens) - trim any graph-like structure
- Graph: ~8KB (~2K tokens) - concept relationships only

**Optimization principles:**

1. **Ontology owns prose** - definitions, examples, guidance, workflows
2. **Graph owns structure** - edges, relationships, traversable connections
3. **No duplication** - if ontology has `entityHierarchy` prose, graph has edges (not both describing hierarchy)
4. **Both go to model** - no hiding graph in `_meta` (that defeats the purpose)

### 4.2 Concept-Focused Graph Structure

Remove API implementation details, keep domain relationships:

**Remove entirely:**

- Endpoint nodes (agents see `tools/list`)
- Schema nodes (internal API detail)
- SourceDoc nodes (research provenance)
- All `Concept → Endpoint` edges
- All `Endpoint → Schema` edges
- All `Schema → Concept` edges

**Keep and enhance:**

- Concept nodes with brief labels
- Concept-to-concept edges
- Inferred relationship flags
- Edge directionality and semantics

**Proposed minimal structure:**

```typescript
interface ConceptGraph {
  readonly version: string;
  readonly concepts: ReadonlyArray<{
    readonly id: string; // e.g., "subject"
    readonly label: string; // e.g., "Subject"
    readonly brief: string; // One line description
    readonly category?: string; // e.g., "structure", "content", "assessment"
  }>;
  readonly edges: ReadonlyArray<{
    readonly from: string;
    readonly to: string;
    readonly rel: string; // e.g., "contains", "belongsTo", "builds"
    readonly inferred?: true;
  }>;
  readonly seeOntology: string; // Cross-reference
}
```

### 4.3 Type Safety

Use `as const` to preserve literal types:

```typescript
export const conceptGraph = {
  version: '1.0.0',
  concepts: [
    { id: 'subject', label: 'Subject', brief: 'Curriculum subject' },
    // ...
  ],
  edges: [
    { from: 'subject', to: 'sequence', rel: 'hasSequences' },
    // ...
  ],
  seeOntology: 'Call get-ontology for rich definitions and usage guidance',
} as const;

export type ConceptGraph = typeof conceptGraph;
export type ConceptId = ConceptGraph['concepts'][number]['id'];
```

### 4.4 Integration Points

1. **Tool guidance data** - Add `get-knowledge-graph` to `agentSupport` category
2. **Cross-references** - Ontology mentions graph, graph mentions ontology
3. **Widget** - JSON viewer sufficient (no custom graph viz needed initially)
4. **Documentation** - Explain the complementary relationship

### 4.5 Widget Rendering

Since the graph is now concept-focused and smaller:

- **JSON viewer** is sufficient (`ui://widget/oak-json-viewer.html`)
- Widget shows concepts and their relationships in a tree/list
- No need for complex graph visualization initially

---

## 5. Relationship to Schema-First Principle

### 5.1 Current State

Neither ontology nor knowledge graph are generated from the OpenAPI schema:

| Artifact           | Source                 | Notes                                                                       |
| ------------------ | ---------------------- | --------------------------------------------------------------------------- |
| `ontology-data.ts` | Hand-authored POC      | Note: "See 02-curriculum-ontology-resource-plan.md for full implementation" |
| `kg-graph.ts`      | LLM-generated research | Current version has wrong emphasis (API-heavy)                              |

### 5.2 Schema-First Relevance

**What the schema-first principle covers:**

- Types, type guards, Zod schemas for API calls
- Tool definitions generated from OpenAPI operations
- Response validation

**What the knowledge graph is:**

- Domain knowledge about curriculum concept relationships
- Authored enrichment that complements the API
- NOT derived from OpenAPI (concepts like "Thread builds across years" aren't in the schema)

### 5.3 Compliance Path

The knowledge graph is **additional authored metadata** (like the ontology). It complements rather than duplicates the schema:

1. **Ontology and graph are authored together** - we control both
2. **Neither duplicates OpenAPI data** - endpoints come from generated tools, not the graph
3. **Both can be validated** - ensure concept IDs are consistent between them
4. **Can be extended at sdk-codegen time** - if we later want to extract concept names from schemas

The key insight: The graph captures **domain knowledge that ISN'T in the OpenAPI schema**. Relationships like "threads link units across years" or "programmes are derived views of sequences" are curriculum knowledge, not API structure.

---

## 6. Recommendations

### 6.1 Immediate Actions

1. **Redesign the knowledge graph** - Focus on concept relationships, remove API plumbing
   - Remove: Endpoint nodes, Schema nodes, SourceDoc nodes
   - Keep: Concept nodes (28), concept-to-concept edges
   - Add: Clear categorization (structure, content, assessment)
   - Target: ~8KB total

2. **Review ontology for overlap** - Remove structural content that belongs in graph
   - Keep prose definitions, examples, workflows
   - Consider trimming `entityHierarchy` if graph captures the same edges

3. **Create `get-knowledge-graph` tool**
   - Follow existing pattern from `get-ontology`
   - Put graph in `structuredContent` (model needs it!)
   - Add to `agentSupport` category
   - Cross-reference the ontology in description

4. **Move data file to SDK**
   - Create: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`
   - New structure: concepts + edges (no API nodes)

### 6.2 Complementary Design

Author ontology and graph together with clear separation:

| In Ontology                          | In Knowledge Graph                                               |
| ------------------------------------ | ---------------------------------------------------------------- |
| "A Thread is a conceptual strand..." | `{ from: 'thread', to: 'unit', rel: 'linksAcrossYears' }`        |
| "KS4 has tiers: foundation, higher"  | `{ from: 'programme', to: 'tier', rel: 'uses', inferred: true }` |
| `curriculumStructure.keyStages[]`    | `{ from: 'phase', to: 'keystage', rel: 'includes' }`             |

### 6.3 Future Considerations

1. **Queryable graph** - Parameter to focus on specific concept subgraph
2. **Graph validation** - Ensure concept IDs match between ontology and graph
3. **Progressive disclosure** - Start with hierarchy, expand on demand

---

## 7. Files to Create/Modify

### New Files

| File                                                                     | Purpose                              |
| ------------------------------------------------------------------------ | ------------------------------------ |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`       | Concept graph data (concept-focused) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts` | Tool definition and execution        |

### Files to Modify

| File                                                                      | Change                          |
| ------------------------------------------------------------------------- | ------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`         | Add to AggregatedToolName       |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`          | Add to agentSupport tools, tips |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add to AGGREGATED_TOOL_DEFS     |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`    | Add execution dispatch          |
| `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`               | Review for overlap with graph   |

---

## 8. Open Questions

1. **How much overlap is acceptable between ontology and graph?**
   - Current: Both describe entity hierarchy
   - Option A: Ontology has prose, graph has edges (complementary)
   - Option B: Remove hierarchy from one or the other

2. **Should agents call both tools automatically?**
   - Current: `get-help` + `get-ontology` are recommended first steps
   - Consider: Should `get-knowledge-graph` be part of the recommended sequence?
   - Trade-off: More tokens vs better domain understanding

3. **Do we need concept categorization?**
   - Categories like: structure, content, assessment, metadata
   - Would help agents understand concept groupings
   - Adds complexity to the graph

4. **Should the graph support queries?**
   - Parameter to focus on a specific concept and its neighbors
   - Would reduce token usage for targeted exploration
   - Adds complexity to the tool

---

## Appendix A: Proposed Tool Response Example

```typescript
// get-knowledge-graph response
// NOTE: Graph goes in structuredContent because the MODEL needs to reason about it
{
  content: [{
    type: 'text',
    text: 'Curriculum concept relationships loaded. Use with get-ontology for complete understanding.'
  }],
  structuredContent: {
    version: '1.0.0',
    concepts: [
      { id: 'subject', label: 'Subject', brief: 'Curriculum subject' },
      { id: 'sequence', label: 'Sequence', brief: 'Internal API grouping of units' },
      { id: 'unit', label: 'Unit', brief: 'Topic of study with lessons' },
      // ... ~28 concept nodes
    ],
    edges: [
      { from: 'subject', to: 'sequence', rel: 'hasSequences' },
      { from: 'sequence', to: 'unit', rel: 'containsUnits' },
      { from: 'unit', to: 'lesson', rel: 'containsLessons' },
      { from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
      // ... ~40 concept-to-concept edges
    ],
    seeOntology: 'Call get-ontology for rich definitions and usage guidance',
  },
  _meta: {
    // Widget rendering hints only - NOT the graph data
    toolName: 'get-knowledge-graph',
    'annotations/title': 'Get Concept Graph',
    timestamp: Date.now(),
  }
}
```

---

## Appendix B: Graph Size Analysis (Revised)

**Current `kg-graph.ts` (wrong focus):**

- Concept nodes: 28
- Endpoint nodes: 27 ❌
- Schema nodes: 24 ❌
- Other nodes: 10
- Edges: 118 (mostly API mappings)
- File size: ~40KB
- Estimated tokens: ~10,000

**Target concept-focused graph:**

- Concept nodes: ~28
- Concept-to-concept edges: ~40
- File size: ~8KB
- Estimated tokens: ~2,000

**Combined with ontology:**

- Ontology: ~12KB (~3K tokens)
- Graph: ~8KB (~2K tokens)
- Total for full context: ~20KB (~5K tokens)

---

## Appendix C: OpenAI Apps SDK Reference

From the SDK documentation:

> **`structuredContent`** – concise JSON the widget uses _and_ the model reads. Include only what the model should see.
>
> **`content`** – optional narration (Markdown or plaintext) for the model's response.
>
> **`_meta`** – large or sensitive data exclusively for the widget. `_meta` never reaches the model.

**Key insight**: Since `structuredContent` is what the model reasons about, the concept graph must be in `structuredContent`, NOT hidden in `_meta`.

---

## Appendix D: References

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` - Existing ontology implementation
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts` - Tool definition pattern
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` - Output formatting
- `.agent/reference-docs/openai-apps/openai-apps-sdk-build-mcp-server.md` - SDK documentation
- `.agent/directives/rules.md` - Project rules
