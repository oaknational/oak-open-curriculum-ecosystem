# Phase 2: Interactive Widget Capabilities

## Context

We are implementing OpenAI Apps SDK features for the Oak Curriculum MCP server. Phase 0.6 (server HTTP security headers) and Phase 1 (widget resource metadata) are complete. You are now implementing **Phase 2: Interactive Widget Capabilities**.

## Required Reading (MUST read before starting)

Read these foundational documents in order:

1. `.agent/directives-and-memory/rules.md` - Cardinal rules including schema-first types, TDD, no type shortcuts
2. `.agent/directives-and-memory/schema-first-execution.md` - Type-gen drives all MCP tool behaviour
3. `.agent/directives-and-memory/testing-strategy.md` - TDD at all levels, test definitions
4. `.agent/plans/sdk-and-mcp-enhancements/08-openai-apps-sdk-feature-adoption-plan.md` - Full plan (see Phase 2 section)
5. `.agent/reference-docs/openai-apps/` - OpenAI Apps SDK documentation

## Critical Principles

### Schema-First (Non-Negotiable)

All `_meta` fields for **generated tools** MUST be emitted at **type-gen time**, NOT at runtime. Update the generator templates, then run `pnpm type-gen`. Never manually edit generated files.

### Two Camps

There are two sources of tools that MUST both receive equivalent treatment:

| Camp                 | Count | Source                                                        | How to Update                                        |
| -------------------- | ----- | ------------------------------------------------------------- | ---------------------------------------------------- |
| **Generated Tools**  | 23    | OpenAPI schema → `pnpm type-gen`                              | Modify `type-gen/typegen/mcp-tools/parts/` templates |
| **Aggregated Tools** | 4     | Hand-authored (`search`, `fetch`, `get-help`, `get-ontology`) | Modify definition files directly                     |

### TDD (Non-Negotiable)

Write tests FIRST. Red → Green → Refactor. See `testing-strategy.md` for test type definitions.

### No Type Shortcuts (Non-Negotiable)

Never use `as`, `any`, `!`, `Record<string, unknown>`, `[x: string]: unknown`, or type widening. Preserve exact types from data structures.

## Phase 2 Objectives

Enable the widget to call tools directly (`window.openai.callTool()`) and persist UI state across renders.

## Sub-Tasks

### 2.1: Fix Type Interface Index Signatures (PREREQUISITE)

**Problem**: `ToolMeta` and `ToolAnnotations` interfaces have `readonly [x: string]: unknown` which violates project rules.

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`

**Action**: Remove index signatures and explicitly enumerate all known fields:

```typescript
// BEFORE (INVALID - violates rules)
export interface ToolMeta {
  readonly [x: string]: unknown; // ❌ REMOVE THIS
  readonly 'openai/outputTemplate'?: string;
  // ...
}

