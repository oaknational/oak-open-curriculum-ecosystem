# Tool Metadata Alignment - Implementation Plan

**Status**: ✅ COMPLETE  
**Date**: 2025-11-26  
**Completed**: 2025-11-26  
**Priority**: Pre-merge cleanup for OAuth implementation

---

## Executive Summary

Before merging the OAuth implementation, we need to ensure all MCP tools have proper metadata including `annotations` for read-only hints. This includes both **generated tools** (from OpenAPI schema via type-gen) and **aggregated tools** (search, fetch).

### Problem Statement

1. **MCP defaults are incorrect for our tools**: The MCP spec defaults `readOnlyHint` to `false` and `destructiveHint` to `true`, but ALL our tools are read-only GET operations.
2. **Missing annotations**: Neither generated nor aggregated tools include the `annotations` field.
3. **Metadata inconsistency**: Aggregated tools may be missing fields that generated tools have (or vice versa).

### Solution

Add `annotations` to all tools at generation time (schema-first) and ensure aggregated tools match the same structure.

---

## Directive References

Read and follow:

- `.agent/directives/rules.md` - TDD, no type shortcuts, fail fast
- `.agent/directives/testing-strategy.md` - TDD at ALL levels
- `.agent/directives/schema-first-execution.md` - Generated artifacts drive runtime

---

## Current State Analysis

### Generated Tools

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/`

**Current fields**:

- `name`, `description`, `path`, `method`, `operationId`
- `inputSchema`, `toolInputJsonSchema`, `toolZodSchema`, `toolMcpFlatInputSchema`
- `securitySchemes`, `documentedStatuses`
- `validateOutput`, `invoke`, `transformFlatToNestedArgs`, `describeToolArgs`

**Missing**: `annotations` field

### Aggregated Tools

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

**Current fields**:

- `description`, `inputSchema`, `securitySchemes`

**Missing**: `annotations` field, potentially `title`

### Handler Registration

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

**Currently passes**:

- `title: tool.name` (uses kebab-case name, not human-readable)
- `description`, `inputSchema`, `securitySchemes`

**Missing**: `annotations` not passed to `server.registerTool()`

### ToolDescriptor Contract

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts`

**Status**: Extends MCP SDK `Tool` interface (which has optional `annotations`), but we're not populating it.

---

## MCP Specification Reference

From `@modelcontextprotocol/sdk/types.js`:

```typescript
interface ToolAnnotations {
  readOnlyHint?: boolean; // If true, tool does not modify environment. Default: false
  destructiveHint?: boolean; // If true, may perform destructive updates. Default: true
  idempotentHint?: boolean; // If true, repeated calls have no additional effect. Default: false
  openWorldHint?: boolean; // If true, may interact with open world. Default: true
  title?: string; // Human-readable title
}
```

### Correct Values for Our Tools

All our tools are read-only GET operations against the Oak curriculum API:

```typescript
annotations: {
  readOnlyHint: true,      // All tools are GET operations
  destructiveHint: false,  // No tools modify anything
  idempotentHint: true,    // GET operations are idempotent
  openWorldHint: false,    // Fixed curriculum data, not open internet
  title: string,           // Human-readable title (e.g., "Get Key Stages")
}
```

---

## Implementation Phases

### Phase 0 – Grounding and Scope Confirmation

1. **ACTION**: Re-read `rules.md`, `testing-strategy.md`, and `schema-first-execution.md`.
2. **REVIEW**: Confirm understanding: all annotation changes for generated tools happen in type-gen templates; runtime code is thin facade.
3. **GROUNDING**: Read GO.md and follow all instructions.
4. **QUALITY-GATE**: Run from repo root: `pnpm i && pnpm type-gen && pnpm build && pnpm type-check && pnpm lint -- --fix && pnpm format && pnpm test && pnpm test:e2e`

### Phase 1 – Audit Current Metadata (TDD: Write Tests First)

5. **ACTION**: Write unit test for pure function `kebabToTitleCase(name: string): string` that converts `"get-key-stages"` → `"Get Key Stages"`. Test MUST fail initially (RED).
6. **ACTION**: Implement `kebabToTitleCase` to make test pass (GREEN).
7. **REVIEW**: Verify function handles edge cases (single word, multiple hyphens, etc.).
8. **GROUNDING**: Read GO.md and follow all instructions.

9. **ACTION**: Write integration test asserting that `listUniversalTools()` returns tools with `annotations` property containing `readOnlyHint: true`. Test MUST fail initially (RED).
10. **REVIEW**: Confirm test imports from SDK, uses no mocks for pure data, and fails as expected.
11. **QUALITY-GATE**: Run tests to confirm RED state for new tests.

