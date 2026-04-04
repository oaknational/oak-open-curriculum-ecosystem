---
name: "WS3: MCP App UI Rendering Investigation"
overview: "The brand banner does not render in Claude Code despite passing all code-level gates. Four issues identified, two compound."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: inspect-wire-protocol
    content: "Inspect the tools/list wire response for get-curriculum-model _meta structure."
    status: pending
  - id: adopt-registerAppTool
    content: "Replace server.registerTool with registerAppTool for UI-bearing tools."
    status: pending
  - id: resolve-tools-list-override
    content: "Resolve the preserve-schema-examples.ts override — must coexist with or be replaced by canonical approach."
    status: pending
  - id: test-basic-host
    content: "Verify widget rendering in ext-apps basic-host to isolate host vs server."
    status: pending
  - id: add-pipeline-integration-test
    content: "Add test proving tools/list → _meta.ui → resources/read → HTML chain."
    status: pending
  - id: visual-verification
    content: "Call get-curriculum-model in Claude Code and confirm banner appears."
    status: pending
---

# WS3: MCP App UI Rendering Investigation

**Status**: PENDING
**Last Updated**: 2026-04-04
**Scope**: The brand banner does not render in Claude Code despite
passing all code-level gates. Investigate root cause and fix.

---

## Context

Phase 4 implemented the brand banner — Oak logo + "Oak National Academy"
link, displayed when `get-curriculum-model` fires. All code-level quality
gates pass (`pnpm check` green, 16 widget tests, 157 E2E tests, 3 UI
tests, 1 a11y test). Three specialist reviewers (design-system,
accessibility, MCP) found no blocking issues.

However, when `get-curriculum-model` was called via the running local MCP
server (`oak-local`) in Claude Code (VS Code extension), the user saw no
brand banner. Only the text content (curriculum model data) was visible.
Claude Code does support MCP Apps (confirmed with evidence).

---

## The Problem

The MCP App brand banner does not render in Claude Code. The banner HTML
exists in `dist/mcp-app.html`, the tool descriptor includes
`_meta.ui.resourceUri`, and the `tools/list` response includes `_meta` —
but the host does not display the widget.

---

## Four Issues Identified

### 1. Wrong registration function

**Canonical**: `registerAppTool()` from `@modelcontextprotocol/ext-apps/server`.
**Actual**: `server.registerTool()` from the base MCP SDK.

**Source**: `handlers.ts:117` — `server.registerTool(tool.name, config, ...)`.

The ext-apps SDK type declarations at
`node_modules/@modelcontextprotocol/ext-apps/dist/src/server/index.d.ts`
confirm that `registerAppTool()` is a convenience wrapper that:

> "normalizes UI metadata: if `_meta.ui.resourceUri` is set, the legacy
> `_meta["ui/resourceUri"]` key is also populated (and vice versa) for
> compatibility with older hosts."

The legacy key is `RESOURCE_URI_META_KEY = "ui/resourceUri"` — a flat
key on `_meta`, NOT the nested `_meta.ui.resourceUri`. The ext-apps SDK
documentation says: "Host developers must check both formats for
compatibility." This means any host reading only the legacy flat key
would not discover the UI resource when only the modern nested key is
present.

**The repo's own documentation acknowledges this gap**:

- `handlers-tool-registration.integration.test.ts:5-6` says
  "`registerAppTool()` can handle UI metadata normalisation — raw
  `registerTool()` is insufficient"
- `mcp-apps-support.research.md:21` says "Register UI-bearing tools
  with `registerAppTool`"
- `mcp-add-ui/SKILL.md:39` says "Use `registerAppTool` to link the
  tool to its resource URI"

**Assumption to verify**: The missing legacy `_meta["ui/resourceUri"]`
key is why Claude Code does not render the widget. Claude Code may read
the legacy key from the `tools/list` response.

### 2. `preserve-schema-examples.ts` bypasses SDK tool listing

