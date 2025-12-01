# Knowledge Graph Tool Research

This document analyses the existing agent support tool patterns and evaluates how a `get-knowledge-graph` tool should be designed to complement the existing `get-ontology` tool.

**Research Date**: December 2025  
**Status**: Analysis complete, ready for design phase

---

## 1. Executive Summary

The knowledge graph and ontology serve **complementary purposes**:

| Aspect       | get-ontology                               | get-knowledge-graph (proposed)                          |
| ------------ | ------------------------------------------ | ------------------------------------------------------- |
| **Purpose**  | Domain understanding & guidance            | Structural relationships & API mapping                  |
| **Content**  | What things mean, how to use tools         | How things connect, what returns what                   |
| **Use case** | "What is a Thread? How do I find lessons?" | "Which endpoints return Unit data? What schemas exist?" |
| **Payload**  | ~15KB (490 lines)                          | ~40KB (1321 lines) - needs optimisation                 |

Both are agent support tools that help AI agents understand the Oak Curriculum system before making API calls.

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

### 2.3 Output Format Pattern

Agent support tools use `formatOptimizedResult()` which provides:

- **`content`**: Human-readable summary for conversation display
- **`structuredContent`**: Minimal data for model reasoning (token-optimised)
- **`_meta.fullResults`**: Complete data for widgets (hidden from model context)

This pattern is critical for large payloads like the knowledge graph.

### 2.4 Cross-Tool References

Tools reference each other through several mechanisms:

1. **PREREQUISITE_GUIDANCE constants** in `prerequisite-guidance.ts`
2. **Generated tool descriptions** append ontology reference
3. **CONTEXT_GUIDANCE** in tool responses: "If you have not already, use the get-help and get-ontology tools..."
4. **Documentation resources** reference tools by name
5. **Prompts** guide agents to use specific tools in workflows

---

## 3. Comparative Analysis: Ontology vs Knowledge Graph

### 3.1 Content Structure Comparison

**Ontology Data** (`ontology-data.ts`):

```
├── version, generatedAt, notice
├── officialDocs (external URL)
├── curriculumStructure
│   ├── keyStages[] (slug, name, ageRange, years, phase, description)
│   ├── phases[] (slug, name, keyStages, years)
│   └── subjects[] (slug, name, keyStages, hasExamSubjects?)
├── threads (definition, importance, characteristics, examples, toolUsage)
├── programmesVsSequences (sequence vs programme distinction)
├── ks4Complexity (programmeFactors: tier, examBoard, examSubject, pathway)
├── entityHierarchy (Subject → Sequence → Unit → Lesson)
├── unitTypes (simple, variant, optionality)
├── lessonComponents (8 components with tool mappings)
├── contentGuidance (categories, supervisionLevels)
├── toolUsageGuidance (workflows: discovery, browsing, progression, lessonPlanning)
├── idFormats (prefixed IDs for fetch tool)
├── ukEducationContext (notes, yearToAge mapping)
├── canonicalUrls (URL patterns for Oak website)
└── synonyms (alternative terms → canonical slugs)
```

**Knowledge Graph** (`kg-graph.ts`):

```
├── nodes[] (89 nodes)
│   ├── Concept (28) - domain entities
│   ├── Endpoint (27) - API paths
│   ├── Schema (24) - response schemas
│   ├── ExternalLink (5) - documentation URLs
│   └── SourceDoc (5) - research materials
└── edges[] (118 edges)
    ├── Concept → Concept (domain relationships)
    ├── Concept → Endpoint (entity → API mapping)
    ├── Endpoint → Schema (API → response mapping)
    ├── Schema → Concept (response → entity mapping)
    └── inferred relationships (marked with flag)
```

### 3.2 Complementary Value Analysis

| Question                                      | Ontology answers                            | Knowledge Graph answers    |
| --------------------------------------------- | ------------------------------------------- | -------------------------- |
| What is a Thread?                             | ✅ Rich definition, examples, importance    | Terse description only     |
| How do I find lessons?                        | ✅ discoveryWorkflow with steps             | No workflow guidance       |
| What endpoints return Unit data?              | Partial (entity hierarchy mentions tools)   | ✅ Explicit edges          |
| What schema does GET /subjects return?        | ❌                                          | ✅ Explicit edges          |
| How are subjects related to key stages?       | ✅ curriculumStructure.subjects[].keyStages | ✅ Subject → KeyStage edge |
| What's the tier/pathway/examBoard complexity? | ✅ Detailed ks4Complexity section           | Concept nodes only         |
| How should I interpret slugs?                 | ✅ idFormats section                        | ❌                         |
| What synonyms map to "maths"?                 | ✅ synonyms section                         | ❌                         |

