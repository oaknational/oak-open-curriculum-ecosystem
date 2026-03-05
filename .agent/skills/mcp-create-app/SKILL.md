---
name: mcp-create-app
classification: active
description: Create a new MCP App (tool + HTML resource) in the Oak http server from scratch. Use when the user asks to create a new MCP App, build a new interactive widget, or add a new UI to an Oak MCP tool. Domain D activity — confirm Domain C is complete first.
---

# Create MCP App (Oak)

## Context

Oak-specific variant of the upstream `create-mcp-app` skill from `modelcontextprotocol/ext-apps`.

**Scope**: `apps/oak-curriculum-mcp-streamable-http` only. The stdio server (`apps/oak-curriculum-mcp-stdio`) has no MCP Apps surface and is never in scope.

## Before Starting

- Confirm Domain C critical items are complete and the reframing ADR is accepted.
- See `.agent/plans/sdk-and-mcp-enhancements/roadmap.md` (Domain D prerequisites).
- Read `.agent/directives/rules.md` and `.agent/directives/testing-strategy.md`.

## SDK (already installed)

`@modelcontextprotocol/ext-apps/server` v1.1.2:

- `registerAppTool` — links tool to `_meta.ui.resourceUri`; handles legacy key compatibility automatically.
- `registerAppResource` — registers the HTML resource; defaults MIME to `text/html;profile=mcp-app` (exported as `RESOURCE_MIME_TYPE`).
- `getUiCapability` — capability negotiation; always provide a text-only fallback for clients without MCP Apps support.
- `RESOURCE_MIME_TYPE` — use this constant; never hard-code the MIME string.

## Workflow

1. Read the upstream skill at https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps/skills/create-mcp-app for the generic workflow.
2. Read `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` for existing resource registration patterns.
3. Read `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` for MIME type and tool-widget linking patterns.
4. Follow the upstream workflow, substituting Oak's SDK surface (above) for any raw API calls.
5. Widget JavaScript runs in a sandboxed iframe. All data MUST flow through the MCP bridge (`tools/call`, `ui/notifications/*`). Never use `window.openai.*`.
6. `connect()` is async — widget render MUST NOT run before `connect()` resolves and tool data is delivered via `app.ontoolresult`.
7. If the widget needs state, prefer in-memory or `sessionStorage`. If `localStorage` is used, namespace keys, add TTL/expiry, schema-validate on read, and never store auth tokens, session data, or PII.
8. Run `pnpm jc-gates` before declaring the task complete.
