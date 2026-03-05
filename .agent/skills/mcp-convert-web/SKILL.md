---
name: mcp-convert-web
classification: active
description: Convert an existing Oak web component or HTML page into an MCP App resource. Use when the user has an existing web UI and wants to deliver it as an MCP App widget inside the Oak http server. Domain D activity — confirm Domain C is complete first.
---

# Convert Web Component to MCP App (Oak)

## Context

Oak-specific variant of the upstream `convert-web-app` skill from `modelcontextprotocol/ext-apps`.

**Scope**: `apps/oak-curriculum-mcp-streamable-http` only. The stdio server (`apps/oak-curriculum-mcp-stdio`) has no MCP Apps surface and is never in scope.

## Before Starting

- Confirm Domain C critical items are complete and the reframing ADR is accepted.
- See `.agent/plans/sdk-and-mcp-enhancements/roadmap.md` (Domain D prerequisites).
- Read `.agent/directives/rules.md` and `.agent/directives/testing-strategy.md`.

## SDK (already installed)

`@modelcontextprotocol/ext-apps/server` v1.1.2:

- `registerAppResource` — registers the converted HTML with `text/html;profile=mcp-app` MIME automatically.
- `registerAppTool` — links the parent tool to the resource URI.
- `getUiCapability` — always check for MCP Apps support; provide a text-only fallback.
- `RESOURCE_MIME_TYPE` — canonical MIME constant; use everywhere.

## Key Differences from a Standard Web App

- **Sandboxed iframe**: no access to the parent page; all external requests require explicit CSP declaration via `_meta.ui.csp`.
- **No same-origin server**: HTML is served as an MCP resource, not from an HTTP server. There is no `fetch('/api/...')`.
- **Data via MCP bridge**: use the MCP Apps SDK `App` class and JSON-RPC bridge (`ui/initialize`, `ui/notifications/tool-input`, `ui/notifications/tool-result`) instead of direct API calls.
- **`connect()` is async**: widget render MUST NOT run before `connect()` resolves and tool data is delivered via `app.ontoolresult`.
- **`_meta.ui.domain`**: only required for direct cross-origin `fetch()` from the iframe. If data flows through the MCP bridge, omit it.

## Workflow

1. Read the upstream skill at https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps/skills/convert-web-app for the generic conversion guide.
2. Read `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md` for the CSP model and compatibility matrix.
3. Audit the existing web component for:
   - Direct API calls → must become MCP bridge calls or be removed entirely.
   - External resource origins → must be declared in `_meta.ui.csp` (`connectDomains`, `resourceDomains`, `frameDomains`).
   - State management → replace with in-memory or `sessionStorage`; never use `localStorage` for auth tokens, session data, tool result payloads, or PII.
4. Convert per the upstream guide, applying Oak's SDK surface above.
5. Run `pnpm jc-gates` before declaring the task complete.
