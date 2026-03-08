# Plan 15b: Static Widget Shell Optimisation

> **Status**: Deferred - implement after Plan 15a if needed
>
> **Problem**: Widget HTML contains inline JS/CSS, missing CDN caching benefits
>
> **Solution**: Tiny HTML shell + bundled assets served from Vercel CDN
>
> **Prerequisite**: Plan 15a (Public Resource Auth Bypass)

---

## Foundation Document Compliance

**Re-read these before starting work:**

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

**Schema-first applicability**: This plan modifies authored runtime code (widget HTML generation). The widget is runtime UI code, not type/schema information. No generator changes required.

---

## Pre-First Question: Are we solving the right problem, at the right layer?

**Evaluate after Plan 15a.**

Plan 15a (auth bypass) may achieve acceptable latency on its own. Measure before implementing this optimisation:

- If latency is <2s after 15a → this plan may be unnecessary
- If latency is still >2s → proceed with this plan

This aligns with YAGNI principle from principles.md.

---

## Problem Statement

### Current Architecture

The widget HTML is constructed with inline styles and scripts:

```typescript
// aggregated-tool-widget.ts
export const AGGREGATED_TOOL_WIDGET_HTML = `<!DOCTYPE html>
<html>
  ...
  <style>${WIDGET_STYLES}</style>
  ...
  <script type="module">${WIDGET_SCRIPT}</script>
</html>`;
```

### Issues

1. **No CDN caching**: Inline content means no browser/CDN caching of JS/CSS
2. **Large MCP responses**: Full widget code sent with every `resources/read`
3. **No versioning**: Hard to cache-bust or roll back widget changes

### OpenAI Apps SDK Best Practice

Per the research in `research/openai-app-ui.research.md`:

> Serve a tiny HTML "shell" from MCP (as `text/html+skybridge`). The shell contains only a minimal DOM container and `<link>`/`<script>` tags pointing to CDN-hosted assets.

---

## Solution: Tiny Shell + CDN Assets

### Architecture After Implementation

```text
BEFORE (Inline - no caching):
┌─────────────┐     resources/read     ┌─────────────┐
│   ChatGPT   │ ──────────────────────►│ MCP Server  │
│             │                        │             │
└─────────────┘                        └──────┬──────┘
                                              │
                                              ▼
                                    Widget HTML (~15KB)
                                    (inline JS/CSS)

AFTER (Shell + CDN):
┌─────────────┐     resources/read     ┌─────────────┐
│   ChatGPT   │ ──────────────────────►│ MCP Server  │
│             │                        │             │
└─────────────┘                        └──────┬──────┘
       │                                      │
       │                                      ▼
       │                              Widget Shell (~500 bytes)
       │                              (refs to CDN assets)
       │
       │              GET /widget/*.js     ┌─────────────┐
       └──────────────────────────────────►│ Vercel CDN  │
                                           │  (public/)  │
                                           └─────────────┘
                                           (~5-20ms, cached)
```

### Benefits

| Aspect            | Before   | After               |
| ----------------- | -------- | ------------------- |
| MCP resource size | ~15KB    | ~500 bytes          |
| JS/CSS caching    | None     | Browser + CDN       |
| Cache-busting     | Hard     | Version in filename |
| Rollback          | Redeploy | Change reference    |

---

## Implementation Plan (TDD)

### Phase 1: Integration Test Specification (RED)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/widget-shell.integration.test.ts`

