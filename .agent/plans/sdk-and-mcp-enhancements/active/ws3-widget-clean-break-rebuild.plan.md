---
name: "WS3: Widget Clean-Break Rebuild"
overview: "Delete the entire ChatGPT-era string-template widget system. Build two new MCP Apps from scratch using the official canonical React stack: a branded curriculum-model viewer and a new user-search interactive experience."
parent_plan: "mcp-app-extension-migration.plan.md"
source_research:
  - "../../mcp-apps-support.research.md"
specialist_reviewer: "mcp-reviewer"
isProject: false
todos:
  - id: phase-0-triage
    content: "Phase 0: Selective commit of valuable uncommitted changes, discard dead widget code, verify quality gates."
    status: pending
  - id: phase-1-delete-old
    content: "Phase 1: Delete old widget system entirely (TDD — update E2E tests FIRST)."
    status: pending
  - id: phase-2-scaffold
    content: "Phase 2: Scaffold React + Vite build pipeline using official canonical stack."
    status: pending
  - id: phase-3-curriculum-model-app
    content: "Phase 3: Build curriculum-model MCP App (Oak branding, title link)."
    status: pending
  - id: phase-4-user-search-app
    content: "Phase 4: Build user-search MCP App (new tool, interactive search via search SDK)."
    status: pending
  - id: phase-5-integration
    content: "Phase 5: Wire apps into resource registration, restore WIDGET_TOOL_NAMES, replace preview server."
    status: pending
  - id: phase-6-docs-cleanup
    content: "Phase 6: Remove all remaining OpenAI references from non-archive files."
    status: pending
  - id: phase-7-review-commit
    content: "Phase 7: Full quality gates, reviewer invocations, commit."
    status: pending
---

# WS3: Widget Clean-Break Rebuild

**Status**: PLANNING
**Last Updated**: 2026-03-30
**Scope**: Delete old widget system. Build two new MCP Apps from scratch.

---

## Context

Oak's MCP widget system was built for ChatGPT's `window.openai` bridge API. WS1
migrated SDK metadata keys, WS2 migrated the server runtime, and a previous
session mechanically replaced `window.openai` with `undefined` — producing dead
code that reads from `undefined?.toolOutput`. The entire client-side architecture
(string-template JS embedded in HTML) is structurally dead.

**This plan replaces it entirely.** No adaptation, no compatibility, no
preservation except Oak brand colours, typefaces (Lexend), and the logo SVG.

---

## Only Two Tools Get UI

| Tool | MCP App | Purpose |
|------|---------|---------|
| `get-curriculum-model` | Branded viewer | Oak logo, "Oak National Academy" title linking to `www.thenational.academy`, structured display of the curriculum model |
| `user-search` (NEW) | Interactive search | User-controlled search experience using the search SDK, separate from the agent-facing `search` tool |

The existing `search`, `browse-curriculum`, `explore-topic`, and `fetch` tools
remain **text-only** — no widget UI. They serve AI agents, not human users.

---

## Canonical Stack (from Official MCP Apps Documentation)

Based on the official `basic-server-react` example at
`github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-server-react`:

### Dependencies

**Production:**

- `react` ^19
- `react-dom` ^19

**Dev:**

- `@vitejs/plugin-react` ^4
- `vite` ^6
- `vite-plugin-singlefile` ^2
- `cross-env` ^10
- `@types/react` ^19
- `@types/react-dom` ^19

`@modelcontextprotocol/ext-apps` ^1.3.2 is already installed.

### Vite Config (official pattern)

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const INPUT = process.env.INPUT;
if (!INPUT) {
  throw new Error("INPUT environment variable is not set");
}

const isDevelopment = process.env.NODE_ENV === "development";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    sourcemap: isDevelopment ? "inline" : undefined,
    cssMinify: !isDevelopment,
    minify: !isDevelopment,
    rollupOptions: { input: INPUT },
    outDir: "../dist",  // Relative to widget/ — resolves to app root dist/
    emptyOutDir: false,
  },
});
```

### HTML Template (official pattern)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>Oak National Academy</title>
  <link rel="stylesheet" href="/src/global.css">
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/mcp-app.tsx"></script>
</body>
</html>
```

### React App Pattern (official pattern)

From the official `basic-server-react` example — full handler set:

```typescript
import type { App, McpUiHostContext } from "@modelcontextprotocol/ext-apps";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

function MyApp() {
  const [toolResult, setToolResult] = useState<CallToolResult | null>(null);
  const [hostContext, setHostContext] = useState<McpUiHostContext | undefined>();

  const { app, error } = useApp({
    appInfo: { name: "oak-curriculum-viewer", version: "1.0.0" },
    capabilities: {},
    onAppCreated: (app) => {
      app.ontoolresult = async (result) => setToolResult(result);
      app.ontoolinput = async (input) => { /* show context before result */ };
      app.ontoolcancelled = (params) => { /* reset to clean state */ };
      app.onteardown = async () => { /* cancel in-flight requests */ return {}; };
      app.onerror = console.error;
      app.onhostcontextchanged = (params) =>
        setHostContext((prev) => ({ ...prev, ...params }));
    },
  });

  useEffect(() => {
    if (app) setHostContext(app.getHostContext());
  }, [app]);

  if (error) return <ErrorState error={error} />;
  if (!app) return <LoadingState />;
  return <AppInner app={app} toolResult={toolResult} hostContext={hostContext} />;
}
```

### CSS Pattern (official pattern)

Host variable names with Oak brand fallback values in `:root`:

```css
:root {
  color-scheme: light dark;

  /* Oak brand overrides for host variables */
  --color-text-primary: light-dark(#1a3a1b, #f0f7f0);
  --color-background-primary: light-dark(#bef2bd, #1b3d1c);
  --color-accent: #287d3c;
  --color-text-on-accent: #ffffff;
  --font-sans: 'Lexend', system-ui, sans-serif;
  /* ... remaining host variables with Oak defaults ... */
}
```

CSS Modules for component-specific styles (e.g., `mcp-app.module.css`).

### Key MCP Apps API Methods

From the official patterns documentation and official React example:

- `app.ontoolresult` — receive tool execution results
- `app.ontoolinput` — receive tool arguments (show context before result)
- `app.ontoolcancelled` — handle cancelled tool calls (reset UI state)
- `app.onteardown` — cleanup before unmount (cancel in-flight requests)
- `app.onerror` — handle errors
- `app.onhostcontextchanged` — react to theme/style/display mode changes
- `app.callServerTool({ name, arguments })` — call server tools from UI
- `app.openLink({ url })` — request host to open external URL
- `app.updateModelContext({ content })` — push structured data to model
- `app.sendMessage({ role, content })` — send message to chat
- `app.requestDisplayMode({ mode })` — toggle inline/fullscreen
- `hostContext.safeAreaInsets` — applied as inline padding

All `onAppCreated` callbacks MUST register the full handler set:
`ontoolresult`, `ontoolinput`, `ontoolcancelled`, `onteardown`, `onerror`,
`onhostcontextchanged` — per the official React example pattern.

### Tool Visibility

Private tools (app-only, hidden from model):

```typescript
registerAppTool(server, "internal-search", {
  _meta: { ui: { resourceUri, visibility: ["app"] } },
  // ...
});
```

**Important**: `visibility: ["app"]` is a **discoverability control**, not an
authorization boundary. It hides the tool from `tools/list` but any
authenticated MCP client can still call it via `tools/call`. The actual
protection is Clerk authentication at the HTTP layer. Do not describe
`visibility` as a security control.

### Security Constraints

1. **No `dangerouslySetInnerHTML`**: Widget components MUST NOT use
   `dangerouslySetInnerHTML`. Tool results are rendered via JSX
   interpolation only. Enforce via ESLint `react/no-danger` rule in the
   widget ESLint config (Phase 2i).

2. **URL validation for `openLink`**: Before calling `app.openLink({ url })`,
   validate that the URL uses `https:` protocol. Reject `javascript:`,
   `data:`, and other schemes as defense-in-depth against hosts with weak
   URL validation.

3. **Dev-mode startup guard**: The development-mode HTML shell (pointing to
   `localhost:5173`) MUST NOT activate in deployed environments. Add a
   startup guard: if `NODE_ENV=development` AND a production indicator
   (`VERCEL`, `FLY_APP_NAME`, etc.) is set, throw an error.

4. **PostMessage trust boundary**: The MCP Apps `PostMessageTransport`
   sends with `"*"` targetOrigin (upstream SDK design). It validates
   `event.source` on receive. This is accepted for MCP Apps hosts
   (Claude, ChatGPT) which control their frame hierarchy. Document this
   trust assumption.

---

## Architectural Constraints

### Cardinal Rule: All tool schemas flow from codegen (F1)

Both `user-search` and `user-search-query` tool definitions (name, description,
input schema, output schema, `_meta.ui.resourceUri`) MUST be defined in the
SDK codegen pipeline at `packages/sdks/oak-sdk-codegen/`, generated into the
SDK, and consumed by the app. No manual schema definitions in `apps/`.

**Note**: `user-search` is NOT an OpenAPI endpoint — it is an MCP-only
interactive tool that wraps the search SDK. The codegen pipeline must support
non-OpenAPI tool definitions (manual definitions in the SDK, not in the app).
This needs resolution before Phase 4 begins. If the codegen pipeline cannot
support non-OpenAPI tools, the definition lives in the curriculum SDK as a
manually authored tool definition alongside the generated ones.

### Single MCP App, single URI (codegen simplification)

WS3 uses a **single MCP App resource** that routes internally on tool name.
This preserves the existing codegen model: one `BASE_WIDGET_URI` + one
`WIDGET_TOOL_NAMES` Set. No per-tool URI mapping, no codegen pipeline changes
beyond populating the Set. The single app receives tool results via
`ontoolresult` and tool input via `ontoolinput`, then routes to the appropriate
React component based on tool name from the metadata.

### Layer Role Topology: domain contracts in SDKs, not apps (F2)

Search domain contracts — valid scopes (lessons/units/threads/sequences/suggest),
valid filters (subject, key stage, year, tier, exam board), result type shapes —
belong in the search SDK or curriculum SDK. The widget components consume these
contracts; they do not define them.

The React components (presentation) live in the app. The data shapes they render
flow from the SDK via codegen.

### Widget directory: justified nested build target (F3)

The `widget/` directory inside `apps/oak-curriculum-mcp-streamable-http/` is a
build target (single Vite entry point), not a shadow workspace. It does NOT
have its own `package.json` and does NOT participate in the pnpm workspace
graph. Its `tsconfig.json` is a Vite-only config for JSX compilation — it is
NOT used by `tsc` or `type-check`. The official MCP Apps example uses an
identical flat structure (server + UI source in one project).

