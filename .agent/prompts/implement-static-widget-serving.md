# Prompt: Implement Widget Latency Optimization

> **Task**: Implement ADR-057 - Selective Authentication + Tiny Shell Architecture
>
> **Goal**: Reduce ChatGPT discovery latency from 10-15 seconds to <2 seconds
>
> **Approach**: TDD at all levels, schema-first, comprehensive TSDoc

---

## Context

### Problem Statement

ChatGPT calls `resources/read` for the widget template (`ui://widget/oak-json-viewer.html`) during discovery and tool invocation. Each call goes through Clerk authentication middleware (~170ms), causing ~5+ seconds of latency just for widget fetching.

**User Experience**: 10-15 second timeout, with requests continuing for 30+ seconds total.

### Solution Overview

Two complementary optimizations:

1. **Selective Authentication** — Skip Clerk for public resources (widget, documentation)
2. **Tiny Shell Architecture** — Widget becomes a minimal loader; heavy assets from CDN

### Why This Approach

The `ui://` scheme is a logical identifier, not a web address. ChatGPT uses MCP `resources/read` to fetch widget HTML with `text/html+skybridge` MIME type—this cannot be bypassed. However:

- The widget HTML contains **no user data** — it's a static shell
- User-specific data arrives via `window.openai.toolOutput` at render time
- Therefore, the widget resource is legitimately public

### Key References

**MUST READ before starting work**:

1. **Plan**: `.agent/plans/sdk-and-mcp-enhancements/15-mcp-discovery-latency-optimization.md`
2. **Research**: `research/openai-app-ui.research.md`
3. **Rules**: `.agent/directives-and-memory/rules.md`
4. **Testing Strategy**: `.agent/directives-and-memory/testing-strategy.md`

---

## Mandatory Constraints

### From `rules.md`

1. **TDD at ALL levels** - Write tests FIRST. Red → Green → Refactor.
2. **TSDoc everywhere** - ALL files, modules, functions MUST have comprehensive TSDoc.
3. **No type shortcuts** - Never use `as`, `any`, `!`, or widening types.
4. **Fail fast** - Fail hard with helpful errors, never silently.
5. **Quality gates** - Run ALL gates after changes: `format → type-check → lint → test → build`

### From `testing-strategy.md`

1. **Unit tests** (`*.unit.test.ts`) - Pure functions, NO IO, NO mocks
2. **Integration tests** (`*.integration.test.ts`) - Code units working together, simple mocks injected as arguments
3. **E2E tests** (`*.e2e.test.ts`) - Running system validation

**TDD Sequence**:

```
1. Write E2E tests FIRST (specify new behaviour)
2. Run E2E → FAILS (current system has old behaviour)
3. Implement changes (unit tests → integration tests → wiring)
4. Run E2E → PASSES
5. Refactor (tests stay green)
```

---

## Implementation Sequence (TDD)

### Phase 1: E2E Test Specification (RED)

**Write E2E tests FIRST** specifying the new behaviour.

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/public-resource-auth.e2e.test.ts`

```typescript
/**
 * E2E tests for selective authentication (ADR-057).
 *
 * These tests specify that public resources skip Clerk authentication
 * for latency optimization, while data-fetching tools remain protected.
 */
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';

describe('Public Resource Authentication E2E', () => {
  describe('Widget resource (public)', () => {
    it('resources/read for widget responds without auth token', async () => {
      const { app } = createStubbedHttpApp();

      // Call WITHOUT auth token
      const response = await request(app)
        .post('/mcp')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      expect(response.status).toBe(200);
      const envelope = parseSseEnvelope(response.text);
      expect(envelope.result?.contents?.[0]?.text).toContain('<!doctype html>');
    });
  });

  describe('Documentation resources (public)', () => {
    it('resources/read for docs responds without auth token', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/getting-started.md' },
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Static widget assets', () => {
    it('serves widget JS from /widget/', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app).get('/widget/oak-viewer.js');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('javascript');
    });

    it('serves widget CSS from /widget/', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app).get('/widget/oak-viewer.css');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('css');
    });

    it('static assets have cache headers', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app).get('/widget/oak-viewer.js');

      expect(response.headers['cache-control']).toContain('public');
    });
  });
});
```

**Run E2E → FAILS** (selective auth not implemented yet)

---

### Phase 2: Selective Authentication

#### 2.1 Unit Tests for Public Resource Detection (TDD)

**Test FIRST** - `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.unit.test.ts`:

```typescript
/**
 * Unit tests for public resource detection.
 *
 * Pure function tests with no IO, no side effects, no mocks.
 */
import { describe, it, expect } from 'vitest';
import { isPublicResourceUri, PUBLIC_RESOURCE_URIS } from './public-resources.js';