### Phase 2 – Update Type-Gen Templates (Schema-First)

12. **ACTION**: In `type-gen/typegen/mcp-tools/parts/emit-index.ts`, add `annotations` object to generated tool descriptor:
    ```typescript
    lines.push('  annotations: {');
    lines.push('    readOnlyHint: true,');
    lines.push('    destructiveHint: false,');
    lines.push('    idempotentHint: true,');
    lines.push('    openWorldHint: false,');
    lines.push(`    title: ${JSON.stringify(humanReadableTitle)},`);
    lines.push('  },');
    ```
13. **ACTION**: Create pure function to derive human-readable title from tool name or operation description.
14. **REVIEW**: Verify annotations are added after `securitySchemes` line and before `validateOutput`.
15. **GROUNDING**: Read GO.md and follow all instructions.

16. **ACTION**: Run `pnpm type-gen` to regenerate all tool files.
17. **ACTION**: Verify generated files (e.g., `get-key-stages.ts`) now include `annotations` block.
18. **REVIEW**: Spot-check 3-5 generated files to confirm annotations are present and correct.
19. **QUALITY-GATE**: Run `pnpm build && pnpm type-check && pnpm lint -- --fix`.

### Phase 3 – Update ToolDescriptor Contract

20. **ACTION**: In `tool-descriptor.contract.ts`, add explicit `annotations` property to `ToolDescriptor` interface:
    ```typescript
    readonly annotations?: {
      readonly readOnlyHint?: boolean;
      readonly destructiveHint?: boolean;
      readonly idempotentHint?: boolean;
      readonly openWorldHint?: boolean;
      readonly title?: string;
    };
    ```
21. **REVIEW**: Confirm property is optional (some tools may not have it during transition).
22. **GROUNDING**: Read GO.md and follow all instructions.
23. **QUALITY-GATE**: Run `pnpm type-check` to verify contract compiles.

### Phase 4 – Update Aggregated Tools

24. **ACTION**: In `universal-tools.ts`, add `annotations` to `AGGREGATED_TOOL_DEFS`:
    ```typescript
    search: {
      description: '...',
      inputSchema: SEARCH_INPUT_SCHEMA,
      securitySchemes: [...],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        title: 'Search Lessons and Transcripts',
      },
    },
    fetch: {
      description: '...',
      inputSchema: FETCH_INPUT_SCHEMA,
      securitySchemes: [...],
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
        title: 'Fetch Curriculum Resource',
      },
    },
    ```
25. **ACTION**: Update `UniversalToolListEntry` interface to include `annotations` field.
26. **ACTION**: Update `listUniversalTools()` to return `annotations` for both aggregated and generated tools.
27. **REVIEW**: Confirm aggregated tool annotations match generated tool annotations structure.
28. **GROUNDING**: Read GO.md and follow all instructions.
29. **QUALITY-GATE**: Run `pnpm type-check && pnpm lint -- --fix && pnpm test`.

### Phase 5 – Update Handler Registration

30. **ACTION**: In `handlers.ts`, add `annotations` to the config passed to `server.registerTool()`:
    ```typescript
    const config = {
      title: tool.annotations?.title ?? tool.name,
      description: tool.description ?? tool.name,
      inputSchema: input,
      securitySchemes: tool.securitySchemes,
      annotations: tool.annotations,
    };
    ```
31. **REVIEW**: Confirm `title` now comes from `annotations.title` if available.
32. **GROUNDING**: Read GO.md and follow all instructions.
33. **QUALITY-GATE**: Run `pnpm type-check && pnpm lint -- --fix`.

### Phase 6 – Verify Tests Pass (GREEN)

34. **ACTION**: Run integration test from Phase 1. It should now pass (GREEN).
35. **ACTION**: Run all unit tests: `pnpm test`.
36. **ACTION**: Run E2E tests: `pnpm test:e2e`.
37. **REVIEW**: All tests should pass. If any fail, investigate and fix.
38. **GROUNDING**: Read GO.md and follow all instructions.
39. **QUALITY-GATE**: Run full gate sequence from repo root.

### Phase 7 – Final Acceptance and Documentation

40. **ACTION**: Verify all acceptance criteria (below) are met.
41. **ACTION**: Update inline JSDoc comments in modified files explaining the annotations.
42. **REVIEW**: Self-review against `rules.md` and `schema-first-execution.md`.
43. **QUALITY-GATE**: Run full quality gate sequence from repo root: `pnpm type-gen && pnpm build && pnpm type-check && pnpm lint -- --fix && pnpm format && pnpm test && pnpm test:e2e`.

---

## Acceptance Criteria

### Generated Tools

