# Agent Support Tools and Resources Specification

## Overview

Agent support tools are MCP primitives designed to help AI agents understand the Oak curriculum domain model before using other tools. They provide context grounding that reduces errors, improves tool selection, and enables more effective interactions.

**Current agent support tools:**

- `get-help` - Returns server overview, tool categories, workflows, and tips
- `get-ontology` - Returns curriculum structure, entity hierarchy, and domain model definitions
- `get-knowledge-graph` - Returns concept TYPE relationships and domain structure graph

**Current agent support resources:**

- `curriculum://ontology` - JSON resource exposing the same ontology data as `get-ontology`
- `curriculum://knowledge-graph` - JSON resource exposing the same graph data as `get-knowledge-graph`

## Architecture Reference

See the following ADRs for architectural decisions and rationale:

- [ADR-058: Context Grounding for AI Agents](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](../../../docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md)
- [ADR-060: Agent Support Tool Metadata System](../../../docs/architecture/architectural-decisions/060-agent-support-metadata-system.md)

## Single Source of Truth: Agent Support Tool Metadata

All agent support tools are defined in a **single source of truth**:

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`

This metadata drives:

- Server instructions in MCP initialize response
- Context hints in tool responses
- Cross-references between tools
- Tool relationship encoding

### Metadata Structure

```typescript
export const AGENT_SUPPORT_TOOL_METADATA = {
  'get-ontology': {
    name: 'get-ontology',
    shortDescription: 'Domain model definitions',
    provides: ['key stages', 'subjects', 'entity hierarchy', 'ID formats'],
    purpose: 'understand WHAT curriculum concepts are and what they mean',
    callOrder: 1,
    complementsTools: ['get-knowledge-graph', 'get-help'],
    seeAlso: 'get-knowledge-graph for structural relationships, get-help for tool usage',
    callAtStart: true,
  },
  // ... other tools
} as const;
```

### Adding a New Agent Support Tool (Quick Start)

1. **Add metadata** to `AGENT_SUPPORT_TOOL_METADATA` in `agent-support-tool-metadata.ts`
2. **Add tool name** to `toolCategories.agentSupport.tools` in `tool-guidance-data.ts`
3. **Run tests**: `pnpm test agent-support-tool-metadata`
4. All downstream artifacts update automatically!

See ADR-060 for the full architectural decision.

## MCP Primitive Audiences

| Primitive     | Control                | Who Controls            | Model Sees Directly?                           |
| ------------- | ---------------------- | ----------------------- | ---------------------------------------------- |
| **Tools**     | Model-controlled       | LLM decides to call     | Yes (tools/list, structuredContent)            |
| **Resources** | Application-controlled | Client app surfaces     | No (unless app injects into context)           |
| **Prompts**   | User-controlled        | User explicitly invokes | No (user sees options, model receives message) |

**Implication:** For ChatGPT, tools are the primary context path. Resources exist for MCP clients that pre-inject context (e.g., Claude Desktop).

---

## Agent Discoverability Channels

Agent support tools need to be discoverable through multiple channels to ensure models know to call them. When adding a new agent support tool, ensure it appears in ALL of these places:

### 1. Server Instructions (Initialize Response)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

The `SERVER_INSTRUCTIONS` constant is sent in the MCP `initialize` response. This is the **highest priority** guidance because:

- It's delivered ONCE at connection time before any tool calls
- It's always visible to the model (unlike tool descriptions which may be truncated)
- It sets expectations for the entire conversation

```typescript
export const SERVER_INSTRUCTIONS = `Oak Curriculum MCP Server - AI Agent Guidance

For optimal results, call these agent support tools at conversation start:

1. get-ontology - Domain model definitions: key stages, subjects, entity hierarchy, ID formats
2. get-knowledge-graph - Concept TYPE relationships: how curriculum entities connect structurally  
3. get-help - Tool usage guidance: categories, workflows, tips

These tools are read-only and idempotent. Call them first to reduce errors when using search, fetch, and browsing tools.` as const;
```

**App Integration:** `apps/oak-curriculum-mcp-streamable-http/src/application.ts`

```typescript
import { SERVER_INSTRUCTIONS } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

