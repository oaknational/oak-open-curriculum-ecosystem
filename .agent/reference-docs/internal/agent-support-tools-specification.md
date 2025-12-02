# Agent Support Tools and Resources Specification

## Overview

Agent support tools are MCP primitives designed to help AI agents understand the Oak curriculum domain model before using other tools. They provide context grounding that reduces errors, improves tool selection, and enables more effective interactions.

**Current agent support tools:**

- `get-help` - Returns server overview, tool categories, workflows, and tips
- `get-ontology` - Returns curriculum structure, entity hierarchy, and domain model

**Current agent support resources:**

- `curriculum://ontology` - JSON resource exposing the same ontology data as `get-ontology`

## Architecture Reference

See [ADR-058: Context Grounding for AI Agents](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md) for the architectural decision and rationale.

## MCP Primitive Audiences

| Primitive     | Control                | Who Controls            | Model Sees Directly?                           |
| ------------- | ---------------------- | ----------------------- | ---------------------------------------------- |
| **Tools**     | Model-controlled       | LLM decides to call     | Yes (tools/list, structuredContent)            |
| **Resources** | Application-controlled | Client app surfaces     | No (unless app injects into context)           |
| **Prompts**   | User-controlled        | User explicitly invokes | No (user sees options, model receives message) |

**Implication:** For ChatGPT, tools are the primary context path. Resources exist for MCP clients that pre-inject context (e.g., Claude Desktop).

---

## Integration Points Checklist

When adding a new agent support tool or resource, update ALL of the following:

### 1. SDK: Tool Guidance Data (Source of Truth)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-data.ts`

Add the tool to `toolCategories.agentSupport`:

```typescript
export const toolCategories: ToolCategories = {
  agentSupport: {
    description: 'Tools for understanding the curriculum before searching or browsing.',
    tools: ['get-help', 'get-ontology', 'your-new-tool'],
  },
  // ...
};
```

If the tool has associated workflows, add to `workflows`:

```typescript
export const workflows: Workflows = {
  userInteractions: {
    title: 'When finding or presenting Oak content for the user',
    description: '...',
    steps: [
      { tool: 'get-help', purpose: '...', returns: '...' },
      { tool: 'your-new-tool', purpose: '...', returns: '...' },
    ],
  },
  // ...
};
```

### 2. SDK: Ontology Data (If Domain-Related)

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts`

If the new tool exposes domain model information, add or update the `ontologyData` structure:

```typescript
export const ontologyData: OntologyData = {
  curriculumStructure: {
    /* ... */
  },
  entityHierarchy: {
    /* ... */
  },
  threads: {
    /* ... */
  },
  workflows: {
    /* imported from tool-guidance-data */
  },
  // Add new sections as needed
};
```

### 3. SDK: Tool Registration

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

Register the tool with the MCP server:

```typescript
export function registerUniversalTools(server: McpServer): void {
  // ...
  server.registerTool(
    'your-new-tool',
    {
      title: 'Your New Tool',
      description: 'What this tool does for agents.',
      inputSchema: {
        /* ... */
      },
      annotations: { readOnlyHint: true },
      _meta: {
        'openai/outputTemplate': AGGREGATED_TOOL_WIDGET_URI,
        // ...
      },
    },
    async () => {
      return {
        structuredContent: {
          /* data for model */
        },
        content: [{ type: 'text', text: 'Summary for model' }],
      };
    },
  );
}
```

### 4. SDK: Documentation Resources

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.ts`

Ensure `getToolsReferenceMarkdown()` includes the `agentSupport` category:

```typescript
export function getToolsReferenceMarkdown(): string {
  // ...
  result += categorySection('Agent Support', toolCategories.agentSupport);
  // ...
}
```

### 5. SDK: Prompt Messages

**File:** `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

Update prompt message functions to suggest calling the new tool:

```typescript
function getFindLessonsMessages(args: PromptArgs): PromptMessage[] {
  return [
    {
      role: 'user',
      content: {
        type: 'text',
        text: `Before searching, you may want to call get-ontology or your-new-tool to understand...`,
      },
    },
  ];
}
```

### 6. SDK: Public Exports

**File:** `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`

Export any new modules:

```typescript
export { YOUR_NEW_RESOURCE, getYourNewContent } from '../mcp/your-new-resource.js';
```

### 7. SDK: Build Configuration

**File:** `packages/sdks/oak-curriculum-sdk/tsup.config.ts`

Add new source files to the entry array:

```typescript
entry: [
  // ...
  'src/mcp/your-new-resource.ts',
],
```

### 8. App: Widget Renderer

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/your-tool-renderer.ts`

