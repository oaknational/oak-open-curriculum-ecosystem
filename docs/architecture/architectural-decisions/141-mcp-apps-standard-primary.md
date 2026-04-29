# ADR-141: MCP Apps Standard as Only UI Surface

## Status

Accepted

## Date

2026-03-25

## Related

- [ADR-029: No Manual API Data Structures](029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](031-generation-time-extraction.md)
- [ADR-046: OpenAI Connector Facades in Streamable HTTP](046-openai-connector-facades-in-streamable-http.md) (superseded by this ADR)
- [ADR-061: Widget CTA System](061-widget-cta-system.md) (superseded; CTA system deleted as part of this migration)

## Context

Oak's MCP HTTP server (`apps/oak-curriculum-mcp-streamable-http/`) serves
interactive widget UIs through tool definitions that carry ChatGPT-specific
`openai/*` metadata keys (`openai/outputTemplate`, `openai/toolInvocation/*`,
`openai/widgetAccessible`, `openai/visibility`) and a ChatGPT-only MIME type
(`text/html+skybridge`). Widget JavaScript communicates through the
`window.openai.*` API. This locks the entire UI surface to a single host.

The MCP Apps extension (SEP-1865, stable 2026-01-26) is the official,
host-neutral standard for serving interactive UIs from MCP tools. It is
supported by ChatGPT, Claude, Claude Desktop, VS Code GitHub Copilot, Goose,
Postman, and MCPJam. ChatGPT reads `_meta.ui.resourceUri` natively and
maintains `openai/outputTemplate` only as a compatibility alias.

The `@modelcontextprotocol/ext-apps` SDK (^1.5.0) is the migration target for
Oak's MCP Apps rollout. Resource registration now imports
`@modelcontextprotocol/ext-apps/server`; tool registration and the widget client
bridge complete in later work streams.

**Current framing note (2026-04-29):** this decision also carries the repo's
MCP Apps exploration goal. Oak is testing how one MCP App surface can work in
AI platforms such as Claude Cowork and ChatGPT while remaining a developer tool
surface for teams building with Oak's curriculum primitives.

## Decision

Oak builds one MCP server with MCP Apps widgets. ChatGPT is one host among
many. All OpenAI-specific coupling is deleted, not wrapped.

Specifically:

1. **Tool metadata**: All tool definitions use `_meta.ui.resourceUri` as the
   sole widget pointer. The `openai/*` metadata keys are deleted with no
   replacement:
   - `openai/outputTemplate` → `_meta.ui.resourceUri`
   - `openai/toolInvocation/invoking` and `/invoked` → deleted (no MCP Apps
     equivalent; hosts handle loading states)
   - `openai/widgetAccessible` → deleted (MCP Apps default visibility is
     `["model", "app"]`, meaning all tools are callable by both the model and
     widgets — this matches the current `widgetAccessible: true` semantics)
   - `openai/visibility: 'public'` → deleted (MCP Apps default visibility
     includes `"model"`, matching the current `'public'` semantics)

2. **Resource registration**: The HTTP app uses `registerAppResource` from
   `@modelcontextprotocol/ext-apps/server` with `RESOURCE_MIME_TYPE`
   (`text/html;profile=mcp-app`) instead of `text/html+skybridge`.

3. **Tool registration**: UI-bearing tools migrated to `registerAppTool`
   from `@modelcontextprotocol/ext-apps/server`. Generated tools continue to
   use the registry-driven path via `listUniversalTools(generatedToolRegistry)`.

4. **Widget client**: WS3 replaced the `window.openai.*` bridge with the
   MCP Apps `App` class from `@modelcontextprotocol/ext-apps/react`. The
   widget is a self-contained React MCP App using `useApp()` for host
   communication.

5. **No dual paths**: All OpenAI-specific resource metadata, MIME types,
   ChatGPT emulation wrappers, and `window.openai` widget bridges have been
   deleted. No compatibility layer exists.

## Consequences

### Positive

- One codebase serves ChatGPT, Claude, and any MCP Apps-compliant host.
- Widget resource registration uses the official MCP Apps SDK immediately.
- The custom `chatgpt-emulation-wrapper.ts` is deleted instead of being carried
  forward as a compatibility layer.
- Future hosts (Gemini, Cursor, etc.) gain widget support automatically.

### Negative

- Hard cutover means old ChatGPT-only widget previews stopped working immediately.
  WS3 introduced the MCP Apps client/basic-host development path (`pnpm dev:widget-in-host`).
- Any host that only reads `openai/outputTemplate` and not `_meta.ui.resourceUri`
  will not render widgets. Per the compatibility matrix, no known active host has
  this limitation — ChatGPT reads both.

### Neutral

- `_meta.securitySchemes` is retained alongside `_meta.ui` — it is not an
  OpenAI-specific key.
- The deprecated flat key `_meta["ui/resourceUri"]` is not emitted by Oak's
  codegen. `registerAppTool` auto-populates it at registration time for backward
  compatibility.