| Criterion                                          | Test Method                             | Pass/Fail |
| -------------------------------------------------- | --------------------------------------- | --------- |
| All 26 generated tools have `annotations` property | Grep generated files for `annotations:` | ✅        |
| All tools have `readOnlyHint: true`                | Grep generated files                    | ✅        |
| All tools have `destructiveHint: false`            | Grep generated files                    | ✅        |
| All tools have `idempotentHint: true`              | Grep generated files                    | ✅        |
| All tools have `openWorldHint: false`              | Grep generated files                    | ✅        |
| All tools have human-readable `title`              | Grep generated files for `title:`       | ✅        |
| `pnpm type-gen` regenerates with annotations       | Run type-gen, check output              | ✅        |

### Aggregated Tools

| Criterion                                            | Test Method                  | Pass/Fail |
| ---------------------------------------------------- | ---------------------------- | --------- |
| `search` tool has `annotations` with all fields      | Unit test or code inspection | ✅        |
| `fetch` tool has `annotations` with all fields       | Unit test or code inspection | ✅        |
| `UniversalToolListEntry` includes `annotations` type | TypeScript compilation       | ✅        |
| `listUniversalTools()` returns annotations           | Integration test             | ✅        |

### Handler Registration

| Criterion                                       | Test Method                         | Pass/Fail |
| ----------------------------------------------- | ----------------------------------- | --------- |
| `server.registerTool()` receives `annotations`  | Code inspection or integration test | ✅        |
| `title` uses `annotations.title` when available | Code inspection                     | ✅        |

### Contract & Types

| Criterion                                         | Test Method            | Pass/Fail |
| ------------------------------------------------- | ---------------------- | --------- |
| `ToolDescriptor` interface includes `annotations` | TypeScript compilation | ✅        |
| No type errors after changes                      | `pnpm type-check`      | ✅        |

### Quality Gates

| Gate                 | Status |
| -------------------- | ------ |
| `pnpm type-gen`      | ✅     |
| `pnpm build`         | ✅     |
| `pnpm type-check`    | ✅     |
| `pnpm lint -- --fix` | ✅     |
| `pnpm format`        | ✅     |
| `pnpm test`          | ✅     |
| `pnpm test:e2e`      | ✅     |

---

## Key Files

### Type Generation (Schema-First)

| File                                                                                | Purpose               | Change Required           |
| ----------------------------------------------------------------------------------- | --------------------- | ------------------------- |
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/emit-index.ts`   | Emits tool descriptor | Add `annotations` block   |
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/mcp-tool-generator.ts` | Main generator        | May need title derivation |

### Contract

| File                                                                                                             | Purpose                   | Change Required            |
| ---------------------------------------------------------------------------------------------------------------- | ------------------------- | -------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts` | Tool descriptor interface | Add `annotations` property |

### SDK (Aggregated Tools)

| File                                                          | Purpose                     | Change Required                           |
| ------------------------------------------------------------- | --------------------------- | ----------------------------------------- |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts` | Aggregated tool definitions | Add annotations to defs, update interface |

### App (Handler)

| File                                                      | Purpose           | Change Required                        |
| --------------------------------------------------------- | ----------------- | -------------------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` | Tool registration | Pass `annotations` to `registerTool()` |

---

## Risks and Mitigations

| Risk                                       | Mitigation                                                 |
| ------------------------------------------ | ---------------------------------------------------------- |
| Type generation breaks                     | Run full quality gates after each phase; commit frequently |
| Annotations not passed to MCP SDK          | Integration test to verify `server.registerTool()` config  |
| Human-readable title generation edge cases | Unit test edge cases (single word, special chars)          |
| Breaking existing tests                    | TDD approach ensures tests drive implementation            |

---

## TDD Reminder

Per testing-strategy.md:

> "Write tests **FIRST**. Red → Green → Refactor"

All changes should follow:

1. **RED**: Write test that fails (feature doesn't exist yet)
2. **GREEN**: Implement minimal code to pass test
3. **REFACTOR**: Improve implementation while keeping tests green

---

## Notes

### Schema-First Compliance

Per `schema-first-execution.md`:

> "Every byte of runtime behaviour for MCP tool execution **must** be driven by generated artefacts"

The `annotations` for generated tools MUST be added in the type-gen templates (`emit-index.ts`), NOT manually in runtime code.

### Why This Matters

1. **OpenAI Apps compliance**: ChatGPT shows tool metadata to users before execution
2. **MCP spec compliance**: Proper tool annotations help clients make informed decisions
3. **User safety**: Read-only tools may be auto-approved in some clients

### Future Considerations

- Rate limiting metadata could be added as custom extension (not in MCP spec)
- Per-tool caching hints could be added similarly
- These would require OpenAI Apps guidance review first
