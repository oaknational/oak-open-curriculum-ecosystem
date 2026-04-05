---
name: "WS3: Off-the-Shelf MCP SDK Adoption"
overview: "Replace hand-rolled MCP App registration, tools/list override, and dual-schema pipeline with the canonical ext-apps SDK functions and Zod 4 .meta() for example preservation. Single pipeline, no shims."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "mcp-reviewer"
isProject: false
todos:
  - id: phase-1-codegen-meta
    content: "Phase 1: Add .meta({ examples }) to generated Zod schemas at codegen time."
    status: done
  - id: phase-2-aggregated-zod
    content: "Phase 2: Give aggregated tools Zod input schemas with .meta({ examples })."
    status: pending
  - id: phase-3-adopt-registerAppTool
    content: "Phase 3: Adopt registerAppTool and registerAppResource in the HTTP app."
    status: pending
  - id: phase-4-delete-shim
    content: "Phase 4: Delete preserve-schema-examples.ts and all supporting dead code."
    status: pending
  - id: phase-5-prove
    content: "Phase 5: Add integration test proving the full MCP App pipeline, verify in host."
    status: pending
---

# WS3: Off-the-Shelf MCP SDK Adoption

**Status**: IN PROGRESS (Phase 1 complete, Phase 2 next)
**Last Updated**: 2026-04-05
**Scope**: Replace hand-rolled MCP App infrastructure with canonical
ext-apps SDK functions and Zod 4 `.meta()` for example preservation.
**Blocks**: WS3 Phase 5 (interactive user search view).

> The MCP App UI does not render because we hand-rolled what the SDK
> provides. The fix is to stop hand-rolling and use the SDK.

---

## Context

The rendering investigation
(`ws3-mcp-app-rendering-investigation.plan.md`) identified four issues,
two of which compound. The root cause is architectural: the codebase
uses none of the ext-apps SDK's registration functions and instead
maintains a `tools/list` handler override (shim) that bypasses the
SDK's metadata normalisation.

### What we have (broken, dual-path)

```text
OpenAPI spec
  ↓ sdk-codegen
  ├─→ JSON Schema WITH examples  (toolInputJsonSchema)
  └─→ Zod schema WITHOUT examples (toolMcpFlatInputSchema)
        ↓
        extractZodShape() → raw shape (no metadata)
        ↓
        server.registerTool() ← wrong function for UI tools
        ↓
        preserve-schema-examples.ts REPLACES tools/list handler
        ↓
        toProtocolEntry() returns JSON Schema + _meta (modern key only)
        ↓
        Host reads legacy _meta key → finds nothing → no widget
```

### What we need (correct, single path, off-the-shelf)

```text
OpenAPI spec
  ↓ sdk-codegen
  └─→ Zod schema WITH .meta({ examples }) ← single source
        ↓
        registerAppTool() for UI tools ← normalises both _meta keys
        server.registerTool() for non-UI tools ← standard
        registerAppResource() for widget ← correct MIME + callback
        ↓
        SDK's own tools/list handler ← no override needed
        ↓
        Zod 4 native toJSONSchema() preserves .meta() → examples appear
        _meta has BOTH modern and legacy keys
        ↓
        Host renders widget
```

---

## Foundation Alignment

This plan is governed by:

- `.agent/directives/principles.md` — no shims, no workarounds, off-the-shelf
- `.agent/directives/testing-strategy.md` — TDD at all levels
- `.agent/directives/schema-first-execution.md` — types flow from schema

Key principles enforced:

1. "No shims, no hacks, no workarounds — Do it properly or do
   something else." (principles.md:136-141)
2. "Use off-the-shelf libraries, not custom plumbing." (feedback memory)
3. "Apps are thin user interfaces. SDKs own all domain-specific logic."
   (principles.md:446-469)

---

## Verified Technical Foundations

These facts were verified during investigation (2026-04-04/05):

