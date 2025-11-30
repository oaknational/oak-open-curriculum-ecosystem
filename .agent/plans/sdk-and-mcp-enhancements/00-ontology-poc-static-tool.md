# Ontology POC: Static `get-ontology` Tool

**Status**: COMPLETED  
**Created**: 2025-11-27  
**Completed**: 2025-11-27  
**Priority**: Quick Win (Pre-POC validation)  
**Actual Duration**: ~2 hours (including TDD, refactoring, and E2E tests)

---

## Executive Summary

Create a minimal proof-of-concept `get-ontology` aggregated tool that serves a hand-authored static JSON file. This validates the value proposition before investing in the full schema-extraction approach.

**This is NOT the full ontology solution.** It's a quick spike to:

1. Test if ChatGPT actually uses ontology information
2. Establish the content structure and format
3. Provide immediate value while proper solutions develop

---

## Relationship to Other Plans

### Upgrade Path

```
POC (This Plan)          →  Full MCP Implementation  →  Upstream API Endpoint
~1 hour                     ~4 weeks                    (External dependency)
Static JSON file            Schema-derived + guidance    Native /ontology endpoint
Tool (model-driven)         Tool + Resource (dual)       Generated tool
Full metadata treatment     Auto-generated metadata      API-native metadata
```

### Cross-References

| Plan                                           | Relationship                                                                                                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **02-curriculum-ontology-resource-plan.md**    | Full implementation that replaces this POC. Two-layer architecture with schema extraction and MCP resource exposure. |
| **upstream-api-metadata-wishlist.md (Item 3)** | Ideal future state: native `/ontology` endpoint in upstream API that benefits all consumers, not just MCP/AI tools.  |

### When to Upgrade

**Upgrade from POC to Plan 02 when:**

- POC proves value (ChatGPT uses ontology effectively)
- Static content becomes maintenance burden
- Schema changes require manual ontology updates
- Multiple tools need ontology access

**Upgrade from Plan 02 to upstream API when:**

- Data Platform team delivers curriculum ontology
- Upstream `/ontology` endpoint is available
- All API consumers benefit, not just MCP

---

## Directive References

Read and follow:

- `.agent/directives-and-memory/rules.md` - TDD, no type shortcuts, schema-first
- `.agent/directives-and-memory/testing-strategy.md` - Test first (Red → Green → Refactor)
- `.agent/directives-and-memory/schema-first-execution.md` - Generated artifacts drive runtime

---

## Design Decision: Tool vs Resource

### Why a Tool (Not a Resource)?

MCP primitives have different control models:

| Primitive     | Control            | Use Case                          |
| ------------- | ------------------ | --------------------------------- |
| **Resources** | Application-driven | Context the client pre-injects    |
| **Tools**     | Model-driven       | Actions the LLM decides to invoke |

For ontology, we want **ChatGPT to decide** when to request curriculum context → that's **model-controlled** → **tool**.

Additional considerations:

- ChatGPT uses resources primarily for **UI components** (`text/html+skybridge`)
- Tools receive full metadata support (annotations, `_meta`, examples)
- Tools align with the "call FIRST when you need to understand" discovery pattern

### Future Consideration (Plan 02)

The full implementation could offer **both**:

- A **resource** (`curriculum://ontology`) for clients that want to pre-inject context
- A **tool** (`get-ontology`) for model-driven on-demand access

This POC validates the tool approach first.

---

## What We're Building

### Simple Architecture

```
Hand-authored JSON file
        ↓
  get-ontology tool
        ↓
  Returns static content
```

No type-gen. No schema extraction. No MCP resources. Just a tool that returns a JSON file.

### Files

| File                                                          | Purpose                            |
| ------------------------------------------------------------- | ---------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/ontology.json`      | Static ontology content            |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` | Add `get-ontology` tool definition |

### Reference Content

The complete POC JSON content is available at:

→ **`ontology-poc-content.json`** (in this directory)

This JSON includes:

| Section                 | Purpose                                                     |
| ----------------------- | ----------------------------------------------------------- |
| `curriculumStructure`   | Key stages, phases, subjects with coverage                  |
| `threads`               | Critical for progression - includes examples and tool usage |
| `programmesVsSequences` | Explains the API vs user-facing distinction                 |
| `ks4Complexity`         | Tiers, exam boards, exam subjects, pathways                 |
| `entityHierarchy`       | Subject → Sequence → Unit → Lesson with schema refs         |
| `unitTypes`             | Simple, variant, optionality                                |
| `lessonComponents`      | All 8 components with which tool fetches each               |
| `contentGuidance`       | 4 categories + supervision levels                           |
| `toolUsageGuidance`     | Discovery, browsing, progression, lesson planning workflows |
| `idFormats`             | Prefixed ID routing for `fetch` tool                        |
| `ukEducationContext`    | Year/age mapping, National Curriculum context               |
| `canonicalUrls`         | URL patterns for Oak website links                          |

---

## Implementation

### Step 1: Create Static Ontology JSON (~30 mins)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/ontology.json`

Copy from the reference file `ontology-poc-content.json` in this directory, or use as-is.

### Step 2: Add Aggregated Tool Definition (~30 mins)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

Add to `AGGREGATED_TOOL_DEFS` with **full metadata treatment** per `.agent/reference-docs/openai-apps-metadata.md`:

```typescript
'get-ontology': {
  // --- Core Tool Descriptor ---
  description: `Returns the Oak Curriculum domain model including key stages, subjects, entity hierarchy, and tool usage guidance.

Use this when you need to understand:
- How the curriculum is structured (key stages, years, subjects)
- How entities relate (subject → unit → lesson)
- Which tools to use for different workflows
- How to interpret ID formats for the 'fetch' tool

Do NOT use for:
- Fetching actual curriculum content (use 'search' or 'fetch')
- Looking up specific lessons, units, or resources

Call this FIRST before using other curriculum tools to understand the domain model.`,

  // --- Input Schema (no params for static ontology) ---
  inputSchema: {
    type: 'object' as const,
    properties: {} as const,
    additionalProperties: false as const,
  },

  // --- Security ---
  securitySchemes: [{ type: 'oauth2' as const, scopes: ['openid', 'email'] }],

  // --- MCP Annotations (per spec) ---
  annotations: {
    title: 'Get Curriculum Ontology',
    readOnlyHint: true,      // Never mutates state
    destructiveHint: false,  // No destructive operations
    idempotentHint: true,    // Same result every time
    openWorldHint: false,    // Closed domain (Oak curriculum only)
  },

  // --- OpenAI Apps SDK _meta (per openai-apps-metadata.md) ---
  _meta: {
    // Status text during invocation
    'openai/toolInvocation/invoking': 'Loading curriculum model…',
    'openai/toolInvocation/invoked': 'Curriculum model loaded',
  },
},
```

### Metadata Checklist

Per `.agent/reference-docs/openai-apps-metadata.md`:

| Metadata                        | Status | Notes                                     |
| ------------------------------- | ------ | ----------------------------------------- |
| **Name** (domain.action format) | ✅     | `get-ontology` follows pattern            |
| **Description** ("Use when…")   | ✅     | Includes positive and negative cases      |
| **readOnlyHint**                | ✅     | True - no state mutation                  |
| **title** (annotation)          | ✅     | "Get Curriculum Ontology"                 |
| **Parameter docs**              | N/A    | No parameters for this tool               |
| **Examples**                    | N/A    | No input parameters to exemplify          |
| **Invocation status (\_meta)**  | ✅     | invoking/invoked messages                 |
| **Output schema**               | 🔮     | Future consideration (Phase 5 of Plan 01) |

### Step 3: Implement Handler (~30 mins)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-handlers.ts` (or appropriate handler file)

```typescript
import ontologyData from './ontology.json';

// In the tool handler switch/map
case 'get-ontology':
  return {
    content: [{
      type: 'text',
      text: JSON.stringify(ontologyData, null, 2),
    }],
    structuredContent: ontologyData,
  };
```

### Step 4: Test (~30 mins)

1. Run `pnpm build` to ensure no type errors
2. Run `pnpm test` to ensure existing tests pass
3. Start MCP server and verify tool appears in `listTools`
4. Call tool and verify JSON is returned
5. Test in ChatGPT Developer Mode:
   - Ask "What key stages are available?"
   - Ask "How do I find lessons about fractions?"
   - Observe if ChatGPT uses the ontology to guide tool usage

---

## Acceptance Criteria

### Functional Requirements

| Criterion                                     | Test Method     |
| --------------------------------------------- | --------------- |
| `get-ontology` tool appears in tool list      | MCP Inspector   |
| Tool returns valid JSON                       | Unit test       |
| JSON contains key stages, subjects, workflows | JSON validation |
| ChatGPT can use ontology for tool guidance    | Manual testing  |
| No type errors                                | `pnpm build`    |
| Existing tests pass                           | `pnpm test`     |

