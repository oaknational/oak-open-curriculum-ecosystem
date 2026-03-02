# Test Plan: B3 Hybrid Approach for `tools/list` Override

## Objective

Validate whether we can use `McpServer` for tool registration (keeping Zod validation on `tools/call`) while overriding the `tools/list` response via `server.server.setRequestHandler()` to return our generated JSON Schema with `examples` arrays intact.

## Context

### The Problem

- MCP SDK's `registerTool()` converts Zod schemas to JSON Schema for `tools/list` responses
- Zod doesn't support `examples`, so they're lost in the conversion
- We already generate JSON Schema with examples at type-gen time (`tool.inputSchema`)

### The Proposed Solution (B3)

- Keep using `McpServer` for tool registration (Zod validation works for `tools/call`)
- Access the internal low-level Server via `mcpServer.server`
- Override `tools/list` handler to return our JSON Schema directly

## Test Phases

### Phase 1: Verify Internal Server Access

**Goal**: Confirm `mcpServer.server` is accessible and has `setRequestHandler`.

**Test Steps**:

1. Create a minimal test that instantiates `McpServer`
2. Assert `server.server` exists and is an object
3. Assert `server.server.setRequestHandler` is a function

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/__tests__/mcp-server-internal-access.unit.test.ts`

```typescript
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

describe('McpServer internal server access', () => {
  it('exposes internal server via .server property', () => {
    const mcpServer = new McpServer({ name: 'test', version: '1.0.0' });
    expect(mcpServer.server).toBeDefined();
    expect(typeof mcpServer.server).toBe('object');
  });

  it('internal server has setRequestHandler method', () => {
    const mcpServer = new McpServer({ name: 'test', version: '1.0.0' });
    expect(typeof mcpServer.server.setRequestHandler).toBe('function');
  });
});
```

### Phase 2: Handler Override Precedence

**Goal**: Confirm custom handler can override the SDK's default `tools/list` behavior.

**Test Steps**:

1. Create `McpServer`, register a tool
2. Set custom `tools/list` handler via `server.server.setRequestHandler()`
3. Simulate `tools/list` request
4. Verify custom handler response is returned, not SDK default

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/__tests__/tools-list-override.integration.test.ts`

**Key Question**: Does `setRequestHandler` called AFTER `registerTool` override the SDK's internal handler?

### Phase 3: Examples Preservation E2E

**Goal**: End-to-end verification that examples appear in actual `tools/list` HTTP response.

**Test Steps**:

1. Modify `registerHandlers` to include the override
2. Start server, send `tools/list` request
3. Assert `examples` arrays are present in `inputSchema` properties

**Location**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts` (update existing)

### Phase 4: Validation Still Works on tools/call

**Goal**: Confirm Zod validation still works for tool execution despite custom `tools/list`.

**Test Steps**:

1. With override in place, call a tool with invalid params
2. Verify Zod validation rejects the request
3. Call with valid params, verify success

**Location**: Existing E2E tests should cover this, verify they pass.

## Implementation Approach

### Step 1: Minimal Spike (30 min)

Create a spike branch to test the core hypothesis:

```typescript
// In application.ts after registerHandlers()
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

server.server.setRequestHandler(ListToolsRequestSchema, async () => {
  const tools = listUniversalTools();
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      title: tool.annotations?.title ?? tool.name,
      description: tool.description,
      inputSchema: tool.inputSchema, // JSON Schema WITH examples
      annotations: tool.annotations,
    })),
  };
});
```

Run E2E test to see if examples appear.

### Step 2: If Spike Succeeds

1. Write unit tests (Phase 1)
2. Write integration tests (Phase 2)
3. Implement properly with documentation
4. Update E2E tests (Phase 3)
5. Verify validation still works (Phase 4)

### Step 3: If Spike Fails

Document what went wrong:

- Does `setRequestHandler` not override after `registerTool`?
- Does the SDK somehow intercept before our handler?
- Are there type compatibility issues with the response shape?

## Documentation Requirements

If successful, document in:

1. **Inline (handlers.ts or application.ts)**:
   - WHY we override (MCP SDK limitation with Zod→JSON Schema conversion)
   - WHAT we're doing (returning our generated JSON Schema directly)
   - RISKS (must keep sync with SDK's expected response shape)

2. **Architecture Doc** (`.agent/architecture/mcp-tools-list-override.md`):
   - Full context of the problem
   - Alternative approaches considered
   - Why B3 was chosen
   - Maintenance considerations

## Risks and Mitigations

| Risk                                         | Mitigation                            |
| -------------------------------------------- | ------------------------------------- |
| SDK update changes internal server structure | Pin SDK version, add regression test  |
| Response shape incompatible                  | Validate against SDK's expected types |
| Handler doesn't override                     | Test precedence explicitly in Phase 2 |
| Breaks other MCP operations                  | Run full E2E suite after change       |

## Success Criteria

1. ✅ `tools/list` response contains `examples` arrays in `inputSchema.properties`
2. ✅ `tools/call` still validates input with Zod
3. ✅ All existing E2E tests pass
4. ✅ Implementation is well-documented
5. ✅ Unit tests cover the override mechanism

## Answer to Secondary Question

**Do we parse/use response schemas from the OpenAPI spec?**

Yes. The response schemas flow through:

1. **OpenAPI Spec** (`api-schema-sdk.json`) → contains response schemas like `LessonSummaryResponseSchema`
2. **`openapi-zod-client`** → generates `curriculumZodSchemas.ts` with Zod versions
3. **`response-map.ts`** → maps `operationId + status` → schema name
4. **`curriculum-response-validators.ts`** → uses schemas to validate API responses at runtime

The response schemas are used for **runtime validation** of upstream API responses, ensuring type safety when the SDK receives data from the Oak Curriculum API.
