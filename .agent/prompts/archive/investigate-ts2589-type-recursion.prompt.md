# Investigate TS2589: Type Instantiation Excessively Deep

## The Error

```text
src/handlers.ts(94,44): error TS2589: Type instantiation is excessively deep and possibly infinite.
```

This error occurs at:

```typescript
server.registerTool(tool.name, config, async (params: unknown) => { ... });
```

## Context

Read the foundation documents first:

- @.agent/directives/principles.md
- @.agent/directives/schema-first-execution.md
- @.agent/directives/testing-strategy.md

### What the Code Does

In `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`, the `registerHandlers` function:

1. Loops over `listUniversalTools()` which returns ~25+ tool definitions
2. For each tool, builds a `config` object containing `inputSchema`
3. Calls `server.registerTool(tool.name, config, handler)`

The `inputSchema` is:

```typescript
const input = tool.flatZodSchema ?? zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
```

### Why TypeScript Struggles

1. **`registerTool` is generic**: The MCP SDK's `registerTool<TInput, TOutput>()` infers generic types from the `inputSchema`

2. **Complex union type**: `input` has a type that is the union of:
   - All possible `flatZodSchema` types from different tools (each tool has a different Zod shape)
   - The return type of `zodRawShapeFromToolInputJsonSchema` (dynamically converted)

3. **Recursive type expansion**: When TypeScript infers generics from this complex union:
   - It must resolve each Zod schema's inferred type
   - Zod's type system is itself deeply recursive (generics within generics)
   - Combined with MCP SDK's generic `registerTool`, TypeScript exceeds its recursion depth limit

## Assumptions (May Be Wrong)

1. **The error is caused by type inference, not a bug in our types** - We assume TypeScript's inference is hitting a depth limit, not that our types are actually infinitely recursive.

2. **The error is in the tools loop** - The error points to line 94, but the real cause might be upstream (in how `listUniversalTools()` or `flatZodSchema` is typed).

3. **This is a Zod + MCP SDK interaction** - We assume the combination of Zod's complex generic types with MCP SDK's generic `registerTool` creates the depth issue.

4. **Adding explicit type annotations will help** - TypeScript docs suggest explicit annotations can break inference chains, but we haven't verified this will work here.

5. **The error is deterministic** - We assume this always fails, not intermittently based on TypeScript's internal state.

## Potential Unknowns

1. **When did this start?** - We don't know if this is a regression from a dependency update (MCP SDK, Zod, TypeScript) or has always existed.

2. **What's the actual recursion path?** - We don't know exactly which types are causing the infinite expansion. Is it:
   - The union of all tool schemas?
   - A specific schema that's particularly deep?
   - The interaction between `ZodRawShape` and `registerTool`'s generics?

3. **Does this affect runtime?** - The code builds and runs. Is this purely a type-checking issue?

4. **Are there upstream fixes?** - Have MCP SDK or Zod addressed similar issues in newer versions?

5. **What's the minimal reproduction?** - Can we isolate the issue to a single tool, or does it require the full union?

## Constraints from Foundation Docs

From `principles.md`:

- **No type shortcuts**: We cannot use `as`, `any`, `!` to work around this
- **Preserve type information**: We cannot widen types to escape the issue
- **Single source of truth**: Types must flow from generated code

From `schema-first-execution.md`:

- **Generator is source of truth**: Any fix should be in the type-gen templates, not hand-authored
- **No hand-authoring helpers that widen types**: Can't just return `unknown`

## Questions to Investigate

1. **Can we reproduce with a minimal example?** Create a small test case with just 2-3 tools to understand the pattern.

2. **What is the exact type of `input`?** Hover in IDE or use `type _Debug = typeof input` to see the full type.

3. **Does explicit typing help?** Try adding explicit type parameters to `registerTool<TInput, TOutput>()`.

4. **Is there a specific tool causing this?** Try registering tools one at a time to find if a specific schema is the trigger.

5. **What do MCP SDK types look like?** Examine `registerTool`'s type signature in `@modelcontextprotocol/sdk`.

6. **Is there a Zod issue?** Check if `flatZodSchema` types are simpler than expected or have unexpected depth.

## Files to Examine

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` - The error location
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts` - Source of `listUniversalTools()`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` - Tool type definitions
- `packages/sdks/oak-curriculum-sdk/type-gen/` - Type generation templates
- `node_modules/@modelcontextprotocol/sdk/dist/server/mcp.d.ts` - MCP SDK types

## Success Criteria

A fix must:

1. Eliminate the TS2589 error
2. Not use banned type shortcuts (`as`, `any`, etc.)
3. Preserve full type safety for tool registration
4. Follow schema-first principles (fix in generator if possible)
5. Pass all quality gates: `pnpm type-check && pnpm lint && pnpm test`