This module overrides the `tools/list` handler to work around the MCP
SDK's lossy Zod → JSON Schema conversion (which drops `examples`).

**Source**: `application.ts:230-231` — the wiring order:

```typescript
registerHandlers(server, handlerOptions);      // line 230
preserveSchemaExamplesInToolsList(server);      // line 231
```

The override at `preserve-schema-examples.ts:81` replaces the `tools/list`
handler with one that calls `toProtocolEntry()` for every tool.
`toProtocolEntry()` returns `_meta: tool._meta` directly from the SDK
tool definitions — which only contain the modern
`{ ui: { resourceUri: WIDGET_URI } }` format.

**This module's own TSDoc acknowledges the gap** (lines 31-37):

> "Since `registerAppTool` is NOT currently used (tools are registered
> via `server.registerTool` with `_meta` passthrough), there is no
> handler conflict. If `registerAppTool` is adopted in a future phase,
> ensure this override is called last to take precedence."

This violates the principles:

- "No shims, no hacks, no workarounds — Do it properly or do something
  else." (`principles.md:136-141`)
- The override replaces whatever `tools/list` handler the SDK installs,
  meaning any future SDK behaviour for `tools/list` (including MCP Apps
  metadata handling) is bypassed.

### CRITICAL: Issues #1 and #2 compound