Design assumption: only this MCP HTTP server serves MCP Apps widgets. If a
second app needs widgets in future, shared presentation components would be
extracted to `packages/libs/` at that point. **This is a known design debt
item** — extraction requires new package scaffold, updated workspace graph,
ESLint boundary rules, and import changes.

The `widget/tsconfig.json` follows the official MCP Apps React example exactly
(browser-targeted, `noEmit: true`, JSX support). It does not extend
`tsconfig.base.json` because the base config targets Node.js (`ES2023`,
no DOM lib, no JSX). A comment in the file MUST explain this divergence and
list strict flags that must be kept in sync manually.

### Text-only fallback for non-MCP-Apps hosts (MCP-1)

The MCP Apps spec says servers SHOULD provide text-only fallback content for
UI-enabled tools. Both `get-curriculum-model` and `user-search` tools MUST
return meaningful text content alongside `_meta.ui.resourceUri`. Hosts that
do not support MCP Apps will ignore `_meta.ui` and use the text content.

`getUiCapability()` cannot be called during tool registration because
`registerHandlers()` runs before `connect()` (WS2 finding). Instead, the tools
always return text + `_meta.ui` — hosts pick whichever they support.

### Tool registration via `registerAppTool` (MCP-2)

Both `get-curriculum-model` and `user-search` MUST be registered using
`registerAppTool` from `@modelcontextprotocol/ext-apps/server`. The private
`user-search-query` helper MUST also use `registerAppTool` with
`visibility: ["app"]`. Do NOT use raw `server.registerTool`.

### readFileSync at module scope: fail-fast wrapper (W2)

The `readFileSync` call that loads the Vite-built HTML MUST be wrapped in a
function that provides a clear domain-specific error message on failure:

```typescript
function loadWidgetHtml(filename: string): string {
  const filepath = resolve(base, `../../dist/${filename}`);
  try {
    return readFileSync(filepath, 'utf-8');
  } catch (cause) {
    throw new Error(
      `Widget HTML not found at ${filepath}. Run 'pnpm build:widget' first.`,
      { cause },
    );
  }
}
```

### Turbo cache configuration for widget build

`build:widget` runs as a subprocess within the `build` script, NOT as a
separate Turbo task. A standalone `build:widget` Turbo override would be
structurally unreachable because Turbo executes `build` as an opaque shell
command. Instead, add `widget/**` to the app-level `build` task inputs so
Turbo invalidates the cache when widget source changes:

```json
{
  "@oaknational/oak-curriculum-mcp-streamable-http#build": {
    "dependsOn": ["^build"],
    "cache": true,
    "outputs": ["dist/**", ".tsup/**"],
    "inputs": [
      "$TURBO_DEFAULT$",
      "$TURBO_ROOT$/tsconfig.base.json",
      "tsconfig.json",
      "tsconfig.build.json",
      "tsup.config.ts",
      "src/**/*.ts",
      "widget/**",
      "!src/**/*.test.ts",
      "!src/**/*.spec.ts"
    ]
  }
}
```

### Operational Resilience Requirements

These requirements address failure modes identified during plan review and
MUST be implemented in the relevant phases:

**1. `callServerTool` timeout and error handling (Phase 4c)**:
All `app.callServerTool()` calls MUST have a 10-second timeout, loading state
indicator, and explicit error handling. Failed searches show an actionable
error message ("Search timed out. Try refining your query.") with a retry
button. In-flight requests are cancelled on component unmount via
`onteardown`. Duplicate requests are prevented while one is in-flight.

**2. Tool result validation at component boundary (Phase 4c)**:
Data from `ontoolresult` is external to the React component boundary and
MUST be validated with Zod before rendering. Each view component defines a
result schema. Invalid shapes show a user-friendly error, not a React crash.
Empty results show "No results found", not a blank screen.

**3. `ErrorState` with actionable recovery (Phase 3b)**:
`ErrorState` MUST distinguish transient errors (offer reload) from permanent
failures (explain incompatible environment). The error object from `useApp()`
is a raw library exception — never expose it directly to users.

**4. Request/response correlation for race conditions (Phase 3b)**:
The app MUST track the latest request and ignore stale results from prior
tool calls. If `ontoolcancelled` arrives after `ontoolresult` (or vice
versa), the state machine handles both orderings correctly.

**5. Build output validation (Phase 2e)**:
The build script MUST validate that `dist/mcp-app.html` exists after
`build:widget` completes. Use `[ -f dist/mcp-app.html ]` as a post-build
check. The Phase 2g build pipeline test MUST run as part of `pnpm test`
(not just as a manual verification step).

**6. Development workflow (Phase 2e)**:
`pnpm dev:widget` MUST provide hot-reload for widget development without
requiring manual `pnpm build:widget`. In development mode, the server serves
a dev-mode HTML shell pointing to the Vite dev server
(`http://localhost:5173`) instead of reading built HTML from disk. This is
controlled by `NODE_ENV=development`.

### `public-resources.ts` auth bypass update

When `WIDGET_TOOL_NAMES` is populated and the widget resource is re-registered,
`src/auth/public-resources.ts` must include the widget URI in its public
resource URI set. This file currently imports `WIDGET_URI` from the SDK —
the single-app design preserves this single import (no multi-URI changes
needed).

---

## Phase 0: Triage Uncommitted Changes + Baseline

**Goal**: Commit valuable work, discard dead code, verify quality gates.

### 0a. Selective commit

**KEEP and commit** (principles, rules, SDK, docs — 10 files):

