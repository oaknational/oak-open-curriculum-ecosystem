# Prompt: Implement Oak Curriculum Knowledge Graph V1

## Overview

This prompt guides the implementation of the `get-knowledge-graph` agent support tool (V1). This is a **static, schema-level knowledge graph** that provides agents with concept TYPE relationships for domain reasoning.

**This prompt is self-contained** — it includes everything needed to start work in a fresh chat with no prior context.

---

## ⚠️ MANDATORY: Read Foundation Documents First

Before ANY implementation work, read and internalise these foundation documents:

1. **`.agent/directives-and-memory/rules.md`**
   - First Question: "Could it be simpler without compromising quality?"
   - Cardinal Rule: `pnpm type-gen` + `pnpm build` must align all workspaces
   - TDD at ALL levels (unit, integration, E2E)
   - No type shortcuts (`as`, `any`, `!`, `Record<string, unknown>`)
   - Types flow from `as const` data structures

2. **`.agent/directives-and-memory/testing-strategy.md`**
   - TDD cycle: RED → GREEN → REFACTOR
   - Unit tests: Pure functions, no IO, no mocks
   - Integration tests: Code units together, simple injected mocks
   - E2E tests: Running system, separate process
   - Write tests FIRST at EVERY level

3. **`.agent/directives-and-memory/schema-first-execution.md`**
   - Generator is single source of truth for API types
   - The knowledge graph is **authored domain knowledge** (like ontology)
   - It complements schema-first without violating it

**Re-read these documents at the start of each implementation phase.**

---

## What We're Building

### V1 Specification

| Aspect          | Specification                                            |
| --------------- | -------------------------------------------------------- |
| **Tool name**   | `get-knowledge-graph`                                    |
| **Category**    | Agent support (alongside `get-help`, `get-ontology`)     |
| **Graph level** | Schema-level (concept TYPES, not instances)              |
| **Delivery**    | Static — full graph in `structuredContent`               |
| **Content**     | ~25 concept nodes, ~45 domain relationship edges         |
| **Size target** | ~6KB (~1.5K tokens)                                      |
| **Searchable**  | No (V2+ feature)                                         |
| **Purpose**     | Agent context grounding — how curriculum concepts relate |

### What V1 IS NOT