```typescript
/**
 * Integration tests for widget shell architecture.
 *
 * Tests verify that:
 * 1. Widget HTML is a tiny shell (~500 bytes)
 * 2. Shell references external JS/CSS with absolute URLs
 * 3. Static assets are served from /widget/
 *
 * @packageDocumentation
 */
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../application.js';

describe('Widget Shell Architecture (Integration)', () => {
  describe('Widget HTML shell', () => {
    it('returns HTML smaller than 1KB', async () => {
      const { app } = createApp();
      const response = await request(app)
        .post('/mcp')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const html = response.body?.result?.contents?.[0]?.text ?? '';
      expect(html.length).toBeLessThan(1024);
    });

    it('references external JS with absolute URL', async () => {
      const { app } = createApp();
      const response = await request(app)
        .post('/mcp')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const html = response.body?.result?.contents?.[0]?.text ?? '';
      expect(html).toMatch(/src="https?:\/\/[^"]+\/widget\/oak-viewer\.js"/);
    });

    it('references external CSS with absolute URL', async () => {
      const { app } = createApp();
      const response = await request(app)
        .post('/mcp')
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'ui://widget/oak-json-viewer.html' },
        });

      const html = response.body?.result?.contents?.[0]?.text ?? '';
      expect(html).toMatch(/href="https?:\/\/[^"]+\/widget\/oak-viewer\.css"/);
    });
  });

  describe('Static widget assets', () => {
    it('serves widget JS from /widget/', async () => {
      const { app } = createApp();
      const response = await request(app).get('/widget/oak-viewer.js');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('javascript');
    });

    it('serves widget CSS from /widget/', async () => {
      const { app } = createApp();
      const response = await request(app).get('/widget/oak-viewer.css');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('css');
    });

    it('includes cache headers on static assets', async () => {
      const { app } = createApp();
      const response = await request(app).get('/widget/oak-viewer.js');

      expect(response.headers['cache-control']).toContain('public');
    });
  });
});
```

