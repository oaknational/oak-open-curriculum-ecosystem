---
name: WS2 schema-first
overview: "Keep WS2 focused on MCP Apps runtime resource migration while enforcing schema-first boundaries: generated/runtime tool surfaces stay data-driven from the SDK registry, and aggregated tools remain authored workflows that depend on schema-derived contracts rather than new hand-maintained runtime inventories."
todos:
  - id: ws2-red-tests-first
    content: Move WS2 RED phase to update E2E MIME assertions and rewrite resource integration tests before product code changes.
    status: completed
  - id: ws2-resource-migration
    content: Migrate widget resource registration to `registerAppResource` + `RESOURCE_MIME_TYPE`, remove ChatGPT/OpenAI resource metadata, and simplify the runtime call site.
    status: completed
  - id: ws2-delete-artefacts
    content: Delete ChatGPT-only runtime artefacts and update comments/docs touched by the runtime migration.
    status: completed
  - id: ws2-schema-first-verification
    content: Verify no new hard-coded runtime tool inventories were introduced, then run coupling checks, quality gates, and reviewer passes.
    status: completed
isProject: false
---

# WS2 Schema-First Runtime Plan

## Scope

WS2 stays focused on the MCP Apps runtime resource migration in [apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts](apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts), [apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts](apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts), [apps/oak-curriculum-mcp-streamable-http/src/handlers.ts](apps/oak-curriculum-mcp-streamable-http/src/handlers.ts), [apps/oak-curriculum-mcp-streamable-http/src/security.ts](apps/oak-curriculum-mcp-streamable-http/src/security.ts), [apps/oak-curriculum-mcp-streamable-http/src/security-config.ts](apps/oak-curriculum-mcp-streamable-http/src/security-config.ts), and the related tests/deletions.

Schema-first constraint: do not introduce any new hand-maintained runtime tool lists or per-tool registration wiring. The live runtime must continue to derive tool surfaces from [packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/list-tools.ts) via `listUniversalTools(generatedToolRegistry)`. Aggregated tools in [packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts](packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts) are treated as authored workflows, not schema-generated endpoints, so WS2 must consume them without creating a second source of truth in the app runtime.

## Plan

1. Start with tests in RED.

Update [apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts) first for the externally visible MIME change from `text/html+skybridge` to `text/html;profile=mcp-app`, then rewrite [apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts](apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts) to assert `_meta.ui.csp`, `prefersBorder`, dropped `domain`/description behaviour, and a plain-object fake instead of `vi.fn()` plus local type aliases.

1. Apply the runtime resource migration without broadening the source of truth.

In [apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts](apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts), replace direct `registerResource` widget wiring with `registerAppResource` and `RESOURCE_MIME_TYPE`, keep authoritative widget metadata on the returned `contents[]` item, drop `widgetDomain`, `WIDGET_DESCRIPTION`, `getToolWidgetUri()`, and the `ResourceRegistrar` alias, and simplify [apps/oak-curriculum-mcp-streamable-http/src/handlers.ts](apps/oak-curriculum-mcp-streamable-http/src/handlers.ts) to call `registerAllResources(server)` with no widget-domain plumbing.

1. Delete ChatGPT-only artefacts and update nearby comments.

Remove [apps/oak-curriculum-mcp-streamable-http/src/widget-cta/](apps/oak-curriculum-mcp-streamable-http/src/widget-cta/) and [apps/oak-curriculum-mcp-streamable-http/scripts/chatgpt-emulation-wrapper.ts](apps/oak-curriculum-mcp-streamable-http/scripts/chatgpt-emulation-wrapper.ts), then update stale ChatGPT-specific comments in the runtime and tests that remain in WS2 scope.

1. Preserve the schema-first boundary explicitly.

Do not fold `handlers.ts`/`tools-list` into manual per-tool helper calls during WS2. If a later step migrates runtime tool registration to `registerAppTool`, it must be done as a generic adapter over the registry/listing path, including [apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts](apps/oak-curriculum-mcp-streamable-http/src/tools-list-override.ts), rather than by introducing a hard-coded runtime inventory.

1. Verify the result at both coupling and architectural levels.

Run the WS2 coupling grep for `openai/widget*`, `text/html+skybridge`, `getToolWidgetUri`, `WidgetResourceOptions`, `ResourceRegistrar`, and related ChatGPT artefacts; then run the normal quality gates and finish with `mcp-reviewer` plus `code-reviewer`. As part of review, explicitly confirm that the runtime still flows from SDK/codegen outputs and that WS2 did not add any new hand-maintained tool inventory.