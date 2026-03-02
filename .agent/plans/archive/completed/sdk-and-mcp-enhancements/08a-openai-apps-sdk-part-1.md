# Plan 08a: OpenAI Apps SDK Feature Adoption - Part 1

**Created**: 2025-11-30  
**Status**: ✅ COMPLETE (2025-11-30)  
**Duration**: ~4-6 hours  
**Focus**: Token optimization, locale support, and widget runtime features

**Parent Plan**: [08-openai-apps-sdk-feature-adoption-plan.archived.md](../archive/08-openai-apps-sdk-feature-adoption-plan.archived.md)  
**Implementation Prompt**: [phase-8a-token-optimization-and-widget-features.prompt.md](../../prompts/phase-8a-token-optimization-and-widget-features.prompt.md)

---

## Overview

This is Part 1 of the OpenAI Apps SDK feature adoption, focusing on immediate improvements:

1. Fix STDIO tool description bug (Phase 0.2)
2. Tool result token optimization (Phase 3)
3. Locale support (Phase 4.2)
4. External links and display modes (Phase 5.2, 5.3)

---

## Prerequisites

All foundational work from Phases 0.6, 1, and 2 is complete:

- ✅ Server HTTP security headers
- ✅ Widget resource metadata (CSP, description, border)
- ✅ Full `_meta` on all 27 tools (generated + aggregated)
- ✅ Widget interactivity (`callTool`, `setWidgetState`)
- ✅ Type safety (no index signatures)

---

## Task 1: Fix STDIO Tool Description Bug (from Phase 0.2)

**Priority**: MEDIUM  
**Duration**: ~30 minutes

### Problem

STDIO server overrides rich OpenAPI descriptions with "GET /path" strings, breaking tool discovery.

### File

`apps/oak-curriculum-mcp-stdio/src/app/server.ts`

### Change

```typescript
// Replace
const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;
// With
const description =
  descriptor.description ?? `${descriptor.method.toUpperCase()} ${descriptor.path}`;
```

### Verification

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

### Acceptance Criteria

| Criterion                                 | Verification |
| ----------------------------------------- | ------------ |
| STDIO tools use OpenAPI descriptions      | Unit test    |
| Fallback to method+path if no description | Unit test    |
| No regression                             | `pnpm test`  |

---

## Task 2: Tool Result Token Optimization (Phase 3)

**Priority**: HIGH  
**Duration**: ~4-5 hours

### Objective

Use tool result `_meta` to send large/detailed data only to the widget, keeping `structuredContent` minimal for the model. Target: ≥50% token reduction for large results.

### 2.1: Define Tool Result Structure

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/tool-result.ts` (new)

```typescript
/**
 * MCP tool result with OpenAI Apps SDK optimizations.
 *
 * - `structuredContent`: Minimal data the model needs to understand the result
 * - `content`: Human-readable summary for conversation
 * - `_meta`: Full data for widget rendering (hidden from model)
 *
 * @see https://developers.openai.com/apps-sdk/reference#tool-results
 */
export interface OptimizedToolResult<TStructured, TMeta = unknown> {
  /** Minimal structured data for model reasoning */
  readonly structuredContent: TStructured;
  /** Human-readable summary */
  readonly content: readonly ContentItem[];
  /** Full data for widget only (not sent to model) */
  readonly _meta?: TMeta;
}

export interface ContentItem {
  readonly type: 'text';
  readonly text: string;
}
```

### 2.2: Update Search Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`

**Current** (all data goes to model):

```typescript
return {
  structuredContent: {
    status: 'success',
    data: { lessons: fullLessonData, transcripts: fullTranscriptData },
  },
};
```

**Optimized** (minimal to model, full to widget):

```typescript
return {
  structuredContent: {
    status: 'success',
    summary: `Found ${lessons.length} lessons and ${transcripts.length} transcripts`,
    lessonTitles: lessons.slice(0, 5).map((l) => l.lessonTitle),
    hasMore: lessons.length > 5,
  },
  content: [
    {
      type: 'text',
      text: `Found ${lessons.length} lessons matching "${query}".`,
    },
  ],
  _meta: {
    fullResults: { lessons, transcripts },
    query,
    timestamp: Date.now(),
  },
};
```

