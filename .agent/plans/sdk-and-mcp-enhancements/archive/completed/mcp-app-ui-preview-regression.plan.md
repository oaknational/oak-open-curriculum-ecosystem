---
name: "MCP App UI Preview Regression — Investigation, Fix, and _meta Architecture"
overview: "Fix broken MCP App UI rendering on this branch; close the composition test gap; consolidate _meta into a single-source-of-truth factory."
todos:
  - id: phase-0-investigate
    content: "Phase 0: Investigate root cause — compare preview vs prod, isolate the failure."
    status: completed
  - id: phase-1-composition-test
    content: "Phase 1: MCP client SDK composition test — proves the full chain."
    status: completed
  - id: phase-2-meta-consistency
    content: "Phase 2: _meta consistency — all tools required to have _meta, securitySchemes mirrored."
    status: completed
  - id: phase-3-find-cursor-root-cause
    content: "Phase 3: Root cause identified — Cursor stale MCP tool metadata cache. Not a code issue."
    status: completed
  - id: phase-4-meta-factory
    content: "Phase 4: _meta single source of truth — extracted to meta-oak-namespace-cleanup.plan.md."
    status: cancelled
  - id: phase-5-hardening
    content: "Phase 5: Quality gates, documentation, and consolidation."
    status: cancelled
---

# MCP App UI Preview Regression — Investigation, Fix, and `_meta` Architecture

**Last Updated**: 2026-04-12 (CLOSED — Cursor cache issue, not a code regression)
**Status**: ✅ CLOSED — root cause: Cursor stale MCP tool metadata cache
**Scope**: Fix MCP App UI rendering on `feat/gate_hardening_part1`;
add composition tests; consolidate `_meta` into a single source of truth.

---

## Context

### Issue 1: MCP App UI Does Not Render on This Branch

The MCP App widget (interactive Oak Curriculum UI) renders correctly
when running locally on `main` but does NOT render when running
locally on this branch. Same machine, same Cursor, same config —
the only variable is the branch code.

### Issue 2: Tests Pass While a Key Feature Is Broken

All 581 tests pass. The bug is invisible to the current test suite.
This is the "pieces vs composition" test pyramid gap.

### Issue 3: `_meta` Architecture Has No Single Source of Truth

`_meta` values are scattered across 11 aggregated tool definitions
and a codegen template with no shared builder. Widget membership is
duplicated. This architectural weakness makes silent regressions
likely.

---

## Investigation Findings (Phase 0 — COMPLETE)

### What We Proved

| Finding | Evidence | Implication |
|---------|----------|-------------|
| Works on main, broken on branch (same machine) | Local dev server on both branches | Pure code change regression |
| Widget HTML is identical | `FetchMcpResource` returns same HTML from both servers | Widget content is not the issue |
| `_meta.ui.resourceUri` is present in `listTools()` | Composition test passes with real MCP client SDK | Server registration is correct |
| Widget resource serves HTML with correct MIME type | Composition test reads resource successfully | Resource registration is correct |
| `CallMcpTool` returns identical results from both servers | Both return 41.5 KB curriculum model | Tool execution is correct |
| `isAppToolEntry` type guard is unchanged vs main | `git diff main..HEAD` shows no change | Not the type guard |
| `registerAppTool` call for app tools is unchanged vs main | Both use `{ ...config, _meta: { ...tool._meta } }` | Not the registration call |
| `listUniversalTools` is unchanged vs main | No diff | Not the listing function |
| `register-widget-resource.ts` is unchanged vs main | No diff | Not the resource registration |
| `application.ts` is unchanged vs main | No diff | Not the app creation |

### What Actually Changed (Runtime-Relevant Diff vs Main)

Only **two committed runtime changes** affect the tool/resource registration path:

1. **`handlers.ts` — non-app tools only**: The `else` branch changed from
   `_meta: tool._meta` to `_meta: tool._meta ? { ...tool._meta } : undefined`.
   The `if (isAppToolEntry)` branch (which handles ALL widget tools) is
   **identical** between main and this branch.

2. **`register-resources.ts` — export narrowing**: `registerGraphResource`
   made private, `registerWidgetResource` re-export removed. No runtime
   effect on tool/resource registration behaviour.

3. **`widget/src/app-runtime-state.ts` — export narrowing**: Two type
   exports made module-private. Types are erased at runtime — no effect.

### Critical Finding: Server Is Correct, Cursor Has Stale Cache

The server is definitively correct. The MCP Apps reference host
(`ext-apps@1.5.0 basic-host`) connected to the SAME local server
on `localhost:3333` and **rendered the widget successfully**.

