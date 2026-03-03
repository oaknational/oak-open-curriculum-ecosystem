# callTool Overload Type Alignment

**Status**: Complete (2026-02-28) — Option A implemented
**Last Updated**: 2026-02-28
**Origin**: M1-S008 (identified during M1-S002 year normalisation)
**Priority**: P3 — no runtime impact, type-safety debt

---

## Problem

The generated `callTool` function in `execute.ts` has overloads that
declare the wrong input type. Each overload says:

```typescript
export function callTool(
  name: 'get-sequences-assets',
  client: ToolClientForName<'get-sequences-assets'>,
  rawArgs: ToolArgsForName<'get-sequences-assets'>,
): Promise<ToolResultForName<'get-sequences-assets'>>;
```

`ToolArgsForName<TName>` resolves to the **nested** SDK type:

```typescript
{ params: { path: { sequence: string }, query?: { year?: number } } }
```

But the implementation parses `rawArgs` through the **flat** MCP schema:

```typescript
const parsed = descriptor.toolMcpFlatInputSchema.safeParse(rawArgs);
const flatArgs = parsed.data;
const nestedArgs = descriptor.transformFlatToNestedArgs(flatArgs);
```

The flat schema expects:

```typescript
{ sequence: string, year?: string | number }
```

A caller trusting the overloads would construct nested args, pass them
in, and get a runtime crash when the flat schema rejects them.

## Why it hasn't broken

1. The final overload uses `rawArgs: unknown` — TypeScript doesn't
   enforce typed overloads at the implementation level
2. The sole real caller (`callToolWithValidation`) receives raw MCP
   protocol args (always flat, always `unknown`)
3. Nobody has tried to use the strongly-typed overloads programmatically

## Why it matters

- The overloads are a public API surface of the generated SDK
- If anyone writes code that uses the typed overloads, it will compile
  but fail at runtime
- Year normalisation (M1-S002) makes the mismatch concrete: nested says
  `number`, flat says `string | number`
- This is a type-safety hole in a codebase that treats type assertions
  as forbidden

## Options

### Option A: Derive `ToolArgsForName` from the flat schema

Change `ToolArgsMap` in `aliases/types.ts` from:

```typescript
type ToolArgsMap = {
  readonly [TName in ToolName]: ToolInvokeParametersMap[TName][1];
};
```

to derive from the flat input schema's inferred type. This preserves
the strongly-typed overloads with the correct input type.

**Pros**: Callers get correct type information for flat MCP args.
**Cons**: Changes the public API type; callers expecting nested args
would need updating (none exist currently).

### Option B: Use `rawArgs: unknown` in all overloads

Remove the typed `rawArgs` parameter from all overloads, keeping only
the tool name and client typed. The function's contract becomes
"validate whatever you give me."

**Pros**: Honest about what the function does; simplest change.
**Cons**: Loses type-safe input checking at call sites.

### Option C: Dual overloads (flat + nested)

Add overloads that accept both the flat MCP type and the nested SDK
type. The implementation detects which shape was provided.

**Pros**: Maximum flexibility for callers.
**Cons**: Complexity; detection logic could be fragile.

## Recommended approach

Option A is the natural fit for this codebase's philosophy. The types
should reflect reality. The function accepts flat args, so
`ToolArgsForName` should be the flat type.

## Scope

### Files to change (all generated)

- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-types-file.ts`
  — change `ToolArgsMap` derivation
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
  — overload generation uses the type alias; may need no change if
  `ToolArgsForName` is updated
- Regenerate all generated files via `pnpm sdk-codegen`

### Files affected (consumers to verify)

- `packages/sdks/oak-curriculum-sdk/src/mcp/` — any code calling
  `callTool` or using `ToolArgsForName`
- `apps/oak-curriculum-mcp-streamable-http/` — MCP handler wiring
- `apps/oak-curriculum-mcp-stdio/` — MCP handler wiring

### Tests

- Unit test: verify `ToolArgsForName<'get-sequences-assets'>` matches
  the flat schema's inferred type
- Unit test: verify year parameter is `string | number | undefined` in
  the flat type, not `number | undefined`
- Integration: existing E2E tests exercise the full call path

## Acceptance criteria

1. `ToolArgsForName<TName>` matches the actual runtime input type
2. No `as` casts introduced
3. All quality gates pass
4. Existing callers continue to work (they all use `unknown`)

## References

- Release plan M1-S008: `.agent/plans/archive/completed/release-plan-m1.plan.md`
- Generated execute.ts: `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts`
- Type aliases: `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/aliases/types.ts`
- Code pattern: `.agent/memory/code-patterns/multi-layer-schema-sync.md`
