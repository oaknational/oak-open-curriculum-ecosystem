---
name: "WS3: Off-the-Shelf MCP SDK Adoption"
overview: "Replace hand-rolled MCP App registration, tools/list override, and dual-schema pipeline with the canonical ext-apps SDK functions and Zod 4 .meta() for example preservation. Single pipeline, no shims."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "mcp-reviewer"
isProject: false
todos:
  - id: phase-1-codegen-meta
    content: "Phase 1: Add .meta({ examples }) to generated Zod schemas at codegen time."
    status: pending
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

**Status**: PENDING
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

**Decision**: Defer to implementation phase. All options are
acceptable. Option A is simplest; Option C is cleanest but broader.

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
- For `z.preprocess()` year parameters, apply Option A (no `.meta()`
  on the preprocess wrapper) or Option B/C per the edge case analysis.

Run `pnpm sdk-codegen` to regenerate all tool files.

#### REFACTOR

- Verify all generated `toolMcpFlatInputSchema` exports now include
  `.meta()` where examples existed in `toolInputJsonSchema`.
- Run `pnpm build && pnpm type-check && pnpm lint:fix && pnpm test`.

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

#### Approach per tool

1. Add a `flatZodSchema` export alongside the existing JSON Schema
   `inputSchema`. The Zod schema uses `.describe()` for descriptions
   and `.meta({ examples: [...] })` for examples.
2. Update the tool definition in `AGGREGATED_TOOL_DEFS` to include
   `flatZodSchema`.
3. `listUniversalTools()` already checks `flatZodSchema` first — no
   change needed there.
4. The existing JSON Schema `inputSchema` remains for now (used by
   `describeToolArgs` error messages and potentially other consumers).
   Removal is a separate follow-up.

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

#### Type considerations

- `registerAppTool` expects `McpUiAppToolConfig` which requires
  `_meta` to be non-optional with a `ui` key. The current
  `toRegistrationConfig()` returns `_meta: ToolMeta | undefined`.
  The conditional branch (`if (tool._meta?.ui)`) ensures the type
  narrows correctly, but `toRegistrationConfig()` may need a
  UI-specific overload or the config may need to be constructed
  differently for `registerAppTool`.
- `registerAppResource`'s callback type is `McpUiReadResourceCallback`
  which takes `(uri: URL, extra)`. The current `wrapResourceHandler`
  may need signature adjustment.

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

#### Also assess for deletion

- `toolInputJsonSchema` constants in generated tool files — if the
  only remaining consumer is `describeToolArgs()` error messages.
  If so, consider whether `describeToolArgs()` can derive its message
  from the Zod schema instead. **Do not delete if other consumers
  exist** — trace all usages first.
- `zodRawShapeFromToolInputJsonSchema()` in `zod-input-schema.ts` —
  if aggregated tools now have `flatZodSchema`, this runtime
  conversion may be dead code. Trace consumers.

#### Acceptance

- `preserve-schema-examples.ts` does not exist.
- No code in the active path calls `server.server.setRequestHandler`
  to override `tools/list`.
- `toProtocolEntry` is deleted or has no callers.
- `pnpm check` passes.
- Contamination check: `rg 'preserveSchemaExamples\|toProtocolEntry'`
  returns zero active-path hits.

---

### Phase 5: Prove the Pipeline Works End-to-End

**Goal**: Add the missing integration test and verify in a real host.

**Approach**: TDD.

#### Integration test

Write a test in `e2e-tests/` that:

1. Calls `tools/list` via the MCP protocol.
2. For a UI-bearing tool (e.g. `get-curriculum-model`), asserts:
   - `_meta.ui.resourceUri` is present (modern key).
   - `_meta["ui/resourceUri"]` is present (legacy key).
   - Both values are equal and match `WIDGET_URI`.
3. For a tool with examples (e.g. `get-key-stages-subject-lessons`),
   asserts:
   - `inputSchema.properties.keyStage.examples` contains `["ks1"]`.
4. Calls `resources/read` for the widget URI, asserts:
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
