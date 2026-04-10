# Widget Rendering

## Status

The MCP App widget is **live**. Phases 0–4 (infrastructure, branding,
theming, SDK alignment) are complete. The Oak brand banner renders in
standalone dev mode (`dev:widget`), in the reference MCP host
(`dev:widget-in-host`), and passes WCAG 2.2 AA in both light and dark
themes (`test:widget:a11y`).

## Canonical Target

The replacement architecture is:

1. One MCP App resource served as `text/html;profile=mcp-app`
2. One React app bundled to a self-contained HTML file with Vite and
   `vite-plugin-singlefile`
3. MCP-standard registration through `registerAppTool` and
   `registerAppResource`
4. Host communication through the `ui/*` bridge implemented by
   `@modelcontextprotocol/ext-apps`
5. Tool-initiated and UI-initiated data flow through MCP tool calls and tool
   notifications only

## Explicit Non-Goals

- No legacy host globals
- No legacy metadata aliases
- No compatibility shims or preview wrappers
- No direct HTTP fetch from the iframe unless explicitly re-planned
- No incremental repair of the old widget framework

## Current Planning Source

For the live implementation plan, read:

- `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
- `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`
- `.agent/plans/sdk-and-mcp-enhancements/active/ws3-widget-clean-break-rebuild.plan.md`
- `.agent/plans/sdk-and-mcp-enhancements/current/README.md`

Those plans are authoritative. This document is intentionally short so it does
not preserve stale architectural detail from the deleted system.

For canonicality gates, use the WS3 child plan's `Canonical Compliance
Checklist` and `Canonical Runtime Contamination Check`.