### 3.3 Overlap and Potential for Unification

Areas of overlap:

- Both describe curriculum entities (Subject, Unit, Lesson, etc.)
- Both reference the entity hierarchy
- Both mention key stages, phases, threads

The knowledge graph adds:

- Explicit API endpoint mappings
- Schema relationship information
- Graph-traversable structure
- Inferred relationship flags

Potential for complementary-by-construction:

- Ontology focuses on **meaning, guidance, and usage**
- Knowledge Graph focuses on **structure, relationships, and API mappings**
- Some concepts in the knowledge graph could be enriched with ontology content

---

## 4. Design Considerations

### 4.1 Payload Size Optimisation

The current knowledge graph is ~40KB (1321 lines). Options:

**Option A: Return full graph (like ontology)**

- Pros: Simple, complete
- Cons: Large context window impact (~10K tokens)

**Option B: Return graph segments on demand**

- Add `segment` parameter: `concepts`, `endpoints`, `schemas`, `relationships`
- Pros: Targeted, smaller payloads
- Cons: More complex, multiple calls needed

**Option C: Use optimised format with `_meta.fullResults`**

- Return summary + preview in `structuredContent`
- Full graph in `_meta` for widgets
- Pros: Token-optimised for model, complete for widgets
- Cons: Model doesn't see full graph (may need to call again)

**Option D: Structural optimisation of the graph itself**

- Remove SourceDoc nodes (research artifacts)
- Condense edge descriptions
- Use shorter IDs
- Target: ~20KB

**Recommendation**: Combine Options C and D. Optimise the graph structure AND use the `formatOptimizedResult` pattern.

### 4.2 Graph Structure Refinements

Current structure could be improved:

1. **Remove SourceDoc nodes** - These are research provenance, not useful for agents
2. **Simplify edge labels** - Many are verbose ("listed by endpoint" → "listedBy")
3. **Add node categories** - Group related concepts (Structure, Content, Assessment, etc.)
4. **Add edge weights/importance** - Help agents prioritise traversals
5. **Consider separate edge lists** - `conceptEdges`, `apiEdges`, `schemaEdges` for easier filtering

### 4.3 Type Safety Considerations

Current `kg-graph.ts` loses literal types:

```typescript
// Current - loses literal types
export const kgGraph: KnowledgeGraph = { ... };

// Better - preserves literal types
export const kgGraph = { ... } as const;
export type KnowledgeGraph = typeof kgGraph;
```

This would enable:

- Type-safe node ID references
- Autocomplete for edge traversals
- Compile-time validation of graph queries

### 4.4 Integration Points

The tool must integrate with:

1. **Tool guidance data** - Add to `agentSupport` category
2. **Prerequisite guidance** - Potentially reference from generated tools
3. **Documentation resources** - New docs resource? Or integrate into existing?
4. **Prompts** - May benefit progression-map and similar prompts
5. **Widget renderers** - May need custom renderer for graph visualisation

### 4.5 Widget Rendering

The OpenAI Apps SDK supports custom widgets via `_meta['openai/outputTemplate']`. Options:

- **JSON viewer** (like ontology): `ui://widget/oak-json-viewer.html`
- **Graph viewer** (custom): Would need new widget component
- **Tree viewer** (hybrid): Render as expandable tree structure

---

## 5. Relationship to Schema-First Principle

### 5.1 Current State

Neither ontology nor knowledge graph are generated from the OpenAPI schema:

| Artifact           | Source                 | Notes                                                                       |
| ------------------ | ---------------------- | --------------------------------------------------------------------------- |
| `ontology-data.ts` | Hand-authored POC      | Note: "See 02-curriculum-ontology-resource-plan.md for full implementation" |
| `kg-graph.ts`      | LLM-generated research | Claims "auto-generated" but no pipeline exists                              |

### 5.2 Future State Possibilities

**What could be generated from OpenAPI:**

- Endpoint nodes and their paths/methods
- Schema nodes and their names
- Endpoint → Schema edges (from response types)
- Schema field → Concept edges (from schema properties)

**What requires authored enrichment:**

- Concept descriptions and semantics
- Concept-to-Concept relationships (domain knowledge)
- Inferred relationships
- Workflow guidance (in ontology)
- Synonyms and UK education context (in ontology)