// AFTER (VALID - explicit enumeration)
export interface ToolMeta {
  readonly 'openai/outputTemplate'?: string;
  readonly 'openai/toolInvocation/invoking'?: string;
  readonly 'openai/toolInvocation/invoked'?: string;
  readonly 'openai/widgetAccessible'?: boolean;
  readonly 'openai/visibility'?: 'public' | 'private';
  readonly securitySchemes?: readonly SecurityScheme[];
}
```

**TDD**: Write unit test that verifies ToolMeta accepts all expected fields and rejects unknown fields (via type system, not runtime).

### 2.2: Enable `_meta` on Generated Tools (Camp 1)

**Why**: Generated tools currently have NO `_meta` fields. They need `outputTemplate`, `invoking`, `invoked`, `widgetAccessible`, `visibility`.

**Files to modify**:

1. `type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts` - Add `_meta` to `ToolDescriptor` interface
2. `type-gen/typegen/mcp-tools/parts/emit-index.ts` - Emit `_meta` object in `buildExports()` function

**Implementation pattern**:

```typescript
// In emit-index.ts, emit _meta for each tool:
_meta: {
  'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
  'openai/toolInvocation/invoking': 'Fetching ${humanReadableToolName}…',
  'openai/toolInvocation/invoked': '${humanReadableToolName} complete',
  'openai/widgetAccessible': true,
  'openai/visibility': 'public',
},
```

**Verification**:

```bash
pnpm type-gen
# Check ALL 23 generated tools have _meta:
grep -l "openai/widgetAccessible" packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/generated/data/tools/*.ts | wc -l
# Should output: 23
```

### 2.3: Update Aggregated Tool Definitions (Camp 2)

**Files** (already have partial `_meta`, need `widgetAccessible` and `visibility`):

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

**Add to existing `_meta`**:

```typescript
_meta: {
  // ... existing fields ...
  'openai/widgetAccessible': true,
  'openai/visibility': 'public',
},
```

**TDD**: Write unit tests verifying each aggregated tool has complete `_meta`.

### 2.4: Implement Widget Tool Calling (OPTIONAL - defer if complex)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

Add ability for widget to call tools via `window.openai.callTool()`.

**Note**: This may require Playwright tests and careful integration testing. Consider deferring to Phase 2.5 if time-constrained.

### 2.5: Implement Widget State Persistence (OPTIONAL - defer if complex)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

Add ability for widget to persist state via `window.openai.setWidgetState()`.

**Note**: Same as 2.4 - consider deferring if the type-gen work is substantial.

## Recommended Execution Order

1. **2.1 first** - Fix type interfaces (prerequisite for everything else)
2. **2.3 second** - Update aggregated tools (simpler, validate approach)
3. **2.2 third** - Update type-gen templates (more complex, applies learnings)
4. **2.4/2.5 last** - Widget runtime features (optional, can defer)

## Verification Commands

After implementation, run:

```bash
# 1. Type-gen produces _meta
pnpm type-gen

# 2. All tests pass
pnpm test

# 3. Lint passes
pnpm lint

# 4. Type-check passes
pnpm type-check

# 5. E2E tests pass
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

## Acceptance Criteria

| Criterion                                                         | Verification                        |
| ----------------------------------------------------------------- | ----------------------------------- |
| `ToolMeta` has no index signature                                 | Type compilation                    |
| `ToolAnnotations` has no index signature                          | Type compilation                    |
| All 23 generated tools have `_meta` with `widgetAccessible: true` | Unit test on `MCP_TOOL_DESCRIPTORS` |
| All 4 aggregated tools have `_meta` with `widgetAccessible: true` | Unit test on each descriptor        |
| `pnpm type-gen` produces correct output                           | Manual verification                 |
| All tests pass                                                    | `pnpm test`                         |
| Lint passes                                                       | `pnpm lint`                         |
| Type-check passes                                                 | `pnpm type-check`                   |

## Key Files Reference

| Purpose                           | Path                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------- |
| ToolMeta/ToolAnnotations types    | `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`             |
| Type-gen tool descriptor contract | `type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`             |
| Type-gen tool emission            | `type-gen/typegen/mcp-tools/parts/emit-index.ts`                                |
| Generated tools output            | `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/`    |
| Aggregated search                 | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` |
| Aggregated fetch                  | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`                  |
| Aggregated help                   | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`        |
| Aggregated ontology               | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`               |
| Widget HTML                       | `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`         |

## Notes

- **`widgetAccessible: true` for ALL tools**: All Oak tools are read-only, so no security risk from widget-initiated calls
- **`visibility: 'public'` for ALL tools**: No private tools until we have a concrete use case
- **OpenAI reference docs**: See `.agent/reference-docs/openai-apps/` for SDK documentation

## Start Command

Begin by reading the foundational documents, then:

```bash
# Understand current state
grep -r "readonly \[x: string\]" packages/sdks/oak-curriculum-sdk/src/mcp/
```
