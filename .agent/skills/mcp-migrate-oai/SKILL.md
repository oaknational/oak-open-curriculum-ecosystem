---
name: mcp-migrate-oai
classification: active
description: Migrate Oak's existing OpenAI Apps SDK usage to the MCP Apps standard. Maps to Domain C items (C3–C6) in the MCP Apps migration roadmap. Use when the user asks to migrate window.openai usage, migrate metadata keys, or execute a specific Domain C migration task.
---

# Migrate from OpenAI Apps SDK (Oak)

## Context

Oak-specific variant of the upstream `migrate-oai-app` skill from `modelcontextprotocol/ext-apps`.

**Scope**: `apps/oak-curriculum-mcp-streamable-http` only. The stdio server has no MCP Apps surface and is never in scope.

## Before Starting

- Read `.agent/plans/sdk-and-mcp-enhancements/roadmap.md` to identify the specific Domain C item(s) in scope.
- Confirm the reframing ADR is accepted (Gate 2).
- Read `.agent/directives/principles.md` and `.agent/directives/testing-strategy.md`.

## Domain C Internal Dependency Ordering

Implement in this order:

1. **C1/C2** — host-neutral boundary enforcement and platform toggle removal (runs first; nothing else starts until done).
2. **C5** — SDK contracts: codegen emitter and tool descriptor contract.
3. **C4/C6** — MIME migration and resource metadata migration.
4. **C3/C10** — widget JS migration (runs last; depends on correct MCP bridge being in place).

C7, C8, C9 can run independently but must complete before Domain D.

## OpenAI Coupling Inventory

| Layer | File | Coupling |
|-------|------|---------|
| Tool metadata (codegen) | `packages/sdks/oak-sdk-codegen/src/bulk/generators/emit-index.ts` | 5 OpenAI-specific keys |
| Tool descriptor contract | `packages/sdks/oak-sdk-codegen/src/tool-descriptor.contract.ts` | 5 OpenAI-specific keys |
| Resource metadata | `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` | 4 OpenAI-specific keys |
| MIME type | `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` | `text/html+skybridge` |
| Widget JS (tool data) | `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` | 5 `window.openai.*` usages |
| Widget JS (state) | `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts` | 3 `window.openai.*` usages |

## SDK (already installed)

`@modelcontextprotocol/ext-apps/server` v1.1.2 — migration vehicle for C4/C5/C6:

- `registerAppTool` — normalises `_meta.ui.resourceUri`; handles legacy key automatically.
- `registerAppResource` — defaults to `text/html;profile=mcp-app`.
- `RESOURCE_MIME_TYPE` — canonical MIME constant; use everywhere.

## Key Rules

- **MCP-standard-only.** No dual paths, no fallback metadata keys, no host-mode toggles.
- **CSP field mapping**: `openai/widgetCSP` → `_meta.ui.csp` with camelCase fields (`connectDomains`, `resourceDomains`, `frameDomains`). Validate the mapping explicitly — the legacy format used snake_case.
- **`_meta.ui.domain`**: only required if the widget makes direct cross-origin `fetch()` calls from the iframe. If all data flows through the MCP bridge, omit it.
- **`widgetState`/`setWidgetState`**: no MCP Apps equivalent. Design and validate an alternative (prefer `sessionStorage` or in-memory) before removing `window.openai` state calls.

## Workflow

1. Read the upstream skill at https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps/skills/migrate-oai-app for the generic migration guide.
2. Read `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md` for the compatibility matrix and CSP field mapping.
3. Apply the upstream guide with Oak-specific file paths from the inventory above.
4. Run the coupling regression check from the roadmap Quality Gates section after each C-item:
   ```bash
   rg -n "WIDGET_URI|BASE_WIDGET_URI|openai/outputTemplate|text/html\+skybridge|window\.openai" \
     packages/sdks/oak-sdk-codegen/src \
     apps/oak-curriculum-mcp-streamable-http/src
   ```
5. Run `pnpm jc-gates` before declaring the task complete.