| Fact | Evidence |
|------|----------|
| Zod 4.3.6 installed | `node_modules/zod/package.json` |
| `.meta()` accepts `{ examples: [...] }` | `zod/v4/core/registries.d.ts` — `JSONSchemaMeta` has `[k: string]: unknown` |
| `.meta()` survives `z4mini.toJSONSchema()` | `zod/src/v4/core/to-json-schema.ts` — `Object.assign(result.schema, meta)` |
| MCP SDK v1.28.0 detects Zod 4 via `_zod` | `zod-compat.js:8-12` — `isZ4Schema(s) { return !!schema._zod }` |
| MCP SDK uses Zod 4 native `toJSONSchema()` | `zod-json-schema-compat.js:19-24` — v4 branch |
| SDK `tools/list` passes `_meta` through | `mcp.js:86` — `_meta: tool._meta` |
| `registerAppTool` normalises both _meta keys | ext-apps SDK source — mirrors modern↔legacy bidirectionally |
| `.meta()` works on `z.enum()` | Verified: enum is non-transforming, examples preserved |
| `.meta()` on `z.preprocess()` — examples deleted when `io='input'` | Verified: `isTransforming()` returns true for pipe/preprocess |
| `.shape` extraction preserves `.meta()` instances | Verified: WeakMap keyed by schema instance, same ref in shape |
| `z4mini.toJSONSchema()` === `z.toJSONSchema()` | Same implementation, same `globalRegistry` |
| Shim's own removal condition #1 is met | preserve-schema-examples.ts:52-59 |
| Only 3 tools use `z.preprocess()` | get-sequences-units, get-sequences-assets, get-sequences-questions |

---

## Known Edge Case: `z.preprocess()` and `pipeStrategy: 'input'`

When Zod 4's `toJSONSchema()` is called with `io: 'input'` (which
the MCP SDK does), it deletes `examples` and `default` from
transforming schemas. `z.preprocess()` creates a pipe with a
transform, so it counts as transforming.

**Affected tools**: `get-sequences-units`, `get-sequences-assets`,
`get-sequences-questions` — all use `z.preprocess()` for year
normalisation (M1-S002).

**Mitigation**: These tools' year parameter already has a strict
`z.enum()` with all allowed values visible. The `examples` field
is informational, not essential for these parameters. Two options:

- **(A)** Accept that year parameters on these 3 tools lose their
  example in the JSON Schema output. The enum constraint is
  sufficient guidance.
- **(B)** Apply `.meta({ examples })` to the inner `z.enum()` rather
  than the outer `z.preprocess()` wrapper. The `toJSONSchema()`
  output for the inner schema would include examples, though the
  outer pipe might strip them. Needs verification.
- **(C)** Restructure year normalisation to avoid `z.preprocess()`
  entirely — use a Zod 4 `z.union()` with explicit branches. This
  avoids the transform classification.

**Decision**: **Option A**. Accept that year parameters on these 3
tools lose their example in the JSON Schema output. The enum constraint
provides sufficient guidance. The `.meta()` call is not emitted for
`z.preprocess()` year parameters. This is a documented exception, not a
compatibility workaround. Phase 1 codegen skips `.meta()` when the
parameter triggers `isYearParameterRequiringNormalisation()`.

The `isTransforming` deletion is per-field, not per-object — sibling
fields on the same tool retain their examples. Only the year parameter
itself loses its example.

---

## Phases

### Phase 1: Add `.meta({ examples })` to Generated Zod Schemas

**Goal**: Make `toolMcpFlatInputSchema` carry examples through the
Zod 4 → JSON Schema conversion so the MCP SDK's own `tools/list`
handler produces JSON Schema with examples.

**Approach**: TDD. Write tests first in sdk-codegen.

#### RED

1. Write a unit test for `buildZodType()` that asserts: when
   `meta.example` is defined, the output string contains
   `.meta({ examples: [...] })`.
2. Write a unit test for a generated tool (e.g.
   `get-key-stages-subject-lessons`) that asserts: calling
   `z.toJSONSchema()` on `toolMcpFlatInputSchema` produces
   JSON Schema with `examples` on fields that have them.

#### GREEN

Modify `buildZodType()` in
`packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts`:

- When `meta.example !== undefined`, append
  `.meta({ examples: [<example>] })` to the generated Zod string.
- For `z.preprocess()` year parameters, apply Option A: skip `.meta()`
  when `isYearParameterRequiringNormalisation()` returns true. The enum
  constraint is sufficient; the example loss is documented.

Run `pnpm sdk-codegen` to regenerate all tool files.

#### REFACTOR

- Verify all generated `toolMcpFlatInputSchema` exports now include
  `.meta()` where examples existed in `toolInputJsonSchema`.
- Run `pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint:fix && pnpm test`.

