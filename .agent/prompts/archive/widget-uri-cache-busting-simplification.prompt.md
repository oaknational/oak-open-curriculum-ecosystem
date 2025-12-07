# Widget URI Cache-Busting Simplification

## Context

### Current Problem

The MCP HTTP server is experiencing a **widget URI mismatch** where:

- **Tools reference**: `ui://widget/oak-json-viewer.html` (base URI, generated at build time)
- **Resource registered at**: `ui://widget/oak-json-viewer.html?v=abc12345` (with runtime cache-buster from `VERCEL_GIT_COMMIT_SHA`)

This causes ChatGPT to fail loading the widget with error:

```
MCP error -32602: Resource ui://widget/oak-json-viewer.html not found
```

### Root Cause

The current architecture attempts to apply cache-busting at **runtime** by appending a query parameter, but:

1. Tool descriptors are **generated at build time** with the base URI
2. Widget resource is **registered at runtime** with a different URI (includes `?v=<sha>`)
3. ChatGPT tries to fetch the URI from the tool descriptor, which doesn't exist

### OpenAI Apps SDK Cache-Busting Best Practice

From OpenAI documentation ([Build your MCP server](https://developers.openai.com/apps-sdk/build/mcp-server)):

> **Best practice:** When you change your widget's HTML/JS/CSS in a breaking way, **give the template a new URI (or use a new file name)** so ChatGPT always loads the updated bundle instead of a cached one.

The canonical approach is to **change the URI itself**, not use query parameters.

## Proposed Solution

**Simplify cache-busting by generating a hashed URI at type-generation time**, eliminating all runtime complexity.

### High-Level Approach

1. **At type-gen time**: Generate a deterministic hash (e.g., SHA-256 of `Date.now()`)
2. **Generate widget URI**: `ui://widget/oak-json-viewer-<hash>.html` (e.g., `oak-json-viewer-abc12345.html`)
3. **Use everywhere**: All generated tools reference this hashed URI in `_meta['openai/outputTemplate']`
4. **Register once**: Widget resource registered at the same hashed URI
5. **Remove runtime logic**: No more `widgetCacheBuster`, no Vercel Git SHA handling

### Benefits

- ✅ **Simple**: One constant, generated once at build time
- ✅ **No runtime complexity**: No URI transformation needed
- ✅ **Works identically** in local dev and production
- ✅ **Natural cache-busting**: New build → new hash → new URI → ChatGPT fetches fresh widget
- ✅ **Aligns with OpenAI best practice**: "give the template a new URI"

### How It Works in Local Development

Every time you run `pnpm type-gen`:

1. New hash generated (based on `Date.now()`)
2. New widget URI: `ui://widget/oak-json-viewer-<newhash>.html`
3. Tools reference new URI
4. Widget resource registered at new URI
5. ChatGPT fetches new widget (cache naturally busted)

No special handling needed for local vs. production.

## Implementation Plan

### Phase 1: Generate Hashed URI at Type-Gen Time

#### 1.1 Update `cross-domain-constants.ts`

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.ts`

**Current**:

```typescript
export const BASE_WIDGET_URI = 'ui://widget/oak-json-viewer.html';
```

**New**:

```typescript
import { createHash } from 'node:crypto';

/**
 * Generates deterministic cache-busting hash for widget URI.
 *
 * Uses SHA-256 hash of current timestamp to ensure each build
 * produces a unique widget URI, forcing ChatGPT to reload
 * the widget bundle instead of using a stale cached version.
 *
 * @returns First 8 characters of SHA-256 hash (e.g., "abc12345")
 */
function generateWidgetUriHash(): string {
  const timestamp = Date.now().toString();
  const hash = createHash('sha256').update(timestamp).digest('hex');
  return hash.slice(0, 8);
}

/**
 * Base widget URI with cache-busting hash.
 *
 * Generated at type-gen time to ensure all tools and widget resource
 * registration use the same URI. New builds get new hashes, naturally
 * busting ChatGPT's widget cache.
 *
 * Format: ui://widget/oak-json-viewer-<hash>.html
 * Example: ui://widget/oak-json-viewer-abc12345.html
 *
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (cache-busting best practice)
 */
export const BASE_WIDGET_URI = `ui://widget/oak-json-viewer-${generateWidgetUriHash()}.html`;
```

#### 1.2 Update Generated Constants File

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/generate-widget-constants.ts`

Update TSDoc to reflect the new approach:

```typescript
/**
 * Base URI for the Oak JSON viewer widget resource.
 *
 * This widget renders tool output with Oak branding, logo, and styling.
 * All generated tools reference this URI in their \`_meta['openai/outputTemplate']\` field.
 *
 * **Cache-Busting Strategy**: The URI includes a hash generated at type-gen time.
 * Each build produces a new hash, naturally busting ChatGPT's widget cache.
 * This aligns with OpenAI's best practice: "give the template a new URI".
 *
 * **Format**: \`ui://widget/oak-json-viewer-<hash>.html\`
 * **Example**: \`ui://widget/oak-json-viewer-abc12345.html\`
 *
 * @see type-gen/typegen/cross-domain-constants.ts - Source of truth
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (OpenAI cache-busting guidance)
 */
export const WIDGET_URI = 'ui://widget/oak-json-viewer-abc12345.html' as const;
```

### Phase 2: Rename and Simplify HTTP Server Functions

#### 2.1 Rename `getAggregatedToolWidgetUri` → `getToolWidgetUri`

**Rationale**: This function applies to **all tools**, not just aggregated ones. The name should reflect this.

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Changes**:

1. Rename function: `getAggregatedToolWidgetUri` → `getToolWidgetUri`
2. **Remove cache-buster parameter** (no longer needed)
3. Update TSDoc

**Before**:

```typescript
export function getAggregatedToolWidgetUri(cacheBuster?: string): string {
  return getWidgetUri(WIDGET_URI, cacheBuster);
}
```

**After**:

```typescript
/**
 * Returns the widget URI from the SDK.
 *
 * This is a simple passthrough that makes the widget URI
 * available to the HTTP server's resource registration.
 * The URI already includes a cache-busting hash generated
 * at type-gen time.
 *
 * @returns Widget URI with embedded cache-busting hash
 * @example "ui://widget/oak-json-viewer-abc12345.html"
 */
export function getToolWidgetUri(): string {
  return WIDGET_URI;
}
```

#### 2.2 Delete `widget-uri.ts` and Related Files

**Files to delete**:

- `apps/oak-curriculum-mcp-streamable-http/src/widget-uri.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-uri.unit.test.ts`

**Rationale**: These files implemented runtime cache-busting logic that is no longer needed.

### Phase 3: Remove Runtime Configuration

#### 3.1 Remove `widgetCacheBuster` from RuntimeConfig

**File**: `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts`

**Remove**:

```typescript
readonly widgetCacheBuster?: string;
```

And the line that populates it:

```typescript
widgetCacheBuster: source.VERCEL_GIT_COMMIT_SHA?.slice(0, 8),
```

**Update TSDoc**: Remove all references to `widgetCacheBuster` and Vercel Git SHA.

#### 3.2 Update Widget Resource Registration

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

**Before**:

```typescript
export function registerWidgetResource(server: McpServer, config: RuntimeConfig): void {
  const widgetUri = getAggregatedToolWidgetUri(config.widgetCacheBuster);
  server.registerResource(
    'oak-json-viewer',
    widgetUri,
    // ...
```

**After**:

```typescript
export function registerWidgetResource(server: McpServer, config: RuntimeConfig): void {
  const widgetUri = getToolWidgetUri(); // No runtime parameter needed
  server.registerResource(
    'oak-json-viewer',
    widgetUri,
    // ...
```

**Update TSDoc**:

```typescript
/**
 * Registers the Oak JSON viewer widget as an MCP resource.
 *
 * The widget URI includes a cache-busting hash generated at type-gen time.
 * Each build produces a new hash, ensuring ChatGPT fetches the latest
 * widget bundle instead of using a stale cached version.
 *
 * This aligns with OpenAI's best practice: "give the template a new URI"
 * whenever widget HTML/CSS/JS changes.
 *
 * @param server - MCP server instance
 * @param config - Runtime configuration (widgetCacheBuster removed)
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (cache-busting guidance)
 */
```

### Phase 4: Update Tests

#### 4.1 Update Integration Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts`

Remove any test setup that passes `widgetCacheBuster`:

**Before**:

```typescript
const config = {
  widgetCacheBuster: undefined, // Local dev - no cache busting
  // ...
};
```

**After**:

```typescript
const config = {
  // widgetCacheBuster removed
  // ...
};
```

Update test assertions to expect hashed widget URIs:

```typescript
// Assert widget URI includes hash (format: oak-json-viewer-abc12345.html)
expect(widgetResource.uri).toMatch(/^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/);
```

#### 4.2 Update E2E Tests

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-metadata.e2e.test.ts`
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts`

Update assertions to expect hashed widget URIs in tool descriptors:

```typescript
// Verify all tools reference the hashed widget URI
for (const tool of tools) {
  expect(tool._meta?.['openai/outputTemplate']).toMatch(
    /^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/,
  );
}
```

### Phase 5: Documentation

#### 5.1 Create ADR-071

**File**: `docs/architecture/decisions/071-widget-uri-cache-busting-simplification.md`

**Template**:

```markdown
# 071: Widget URI Cache-Busting Simplification

## Status

Accepted

## Context

ChatGPT Apps require cache-busting for widget resources to ensure users see updated HTML/CSS/JS instead of stale cached versions. Our initial implementation attempted runtime cache-busting via query parameters (`?v=<sha>`), but this created a URI mismatch between tool descriptors (generated at build time) and widget resource registration (at runtime).

OpenAI's best practice states: "When you change your widget's HTML/JS/CSS in a breaking way, give the template a new URI (or use a new file name)."

### Previous Approach

- Tool descriptors (generated): `ui://widget/oak-json-viewer.html`
- Widget resource (runtime): `ui://widget/oak-json-viewer.html?v=abc12345`
- **Problem**: URI mismatch caused ChatGPT to fail loading widgets

### Attempted Fixes

1. Register widget at both URIs → defeats cache-busting purpose
2. Transform tool descriptors at runtime → adds complexity, violates schema-first execution

## Decision

**Generate a unique widget URI at type-generation time** by embedding a hash in the filename.

- **Format**: `ui://widget/oak-json-viewer-<hash>.html`
- **Hash source**: SHA-256 of \`Date.now()\` (first 8 chars)
- **When generated**: During \`pnpm type-gen\`
- **Where defined**: \`type-gen/typegen/cross-domain-constants.ts\`

All generated tools reference this hashed URI in \`\_meta['openai/outputTemplate']\`. The widget resource is registered at the same URI. No runtime modification needed.

## Consequences

### Positive

- ✅ **Eliminates URI mismatch**: Tools and resource use identical URI
- ✅ **Simpler architecture**: No runtime cache-busting logic
- ✅ **Aligns with OpenAI guidance**: "give the template a new URI"
- ✅ **Works identically** in local dev and production
- ✅ **Natural cache-busting**: New build = new hash = new URI
- ✅ **Schema-first compliant**: No runtime modification of generated artifacts

### Negative

- ⚠️ **Frequent local changes**: Every \`pnpm type-gen\` creates a new URI
  - Mitigation: This is actually beneficial for local dev testing
- ⚠️ **URI changes on every build**: Even if widget content unchanged
  - Mitigation: Acceptable tradeoff for simplicity; ChatGPT handles this gracefully

### Neutral

- ℹ️ Removes dependency on Vercel Git SHA environment variables
- ℹ️ Deletes \`widget-uri.ts\` and related helper functions

## Implementation

See implementation plan in \`.agent/prompts/widget-uri-cache-busting-simplification.prompt.md\`.

## References

- [OpenAI Apps SDK: Build your MCP server](https://developers.openai.com/apps-sdk/build/mcp-server)
- ADR-058: MCP Tool Widget Integration
- Schema-First MCP Execution Directive
```

#### 5.2 Update ADR Index

**File**: `docs/architecture/README.md`

Add entry for ADR-071 in the index.

#### 5.3 Update Authored Documentation

**File**: `apps/oak-curriculum-mcp-streamable-http/README.md` (or similar)

Add section explaining widget cache-busting strategy:

```markdown
### Widget Cache-Busting

The MCP server serves an Oak-branded widget for rendering tool output in ChatGPT. To ensure users always see the latest widget version, the URI includes a **cache-busting hash** generated at build time.

**Format**: `ui://widget/oak-json-viewer-<hash>.html`  
**Example**: `ui://widget/oak-json-viewer-abc12345.html`

Each build produces a new hash, naturally busting ChatGPT's widget cache. This aligns with [OpenAI's best practice](https://developers.openai.com/apps-sdk/build/mcp-server): "give the template a new URI" when widget code changes.

**Implementation**: The hash is generated during `pnpm type-gen` and embedded in all generated tool descriptors. No runtime configuration needed.

See ADR-071 for architectural details.
```

## Foundation Document Alignment

This solution strictly adheres to all foundation documents:

### @[.agent/directives-and-memory/rules.md]

- ✅ **KISS**: Simplest solution - generate hash once at build time
- ✅ **No compatibility layers**: Removes runtime transformation logic
- ✅ **Fail-fast**: URI mismatch eliminated entirely
- ✅ **Compiler-time types**: Hash baked into generated constants
- ✅ **Single source of truth**: `cross-domain-constants.ts`

### @[.agent/directives-and-memory/schema-first-execution.md]

- ✅ **Cardinal Rule**: All tool behavior driven by generated artifacts
- ✅ **No hand-authoring**: Widget URI generated, not manually set
- ✅ **No runtime modification**: Tools use exactly what was generated
- ✅ **Generator-first mindset**: Hash generation happens in type-gen

### @[.agent/directives-and-memory/testing-strategy.md]

- ✅ **TDD at all levels**: Unit tests for hash generation, integration tests for resource registration
- ✅ **Test behavior**: Verify new builds produce new URIs (cache-busting works)
- ✅ **Simple mocks**: No complex runtime mocking needed

## Testing Strategy

### Unit Tests

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.unit.test.ts` (create)

```typescript
describe('generateWidgetUriHash', () => {
  it('should generate 8-character hex hash', () => {
    const hash = generateWidgetUriHash();
    expect(hash).toMatch(/^[a-f0-9]{8}$/);
  });

  it('should generate different hashes for different timestamps', () => {
    const hash1 = generateWidgetUriHash();
    // Wait a tick
    const hash2 = generateWidgetUriHash();
    expect(hash1).not.toBe(hash2);
  });
});

describe('BASE_WIDGET_URI', () => {
  it('should have format ui://widget/oak-json-viewer-<hash>.html', () => {
    expect(BASE_WIDGET_URI).toMatch(/^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/);
  });
});
```

### Integration Tests

Update existing tests in `register-resources.integration.test.ts`:

```typescript
it('should register widget resource with hashed URI', () => {
  const resources = server.getResourceTemplates();
  const widgetResource = resources.find((r) => r.name === 'oak-json-viewer');

  expect(widgetResource).toBeDefined();
  expect(widgetResource.uri).toMatch(/^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/);
});

it('should use same hashed URI in all tool descriptors', () => {
  const tools = listUniversalTools();
  const widgetUri = getToolWidgetUri();

  for (const tool of tools) {
    expect(tool._meta?.['openai/outputTemplate']).toBe(widgetUri);
  }
});
```

### E2E Tests

Update widget E2E tests to verify cache-busting behavior:

```typescript
it('should include cache-busting hash in widget URI', async () => {
  const response = await listResources();
  const widget = response.resources.find((r) => r.name === 'oak-json-viewer');

  expect(widget.uri).toMatch(/^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/);
});
```

## Verification Plan

After implementation, verify:

1. ✅ Run `pnpm type-gen` twice, confirm different hashes generated
2. ✅ Run `pnpm build && pnpm type-check` - no errors
3. ✅ Run `pnpm test` - all tests pass
4. ✅ Run `pnpm test:e2e` - widget resource loads correctly
5. ✅ Run `pnpm test:ui` - Playwright tests pass
6. ✅ Deploy to Vercel, test in ChatGPT - widget loads without errors
7. ✅ Run `pnpm type-gen` locally, deploy again - new widget URI, cache busted

## Success Criteria

- [ ] Widget URI includes 8-character hash (e.g., `oak-json-viewer-abc12345.html`)
- [ ] All generated tools reference the hashed widget URI
- [ ] Widget resource registered at the same hashed URI
- [ ] No `widgetCacheBuster` in runtime config
- [ ] All `widget-uri.ts` files deleted
- [ ] All tests passing (unit, integration, E2E)
- [ ] ADR-071 written
- [ ] TSDoc updated
- [ ] Authored docs updated
- [ ] ChatGPT loads widget successfully (no 404 errors)
- [ ] New builds produce new widget URIs (cache-busting verified)

## Files to Modify

### Generate Hash at Type-Gen Time

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.ts` ← Add hash generation
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/generate-widget-constants.ts` ← Update TSDoc

### HTTP Server Simplification

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` ← Rename function, remove cache-buster param
- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts` ← Remove cache-buster usage
- `apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts` ← Remove widgetCacheBuster property
- **DELETE**: `apps/oak-curriculum-mcp-streamable-http/src/widget-uri.ts`
- **DELETE**: `apps/oak-curriculum-mcp-streamable-http/src/widget-uri.unit.test.ts`

### Tests

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts` ← Update assertions
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-metadata.e2e.test.ts` ← Update assertions
- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts` ← Update assertions
- **CREATE**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/cross-domain-constants.unit.test.ts`

### Documentation

- **CREATE**: `docs/architecture/decisions/071-widget-uri-cache-busting-simplification.md`
- `docs/architecture/README.md` ← Add ADR-071 to index
- `apps/oak-curriculum-mcp-streamable-http/README.md` ← Add cache-busting docs

## Notes

- This approach is **simpler** than runtime cache-busting
- Aligns with **OpenAI's documented best practice**
- Follows **schema-first execution** (no runtime modification)
- Works **identically** in all environments
- **Natural cache-busting**: new build = new URI, no special logic needed