### 5.3 Compliance Path

Per user guidance, the knowledge graph falls into "additional metadata" category that can be added at type-gen time. A compliant approach:

1. Generate API structure (endpoints, schemas) from OpenAPI
2. Merge with authored concept definitions and relationships
3. Output combined graph at `pnpm type-gen` time
4. Result: Schema changes automatically update API structure, enrichments remain stable

---

## 6. Recommendations

### 6.1 Immediate Actions (POC Phase)

1. **Create `get-knowledge-graph` as aggregated tool**
   - Follow existing pattern from `get-ontology`
   - Use `formatOptimizedResult` for token optimisation
   - Add to `agentSupport` category

2. **Optimise graph payload**
   - Remove SourceDoc nodes
   - Shorten edge labels
   - Target ~20KB

3. **Move data file to SDK**
   - From: `.agent/research/open-curriculum-knowledge-graph/kg-graph.ts`
   - To: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

4. **Update type declarations**
   - Add to `AggregatedToolName` union type
   - Add to `agentSupport` category tools

### 6.2 Integration Tasks

1. **Update prerequisite guidance** - Consider adding knowledge graph reference
2. **Update documentation resources** - Add graph documentation
3. **Update tool guidance data** - Include knowledge graph in tips
4. **Consider widget renderer** - May warrant graph-specific visualisation

### 6.3 Future Considerations

1. **Schema-derived generation** - Extract API structure from OpenAPI
2. **Complementary-by-construction** - Ensure ontology and graph don't duplicate information
3. **Queryable graph** - Consider parameters for targeted subgraph retrieval
4. **Graph analytics** - Use graph structure for intelligent tool recommendations

---

## 7. Files to Create/Modify

### New Files

| File                                                                                       | Purpose                       |
| ------------------------------------------------------------------------------------------ | ----------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`                         | Graph data (optimised)        |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`                   | Tool definition and execution |
| `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/knowledge-graph-renderer.ts` | Widget (optional)             |

### Files to Modify

| File                                                                      | Change                          |
| ------------------------------------------------------------------------- | ------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`         | Add to AggregatedToolName       |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`          | Add to agentSupport tools, tips |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add to AGGREGATED_TOOL_DEFS     |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`    | Add execution dispatch          |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/type-guards.ts` | Update type guards              |
| `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`       | Consider adding KG reference    |

---

## 8. Open Questions

1. **Should generated tool descriptions reference both ontology AND knowledge graph?**
   - Current: Only references ontology
   - Consider: Add optional reference to knowledge graph for structural queries?

2. **Should there be a combined "get-context" tool?**
   - Merges ontology + graph into single response
   - Pros: Single call for complete understanding
   - Cons: Very large payload, harder to maintain

3. **How should the graph relate to MCP Resources?**
   - Could expose as a resource (`graph://oak/knowledge-graph.json`)
   - Allows clients to cache and reference without tool calls

4. **What level of type safety is needed?**
   - Current graph: Dynamic string IDs
   - Ideal: Literal types for compile-time safety
   - Trade-off: Verbosity vs safety

---

## Appendix A: Current Tool Response Example

```typescript
// get-ontology response via formatOptimizedResult
{
  content: [{
    type: 'text',
    text: 'Oak Curriculum domain model loaded. Includes key stages, subjects, entity hierarchy, and tool guidance.'
  }],
  structuredContent: {
    summary: 'Oak Curriculum domain model loaded...',
    status: 'success'
  },
  _meta: {
    fullResults: { /* complete ontologyData */ },
    context: 'If you have not already, use the get-help and get-ontology tools...',
    toolName: 'get-ontology',
    'annotations/title': 'Get Curriculum Ontology',
    timestamp: 1701234567890
  }
}
```

---

## Appendix B: Graph Size Analysis

Current `kg-graph.ts`:

- Nodes: 89
- Edges: 118
- File size: ~40KB
- Estimated tokens: ~10,000

After proposed optimisation:

- Nodes: ~80 (remove SourceDocs)
- Edges: ~115
- Target file size: ~20KB
- Estimated tokens: ~5,000

---

## Appendix C: References

- `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts` - Existing ontology implementation
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts` - Tool definition pattern
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` - Output formatting
- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts` - Category definitions
- `.agent/directives-and-memory/schema-first-execution.md` - Schema-first principles
- `.agent/directives-and-memory/rules.md` - Project rules
