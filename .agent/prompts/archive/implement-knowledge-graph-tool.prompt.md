# Prompt: Implement Oak Curriculum Knowledge Graph Tool

## Overview

This prompt guides the implementation of a new agent support tool: `get-knowledge-graph`. This tool complements the existing `get-ontology` tool by providing a schema-level knowledge graph of curriculum concept relationships.

**Before starting any work**, read and re-commit to the foundation documents:

- `.agent/directives/rules.md` — Core rules, First Question, TDD, type safety
- `.agent/directives/schema-first-execution.md` — Schema-first principles
- `.agent/directives/testing-strategy.md` — Testing philosophy and TDD at all levels

---

## Foundation Document Compliance

### First Question (from rules.md)

Before each decision, ask: **"Could it be simpler without compromising quality?"**

### Cardinal Rule (from rules.md)

> If the upstream OpenAPI schema changes, then running `pnpm type-gen` followed by a `pnpm build` MUST be sufficient to bring all workspaces into alignment.

The knowledge graph is **authored domain knowledge** (like the ontology), not generated from OpenAPI. It complements the schema-first approach without violating it.

### TDD (from testing-strategy.md)

All implementation MUST follow TDD:

1. Write test FIRST (RED)
2. Implement to pass (GREEN)
3. Refactor (while tests stay GREEN)

This applies at unit, integration, AND E2E levels.

### Type Safety (from rules.md)

- Use `as const` to preserve literal types
- No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
- Derive types from data structures, don't hand-author

---

## Research Documents to Read

Before implementation, read these research documents thoroughly:

### Core Research (in `.agent/research/open-curriculum-knowledge-graph/`)

1. **`knowledge-graph-tool-research.md`** — Comprehensive analysis of:
   - Agent support tool patterns
   - Output format patterns (OpenAI Apps SDK compliance)
   - Complementary design with ontology
   - Implementation recommendations

2. **`complementary-by-construction.md`** — How ontology and graph complement each other:
   - Clear separation of concerns
   - What belongs in each artifact
   - Shared identifiers for cross-referencing

3. **`optimised-graph-proposal.md`** — Proposed graph structure:
   - Concept-only nodes (no API endpoints/schemas)
   - Target ~8KB / ~2K tokens
   - Type definitions and validation approach

4. **`kg-overview.md`** — Terminology and goals:
   - "Schema-level knowledge graph" definition
   - TBox vs ABox distinction
   - What we're building vs formal knowledge graph

### Current Graph (needs restructuring)

5. **`kg-graph.ts`** and **`kg-graph.md`** — Current implementation (WRONG FOCUS):
   - Contains Endpoint/Schema/SourceDoc nodes (REMOVE)
   - Contains API mapping edges (REMOVE)
   - Keep only Concept nodes and concept-to-concept edges

---

## Reference Documents to Read

### Internal Specifications

- **`.agent/reference-docs/internal/agent-support-tools-specification.md`** — Integration points checklist:
  - SDK: Tool guidance data, ontology data, tool registration
  - SDK: Documentation resources, prompt messages, public exports
  - App: Widget renderers, resource registration
  - Testing requirements at each level

### OpenAI Apps SDK (in `.agent/reference-docs/openai-apps/`)

- **`openai-apps-sdk-reference.md`** — Tool result fields:
  - `structuredContent` → Model AND widget (what model reasons about)
  - `content` → Model (narration)
  - `_meta` → Widget ONLY (never reaches model)

- **`openai-apps-sdk-build-mcp-server.md`** — Tool registration patterns:
  - `_meta` fields on tool descriptor
  - Annotations (readOnlyHint, etc.)
  - Widget template linking

---

## Key Insight: OpenAI SDK Compliance

**Critical**: The knowledge graph MUST be in `structuredContent`, NOT hidden in `_meta`.

From the SDK docs:

> `structuredContent` – concise JSON the widget uses _and_ the model reads. Include only what the model should see.

The graph exists so agents can **reason about curriculum structure**. If it's in `_meta`, the model never sees it, defeating the purpose.

---

## What We're Building

### Terminology

**Oak Curriculum Knowledge Graph (schema-level)**:

- The **structure and form** of how concept types relate
- A graph of concept types (Subject, Unit, Lesson) and their relationships
- TBox (terminological) in formal knowledge representation terms
- NOT instance data (specific lessons, units)

### Complementary Design

| Artifact                                    | Role                | Contains                                                              |
| ------------------------------------------- | ------------------- | --------------------------------------------------------------------- |
| **Ontology** (`get-ontology`)               | Meaning + instances | Rich definitions, enumerated values (ks1, maths), workflows, guidance |
| **Knowledge Graph** (`get-knowledge-graph`) | Structure           | Concept types, type relationships, inferred edges                     |

Together: ~20KB (~5K tokens) for complete domain context.

---

## Implementation Tasks

### Phase 1: Create Graph Data (TDD)

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

1. **Write unit tests FIRST** for:
   - Graph structure validation (all edge references valid)
   - Concept count and categories
   - Edge properties (inferred flags, relationship types)

2. **Create the data file**:

   ```typescript
   /**
    * Oak Curriculum Knowledge Graph (schema-level)
    *
    * Captures concept type relationships for agent reasoning.
    * Use get-ontology for rich definitions and usage guidance.
    *
    * @see kg-overview.md for terminology (schema-level vs instance-level)
    */
   export const conceptGraph = {
     version: '1.0.0',
     concepts: [
       { id: 'subject', label: 'Subject', brief: '...', category: 'structure' },
       // ~28 concepts total
     ],
     edges: [
       { from: 'subject', to: 'sequence', rel: 'hasSequences' },
       // ~40 edges total
     ],
     seeOntology: 'Call get-ontology for rich definitions and usage guidance',
   } as const;

   export type ConceptGraph = typeof conceptGraph;
   ```

3. **Restructure from current graph**:
   - Keep: 28 Concept nodes
   - Remove: 27 Endpoint nodes, 24 Schema nodes, 4 SourceDoc nodes
   - Keep: ~40 concept-to-concept edges
   - Remove: ~80 API mapping edges

### Phase 2: Create Tool Definition (TDD)

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`

1. **Write integration tests FIRST** for:
   - Tool definition structure
   - Input schema validation
   - Response format (structuredContent, content, \_meta)

2. **Follow the pattern from** `aggregated-ontology.ts`:

   ```typescript
   export const GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA = {
     type: 'object',
     properties: {},
     additionalProperties: false,
   } as const;

   export const GET_KNOWLEDGE_GRAPH_TOOL_DEF = {
     description: `Returns the Oak Curriculum concept relationship graph...`,
     inputSchema: GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
     annotations: { readOnlyHint: true, ... },
     _meta: {
       'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
       'openai/toolInvocation/invoking': 'Loading concept graph…',
       'openai/toolInvocation/invoked': 'Concept graph loaded',
     },
   } as const;

   export function runKnowledgeGraphTool(): CallToolResult {
     return {
       content: [{ type: 'text', text: 'Curriculum concept relationships loaded.' }],
       structuredContent: conceptGraph, // Model needs this!
       _meta: {
         toolName: 'get-knowledge-graph',
         // Widget hints only
       },
     };
   }
   ```

### Phase 3: Register Tool (TDD)

**Files to modify**:

1. **`tool-guidance-types.ts`** — Add to `AggregatedToolName`:

   ```typescript
   export type AggregatedToolName =
     | 'search'
     | 'fetch'
     | 'get-ontology'
     | 'get-help'
     | 'get-knowledge-graph';
   ```

2. **`tool-guidance-data.ts`** — Add to `agentSupport` category:

   ```typescript
   agentSupport: {
     tools: ['get-help', 'get-ontology', 'get-knowledge-graph'],
     // ...
   }
   ```

3. **`universal-tools/definitions.ts`** — Add to `AGGREGATED_TOOL_DEFS`:

   ```typescript
   'get-knowledge-graph': GET_KNOWLEDGE_GRAPH_TOOL_DEF,
   ```

4. **`universal-tools/executor.ts`** — Add dispatch:

   ```typescript
   if (name === 'get-knowledge-graph') {
     return runKnowledgeGraphTool();
   }
   ```

### Phase 4: Update Cross-References (TDD)

1. **In ontology response** — Add cross-reference to graph:

   ```typescript
   seeAlso: 'Call get-knowledge-graph for concept relationships';
   ```

2. **In graph response** — Already has:

   ```typescript
   seeOntology: 'Call get-ontology for rich definitions and usage guidance';
   ```

3. **Update tips in tool-guidance-data.ts**:

   ```typescript
   tips: [
     // ...
     'Use get-ontology for domain understanding, get-knowledge-graph for concept relationships.',
   ];
   ```

### Phase 5: Widget Renderer (Optional)

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/`