const server = new McpServer(
  { name: 'oak-curriculum-http', version: '0.1.0' },
  { instructions: SERVER_INSTRUCTIONS },
);
```

### 2. Context Hints (Tool Response Payloads)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

The `OAK_CONTEXT_HINT` is included in `structuredContent` of every tool response, reinforcing guidance after each tool call:

```typescript
export const OAK_CONTEXT_HINT =
  'For optimal results with Oak curriculum tools, call get-ontology for domain definitions, get-knowledge-graph for concept relationships, and get-help for usage guidance.' as const;
```

### 3. Tool Descriptions (Prerequisite Guidance)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

Each tool description should include prerequisite guidance directing to relevant agent support tools:

```typescript
export const AGGREGATED_PREREQUISITE_GUIDANCE =
  `PREREQUISITE: If unfamiliar with Oak's curriculum structure, call \`get-ontology\` first to understand key stages, subjects, entity hierarchy, and ID formats.` as const;
```

### 4. MCP Prompts

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

User-initiated prompts should suggest calling agent support tools:

```typescript
text: `You may want to call get-ontology for domain definitions, get-knowledge-graph for concept relationships, and get-help for tool usage guidance.`;
```

### 5. Tool Guidance Data (Tips)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`

The tips array returned by `get-help` should mention all agent support tools:

```typescript
tips: [
  'Use get-ontology for domain understanding (what things mean), get-knowledge-graph for structure (how things connect).',
  // ...
],
```

### 6. Cross-References Between Tools

Each agent support tool should reference the others:

- **ontology-data.ts**: `seeAlso: 'Call get-knowledge-graph for concept TYPE relationships'`
- **knowledge-graph-data.ts**: `seeOntology: 'Call get-ontology for rich definitions and guidance'`

---

## Integration Points Checklist

When adding a new agent support tool or resource, update ALL of the following:

### Phase 1: SDK Core Implementation

#### 1.1 Tool Guidance Data (Source of Truth)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`

Add the tool to `toolCategories.agentSupport`:

```typescript
agentSupport: {
  tools: ['get-help', 'get-ontology', 'get-knowledge-graph', 'your-new-tool'],
  description: 'Tools for understanding Oak Curriculum system and how to use the tools.',
  // ...
},
```

#### 1.2 Tool Guidance Types

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-types.ts`

Add the tool name to the `AggregatedToolName` union:

```typescript
export type AggregatedToolName =
  | 'search'
  | 'fetch'
  | 'get-ontology'
  | 'get-help'
  | 'get-knowledge-graph'
  | 'your-new-tool';
```

#### 1.3 Create Tool Data File

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/your-new-tool-data.ts`

Create the static data structure using `as const` for type safety:

```typescript
export const yourNewToolData = {
  version: '1.0.0',
  // ... your data structure
} as const;

export type YourNewToolData = typeof yourNewToolData;
```

#### 1.4 Create Tool Definition

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-your-new-tool.ts`

Define the tool with appropriate annotations and \_meta:

```typescript
export const YOUR_NEW_TOOL_DEF = {
  description: `Your tool description.\n\n${ONTOLOGY_RECOMMENDED_FIRST_STEP}`,
  inputSchema: YOUR_NEW_TOOL_INPUT_SCHEMA,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Your Tool Title',
  },
  _meta: {
    'openai/outputTemplate': AGGREGATED_TOOL_WIDGET_URI,
    'openai/toolInvocation/invoking': 'Loading your data…',
    'openai/toolInvocation/invoked': 'Data loaded',
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
  },
} as const;

export function runYourNewTool(): CallToolResult {
  return formatOptimizedResult({
    data: yourNewToolData,
    status: 'success',
    timestamp: Date.now(),
    toolName: 'your-new-tool',
    annotationsTitle: 'Your Tool Title',
  });
}
```

### Phase 2: SDK Tool Registration

#### 2.1 Universal Tools Definitions

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`

Add the tool to the aggregated tool definitions map:

```typescript
import { YOUR_NEW_TOOL_DEF } from '../aggregated-your-new-tool.js';

export const AGGREGATED_TOOL_DEFS = {
  // ...existing tools
  'your-new-tool': YOUR_NEW_TOOL_DEF,
} as const;
```