- `.agent/directives/principles.md` — "No shims" principle
- `.agent/rules/no-shims-or-workarounds.md` — canonical rule
- `.claude/rules/no-shims-or-workarounds.md` — Claude adapter
- `.cursor/rules/no-shims-or-workarounds.mdc` — Cursor adapter
- `docs/engineering/build-system.md` — build system docs
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.unit.test.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.integration.test.ts`
- `.agent/plans/.../mcp-app-extension-migration.plan.md`
- `.agent/prompts/session-continuation.prompt.md`

**DISCARD** (all widget file changes — they are dead code being deleted in
Phase 1 anyway).

### 0b. Run quality gates

```bash
pnpm check
```

Fix any failures. The session continuation prompt mentions a pre-existing lint
failure in sdk-codegen — diagnose and fix before proceeding.

### 0c. Acceptance

- Clean `git status` after selective commit + discard
- `pnpm check` passes

---

## Phase 1: Delete Old Widget System (TDD)

**Goal**: Remove all ChatGPT-era string-template widget code.

### 1a. Update E2E test assertions (RED)

**File**: `e2e-tests/widget-resource.e2e.test.ts`

The existing test structure is sound — it tests the MCP resource interface.
Update assertions for the new React system:

- Keep: URI format, MIME type, CSP metadata, `prefersBorder`
- Keep: Lexend font, light/dark theme, Oak logo assertions
- Add: Assert HTML contains `<div id="root"></div>` (React mount point)
- Add: Assert HTML contains `<script type="module"` (Vite bundle)
- Remove: Any string-template-specific assertions

These tests are RED until Phase 3/5.

### 1b. Delete old widget files

**DELETE entirely** (21 files):

```text
src/widget-script.ts
src/widget-script-state.ts
src/widget-script-escaping.ts
src/widget-script-escaping.unit.test.ts
src/widget-renderer-registry.ts
src/widget-renderer-registry.unit.test.ts
src/widget-file-generator.ts
src/widget-file-generator.unit.test.ts
src/aggregated-tool-widget.unit.test.ts
src/aggregated-tool-widget.integration.test.ts
src/widget-renderers/index.ts
src/widget-renderers/helpers.ts
src/widget-renderers/helpers.unit.test.ts
src/widget-renderers/search-renderer.ts
src/widget-renderers/browse-renderer.ts
src/widget-renderers/explore-renderer.ts
scripts/widget-preview-server.ts
```

**KEEP but replace later:**

- `src/aggregated-tool-widget.ts` — temporarily becomes a placeholder
- `src/widget-styles.ts` — CSS values extracted in Phase 2, then deleted
- `src/oak-logo-svg.ts` + test — logo SVG, architecture-neutral

### 1c. Remove widget registration and dangling references

Since `WIDGET_TOOL_NAMES` is already empty, no tool references any widget
resource URI. No placeholder HTML is needed — a placeholder would be a shim
(violates "no shims" principle). The resource simply does not exist until the
new MCP App is built in Phase 5.

1. **`register-resources.ts`**: Remove the `registerWidgetResource()` function
   call and its import of `AGGREGATED_TOOL_WIDGET_HTML`.
2. **`register-resources.integration.test.ts`**: Remove the
   `describe('registerWidgetResource', ...)` test block (6 tests). These tests
   verify the old HTML contract — they will be rewritten in Phase 5c for the
   new contract. Other test blocks in this file (documentation, curriculum
   model, prerequisite graph, thread progressions) remain unchanged.
3. **`package.json`**: Remove the `"widget:preview"` script entry (references
   deleted `scripts/widget-preview-server.ts`). It is replaced by
   `"dev:widget"` in Phase 2e.
4. **Delete `aggregated-tool-widget.ts`** entirely (the HTML generator).

### 1d. Acceptance

- Zero files in `src/widget-renderers/`
- Zero `widget-script*.ts` files
- `scripts/widget-preview-server.ts` deleted
- `pnpm check` passes (except widget E2E tests — RED, expected)

---

## Phase 2: Scaffold React + Vite Build Pipeline

**Goal**: Set up build infrastructure following the official canonical stack.

### 2a. Install dependencies

Add to `apps/oak-curriculum-mcp-streamable-http/package.json`:

```json
{
  "dependencies": {
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "cross-env": "^10.1.0",
    "vite": "^6.0.0",
    "vite-plugin-singlefile": "^2.3.0"
  }
}
```

### 2b. Create widget source directory

Single MCP App following the official project structure:

```text
apps/oak-curriculum-mcp-streamable-http/
  widget/
    mcp-app.html                   ← Vite entry HTML
    vite.config.ts                 ← Vite config (react + singlefile)
    tsconfig.json                  ← TypeScript with jsx: react-jsx
    src/
      mcp-app.tsx                  ← React entry point + root component
      mcp-app.module.css           ← Component styles
      global.css                   ← Oak brand CSS (host variable fallbacks)
      components/
        OakHeader.tsx              ← Logo + "Oak National Academy" link
        OakFooter.tsx              ← AI disclaimer + Aila link
        ToolRouter.tsx             ← Routes tool name → renderer component
        CurriculumModelView.tsx    ← get-curriculum-model display
        UserSearchView.tsx         ← Interactive search UI
        SearchInput.tsx
        SearchResults.tsx
        ScopeSelector.tsx
        FilterControls.tsx
```

### 2c. Vite config

**File**: `widget/vite.config.ts`

Follows the official `basic-server-react` pattern exactly.
`cross-env INPUT=mcp-app.html vite build` produces a single
self-contained HTML file.

### 2d. TypeScript config for JSX

**File**: `widget/tsconfig.json`

Follows the official pattern:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitReturns": true
  },
  "include": ["src"]
}
```