- NOT instance-level (no specific "greenhouse effect" concept)
- NOT searchable (no query parameters)
- NOT populated from NLP/LLM extraction
- NOT for subject design (that's a future tool)
- NOT API endpoint mappings (agents see `tools/list`)

### Complementary Design

| Ontology (`get-ontology`)      | Knowledge Graph (`get-knowledge-graph`) |
| ------------------------------ | --------------------------------------- |
| What things **mean**           | How things **connect**                  |
| Rich prose definitions         | Terse edge relationships                |
| Enumerated values (ks1, maths) | Concept identifiers only                |
| Workflow guidance              | Navigable structure                     |
| ~15KB (~4K tokens)             | ~6KB (~1.5K tokens)                     |

Combined: ~20KB (~5K tokens) for complete domain context.

---

## Research Documents

Read these documents in `.agent/research/open-curriculum-knowledge-graph/`:

| Document                                | Purpose                                 | Priority   |
| --------------------------------------- | --------------------------------------- | ---------- |
| `README.md`                             | Navigation guide, V1 vs V2+ explanation | Start here |
| `knowledge-graph-analysis-synthesis.md` | **PRIMARY** — Comprehensive synthesis   | Essential  |
| `optimised-graph-proposal.md`           | Target structure (~25 nodes, ~45 edges) | Essential  |
| `complementary-by-construction.md`      | Ontology/graph separation               | Important  |
| `knowledge-graph-tool-research.md`      | Tool patterns and integration           | Important  |

**Do NOT read**:

- `archive/` folder (deprecated, wrong API focus)
- `oak-knowledge-graph-support.md` (V2+ future scope)
- `oak-subject-design-tool.md` (V2+ future scope)

---

## Reference Implementation

Study the existing `get-ontology` tool as a pattern:

| File                                                                      | Purpose                        |
| ------------------------------------------------------------------------- | ------------------------------ |
| `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`               | Data structure with `as const` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`         | Tool definition and execution  |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Tool registration              |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`    | Execution dispatch             |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`         | Type definitions               |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`          | Agent support category         |

---

## Implementation Plan

### Phase 1: Graph Data Structure (TDD)

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`

#### Step 1.1: Write Unit Tests FIRST (RED)

Create `knowledge-graph-data.unit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { conceptGraph } from './knowledge-graph-data';

describe('conceptGraph', () => {
  describe('structure', () => {
    it('has version string', () => {
      expect(typeof conceptGraph.version).toBe('string');
      expect(conceptGraph.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('has concepts array', () => {
      expect(Array.isArray(conceptGraph.concepts)).toBe(true);
      expect(conceptGraph.concepts.length).toBeGreaterThan(20);
    });

    it('has edges array', () => {
      expect(Array.isArray(conceptGraph.edges)).toBe(true);
      expect(conceptGraph.edges.length).toBeGreaterThan(30);
    });

    it('has seeOntology cross-reference', () => {
      expect(typeof conceptGraph.seeOntology).toBe('string');
      expect(conceptGraph.seeOntology).toContain('get-ontology');
    });
  });

  describe('concepts', () => {
    it('each concept has required fields', () => {
      for (const concept of conceptGraph.concepts) {
        expect(typeof concept.id).toBe('string');
        expect(typeof concept.label).toBe('string');
        expect(typeof concept.brief).toBe('string');
        expect(typeof concept.category).toBe('string');
      }
    });

    it('concept IDs are unique', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('includes core structure concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('subject');
      expect(ids).toContain('sequence');
      expect(ids).toContain('unit');
      expect(ids).toContain('lesson');
    });

    it('includes taxonomy concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('thread');
      expect(ids).toContain('category');
    });

    it('includes KS4 complexity concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('programme');
      expect(ids).toContain('tier');
      expect(ids).toContain('pathway');
      expect(ids).toContain('examboard');
    });
  });

  describe('edges', () => {
    it('each edge has required fields', () => {
      for (const edge of conceptGraph.edges) {
        expect(typeof edge.from).toBe('string');
        expect(typeof edge.to).toBe('string');
        expect(typeof edge.rel).toBe('string');
      }
    });

    it('all edge references are valid concept IDs', () => {
      const validIds = new Set(conceptGraph.concepts.map((c) => c.id));
      for (const edge of conceptGraph.edges) {
        expect(validIds.has(edge.from)).toBe(true);
        expect(validIds.has(edge.to)).toBe(true);
      }
    });

    it('includes core hierarchy edges', () => {
      const hasEdge = (from: string, to: string) =>
        conceptGraph.edges.some((e) => e.from === from && e.to === to);

      expect(hasEdge('subject', 'sequence')).toBe(true);
      expect(hasEdge('sequence', 'unit')).toBe(true);
      expect(hasEdge('unit', 'lesson')).toBe(true);
    });

    it('marks inferred edges', () => {
      const inferredEdges = conceptGraph.edges.filter((e) => e.inferred === true);
      expect(inferredEdges.length).toBeGreaterThan(5);
    });
  });

  describe('size constraints', () => {
    it('is within token budget', () => {
      const json = JSON.stringify(conceptGraph);
      const estimatedTokens = json.length / 4; // Rough estimate
      expect(estimatedTokens).toBeLessThan(2500); // Target ~1.5K, allow headroom
    });
  });
});
```

Run tests: `pnpm test -- knowledge-graph-data.unit.test.ts` → **MUST FAIL** (file doesn't exist)

#### Step 1.2: Implement Data Structure (GREEN)

Create `knowledge-graph-data.ts`:

```typescript
/**
 * Oak Curriculum Knowledge Graph (schema-level)
 *
 * Captures concept TYPE relationships for agent reasoning.
 * This is a static data structure — not searchable, not instance-level.
 *
 * Use `get-ontology` for rich definitions and usage guidance.
 *
 * @see knowledge-graph-analysis-synthesis.md for design rationale
 * @see optimised-graph-proposal.md for target structure
 */

/**
 * Concept category for grouping related concepts
 */
type ConceptCategory =
  | 'structure' // Subject, Sequence, Unit, Lesson
  | 'content' // Quiz, Question, Answer, Asset, Transcript
  | 'context' // Phase, KeyStage, YearGroup
  | 'taxonomy' // Thread, Category
  | 'ks4' // Programme, Tier, Pathway, ExamBoard, ExamSubject
  | 'metadata'; // Keyword, Misconception, ContentGuidance, etc.

/**
 * Oak Curriculum Concept Graph
 *
 * A structural representation of curriculum concept TYPE relationships.
 * The graph captures domain relationships, NOT API mappings.
 * Agents learn about endpoints from `tools/list`.
 */
export const conceptGraph = {
  version: '1.0.0',

  concepts: [
    // Structure (core hierarchy)
    {
      id: 'subject',
      label: 'Subject',
      brief: 'Curriculum subject area',
      category: 'structure' as const,
    },
    {
      id: 'sequence',
      label: 'Sequence',
      brief: 'Internal API grouping of units',
      category: 'structure' as const,
    },
    {
      id: 'unit',
      label: 'Unit',
      brief: 'Topic of study with ordered lessons',
      category: 'structure' as const,
    },
    {
      id: 'lesson',
      label: 'Lesson',
      brief: 'Teaching session with 8 components',
      category: 'structure' as const,
    },

    // Content (within lesson)
    {
      id: 'quiz',
      label: 'Quiz',
      brief: 'Starter or exit assessment',
      category: 'content' as const,
    },
    {
      id: 'question',
      label: 'Question',
      brief: 'Quiz question with answers',
      category: 'content' as const,
    },
    {
      id: 'answer',
      label: 'Answer',
      brief: 'Correct answer or distractor',
      category: 'content' as const,
    },
    { id: 'asset', label: 'Asset', brief: 'Downloadable resource', category: 'content' as const },
    {
      id: 'transcript',
      label: 'Transcript',
      brief: 'Video transcript text',
      category: 'content' as const,
    },

    // Context (scoping)
    { id: 'phase', label: 'Phase', brief: 'Primary or secondary', category: 'context' as const },
    {
      id: 'keystage',
      label: 'KeyStage',
      brief: 'KS1-KS4 formal stage',
      category: 'context' as const,
    },
    { id: 'yeargroup', label: 'YearGroup', brief: 'Year 1-11', category: 'context' as const },

    // Taxonomy (cross-cutting)
    {
      id: 'thread',
      label: 'Thread',
      brief: 'Conceptual strand across years',
      category: 'taxonomy' as const,
    },
    {
      id: 'category',
      label: 'Category',
      brief: 'Subject-specific grouping',
      category: 'taxonomy' as const,
    },

    // KS4 complexity
    {
      id: 'programme',
      label: 'Programme',
      brief: 'User-facing curriculum pathway',
      category: 'ks4' as const,
    },
    { id: 'tier', label: 'Tier', brief: 'Foundation or higher', category: 'ks4' as const },
    { id: 'pathway', label: 'Pathway', brief: 'Core or GCSE route', category: 'ks4' as const },
    {
      id: 'examboard',
      label: 'ExamBoard',
      brief: 'AQA, OCR, Edexcel, etc.',
      category: 'ks4' as const,
    },
    {
      id: 'examsubject',
      label: 'ExamSubject',
      brief: 'Biology, Chemistry, etc. (KS4)',
      category: 'ks4' as const,
    },

    // Educational metadata
    {
      id: 'keyword',
      label: 'Keyword',
      brief: 'Critical vocabulary',
      category: 'metadata' as const,
    },
    {
      id: 'misconception',
      label: 'Misconception',
      brief: 'Common misunderstanding',
      category: 'metadata' as const,
    },
    {
      id: 'contentguidance',
      label: 'ContentGuidance',
      brief: 'Sensitive content advisory',
      category: 'metadata' as const,
    },
    {
      id: 'supervisionlevel',
      label: 'SupervisionLevel',
      brief: 'Adult supervision required',
      category: 'metadata' as const,
    },
    {
      id: 'priorknowledge',
      label: 'PriorKnowledge',
      brief: 'Prerequisite understanding',
      category: 'metadata' as const,
    },
    {
      id: 'nationalcurriculum',
      label: 'NationalCurriculumStatement',
      brief: 'NC coverage',
      category: 'metadata' as const,
    },
  ],

  edges: [
    // ===== EXPLICIT EDGES (from schema/glossary) =====

    // Core hierarchy
    { from: 'subject', to: 'sequence', rel: 'hasSequences' },
    { from: 'sequence', to: 'unit', rel: 'containsUnits' },
    { from: 'unit', to: 'lesson', rel: 'containsLessons' },

    // Content hierarchy
    { from: 'lesson', to: 'quiz', rel: 'hasQuizzes' },
    { from: 'quiz', to: 'question', rel: 'containsQuestions' },
    { from: 'question', to: 'answer', rel: 'hasAnswers' },
    { from: 'lesson', to: 'asset', rel: 'hasAssets' },
    { from: 'lesson', to: 'transcript', rel: 'hasTranscript' },

    // Context
    { from: 'phase', to: 'keystage', rel: 'includesKeyStages' },
    { from: 'keystage', to: 'yeargroup', rel: 'includesYears' },
    { from: 'subject', to: 'keystage', rel: 'availableAt' },

    // Taxonomy
    { from: 'thread', to: 'unit', rel: 'linksAcrossYears' },
    { from: 'unit', to: 'thread', rel: 'taggedWith' },
    { from: 'unit', to: 'category', rel: 'taggedWith' },

    // Educational metadata
    { from: 'lesson', to: 'keyword', rel: 'hasKeywords' },
    { from: 'lesson', to: 'misconception', rel: 'addressesMisconceptions' },
    { from: 'lesson', to: 'contentguidance', rel: 'hasGuidance' },
    { from: 'contentguidance', to: 'supervisionlevel', rel: 'requiresSupervision' },
    { from: 'unit', to: 'priorknowledge', rel: 'requiresPriorKnowledge' },
    { from: 'unit', to: 'nationalcurriculum', rel: 'covers' },

    // ===== INFERRED EDGES (implicit but valuable) =====

    // Unit context
    { from: 'unit', to: 'subject', rel: 'belongsTo', inferred: true as const },
    { from: 'unit', to: 'keystage', rel: 'scopedTo', inferred: true as const },
    { from: 'unit', to: 'yeargroup', rel: 'targets', inferred: true as const },
    { from: 'unit', to: 'phase', rel: 'belongsTo', inferred: true as const },

    // Lesson context
    { from: 'lesson', to: 'subject', rel: 'belongsTo', inferred: true as const },
    { from: 'lesson', to: 'keystage', rel: 'scopedTo', inferred: true as const },
    { from: 'lesson', to: 'unit', rel: 'belongsTo', inferred: true as const },

    // Programme (derived concept, not API entity)
    { from: 'programme', to: 'sequence', rel: 'derivedFrom', inferred: true as const },
    { from: 'programme', to: 'subject', rel: 'about', inferred: true as const },
    { from: 'programme', to: 'keystage', rel: 'scopedTo', inferred: true as const },
    { from: 'programme', to: 'yeargroup', rel: 'targets', inferred: true as const },
    { from: 'programme', to: 'unit', rel: 'containsUnits', inferred: true as const },
    { from: 'programme', to: 'tier', rel: 'usesFactorWhen', inferred: true as const },
    { from: 'programme', to: 'pathway', rel: 'usesFactorWhen', inferred: true as const },
    { from: 'programme', to: 'examboard', rel: 'usesFactorWhen', inferred: true as const },

    // KS4 branching
    { from: 'sequence', to: 'examsubject', rel: 'branchesInto', inferred: true as const },
    { from: 'sequence', to: 'tier', rel: 'hasTiers', inferred: true as const },
    { from: 'examsubject', to: 'tier', rel: 'hasTiers', inferred: true as const },
    { from: 'examsubject', to: 'unit', rel: 'containsUnits', inferred: true as const },
    { from: 'tier', to: 'unit', rel: 'containsUnits', inferred: true as const },
  ],

  seeOntology: 'Call get-ontology for rich definitions, enumerated values, and workflow guidance',
} as const;

/**
 * Type representing the complete concept graph
 */
export type ConceptGraph = typeof conceptGraph;

/**
 * Type representing valid concept IDs
 */
export type ConceptId = ConceptGraph['concepts'][number]['id'];

/**
 * Type representing valid concept categories
 */
export type ConceptGraphCategory = ConceptGraph['concepts'][number]['category'];
```

Run tests: `pnpm test -- knowledge-graph-data.unit.test.ts` → **MUST PASS**

#### Step 1.3: Refactor (GREEN stays GREEN)

Review and improve:

- TSDoc comments complete?
- Concept descriptions accurate?
- All meaningful edges captured?
- Inferred relationships marked correctly?

---

### Phase 2: Tool Definition (TDD)

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`

#### Step 2.1: Write Integration Tests FIRST (RED)

Create `aggregated-knowledge-graph.unit.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
  GET_KNOWLEDGE_GRAPH_TOOL_DEF,
  runKnowledgeGraphTool,
} from './aggregated-knowledge-graph';

describe('GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA', () => {
  it('accepts empty object (no parameters)', () => {
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.type).toBe('object');
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.properties).toEqual({});
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.additionalProperties).toBe(false);
  });
});

describe('GET_KNOWLEDGE_GRAPH_TOOL_DEF', () => {
  it('has description mentioning concept relationships', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('concept');
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('relationship');
  });

  it('has readOnlyHint annotation', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.annotations?.readOnlyHint).toBe(true);
  });

  it('references ontology in description', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('get-ontology');
  });

  it('has OpenAI widget metadata', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF._meta).toBeDefined();
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF._meta?.['openai/outputTemplate']).toBeDefined();
  });
});

describe('runKnowledgeGraphTool', () => {
  it('returns CallToolResult structure', () => {
    const result = runKnowledgeGraphTool();

    expect(result).toHaveProperty('content');
    expect(result).toHaveProperty('structuredContent');
  });

  it('has text content with narration', () => {
    const result = runKnowledgeGraphTool();

    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0]).toHaveProperty('text');
  });

  it('has structuredContent with graph data (model needs this)', () => {
    const result = runKnowledgeGraphTool();

    expect(result.structuredContent).toHaveProperty('version');
    expect(result.structuredContent).toHaveProperty('concepts');
    expect(result.structuredContent).toHaveProperty('edges');
    expect(result.structuredContent).toHaveProperty('seeOntology');
  });

  it('has _meta for widget hints only', () => {
    const result = runKnowledgeGraphTool();

    expect(result._meta).toHaveProperty('toolName', 'get-knowledge-graph');
  });
});
```

Run tests → **MUST FAIL**

#### Step 2.2: Implement Tool Definition (GREEN)

Create `aggregated-knowledge-graph.ts`:

```typescript
/**
 * Oak Curriculum Knowledge Graph Tool
 *
 * Provides a static, schema-level graph of curriculum concept TYPE relationships.
 * Complements get-ontology by showing HOW concepts connect (vs WHAT they mean).
 *
 * @see knowledge-graph-data.ts for the graph data structure
 * @see aggregated-ontology.ts for the companion tool
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { conceptGraph } from './knowledge-graph-data';

/**
 * Input schema for get-knowledge-graph tool.
 * V1 has no parameters — returns the complete graph.
 */
export const GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA = {
  type: 'object',
  properties: {},
  additionalProperties: false,
} as const;

/**
 * Tool definition for get-knowledge-graph.
 *
 * The graph is delivered in structuredContent because the MODEL needs to reason about it.
 * Do NOT hide the graph in _meta — that would defeat the purpose.
 */
export const GET_KNOWLEDGE_GRAPH_TOOL_DEF = {
  description: `Returns the Oak Curriculum concept relationship graph.

This schema-level graph shows how curriculum concept TYPES relate to each other:
- Core hierarchy: Subject → Sequence → Unit → Lesson
- Content structure: Lesson → Quiz → Question → Answer
- Taxonomy: Thread ↔ Unit, Category ↔ Unit
- KS4 complexity: Programme → Tier/Pathway/ExamBoard

Use this to understand domain structure. For rich definitions and guidance, call get-ontology.

The graph includes both explicit relationships (from API schema) and inferred relationships 
(implied by domain knowledge but not explicit in the API).`,

  inputSchema: GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA,

  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },

  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': 'Loading concept relationship graph…',
    'openai/toolInvocation/invoked': 'Concept graph loaded',
  },
} as const;

/**
 * Execute the get-knowledge-graph tool.
 *
 * Returns the complete concept graph in structuredContent for model reasoning.
 *
 * @returns CallToolResult with graph in structuredContent
 */
export function runKnowledgeGraphTool(): CallToolResult {
  return {
    content: [
      {
        type: 'text',
        text: 'Curriculum concept relationships loaded. Use with get-ontology for complete domain understanding.',
      },
    ],
    structuredContent: conceptGraph,
    _meta: {
      toolName: 'get-knowledge-graph',
      timestamp: Date.now(),
    },
  };
}
```

Run tests → **MUST PASS**

---

### Phase 3: Tool Registration (TDD)

#### Step 3.1: Update Type Definition

In `tool-guidance-types.ts`, add to `AggregatedToolName`:

```typescript
export type AggregatedToolName =
  | 'search'
  | 'fetch'
  | 'get-ontology'
  | 'get-help'
  | 'get-knowledge-graph';
```

#### Step 3.2: Update Tool Guidance Data

In `tool-guidance-data.ts`, add to `agentSupport` category:

```typescript
agentSupport: {
  tools: ['get-help', 'get-ontology', 'get-knowledge-graph'],
  description: 'Tools for understanding Oak Curriculum system and how to use the tools.',
  whenToUse: 'At conversation start, when user asks to "understand Oak", or to get context.',
  isAgentSupport: true,
}
```

Add tip:

```typescript
tips: [
  // ... existing tips
  'Use get-ontology for domain understanding (what things mean), get-knowledge-graph for structure (how things connect).',
];
```

#### Step 3.3: Update Tool Definitions

In `universal-tools/definitions.ts`:

```typescript
import { GET_KNOWLEDGE_GRAPH_TOOL_DEF } from '../aggregated-knowledge-graph';

export const AGGREGATED_TOOL_DEFS = {
  // ... existing
  'get-knowledge-graph': GET_KNOWLEDGE_GRAPH_TOOL_DEF,
} as const;
```

#### Step 3.4: Update Executor

In `universal-tools/executor.ts`:

```typescript
import { runKnowledgeGraphTool } from '../aggregated-knowledge-graph';

// In the dispatch logic:
if (name === 'get-knowledge-graph') {
  return runKnowledgeGraphTool();
}
```

---

### Phase 4: Cross-References

#### Step 4.1: Update Ontology Response

In `ontology-data.ts`, add:

```typescript
seeAlso: 'Call get-knowledge-graph for concept TYPE relationships and domain structure',
```

#### Step 4.2: Verify Graph Response

The graph already has:

```typescript
seeOntology: 'Call get-ontology for rich definitions, enumerated values, and workflow guidance',
```

---

### Phase 5: E2E Tests (TDD)

**Location**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/`

#### Step 5.1: Write E2E Tests FIRST (RED)

Create `get-knowledge-graph.e2e.test.ts`:

```typescript
import { describe, it, expect, beforeAll } from 'vitest';
// Import test utilities for MCP client

describe('get-knowledge-graph E2E', () => {
  describe('tools/list', () => {
    it('includes get-knowledge-graph in tool list', async () => {
      const tools = await client.listTools();
      const kgTool = tools.find((t) => t.name === 'get-knowledge-graph');

      expect(kgTool).toBeDefined();
      expect(kgTool?.description).toContain('concept');
    });
  });

  describe('tools/call', () => {
    it('returns concept graph in structuredContent', async () => {
      const result = await client.callTool('get-knowledge-graph', {});

      expect(result.structuredContent).toHaveProperty('version');
      expect(result.structuredContent).toHaveProperty('concepts');
      expect(result.structuredContent).toHaveProperty('edges');
    });

    it('includes core hierarchy concepts', async () => {
      const result = await client.callTool('get-knowledge-graph', {});
      const concepts = result.structuredContent.concepts;
      const ids = concepts.map((c: { id: string }) => c.id);

      expect(ids).toContain('subject');
      expect(ids).toContain('unit');
      expect(ids).toContain('lesson');
    });

    it('includes inferred edges', async () => {
      const result = await client.callTool('get-knowledge-graph', {});
      const edges = result.structuredContent.edges;
      const inferredEdges = edges.filter((e: { inferred?: boolean }) => e.inferred);

      expect(inferredEdges.length).toBeGreaterThan(0);
    });

    it('cross-references ontology', async () => {
      const result = await client.callTool('get-knowledge-graph', {});

      expect(result.structuredContent.seeOntology).toContain('get-ontology');
    });
  });
});
```

Run E2E tests → **MUST FAIL** (tool not registered yet in server)

#### Step 5.2: Register in Server (GREEN)

Ensure the MCP server includes the new tool. Run E2E tests → **MUST PASS**

---

## Quality Gates

After ALL implementation is complete, run the full quality gate suite **one gate at a time**:

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

## Validation Criteria

The implementation is complete when:

- [ ] **All quality gates pass** (no exceptions)
- [ ] **TDD was followed** at unit, integration, and E2E levels
- [ ] **Graph is in `structuredContent`** (model can reason about it)
- [ ] **Ontology and graph cross-reference each other**
- [ ] **Token budget is met** (~6KB graph)
- [ ] **No type shortcuts** (types derived from `as const` data)
- [ ] **TSDoc comments** on all public APIs
- [ ] **Foundation documents were re-read** at start of each phase

---

## Files Summary

### New Files to Create

| File                                                                                | Purpose                     |
| ----------------------------------------------------------------------------------- | --------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.ts`                  | Graph data with `as const`  |
| `packages/sdks/oak-curriculum-sdk/src/mcp/knowledge-graph-data.unit.test.ts`        | Unit tests for graph        |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts`            | Tool definition + execution |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.unit.test.ts`  | Unit tests for tool         |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/get-knowledge-graph.e2e.test.ts` | E2E tests                   |

### Files to Modify

| File                                                                      | Change                      |
| ------------------------------------------------------------------------- | --------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`         | Add to AggregatedToolName   |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`          | Add to agentSupport, tips   |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` | Add to AGGREGATED_TOOL_DEFS |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`    | Add dispatch                |
| `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`               | Add seeAlso cross-ref       |

---

## Quick Reference: Key Rules

From `rules.md`:

- **TDD**: Write tests FIRST — RED → GREEN → REFACTOR
- **No type shortcuts**: No `as`, `any`, `!`, `Record<string, unknown>`
- **Types from data**: Use `as const` and derive types from data structures
- **TSDoc everywhere**: All public APIs must be documented
- **Fail fast**: No silent failures, no compatibility layers

From `testing-strategy.md`:

- **Unit tests**: Pure functions, no IO, no mocks
- **Integration tests**: Code units together, simple injected mocks
- **E2E tests**: Running system, separate process

From `schema-first-execution.md`:

- Knowledge graph is **authored domain knowledge** (like ontology)
- It complements schema-first without violating it
- The graph captures knowledge NOT in the OpenAPI schema

---

## Success Metrics

- Agents can call `get-knowledge-graph` and receive concept relationships
- Combined ontology + graph provides ~5K tokens of domain context
- The two artifacts demonstrably complement each other
- All quality gates pass
- Implementation follows TDD at all levels
