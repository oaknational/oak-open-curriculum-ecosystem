# Widget CTA Removal and Context-Grounding Resource

**Status**: Merge blocker
**Priority**: High
**Area**: Widget (aggregated tool widget) + MCP resources

## Problem

The widget displays a "Load Oak Knowledge (Click Me)" CTA button that:

1. **Uses outdated terminology** — "Knowledge" refers to the old knowledge graph concept, now replaced by the ontology.
2. **Appears on every tool invocation** — Including on `get-ontology` and `get-help` results themselves.
3. **Is the wrong mechanism** — A widget button that sends a follow-up message to invoke tools is a workaround. MCP has a native primitive for this: resources. The context-grounding content (ontology + help) should be exposed as a single high-priority resource that clients can load before any tool calls.

## Approach

Remove the CTA button entirely. Replace it with a single MCP resource that concatenates the help and ontology content, named and described so that clients (including ChatGPT) load it before taking any other action.

### 1. New resource: "context-grounding" (load-me-first)

Register a new MCP resource that concatenates the ontology and help content into a single payload. The resource name and description must clearly signal that it should be loaded before any other action.

**Resource definition** (in SDK, alongside `ONTOLOGY_RESOURCE` and `DOCUMENTATION_RESOURCES`):

```typescript
export const CONTEXT_GROUNDING_RESOURCE = {
  name: 'load-me-first',
  uri: 'curriculum://context-grounding',
  title: 'Oak Curriculum Context',
  description:
    'Essential curriculum context — load this before any other action. ' +
    'Contains the domain model (key stages, subjects, entity hierarchy, property graph) ' +
    'and tool usage guidance (categories, workflows, tips).',
  mimeType: 'application/json',
};
```

**Content**: Concatenation of `ontologyData` and `toolGuidanceData` into a single JSON object. Both are already available as static imports in the SDK.

**Registration**: Add `registerContextGroundingResource(server)` in `register-resources.ts`, called from `registerAllResources`.

### 2. Remove the widget CTA

- Delete or empty `apps/oak-curriculum-mcp-streamable-http/src/widget-cta/` (registry, html-generators, js-generator, types, index)
- Remove `${generateCtaContainerHtml()}` from the widget header in `aggregated-tool-widget.ts`
- Remove CTA-related JavaScript from `widget-script.ts`
- Update tests

### 3. Existing resources remain

The existing `curriculum://ontology` resource and `docs://` documentation resources stay as they are. The new context-grounding resource is additive — it provides a single-request convenience for clients that want everything up front, while the individual resources remain for clients that prefer granular access.

The `get-ontology` and `get-help` tools also remain — they serve the model-controlled path (ChatGPT calling tools on-demand). The resource serves the application-controlled path (clients pre-injecting context).

## Files to change

### SDK (new resource definition)
- `packages/sdks/oak-curriculum-sdk/src/mcp/context-grounding-resource.ts` — new file: resource definition + content generator
- `packages/sdks/oak-curriculum-sdk/src/mcp/context-grounding-resource.unit.test.ts` — tests
- Export from public API barrel

### HTTP app (registration + CTA removal)
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` — register new resource
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts` — test new resource
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` — remove CTA from header
- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta/` — delete or gut contents
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` — remove CTA JavaScript
- `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts` — remove CTA CSS

## Acceptance criteria

- "Load Oak Knowledge (Click Me)" button no longer appears in the widget
- A `load-me-first` resource appears in `resources/list` with a description that says it should be loaded before any other action
- Reading `curriculum://context-grounding` returns concatenated ontology + help content
- Existing `curriculum://ontology` and `docs://` resources are unaffected
- `get-ontology` and `get-help` tools continue to work as before
- All quality gates pass