#### 2.2 Universal Tools Type Guards

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/type-guards.ts`

**CRITICAL:** Add the tool name to `isAggregatedToolName`:

```typescript
export function isAggregatedToolName(value: string): value is AggregatedToolName {
  return (
    value === 'search' ||
    value === 'fetch' ||
    value === 'get-ontology' ||
    value === 'get-help' ||
    value === 'get-knowledge-graph' ||
    value === 'your-new-tool' // <-- ADD THIS
  );
}
```

> **Why this is critical:** The executor dispatches to aggregated tools based on this type guard. If the tool name is not included, the executor will not recognize it and the tool will fail with an error.

#### 2.3 Universal Tools Executor

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts`

Add dispatch logic for the new tool:

```typescript
import { runYourNewTool } from '../aggregated-your-new-tool.js';

// In executeAggregatedTool function:
if (name === 'your-new-tool') {
  return runYourNewTool();
}
```

### Phase 3: Resource (If Applicable)

#### 3.1 Create Resource File

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/your-new-tool-resource.ts`

```typescript
export const YOUR_NEW_RESOURCE = {
  name: 'your-new-resource',
  uri: 'curriculum://your-new-resource',
  description: 'Description for resource listings',
  mimeType: 'application/json' as const,
} as const;

export function getYourNewResourceJson(): string {
  return JSON.stringify(yourNewToolData, null, 2);
}
```

#### 3.2 Register Resource in App

**File:** `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

```typescript
import {
  YOUR_NEW_RESOURCE,
  getYourNewResourceJson,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

export function registerYourNewResource(server: McpServer): void {
  server.registerResource(
    YOUR_NEW_RESOURCE.name,
    YOUR_NEW_RESOURCE.uri,
    {
      description: YOUR_NEW_RESOURCE.description,
      mimeType: YOUR_NEW_RESOURCE.mimeType,
    },
    () => ({
      contents: [
        {
          uri: YOUR_NEW_RESOURCE.uri,
          mimeType: YOUR_NEW_RESOURCE.mimeType,
          text: getYourNewResourceJson(),
        },
      ],
    }),
  );
}

// Add to registerAllResources
export function registerAllResources(server: McpServer): void {
  // ...existing resources
  registerYourNewResource(server);
}
```

### Phase 4: Discoverability Updates

#### 4.1 Update Server Instructions

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

Add your tool to `SERVER_INSTRUCTIONS`:

```typescript
export const SERVER_INSTRUCTIONS = `...
1. get-ontology - ...
2. get-knowledge-graph - ...
3. get-help - ...
4. your-new-tool - Description of what it provides
...` as const;
```

#### 4.2 Update Context Hint

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

Update `OAK_CONTEXT_HINT` to mention your tool:

```typescript
export const OAK_CONTEXT_HINT = 'For optimal results..., and your-new-tool for X.' as const;
```

#### 4.3 Update MCP Prompts

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

Update prompt messages to suggest calling your tool.

#### 4.4 Add Cross-References

Update existing agent support tools to reference your new tool where appropriate.

### Phase 5: Public API and Build

#### 5.1 Public Exports

**File:** `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`

```typescript
export { YOUR_NEW_RESOURCE, getYourNewResourceJson } from '../mcp/your-new-tool-resource.js';
```

#### 5.2 Build Configuration

**File:** `packages/sdks/oak-curriculum-sdk/tsup.config.ts`

The SDK uses grouped annotated globs in its `entry` array.
New files placed under `src/mcp/` are automatically included
by the `'src/mcp/**/*.ts'` glob — no manual entry changes
needed. You only need to edit `tsup.config.ts` when adding
a new top-level module area (a new `src/<area>/` directory).

### Phase 6: Widget Rendering

#### 6.1 Create Widget Renderer

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/your-tool-renderer.ts`

```typescript
export const YOUR_TOOL_RENDERER = `
function renderYourTool(o) {
  let h = '';
  // Render human-friendly UI
  // Note: Agent-only data should NOT be rendered
  return h;
}
`.trim();
```

#### 6.2 Register Renderer

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/index.ts`