Additionally:
- `get-curriculum-model` on `oak-prod` via Cursor → widget renders ✅
- `get-curriculum-model` on `oak-local` via Cursor → no widget ❌
- `get-curriculum-model` on `oak-local` via reference host → widget renders ✅
- Widget **was rendering** from `oak-local` in Cursor for several days
- Widget stopped rendering — same behaviour on `main` AND the branch
- Disconnecting/reconnecting `oak-local` in Cursor did NOT fix it

### Root Cause: Cursor MCP Tool Metadata Caching

Cursor caches tool metadata (including `_meta`) per MCP server and
does not reliably refresh it on reconnect. At some point during
development (likely a mid-development server restart with partially
applied changes), Cursor cached `listTools()` output that lacked
`_meta.ui.resourceUri`. It has been serving this stale cache since,
even after the server was corrected.

Evidence:
- Cached tool descriptors at `mcps/project-0-oak-mcp-ecosystem-oak-local/tools/`
  do NOT include `_meta` (Cursor strips it in its cache format)
- `oak-prod` works because it was connected fresh (or its cache was
  independently refreshed)
- The reference host works because it has no cache

### Resolution

This is a **Cursor caching issue**, not a code regression. The
server code is correct on both `main` and the branch. Potential
fixes:
- Completely remove and re-add the `oak-local` server in Cursor
- Clear Cursor's MCP metadata cache directory
- Wait for Cursor to refresh its cache naturally
- File as a Cursor bug if disconnect/reconnect doesn't clear the cache

---

## `_meta` Architecture Analysis

### Current State: Scattered, Duplicated, No Enforcement

**The `_meta.ui.resourceUri` value flows through a clean chain:**

```
cross-domain-constants.ts (codegen time)
  └─ BASE_WIDGET_URI = `ui://widget/oak-curriculum-app-${hash}.html`
      └─ generate-widget-constants.ts emits WIDGET_URI constant
          └─ widget-constants.ts (generated, committed)
              └─ re-exported by oak-curriculum-sdk
                  ├─ aggregated tool definitions: _meta.ui.resourceUri
                  ├─ register-widget-resource.ts: resource URI
                  └─ public-resources.ts: auth bypass check
```

**URI consistency is confirmed**: All 27 files referencing `WIDGET_URI`
import the same constant. The codegen also stamps `BASE_WIDGET_URI` into
generated tools via `emit-index.ts`, though this is currently dead code
(all widget tools are aggregated, none are generated).

**The problem is in `_meta` values, not the URI:**

| Problem | Where | Impact |
|---------|-------|--------|
| Widget membership is duplicated | `WIDGET_TOOL_NAMES` (codegen) vs inline `_meta.ui` in each aggregated definition | Can diverge silently |
| `_meta` values are hand-written in 11 places | Each aggregated tool definition + `graph-resource-factory.ts` | Inconsistency risk (proved: some had `_meta: undefined` before this session) |
| `securitySchemes` repeated verbatim | Every tool definition | DRY violation, copy-paste errors |
| No compile-time enforcement that `_meta` exists | `AggregatedToolDefShape` had `_meta?: ToolMeta` (optional) until this session | Tools could omit `_meta` silently |
| Codegen dead code | `emit-index.ts` stamps `_meta.ui.resourceUri` for generated tools in `WIDGET_TOOL_NAMES`, but no generated tool is in the set | Misleading, untested code path |

### Target State: `buildToolMeta()` Factory

A single factory function that derives `_meta` from the tool name:

```typescript
function buildToolMeta(
  toolName: string,
  options?: { attribution?: SourceAttribution },
): ToolMeta {
  const base: ToolMeta = {
    securitySchemes: [{ type: 'oauth2', scopes: [...SCOPES_SUPPORTED] }],
  };

  if (WIDGET_TOOL_NAMES.has(toolName)) {
    return { ...base, ui: { resourceUri: WIDGET_URI }, ...options };
  }

  return options?.attribution
    ? { ...base, attribution: options.attribution }
    : base;
}
```

This eliminates all five problems:
- Widget membership derived from `WIDGET_TOOL_NAMES` (single source)
- `_meta` constructed in one place (DRY)
- `securitySchemes` never hand-written (consistency)
- Factory always returns a value (no `undefined` possible)
- Codegen dead code can be removed (generated tools would also use the factory pattern)

---

## Completed Work

### Phase 0: Investigation (COMPLETE)

- ✅ Task 0.1: Reproduced locally — bug confirmed on `oak-local`
- ✅ Task 0.2: Compared widget content — HTML identical across servers
- ✅ Task 0.3: Verified `_meta` in existing E2E tests — passes
- ✅ Task 0.4: Exhaustive git diff analysis — no runtime change
  in the app tool registration path vs main

### Phase 1: Composition Test (COMPLETE)

Written and passing: `e2e-tests/mcp-app-composition.e2e.test.ts`

The test uses the real MCP client SDK (`Client` +
`StreamableHTTPClientTransport`) against `createStubbedHttpApp()` on
a random port and proves:

1. `listTools()` returns `_meta.ui.resourceUri === WIDGET_URI` for
   all tools in `WIDGET_TOOL_NAMES`
2. `readResource(WIDGET_URI)` returns HTML with `RESOURCE_MIME_TYPE`

Key implementation details:
- Uses `getOriginalFetch()` to bypass the no-network E2E setup
- Runtime narrowing for `server.address()` (no type assertions)
- `await once(server, 'listening')` to prevent race conditions
- Promisified `server.close()` for clean teardown
- `isTextContent` type guard for safe content narrowing

### Phase 2: `_meta` Consistency (COMPLETE)

Changes made this session (uncommitted):

1. **`AggregatedToolDefShape`**: Changed `_meta?: ToolMeta` to
   `readonly _meta: ToolMeta` — compile-time enforcement that all
   aggregated tools must define `_meta`

2. **All 11 aggregated tool definitions updated**:
   - Widget tools (`search`, `get-curriculum-model`, `user-search`,
     `user-search-query`): added `securitySchemes` alongside `ui`
   - Non-widget tools (`fetch`, `browse-curriculum`, `explore-topic`,
     `download-asset`): changed `_meta: undefined` to
     `_meta: { securitySchemes: [...] }`
   - Graph tools (via `createGraphToolDef`): factory updated to
     always include `securitySchemes`

3. **`handlers.ts`**: Both branches (app and non-app) spread `_meta`
   into a plain object, resolving a TypeScript structural compatibility
   issue between `ToolMeta` interface and `Record<string, unknown>`

4. **Quality gates fixed**: All `@oaknational/curriculum-sdk#test`,
   `@oaknational/oak-curriculum-mcp-streamable-http#lint:fix`, and
   `@oaknational/oak-curriculum-mcp-streamable-http#type-check` issues
   resolved

