# MCP Discovery Latency Optimization Plan

> **Status**: Ready for implementation
>
> **Problem**: ChatGPT discovery/refresh taking 10-15 seconds to timeout, requests continuing for 30+ seconds
>
> **Root Cause**: Widget fetched via MCP `resources/read` with Clerk auth (29 tools × ~170ms = ~5s latency)
>
> **Solution**: Selective authentication + tiny shell architecture

---

## Executive Summary

ChatGPT connects to our MCP server and makes ~28 discovery requests. The conditional Clerk middleware (ADR-056) correctly skips auth for discovery methods (`initialize`, `tools/list`, etc.), but **60+ `resources/read` calls** for the widget template go through Clerk authentication at ~170ms each.

**The fix has two parts:**

1. **Skip auth for public resources** — Widget HTML contains no user data; it's a static shell
2. **Tiny shell + CDN assets** — Widget becomes a minimal loader; heavy JS/CSS served from Vercel CDN

---

## Background: Why `ui://` Cannot Be Replaced with HTTPS URLs

The `ui://` scheme is a **logical identifier** within MCP, not a web address. ChatGPT uses it to issue `resources/read` calls to fetch widget HTML with `text/html+skybridge` MIME type. This MIME type signals ChatGPT to inject `window.openai`.

**Rejected approaches:**

- Direct HTTPS URLs in `outputTemplate` — Won't work; ChatGPT won't inject `window.openai`
- Serving widget HTML from static files — Can't bypass MCP resource mechanism

**The MCP resource is unavoidable, but we can make it fast.**

---

## Investigation Findings

### Runtime Log Analysis (2025-12-01)

**Deployment**: `dpl_4T8W9cf9W97hsLaQx9h1CJpJ1mWK`

| Metric                            | Value            |
| --------------------------------- | ---------------- |
| Total requests from `openai-mcp`  | 72+              |
| Unique HTTP request IDs           | 48               |
| Time span (first to last request) | **37.4 seconds** |
| User-perceived timeout            | 10-15 seconds    |

### Request Breakdown by MCP Method

| MCP Method                  | Count  | Clerk Skipped? | Avg Duration |
| --------------------------- | ------ | -------------- | ------------ |
| `resources/read`            | **60** | ❌ No          | ~164ms       |
| `initialize`                | 6      | ✅ Yes         | ~20ms        |
| `tools/list`                | 3      | ✅ Yes         | ~3ms         |
| `notifications/initialized` | 3      | ✅ Yes         | ~3ms         |

### Key Finding

All 29 tools reference the widget via `_meta["openai/outputTemplate"]`. ChatGPT calls `resources/read` for the widget when displaying each tool. Each call goes through Clerk (~170ms).

The widget is **static HTML that contains no user data**. User-specific data comes from `window.openai.toolOutput` at render time.

---

## Solution: Selective Auth + Tiny Shell Architecture

### Part 1: Selective Authentication

**Principle**: Only data-fetching tools need authentication. Static resources don't.

| Resource Type        | Contains User Data? | Needs Auth? |
| -------------------- | ------------------- | ----------- |
| Widget HTML shell    | No                  | **No**      |
| Documentation        | No                  | **No**      |
| Static assets (CDN)  | No                  | **No**      |
| Tool execution       | Yes                 | **Yes**     |
| API data responses   | Yes                 | **Yes**     |

**Implementation**: Add widget and documentation URIs to public resources list in auth middleware.

### Part 2: Tiny Shell + CDN Assets (from research)

Per the OpenAI Apps SDK best practice:

```
┌─────────────────────────────────────────────────────────────────┐
│  ui://widget/oak-json-viewer.html  (MCP resource - tiny shell)  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  <!doctype html>                                          │  │
│  │  <html>                                                   │  │
│  │    <head>                                                 │  │
│  │      <link href="https://host/widget/app.css" />          │  │ ← CDN-cached
│  │    </head>                                                │  │
│  │    <body>                                                 │  │
│  │      <div id="root"></div>                                │  │
│  │      <script src="https://host/widget/app.js"></script>   │  │ ← CDN-cached
│  │    </body>                                                │  │
│  │  </html>                                                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

**Benefits:**

- MCP resource stays tiny (~500 bytes) — fast even without caching
- Heavy JS/CSS served from Vercel `public/` with CDN caching (~5-20ms)
- Browser caches static assets across sessions
- Versioned bundles enable safe deployments

### Architecture After Implementation

```
BEFORE (All via Clerk - SLOW):
┌─────────────┐     POST /mcp          ┌─────────────┐     ┌─────────────┐
│   ChatGPT   │ ──────────────────────►│   Express   │────►│    Clerk    │ ~170ms
│             │   (resources/read)     │   Server    │     │  Middleware │
└─────────────┘                        └─────────────┘     └──────┬──────┘
                                                                  │
                                                                  ▼
                                                           Widget HTML (large)

AFTER (Selective Auth + CDN - FAST):
┌─────────────┐     POST /mcp          ┌─────────────┐
│   ChatGPT   │ ──────────────────────►│   Express   │ ~20ms (no Clerk for public)
│             │   (resources/read)     │   Server    │
└─────────────┘                        └─────────────┘
       │                                      │
       │                                      ▼
       │                               Widget Shell (~500 bytes)
       │
       │              GET /widget/*.js     ┌─────────────┐
       └──────────────────────────────────►│ Vercel CDN  │ ~5-20ms (cached)
                                           │  (public/)  │
                                           └─────────────┘
```

### Expected Impact

| Metric               | Before       | After        | Improvement |
| -------------------- | ------------ | ------------ | ----------- |
| Widget fetch latency | ~170ms       | ~20-50ms     | **3-8×**    |
| 29 tool widget loads | ~4.9s        | ~600-1500ms  | **3-8×**    |
| Static asset loads   | N/A          | ~5-20ms      | CDN cached  |
| Discovery + widgets  | 5-10s        | <2s          | **5×**      |
| User timeout         | Yes (10-15s) | No           | ✅          |

---

## Implementation Plan

### Phase 1: Selective Authentication

#### 1.1 Define Public Resources

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.ts`

```typescript
/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * These resources contain no user-specific data:
 * - Widget HTML is a static shell; user data comes from `window.openai.toolOutput`
 * - Documentation is static markdown content
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 */
import { AGGREGATED_TOOL_WIDGET_URI } from '../aggregated-tool-widget.js';

export const PUBLIC_RESOURCE_URIS = [
  AGGREGATED_TOOL_WIDGET_URI,
  'docs://oak/getting-started.md',
  'docs://oak/tool-guide.md',
  'docs://oak/widget-guide.md',
] as const;

/**
 * Checks if a resource URI is public and should skip authentication.
 *
 * @param uri - The resource URI being requested
 * @returns True if the resource is public
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URIS.includes(uri as (typeof PUBLIC_RESOURCE_URIS)[number]);
}
```

#### 1.2 Update Auth Middleware

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/clerk-middleware.ts`

Add to the skip logic:

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

### Phase 2: Tiny Shell Architecture

#### 2.1 Refactor Widget to Tiny Shell

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

Transform the widget HTML from inline content to a shell that loads external assets:

```typescript
/**
 * Base URL for static widget assets.
 *
 * Constructed at server initialization from `VERCEL_URL` or request host.
 * Used to build absolute URLs for CSS/JS in the widget shell.
 */
let widgetAssetsBaseUrl = 'http://localhost:3333';

/**
 * Sets the base URL for widget static assets.
 *
 * Called during server initialization with the resolved host.
 *
 * @param baseUrl - The base URL (e.g., "https://my-app.vercel.app")
 */
export function setWidgetAssetsBaseUrl(baseUrl: string): void {
  widgetAssetsBaseUrl = baseUrl;
}

/**
 * Returns the widget HTML shell.
 *
 * This is a tiny (~500 byte) HTML document that:
 * 1. Loads CSS from Vercel CDN
 * 2. Loads JS bundle from Vercel CDN
 * 3. Provides a mount point for the React app
 *
 * The JS bundle handles all rendering using `window.openai.toolOutput`.
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

#### 2.2 Create Widget Bundle

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/main.ts`

```typescript
/**
 * Widget entry point.
 *
 * This module initializes the widget UI by:
 * 1. Reading tool output from `window.openai.toolOutput`
 * 2. Rendering the appropriate view based on the data
 *
 * Bundled to `public/widget/oak-viewer.js` at build time.
 */

