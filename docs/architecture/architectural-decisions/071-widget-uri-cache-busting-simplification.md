# 071: Widget URI Cache-Busting Simplification

## Status

Accepted

## Context

ChatGPT Apps require cache-busting for widget resources to ensure users see updated HTML/CSS/JS instead of stale cached versions. Our initial implementation attempted runtime cache-busting via query parameters (`?v=<sha>`), but this created a URI mismatch between tool descriptors (generated at build time) and widget resource registration (at runtime).

OpenAI's best practice states: "When you change your widget's HTML/JS/CSS in a breaking way, give the template a new URI (or use a new file name)."

### Previous Approach

- Tool descriptors (generated): `ui://widget/oak-json-viewer.html`
- Widget resource (runtime): `ui://widget/oak-json-viewer.html?v=abc12345`
- **Problem**: URI mismatch caused ChatGPT to fail loading widgets with MCP error `-32602: Resource not found`

### Attempted Fixes

1. Register widget at both URIs → defeats cache-busting purpose
2. Transform tool descriptors at runtime → adds complexity, violates schema-first execution

## Decision

**Generate a unique widget URI at type-generation time** by embedding a hash in the filename.

- **Format**: `ui://widget/oak-json-viewer-<hash>.html`
- **Hash source**: SHA-256 of `Date.now()` (first 8 chars)
- **When generated**: During `pnpm type-gen`
- **Where defined**: `type-gen/typegen/cross-domain-constants.ts`

All generated tools reference this hashed URI in `_meta['openai/outputTemplate']`. The widget resource is registered at the same URI. No runtime modification needed.

## Consequences

### Positive

- ✅ **Eliminates URI mismatch**: Tools and resource use identical URI
- ✅ **Simpler architecture**: No runtime cache-busting logic
- ✅ **Aligns with OpenAI guidance**: "give the template a new URI"
- ✅ **Works identically** in local dev and production
- ✅ **Natural cache-busting**: New build = new hash = new URI
- ✅ **Schema-first compliant**: No runtime modification of generated artifacts

### Trade-offs

- ⚠️ **Frequent local changes**: Every `pnpm type-gen` creates a new URI
  - Mitigation: This is actually beneficial for local dev testing
- ⚠️ **URI changes on every build**: Even if widget content unchanged
  - Mitigation: Acceptable trade-off for simplicity; ChatGPT handles this gracefully

### Neutral

- ℹ️ Removes dependency on Vercel Git SHA environment variables
- ℹ️ Deletes `widget-uri.ts` and related helper functions

## Implementation

### Type-Gen Layer (Generator Code)

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.ts`

```typescript
import { createHash } from 'node:crypto';

function generateWidgetUriHash(): string {
  const timestamp = Date.now().toString();
  const hash = createHash('sha256').update(timestamp).digest('hex');
  return hash.slice(0, 8);
}

export const BASE_WIDGET_URI = `ui://widget/oak-json-viewer-${generateWidgetUriHash()}.html`;
```

### Generated Code (SDK Output)

**File**: `packages/sdks/oak-curriculum-sdk/src/types/generated/widget-constants.ts`

```typescript
export const WIDGET_URI = 'ui://widget/oak-json-viewer-abc12345.html' as const;
```

### HTTP Server (Runtime Code)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

```typescript
export function getToolWidgetUri(): string {
  return WIDGET_URI; // No runtime transformation needed
}
```

## Verification

All quality gates passing after implementation:

- ✅ Unit tests verify hash generation format
- ✅ Integration tests dynamically find hashed widget URI
- ✅ E2E tests verify widget loads correctly
- ✅ Type-check passes
- ✅ Build passes

## References

- [OpenAI Apps SDK: Build your MCP server](https://developers.openai.com/apps-sdk/build/mcp-server)
- ADR-058: MCP Tool Widget Integration
- Schema-First MCP Execution Directive

## See Also

- [Implementation Plan](.agent/prompts/widget-uri-cache-busting-simplification.prompt.md)