**Note on string-based codegen**: `.meta()` is emitted as a string
literal (e.g. `.meta({ examples: ["ks1"] })`). The TypeScript compiler
sees the generated output as typed Zod code, but it cannot catch a
typo in the codegen template (e.g. `example` instead of `examples`).
The Phase 1 RED test #2 (calling `z.toJSONSchema()` and asserting
`examples` appears) is the **mandatory mitigation** — it is blocking
for Phase 1 GREEN.

#### Acceptance

- `buildZodType()` unit tests pass.
- A generated tool's `toolMcpFlatInputSchema`, when converted via
  `z.toJSONSchema()`, includes `examples` on fields that have
  OpenAPI examples.
- `z.preprocess()` edge case is handled (documented exception or
  restructured).
- All quality gates pass.

---

### Phase 2: Give Aggregated Tools Zod Input Schemas

**Goal**: Replace JSON Schema `inputSchema` on aggregated tools with
Zod schemas that include `.describe()` and `.meta({ examples })`, so
the MCP SDK can convert them through the standard pipeline.

**Approach**: TDD. One tool at a time.

#### Scope

10 aggregated tools in
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`:

| Tool | Has Examples | Has Validation Zod | Complexity |
|------|-------------|-------------------|------------|
| search | Yes (7 fields) | Yes (validation.ts) | High |
| fetch | Yes (1 field) | Yes (union schema) | Medium |
| get-curriculum-model | No | No (type guard) | Low |
| get-thread-progressions | — (empty) | No | Trivial |
| get-prerequisite-graph | — (empty) | No | Trivial |
| browse-curriculum | Yes (2 fields) | Yes (validation.ts) | Low |
| explore-topic | Yes (3 fields) | Yes (validation.ts) | Low |
| download-asset | Yes (1 field) | Yes (execution.ts) | Low |
| user-search | Yes (4 fields) | Yes (validation.ts) | Medium |
| user-search-query | Yes (4 fields) | Yes (shared) | Medium |

#### RED

For each aggregated tool (start with `search` as the most complex):

1. Write a unit test that asserts: `listUniversalTools()` returns an
   entry for the tool with `flatZodSchema` defined (not undefined).
2. Write a unit test that asserts: calling `z.toJSONSchema()` on a
   `z.object()` built from the tool's `flatZodSchema` produces
   JSON Schema with `examples` on fields that have them.

#### Approach per tool

1. Add a `flatZodSchema` export alongside the existing JSON Schema
   `inputSchema`. The Zod schema uses `.describe()` for descriptions
   and `.meta({ examples: [...] })` for examples.
2. Update the tool definition in `AGGREGATED_TOOL_DEFS` to include
   `flatZodSchema`.
3. **Update `listUniversalTools()` aggregated entries mapping**
   (lines 45-57 of `list-tools.ts`) to propagate `flatZodSchema`
   from each `AGGREGATED_TOOL_DEFS` entry. Currently this mapping
   does NOT include `flatZodSchema` — aggregated entries have it as
   `undefined`. This is a required change.
4. Update the `AggregatedToolDefShape` structural guard in
   `definitions.ts` to include optional `flatZodSchema`.
   Note: `AGGREGATED_TOOL_DEFS` is declared `as const`. Zod schema
   instances are class objects and survive `as const` freezing, but
   the narrowly inferred type may need explicit typing. The structural
   guard update ensures compile-time enforcement.
5. The existing JSON Schema `inputSchema` remains until Phase 4
   traces all consumers and confirms it can be deleted.

#### Simplification for empty-param tools

`get-thread-progressions` and `get-prerequisite-graph` have empty
input schemas (`properties: {}`). Their Zod equivalent is
`z.object({})` — trivial.

#### Acceptance

- All 10 aggregated tools have `flatZodSchema` exports.
- `listUniversalTools()` returns entries with `flatZodSchema` for
  all tools (aggregated and generated).
- The MCP SDK's Zod → JSON Schema conversion produces correct
  JSON Schema for all aggregated tools (tested).
- All quality gates pass.

---

### Phase 3: Adopt `registerAppTool` and `registerAppResource`

**Goal**: Use the ext-apps SDK's canonical registration functions so
`_meta` is normalised correctly (both modern and legacy keys).

**Approach**: TDD.

#### RED

1. Write an integration test that asserts: after registering a
   UI-bearing tool, the `tools/list` response contains BOTH
   `_meta.ui.resourceUri` AND `_meta["ui/resourceUri"]`.
2. Write an integration test that asserts: after registering a
   non-UI tool, the `tools/list` response contains `_meta` without
   any `ui` keys.

#### GREEN

Modify `handlers.ts`:

```typescript
import { registerAppTool } from '@modelcontextprotocol/ext-apps/server';

