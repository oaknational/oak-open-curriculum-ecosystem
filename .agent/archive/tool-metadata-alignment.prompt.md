# Tool Metadata Alignment - Pre-Merge Cleanup

## Context

Before merging the OAuth implementation, we need to ensure all MCP tools have proper metadata. This includes both **generated tools** (from OpenAPI schema) and **aggregated tools** (search, fetch).

## Directive Documents (MUST follow)

Read and follow these directives:

- `.agent/directives/rules.md` - TDD, no type shortcuts, fail fast
- `.agent/directives/testing-strategy.md` - TDD at ALL levels
- `.agent/directives/schema-first-execution.md` - Generated artifacts drive runtime

## Reference Documents

- `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/api-schema-sdk.json` - OpenAPI schema that we are working from to generate the MCP tools.
- `.agent/reference-docs/mcp-docs-for-agents.md` - MCP specification (search for "ToolAnnotations")
- `.agent/reference-docs/mcp-typescript-sdk-readme.md` - SDK usage patterns
- `.agent/reference-docs/openai-apps-sdk-guidance.md` - OpenAI Apps requirements

---

## Tasks

### Task 1: Audit Aggregated Tools vs Generated Tools

Compare the metadata on aggregated tools (`search`, `fetch`) with generated tools.

**Aggregated tools location**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

Current aggregated tool metadata:

```typescript
export const AGGREGATED_TOOL_DEFS = {
  search: {
    description: '...',
    inputSchema: SEARCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  },
  fetch: {
    description: '...',
    inputSchema: FETCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  },
};
```

**Generated tools location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/`

**Questions to answer**:

1. Do generated tools have `title` field? If so, aggregated tools need it.
2. Do generated tools have `annotations` field? If so, aggregated tools need it.
3. Are there any other metadata fields on generated tools that aggregated tools are missing?
4. Are there any metadata fields that generated tools are missing? For instance, the upstream API has a rate limit of about 1000 requests per hour, which is not currently reflected in the generated tools, the current limit and reset time can always be fetched from the `/rate-limit` endpoint.

### Task 2: Add `readOnlyHint` to All Tools

**Problem**: By default, MCP tools have `readOnlyHint: false`, meaning they are treated as "write" tools. All our tools are actually read-only (GET operations).

**MCP Spec** (from `.agent/reference-docs/mcp-docs-for-agents.md`):

```typescript
ToolAnnotations {
  readOnlyHint?: boolean;    // If true, the tool does not modify its environment. Default: false
  destructiveHint?: boolean; // If true, may perform destructive updates. Default: true (only meaningful when readOnlyHint == false)
  idempotentHint?: boolean;  // If true, repeated calls have no additional effect. Default: false (only meaningful when readOnlyHint == false)
  openWorldHint?: boolean;   // If true, may interact with open world. Default: true
  title?: string;            // Human-readable title
}
```

For all of our tools:

```typescript
readOnlyHint: true;
destructiveHint: false;
idempotentHint: true;
openWorldHint: false; // They only access fixed data provided by the upstream API.
title: string;
```

**OpenAI Apps Guidance** (from `.agent/reference-docs/openai-apps-sdk-guidance.md`):

> "Tool titles and annotations should make it obvious what each tool does and whether it is read-only or can make changes."
>
> "Accurate action labels: Mark any tool that changes external state (create, modify, delete) as a write action. Read-only tools must be side-effect-free and safe to retry."

**Solution Approach**:

For **generated tools** (schema-first):

- Modify the type-gen templates to add `annotations: { readOnlyHint: true }` to all tools
- Location: `type-gen/typegen/mcp-tools/` templates
- This ensures annotations flow from generation, not manual code

For **aggregated tools**:

- Add annotations to `AGGREGATED_TOOL_DEFS` in `universal-tools.ts`

---

## Implementation Plan

### Phase 1: Understand Current State

1. Read the generated tool descriptors to understand their structure
2. Read the aggregated tool definitions
3. Check what metadata fields exist in the MCP SDK types

### Phase 2: Update Generated Tools (Schema-First)

1. **Find the type-gen template** that generates tool descriptors
2. **Add annotations** at generation time: `annotations: { readOnlyHint: true }`
3. **Run type-gen**: `pnpm type-gen`
4. **Verify** the generated files have the new annotations

### Phase 3: Update Aggregated Tools

1. **Update `AGGREGATED_TOOL_DEFS`** to include annotations:

```typescript
export const AGGREGATED_TOOL_DEFS = {
  search: {
    description: '...',
    inputSchema: SEARCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    annotations: { readOnlyHint: true },
  },
  fetch: {
    description: '...',
    inputSchema: FETCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
    annotations: { readOnlyHint: true },
  },
};
```

2. **Update `UniversalToolListEntry` interface** if needed to include annotations type
3. **Update `listUniversalTools()`** to pass through annotations

### Phase 4: Update Handler Registration

1. **Check `handlers.ts`** in the streamable-http app
2. **Ensure annotations are passed** to `server.registerTool()`

```typescript
const config = {
  title: tool.name,
  description: tool.description ?? tool.name,
  inputSchema: input,
  securitySchemes: tool.securitySchemes,
  annotations: tool.annotations, // Add this
};
```

### Phase 5: Quality Gates

Run all quality gates:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm test
pnpm test:e2e
```

---

## Key Files

### SDK (type generation and tool definitions)

| File                                                            | Purpose                     |
| --------------------------------------------------------------- | --------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`   | Aggregated tool definitions |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search.ts` | Search tool implementation  |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`  | Fetch tool implementation   |
| `type-gen/typegen/mcp-tools/`                                   | Type generation templates   |

### Streamable HTTP App (tool registration)

| File                                                      | Purpose                        |
| --------------------------------------------------------- | ------------------------------ |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` | Tool registration with MCP SDK |

---

## MCP SDK Types Reference

From `@modelcontextprotocol/sdk/types.js`:

```typescript
interface ToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
  title?: string;
}

interface Tool {
  name: string;
  description?: string;
  inputSchema: object;
  annotations?: ToolAnnotations;
}
```

---

## Success Criteria

- [ ] All generated tools have `annotations: { readOnlyHint: true }`
- [ ] Aggregated tools (search, fetch) have same metadata fields as generated tools
- [ ] Annotations are passed through to `server.registerTool()`
- [ ] All quality gates pass
- [ ] `pnpm type-gen` regenerates tools with annotations (schema-first compliance)

---

## Notes

### Schema-First Compliance

Per `.agent/directives/schema-first-execution.md`:

> "Every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts"

The annotations for generated tools MUST be added at type-gen time, not manually in runtime code.

### Why This Matters

1. **OpenAI Apps compliance**: ChatGPT shows tool metadata to users before execution
2. **MCP spec compliance**: Proper tool annotations help clients make informed decisions
3. **User safety**: Read-only tools can be executed without confirmation prompts in some clients

### TDD Reminder

Per `.agent/directives/testing-strategy.md`:

> "Write tests **FIRST**. Red → Green → Refactor"

Remember: tests are written to prove the behaviour of the code, not the implementation details.