describe('isPublicResourceUri', () => {
  it('returns true for widget URI', () => {
    expect(isPublicResourceUri('ui://widget/oak-json-viewer.html')).toBe(true);
  });

  it('returns true for documentation URIs', () => {
    expect(isPublicResourceUri('docs://oak/getting-started.md')).toBe(true);
    expect(isPublicResourceUri('docs://oak/tool-guide.md')).toBe(true);
    expect(isPublicResourceUri('docs://oak/widget-guide.md')).toBe(true);
  });

  it('returns false for unknown URIs', () => {
    expect(isPublicResourceUri('ui://other/widget.html')).toBe(false);
    expect(isPublicResourceUri('docs://other/file.md')).toBe(false);
    expect(isPublicResourceUri('')).toBe(false);
  });
});

describe('PUBLIC_RESOURCE_URIS', () => {
  it('includes widget URI', () => {
    expect(PUBLIC_RESOURCE_URIS).toContain('ui://widget/oak-json-viewer.html');
  });

  it('includes documentation URIs', () => {
    expect(PUBLIC_RESOURCE_URIS.some((uri) => uri.startsWith('docs://'))).toBe(true);
  });
});
```

**Run unit test → FAILS** (module doesn't exist)

#### 2.2 Implement Public Resources Module

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts`

```typescript
/**
 * Public resource definitions for selective authentication.
 *
 * Resources listed here skip Clerk authentication because they contain
 * no user-specific data. This is a critical latency optimization for
 * ChatGPT discovery (ADR-057).
 *
 * @module
 */

import { AGGREGATED_TOOL_WIDGET_URI } from '../aggregated-tool-widget.js';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * These resources contain no user-specific data:
 * - **Widget HTML**: Static shell; user data comes from `window.openai.toolOutput`
 * - **Documentation**: Static markdown content
 *
 * Data-fetching tools still require authentication.
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 */
export const PUBLIC_RESOURCE_URIS = [
  AGGREGATED_TOOL_WIDGET_URI,
  'docs://oak/getting-started.md',
  'docs://oak/tool-guide.md',
  'docs://oak/widget-guide.md',
] as const;

/**
 * Checks if a resource URI is public and should skip authentication.
 *
 * @example
 * ```typescript
 * isPublicResourceUri('ui://widget/oak-json-viewer.html'); // true
 * isPublicResourceUri('docs://oak/getting-started.md');    // true
 * isPublicResourceUri('ui://other/widget.html');           // false
 * ```
 *
 * @param uri - The resource URI being requested
 * @returns True if the resource is public and auth can be skipped
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URIS.includes(uri as (typeof PUBLIC_RESOURCE_URIS)[number]);
}
```

**Run unit test → PASSES**

#### 2.3 Update Auth Middleware

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/clerk-middleware.ts`

Find the skip logic and add:

```typescript
import { isPublicResourceUri } from './public-resources.js';

// In shouldSkipClerkMiddleware or equivalent:
if (mcpMethod === 'resources/read') {
  const uri = params?.uri;
  if (typeof uri === 'string' && isPublicResourceUri(uri)) {
    log.debug('clerkMiddleware skipped for public resource', { uri });
    return true;
  }
}
```

---

### Phase 3: Tiny Shell Architecture

#### 3.1 Refactor Widget HTML

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

Transform from inline content to tiny shell:

```typescript
/**
 * Widget assets base URL.
 *
 * Set during server initialization from `VERCEL_URL` or fallback host.
 */
let widgetAssetsBaseUrl = 'http://localhost:3333';

/**
 * Sets the base URL for widget static assets.
 *
 * Called during server initialization to configure absolute URLs
 * for CSS/JS references in the widget shell.
 *
 * @param baseUrl - Full base URL (e.g., "https://my-app.vercel.app")
 */
export function setWidgetAssetsBaseUrl(baseUrl: string): void {
  widgetAssetsBaseUrl = baseUrl;
}

/**
 * Returns the widget HTML shell.
 *
 * This is a tiny (~500 byte) document that loads the actual widget
 * code from Vercel CDN. The shell:
 *
 * 1. Loads CSS from static assets
 * 2. Loads JS bundle from static assets
 * 3. Provides mount point for React app
 *
 * The JS bundle reads `window.openai.toolOutput` for user data.
 *
 * @returns Minimal HTML shell string
 */
export function getWidgetHtml(): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="stylesheet" href="${widgetAssetsBaseUrl}/widget/oak-viewer.css" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${widgetAssetsBaseUrl}/widget/oak-viewer.js"></script>
  </body>
</html>`;
}
```

#### 3.2 Initialize Base URL in Application

**File**: `apps/oak-curriculum-mcp-streamable-http/src/application.ts`

```typescript
import { setWidgetAssetsBaseUrl } from './aggregated-tool-widget.js';

// In initialization:
function resolveBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return 'http://localhost:3333';
}

setWidgetAssetsBaseUrl(resolveBaseUrl());
```