// Widget initialization and rendering logic
// (Extract from current inline HTML)
```

#### 2.3 Build Pipeline

**File**: `apps/oak-curriculum-mcp-streamable-http/package.json`

```json
{
  "scripts": {
    "build:widget": "vite build --config vite.widget.config.ts",
    "build": "pnpm build:widget && tsup"
  }
}
```

**File**: `apps/oak-curriculum-mcp-streamable-http/vite.widget.config.ts`

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'public/widget',
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

#### 2.4 Vercel Static Configuration

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

### Phase 3: CSP Configuration

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

Update widget resource `_meta` with CSP:

```typescript
const WIDGET_CSP = {
  resource_domains: [
    `${BASE_URL}`,  // Own static assets
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
  ],
  connect_domains: [
    'https://*.thenational.academy',
  ],
} as const;
```

---

## Testing (TDD)

### Unit Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/src/auth/public-resources.unit.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { isPublicResourceUri } from './public-resources.js';

describe('isPublicResourceUri', () => {
  it('returns true for widget URI', () => {
    expect(isPublicResourceUri('ui://widget/oak-json-viewer.html')).toBe(true);
  });

  it('returns true for documentation URIs', () => {
    expect(isPublicResourceUri('docs://oak/getting-started.md')).toBe(true);
  });

  it('returns false for unknown URIs', () => {
    expect(isPublicResourceUri('ui://other/widget.html')).toBe(false);
  });
});
```

### E2E Tests

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/public-resource-auth.e2e.test.ts`

```typescript
describe('Public Resource Authentication E2E', () => {
  it('widget resources/read responds without auth token', async () => {
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
  });

  it('static widget assets are served from /widget/', async () => {
    const response = await request(app).get('/widget/oak-viewer.js');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toContain('javascript');
  });
});
```

---

## Files to Modify

| File | Change |
| ---- | ------ |
| `src/auth/clerk-middleware.ts` | Add public resource skip logic |
| `src/aggregated-tool-widget.ts` | Refactor to tiny shell pattern |
| `src/register-resources.ts` | Update CSP metadata |
| `src/application.ts` | Initialize widget base URL |
| `vercel.json` | Add cache headers for static assets |
| `package.json` | Add widget build script |

## Files to Create

| File | Purpose |
| ---- | ------- |
| `src/auth/public-resources.ts` | Public resource URI definitions |
| `src/widget/main.ts` | Widget bundle entry point |
| `vite.widget.config.ts` | Widget bundler configuration |
| `public/widget/.gitkeep` | Placeholder for generated assets |
| `ADR-057` | Document architectural decision |

---

## Definition of Done

- [ ] Widget `resources/read` skips Clerk auth
- [ ] Documentation `resources/read` skips Clerk auth  
- [ ] Widget HTML is tiny shell (~500 bytes)
- [ ] Widget JS/CSS served from `public/` directory
- [ ] Static assets have CDN cache headers
- [ ] Unit tests for `isPublicResourceUri()` pass
- [ ] E2E tests verify auth bypass and static serving
- [ ] Discovery + widget loading < 2 seconds in ChatGPT
- [ ] ADR-057 created and indexed
- [ ] All quality gates pass

---

## Success Metrics

| Metric               | Before | Target  | Verified |
| -------------------- | ------ | ------- | -------- |
| Widget fetch latency | ~170ms | <50ms   | ☐        |
| 29 tool widget loads | ~4.9s  | <1.5s   | ☐        |
| Total discovery time | 5-10s  | <2s     | ☐        |
| ChatGPT timeout      | Yes    | No      | ☐        |

---

## References

- [OpenAI Apps SDK: Build MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)
- [Vercel Express: Serving Static Assets](https://vercel.com/docs/frameworks/backend/express#serving-static-assets)
- `research/openai-app-ui.research.md` — Architecture patterns for high-performance widgets