**Run tests → RED** (shell architecture doesn't exist yet)

---

### Phase 2: Unit Tests for Widget Shell Generation (RED)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/widget-shell.unit.test.ts`

```typescript
/**
 * Unit tests for widget shell generation.
 *
 * Pure function tests with no IO, no side effects, no mocks.
 *
 * @packageDocumentation
 */
import { describe, it, expect } from 'vitest';
import { getWidgetShellHtml, setWidgetAssetsBaseUrl } from './widget-shell.js';

describe('getWidgetShellHtml', () => {
  it('returns valid HTML document', () => {
    setWidgetAssetsBaseUrl('https://example.com');
    const html = getWidgetShellHtml();

    expect(html).toContain('<!doctype html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');
  });

  it('includes root element for React mounting', () => {
    setWidgetAssetsBaseUrl('https://example.com');
    const html = getWidgetShellHtml();

    expect(html).toContain('<div id="root">');
  });

  it('references JS bundle with base URL', () => {
    setWidgetAssetsBaseUrl('https://my-app.vercel.app');
    const html = getWidgetShellHtml();

    expect(html).toContain('src="https://my-app.vercel.app/widget/oak-viewer.js"');
  });

  it('references CSS bundle with base URL', () => {
    setWidgetAssetsBaseUrl('https://my-app.vercel.app');
    const html = getWidgetShellHtml();

    expect(html).toContain('href="https://my-app.vercel.app/widget/oak-viewer.css"');
  });

  it('is smaller than 1KB', () => {
    setWidgetAssetsBaseUrl('https://example.com');
    const html = getWidgetShellHtml();

    expect(html.length).toBeLessThan(1024);
  });
});

describe('setWidgetAssetsBaseUrl', () => {
  it('updates the base URL used in shell generation', () => {
    setWidgetAssetsBaseUrl('https://new-domain.com');
    const html = getWidgetShellHtml();

    expect(html).toContain('https://new-domain.com/widget/');
  });
});
```

**Run tests → RED** (module doesn't exist)

---

### Phase 3: Implement Widget Shell Module (GREEN)

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/widget-shell.ts`

````typescript
/**
 * Widget shell generation for ChatGPT UI.
 *
 * Generates a minimal HTML shell (~500 bytes) that loads the actual
 * widget code from Vercel CDN. This pattern:
 *
 * 1. Reduces MCP resource response size
 * 2. Enables browser/CDN caching of JS/CSS
 * 3. Supports versioned deployments via filename
 *
 * The shell is served as `text/html+skybridge` which triggers ChatGPT
 * to inject the `window.openai` API.
 *
 * @packageDocumentation
 * @see research/openai-app-ui.research.md for architecture details
 */

/**
 * Base URL for widget static assets.
 *
 * Set during server initialisation from `VERCEL_URL` or fallback.
 * Used to build absolute URLs for CSS/JS references.
 *
 * @internal
 */
let widgetAssetsBaseUrl = 'http://localhost:3333';

/**
 * Sets the base URL for widget static assets.
 *
 * Call during server initialisation with the resolved host URL.
 *
 * @param baseUrl - Full base URL (e.g., "https://my-app.vercel.app")
 *
 * @example
 * ```typescript
 * // In application.ts initialisation
 * const baseUrl = process.env.VERCEL_URL
 *   ? `https://${process.env.VERCEL_URL}`
 *   : 'http://localhost:3333';
 * setWidgetAssetsBaseUrl(baseUrl);
 * ```
 */
export function setWidgetAssetsBaseUrl(baseUrl: string): void {
  widgetAssetsBaseUrl = baseUrl;
}

/**
 * Returns the widget HTML shell.
 *
 * This is a minimal (~500 byte) HTML document that:
 * 1. Loads CSS from static assets
 * 2. Loads JS bundle from static assets
 * 3. Provides mount point for the widget app
 *
 * The JS bundle reads `window.openai.toolOutput` for user data.
 *
 * @returns Minimal HTML shell string
 *
 * @remarks
 * - Uses absolute URLs because iframe origin is OpenAI's, not ours
 * - Assets are versioned via filename for cache-busting
 * - Shell itself is tiny so caching is less critical
 */
export function getWidgetShellHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="stylesheet" href="${widgetAssetsBaseUrl}/widget/oak-viewer.css">
</head>
<body>
<div id="root"></div>
<script type="module" src="${widgetAssetsBaseUrl}/widget/oak-viewer.js"></script>
</body>
</html>`;
}
````

**Run unit tests → GREEN**

---

### Phase 4: Create Widget Bundle Entry Point

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/main.ts`

```typescript
/**
 * Widget bundle entry point.
 *
 * This module initialises the Oak JSON Viewer widget by:
 * 1. Reading tool output from `window.openai.toolOutput`
 * 2. Rendering the appropriate view based on the data
 *
 * Bundled to `public/widget/oak-viewer.js` at build time.
 *
 * @packageDocumentation
 */

// Extract from current WIDGET_SCRIPT content
// This will require refactoring the existing inline script
```

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget/styles.css`

```css
/**
 * Widget styles for Oak JSON Viewer.
 *
 * Bundled to `public/widget/oak-viewer.css` at build time.
 */

/* Extract from current WIDGET_STYLES content */
```

---

### Phase 5: Configure Vite Build

**File**: `apps/oak-curriculum-mcp-streamable-http/vite.widget.config.ts`

```typescript
/**
 * Vite configuration for widget bundle.
 *
 * Builds the widget JS/CSS to `public/widget/` for Vercel CDN serving.
 *
 * @remarks
 * - Output filenames are stable for consistent references in shell
 * - Hash-based names could be used for cache-busting if needed
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

Add build script:

```json
{
  "scripts": {
    "build:widget": "vite build --config vite.widget.config.ts",
    "build": "pnpm build:widget && tsup"
  }
}
```

---

### Phase 6: Configure Vercel Cache Headers

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

---

### Phase 7: Update CSP Configuration

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

Update `WIDGET_CSP` to include the deployment domain:

```typescript
/**
 * OpenAI Apps SDK Content Security Policy for the widget.
 *
 * @remarks
 * `resource_domains` must include the deployment domain for static assets.
 */
const WIDGET_CSP = {
  connect_domains: ['https://*.thenational.academy'],
  resource_domains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://*.thenational.academy',
    // Add deployment domain - use environment variable
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3333',
  ],
} as const;
```

---

### Phase 8: Update Application Initialisation

**File**: `apps/oak-curriculum-mcp-streamable-http/src/application.ts`

```typescript
import { setWidgetAssetsBaseUrl } from './widget/widget-shell.js';

