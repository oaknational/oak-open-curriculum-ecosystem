---
name: "Phase 4.5: Tool Metadata Shape Correction"
overview: "Eliminate the tool metadata projection layer — produce SDK-ready shapes at the definition site."
specialist_reviewer: "architecture-reviewer-fred, type-reviewer, mcp-reviewer, test-reviewer, code-reviewer"
isProject: false
todos:
  - id: t0-deps
    content: "T0: Update all outdated dependencies (except Zod/TS)"
    status: done
  - id: t1-red-satisfies
    content: "T1 (RED): Tests with inputSchema rename (compiler errors = RED)"
    status: done
  - id: t2-red-no-input
    content: "T2 (RED): Tests asserting no-input tools have empty inputSchema"
    status: done
  - id: t3-green-fix-widening
    content: "T3 (GREEN): Replace widening structural check with satisfies"
    status: done
  - id: t4-green-rename-inputschema
    content: "T4 (GREEN): Rename flatZodSchema → inputSchema across all files"
    status: done
  - id: t5-green-no-input
    content: "T5 (GREEN): No-input tools use empty ZodRawShape (MCP spec compliant)"
    status: done
  - id: t6-green-inline-projection
    content: "T6 (GREEN): Delete projections.ts, inline at call site, relocate type guards, require title/description"
    status: done
  - id: t7-refactor-docs
    content: "T7 (REFACTOR): TSDoc, docs cleanup, remaining flatZodSchema references"
    status: pending
  - id: t8-quality-gates
    content: "T8: Full quality gate chain"
    status: pending
  - id: t9-adversarial-review
    content: "T9: Final adversarial specialist reviews"
    status: pending
---

# Phase 4.5: Tool Metadata Shape Correction

**Last Updated**: 2026-04-09
**Status**: IN PROGRESS — T0-T6 complete, T7-T9 remaining
**Scope**: Eliminate the tool metadata projection layer so definitions
produce SDK-ready shapes directly. No widget build changes.
**Branch**: `feat/mcp_app_ui` (existing)

---

## Context

### Problem: Tool Metadata Undergoes Unnecessary Transformations

Tool definitions are created in one shape (`flatZodSchema`, custom
metadata fields) and then projected into another shape (`inputSchema`,
SDK config) at registration time. The projection layer
(`toRegistrationConfig`, `toAppToolRegistrationConfig` in
`projections.ts`) exists only because the definition shape doesn't match
the SDK's consumption shape.

Additionally, no-input tools pass an empty Zod shape `{}` as
`inputSchema`, which the SDK converts to `{ type: 'object', properties: {} }`.
The wire output is identical whether `undefined` or `{}` is passed (the
SDK normalises both), but `undefined` is semantically clearer at the
registration site.

### What Was Dropped (and Why)

The original plan proposed removing `vite-plugin-singlefile`. Six
specialist reviewers (assumptions, MCP, architecture, type, react, docs)
unanimously determined this was wrong:

- `vite-plugin-singlefile` IS the canonical MCP Apps build pattern
  (confirmed in official quickstart, all upstream examples, both agent skills)
- The host loads HTML via `document.write()` into a sandboxed iframe
  with no backing web server — external `<script src>` references would
  resolve to nothing
- The widget IS already a live React MCP App — verified by inspecting
  the built artefact for `createRoot`, `useApp`, `PostMessageTransport`,
  and all MCP Apps lifecycle handlers
- Confirmed by temporarily disabling the plugin: Vite produces separate
  files that cannot load in the iframe delivery model

### Reviewer Findings Incorporated

| Source | Finding | How Addressed |
|--------|---------|---------------|
| Fred F1 | `securitySchemes` not in SDK config | T6: confirm auth checker's direct-lookup is preserved |
| Fred F2 | `as const` readonly vs mutable `_meta` | T6: inline `{ ...def._meta }` spread at call site |
| Fred F4 | `list-tools.ts` missing from file list | T4: included |
| Fred F6 | `isAppToolEntry`/`AppToolListEntry` relocation | T6: move to types.ts |
| Type T1 | `definitions.ts:134` widening assignment | T3: fix with `satisfies` |
| Type T3 | `flatZodSchema` typed as `z.ZodRawShape` | T4: use `ZodRawShapeCompat` |
| Type W3 | Generated tools `?? {}` fallback | T5: fix in list-tools.ts |
| MCP 3 | `annotations?.title` dead fallback | T7: don't carry forward |
| MCP 1 | `inputSchema` wire output identical | T2 narrative adjusted |

---

## T0: Prerequisite Dependency Update (COMPLETE)

All outdated dependencies updated (except Zod and TypeScript):

