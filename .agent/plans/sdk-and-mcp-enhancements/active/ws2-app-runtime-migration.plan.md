# WS2: App Runtime Migration — Implementation Plan

**Status**: Complete (2026-03-26). Production code confirmed matching target
state by 12-pass specialist review. All acceptance criteria pass.

## Am I Done?

Run the WS2-specific coupling regression — must return zero hits:

```bash
rg -n "openai/widgetCSP|openai/widgetPrefersBorder|openai/widgetDescription|openai/widgetDomain|text/html\+skybridge|AGGREGATED_TOOL_WIDGET_MIME_TYPE|connect_domains|resource_domains|getToolWidgetUri|WidgetResourceOptions|deriveWidgetDomain|WIDGET_DESCRIPTION|ResourceRegistrar" \
  apps/oak-curriculum-mcp-streamable-http/
```

Then run quality gates:

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e && pnpm format:root && pnpm markdownlint:root
```

If both pass, WS2 is done. Next step: the runtime boundary simplification plan
at `../current/mcp-runtime-boundary-simplification.plan.md`.

---

## Non-Negotiable: Hard Cutover, No Compatibility Layers

This is a **clean break** with the old approach. Every change actively removes ChatGPT-specific coupling and replaces it with the MCP Apps open standard. There are no dual paths, no deprecated key emission, no backward-compatible shims, no fallback wrappers. Old keys are deleted. Old constants are deleted. Old files are deleted. The principles are absolute: "NEVER create compatibility layers, no backwards compatibility."

## Context

**Governing ADR**: [ADR-141: MCP Apps Standard as Only UI Surface](../../../../docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md)

Oak's MCP HTTP server (`apps/oak-curriculum-mcp-streamable-http/`) has its widget resource registration locked to ChatGPT-specific metadata (`openai/widgetCSP`, `openai/widgetPrefersBorder`, etc.) and MIME type (`text/html+skybridge`). WS1 (2026-03-26) removed all `openai/` metadata from `packages/sdks/` — zero hits confirmed. WS2 now migrates the **app runtime layer**: resource registration, MIME type, CSP, and deletes all ChatGPT-only artefacts.

## Live-Spec Research Summary (2026-03-26)

Grounded from the official API docs sitemap at `apps.extensions.modelcontextprotocol.io/api/`:

- **RESOURCE_MIME_TYPE** = `"text/html;profile=mcp-app"` (replaces `text/html+skybridge`)
- **registerAppResource** signature: `(server: Pick<McpServer, 'registerResource'>, name, uri, config, readCallback) → RegisteredResource`
- **McpUiResourceMeta** fields (all optional): `csp`, `domain`, `permissions`, `prefersBorder`
- **McpUiResourceCsp** fields (all optional, camelCase): `connectDomains`, `resourceDomains`, `frameDomains`, `baseUriDomains`
- **Official migration mappings** (from `migrate-openai-app.html`):
  - `openai/widgetCSP` → `_meta.ui.csp` (snake_case → camelCase)
  - `openai/widgetDomain` → `_meta.ui.domain`
  - `openai/widgetPrefersBorder` → `_meta.ui.prefersBorder`
  - `openai/widgetDescription` → **Not yet implemented in MCP** (drop entirely)
- **No breaking changes** since v1.3.1. SDK installed matches spec.

## Reviewer Findings Incorporated

10 specialist reviews ran across two rounds. Round 1 (plan design): mcp-reviewer, test-reviewer, fred, barney, betty, wilma. Round 2 (final documents): onboarding-reviewer, docs-adr-reviewer, fred, test-reviewer. Key accepted findings:

1. **Drop `getUiCapability()` from WS2** (betty, wilma) — `registerHandlers()` runs before `connect()`, so `getClientCapabilities()` returns `null`. Non-capable hosts ignore `_meta.ui` per the spec. No compatibility layer needed. Defer to WS3 only if active capability gating is required.
2. **Drop `domain` entirely** (mcp-reviewer) — no direct cross-origin fetch from widget. MCP bridge handles all data.
3. **Delete `getToolWidgetUri()` passthrough** (barney) — zero-logic wrapper. Import `WIDGET_URI` directly from SDK.
4. **Replace `vi.fn()` mock with plain-object fake** (test-reviewer) — closure-based fake satisfying `ResourceRegistrar`, no `vi.fn()`.
5. **Handler call signature must be `handler(new URL(uri), {})`** (test-reviewer) — `registerAppResource` wraps callback with `(URL, extra)` signature.
6. **TDD RED phase explicit** (test-reviewer) — tests rewritten and run to confirm failure BEFORE product code changes.
7. **Broader coupling grep** (barney) — `rg -i "openai|chatgpt|skybridge"` across app src (excluding `window.openai` in widget-script files, which is WS3).
8. **Audit widget renderers for direct fetch** (wilma) — verify no renderer makes HTTP calls to `*.thenational.academy` before dropping CSP domains.
9. **`tools-list-override.ts`** (fred) — noted that the override spreads `tool._meta` directly from SDK definitions (which already have `_meta.ui.resourceUri`). The deprecated flat key `_meta["ui/resourceUri"]` is NOT emitted, and we do NOT add it. No compatibility layers.

## Tasks (5 Groups)

### Task 1: Prerequisite — Audit widget renderers for direct fetch

Before dropping CSP domains, verify no widget renderer makes direct HTTP calls.

```bash
rg -n "fetch\(|XMLHttpRequest|\.ajax|\.get\(|\.post\(" \
  apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/ \
  apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts \
  apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts
```

Expected: zero hits for HTTP calls. `window.openai.*` calls use the host's internal bridge, not HTTP. Document finding in a code comment in `register-resources.ts`.

---

### Task 2: Delete vestigial ChatGPT artefacts

**Files to delete**:

- `src/widget-cta/` (6 files: `index.ts`, `types.ts`, `registry.ts`, `html-generators.ts`, `js-generator.ts`, `js-generator.unit.test.ts`)
- `src/widget-cta.unit.test.ts`
- `scripts/chatgpt-emulation-wrapper.ts`

**Also**: Update comment in `src/aggregated-tool-widget.integration.test.ts:7` (references `chatgpt-emulation-wrapper.ts`).

**Verification**: `pnpm build && pnpm type-check && pnpm test` — no dangling imports, no test failures.

---

### Task 3: Rewrite resource registration — TDD (core WS2 change)

This is the main work. TDD sequence: **tests first (RED), then implementation (GREEN), then refactor**.

#### 3a. Rewrite `register-resources.integration.test.ts` (RED)

**Replace mock**: Delete `vi.fn()` + `mockImplementation`. Replace with plain-object fake — no `vi.fn()`, no type aliases, no `as` casts.

The exact fake shape must be worked out during implementation to satisfy `McpServer['registerResource']`'s overloaded signature without `as` casts. The design intent:

- Plain object with a `registerResource` method that captures call arguments
- Handler called explicitly in tests via `handler(new URL(uri), {})` to retrieve contents
- No `vi.fn()`, no `as` assertions, no type aliases
- Use `satisfies` if needed to validate structural compatibility at compile time
- Handler parameter must be typed with the real SDK callback type, not `unknown`

**Delete all local test type aliases**: Delete `WidgetCSP`, `WidgetContentMeta`, `CapturedResourceContent`, `CapturedResource`, `CapturedRegistrationCall`. Assert against the actual `_meta.ui` shape inline — no local interface aliases that mask the real types. The principle is clear: "Don't use type aliases, use good naming. Type aliases are a source of entropy."

**Assertion changes**:

- `'text/html+skybridge'` → `'text/html;profile=mcp-app'`
- `'openai/widgetCSP'` → `_meta.ui.csp.resourceDomains` contains Google Fonts
- `'openai/widgetPrefersBorder: true'` → `_meta.ui.prefersBorder === true`
- **DELETE**: CSP Oak domains test, widgetDescription tests, widgetDomain tests, forwards-options test
- **ADD**: `connectDomains` is `undefined`, `domain` is `undefined`

**Run tests — confirm RED** (failures against old implementation).

#### 3b. Rewrite production code (GREEN)

**`aggregated-tool-widget.ts`**:

- Delete `AGGREGATED_TOOL_WIDGET_MIME_TYPE` constant entirely — no re-export, no alias
- Delete `getToolWidgetUri()` passthrough — callers import `WIDGET_URI` directly
- Update TSDoc: remove all `text/html+skybridge`, `openai/outputTemplate`, `ChatGPT` language
- Keep `generateWidgetHtml()` and `AGGREGATED_TOOL_WIDGET_HTML` (WS3 scope)

**`register-resources.ts`**:

- Import `{ registerAppResource, RESOURCE_MIME_TYPE }` from `@modelcontextprotocol/ext-apps/server`
- Import `WIDGET_URI` from `@oaknational/curriculum-sdk/public/mcp-tools`
- Delete `AGGREGATED_TOOL_WIDGET_MIME_TYPE` import
- Delete `WIDGET_DESCRIPTION` constant
- Delete `WidgetResourceOptions` interface
- Rewrite `WIDGET_CSP` to camelCase, Google Fonts only
- Delete `ResourceRegistrar` type alias — use `Pick<McpServer, 'registerResource'>` directly everywhere (principles: "Don't use type aliases")
- Rewrite `registerWidgetResource` — no options, uses `registerAppResource` with `RESOURCE_MIME_TYPE`, `WIDGET_CSP`, and `prefersBorder: true`
- Simplify `registerAllResources` — remove options parameter
- Delete all `@see https://developers.openai.com/...` TSDoc links

**`handlers.ts`**:

- Delete `deriveWidgetDomain` function
- Simplify call: `registerAllResources(server)` (no options)

**Run tests — confirm GREEN.**

#### 3c. Update e2e test assertions

**Note (review finding 2026-03-26)**: Per testing-strategy.md, E2E tests are
specifications of system behaviour — they must be updated FIRST when changing
system behaviour. The MIME type change is a system-behaviour change. In
practice, e2e assertions were updated as part of the overall WS2 work. The
correct TDD sequence for future reference: update e2e assertions (RED against
old code), then change production code (GREEN).