// In initialisation:
function resolveBaseUrl(): string {
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    return `https://${vercelUrl}`;
  }
  return 'http://localhost:3333';
}

// Call early in createApp()
setWidgetAssetsBaseUrl(resolveBaseUrl());
```

---

### Phase 9: Update Widget Resource Registration

**File**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

Update to use new shell:

```typescript
import { getWidgetShellHtml } from './widget/widget-shell.js';

export function registerWidgetResource(server: McpServer): void {
  server.registerResource(
    'oak-json-viewer',
    AGGREGATED_TOOL_WIDGET_URI,
    {
      description: 'Oak-branded JSON viewer widget for tool output',
      mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
    },
    () => ({
      contents: [
        {
          uri: AGGREGATED_TOOL_WIDGET_URI,
          mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
          text: getWidgetShellHtml(), // <-- Use shell instead of inline
          _meta: {
            'openai/widgetCSP': WIDGET_CSP,
            'openai/widgetPrefersBorder': true,
            'openai/widgetDescription': WIDGET_DESCRIPTION,
          },
        },
      ],
    }),
  );
}
```

**Run integration tests → GREEN**

---

### Phase 10: Git Ignore Generated Assets

**File**: `apps/oak-curriculum-mcp-streamable-http/.gitignore`

```text
# Generated widget bundle (built from src/widget/)
public/widget/
```

---

## Files to Modify

| File                        | Change                                            |
| --------------------------- | ------------------------------------------------- |
| `src/register-resources.ts` | Use `getWidgetShellHtml()` instead of inline HTML |
| `src/application.ts`        | Initialise widget base URL                        |
| `vercel.json`               | Add cache headers for static assets               |
| `package.json`              | Add `build:widget` script                         |
| `.gitignore`                | Ignore generated widget bundle                    |

## Files to Create

| File                                          | Purpose                      |
| --------------------------------------------- | ---------------------------- |
| `src/widget/widget-shell.ts`                  | Shell HTML generation        |
| `src/widget/widget-shell.unit.test.ts`        | Unit tests                   |
| `src/widget/widget-shell.integration.test.ts` | Integration tests            |
| `src/widget/main.ts`                          | Widget bundle entry point    |
| `src/widget/styles.css`                       | Widget styles                |
| `vite.widget.config.ts`                       | Widget bundler configuration |

## Files to Delete/Deprecate

| File                            | Reason                       |
| ------------------------------- | ---------------------------- |
| `src/widget-styles.ts`          | Moved to CSS file            |
| `src/widget-script.ts`          | Moved to bundle entry point  |
| `src/aggregated-tool-widget.ts` | Replace with widget-shell.ts |

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

- [ ] Unit tests for shell generation pass (TDD: RED → GREEN)
- [ ] Integration tests for static serving pass (TDD: RED → GREEN)
- [ ] Widget HTML shell is <1KB
- [ ] Widget JS/CSS bundled to `public/widget/`
- [ ] Static assets have CDN cache headers
- [ ] CSP includes deployment domain
- [ ] Base URL configured from environment
- [ ] ALL quality gates pass
- [ ] Comprehensive TSDoc on all new files
- [ ] No type assertions (`as`) used

---

## Expected Impact

| Metric           | Before | After      | Improvement |
| ---------------- | ------ | ---------- | ----------- |
| Widget HTML size | ~15KB  | ~500 bytes | **30×**     |
| JS/CSS caching   | None   | CDN        | ✅          |
| Asset load time  | N/A    | ~5-20ms    | CDN cached  |

---

## Re-read Foundation Documents

Per project rules, regularly re-read during implementation:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`

Ask at each phase: **Could it be simpler without compromising quality?**

**Important**: Measure latency after Plan 15a before implementing this plan. YAGNI applies.
