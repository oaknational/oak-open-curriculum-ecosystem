# Aggregated Tools Widget and Metadata Enhancement

**Status**: IN_PROGRESS  
**Created**: 2025-11-27  
**Priority**: Enhancement (Post-POC)  
**Estimated Duration**: ~2 hours

---

## Executive Summary

Add a minimal Oak-branded widget for aggregated tools and complete the metadata for `search` and `fetch` tools to match the `get-ontology` tool pattern. This enables ChatGPT to display invocation status and render tool output using Oak brand styling.

---

## The Problem: Raw JSON Output

When a user asks ChatGPT to search the curriculum today, the tool returns raw JSON that ChatGPT formats as a code block. This is:

- **Ugly**: No branding, no visual hierarchy
- **Silent**: No feedback during the 1-3 second API call
- **Generic**: Looks like any other MCP tool output

### Before (Current State)

````markdown
User: Find me lessons about photosynthesis for KS3

ChatGPT: I'll search the curriculum for you.

[search tool invoked - no visual feedback]

Here are the results:

```json
{
  "lessons": [
    { "title": "Photosynthesis", "slug": "photosynthesis", ... },
    ...
  ]
}
```
````

### After (With Widget)

```markdown
User: Find me lessons about photosynthesis for KS3

ChatGPT: I'll search the curriculum for you.

[Status pill: "Searching curriculum…"]

[Status pill: "Search complete"]

┌─────────────────────────────────────────────────┐
│ 🌿 Oak Curriculum Results │
│ │
│ { │
│ "lessons": [ │
│ { "title": "Photosynthesis", ... }, │
│ ... │
│ ] │
│ } │
└─────────────────────────────────────────────────┘
(Oak green styling, Lexend font, dark mode aware)
```

---

## How ChatGPT Widgets Work

### The OpenAI Apps SDK

ChatGPT's MCP integration uses the **OpenAI Apps SDK** which extends standard MCP with UI capabilities. Key extensions:

| Feature           | Standard MCP  | ChatGPT Extension                         |
| ----------------- | ------------- | ----------------------------------------- |
| Tool status       | Not specified | `_meta["openai/toolInvocation/invoking"]` |
| Completion status | Not specified | `_meta["openai/toolInvocation/invoked"]`  |
| Output rendering  | Text only     | `_meta["openai/outputTemplate"]` → widget |
| Widget format     | N/A           | `text/html+skybridge` MIME type           |

### Widget Architecture

```text

┌─────────────────────────────────────────────────────────────────┐
│ MCP SERVER │
├─────────────────────────────────────────────────────────────────┤
│ │
│ TOOL DEFINITION RESOURCE │
│ ┌───────────────────────┐ ┌───────────────────────┐ │
│ │ name: "search" │ │ uri: "ui://widget/..." │ │
│ │ \_meta: { │──────────▶│ mimeType: │ │
│ │ openai/outputTemplate│ points │ "text/html+skybridge"│ │
│ │ → "ui://widget/..." │ to │ text: "<html>...</html>"│ │
│ │ } │ └───────────────────────┘ │
│ └───────────────────────┘ │ │
│ ▼ │
└─────────────────────────────────────────────────────────────────┘
│
│ ChatGPT fetches
│ resource when
│ tool completes
▼
┌─────────────────────────────────────────────────────────────────┐
│ CHATGPT │
├─────────────────────────────────────────────────────────────────┤
│ │
│ 1. User triggers tool │
│ 2. ChatGPT shows "Searching curriculum…" (invoking text) │
│ 3. Tool completes, returns JSON │
│ 4. ChatGPT shows "Search complete" (invoked text) │
│ 5. ChatGPT fetches widget resource by URI │
│ 6. Widget HTML receives JSON via window.openai.toolOutput │
│ 7. Widget renders styled output │
│ │
└─────────────────────────────────────────────────────────────────┘

```

### The Widget HTML

The widget is a self-contained HTML document that:

1. **Receives data** via `window.openai.toolOutput` (the tool's JSON response)
2. **Renders** however it wants (we use a styled `<pre>` with JSON.stringify)
3. **Adapts** to light/dark mode via CSS media queries
4. **Loads fonts** from external CDNs (Google Fonts)

```html
<!-- Simplified widget structure -->
<link href="https://fonts.googleapis.com/css2?family=Lexend" rel="stylesheet" />
<style>
  body {
    font-family: 'Lexend', sans-serif;
  }
  #root {
    background: #bef2bd;
    color: #1b3d1c;
  }
  @media (prefers-color-scheme: dark) {
    #root {
      background: #1b3d1c;
      color: #f0f7f0;
    }
  }
</style>
<div id="root">
  <pre id="output"></pre>
</div>
<script>
  // ChatGPT injects tool output here
  const data = window.openai?.toolOutput ?? {};
  document.getElementById('output').textContent = JSON.stringify(data, null, 2);
</script>
```

### The `text/html+skybridge` MIME Type

This special MIME type tells ChatGPT that the resource is a widget, not regular HTML:

| MIME Type             | ChatGPT Behavior                           |
| --------------------- | ------------------------------------------ |
| `text/plain`          | Display as text                            |
| `text/html`           | Sanitize and display                       |
| `text/html+skybridge` | Render in sandbox with `window.openai` API |

---

## Tool `_meta` Fields

Each aggregated tool needs three `_meta` fields:

| Field                            | Purpose                              | Example                            |
| -------------------------------- | ------------------------------------ | ---------------------------------- |
| `openai/toolInvocation/invoking` | Status text shown during execution   | "Searching curriculum…"            |
| `openai/toolInvocation/invoked`  | Status text shown after completion   | "Search complete"                  |
| `openai/outputTemplate`          | URI of widget resource for rendering | "ui://widget/oak-json-viewer.html" |

### Field Limits

Per OpenAI Apps SDK reference:

| Field            | Max Length    |
| ---------------- | ------------- |
| `invoking`       | 64 characters |
| `invoked`        | 64 characters |
| `outputTemplate` | Valid URI     |

---

## Relationship to Other Plans

### Prerequisites

| Plan                               | Relationship                                                   |
| ---------------------------------- | -------------------------------------------------------------- |
| **00-ontology-poc-static-tool.md** | Completed - established metadata patterns for aggregated tools |

### Future Considerations

| Plan                                        | Relationship                                                |
| ------------------------------------------- | ----------------------------------------------------------- |
| **02-curriculum-ontology-resource-plan.md** | Widget patterns established here will apply to future tools |

---

## Current State

| Tool           | Description Quality       | Annotations            | `_meta`                  | Widget  |
| -------------- | ------------------------- | ---------------------- | ------------------------ | ------- |
| `get-ontology` | ✅ Full (Use when/Do NOT) | ✅ All 4 hints + title | ⚠️ invoking/invoked only | ❌ None |
| `search`       | ⚠️ Basic                  | ✅ All hints           | ❌ Missing               | ❌ None |
| `fetch`        | ⚠️ Basic                  | ✅ All hints           | ❌ Missing               | ❌ None |

**Issues:**

- No widget registered, so ChatGPT cannot display styled output
- `search` and `fetch` missing `_meta` fields entirely
- `get-ontology` missing `outputTemplate` (has invoking/invoked only)
- Descriptions don't follow "Use when" / "Do NOT use" pattern

---

## Implementation

### 1. Create Widget Resource File

**File**: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

```typescript
/**
 * Oak-branded widget for rendering aggregated tool output in ChatGPT.
 *
 * This HTML is served as an MCP resource with `text/html+skybridge` MIME type.
 * ChatGPT fetches this resource when a tool specifies it as `openai/outputTemplate`.
 *
 * The widget receives tool output via `window.openai.toolOutput` and renders it
 * with Oak brand styling and the Lexend font.
 */

export const AGGREGATED_TOOL_WIDGET_URI = 'ui://widget/oak-json-viewer.html';

export const AGGREGATED_TOOL_WIDGET_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: light dark;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif;
    }
    
    #root {
      background: #bef2bd;
      color: #1b3d1c;
      border-radius: 8px;
      padding: 16px;
    }
    
    @media (prefers-color-scheme: dark) {
      #root {
        background: #1b3d1c;
        color: #f0f7f0;
      }
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  <div id="root">
    <pre id="output"></pre>
  </div>
  <script type="module">
    // ChatGPT provides tool output via window.openai.toolOutput
    const output = window.openai?.toolOutput ?? {};
    document.getElementById('output').textContent = JSON.stringify(output, null, 2);
  </script>
</body>
</html>`.trim();
```

---

### 2. Register Widget as MCP Resource

**File**: `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`

Add import and registration:

```typescript
import {
  AGGREGATED_TOOL_WIDGET_URI,
  AGGREGATED_TOOL_WIDGET_HTML,
} from './aggregated-tool-widget.js';

// Inside registerHandlers(), after existing registrations:
server.resource(
  'oak-json-viewer',
  AGGREGATED_TOOL_WIDGET_URI,
  {
    description: 'Oak-branded JSON viewer widget for tool output',
    mimeType: 'text/html+skybridge',
  },
  async () => ({
    contents: [
      {
        uri: AGGREGATED_TOOL_WIDGET_URI,
        mimeType: 'text/html+skybridge',
        text: AGGREGATED_TOOL_WIDGET_HTML,
      },
    ],
  }),
);
```

**Note**: Check the MCP SDK API for the exact registration method. It may be `server.resource()`, `server.registerResource()`, or similar.

---

### 3. Update `search` Tool Definition

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

Update the `search` entry in `AGGREGATED_TOOL_DEFS`:

```typescript
search: {
  description: `Search across lessons and transcripts for curriculum content.

Use this when you need to:
- Find lessons on a topic (e.g., "photosynthesis", "fractions")
- Discover what content exists for a key stage or subject
- Search transcript text for specific concepts

Do NOT use for:
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use 'get-ontology')

Executes get-search-lessons and get-search-transcripts in parallel.`,
  inputSchema: SEARCH_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Search Curriculum',
  },
  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': 'Searching curriculum…',
    'openai/toolInvocation/invoked': 'Search complete',
  },
},
```

---

### 4. Update `fetch` Tool Definition

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`

