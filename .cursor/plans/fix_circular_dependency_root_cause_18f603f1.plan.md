---
name: Fix circular dependency root cause
overview: Remove the unnecessary `isKnownAggregatedTool` check from `tool-help-lookup.ts`, eliminating the circular dependency at its source and restoring the barrel import in `definitions.ts`.
todos:
  - id: fix-tool-help-lookup
    content: Remove isKnownAggregatedTool, AGGREGATED_TOOL_NAMES, DEFAULT_HELP, AGGREGATED_TOOL_DEFS import from tool-help-lookup.ts. Simplify getToolSpecificHelp and buildBaseHelp.
    status: completed
  - id: restore-barrel
    content: "Restore barrel import in definitions.ts: ../aggregated-curriculum-model/index.js"
    status: completed
  - id: validate
    content: type-check + test + lint
    status: completed
isProject: false
---

# Fix Circular Dependency Root Cause

## The Problem

`tool-help-lookup.ts` imports `AGGREGATED_TOOL_DEFS` from `definitions.ts` solely to check whether a tool name is "known". This creates a cycle through the barrel:

```
definitions.ts -> barrel (index.ts) -> execution.ts -> curriculum-model-data.ts -> tool-help-lookup.ts -> definitions.ts
```

My earlier fix bypassed the barrel (`index.ts` -> `definition.ts` directly), which masks the cycle but undermines the barrel's purpose as a public API boundary.

## Root Cause

`isKnownAggregatedTool()` is **unnecessary defensive code**. Every aggregated tool already has a category in `toolGuidanceData.toolCategories` — the drift-detection test proves this. The check handles a case that never occurs, and its only effect is creating the circular dependency.

## The Fix

Remove the import, the constant, the function, and the dead `DEFAULT_HELP` fallbacks. Then restore the barrel import.

### Changes to [tool-help-lookup.ts](packages/sdks/oak-curriculum-sdk/src/mcp/tool-help-lookup.ts)

- **Remove** import of `AGGREGATED_TOOL_DEFS` from `universal-tools/definitions.js`
- **Remove** import of `typeSafeKeys` (no longer needed here)
- **Remove** `AGGREGATED_TOOL_NAMES` constant (line 28)
- **Remove** `isKnownAggregatedTool()` function (line 69)
- **Remove** `DEFAULT_HELP` constant (lines 74-78) — dead code since `buildBaseHelp` will only be called when `categoryInfo` is defined
- **Simplify** `getToolSpecificHelp`: if `findToolCategory` returns undefined, return error directly
- **Simplify** `buildBaseHelp`: make `categoryInfo` non-optional, remove `??` fallbacks
- **Simplify** `getRelatedToolsFromCategory`: make `categoryInfo` non-optional, remove undefined guard

### Changes to [definitions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts)

- **Restore** barrel import: `from '../aggregated-curriculum-model/definition.js'` back to `from '../aggregated-curriculum-model/index.js'`

### Test updates

- **Update** drift-detection test in [tool-help-lookup.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/tool-help-lookup.unit.test.ts) — the "returns error for get-ontology/get-help" tests still pass (they're not in any category). The `it.each` drift test still passes (every aggregated tool has a category).

### Why this is safe

- The drift-detection test (`it.each(typeSafeKeys(AGGREGATED_TOOL_DEFS))`) catches any future tool added to definitions without a corresponding category in guidance data — the test fails, forcing the developer to add the category.
- This is **better** than the old behaviour: previously, a tool without guidance data silently returned generic "Aggregated tool combining multiple operations" text. Now it fails at test time with a clear signal.

### Validation

```
pnpm type-check
pnpm test
pnpm lint:fix
```