for (const tool of listUniversalTools(generatedToolRegistry)) {
  const config = toRegistrationConfig(tool);
  const handler = wrapToolHandler(tool.name, async (params, extra) => {
    return handleToolWithAuthInterception({ ... });
  }, mcpObservation);

  if (tool._meta?.ui) {
    registerAppTool(server, tool.name, config, handler);
  } else {
    server.registerTool(tool.name, config, handler);
  }
}
```

Modify `register-resources.ts`:

```typescript
import { registerAppResource } from '@modelcontextprotocol/ext-apps/server';
```

Use `registerAppResource` for the widget resource registration.

#### Type resolution: `toAppToolRegistrationConfig()`

`registerAppTool` requires `McpUiAppToolConfig` with non-optional
`_meta` containing a `ui` key. `toRegistrationConfig()` returns
`_meta: ToolMeta | undefined` — TypeScript cannot narrow this across
function boundaries. A type assertion would be forbidden.

**Resolution**: Create a separate `toAppToolRegistrationConfig()` in
`projections.ts` that accepts a `UniversalToolListEntry` known to
have `_meta.ui` and returns a type satisfying `McpUiAppToolConfig`.
This is a second projection function, not an overload. The call site
becomes:

```typescript
if (tool._meta?.ui) {
  const config = toAppToolRegistrationConfig(tool);
  registerAppTool(server, tool.name, config, handler);
} else {
  const config = toRegistrationConfig(tool);
  server.registerTool(tool.name, config, handler);
}
```

#### Type resolution: `registerAppResource` callback

`registerAppResource`'s callback type is `McpUiReadResourceCallback`:
`(uri: URL, extra) => McpUiReadResourceResult | Promise<...>`.
`McpUiReadResourceResult` extends `ReadResourceResult` with optional
`_meta.ui`.

**Resolution**: Adapt `registerWidgetResource()` in
`register-resources.ts` to use `registerAppResource` and produce a
callback matching `McpUiReadResourceCallback`. The `wrapResourceHandler`
may need a signature update or the widget resource may bypass it
and use `registerAppResource` directly with an inline callback.

**Scope**: Only `registerWidgetResource` changes. Documentation
resources, curriculum model, prerequisite graph, and thread
progressions remain on `server.registerResource` — they are not
MCP App resources.

#### Existing test implication

`handlers-tool-registration.integration.test.ts` spies on
`server.registerTool` and asserts all tools pass through it.
After this change, UI-bearing tools go through `registerAppTool`,
which internally calls `server.registerTool` — so the spy still
fires. This should be verified but is expected to work without
test changes.

#### Acceptance

- UI-bearing tools are registered via `registerAppTool`.
- Non-UI tools are registered via `server.registerTool`.
- Widget resource is registered via `registerAppResource`.
- `tools/list` response contains both modern and legacy `_meta` keys
  for UI tools.
- No ext-apps SDK registration functions remain unused for their
  intended purpose.
- All quality gates pass.

---

### Phase 4: Delete the Shim and Dead Code

**Goal**: Remove `preserve-schema-examples.ts` and all code that
existed solely to support it.

**Approach**: Deletion is the refactor step. Tests from Phases 1-3
are the safety net.

#### Delete

1. `apps/oak-curriculum-mcp-streamable-http/src/preserve-schema-examples.ts`
   — the shim itself.
2. `preserveSchemaExamplesInToolsList(server)` call in
   `application.ts:231`.
3. `toProtocolEntry()` in
   `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts`
   — only existed to serve the shim.
4. `extractZodShape()` and `isZodObject()` in
   `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/zod-utils.ts`
   — no longer needed if we pass Zod objects directly.
5. Any imports of the above in barrel files.
6. Any tests that only tested the deleted code (not tests that prove
   remaining behaviour).

#### Mandatory consumer trace and deletion

These items are **not optional** — trace all consumers and either
delete or create a named, time-boxed follow-up within this plan:

- `zodRawShapeFromToolInputJsonSchema()` in `zod-input-schema.ts` —
  after Phase 2, all tools have `flatZodSchema`, so the runtime
  JSON Schema → Zod conversion fallback in `projections.ts:50` is
  dead. Delete the function AND its public barrel export at
  `src/public/mcp-tools.ts:66`. Verify no other consumers exist.
- `toolInputJsonSchema` constants in generated tool files — trace
  all usages. Known consumers: `describeToolArgs()` error messages,
  `toProtocolEntry()` (already deleted above). If `describeToolArgs()`
  is the only remaining consumer, assess whether it can derive its
  message from the Zod schema. **Do not delete if other consumers
  exist** — list them explicitly.
- Aggregated tool JSON Schema `inputSchema` — if `flatZodSchema`
  fully replaces it for MCP registration and no other consumer
  exists, delete it. If consumers remain, list them and create a
  follow-up task with a target date.

#### Acceptance

- `preserve-schema-examples.ts` does not exist.
- No code in the active path calls `server.server.setRequestHandler`
  to override `tools/list`.
- `toProtocolEntry` is deleted or has no callers.
- `pnpm check` passes.
- Contamination check: `rg 'preserveSchemaExamples\|toProtocolEntry'`
  returns zero active-path hits. Test files referencing deleted
  functions will produce compile failures caught by `pnpm type-check`
  — the contamination grep targets production code, not test residue.

---

### Phase 5: Prove the Pipeline Works End-to-End

**Goal**: Add the missing integration test and verify in a real host.

**Approach**: TDD.

#### E2E test

Write `mcp-app-pipeline.e2e.test.ts` in
`apps/oak-curriculum-mcp-streamable-http/e2e-tests/`. This is an
out-of-process E2E test (exercises the running server over HTTP).

The test must assert:

1. Calls `tools/list` via the MCP protocol.
2. For a UI-bearing tool (e.g. `get-curriculum-model`), asserts:
   - `_meta.ui.resourceUri` is present (modern key).
   - `_meta["ui/resourceUri"]` is present (legacy key).
   - Both values are equal and match `WIDGET_URI`.
   - `_meta.securitySchemes` is present (survives `registerAppTool`
     normalisation).
3. For `user-search-query`, asserts:
   - `_meta.ui.visibility` is `['app']` (app-only tool).
4. For a tool with examples (e.g. `get-key-stages-subject-lessons`),
   asserts:
   - `inputSchema.properties.keyStage.examples` contains `["ks1"]`.
5. Calls `resources/read` for the widget URI, asserts:
   - Response contains HTML with expected banner content.
   - MIME type is `text/html;profile=mcp-app`.

#### Host verification

1. Rebuild: `pnpm build`.
2. Start local server: `pnpm dev:auth:stub`.
3. Call `get-curriculum-model` in Claude Code (VS Code extension).
4. Verify the brand banner renders.

#### Acceptance

- Integration test proves `tools/list` → `_meta` (both keys) →
  `resources/read` → HTML chain.
- Visual verification in Claude Code confirms banner renders.
- `pnpm check` passes.

---

## Known Limitations

- **`getUiCapability` not used**: The ext-apps SDK provides
  `getUiCapability()` for checking whether the connected client
  supports MCP Apps UI. The per-request stateless transport pattern
  (ADR-112) means there is no persistent `oninitialized` callback
  where capability negotiation could occur. UI-bearing tools are
  registered unconditionally. Text-only fallback is provided via
  `content` in tool results (already implemented in Phase 4's brand
  banner).
- **Outer object metadata not preserved through `.shape` extraction**:
  When `extractZodShape()` accesses `.shape` on a `z.object()`, any
  `.meta()` attached to the outer object itself is discarded — only
  field-level `.meta()` survives (because the field schema instances
  are reused by reference in the WeakMap-based `globalRegistry`).
  This plan only attaches `.meta()` to field schemas, so this is not
  a problem. If future work needs per-tool object-level metadata
  (e.g. `$schema`, `id`), the outer schema instance would need to be
  preserved instead of extracting `.shape`.

## Verified Compatibility Notes

- **`registerHandlers` Pick type**: `registerHandlers()` accepts
  `Pick<McpServer, 'registerTool' | 'registerResource' | 'registerPrompt'>`.
  The ext-apps SDK's `registerAppTool` accepts
  `Pick<McpServer, 'registerTool'>` — a subset. The wider Pick is
  structurally compatible. No type widening needed.
- **No Zod 3 leakage risk**: The `openapi-zod-client-adapter`
  boundary (string transformation via `transformZodV3ToV4`) ensures
  generated files import from `"zod"` which resolves to Zod 4.3.6.
  The MCP SDK's `isZ4Schema()` detects Zod 4 via the `_zod` property.
  All generated schemas will take the v4 path.

---

## What This Plan Supersedes

This plan supersedes the rendering investigation plan
(`ws3-mcp-app-rendering-investigation.plan.md`) which identified
the issues but did not prescribe the architectural fix. The
investigation plan's 6 recommended steps are subsumed by this plan's
5 phases:

| Investigation step | Covered by |
|--------------------|------------|
| 1. Inspect wire protocol | Phase 5 (integration test) |
| 2. Adopt registerAppTool | Phase 3 |
| 3. Resolve preserve-schema-examples | Phase 4 (delete) |
| 4. Test in basic-host | Phase 5 (host verification) |
| 5. Add pipeline integration test | Phase 5 |
| 6. Visual verification | Phase 5 |

---

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent plan
- `ws3-mcp-app-rendering-investigation.plan.md` — superseded investigation
  (move to `archive/` when this plan becomes active)
- `mcp-app-extension-migration.plan.md` — umbrella migration plan
- `ws3-phase-5-interactive-user-search-view.plan.md` — blocked by this plan

---

## Quality Gates

Run after each phase:

```bash
pnpm sdk-codegen        # Phase 1 (regenerates tools)
pnpm build
pnpm type-check
pnpm lint:fix
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm check              # Final aggregate verification
```

## Reviewer Set

- `mcp-reviewer` — MCP protocol compliance, ext-apps SDK usage
- `code-reviewer` — gateway quality review
- `type-reviewer` — Zod 4 type flow, `.meta()` type safety
- `architecture-reviewer-barney` — boundary simplification, dead code

## Review Record (2026-04-05)

Four specialist reviewers examined this plan pre-implementation.
All blocking and non-blocking findings have been addressed.

| Reviewer | Blocking | Non-Blocking | Key Contribution |
|----------|----------|-------------|------------------|
| architecture-reviewer-barney | 1 | 5 | Dual-schema exit path (B3), Option A commitment (B6) |
| mcp-reviewer | 2 | 5 | `McpUiReadResourceCallback` signature (B2), `getUiCapability` limitation |
| code-reviewer | 4 | 5 | `listUniversalTools()` mapping gap (B4), barrel export (B5) |
| type-reviewer | 2 | 3 | `_meta` type mismatch proof (B1), string codegen test mandate (B7) |

All 7 blocking findings resolved:

- B1: `toAppToolRegistrationConfig()` prescribed (Phase 3)
- B2: `registerWidgetResource` adaptation prescribed (Phase 3)
- B3: Phase 4 deletion promoted to mandatory with consumer trace
- B4: `listUniversalTools()` mapping update added to Phase 2
- B5: Barrel export removal added to Phase 4
- B6: Option A committed for `z.preprocess()` edge case
- B7: Phase 1 RED test #2 is blocking for GREEN

Non-blocking findings addressed:

- NB1: Phase 5 asserts `_meta.securitySchemes` survives (MCP)
- NB2: Phase 5 asserts `user-search-query` visibility (MCP)
- NB3: Known Limitations section added for `getUiCapability` (MCP)
- NB4: Phase 3 spy implication documented (Code)
- NB5: Phase 5 test classified as E2E with file name (Code)
- NB6: Phase 1 REFACTOR includes `pnpm sdk-codegen` (Code)
- NB7: `as const` + structural guard noted in Phase 2 (Code)
- NB8: Phase 2 has explicit RED test specification (Code)
- NB9: Investigation plan archival noted in cross-refs (Code)
- NB10: `.shape` preserves `.meta()` — validated, no action (Type)
- NB11: No Zod 3 leakage — validated, added to compatibility
  notes (Type)
- Contamination grep exclusion of test files documented (Code)
- Outer object metadata limitation documented (Type)
- `registerHandlers` Pick type compatibility documented (Barney)