Update the `fetch` entry in `AGGREGATED_TOOL_DEFS`:

```typescript
fetch: {
  description: `Fetch curriculum resource by canonical identifier.

Use this when you need to:
- Get lesson details (learning objectives, keywords, misconceptions)
- Get unit information (lessons list, subject context)
- Get subject or sequence overview
- Retrieve thread progression data

Do NOT use for:
- Finding content when you don't have the ID (use 'search')
- Understanding ID formats (use 'get-ontology' first)

Use format "type:slug" (e.g., "lesson:adding-fractions", "unit:algebra-basics").`,
  inputSchema: FETCH_INPUT_SCHEMA,
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }] as const,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: 'Fetch Curriculum Resource',
  },
  _meta: {
    'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
    'openai/toolInvocation/invoking': 'Fetching resource…',
    'openai/toolInvocation/invoked': 'Resource loaded',
  },
},
```

---

### 5. Update `get-ontology` Tool Definition

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

Add `outputTemplate` to the existing `_meta`:

```typescript
_meta: {
  'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
  'openai/toolInvocation/invoking': 'Loading curriculum model…',
  'openai/toolInvocation/invoked': 'Curriculum model loaded',
},
```

---

### 6. Add Tests

#### Unit Tests (SDK)

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts`

```typescript
describe('aggregated tool _meta fields', () => {
  const aggregatedToolNames = ['search', 'fetch', 'get-ontology'] as const;

  it.each(aggregatedToolNames)('%s has openai/outputTemplate', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/outputTemplate']).toBe('ui://widget/oak-json-viewer.html');
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoking', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoking']).toBeDefined();
    expect(typeof tool?._meta?.['openai/toolInvocation/invoking']).toBe('string');
  });

  it.each(aggregatedToolNames)('%s has openai/toolInvocation/invoked', (toolName) => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === toolName);
    expect(tool?._meta?.['openai/toolInvocation/invoked']).toBeDefined();
    expect(typeof tool?._meta?.['openai/toolInvocation/invoked']).toBe('string');
  });
});

describe('search and fetch descriptions', () => {
  it('search description includes "Use this when" guidance', () => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === 'search');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });

  it('fetch description includes "Use this when" guidance', () => {
    const tools = listUniversalTools();
    const tool = tools.find((t) => t.name === 'fetch');
    expect(tool?.description).toContain('Use this when');
    expect(tool?.description).toContain('Do NOT use');
  });
});
```

#### E2E Tests (HTTP App)

**File**: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts`

```typescript
import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope, parseJsonRpcResult } from './helpers/sse.js';

describe('oak-json-viewer widget resource', () => {
  it('appears in resources/list', async () => {
    const { app, sessionId } = await createStubbedHttpApp();

    const response = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .set('Mcp-Session-Id', sessionId)
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/list',
        params: {},
      });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);

    const widget = result.resources?.find(
      (r: { uri: string }) => r.uri === 'ui://widget/oak-json-viewer.html',
    );
    expect(widget).toBeDefined();
    expect(widget.mimeType).toBe('text/html+skybridge');
  });

  it('returns HTML content when read', async () => {
    const { app, sessionId } = await createStubbedHttpApp();

    const response = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .set('Mcp-Session-Id', sessionId)
      .send({
        jsonrpc: '2.0',
        id: 1,
        method: 'resources/read',
        params: { uri: 'ui://widget/oak-json-viewer.html' },
      });

    expect(response.status).toBe(200);
    const envelope = parseSseEnvelope(response.text);
    const result = parseJsonRpcResult(envelope);

    expect(result.contents).toHaveLength(1);
    expect(result.contents[0].mimeType).toBe('text/html+skybridge');
    expect(result.contents[0].text).toContain('Lexend');
    expect(result.contents[0].text).toContain('#bef2bd'); // Oak light green
    expect(result.contents[0].text).toContain('#1b3d1c'); // Oak dark green
    expect(result.contents[0].text).toContain('window.openai');
  });
});
```