Create a renderer function for the ChatGPT widget:

```typescript
export const YOUR_TOOL_RENDERER = `
function renderYourTool(o) {
  let h = '';
  // Render human-friendly UI
  // Note: Agent-only data (like workflows) should NOT be rendered
  return h;
}
`.trim();
```

### 9. App: Widget Renderer Index

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/index.ts`

Import and export the renderer:

```typescript
import { YOUR_TOOL_RENDERER } from './your-tool-renderer.js';

export const WIDGET_RENDERER_FUNCTIONS = [
  // ...
  YOUR_TOOL_RENDERER,
].join('\n\n');

export const RENDERER_FUNCTION_NAMES: Readonly<Record<string, string>> = {
  // ...
  yourTool: 'renderYourTool',
};
```

### 10. App: Widget Renderer Registry

**File:** `apps/oak-curriculum-mcp-streamable-http/src/widget-renderer-registry.ts`

Map the tool name to the renderer:

```typescript
export const TOOL_RENDERER_MAP: Readonly<Record<string, string>> = {
  // ...
  'your-new-tool': 'yourTool',
};
```

### 11. App: Resource Registration (If Resource)

**File:** `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

Register the resource with the MCP server:

```typescript
import {
  YOUR_NEW_RESOURCE,
  getYourNewContent,
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
          text: getYourNewContent(),
        },
      ],
    }),
  );
}

export function registerAllResources(server: McpServer): void {
  // ...
  registerYourNewResource(server);
}
```

---

## Testing Requirements

### Unit Tests (SDK)

**Files:**

- `packages/sdks/oak-curriculum-sdk/src/mcp/your-new-resource.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/documentation-resources.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts`

Required assertions:

```typescript
// Resource/tool definition tests
it('has correct URI/name', () => {
  /* ... */
});
it('returns valid JSON/content', () => {
  /* ... */
});

// Documentation resource tests
it('includes your-new-tool in agentSupport category', () => {
  const markdown = getToolsReferenceMarkdown();
  expect(markdown).toContain('your-new-tool');
});

// Prompt tests
it('suggests calling your-new-tool', () => {
  const messages = getPromptMessages('find-lessons', {});
  expect(messages[0].content.text).toContain('your-new-tool');
});
```

### E2E Tests (App)

**File:** `apps/oak-curriculum-mcp-streamable-http/e2e-tests/documentation-resources.e2e.test.ts`

Required assertions:

```typescript
it('your-new-resource appears in resources/list', async () => {
  /* ... */
});
it('your-new-resource returns expected content', async () => {
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

## Example: Adding a Hypothetical `get-glossary` Tool

1. Add to `toolCategories.agentSupport` in `tool-guidance-data.ts`
2. Create `glossary-data.ts` with curriculum terminology
3. Register tool in `universal-tools.ts`
4. Update `documentation-resources.ts` to include in agent support section
5. Update prompt messages to suggest `get-glossary`
6. Export from `public/mcp-tools.ts`
7. Add to `tsup.config.ts` entry
8. Create `glossary-renderer.ts` for widget
9. Add to `widget-renderers/index.ts`
10. Map in `widget-renderer-registry.ts`
11. Write unit tests for glossary data and resource
12. Write E2E tests for glossary endpoint
13. Write UI tests for glossary renderer
14. Run all quality gates
15. Update ADR-058 if architectural changes needed

---

## Related Documentation

- [ADR-058: Context Grounding for AI Agents](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [OpenAI Apps SDK Reference](../openai-apps/openai-apps-sdk-reference.md)
- [OpenAI Apps Build UI](../openai-apps/openai-apps-build-ui.md)
- [Testing Strategy](../../directives-and-memory/testing-strategy.md)
- [Schema-First Execution](../../directives-and-memory/schema-first-execution.md)
