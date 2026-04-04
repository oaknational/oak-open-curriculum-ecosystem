---
name: "WS3: MCP App UI Rendering Investigation"
overview: "The brand banner does not render in Claude Code despite passing all code-level gates. Four issues identified."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
isProject: false
todos:
  - id: inspect-wire-protocol
    content: "Inspect the tools/list wire response for get-curriculum-model _meta structure."
    status: pending
  - id: adopt-registerAppTool
    content: "Replace server.registerTool with registerAppTool for UI-bearing tools."
    status: pending
  - id: investigate-preserve-schema-examples
    content: "Determine if preserve-schema-examples.ts can be removed or must coexist."
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
**Scope**: The brand banner does not render in Claude Code despite passing
all code-level gates. Investigate root cause and fix.

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

The MCP reviewer confirmed with evidence from the SDK source, official
examples (`basic-server-react`, `map-server`, `wiki-explorer-server`),
and the repo's own research and skills that `registerAppTool()` is the
canonical approach.

**What `registerAppTool()` does that `server.registerTool()` does not**:
normalises both `_meta.ui.resourceUri` (modern key) and
`_meta["ui/resourceUri"]` (legacy key). If you supply one, it populates
the other. Without this normalisation, hosts that read the legacy key
will not discover the UI resource.

**The repo's own documentation acknowledges this**:

- `handlers-tool-registration.integration.test.ts:5-6` says
  "`registerAppTool()` can handle UI metadata normalisation — raw
  `registerTool()` is insufficient"
- `mcp-apps-support.research.md:21` says "Register UI-bearing tools
  with `registerAppTool`"
- `mcp-add-ui/SKILL.md:39` says "Use `registerAppTool` to link the
  tool to its resource URI"

Yet production code at `handlers.ts:117` uses `server.registerTool()`.

**Assumption to verify**: The missing legacy `_meta["ui/resourceUri"]`
key is why Claude Code does not render the widget. Claude Code may read
the legacy key from the `tools/list` response.

### 2. `preserve-schema-examples.ts` is a compatibility layer

This module overrides the `tools/list` handler to work around the MCP
SDK's lossy Zod → JSON Schema conversion (which drops `examples`).

This violates the principles:

- "No shims, no hacks, no workarounds — Do it properly or do something
  else." (`principles.md:136-141`)
- The override replaces whatever `tools/list` handler the SDK installs,
  meaning any future SDK behaviour for `tools/list` (including MCP Apps
  metadata handling) is bypassed.

**Canonical alternatives to investigate**:

- Zod 4 `.meta()` — the module's own TSDoc notes that Zod 4.3.6 has
  `.meta()` which preserves metadata through `z.toJSONSchema()`, but
  the MCP SDK v1.28.0 uses its own converter that doesn't honour it.
- Direct JSON Schema passthrough — bypass Zod for the declaration side
  entirely, using the pre-generated JSON Schema from sdk-codegen.
- Upstream SDK fix — contribute a fix or wait for native `examples`
  support in `registerTool()`.

**Assumption to verify**: The `tools/list` override may be interfering
with how the MCP SDK handles `_meta.ui` metadata in tool listings. Even
though `toProtocolEntry()` passes `_meta` through, the override bypasses
any SDK-internal MCP Apps processing that `registerAppTool()` or the
default `tools/list` handler would perform.

### 3. The implementation does not work

The user called `get-curriculum-model` and saw no brand banner. Instead
of investigating the root cause, the agent listed possible explanations
and suggested the user try things (restart server, check logs). This was
wrong — the correct response was to acknowledge that the implementation
is not proven to work and investigate why.

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
  MCP Apps discovery
- Whether the resource fetch (`resources/read` for the `ui://` URI)
  is being attempted by the host
- Whether the server process was running the latest build
- What the host actually does when it receives a tool result with
  `_meta.ui` — does it fetch the resource, render the iframe, or
  silently skip it?

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
| 2 | `preserve-schema-examples.ts` override bypasses SDK MCP Apps processing | Medium | Temporarily disable override and test with `registerAppTool` |
| 3 | The running server had the latest `dist/mcp-app.html` | Low | Restart server, rebuild, re-test |
| 4 | Claude Code fetches the resource at the `ui://` URI when it sees `_meta.ui` | Medium | Check server logs for `resources/read` requests |
| 5 | The resource registration (`registerWidgetResource`) serves correct HTML | High | Already verified `dist/mcp-app.html` contains banner |
| 6 | `registerAppTool` + removing the `tools/list` override is the canonical fix | High | Confirmed by MCP reviewer with SDK source evidence |

---

## Recommended Investigation Steps

1. **Inspect the wire protocol**: Add logging or use an MCP inspector
   to see exactly what the `tools/list` response contains for
   `get-curriculum-model` — specifically the `_meta` structure.

2. **Adopt `registerAppTool`**: Replace `server.registerTool` with
   `registerAppTool` for UI-bearing tools. This is the canonical
   approach and adds the legacy metadata key.

3. **Investigate `preserve-schema-examples.ts`**: Determine whether
   this override can be removed or whether it needs to coexist with
   `registerAppTool`. The module's own removal conditions should be
   checked against the current SDK version.

4. **Test in `basic-host`**: Run the server and load the widget in the
   upstream `basic-host` tool to isolate whether the issue is
   host-specific (Claude Code) or server-side.

5. **Add integration test for the full MCP App pipeline**: A test that
   verifies `tools/list` → `_meta.ui` → `resources/read` → HTML
   content forms a complete chain.

6. **Visual verification**: After fixes, call `get-curriculum-model`
   in Claude Code and confirm the banner appears.

---

## Files to Read First

- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — tool
  registration (line 117)
- `apps/oak-curriculum-mcp-streamable-http/src/preserve-schema-examples.ts`
  — `tools/list` override
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
  — widget resource registration
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/projections.ts`
  — `toProtocolEntry` and `toRegistrationConfig`
- `node_modules/@modelcontextprotocol/ext-apps/dist/src/server/index.js`
  — `registerAppTool` implementation (minified, `fZ` function)

---

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent plan (Phase 4 section)
- `ws3-phase-4-brand-banner.plan.md` — companion plan (COMPLETE)
- `mcp-app-extension-migration.plan.md` — umbrella migration plan