```typescript
import { YOUR_TOOL_RENDERER } from './your-tool-renderer.js';

export const WIDGET_RENDERER_FUNCTIONS = [
  // ...existing renderers
  YOUR_TOOL_RENDERER,
].join('\n\n');

export const RENDERER_FUNCTION_NAMES: Readonly<Record<string, string>> = {
  // ...existing mappings
  yourTool: 'renderYourTool',
};
```

#### 6.3 Map Tool to Renderer

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts`

```typescript
export const TOOL_RENDERER_MAP: Readonly<Record<string, string>> = {
  // ...existing mappings
  'your-new-tool': 'yourTool',
};
```

---

## Testing Requirements

### Unit Tests (SDK)

**Files:**

- `packages/sdks/oak-curriculum-sdk/src/mcp/your-new-tool-data.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-your-new-tool.unit.test.ts`

Required assertions:

```typescript
// Data structure tests
it('has valid version format', () => {
  /* ... */
});
it('has required fields', () => {
  /* ... */
});
it('is within size budget', () => {
  /* ... */
});

// Tool definition tests
it('has correct inputSchema', () => {
  /* ... */
});
it('has correct annotations', () => {
  /* ... */
});
it('has _meta with toolName', () => {
  /* ... */
});

// Idempotency test
it('returns identical data on repeated calls (idempotent)', () => {
  const first = runYourNewTool();
  const second = runYourNewTool();
  expect(first.structuredContent).toEqual(second.structuredContent);
});
```

### Integration Tests (SDK)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.integration.test.ts`

Required assertions:

```typescript
// Update the aggregatedNames array
const aggregatedNames = [
  'search',
  'fetch',
  'get-ontology',
  'get-help',
  'get-knowledge-graph',
  'your-new-tool',
];

// Add annotation tests
it('your-new-tool has correct annotations', () => {
  /* ... */
});
it('your-new-tool has OpenAI _meta fields', () => {
  /* ... */
});
```

### E2E Tests (App)

**File:** `apps/oak-curriculum-mcp-streamable-http/e2e-tests/your-new-tool.e2e.test.ts`

Required assertions:

```typescript
it('tool appears in tools/list', async () => {
  /* ... */
});
it('tool returns structuredContent', async () => {
  /* ... */
});
it('resource appears in resources/list', async () => {
  /* ... */
});
it('resource returns valid JSON', async () => {
  /* ... */
});
```

### UI Tests (Widget)

**File:** `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts`

Required assertions:

```typescript
it('routes your-new-tool to your-tool renderer', async () => {
  /* ... */
});
it('your-tool renderer displays expected UI elements', async () => {
  /* ... */
});
```

---

## Widget Rendering Guidelines

### What TO Render

- Server overview and descriptions
- Tool categories with tool names
- Tips for effective usage
- Key structure information (key stages, subjects)
- Links to Oak resources

### What NOT TO Render

- **Workflows** - These are for the model to understand tool sequences, not for human display
- **Detailed step-by-step instructions** - Model-oriented, not user-oriented
- **Internal IDs or slugs** - Show human-readable names instead
- **Raw JSON** - Transform into readable UI components

### Rationale

From the OpenAI Apps SDK reference:

> `structuredContent` - Surfaced to the model and the component
> `_meta` - Delivered only to the component. Hidden from the model.

Agent support tools use `structuredContent` so the model receives the guidance. The widget renderer then selectively displays what's appropriate for humans while the full data remains available to the model.

---

## Quality Gates

Before merging changes to agent support tools/resources, run:

```bash
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

All gates must pass.

---

## Related Documentation

- [ADR-058: Context Grounding for AI Agents](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [ADR-059: Knowledge Graph for Agent Context](../../../docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md)
- [OpenAI Apps SDK Reference](../openai-apps/openai-apps-sdk-reference.md)
- [OpenAI Apps Build MCP Server](../openai-apps/openai-apps-sdk-build-mcp-server.md)
- [MCP TypeScript SDK](../mcp-typescript-sdk-readme.md)
- [Testing Strategy](../../directives/testing-strategy.md)
- [Schema-First Execution](../../directives/schema-first-execution.md)
