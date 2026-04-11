# MCP Apps Canonical Research Summary

> Use this document for present-tense MCP Apps guidance only. For Oak's live
> implementation work, the normative sources are the MCP Apps specification,
> `@modelcontextprotocol/ext-apps`, and the active executable plans.

## Normative Sources

The canonical source set for this workstream is:

1. SEP-1865 for the MCP Apps protocol
2. `@modelcontextprotocol/ext-apps` quickstart
3. `@modelcontextprotocol/ext-apps` patterns guidance
4. `@modelcontextprotocol/ext-apps/react` API documentation

Oak should treat those sources as authoritative ahead of any secondary blog
post, migration note, or host-specific extension material.

## Canonical Server Model

For Oak, the canonical server-side MCP Apps pattern is:

1. Register UI-bearing tools with `registerAppTool`
2. Register HTML resources with `registerAppResource`
3. Point tools to `ui://` resources through `_meta.ui.resourceUri`
4. Serve UI resources as `text/html;profile=mcp-app`
5. Keep capability handling inside the upstream helper boundary rather than
   authoring local compatibility plumbing

The server remains registry-driven. Tool registration should continue to flow
from canonical descriptors rather than a second hand-maintained UI inventory.

## Canonical React UI Model

The canonical Oak UI model is:

1. One React app bundled as a self-contained MCP App resource
2. Vite as the widget build tool
3. `useApp()` as the default React entry point
4. Lifecycle handlers attached through the official SDK integration
5. Tool calls initiated from the UI through `app.callServerTool()`
6. External navigation initiated through `app.openLink()`
7. Model-visible state updates sent only through `app.updateModelContext()`

The raw `App` class is still the underlying primitive, but Oak should default
to the official React integration rather than inventing bridge plumbing.

## Data and State Rules

Oak's UI layer should follow these rules:

1. Business data arrives through MCP tool inputs and tool results
2. The iframe is not a second HTTP client by default
3. Ephemeral UI state lives in React state
4. If recoverable UI state is truly needed, use the documented `viewUUID`
   storage pattern
5. Persist only UI-level state; do not create transport or auth side channels

## Resource and Security Rules

Oak should keep the iframe resource model simple:

1. Use `_meta.ui.csp` only for domains the app actually needs
2. Omit `_meta.ui.domain` unless the app genuinely needs direct cross-origin
   fetches
3. Prefer MCP-mediated data flow over iframe-origin network calls
4. Treat CSP and resource declarations as fail-closed contracts

## Build and Test Implications

The canonical toolchain implications are:

1. Widget source must be first-class in Turbo inputs
2. App lint and type-check configuration must include widget `.tsx`
3. Widget in-process tests need a dedicated DOM-capable Vitest config
4. Build order must account for any `clean: true` output step
5. Manual verification should use the upstream `basic-host` workflow

## Oak-Specific Implications

For the Oak MCP server specifically:

1. One MCP App resource should route internally on tool name
2. `get-curriculum-model` and `user-search` are the intended UI entry points
3. `user-search-query` may exist only as an app-only helper if still justified
4. App-only visibility must be represented in canonical descriptors and
   enforced in `tools/list`
5. Normative docs must stay aligned with the live executable plans

## Non-Normative Material

Background materials that discuss host-specific extensions, migration stories,
or superseded widget systems are not architecture authority for Oak. Keep them
out of active design decisions unless a new plan explicitly requires a bounded
compatibility investigation.