- Minor/patch: vitest 4.1.3, @clerk/* 3.2.7/2.0.11, @types/node 25.5.2,
  @playwright/test 1.59.1, @sentry/node 10.47.0, eslint 10.2.0, knip 6.3.1,
  turbo 2.9.5, react 19.2.4, dotenv 17.4.1, typescript-eslint 8.58.1
- MCP SDK: @modelcontextprotocol/sdk 1.29.0, ext-apps 1.5.0
- Major: Vite 8.0, @vitejs/plugin-react 6.0, cross-env 10.1
- jsdom replaced with happy-dom (widget tests)
- Removed `.js` suffixes from 60 files of `@modelcontextprotocol/sdk/*` imports
- Migrated deprecated ext-apps `on*` callbacks to `addEventListener`
- All 88 gates passing

---

## Design Principles

1. **Build directly to the target interface** — tool metadata is produced
   once in the shape the SDK consumes. No intermediate representations.
2. **No-input tools declare an empty object schema** — per MCP spec,
   `inputSchema` MUST be a valid JSON Schema object. No-input tools use
   an empty `ZodRawShape` (`{}`) which produces `{ "type": "object",
   "additionalProperties": false }` on the wire (Zod v4 default strict).
   This preserves the SDK's 2-arg handler signature for all tools.
3. **Inline spread, not a projection layer** — the only non-trivial
   operation in the projection is `{ ...tool._meta }` to strip readonly.
   This belongs at the call site, not in a single-consumer abstraction.
4. **Title and description are required** — `UniversalToolListEntry`
   requires both. `list-tools.ts` fails fast if a generated tool lacks
   either. No fallback chains.

**Non-Goals** (YAGNI):

- Changing the widget build (vite-plugin-singlefile is correct)
- Adding interactivity to the banner (Phase 5)
- Changing `resources/read` serving mechanism
- Restructuring the generated tool codegen pipeline (just rename the field)

---

## WS1 — Test Specification (RED)

### T1: satisfies Tests for SDK Config Compatibility

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.unit.test.ts` (new or existing)

**Tests**:

- `satisfies` assertion: each aggregated tool definition (after rename)
  satisfies the subset of `registerTool` config fields
- `satisfies` assertion: app tool definitions' `_meta` (after spread)
  satisfies `McpUiAppToolConfig`
- Verify `securitySchemes` is NOT expected in the SDK config type

### T2: No-Input Tools Have inputSchema Undefined

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.unit.test.ts`

**Tests**:

- Assert `inputSchema` property is `undefined` (not `{}`) on no-input
  tool definitions
- Note: on the wire both produce `{ type: 'object', properties: {} }` —
  this test proves author-facing clarity, not protocol difference

---

## WS2 — Implementation (GREEN)

### T3: Fix Widening Structural Check

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`

**Change**: Replace the widening assignment at line 134:
```typescript
// Before (widens, loses literal types):
const structuralCheck: Record<string, AggregatedToolDefShape> = AGGREGATED_TOOL_DEFS;
void structuralCheck;

// After (preserves literals, proves structure):
// Apply satisfies on the AGGREGATED_TOOL_DEFS declaration itself
```

### T4: Rename flatZodSchema → inputSchema

**Files** (all must change in the same pass):

- All aggregated tool `definition.ts` files (search, fetch, browse,
  get-curriculum-model, get-thread-progressions, get-prerequisite-graph)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` —
  rename field, change type to `ZodRawShapeCompat | undefined`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts` —
  rename in generated tool mapping
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/aggregated-flat-zod-schema.integration.test.ts` —
  update all `flatZodSchema` references
- Any other test files referencing `flatZodSchema`

### T5: No-Input Tools Omit inputSchema

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts` —
  remove `inputSchema: {}`, set to `undefined` or omit
- Same for `aggregated-prerequisite-graph` and `aggregated-thread-progressions`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts` —
  change `?? {}` fallback to `?? undefined` for generated tools

### T6: Delete Projection Layer, Inline Spread, Relocate Type Guards

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts` — DELETE
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` —
  absorb `AppToolListEntry` and `isAppToolEntry` from projections
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — pass
  definitions directly to `registerTool`/`registerAppTool` with inline
  `{ ...def._meta }` spread for app tools
- Verify `securitySchemes` is NOT threaded through `registerTool` —
  confirm auth checker's existing direct-lookup pattern is preserved
- Remove `annotations?.title` dead fallback (the field doesn't exist
  on `ToolAnnotations`)

**Deterministic Validation**:

```bash
pnpm type-check
pnpm test --filter @oaknational/curriculum-sdk
pnpm test --filter @oaknational/oak-curriculum-mcp-streamable-http
```

---

## WS3 — Documentation and Polish (REFACTOR)

### T7: TSDoc and Documentation

- TSDoc on all changed interfaces
- Remove references to `flatZodSchema` from docs and comments
- Note in deployment-architecture.md that `vite-plugin-singlefile` is
  the canonical MCP Apps pattern (not a workaround)

---

## WS4 — Quality Gates (T8)

```bash
pnpm check   # Full 88/88 gate suite
```

---

## WS5 — Adversarial Review (T9)

| Reviewer | Focus |
|----------|-------|
| `architecture-reviewer-fred` | Projection removal, boundary discipline |
| `type-reviewer` | satisfies patterns, ZodRawShapeCompat flow |
| `mcp-reviewer` | registerTool/registerAppTool compliance |
| `test-reviewer` | Test quality |
| `code-reviewer` | Gateway review |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| `as const` definitions don't satisfy mutable `_meta` index signature | Type errors | T1 satisfies tests prove compatibility before removal |
| `securitySchemes` silently dropped from registration | Auth check breaks | Verify auth checker's direct-lookup pattern is preserved |
| Generated tools still pass `{}` after aggregated tools fixed | Inconsistency | T5 explicitly covers `list-tools.ts` generated path |
| `aggregated-flat-zod-schema.integration.test.ts` has 15+ references | Compile errors | T4 includes this file in the change list |

---

## Foundation Alignment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/testing-strategy.md`
3. **Re-read** `.agent/directives/schema-first-execution.md`
4. **Ask**: "Could it be simpler without compromising quality?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Dependencies

**Blocking**: None — pre-merge work on `feat/mcp_app_ui`

**Related Plans**:

- `../archive/completed/ws3-phase-4-brand-banner.plan.md` — Phase 4 (COMPLETE)
- `ws3-phase-5-interactive-user-search-view.plan.md` — Phase 5 depends
  on SDK-ready tool definitions from this plan
- `../archive/completed/widget-pipeline-idiomatic-alignment.plan.md` —
  Reviewer findings (COMPLETE)

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.
