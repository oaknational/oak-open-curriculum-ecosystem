---
name: mcp-add-ui
classification: active
description: Add an MCP App UI (HTML resource) to an existing Oak MCP tool. Use when the user asks to add UI to an existing tool, enrich an existing tool with a widget, or add a resource to a tool that currently has no UI. Domain D activity — confirm Domain C is complete first.
---

# Add UI to Existing Oak MCP Tool

## Context

Oak-specific variant of the upstream `add-app-to-server` skill from `modelcontextprotocol/ext-apps`.

**Scope**: `apps/oak-curriculum-mcp-streamable-http` only. The stdio server (`apps/oak-curriculum-mcp-stdio`) has no MCP Apps surface and is never in scope.

## Before Starting

- Confirm Domain C critical items are complete and the reframing ADR is accepted.
- See `.agent/plans/sdk-and-mcp-enhancements/roadmap.md` (Domain D prerequisites).
- Read `.agent/directives/principles.md` and `.agent/directives/testing-strategy.md`.

## SDK (already installed)

`@modelcontextprotocol/ext-apps/server` v1.1.2:

- `registerAppTool` — links tool to `_meta.ui.resourceUri`.
- `registerAppResource` — registers the HTML resource with `text/html;profile=mcp-app` MIME automatically.
- `getUiCapability` — capability negotiation; always provide a text-only fallback for clients without MCP Apps support.
- `RESOURCE_MIME_TYPE` — canonical MIME constant; use everywhere.

## Workflow

1. Read the upstream skill at https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps/skills/add-app-to-server for the generic step-by-step guide.
2. Read `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` for existing resource registration patterns.
3. Identify the existing tool to enrich and its current response shape — the tool result becomes the data payload delivered to the widget via `app.ontoolresult`.
4. Follow the upstream six-step guide, substituting Oak's SDK surface:
   - Use `registerAppResource` instead of manual resource registration.
   - Use `registerAppTool` to link the tool to its resource URI.
   - Check `getUiCapability`; register a text-only fallback tool for clients without MCP Apps support.
5. Widget data MUST flow through the MCP bridge. Never use `window.openai.*`.
6. `connect()` is async — widget render MUST NOT run before `connect()` resolves.
7. Run `pnpm jc-gates` before declaring the task complete.