### 2e. Wire into build pipeline

Update `package.json` scripts:

```json
{
  "build:widget": "cross-env INPUT=mcp-app.html vite build --config widget/vite.config.ts",
  "build": "pnpm build:widget && tsup",
  "dev:widget": "cross-env INPUT=mcp-app.html vite dev --config widget/vite.config.ts"
}
```

The `build:widget` step runs BEFORE `tsup` so the HTML file is available when
the server bundle is created. Single build, single output file — no multi-build
orchestration or `rm -f` cleanup needed.

### 2f. Create Oak brand global CSS

**File**: `widget/src/global.css`

Follows the official pattern — `:root` block with host variable names, Oak brand
values as fallbacks:

```css
:root {
  color-scheme: light dark;

  /* Oak brand values as fallbacks for host style variables */
  --color-text-primary: light-dark(#1a3a1b, #f0f7f0);
  --color-text-secondary: light-dark(#3d5e3e, #b8dab9);
  --color-background-primary: light-dark(#bef2bd, #1b3d1c);
  --color-accent: #287d3c;
  --color-accent-high-contrast: light-dark(#1b6330, #8cd98f);
  --color-text-on-accent: #ffffff;
  --border-radius-md: 8px;
  --font-sans: 'Lexend', system-ui, sans-serif;
  /* ... etc from widget-styles.ts values ... */
}
```

Google Fonts Lexend loaded via `<link>` in the HTML `<head>` (not `@import`,
which can trigger `connect-src` CSP issues in some hosts). If font loading
fails in `basic-host` or Claude testing, consider self-hosting the Lexend font
files inlined as base64 via Vite to eliminate the external dependency entirely.

### 2g. Build pipeline E2E test (RED)

**TDD**: Write a failing E2E test FIRST that asserts the build pipeline
produces a self-contained HTML file with expected characteristics.

**File**: `e2e-tests/widget-build-pipeline.e2e.test.ts`

This is an **E2E test** (not in-process) because it reads from the filesystem
(`dist/mcp-app.html`) — IO is prohibited in unit/integration tests. It runs
via `pnpm test:e2e`, not `pnpm test`.

Assertions:

- File exists at `dist/mcp-app.html`
- Contains `<div id="root"></div>` (React mount point)
- Contains `<script` (inlined JS from `vite-plugin-singlefile`)
- Contains `<style` (inlined CSS)
- Does NOT contain `<script type="module" src=` (external script — would mean
  the singlefile plugin failed)

This test is RED because no build output exists yet.

### 2h. Minimal React app (GREEN)

Write just enough React to make the build pipeline test pass:

- `src/mcp-app.tsx`: renders "Connecting..." with Oak logo
- `mcp-app.html`: shell with `<div id="root">`

```bash
pnpm build:widget
# Build pipeline test should now pass (GREEN)
```

### 2i. ESLint React config for widget

**File**: `apps/oak-curriculum-mcp-streamable-http/eslint.config.ts`

Add a block for `.tsx` files in `widget/src/` that uses `configs.react`
from `@oaknational/eslint-plugin-standards`. Without this, React hooks
rules (`react-hooks/rules-of-hooks`, `react-hooks/exhaustive-deps`) are
absent for all widget code. The existing `**/*.ts` glob does NOT match
`.tsx` files.

Also configure `parserOptions` to include `widget/tsconfig.json` so
type-aware lint rules work for widget source.

### 2j. Acceptance

- `pnpm build:widget` produces `dist/mcp-app.html`
- HTML is self-contained (all JS/CSS inlined)
- `pnpm check` passes (widget E2E still RED)
- Invoke `config-reviewer` for build pipeline review

---

## Phase 3: Build MCP App Shell + Curriculum-Model View

**Goal**: Single MCP App with connection lifecycle, tool routing, and the
`get-curriculum-model` view.

### 3a. Integration tests for child components (RED)

Write **integration tests** using `@testing-library/react` for components
that receive `app` and data as **props** (dependency injection). These are
`.integration.test.tsx` files placed next to their source.

**Testability boundary**: `mcp-app.tsx` calls `useApp()` directly and
CANNOT be tested in-process without `vi.mock` (prohibited). The app shell's
connection lifecycle (`ontoolresult`, `ontoolinput`, `ontoolcancelled`,
`onteardown`) is tested via **E2E tests** in Phase 5a against a running
MCP server, not via component tests.

All child components receive `app` and/or data as props — no `useApp` calls.

**Files and assertions**:

- `OakHeader.integration.test.tsx`:
  - Oak logo SVG is rendered
  - "Oak National Academy" text is a link to `https://www.thenational.academy`
- `ToolRouter.integration.test.tsx`:
  - Routes `get-curriculum-model` to `CurriculumModelView`
  - Routes `user-search` to `UserSearchView` (stub for now)
  - Renders JSON fallback for unknown tool names
- `CurriculumModelView.integration.test.tsx`:
  - Renders curriculum model data from props
  - Shows "No data" when result is null
Note: `loadWidgetHtml` (server-side file loader) is tested in Phase 5b
where it is implemented — see `loadWidgetHtml.unit.test.ts` there.

### 3b. Implement app shell + routing (GREEN)

**File**: `widget/src/mcp-app.tsx`

```typescript
import { useApp } from "@modelcontextprotocol/ext-apps/react";
// Full onAppCreated handler set per official pattern

// App shell renders:
// - OakHeader (logo + "Oak National Academy" link) — always
// - ToolRouter (switches on tool name from ontoolinput metadata)
// - OakFooter (AI disclaimer) — always
```

