# Phase 8a: Token Optimization and Widget Features

## Context

You are implementing Phase 8a of the OpenAI Apps SDK feature adoption for the Oak Curriculum MCP server. Prior phases (0.6, 1, 2) are complete - the server has HTTP security headers, widget resource metadata, and full `_meta` on all 27 tools.

## Required Reading (MUST read before starting)

Read these foundational documents in order:

1. `.agent/directives/rules.md` - Cardinal rules including schema-first types, TDD, no type shortcuts
2. `.agent/directives/schema-first-execution.md` - Type-gen drives all MCP tool behaviour
3. `.agent/directives/testing-strategy.md` - TDD at all levels, test definitions
4. `.agent/plans/sdk-and-mcp-enhancements/08a-openai-apps-sdk-part-1.md` - The implementation plan
5. `.agent/reference-docs/openai-apps/` - OpenAI Apps SDK documentation

## Critical Principles

### TDD at ALL Levels (Non-Negotiable)

Write tests FIRST at the appropriate level:

- **Unit tests**: For pure functions (no IO, no mocks)
- **Integration tests**: For code units working together (simple mocks injected as arguments)
- **E2E tests**: For running system behaviour

**Cycle**: RED (test fails) → GREEN (minimal code to pass) → REFACTOR

### Schema-First (Non-Negotiable)

For generated tools, changes MUST happen at type-gen time via templates in `type-gen/typegen/mcp-tools/parts/`. Never manually edit generated files.

### No Type Shortcuts (Non-Negotiable)

Never use `as`, `any`, `!`, `Record<string, unknown>`, `[x: string]: unknown`. Preserve exact types from data structures.

---

## Tasks Overview

| Task                              | Priority | Duration | Source    |
| --------------------------------- | -------- | -------- | --------- |
| 1. Fix STDIO tool description bug | MEDIUM   | ~30 min  | Phase 0.2 |
| 2. Tool result token optimization | HIGH     | ~4-5 hrs | Phase 3   |
| 3. Locale support                 | MEDIUM   | ~1 hr    | Phase 4.2 |
| 4. External links                 | LOW      | ~30 min  | Phase 5.2 |
| 5. Display mode requests          | LOW      | ~30 min  | Phase 5.3 |

---

## Task 1: Fix STDIO Tool Description Bug

### Problem

STDIO server overrides rich OpenAPI descriptions with "GET /path" strings.

### File

`apps/oak-curriculum-mcp-stdio/src/app/server.ts`

### TDD Approach

1. **RED**: Write unit test that expects tool descriptions to use OpenAPI descriptions
2. **GREEN**: Fix the code:

```typescript
// Replace
const description = descriptor.method.toUpperCase() + ' ' + descriptor.path;
// With
const description =
  descriptor.description ?? `${descriptor.method.toUpperCase()} ${descriptor.path}`;
```

3. **REFACTOR**: Clean up if needed

### Verification

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

## Task 2: Tool Result Token Optimization (Main Work)

### Objective

Use tool result `_meta` to send full data only to widget, keeping `structuredContent` minimal for the model. Target: ≥50% token reduction.

### Current State

All tool results send full data to the model:

```typescript
return {
  content: [{ type: 'text', text: JSON.stringify({ status, data }) }],
};
```

### Target State

```typescript
return {
  structuredContent: {
    summary: `Found ${count} items`,
    topItems: items.slice(0, 5),
    hasMore: count > 5,
  },
  content: [{ type: 'text', text: `Found ${count} items matching query.` }],
  _meta: {
    fullResults: items,
    query,
    timestamp: Date.now(),
  },
};
```

### Sub-Tasks

#### 2.1: Define Tool Result Types

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/tool-result-types.ts` (new)

**TDD**:

1. **RED**: Write unit test for `OptimizedToolResult` type structure
2. **GREEN**: Create the type:

```typescript
/**
 * MCP tool result with OpenAI Apps SDK token optimization.
 *
 * - `structuredContent`: Minimal data for model reasoning (≤5 items + summary)
 * - `content`: Human-readable summary for conversation
 * - `_meta`: Full data for widget rendering (not sent to model)
 */
export interface OptimizedToolResult<TStructured, TMeta = unknown> {
  readonly structuredContent: TStructured;
  readonly content: readonly ContentItem[];
  readonly _meta?: TMeta;
}

export interface ContentItem {
  readonly type: 'text';
  readonly text: string;
}
```

#### 2.2: Update Search Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`

**TDD**:

1. **RED**: Write integration test expecting search results to have:
   - `structuredContent` with summary and ≤5 items
   - `_meta.fullResults` with complete data
2. **GREEN**: Implement optimized return
3. **REFACTOR**: Extract helper functions

**Pattern**:

```typescript
const lessons = response.lessons ?? [];
const transcripts = response.transcripts ?? [];

return {
  structuredContent: {
    status: 'success',
    summary: `Found ${lessons.length} lessons and ${transcripts.length} transcripts`,
    lessonTitles: lessons.slice(0, 5).map((l) => l.lessonTitle),
    hasMore: lessons.length > 5,
  },
  content: [{ type: 'text', text: `Found ${lessons.length} lessons matching "${query}".` }],
  _meta: {
    fullResults: { lessons, transcripts },
    query,
    timestamp: Date.now(),
  },
};
```

#### 2.3: Update Fetch Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`

Same pattern: summary in `structuredContent`, full resource in `_meta`.

#### 2.4: Update Get-Help Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/execution.ts`

Same pattern: concise help in `structuredContent`, detailed help in `_meta`.

#### 2.5: Update Get-Ontology Tool

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

Same pattern: summary in `content`, full ontology in `_meta`.

#### 2.6: Update Generated Tools (Schema-First)

For generated tools, update the execute template:

**File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts`

The generated execute function should return optimized results. This requires template changes, then `pnpm type-gen`.

#### 2.7: Update Widget to Read `_meta`

**File**: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

**TDD**:

1. **RED**: Write Playwright test expecting widget to render from `_meta.fullResults`
2. **GREEN**: Implement:

```javascript
function getFullResults() {
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};
  // Prefer _meta for full data, fall back to structuredContent
  return meta.fullResults ?? output.data ?? output;
}
```

3. **REFACTOR**: Ensure graceful fallback

---

## Task 3: Locale Support

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### TDD

1. **RED**: Write Playwright test expecting dates formatted by locale
2. **GREEN**: Implement:

```javascript
const locale = window.openai?.locale ?? 'en-GB';

function formatDate(dateStr) {
  return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(dateStr));
}
```

---

## Task 4: External Links

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### TDD

1. **RED**: Write test expecting `openExternal` to be used when available
2. **GREEN**: Implement:

```javascript
function openOnOakWebsite(url) {
  if (window.openai?.openExternal) {
    window.openai.openExternal({ href: url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
```

---

## Task 5: Display Mode Requests

### File

`apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

### TDD

1. **RED**: Write test expecting fullscreen mode handling
2. **GREEN**: Implement:

```javascript
async function requestFullscreen() {
  const result = await window.openai?.requestDisplayMode?.({ mode: 'fullscreen' });
  if (result?.mode === 'fullscreen') {
    document.body.classList.add('fullscreen');
  }
}
```

---

## Execution Order

1. **Task 1** - Quick independent fix
2. **Task 2.1-2.5** - Aggregated tools token optimization (TDD for each)
3. **Task 2.6** - Generated tools (schema-first, then type-gen)
4. **Task 2.7** - Widget update
5. **Tasks 3-5** - Widget features (can defer if time-constrained)

---

## Verification Commands

After each task:

```bash
pnpm test
pnpm lint
pnpm type-check
```

After all tasks:

```bash
pnpm --filter @oaknational/oak-curriculum-sdk test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e
pnpm --filter @oaknational/oak-curriculum-mcp-stdio test
```

---

## Key Files Reference

| Purpose                    | Path                                                                                         |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| STDIO server               | `apps/oak-curriculum-mcp-stdio/src/app/server.ts`                                            |
| Search execution           | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts`                    |
| Fetch tool                 | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`                               |
| Help execution             | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/execution.ts`                      |
| Ontology tool              | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`                            |
| Generated execute template | `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-execute-file.ts` |
| Widget script              | `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`                               |
| Widget styles              | `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts`                               |
| Widget renderers           | `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers.ts`                            |

---

## OpenAI Apps SDK Reference

### Tool Result `_meta`

From the SDK docs, tool results can include `_meta` which is:

- Sent to the widget via `window.openai.toolResponseMetadata`
- NOT sent to the model (saves tokens)
- Used for full data that the widget needs but the model doesn't

### Widget APIs

- `window.openai.locale` - User's locale (e.g., 'en-GB')
- `window.openai.toolResponseMetadata` - The `_meta` from tool result
- `window.openai.openExternal({ href })` - Open external URL
- `window.openai.requestDisplayMode({ mode })` - Request fullscreen/PiP

---

## Acceptance Criteria

| Criterion                                  | Test Level               |
| ------------------------------------------ | ------------------------ |
| STDIO uses OpenAPI descriptions            | Unit                     |
| Search returns optimized result            | Integration              |
| Fetch returns optimized result             | Integration              |
| Get-help returns optimized result          | Integration              |
| Get-ontology returns optimized result      | Integration              |
| Generated tools return optimized results   | Unit (on generated code) |
| Widget reads from `_meta.fullResults`      | Playwright               |
| Widget falls back if no `_meta`            | Playwright               |
| Widget formats dates by locale             | Playwright               |
| External links use `openExternal`          | Playwright               |
| Fullscreen mode handled gracefully         | Playwright               |
| All existing tests pass                    | CI                       |
| Token usage reduced ≥50% for large results | Manual                   |

---

## Start Command

Begin by reading the foundational documents, then:

```bash
# Check current test status
pnpm test

# Start with Task 1 (STDIO bug) using TDD
```