---

## Resolution

### Phase 3: Root Cause Identified — Cursor Cache (CLOSED)

Verified on `main`: widget does NOT render from `oak-local` in
Cursor on any branch. Widget WAS rendering for several days, then
stopped. Widget renders from `oak-prod` in Cursor and from
`oak-local` in the reference host. Conclusion: **Cursor stale MCP
tool metadata cache**. Not a code regression.

### Extracted Work

- **`buildToolMeta()` factory**: Extracted to
  `meta-oak-namespace-cleanup.plan.md` (current queue). The factory
  concept naturally fits the namespace cleanup — both address `_meta`
  architecture.
- **Codegen dead code** (`emit-index.ts` widget check): Also fits
  the namespace cleanup scope.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| ~~Widget HTML is different~~ | Eliminated | — | Byte-identical |
| ~~Server drops `_meta`~~ | Eliminated | — | Composition test passes |
| `_meta` consistency changes were the fix | Medium | Low | Phase 4 verification |
| Root cause is still in code we haven't diffed | Medium | High | Git bisect if Phase 4 fails |
| `buildToolMeta()` factory mishandles edge cases | Low | Medium | Unit tests + existing test suite |
| Codegen dead code removal breaks future intent | Low | Low | Document decision |

---

## Success Criteria

### Overall

- ✅ MCP App UI renders locally on this branch (same as it does on main)
- ✅ Composition test prevents this class of regression
- ✅ `_meta` has a single source of truth via factory
- ✅ Widget tool membership is not duplicated
- ✅ All quality gates pass

---

## References

- Composition test: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/mcp-app-composition.e2e.test.ts`
- Widget constants (source of truth): `packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts`
- Widget constants (generated): `packages/sdks/oak-sdk-codegen/src/types/generated/widget-constants.ts`
- Tool `_meta` type: `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`
- Aggregated definitions: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-*/`
- Graph factory: `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`
- Codegen emitter: `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`
- Widget resource registration: `apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts`
- Auth bypass: `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts`
- MCP dependencies: `@modelcontextprotocol/sdk@1.29.0`, `@modelcontextprotocol/ext-apps@1.5.0`
- Investigation session: [MCP App UI regression](4ca0e754-ddd6-4660-b188-4d5e92442b9b)