### Metadata Requirements

| Criterion                                       | Test Method             |
| ----------------------------------------------- | ----------------------- |
| Tool has `annotations.readOnlyHint: true`       | Unit test on descriptor |
| Tool has `annotations.title`                    | Unit test on descriptor |
| Tool has `annotations.idempotentHint: true`     | Unit test on descriptor |
| Tool has `_meta["openai/toolInvocation/*"]`     | Unit test on descriptor |
| Description includes "Use when" and "Do NOT"    | Manual review           |
| Tool descriptor follows schema-first principles | Code review             |

---

## Success Metrics

**Value Validation Questions:**

1. Does ChatGPT reference the ontology when asked about curriculum structure?
2. Does ChatGPT use workflow guidance to compose tool calls?
3. Does having ontology reduce "how do I find X" clarification questions?
4. Is the static content structure suitable for the full implementation?

**If YES to most questions:** Proceed with Plan 02 (full implementation)  
**If NO:** Investigate why and adjust approach before investing in full solution

---

## Limitations (By Design)

This POC intentionally does NOT include:

- ❌ Schema extraction from OpenAPI (Plan 02)
- ❌ MCP resource exposure (Plan 02 - dual tool+resource)
- ❌ Multiple format variants (full/summary/schema-only)
- ❌ Filtering by entity type
- ❌ Relationship traversal
- ❌ Automatic updates when schema changes
- ❌ Output schema validation (Phase 5 of Plan 01)

These are all addressed in **02-curriculum-ontology-resource-plan.md**.

### Why Tool-Only for POC

Per the [Design Decision](#design-decision-tool-vs-resource) above:

1. **Model-controlled access** - ChatGPT decides when to request ontology
2. **Full metadata support** - Annotations, `_meta`, status text
3. **Simpler validation** - One pattern to test before adding resource exposure

The full implementation (Plan 02) will evaluate adding a parallel **resource** (`curriculum://ontology`) for:

- Clients that prefer to pre-inject context
- Agents that benefit from automatic context attachment

---

## Maintenance

**When to update the static file:**

- New key stages added (unlikely)
- New subjects added (occasionally)
- Tool names change (rare)
- Workflow guidance needs adjustment (based on testing)

**This is a temporary solution.** The static file becomes a maintenance burden over time, which is why Plan 02 exists to auto-generate from schema.

---

## Quality Gates

```bash
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # Unit tests pass
```

---

## TDD Reminder

Per `testing-strategy.md`:

> "Write tests **FIRST**. Red → Green → Refactor"

### Test Plan

#### 1. Tool Descriptor Tests (Unit)

```typescript
describe('get-ontology tool descriptor', () => {
  it('should have readOnlyHint annotation set to true', () => {
    // RED: Write this test first
  });

  it('should have idempotentHint annotation set to true', () => {
    // RED: Write this test first
  });

  it('should have title annotation', () => {
    // RED: Write this test first
  });

  it('should have openai/toolInvocation metadata', () => {
    // RED: Write this test first
  });

  it('should have description with "Use when" guidance', () => {
    // RED: Write this test first
  });
});
```

#### 2. Tool Handler Tests (Unit)

```typescript
describe('get-ontology handler', () => {
  it('should return valid JSON content', () => {
    // RED: Write this test first
  });

  it('should include curriculumStructure in response', () => {
    // RED: Write this test first
  });

  it('should include toolUsageGuidance in response', () => {
    // RED: Write this test first
  });
});
```

#### 3. Integration Tests

```typescript
describe('get-ontology MCP integration', () => {
  it('should appear in tools/list response', () => {
    // RED: Write this test first
  });

  it('should respond to tools/call with valid content', () => {
    // RED: Write this test first
  });
});
```

### TDD Flow

1. **RED**: Write failing tests for descriptor metadata and handler response
2. **GREEN**: Implement tool definition and handler to pass tests
3. **REFACTOR**: Clean up, ensure schema-first alignment, add inline docs

---

## Related Plans

- **02-curriculum-ontology-resource-plan.md** - Full implementation (replaces this POC)
- **03-mcp-infrastructure-advanced-tools-plan.md** - Advanced tools that consume ontology
- **upstream-api-metadata-wishlist.md (Item 3)** - Ideal upstream `/ontology` endpoint
