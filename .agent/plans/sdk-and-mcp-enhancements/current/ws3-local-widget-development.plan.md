---
name: "WS3: Local Widget Development Infrastructure"
overview: "SUPERSEDED — absorbed into ws3-branding-alignment-and-merge.plan.md (P0)."
parent_plan: "ws3-widget-clean-break-rebuild.plan.md"
specialist_reviewer: "mcp-reviewer"
superseded_by: "../active/ws3-branding-alignment-and-merge.plan.md"
isProject: false
todos:
  - id: phase-1-red
    content: "Phase 1 (RED): Write tests for Vite dev server config and basic-host script. Tests MUST fail."
    status: pending
  - id: phase-2-green
    content: "Phase 2 (GREEN): Implement dev:widget script and dev:basic-host script."
    status: pending
  - id: phase-3-refactor
    content: "Phase 3 (REFACTOR): Documentation, TSDoc, README updates."
    status: pending
  - id: phase-4-quality-gates
    content: "Phase 4: Full quality gate chain."
    status: pending
---

# WS3: Local Widget Development Infrastructure

**Last Updated**: 2026-04-06
**Status**: CURRENT (queued, not started)
**Scope**: Add two local development scripts for the MCP App widget —
a Vite dev server for hot-reload UI iteration and a basic-host
integration for full MCP Apps lifecycle testing.

---

## Context

The Oak MCP App widget builds to a self-contained `dist/mcp-app.html`
via Vite + `vite-plugin-singlefile`. There is currently no local
preview or dev server. The only ways to see the widget are:

1. `pnpm build` then open `dist/mcp-app.html` directly (no hot-reload,
   no MCP host context)
2. Connect the MCP server to an external MCP Apps host like MCPJam
   (requires network, third-party dependency)

Phase 5 (interactive search view) needs rapid UI iteration. Both
options are too slow for development feedback loops.

### Existing Capabilities

- Vite build config at `widget/vite.config.ts` — already configured
  with React plugin, `vite-plugin-singlefile`, and `__APP_VERSION__`
  define
- `dev:auth:stub` script — runs the MCP server locally with stub
  tools and auth disabled on port 3333
- `@modelcontextprotocol/ext-apps` already installed — the
  `basic-host` example from the same repo is the upstream reference
  host implementation
- Widget unit tests in jsdom — prove component rendering

### Problem Statement

No local development feedback loop exists for the widget UI. The
build-open cycle has no hot-reload. The MCP Apps lifecycle (host
context, tool input/result, theme, openLink) cannot be tested locally
without a third-party host.

---

## Design Principles

1. **Use off-the-shelf tooling** — Vite dev server is built in. The
   upstream `basic-host` is the reference implementation. No custom
   preview shims.
2. **No network calls** — Local development must work entirely
   offline with stub tools and disabled auth.
3. **Could it be simpler?** — Two scripts, no new dependencies for
   the Vite dev server. `basic-host` is an npx-invokable package.

**Non-Goals** (YAGNI):

- Custom preview harness or host emulator
- Playwright visual regression (belongs in a separate plan)
- Production-like auth flow in local preview
- Hot-reload of the MCP server itself (only the widget UI)

---

## Foundation Alignment

- `principles.md`: "No shims, no hacks, no workarounds" — use
  upstream tools directly
- `principles.md`: "Use off-the-shelf, not custom plumbing"
- `testing-strategy.md`: Browser proof surfaces (ADR-147) are a
  blocking quality gate for UI-shipping workspaces — this
  infrastructure enables them
- WS3 parent plan §7: "No custom preview shim; use the upstream
  `basic-host` workflow for local MCP App verification"

---

## Phase 1 — Test Specification (RED)

### 1.1: Vite dev server config

The Vite config already works for builds. The dev server needs the
same config but without `vite-plugin-singlefile` (which is
build-only). Verify:

- `vite dev` starts without errors on the widget directory
- The dev server serves `mcp-app.html` at the root
- React hot-reload works (manual verification, not automated)

**Acceptance**: Dev server starts and serves the widget HTML.

### 1.2: basic-host integration

Verify the upstream `basic-host` can connect to the local Oak MCP
server and render the MCP App resource:

- `basic-host` connects to `http://localhost:3333/mcp`
- `tools/list` shows UI tools with `_meta.ui.resourceUri`
- Calling `get-curriculum-model` renders the brand banner in the
  basic-host iframe

**Acceptance**: Brand banner visible in basic-host at
`http://localhost:8080`.

---

## Phase 2 — Implementation (GREEN)

### 2.1: `dev:widget` script

Add to `apps/oak-curriculum-mcp-streamable-http/package.json`:

```json
"dev:widget": "vite dev --config widget/vite.config.ts"
```

The existing Vite config should work for dev mode. If
`vite-plugin-singlefile` causes issues in dev mode, create a minimal
`widget/vite.dev.config.ts` that extends the build config without the
singlefile plugin.

**Acceptance**: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:widget`
starts a Vite dev server with hot-reload on the widget source.

### 2.2: `dev:basic-host` script

Add to `apps/oak-curriculum-mcp-streamable-http/package.json`:

```json
"dev:basic-host": "npx @modelcontextprotocol/basic-host --servers http://localhost:3333/mcp"
```

Or if `basic-host` uses the `SERVERS` env var pattern:

```json
"dev:basic-host": "SERVERS='[\"http://localhost:3333/mcp\"]' npx @modelcontextprotocol/basic-host"
```

Verify the exact invocation against the upstream README. The script
should work with `dev:auth:stub` running in another terminal.

**Acceptance**: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:basic-host`
starts basic-host connected to the local Oak MCP server.

### 2.3: Turbo pipeline

Ensure `dev:widget` and `dev:basic-host` are NOT included in the
Turbo `build` pipeline (they are long-running dev processes, not
build tasks).

---

## Phase 3 — Documentation (REFACTOR)

### 3.1: Workspace README

Update `apps/oak-curriculum-mcp-streamable-http/README.md` (or
`docs/widget-rendering.md`) with:

- How to run the widget dev server
- How to run basic-host with the local MCP server
- The two-terminal workflow: `dev:auth:stub` + `dev:basic-host`
- How to use [MCPJam](https://www.mcpjam.com/) as a verification and
  design tool — connect the local dev server, call UI-bearing tools,
  verify rendering and interaction in a real MCP Apps host. MCPJam is
  an MCP Apps-compatible host listed in the official MCP client matrix
  and is useful for visual design review and acceptance testing when
  basic-host is insufficient (e.g. testing host-provided theming,
  display modes, or real-world iframe sandboxing behaviour)

### 3.2: TSDoc

Add TSDoc to any new or modified config files.

---

## Phase 4 — Quality Gates

Run `pnpm check`. All gates must pass. No new dependencies should be
added for the Vite dev server (Vite is already installed). The
`basic-host` invocation via `npx` avoids adding it as a dependency.

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `vite-plugin-singlefile` incompatible with dev mode | Medium | Create a separate dev config that excludes the plugin |
| `basic-host` npx invocation changes upstream | Low | Pin version in the script or document the version |
| CORS rejection between basic-host and Oak server | Medium | Oak server already has permissive CORS for MCP clients |
| Auth challenge blocks basic-host connection | Low | Use `dev:auth:stub` which disables auth |

---

## Cross-Plan References

- `ws3-widget-clean-break-rebuild.plan.md` — parent plan, §7 mandates
  basic-host for local verification
- `ws3-phase-5-interactive-user-search-view.plan.md` — primary
  consumer of this infrastructure
- `mcp-app-extension-migration.plan.md` — umbrella migration plan