**File**: `widget/src/components/ToolRouter.tsx`

Routes tool name to view component:

| Tool Name | Component |
|-----------|-----------|
| `get-curriculum-model` | `<CurriculumModelView />` |
| `user-search` | `<UserSearchView />` (stub: "Search coming soon") |
| (unknown) | JSON fallback display |

The tool name comes from `ontoolinput` metadata (`toolName` field) or from
`ontoolresult` metadata. The `ToolResponseOptions.toolName` field in the SDK
remains useful for this routing — it is NOT redundant with the single-app
design (Betty Finding 3 resolved: field still needed).

External links use `app.openLink({ url })` per the official React example.

### 3c. Acceptance

- Component tests pass (GREEN)
- `pnpm build:widget` produces self-contained HTML
- HTML includes Oak logo, Lexend font, "Oak National Academy" link
- `get-curriculum-model` view renders tool result data
- Invoke `mcp-reviewer` for MCP Apps compliance

---

## Phase 4: Add User-Search View to MCP App

**Goal**: Add the interactive search view to the existing single MCP App,
plus a new `user-search` tool and `user-search-query` app-only helper.

### 4a. Define new `user-search` tool

This is a NEW tool, separate from the agent-facing `search`. It needs:

**Server-side registration** (in the SDK, via codegen or manual SDK
definition — NOT in the app):

- Tool name: `user-search`
- Description: "Interactive search for Oak curriculum resources"
- Input schema: minimal (the UI drives the search, not the model)
- `_meta.ui.resourceUri`: same `BASE_WIDGET_URI` as `get-curriculum-model`
  (single app, single resource)
- Text-only fallback: "Open the search interface to browse Oak's curriculum
  resources." (for hosts without MCP Apps support)

**App-only helper tool** (private, `visibility: ["app"]`):

- `user-search-query` — executes search using the search SDK
- Returns typed results (lessons, units, threads, sequences)
- Hidden from the model, callable by any MCP App widget (not just user-search)
- Search domain contracts (scopes, filters, result shapes) come from the
  search SDK — the tool handler is thin, the SDK owns the domain logic

### 4b. Integration tests for search components (RED)

Write **integration tests** (`.integration.test.tsx`) for search components.
Each component receives `app` and data as props (DI, no `useApp`).

- `SearchInput.integration.test.tsx` — text input, submit handler
- `ScopeSelector.integration.test.tsx` — scope tab selection
- `FilterControls.integration.test.tsx` — filter state changes
- `SearchResults.integration.test.tsx` — renders typed results with Oak branding
- `UserSearchView.integration.test.tsx`:
  - Renders loading spinner while search in-flight
  - Renders error message on timeout/failure
  - Renders "No results found" for empty results
  - Renders result cards with correct data
  - Validates tool result shape with Zod (invalid shape → error, not crash)
  - Result cards with links (using `app.openLink`)

### 4c. Implement user-search view (GREEN)

**File**: `widget/src/components/UserSearchView.tsx`

Receives the `app` instance as a prop from the parent `ToolRouter`. Uses
`app.callServerTool` to execute searches.

**Data flow** (all via MCP bridge, no direct HTTP):

1. User types query → UI calls `app.callServerTool({ name: "user-search-query", arguments: { query, scope, filters } })`
2. Server executes search via the search SDK
3. Result returned to widget via tool result
4. Widget renders search results with Oak branding
5. User selects results → `app.updateModelContext()` to sync selection to model

### 4d. Model context sync

Per the official patterns, `app.updateModelContext()` uses replace semantics.
The widget maintains cumulative state and sends the full current selection on
each call:

```typescript
await app.updateModelContext({
  content: [{
    type: "text",
    text: JSON.stringify({
      selectedLessons: selectedIds,
      selectedCount: selectedIds.length,
      searchQuery: currentQuery,
      scope: currentScope,
    }),
  }],
});
```

JSON is used instead of YAML frontmatter for machine-readability — the model
can parse structured JSON reliably without string parsing ambiguity.

### 4e. Acceptance

- Component tests pass (GREEN)
- `pnpm build:widget` produces self-contained HTML with both views
- Search executes via MCP bridge (no direct HTTP)
- Results render with Oak branding
- External links via `app.openLink()`
- Model context sync via `app.updateModelContext()`
- Invoke `mcp-reviewer`, `code-reviewer`, `test-reviewer`

---

## Phase 5: Integration (TDD)

**Goal**: Wire MCP Apps into resource registration and re-enable widget rendering.

### 5a. E2E tests for resource and tool wiring (RED)

**TDD**: Write failing **E2E tests** (`.e2e.test.ts` in `e2e-tests/`)
FIRST. These test a running MCP server over the protocol — they are
out-of-process tests, not integration tests.

**File**: `e2e-tests/widget-resource.e2e.test.ts` (update existing)

Assertions:

- MCP App resource appears in `resources/list` with correct URI and MIME
- `resources/read` returns self-contained HTML with `<div id="root"></div>`
- HTML contains Lexend font, Oak logo, `<script` tag
- Tools `get-curriculum-model` and `user-search` both have `_meta.ui.resourceUri`
  pointing to the same resource URI
- Both tools return meaningful text content (text-only fallback)
- `user-search-query` does NOT appear in `tools/list` (app-only visibility)