The existing `oak-json-viewer.html` widget should work. If a custom renderer is needed:

1. Create `knowledge-graph-renderer.ts`
2. Add to `widget-renderers/index.ts`
3. Map in `widget-renderer-registry.ts`

### Phase 6: E2E Tests

**Location**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`

Write E2E tests FIRST (per TDD):

- Tool appears in `tools/list`
- Tool returns expected structure
- `structuredContent` contains the graph
- Cross-references work

---

## Quality Gates

After ALL changes are complete, run the full quality gate suite **one gate at a time**:

```bash
# From repo root, with no filters
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

**Wait for ALL gates to complete before analyzing issues.**

Analysis must include asking: Are there fundamental architectural issues or opportunities for improvement?

---

## Files Summary

### New Files to Create

| File                                                                               | Purpose                      |
| ---------------------------------------------------------------------------------- | ---------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`                 | Graph data (concept-focused) |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.unit.test.ts`       | Unit tests for graph data    |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`           | Tool definition + execution  |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.unit.test.ts` | Unit tests for tool          |

### Files to Modify

| File                                                                      | Change                            |
| ------------------------------------------------------------------------- | --------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`         | Add to AggregatedToolName         |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`          | Add to agentSupport, tips         |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add to AGGREGATED_TOOL_DEFS       |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`    | Add dispatch                      |
| `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`               | Review for overlap, add cross-ref |
| `packages/sdks/oak-curriculum-sdk/tsup.config.ts`                         | Add entry if needed               |

### Research Documents (for reference)

| Document                                                                           | Key Content            |
| ---------------------------------------------------------------------------------- | ---------------------- |
| `.agent/research/open-curriculum-knowledge-graph/knowledge-graph-tool-research.md` | Full analysis          |
| `.agent/research/open-curriculum-knowledge-graph/complementary-by-construction.md` | Separation of concerns |
| `.agent/research/open-curriculum-knowledge-graph/optimised-graph-proposal.md`      | Target structure       |
| `.agent/research/open-curriculum-knowledge-graph/kg-overview.md`                   | Terminology            |

---

## Validation Criteria

The implementation is complete when:

1. **All quality gates pass** (no exceptions)
2. **TDD was followed** at unit, integration, and E2E levels
3. **Graph is in `structuredContent`** (model can reason about it)
4. **Ontology and graph cross-reference each other**
5. **Token budget is met** (~8KB graph + ~12KB ontology = ~20KB total)
6. **No type shortcuts** (types derived from `as const` data)
7. **TSDoc comments** on all public APIs
8. **Foundation documents were re-read** at start of each phase

---

## Re-read Foundation Documents

Before starting implementation, re-read:

1. `.agent/directives/rules.md`
2. `.agent/directives/schema-first-execution.md`
3. `.agent/directives/testing-strategy.md`

During implementation, periodically re-read these to ensure alignment.

---

## Questions to Resolve During Implementation

1. **Ontology overlap**: Should we trim `entityHierarchy` from ontology if graph captures the same edges?
2. **Concept categories**: Are the proposed categories (structure, content, context, taxonomy, ks4, metadata) useful?
3. **Inferred flags**: Should all inferred relationships be marked, or only non-obvious ones?
4. **Widget**: Is the JSON viewer sufficient, or does the graph warrant custom visualization?

---

## Success Metrics

- Agents can call `get-knowledge-graph` and receive concept relationships
- Combined ontology + graph provides complete domain context in ~5K tokens
- The two artifacts demonstrably complement each other (no duplication)
- All quality gates pass
- Implementation follows TDD at all levels
