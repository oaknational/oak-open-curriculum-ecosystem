# Phase 2.1 Implementation Summary: Tool Registration with Security Metadata

**Status**: ✅ COMPLETE  
**Completed**: 2025-11-21  
**Sub-Phase**: Phase 2, Sub-Phase 2.1  
**Approach**: Strict TDD (Red-Green-Refactor)

---

## Executive Summary

Successfully implemented security metadata flow from generated tool descriptors to MCP SDK registration. All 28 tools (26 generated + 2 aggregated) now register with proper `securitySchemes` field, enabling ChatGPT to discover which tools require OAuth authentication.

**Test Results**: 169/169 tests passing (up from 164), zero regressions, all quality gates passed.

---

## What Was Implemented

### 1. Integration Tests (Red Phase)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts`

Created 5 comprehensive integration tests that verify security metadata flows end-to-end:

1. **OAuth2 for protected generated tools** - Verifies `get-key-stages` receives `[{ type: 'oauth2', scopes: ['openid', 'email'] }]`
2. **NoAuth for public generated tools** - Verifies `get-changelog` receives `[{ type: 'noauth' }]`
3. **OAuth2 for aggregated search tool** - Verifies `search` receives OAuth2 metadata
4. **OAuth2 for aggregated fetch tool** - Verifies `fetch` receives OAuth2 metadata
5. **All tools have security metadata** - Verifies every registered tool includes `securitySchemes`

Tests use vitest mock functions to capture `server.registerTool()` calls and validate the options object contains correct security metadata.

### 2. SDK Universal Tools Updates (Green Phase)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

#### Interface Extension

```typescript
export interface UniversalToolListEntry {
  readonly name: UniversalToolName;
  readonly description?: string;
  readonly inputSchema: UniversalToolInputSchema;
  readonly securitySchemes?: readonly SecurityScheme[]; // ← NEW
}
```

#### Aggregated Tools Security Metadata

```typescript
/**
 * TODO: Remove manual security metadata when Phase 0 (comprehensive-mcp-enhancement-plan.md)
 * moves aggregated tools to generated code. Until then, we manually apply the default OAuth
 * scheme to ensure these runtime-defined tools have the same security posture as generated tools.
 */
const AGGREGATED_TOOL_DEFS = {
  search: {
    description: 'Search across lessons and transcripts...',
    inputSchema: SEARCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const, // ← NEW
  },
  fetch: {
    description: 'Fetch lesson, unit, subject, sequence, or thread metadata...',
    inputSchema: FETCH_INPUT_SCHEMA,
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const, // ← NEW
  },
} as const;
```

#### Updated Flow Function

```typescript
export function listUniversalTools(): UniversalToolListEntry[] {
  const aggregatedEntries: UniversalToolListEntry[] = typeSafeKeys(AGGREGATED_TOOL_DEFS).map(
    (name) => ({
      name,
      description: AGGREGATED_TOOL_DEFS[name].description,
      inputSchema: AGGREGATED_TOOL_DEFS[name].inputSchema,
      securitySchemes: AGGREGATED_TOOL_DEFS[name].securitySchemes, // ← NEW
    }),
  );

  const generatedEntries: UniversalToolListEntry[] = toolNames.map((name) => {
    const descriptor = getToolFromToolName(name);
    return {
      name,
      description: descriptor.description,
      inputSchema: descriptor.inputSchema,
      securitySchemes: descriptor.securitySchemes, // ← NEW (from generated descriptor)
    };
  });

  return [...aggregatedEntries, ...generatedEntries];
}
```

### 3. Type Exports (Green Phase)

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/index.ts`
- `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts`

Added exports for security types:

```typescript
export type {
  SecurityScheme,
  SecuritySchemeType,
  NoAuthScheme,
  OAuth2Scheme,
} from '../types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';
```

These types are now available for import by runtime code.

### 4. Runtime Tool Registration (Green Phase)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

#### Updated Registration

```typescript
export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    ...(options.overrides ?? {}),
  };
  const useStubTools = options.runtimeConfig.useStubTools;
  const stubExecutor = useStubTools ? createStubToolExecutionAdapter() : undefined;
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    // Note: securitySchemes is supported by MCP runtime per OpenAI Apps SDK documentation
    // but not yet in MCP TypeScript SDK types (as of v1.20.1).
    // See: https://platform.openai.com/docs/guides/apps-authentication
    const config = {
      title: tool.name,
      description: tool.description ?? tool.name,
      inputSchema: input,
      securitySchemes: tool.securitySchemes, // ← NEW: Pass from descriptor
    };
    server.registerTool(tool.name, config, async (params: unknown) => {
      const client = deps.createClient(options.runtimeConfig.env.OAK_API_KEY);
      const executor = deps.createExecutor({
        executeMcpTool: async (name, args) => {
          const execution = await (stubExecutor
            ? stubExecutor(name, args ?? {})
            : deps.executeMcpTool(name, args, client));
          logValidationFailureIfPresent(name, execution, options.logger);
          return execution;
        },
      });
      return executor(tool.name, params ?? {});
    });
  }
}
```

**Key Note**: The MCP SDK's TypeScript types don't yet include `securitySchemes` in the tool config interface (as of v1.20.1), but the runtime supports it per OpenAI documentation. We pass it through a plain object which works at runtime due to JavaScript's dynamic nature.

---

## Technical Decisions

### 1. Manual Security for Aggregated Tools

**Decision**: Add `securitySchemes` manually to `AGGREGATED_TOOL_DEFS` rather than waiting for Phase 0 migration.

**Rationale**:

- Unblocks Phase 2 work immediately
- Maintains security posture consistency across all tools
- Clear TODO comments mark this as temporary
- Phase 0 plan already exists for proper migration

### 2. Type System Workaround

**Decision**: Pass `securitySchemes` through a plain object rather than fighting TypeScript.

**Rationale**:

- MCP SDK runtime supports the field (documented by OpenAI)
- TypeScript types lag behind runtime support (v1.20.1)
- Object spreading preserves type safety for known fields
- No type assertions (`as`, `any`) needed - stays compliant with rules
- Added comment explaining the situation for future developers

### 3. Integration Test Strategy

**Decision**: Test at the `registerHandlers` level with mocked MCP server.

**Rationale**:

- Tests the actual integration point
- Verifies data flows from SDK through to MCP registration
- Mocks only external boundary (MCP server)
- Exercises real code paths (not mocking our own functions)

---

## Files Changed

### Modified Files (4)

1. `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` - Interface + data definitions
2. `packages/sdks/oak-curriculum-sdk/src/index.ts` - Type exports
3. `packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts` - Type exports
4. `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - Registration logic