**These two issues are not independent.** Even if `registerAppTool` is
adopted (Issue #1), the `preserve-schema-examples.ts` override (Issue #2)
replaces the `tools/list` handler. This means:

1. `registerAppTool` normalises the legacy key at **registration time**
2. But the `tools/list` override reads from `toProtocolEntry()`, which
   returns `tool._meta` from the **original SDK definitions**
3. The original definitions only have the modern key
4. The normalised legacy key from `registerAppTool` never reaches the
   `tools/list` response

**Both issues must be resolved together.** Fixing only one is
insufficient. The options are:

- **(A)** Adopt `registerAppTool` AND remove/rewrite the override so the
  SDK's own `tools/list` handler (with normalised metadata) is used
- **(B)** Adopt `registerAppTool` AND make the override also emit the
  legacy key (but this is a shim-on-a-shim)
- **(C)** Keep `server.registerTool` but manually add the legacy key to
  tool definitions (but this duplicates what `registerAppTool` does)

**Option A is the only one that satisfies the principles.** The
canonical alternatives to the override itself:

- Zod 4 `.meta()` — the module's own TSDoc notes that Zod 4.3.6 has
  `.meta()` which preserves metadata through `z.toJSONSchema()`, but
  the MCP SDK v1.28.0 uses its own converter that doesn't honour it.
- Direct JSON Schema passthrough — bypass Zod for the declaration side
  entirely, using the pre-generated JSON Schema from sdk-codegen.
- Upstream SDK fix — contribute a fix or wait for native `examples`
  support in `registerTool()`.

### 3. The implementation is unproven

The user called `get-curriculum-model` and saw no brand banner.

**What we know**:

- `dist/mcp-app.html` contains the BrandBanner component ✅
- The tool descriptor has `_meta.ui.resourceUri` ✅
- `toProtocolEntry()` passes `_meta` to the `tools/list` response ✅
- Claude Code supports MCP Apps ✅
- The user saw no banner ❌

**What we do not know**:

- Whether the `tools/list` response actually contains the correct
  `_meta` structure (never inspected the wire protocol)
- Whether the legacy `_meta["ui/resourceUri"]` key is required by
  Claude Code
- Whether the `preserve-schema-examples.ts` override interferes with
  MCP Apps discovery (it bypasses the SDK's handler — see compound
  analysis above)
- Whether the resource fetch (`resources/read` for the `ui://` URI)
  is being attempted by the host
- Whether the server process was running the latest build
- What the host actually does when it receives a tool result with
  `_meta.ui` — does it fetch the resource, render the iframe, or
  silently skip it?

**Additional observations**:

- The server never calls `getUiCapability()` to check whether the
  client supports MCP Apps before registering UI-bearing tools. This
  may be fine (unconditional registration is shown in the ext-apps SDK
  examples), but could mean the server registers widget tools for
  clients that ignore them.
- Resource registration uses `server.registerResource` directly, not
  `registerAppResource` from the ext-apps SDK. The `registerAppResource`
  wrapper defaults the MIME type and provides a cleaner callback API.
  Should be investigated whether this matters for discovery.

### 4. Test coverage does not prove UI functionality

The current test pyramid:

- **Widget unit tests** (16): Prove React components render in jsdom.
  They test the component tree, not the MCP App rendering pipeline.
- **E2E tests** (157): Prove tool responses via HTTP. They do not test
  widget rendering in an MCP host.
- **UI tests** (3): Prove the landing page renders in Playwright. They
  do not test the MCP App widget.
- **A11y tests** (1): Prove landing page WCAG compliance. They do not
  test widget accessibility in a real host.
- **Widget metadata E2E tests** (2): Prove `_meta.ui.resourceUri`
  exists on tool descriptors and that resource URIs map to registered
  resources. But they test the data structure, not the rendering.

**Gap**: No test proves that calling a UI-bearing tool in an MCP host
results in the widget being displayed. The test pyramid proves the
pieces exist in isolation but does not prove they compose into a
working MCP App experience.

**What would prove it**:

- A test that calls `get-curriculum-model` via the MCP protocol,
  verifies the response includes `_meta.ui`, fetches the resource at
  the declared URI, and validates the HTML contains the expected
  banner content.
- Visual verification in `basic-host` (the upstream ext-apps testing
  tool) — not automated, but proves end-to-end rendering.
- A Playwright test that loads the widget HTML directly and asserts
  banner content (already partially covered by widget unit tests, but
  not in a real browser with real CSS).

---

## Assumptions Register

| # | Assumption | Confidence | How to verify |
|---|-----------|------------|---------------|
| 1 | Missing legacy `_meta["ui/resourceUri"]` key causes Claude Code to skip widget rendering | Medium | Add the legacy key (via `registerAppTool`) and test |
| 2 | `preserve-schema-examples.ts` override bypasses normalised metadata from `registerAppTool` | **Verified** | Source analysis confirms `toProtocolEntry` reads from original definitions, not normalised store |
| 3 | Issues #1 and #2 must be resolved together — fixing either alone is insufficient | **Verified** | The override replaces `tools/list` regardless of registration method |
| 4 | The running server had the latest `dist/mcp-app.html` | Low | Rebuild, restart server, re-test |
| 5 | Claude Code fetches the resource at the `ui://` URI when it sees `_meta.ui` | Medium | Check server logs for `resources/read` requests |
| 6 | The resource registration (`registerWidgetResource`) serves correct HTML | High | Already verified `dist/mcp-app.html` contains banner |
| 7 | `registerAppTool` + resolving the override is the canonical fix | High | Confirmed by MCP reviewer and ext-apps SDK type declarations |

---

## Recommended Investigation Steps

1. **Inspect the wire protocol**: Add logging or use an MCP inspector
   to see exactly what the `tools/list` response contains for
   `get-curriculum-model` — specifically the `_meta` structure. Verify
   whether the legacy `_meta["ui/resourceUri"]` key is present or
   absent.

2. **Adopt `registerAppTool`**: Replace `server.registerTool` with
   `registerAppTool` for UI-bearing tools in `handlers.ts`. This is
   the canonical approach and adds the legacy metadata key at
   registration time.

3. **Resolve `preserve-schema-examples.ts`**: This override MUST be
   addressed together with `registerAppTool` adoption. Options:
   - **(A) Remove the override entirely** if a canonical alternative
     for `examples` exists (Zod 4 `.meta()`, direct JSON Schema, or
     upstream SDK fix). This is the cleanest path — the SDK's own
     `tools/list` handler would then serve normalised metadata.
   - **(B) Rewrite the override** to also emit the legacy key, if the
     override must stay. But this is a shim-on-a-shim.
   - Check the module's removal conditions (lines 52-59) against the
     current SDK version to determine whether removal is viable.

4. **Test in `basic-host`**: Run the server and load the widget in the
   upstream `basic-host` tool to isolate whether the issue is
   host-specific (Claude Code) or server-side.

5. **Add integration test for the full MCP App pipeline**: A test that
   verifies `tools/list` → `_meta.ui` → `resources/read` → HTML
   content forms a complete chain. Should verify BOTH modern and legacy
   `_meta` key formats in the `tools/list` response.

6. **Visual verification**: After fixes, call `get-curriculum-model`
   in Claude Code and confirm the banner appears.

---

## Architecture Deep-Dive Notes (for next session)

### Per-request server factory

`application.ts:225-234` creates a **fresh `McpServer` per request**.
Registration happens every time. The factory:

```typescript
const mcpFactory: McpServerFactory = () => {
  const server = new McpServer(...);
  registerHandlers(server, handlerOptions);       // registers tools
  preserveSchemaExamplesInToolsList(server);       // overrides tools/list
  const transport = new StreamableHTTPServerTransport(...);
  return { server, transport };
};
```

This means any fix to registration must work within this per-request
lifecycle.

### Tool metadata flow (current)

```text
SDK tool definitions → _meta.ui.resourceUri (modern only)
       ↓
toRegistrationConfig() → passes _meta through to server.registerTool
       ↓
server.registerTool() → stores tool internally
       ↓
preserveSchemaExamplesInToolsList() → overrides tools/list handler
       ↓
tools/list request → calls toProtocolEntry() → returns _meta from
                     original definitions (modern key only)
```

### Tool metadata flow (target)

```text
SDK tool definitions → _meta.ui.resourceUri (modern only)
       ↓
toRegistrationConfig() → passes _meta through
       ↓
registerAppTool() → normalises both modern AND legacy keys
       ↓
SDK's own tools/list handler → serves normalised metadata
                               (both key formats)
       ↓
OR: override emits both keys (if override must stay)
```

### Which tools are widget tools?

From SDK definitions (all have `_meta: { ui: { resourceUri: WIDGET_URI } }`):

- `get-curriculum-model` — session-start proxy / brand banner trigger
- `search` — model-facing search (also triggers widget)
- `user-search` — UI-first user search (Phase 5)
- `user-search-query` — helper tool, visibility `['app']` only

### ext-apps SDK exports used by this repo

- `RESOURCE_MIME_TYPE` — used in `register-resources.ts:12` and tests
- `McpUiReadResourceResult` (type) — used in resource registration tests
- **NOT used**: `registerAppTool`, `registerAppResource`,
  `getUiCapability`, `EXTENSION_ID`, `RESOURCE_URI_META_KEY`

---

## Files to Read First

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — tool
  registration (line 117: `server.registerTool`)
- `apps/oak-curriculum-mcp-streamable-http/src/application.ts` — the
  per-request factory (lines 225-234: `registerHandlers` then
  `preserveSchemaExamplesInToolsList`)
- `apps/oak-curriculum-mcp-streamable-http/src/preserve-schema-examples.ts`
  — `tools/list` override (note lines 31-37 TSDoc on `registerAppTool`
  coexistence)
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
  — widget resource registration (`registerWidgetResource` at line 176)
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts`
  — `toProtocolEntry()` (line 99) and `toRegistrationConfig()` (line 67)
- `node_modules/@modelcontextprotocol/ext-apps/dist/src/server/index.d.ts`
  — `registerAppTool` type declaration and documentation (line 183)
- `node_modules/@modelcontextprotocol/ext-apps/dist/src/app.d.ts`
  — `RESOURCE_URI_META_KEY = "ui/resourceUri"` (line 65)

---

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent plan (Phase 4)
- `ws3-phase-4-brand-banner.plan.md` — companion plan (COMPLETE)
- `mcp-app-extension-migration.plan.md` — umbrella migration plan