---

## Files Changed

| File                                                                            | Change                                            |
| ------------------------------------------------------------------------------- | ------------------------------------------------- |
| `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`         | New - widget HTML with Oak colors and Lexend font |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`                       | Register widget resource                          |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`                   | Update search/fetch metadata and descriptions     |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`               | Add outputTemplate to `_meta`                     |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts`         | Add `_meta` and description tests                 |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/widget-resource.e2e.test.ts` | New - E2E tests for widget resource               |

---

## Oak Brand Colors

| Mode  | Background              | Text                    |
| ----- | ----------------------- | ----------------------- |
| Light | `#bef2bd` (soft green)  | `#1b3d1c` (dark forest) |
| Dark  | `#1b3d1c` (dark forest) | `#f0f7f0` (off-white)   |

**Font**: Lexend (Google Fonts) with `system-ui` fallback

---

## Acceptance Criteria

### Functional Requirements

| Criterion                                              | Test Method |
| ------------------------------------------------------ | ----------- |
| Widget resource appears in `resources/list`            | E2E test    |
| Widget returns `text/html+skybridge` MIME type         | E2E test    |
| Widget HTML includes Lexend font import                | E2E test    |
| Widget HTML includes Oak brand colors                  | E2E test    |
| Widget HTML includes `window.openai.toolOutput` access | E2E test    |

### Metadata Requirements

| Criterion                                                             | Test Method |
| --------------------------------------------------------------------- | ----------- |
| All 3 aggregated tools have `_meta["openai/outputTemplate"]`          | Unit test   |
| All 3 aggregated tools have `_meta["openai/toolInvocation/invoking"]` | Unit test   |
| All 3 aggregated tools have `_meta["openai/toolInvocation/invoked"]`  | Unit test   |
| `search` description follows "Use when" / "Do NOT" pattern            | Unit test   |
| `fetch` description follows "Use when" / "Do NOT" pattern             | Unit test   |

### Manual Verification (ChatGPT)

| Criterion                                    | Test Method            |
| -------------------------------------------- | ---------------------- |
| Status text appears during tool invocation   | Manual test in ChatGPT |
| Completion text appears after tool completes | Manual test in ChatGPT |
| Widget renders with Oak styling              | Manual test in ChatGPT |
| Dark mode works correctly                    | Manual test in ChatGPT |

---

## Quality Gates

```bash
pnpm build         # No type errors
pnpm type-check    # All workspaces type-safe
pnpm lint -- --fix # No linting errors
pnpm test          # All tests pass
```

---

## Todos

- [ ] Create aggregated-tool-widget.ts with Oak-branded HTML and Lexend font
- [ ] Register oak-json-viewer resource in handlers.ts
- [ ] Update search tool with full metadata (description, `_meta` with outputTemplate)
- [ ] Update fetch tool with full metadata (description, `_meta` with outputTemplate)
- [ ] Add `openai/outputTemplate` to get-ontology `_meta`
- [ ] Add unit tests for `_meta` fields on all aggregated tools
- [ ] Add E2E tests for widget resource registration and content
- [ ] Run build, type-check, lint, test to verify all changes
- [ ] Manual test in ChatGPT to verify widget rendering

---

## Troubleshooting

### Widget Not Rendering

1. Check that `_meta["openai/outputTemplate"]` URI exactly matches the resource URI
2. Verify resource MIME type is `text/html+skybridge` (not just `text/html`)
3. Check ChatGPT console for CSP errors (may need to allow Google Fonts domains)

### Status Text Not Showing

1. Verify `_meta` fields are included in `tools/list` response
2. Check that field names use forward slashes: `openai/toolInvocation/invoking`
3. Ensure status text is ≤64 characters

### Fonts Not Loading

1. Google Fonts CDN may be blocked by CSP
2. Fallback to `system-ui` should still work
3. Consider embedding font as base64 if CDN blocked

---

## Related Plans

- **00-ontology-poc-static-tool.md** - Established metadata patterns (completed)
- **02-curriculum-ontology-resource-plan.md** - Full ontology implementation (future)

---

## Reference Documentation

- `.agent/reference-docs/openai-apps-sdk-reference.md` - `_meta` field specifications
- `.agent/reference-docs/openai-apps-build-ui.md` - Widget development guide
- `.agent/reference-docs/mcp-docs-for-agents.md` - MCP resource registration