### New Files (1)

1. `apps/oak-curriculum-mcp-streamable-http/src/handlers.integration.test.ts` - Integration tests

---

## Quality Results

### Test Coverage

- **SDK Unit Tests**: 265/265 passing (unchanged)
- **Streamable Tests**: 169/169 passing (**+5 new integration tests**)
- **E2E Tests**: All passing
- **Total New Tests**: 5

### Quality Gates

- ✅ `pnpm format:root` - All files formatted
- ✅ `pnpm type-check` - Zero type errors (all workspaces)
- ✅ `pnpm lint` - Zero linter errors
- ✅ `pnpm test` - All tests passing
- ✅ `pnpm build` - All packages built successfully

### Regressions

- ✅ **Zero regressions** - Existing functionality unchanged
- ✅ No changes to tool execution logic
- ✅ No changes to existing tests (except env setup in new test file)

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ Type-Gen Time (Phase 1)                                          │
├─────────────────────────────────────────────────────────────────┤
│ mcp-security-policy.ts                                           │
│   ↓                                                               │
│ Tool generators apply security policy                            │
│   ↓                                                               │
│ Generated tool files include securitySchemes field               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ SDK Runtime (Phase 2.1)                                          │
├─────────────────────────────────────────────────────────────────┤
│ getToolFromToolName(name)                                        │
│   ↓                                                               │
│ Returns tool descriptor with securitySchemes                     │
│   ↓                                                               │
│ listUniversalTools()                                             │
│   • Aggregated tools: manual securitySchemes from DEFS           │
│   • Generated tools: securitySchemes from descriptors            │
│   ↓                                                               │
│ Returns UniversalToolListEntry[] with securitySchemes            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ Streamable-HTTP Runtime (Phase 2.1)                              │
├─────────────────────────────────────────────────────────────────┤
│ registerHandlers()                                               │
│   ↓                                                               │
│ For each tool in listUniversalTools():                           │
│   • Read tool.securitySchemes                                    │
│   • Pass to server.registerTool(name, config, handler)           │
│   ↓                                                               │
│ MCP SDK receives tools with security metadata                    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ ChatGPT Discovery (Phase 3 - Future)                             │
├─────────────────────────────────────────────────────────────────┤
│ Calls tools/list → receives tools with securitySchemes           │
│ Knows which tools need OAuth before calling them                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Commit Message

```
feat(runtime): include security metadata in tool registration

- Add securitySchemes field to UniversalToolListEntry interface
- Update AGGREGATED_TOOL_DEFS with OAuth2 security for search/fetch
- Pass securitySchemes from tool descriptors to MCP SDK registration
- Export SecurityScheme types from SDK public API
- Add integration tests for security metadata flow

Phase 2, Sub-Phase 2.1 complete. All 169 streamable-http tests passing.
Zero regressions.
```

---

## Next Steps

**Immediate Next**: Phase 2, Sub-Phase 2.2 - MCP Method Classification

**Objective**: Create pure functions that classify MCP methods as "discovery" (no auth) vs "execution" (check security).

**Prerequisites Met**:

- ✅ Security metadata flows to MCP SDK registration
- ✅ Types exported and available for import
- ✅ Integration tests prove metadata is correct

**Approach**: Continue TDD (Red-Green-Refactor) methodology.

---

## References

- **Main Plan**: `.agent/plans/schema-first-security-implementation.md`
- **Phase 1 Summary**: `.agent/plans/phase-1-implementation-summary.md`
- **Phase 0 Plan** (aggregated tools migration): `.agent/plans/sdk-and-mcp-enhancements/comprehensive-mcp-enhancement-plan.md`
- **OpenAI Auth Docs**: Referenced in code comments
- **Testing Strategy**: `.agent/directives/testing-strategy.md`
- **Schema-First Execution**: `.agent/directives/schema-first-execution.md`