**`e2e-tests/widget-resource.e2e.test.ts`**:

- Assertion containing `toBe('text/html+skybridge')` → `toBe('text/html;profile=mcp-app')`
- Test name update for MIME type
- **KEEP** `window.openai` test (WS3 scope). **WS3 obligation**: WS3 plan MUST begin by rewriting this e2e test to specify the new `App` class behaviour FIRST (RED), then implement (GREEN).

---

### Task 4: Update comments in security and auth files

**`src/security.ts`**:

- The comment containing `"ChatGPT web"` → `"e.g. ChatGPT, Claude"`
- The comment containing `"Future MCP Apps"` → `"MCP Apps"`

**`src/security-config.ts`**: similar if present.

**`src/tools-list-override.ts`** (review finding 2026-03-26):

- The comment containing `"OpenAI Apps SDK invocation status"` → `"MCP Apps standard metadata per ADR-141"`

**`src/auth-error-response.ts`** (review finding 2026-03-26):

- Replace `"ChatGPT OAuth linking UI"` → `"host OAuth linking UI"`
- Replace `"Per OpenAI documentation"` → `"Per MCP specification"`
- Replace `"OpenAI's MCP specification"` → `"MCP specification"`

**`docs/widget-rendering.md`** (review finding 2026-03-26):

- Update to reflect MCP Apps MIME type and registration approach.

---

### Task 5: Verification and review

**Coupling regression** — WS2-specific patterns must return zero hits:

```bash
# WS2-specific coupling: must be zero
rg -n "openai/widgetCSP|openai/widgetPrefersBorder|openai/widgetDescription|openai/widgetDomain|text/html\+skybridge|AGGREGATED_TOOL_WIDGET_MIME_TYPE|connect_domains|resource_domains|getToolWidgetUri|WidgetResourceOptions|deriveWidgetDomain|WIDGET_DESCRIPTION|ResourceRegistrar" \
  apps/oak-curriculum-mcp-streamable-http/
```

The broader coupling check (`rg -in "openai|chatgpt|skybridge"`) will still
return hits in WS3-scoped files (`widget-script*`, `widget-file-generator*`,
`widget-renderers/`, `widget-styles*`) and comment-only references in auth
files (`auth-error-response.ts`, `tools-list-override.ts`,
`public-resources.ts`). These are **expected** and assigned to WS3 or the
simplification plan's Phase 6 — they are not WS2 failures.

**Quality gates**:

```bash
pnpm build && pnpm type-check && pnpm lint:fix && pnpm test && pnpm test:e2e && pnpm format:root && pnpm markdownlint:root
```

**Post-implementation reviews**: code-reviewer + mcp-reviewer.

## Critical Files

| File | Action |
|------|--------|
| `src/widget-cta/` (6 files) | DELETE |
| `src/widget-cta.unit.test.ts` | DELETE |
| `scripts/chatgpt-emulation-wrapper.ts` | DELETE |
| `src/aggregated-tool-widget.ts` | EDIT: delete MIME const, delete `getToolWidgetUri`, update TSDoc |
| `src/register-resources.integration.test.ts` | REWRITE: MCP Apps assertions, plain-object fake |
| `src/register-resources.ts` | REWRITE: `registerAppResource`, CSP, drop all OpenAI metadata |
| `src/handlers.ts` | EDIT: delete `deriveWidgetDomain`, simplify `registerAllResources` call |
| `e2e-tests/widget-resource.e2e.test.ts` | EDIT: MIME assertions |
| `src/security.ts` | EDIT: comments |

## Key Design Decisions

1. **Hard cutover, no compatibility layers**: Old MIME type deleted. Old metadata keys deleted. No dual-emit. No deprecated flat keys. Per principles: "NEVER create compatibility layers."
2. **Drop `connectDomains` entirely**: MCP bridge uses `postMessage`, not HTTP. CSP `connect-src` doesn't apply.
3. **Drop `*.thenational.academy` from CSP**: Anchor hrefs navigated via `ui/open-link`. No resource loads from Oak domains. (Verified by widget renderer audit — Task 1.)
4. **Keep `resourceDomains` for Google Fonts only**: Widget loads Lexend font.
5. **Drop `WIDGET_DESCRIPTION`**: "Not yet implemented" in MCP Apps spec.
6. **Map `prefersBorder: true`**: Direct mapping from `openai/widgetPrefersBorder`.
7. **Drop `domain` entirely**: No direct cross-origin fetch. MCP bridge handles all data.
8. **No `getUiCapability()` in WS2**: Wrong lifecycle layer — `registerHandlers()` runs before `connect()`, so capabilities aren't available. Non-capable hosts ignore `_meta.ui` per spec. No fallback needed. Defer to WS3 if active gating required.
9. **Delete `getToolWidgetUri()` passthrough**: Zero-logic wrapper. Import `WIDGET_URI` directly.
10. **CSP placement**: CSP goes in `contents[]._meta.ui.csp` (read callback return), not in `registerAppResource` config. Current structure already correct — only keys change.