**URI pattern change**: The resource name changes from `oak-json-viewer`
to `oak-curriculum-viewer`. Update the `getWidgetUri` helper and all URI
pattern assertions (currently matching `oak-json-viewer-(local|[a-f0-9]{8})`).

These tests are RED because the integration is not yet wired.

### 5b. Create widget HTML loader (TDD)

**RED**: Write `loadWidgetHtml.unit.test.ts` (in `src/`):

- When file exists (inject fake `readFileSync`), returns content
- When file missing (inject fake that throws), re-throws with actionable
  error message and preserves `cause`

**GREEN**: Implement. Replace `aggregated-tool-widget.ts` with the HTML
loader using the fail-fast wrapper from the Architectural Constraints
section:

```typescript
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const base = dirname(fileURLToPath(import.meta.url));

function loadWidgetHtml(filename: string): string {
  const filepath = resolve(base, `../../dist/${filename}`);
  try {
    return readFileSync(filepath, 'utf-8');
  } catch (cause) {
    throw new Error(
      `Widget HTML not found at ${filepath}. Run 'pnpm build:widget' first.`,
      { cause },
    );
  }
}

export const WIDGET_HTML = loadWidgetHtml('mcp-app.html');
```

### 5c. Update resource registration

**File**: `src/register-resources.ts`

Single resource registration (same as today, just updated HTML source):

```typescript
registerAppResource(server, 'oak-curriculum-viewer', WIDGET_URI, ...);
```

The `registerWidgetResource()` function is re-created (it was removed in
Phase 1c) with the new `WIDGET_HTML` import. The resource name changes from
`oak-json-viewer` to `oak-curriculum-viewer`.

**Rewrite `register-resources.integration.test.ts`**: The
`registerWidgetResource` test block (removed in Phase 1c) must be
rewritten for the new contract: new HTML source, new resource name
(`oak-curriculum-viewer`), same CSP and MIME assertions.

### 5d. Populate `WIDGET_TOOL_NAMES`

**File**: `packages/sdks/oak-sdk-codegen/.../cross-domain-constants.ts`

No codegen pipeline changes needed — just populate the existing Set:

```typescript
export const WIDGET_TOOL_NAMES: ReadonlySet<string> = new Set([
  'get-curriculum-model',
  'user-search',
]);
```

Update the comment (currently says "Future WS4 will add `user-search`" —
this is WS3).

Run `pnpm sdk-codegen && pnpm build` to propagate.

### 5e. Register tools via `registerAppTool`

All three tools MUST use `registerAppTool` from
`@modelcontextprotocol/ext-apps/server`:

- `get-curriculum-model` — `registerAppTool` with `_meta.ui.resourceUri`
  pointing to the single widget resource. Tool MUST return meaningful
  text content as fallback for non-MCP-Apps hosts.
- `user-search` — `registerAppTool` with same `_meta.ui.resourceUri`.
  Tool returns text like "Open the search interface to browse Oak's
  curriculum."
- `user-search-query` — `registerAppTool` with `visibility: ["app"]`.
  Hidden from model, callable by any widget.

### 5f. Delete `widget-styles.ts`

All CSS values have been extracted to `widget/src/global.css`. Delete the old
string-constant file and update any remaining imports.

### 5g. E2E tests go GREEN

The integration tests from Phase 5a and E2E tests from Phase 1a should now
pass. May need two test suites (one per resource) or parameterised tests.

### 5h. Acceptance

- `pnpm check` passes — all gates green
- Widget E2E tests pass (GREEN)
- Both MCP Apps render in `basic-host` preview
- `pnpm sdk-codegen && pnpm build` succeeds
- Invoke `code-reviewer`, `mcp-reviewer`, `architecture-reviewer-barney`

---

## Phase 6: Documentation + OpenAI Cleanup

**Goal**: Remove all remaining OpenAI references from non-archive files.

### 6a. Fix TypeScript comments (4 files)

- `src/mcp-router.ts` — "OpenAI Apps docs" → "MCP spec"
- `src/auth-error-response.ts` — "OpenAI MCP OAuth" → "MCP OAuth"
- `src/auth-routes.ts` — "OpenAI Apps docs" → "MCP spec"
- `src/auth/mcp-auth/mcp-auth.ts` — "Per OpenAI Apps" → "Per MCP spec"

### 6b. Rewrite `widget-rendering.md` entirely

**File**: `apps/oak-curriculum-mcp-streamable-http/docs/widget-rendering.md`

This 195-line document describes the deleted string-template architecture.
Every section is obsolete. **Rewrite entirely** with:

- Single React MCP App architecture
- Vite build pipeline and `build:widget` command
- `useApp` connection lifecycle and `ToolRouter` routing
- Component structure (CurriculumModelView, UserSearchView)
- Development workflow (`dev:widget` with hot-reload)
- Build output expectations (self-contained HTML via `vite-plugin-singlefile`)

### 6c. Update workspace README

**File**: `apps/oak-curriculum-mcp-streamable-http/README.md`

Add:

- "Widget Build" section explaining `build:widget` and `dev:widget`
- Reference to ADR-141 (MCP Apps Standard)
- Purpose of the `widget/` directory

### 6d. TSDoc on all new public interfaces

All 15+ new `.tsx` files MUST have TSDoc on exported components describing:

- Component purpose
- Props interface (especially `app: App` and tool result types)
- `loadWidgetHtml` must document fail-fast behaviour

### 6e. Clean up remaining non-archive markdown files (~17-20 files)

Update each to reflect MCP Apps standard. Key files:

- `docs/architecture/architectural-decisions/141-mcp-apps-standard-primary.md`
  — add note about `user-search` and `user-search-query` new tool surface
- `.agent/sub-agents/templates/mcp-reviewer.md`
- `.agent/skills/mcp-migrate-oai/SKILL.md`
- `.agent/skills/mcp-create-app/SKILL.md`
- `.agent/skills/mcp-add-ui/SKILL.md`
- `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
- Various active/current plan files

Archive files left as-is.

### 6f. Update parent plan

**File**: `mcp-app-extension-migration.plan.md`

Mark both `ws3-widget-client-branding` AND `ws4-search-ui` todos as `done`
(this child plan consolidates both work streams into one).

### 6h. Acceptance

- `rg -i "openai" apps/oak-curriculum-mcp-streamable-http/src/ --type ts`
  returns zero
- `rg "window\.openai" --glob "*.md" --glob "!*archive*"` returns zero
- `widget-rendering.md` fully rewritten for React architecture
- Workspace README includes widget build documentation
- All new components have TSDoc
- Parent plan WS3 + WS4 both marked done
- Invoke `docs-adr-reviewer`

---

## Phase 7: Final Review + Commit

### 7a. Coupling regression check

```bash
rg -n "openai/outputTemplate|openai/toolInvocation|openai/widgetAccessible|openai/visibility|text/html\+skybridge|window\.openai|openai/widget" \
  packages/sdks/ apps/oak-curriculum-mcp-streamable-http/src/
```

Expected: zero hits.

### 7b. Full quality gates

```bash
pnpm check
```

### 7c. Reviewer invocations

- `code-reviewer` — gateway review
- `mcp-reviewer` — MCP Apps protocol compliance
- `architecture-reviewer-fred` — ADR compliance
- `architecture-reviewer-barney` — dependency mapping
- `test-reviewer` — TDD compliance
- `type-reviewer` — type flow from ext-apps SDK types
- `config-reviewer` — Vite + turbo + tsconfig
- `security-reviewer` — CSP, PostMessage, iframe sandboxing

### 7d. Commit

---

## Key Files Reference

### Files to DELETE (Phase 1)

| Path (relative to `apps/oak-curriculum-mcp-streamable-http/`) | Reason |
|--------------------------------------------------------------|--------|
| `src/widget-script.ts` | Dead code (`undefined?.toolOutput`) |
| `src/widget-script-state.ts` | Dead code (`undefined?.widgetState`) |
| `src/widget-script-escaping.ts` + test | String template utility |
| `src/widget-renderer-registry.ts` + test | Empty map |
| `src/widget-file-generator.ts` + test | HTML-to-disk writer |
| `src/widget-renderers/*` (6 files) | String template renderers |
| `src/aggregated-tool-widget.unit.test.ts` | Tests deleted code |
| `src/aggregated-tool-widget.integration.test.ts` | Tests deleted code |
| `scripts/widget-preview-server.ts` | Imports deleted functions |

### Files to CREATE (Phases 2-4)

| Path | Purpose |
|------|---------|
| `widget/vite.config.ts` | Official Vite config (react + singlefile) |
| `widget/tsconfig.json` | TypeScript JSX config (official pattern) |
| `widget/mcp-app.html` | Vite entry HTML |
| `widget/src/global.css` | Oak brand CSS (host variable fallbacks) |
| `widget/src/mcp-app.tsx` | React entry point + root component |
| `widget/src/mcp-app.module.css` | Component styles |
| `widget/src/components/OakHeader.tsx` | Logo + title link component |
| `widget/src/components/OakFooter.tsx` | AI disclaimer component |
| `widget/src/components/ToolRouter.tsx` | Tool name → view routing |
| `widget/src/components/CurriculumModelView.tsx` | Curriculum model display |
| `widget/src/components/UserSearchView.tsx` | Interactive search UI |
| `widget/src/components/SearchInput.tsx` | Search text input |
| `widget/src/components/SearchResults.tsx` | Search result cards |
| `widget/src/components/ScopeSelector.tsx` | Scope tabs |
| `widget/src/components/FilterControls.tsx` | Filter UI |

### Existing infrastructure (modified)

| Path | Change |
|------|--------|
| `src/aggregated-tool-widget.ts` | Reads single Vite HTML from disk |
| `src/register-resources.ts` | Single resource re-enabled |
| `src/auth/public-resources.ts` | Widget URI in auth bypass set |
| `e2e-tests/widget-resource.e2e.test.ts` | Updated assertions |
| `cross-domain-constants.ts` | Populate `WIDGET_TOOL_NAMES` (no URI changes) |

---

## Official Documentation Sources

- Build guide: <https://modelcontextprotocol.io/extensions/apps/build>
- API docs: <https://apps.extensions.modelcontextprotocol.io/api/>
- Quickstart: <https://apps.extensions.modelcontextprotocol.io/api/documents/Quickstart.html>
- Patterns: <https://apps.extensions.modelcontextprotocol.io/api/documents/Patterns.html>
- Official React example: <https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-server-react>
- basic-host preview: <https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-host>
- ext-apps SDK: <https://github.com/modelcontextprotocol/ext-apps>

---

## Verification

1. `pnpm check` — all quality gates pass
2. `pnpm test:e2e` — widget resource E2E tests GREEN
3. `pnpm build:widget` — Vite produces single self-contained HTML file
4. Coupling regression — zero OpenAI hits in non-archive files
5. Manual: `basic-host` preview renders MCP App with both views
6. Manual: test in Claude via cloudflare tunnel