### 2.3: Update Widget to Read `_meta`

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

```javascript
function render() {
  // Prefer _meta for full data, fall back to structuredContent
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};

  const fullResults = meta.fullResults ?? output.data;
  // ... render using fullResults
}
```

### 2.4: Apply Pattern to All Tools

| Tool Category   | Count | Optimization Pattern                                                      |
| --------------- | ----- | ------------------------------------------------------------------------- |
| Generated tools | 23    | Summary counts + top 5 items in `structuredContent`, full data in `_meta` |
| `search`        | 1     | As above                                                                  |
| `fetch`         | 1     | Summary in content, full resource in `_meta`                              |
| `get-help`      | 1     | Concise help in structured, detailed in `_meta`                           |
| `get-ontology`  | 1     | Summary in content, full ontology in `_meta`                              |

### Acceptance Criteria - Task 2

| Criterion                                              | Verification        |
| ------------------------------------------------------ | ------------------- |
| Widget renders from `_meta.fullResults`                | Playwright test     |
| Widget falls back to `structuredContent` if no `_meta` | Playwright test     |
| Model token usage reduced by ≥50% for large results    | Manual verification |
| No regression in search functionality                  | Integration test    |

---

## Task 3: Locale Support (from Phase 4.2)

**Priority**: MEDIUM  
**Duration**: ~1 hour

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### Implementation

```javascript
// Read locale from OpenAI client context
const locale = window.openai?.locale ?? 'en-GB';

// Format dates according to locale
function formatDate(dateStr) {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
  }).format(new Date(dateStr));
}

// Adjust terminology for locale
function getKeyStageLabel(ks) {
  // UK-specific terminology
  return `Key Stage ${ks.replace('ks', '')}`;
}
```

### Acceptance Criteria - Task 3

| Criterion                           | Verification    |
| ----------------------------------- | --------------- |
| Widget reads `window.openai.locale` | Playwright test |
| Dates formatted according to locale | Playwright test |
| Graceful fallback to 'en-GB'        | Unit test       |

---

## Task 4: External Links (from Phase 5.2)

**Priority**: LOW  
**Duration**: ~30 minutes

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### Implementation

```javascript
// Use openExternal for Oak website links
function openOnOakWebsite(url) {
  if (window.openai?.openExternal) {
    window.openai.openExternal({ href: url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
```

### Acceptance Criteria - Task 4

| Criterion                                        | Verification    |
| ------------------------------------------------ | --------------- |
| External links use `openExternal` when available | Playwright test |
| Fallback to `window.open` when API unavailable   | Playwright test |

---

## Task 5: Display Mode Requests (from Phase 5.3)

**Priority**: LOW  
**Duration**: ~30 minutes

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### Implementation

```javascript
// Request fullscreen for curriculum browsing
async function requestFullscreen() {
  const result = await window.openai?.requestDisplayMode?.({ mode: 'fullscreen' });
  if (result?.mode === 'fullscreen') {
    document.body.classList.add('fullscreen');
  }
}
```

### Acceptance Criteria - Task 5

| Criterion                                    | Verification    |
| -------------------------------------------- | --------------- |
| Fullscreen mode request handled gracefully   | Playwright test |
| Fallback behavior works when API unavailable | Playwright test |

---

## Execution Order

1. **Task 1** (STDIO bug) - Quick fix, independent
2. **Task 2** (Token optimization) - Main work, TDD approach
3. **Task 3** (Locale) - After widget changes in Task 2
4. **Tasks 4-5** (External links, display modes) - Low priority, can defer

---

## Verification Commands

```bash
# After all tasks:
pnpm test
pnpm lint
pnpm type-check
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
```

---

## References

- [Parent Plan (Archived)](../archive/08-openai-apps-sdk-feature-adoption-plan.archived.md)
- [Implementation Prompt](../../prompts/phase-8a-token-optimization-and-widget-features.prompt.md)
- [OpenAI Apps SDK Reference](../../reference-docs/openai-apps/openai-apps-sdk-reference.md)
- [Testing Strategy](../../directives/testing-strategy.md)