#### 3.3 Create Widget Bundle

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/main.ts`

```typescript
/**
 * Widget entry point.
 *
 * Initializes the Oak JSON Viewer widget by reading tool output
 * from `window.openai.toolOutput` and rendering the appropriate view.
 *
 * @module
 */

// Extract current inline JS from AGGREGATED_TOOL_WIDGET_HTML
// and refactor into proper module structure
```

#### 3.4 Build Configuration

**File**: `apps/oak-curriculum-mcp-streamable-http/vite.widget.config.ts`

```typescript
/**
 * Vite configuration for widget bundle.
 *
 * Builds the widget JS/CSS to `public/widget/` for Vercel CDN serving.
 */
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public/widget',
    emptyDirBeforeWrite: true,
    rollupOptions: {
      input: 'src/widget/main.ts',
      output: {
        entryFileNames: 'oak-viewer.js',
        assetFileNames: 'oak-viewer.[ext]',
      },
    },
  },
});
```

**File**: `apps/oak-curriculum-mcp-streamable-http/package.json`

```json
{
  "scripts": {
    "build:widget": "vite build --config vite.widget.config.ts",
    "build": "pnpm build:widget && tsup"
  }
}
```

#### 3.5 Vercel Cache Headers

**File**: `apps/oak-curriculum-mcp-streamable-http/vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "express",
  "headers": [
    {
      "source": "/widget/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800"
        }
      ]
    }
  ]
}
```

#### 3.6 Git Ignore Generated Assets

**File**: `apps/oak-curriculum-mcp-streamable-http/.gitignore`

```
# Generated widget bundle (built from src/widget/)
public/widget/
```

---

### Phase 4: E2E Verification (GREEN)

**Run E2E tests → PASSES** (system now has new behaviour)

---

### Phase 5: Documentation

1. **Create ADR-057**: `docs/architecture/architectural-decisions/057-selective-auth-widget-optimization.md`
2. **Update ADR Index**: Add entry
3. **Update MCP README**: Add Widget Architecture section

---

## Files to Modify

| File | Change |
| ---- | ------ |
| `src/auth/clerk-middleware.ts` | Add public resource skip logic |
| `src/aggregated-tool-widget.ts` | Refactor to tiny shell + base URL |
| `src/register-resources.ts` | Update widget to use `getWidgetHtml()` |
| `src/application.ts` | Initialize widget base URL |
| `vercel.json` | Add cache headers for static assets |
| `package.json` | Add `build:widget` script |

## Files to Create

| File | Purpose |
| ---- | ------- |
| `src/auth/public-resources.ts` | Public resource URI definitions |
| `src/auth/public-resources.unit.test.ts` | Unit tests |
| `src/widget/main.ts` | Widget bundle entry point |
| `src/widget/styles.css` | Widget styles |
| `vite.widget.config.ts` | Widget bundler configuration |
| `e2e-tests/public-resource-auth.e2e.test.ts` | E2E tests |
| `.gitignore` | Ignore generated widget |
| `ADR-057` | Document decision |

---

## Quality Gates Checklist

Run after ALL changes:

```bash
pnpm format
pnpm type-check
pnpm lint
pnpm test
pnpm build
```

ALL must pass before considering work complete.

---

## Definition of Done

- [ ] E2E tests specify and verify selective auth behaviour
- [ ] Unit tests for `isPublicResourceUri()` pass
- [ ] Widget `resources/read` skips Clerk auth
- [ ] Documentation `resources/read` skips Clerk auth
- [ ] Widget HTML is tiny shell (~500 bytes)
- [ ] Widget JS/CSS served from `public/widget/`
- [ ] Static assets have CDN cache headers
- [ ] ADR-057 created and indexed
- [ ] MCP README updated
- [ ] ALL quality gates pass
- [ ] Comprehensive TSDoc on all files
- [ ] Deploy and verify latency < 2 seconds in ChatGPT

---

## Success Metrics

| Metric               | Before | Target  |
| -------------------- | ------ | ------- |
| Widget fetch latency | ~170ms | <50ms   |
| 29 tool widget loads | ~4.9s  | <1.5s   |
| Total discovery time | 5-10s  | <2s     |
| ChatGPT timeout      | Yes    | No      |

---

## Notes

- The widget receives data via `window.openai.toolOutput`, NOT from the HTML itself
- Only data-fetching **tool execution** needs authentication
- Static resources (widget, docs, assets) contain no user data → public
- CSP metadata stays on the MCP resource `_meta` (not moving to tool `_meta`)
- Use `VERCEL_URL` for reliable base URL on all deployment types

## Regularly Re-read Foundation Documents

Per project rules, during implementation regularly re-read:

1. `.agent/directives-and-memory/rules.md`
2. `.agent/directives-and-memory/testing-strategy.md`
3. `research/openai-app-ui.research.md`

Ask at each phase: **Are we solving the right problem, at the right layer?**
