# Plan 08: OpenAI Apps SDK Feature Adoption

**Created**: 2025-11-30  
**Status**: 🔴 NOT STARTED  
**Duration**: ~4-6 days (across phases)  
**Focus**: Comprehensive adoption of OpenAI Apps SDK features for production readiness

---

## Overview

This plan implements all OpenAI Apps SDK features not currently being used by the Oak Curriculum MCP server. These features are critical for production deployment, user experience, and token optimization.

### Goals

1. **Production Readiness**: Implement required security and CSP configurations
2. **Interactive Widgets**: Enable component-initiated tool calls and state persistence
3. **Token Optimization**: Use tool result `_meta` to reduce model token consumption
4. **Enhanced UX**: Add localization, display modes, and follow-up messages

### Foundational Commitments

All work MUST align with:

- [`.agent/directives-and-memory/rules.md`](../../directives-and-memory/rules.md) - Cardinal Rule, TDD, type safety
- [`.agent/directives-and-memory/schema-first-execution.md`](../../directives-and-memory/schema-first-execution.md) - Generator-first architecture
- [`.agent/directives-and-memory/testing-strategy.md`](../../directives-and-memory/testing-strategy.md) - TDD at all levels

### Reference Documentation

- [OpenAI Apps SDK Reference](../../reference-docs/openai-apps-sdk-reference.md)
- [OpenAI Apps Build MCP Server](../../reference-docs/openai-apps-sdk-build-mcp-server.md)
- [OpenAI Apps Build UI](../../reference-docs/openai-apps-build-ui.md)
- [OpenAI Apps State Management](../../reference-docs/openai-apps-build-state-management.md)

---

## Two Camps: Universal Coverage Requirement

**CRITICAL PRINCIPLE**: ALL tools, resources, and prompts MUST maximally benefit from OpenAI Apps SDK features, regardless of their origin.

### Camp 1: Type-Gen Time (Schema-Derived)

These are generated at compile time from the Oak Curriculum OpenAPI schema via `pnpm type-gen`:

| Category                    | Count    | Source                                                                       |
| --------------------------- | -------- | ---------------------------------------------------------------------------- |
| **Generated Tools**         | ~30      | `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/` |
| **Documentation Resources** | Multiple | `DOCUMENTATION_RESOURCES` in SDK                                             |

**Implementation approach**: Update type-gen templates in `type-gen/typegen/mcp-tools/` to emit OpenAI `_meta` fields.

**Files**:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`
- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/templates/*.ts`

### Camp 2: Runtime (Hand-Authored)

These are defined in authored code, not generated:

| Category             | Items                                         | Source                                                                  |
| -------------------- | --------------------------------------------- | ----------------------------------------------------------------------- |
| **Aggregated Tools** | `search`, `fetch`, `get-help`, `get-ontology` | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-*/`                |
| **MCP Prompts**      | `lesson-planner`, etc.                        | `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`               |
| **Widget Resource**  | `oak-json-viewer`                             | `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` |

**Implementation approach**: Update definition files directly, following existing patterns.

**Files**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts`

### Parity Requirements

Every phase of this plan MUST ensure BOTH camps receive equivalent treatment:

| OpenAI Feature                   | Generated Tools | Aggregated Tools | Prompts | Resources     |
| -------------------------------- | --------------- | ---------------- | ------- | ------------- |
| `openai/outputTemplate`          | ✅ Type-gen     | ✅ Definition    | N/A     | N/A           |
| `openai/toolInvocation/invoking` | ✅ Type-gen     | ✅ Definition    | N/A     | N/A           |
| `openai/toolInvocation/invoked`  | ✅ Type-gen     | ✅ Definition    | N/A     | N/A           |
| `openai/widgetAccessible`        | ✅ Type-gen     | ✅ Definition    | N/A     | N/A           |
| `openai/visibility`              | ✅ Type-gen     | ✅ Definition    | N/A     | N/A           |
| `openai/widgetCSP`               | N/A             | N/A              | N/A     | ✅ Definition |
| `openai/widgetPrefersBorder`     | N/A             | N/A              | N/A     | ✅ Definition |
| `openai/widgetDescription`       | N/A             | N/A              | N/A     | ✅ Definition |
| Tool result `_meta`              | ✅ Execute.ts   | ✅ Handler       | N/A     | N/A           |

### Verification Matrix

Each phase completion requires verification across BOTH camps:

```
For each OpenAI feature F being implemented:
  ✓ Generated tools emit F via type-gen
  ✓ Aggregated tools include F in definitions
  ✓ Prompts include F where applicable
  ✓ Resources include F where applicable
  ✓ Unit tests verify F on representative items from each camp
  ✓ Integration tests verify F flows through to MCP registration
```

---

## Feature Gap Analysis

| Feature                               | Priority | Phase | Rationale                                  |
| ------------------------------------- | -------- | ----- | ------------------------------------------ |
| `openai/widgetCSP`                    | CRITICAL | 1     | **Required for production/public release** |
| `openai/widgetPrefersBorder`          | HIGH     | 1     | Better visual presentation                 |
| `openai/widgetDescription`            | HIGH     | 1     | Reduces redundant assistant narration      |
| `openai/widgetAccessible`             | HIGH     | 2     | Enables interactive widgets                |
| `window.openai.callTool()`            | HIGH     | 2     | Pagination, refresh, actions               |
| `window.openai.setWidgetState()`      | HIGH     | 2     | UI state persistence                       |
| Tool result `_meta`                   | HIGH     | 3     | Token cost reduction                       |
| `structuredContent` separation        | HIGH     | 3     | Model vs widget data split                 |
| `openai/visibility: private`          | MEDIUM   | 4     | Hidden admin/diagnostic tools              |
| `openai/locale` support               | MEDIUM   | 4     | Internationalization                       |
| `window.openai.sendFollowUpMessage()` | LOW      | 5     | Conversational continuity                  |
| `window.openai.requestDisplayMode()`  | LOW      | 5     | Fullscreen/PiP modes                       |
| `window.openai.openExternal()`        | LOW      | 5     | External links                             |

---

## Phase 1: Widget Resource Metadata (CRITICAL)

**Duration**: ~4-6 hours  
**Priority**: CRITICAL - Required for production

### Objective

Add required `_meta` fields to the widget resource registration for production deployment.

### 1.1: Add Widget CSP Configuration

**Why**: `openai/widgetCSP` is **required before broad distribution** according to OpenAI documentation.

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation** (following TDD):

1. **RED**: Write integration test specifying widget resource includes `_meta` with CSP

```typescript
// register-resources.integration.test.ts
describe('registerWidgetResource', () => {
  it('includes openai/widgetCSP in resource _meta', async () => {
    // ... test widget resource has CSP configuration
  });

  it('includes openai/widgetPrefersBorder in resource _meta', async () => {
    // ...
  });

  it('includes openai/widgetDescription in resource _meta', async () => {
    // ...
  });
});
```

2. **GREEN**: Implement `_meta` on widget resource contents

```typescript
// In register-resources.ts
contents: [
  {
    uri: AGGREGATED_TOOL_WIDGET_URI,
    mimeType: AGGREGATED_TOOL_WIDGET_MIME_TYPE,
    text: AGGREGATED_TOOL_WIDGET_HTML,
    _meta: {
      'openai/widgetPrefersBorder': true,
      'openai/widgetDescription':
        'Oak National Academy curriculum explorer showing lessons, units, quizzes, and teaching resources.',
      'openai/widgetCSP': {
        connect_domains: [], // Widget doesn't make external API calls
        resource_domains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      },
    },
  },
];
```

3. **REFACTOR**: Extract constants to dedicated module if needed

### 1.2: Type Definitions for Widget Metadata

**Files to create/modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/widget-metadata.ts` (new)

**Implementation**:

Define strongly-typed interfaces for widget `_meta` fields:

```typescript
/**
 * OpenAI Apps SDK widget resource metadata.
 *
 * @see https://developers.openai.com/apps-sdk/reference
 */
export interface WidgetResourceMeta {
  /** Human-readable summary to reduce assistant narration */
  readonly 'openai/widgetDescription'?: string;
  /** Hint for bordered card rendering */
  readonly 'openai/widgetPrefersBorder'?: boolean;
  /** Content Security Policy for the widget sandbox */
  readonly 'openai/widgetCSP'?: WidgetCSP;
  /** Dedicated subdomain for the widget */
  readonly 'openai/widgetDomain'?: string;
}

export interface WidgetCSP {
  /** Domains allowed for fetch/XHR (connect-src) */
  readonly connect_domains: readonly string[];
  /** Domains allowed for images, fonts, etc. (resource-src) */
  readonly resource_domains: readonly string[];
}
```

### Acceptance Criteria - Phase 1

| Criterion                                                   | Verification Method   |
| ----------------------------------------------------------- | --------------------- |
| Widget resource includes `openai/widgetCSP`                 | Integration test      |
| CSP allows Google Fonts domains                             | Integration test      |
| Widget resource includes `openai/widgetPrefersBorder: true` | Integration test      |
| Widget resource includes `openai/widgetDescription`         | Integration test      |
| Description is ≤200 characters and meaningful               | Unit test on constant |
| `WidgetResourceMeta` type exported from SDK                 | Build succeeds        |
| Documentation resources have appropriate `_meta`            | Integration test      |
| All existing tests pass                                     | `pnpm test`           |
| Type-check passes                                           | `pnpm type-check`     |
| Lint passes                                                 | `pnpm lint`           |

**Camp Coverage - Phase 1**:

- Resources: Widget resource ✅, Documentation resources ✅

---

## Phase 2: Interactive Widget Capabilities

**Duration**: ~8-12 hours  
**Priority**: HIGH - Enables rich UX

### Objective

Enable the widget to call tools directly and persist UI state across renders.

### 2.1: Enable `widgetAccessible` on Tools

**Why**: Required for `window.openai.callTool()` to work from the widget.

**Schema-First Approach** (per `schema-first-execution.md`):

The `_meta["openai/widgetAccessible"]` field must be added at **type-gen time**, not runtime.

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts`

**Implementation**:

1. **Update `ToolMeta` interface** in types.ts:

```typescript
export interface ToolMeta {
  readonly [x: string]: unknown;
  readonly 'openai/outputTemplate'?: string;
  readonly 'openai/toolInvocation/invoking'?: string;
  readonly 'openai/toolInvocation/invoked'?: string;
  /** Allow widget to call this tool via window.openai.callTool() */
  readonly 'openai/widgetAccessible'?: boolean;
  /** Tool visibility: 'public' (default) or 'private' (hidden from model) */
  readonly 'openai/visibility'?: 'public' | 'private';
}
```

2. **Update type-gen template** (Camp 1 - Generated Tools):

   **File**: `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts`

   ```typescript
   // Add to _meta generation
   _meta: {
     'openai/outputTemplate': AGGREGATED_TOOL_WIDGET_URI,
     'openai/toolInvocation/invoking': /* generate from operation */,
     'openai/toolInvocation/invoked': /* generate from operation */,
     'openai/widgetAccessible': true,  // ← Add for ALL generated tools
   }
   ```

   **Verification**: After `pnpm type-gen`, check that ALL ~30 generated tool descriptors include `openai/widgetAccessible: true`.

3. **Update aggregated tool definitions** (Camp 2 - Aggregated Tools) in SDK:

   **Files to update**:
   - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts`
   - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts`
   - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/definition.ts`
   - `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`

   **Pattern for each**:

   ```typescript
   // Example: aggregated-search/tool-definition.ts
   _meta: {
     'openai/outputTemplate': AGGREGATED_TOOL_WIDGET_URI,
     'openai/toolInvocation/invoking': 'Searching...',
     'openai/toolInvocation/invoked': 'Search complete',
     'openai/widgetAccessible': true,  // ← Add to ALL aggregated tools
   }
   ```

### 2.2: Implement Widget Tool Calling

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation** (TDD):

1. **RED**: Write Playwright test for widget tool calling

```typescript
// tests/widget/widget-tool-calls.spec.ts
test.describe('Widget tool calls', () => {
  test('refresh button calls search tool with same query', async ({ page }) => {
    // Setup: render widget with search results
    // Action: click refresh button
    // Assert: callTool was invoked with expected args
  });
});
```

2. **GREEN**: Add tool-calling capability to widget HTML:

```javascript
// In widget script
async function refreshSearch() {
  if (!window.openai?.callTool) return;
  const currentQuery = window.openai.toolInput?.query;
  if (!currentQuery) return;

  const response = await window.openai.callTool('search', { query: currentQuery });
  // Response updates toolOutput automatically via set_globals event
}
```

3. **REFACTOR**: Add error handling and loading states

### 2.3: Implement Widget State Persistence

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
// Widget state management
let widgetState = window.openai?.widgetState ?? {
  expandedSections: [],
  scrollPosition: 0,
};

function updateState(newState) {
  widgetState = { ...widgetState, ...newState };
  window.openai?.setWidgetState?.(widgetState);
}

// Restore state on render
function restoreState() {
  if (widgetState.scrollPosition > 0) {
    document.documentElement.scrollTop = widgetState.scrollPosition;
  }
}

// Save scroll position on interaction
document.addEventListener(
  'scroll',
  () => {
    updateState({ scrollPosition: document.documentElement.scrollTop });
  },
  { passive: true },
);
```

### Acceptance Criteria - Phase 2

| Criterion                                                    | Verification Method |
| ------------------------------------------------------------ | ------------------- |
| `ToolMeta` type includes `widgetAccessible` and `visibility` | Type compilation    |
| Widget can call `search` tool                                | Playwright test     |
| Widget persists scroll position                              | Playwright test     |
| Widget restores state on re-render                           | Playwright test     |
| No regression in existing tests                              | `pnpm test:all`     |

**Camp Coverage - Phase 2** (BOTH camps must have `widgetAccessible`):

| Camp           | Tool           | `widgetAccessible` | Verification                        |
| -------------- | -------------- | ------------------ | ----------------------------------- |
| **Generated**  | All 30+ tools  | ✅ via type-gen    | Unit test on `MCP_TOOL_DESCRIPTORS` |
| **Aggregated** | `search`       | ✅ in definition   | Unit test on descriptor             |
| **Aggregated** | `fetch`        | ✅ in definition   | Unit test on descriptor             |
| **Aggregated** | `get-help`     | ✅ in definition   | Unit test on descriptor             |
| **Aggregated** | `get-ontology` | ✅ in definition   | Unit test on descriptor             |

**Type-Gen Verification**:

- Run `pnpm type-gen`
- Inspect generated files for `openai/widgetAccessible: true`
- Unit test asserts ALL generated tools include the field

---

## Phase 3: Tool Result Token Optimization

**Duration**: ~6-8 hours  
**Priority**: HIGH - Reduces API costs

### Objective

Use tool result `_meta` to send large/detailed data only to the widget, keeping `structuredContent` minimal for the model.

### 3.1: Define Tool Result Structure

**Schema-First Approach**:

Tool result types must be defined in SDK type-gen, not hand-authored.

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/tool-result.ts` (new)
- Update aggregated tool handlers

**Implementation**:

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

### 3.2: Update Search Tool to Use `_meta`

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

### 3.3: Update Widget to Read `_meta`

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
function render() {
  // Prefer _meta for full data, fall back to structuredContent
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};

  const fullResults = meta.fullResults ?? output.data;
  // ... render using fullResults
}
```

### Acceptance Criteria - Phase 3

| Criterion                                              | Verification Method |
| ------------------------------------------------------ | ------------------- |
| Widget renders from `_meta.fullResults`                | Playwright test     |
| Widget falls back to `structuredContent` if no `_meta` | Playwright test     |
| Model token usage reduced by ≥50% for large results    | Manual verification |
| No regression in search functionality                  | Integration test    |

**Camp Coverage - Phase 3** (BOTH camps must optimize results):

| Camp           | Tool           | `_meta` in Results | Verification                                    |
| -------------- | -------------- | ------------------ | ----------------------------------------------- |
| **Generated**  | All API tools  | ✅ via execute.ts  | Integration test on tool execution              |
| **Aggregated** | `search`       | ✅ in handler      | Unit test - `structuredContent` ≤10 items       |
| **Aggregated** | `fetch`        | ✅ in handler      | Unit test - summary in content, full in `_meta` |
| **Aggregated** | `get-help`     | ✅ in handler      | Unit test - concise structured, full in `_meta` |
| **Aggregated** | `get-ontology` | ✅ in handler      | Unit test - summary in content, full in `_meta` |

**Token Optimization Pattern** (apply to ALL tools):

```typescript
// Minimal for model reasoning
structuredContent: { summary: '...', count: N, topItems: [...].slice(0,5) }
// Full for widget rendering
_meta: { fullData: [...], query: '...', timestamp: Date.now() }
```

---

## Phase 4: Tool Visibility and Localization

**Duration**: ~4-6 hours  
**Priority**: MEDIUM

### Objective

Add private tool support and basic localization.

### 4.1: Private Tool Support

**Use Case**: Internal diagnostic/admin tools hidden from model but callable from widget.

**Files to modify**:

- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` (already in Phase 2)
- Add example private tool for diagnostics

**Implementation**:

```typescript
// Example: Rate limit info tool (widget-only)
const RATE_LIMIT_INFO_DEF = {
  name: 'get-rate-limit-info',
  description: 'Internal: Returns current rate limit status',
  inputSchema: { type: 'object', properties: {} },
  annotations: { readOnlyHint: true },
  _meta: {
    'openai/widgetAccessible': true,
    'openai/visibility': 'private', // Hidden from model
  },
};
```

### 4.2: Locale Support

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

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

### Acceptance Criteria - Phase 4

| Criterion                                                  | Verification Method |
| ---------------------------------------------------------- | ------------------- |
| Private tools not listed in `tools/list` response to model | E2E test            |
| Private tools callable via widget `callTool()`             | Playwright test     |
| Widget reads `window.openai.locale`                        | Playwright test     |
| Dates formatted according to locale                        | Playwright test     |

**Camp Coverage - Phase 4** (visibility support in BOTH camps):

| Camp           | Implementation                              | Verification                       |
| -------------- | ------------------------------------------- | ---------------------------------- |
| **Generated**  | Type-gen template emits `openai/visibility` | Unit test on generated descriptors |
| **Aggregated** | Definitions include `openai/visibility`     | Unit test on each aggregated tool  |
| **Prompts**    | N/A (prompts always visible)                | -                                  |

**Private Tool Examples**:

- `get-rate-limit-info` (diagnostic, widget-only)
- `debug-ontology` (admin, widget-only)

---

## Phase 5: Enhanced Widget Runtime Features

**Duration**: ~4-6 hours  
**Priority**: LOW - Nice-to-have UX improvements

### Objective

Implement remaining widget runtime APIs for enhanced user experience.

### 5.1: Follow-Up Messages

**Files to modify**:

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

**Implementation**:

```javascript
// Add "Ask about this" button for lessons
async function askAboutLesson(lesson) {
  await window.openai?.sendFollowUpMessage?.({
    prompt: `Tell me more about the lesson "${lesson.lessonTitle}" - what are the key learning objectives?`,
  });
}
```

### 5.2: External Links

**Implementation**:

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

### 5.3: Display Mode Requests

**Implementation**:

```javascript
// Request fullscreen for curriculum browsing
async function requestFullscreen() {
  const result = await window.openai?.requestDisplayMode?.({ mode: 'fullscreen' });
  if (result?.mode === 'fullscreen') {
    document.body.classList.add('fullscreen');
  }
}
```

### Acceptance Criteria - Phase 5

| Criterion                                        | Verification Method |
| ------------------------------------------------ | ------------------- |
| "Ask about this" triggers follow-up message      | Playwright test     |
| External links use `openExternal` when available | Playwright test     |
| Fullscreen mode request handled gracefully       | Playwright test     |
| Fallback behavior works when APIs unavailable    | Playwright test     |

---

## Implementation Order and Dependencies

```
Phase 1: Widget Resource Metadata (CRITICAL)
    ↓ (no dependencies)
Phase 2: Interactive Widget Capabilities
    ↓ (depends on Phase 1 for CSP)
Phase 3: Tool Result Token Optimization
    ↓ (can run parallel to Phase 2)
Phase 4: Tool Visibility and Localization
    ↓ (depends on Phase 2 for widgetAccessible)
Phase 5: Enhanced Widget Runtime Features
    (depends on Phase 2 for interactive capabilities)
```

**Recommended execution**:

1. Phase 1 first (blocks production deployment)
2. Phases 2 and 3 in parallel
3. Phase 4 after Phase 2
4. Phase 5 as time permits

---

## Testing Strategy

Per [testing-strategy.md](../../directives-and-memory/testing-strategy.md):

### Unit Tests (Pure Functions)

- Widget metadata constant validation
- Tool result structure validation
- Locale formatting functions

**Location**: `*.unit.test.ts` next to source files

### Integration Tests (Code Units Working Together)

- Widget resource registration with `_meta`
- Tool handlers returning optimized results

**Location**: `*.integration.test.ts` next to source files

### E2E Tests (Running System)

- Widget renders correctly in ChatGPT sandbox
- Tool calls from widget work end-to-end

**Location**: `e2e-tests/*.e2e.test.ts`

### Playwright Tests (UI)

- Widget state persistence
- Tool refresh functionality
- Follow-up message buttons

**Location**: `tests/widget/*.spec.ts`

---

## Schema-First Compliance

Per [schema-first-execution.md](../../directives-and-memory/schema-first-execution.md):

| Requirement                               | Compliance                     |
| ----------------------------------------- | ------------------------------ |
| `_meta` fields generated at type-gen time | ✅ Type-gen templates updated  |
| No hand-authored type widening            | ✅ All types from SDK          |
| Runtime files are thin facades            | ✅ Widget reads from SDK types |
| Generator is single source of truth       | ✅ All metadata from type-gen  |

### Prohibited Practices Avoided

- ❌ No `as unknown` or type assertions
- ❌ No manual editing of generated files
- ❌ No fallbacks for missing descriptors
- ❌ No re-validation in runtime code

---

## Risk Mitigation

| Risk                                    | Mitigation                                      |
| --------------------------------------- | ----------------------------------------------- |
| CSP blocks Google Fonts                 | Test in MCP Inspector before deployment         |
| `callTool` not available in all clients | Graceful degradation, check for API presence    |
| Widget state lost on client update      | Persist minimal state, rebuild from tool output |
| Token optimization breaks clients       | Feature flag, gradual rollout                   |

---

## Success Metrics

| Metric                            | Target   | Measurement             |
| --------------------------------- | -------- | ----------------------- |
| Production CSP configured         | 100%     | Deployment checklist    |
| Widget accessibility enabled      | 4+ tools | Tool descriptor audit   |
| Token reduction for large results | ≥50%     | Before/after comparison |
| Widget state persistence          | Works    | Playwright test suite   |
| All tests passing                 | 100%     | CI pipeline             |

---

## Universal Coverage Checklist

**Before marking any phase complete**, verify ALL items from BOTH camps:

### Tools Checklist

| Feature                          | Generated Tools (~30) | Aggregated Tools (4)            |
| -------------------------------- | --------------------- | ------------------------------- |
| `openai/outputTemplate`          | ☐ Type-gen            | ☐ search, fetch, help, ontology |
| `openai/toolInvocation/invoking` | ☐ Type-gen            | ☐ search, fetch, help, ontology |
| `openai/toolInvocation/invoked`  | ☐ Type-gen            | ☐ search, fetch, help, ontology |
| `openai/widgetAccessible`        | ☐ Type-gen            | ☐ search, fetch, help, ontology |
| `openai/visibility`              | ☐ Type-gen            | ☐ search, fetch, help, ontology |
| Tool result `_meta`              | ☐ execute.ts          | ☐ Each handler                  |
| `annotations.readOnlyHint`       | ☐ Already done        | ☐ Already done                  |

### Resources Checklist

| Feature                      | Widget Resource | Documentation Resources |
| ---------------------------- | --------------- | ----------------------- |
| `openai/widgetCSP`           | ☐               | N/A                     |
| `openai/widgetPrefersBorder` | ☐               | N/A                     |
| `openai/widgetDescription`   | ☐               | ☐ (if applicable)       |

### Prompts Checklist

| Feature                 | MCP Prompts            |
| ----------------------- | ---------------------- |
| Proper argument schemas | ☐ lesson-planner, etc. |
| Integration with widget | ☐ If applicable        |

---

## Final Verification

Run these commands after ALL phases complete:

```bash
# 1. Type-gen produces all metadata
pnpm type-gen

# 2. All tests pass (both camps covered)
pnpm test:all

# 3. Lint passes
pnpm lint

# 4. Type-check passes
pnpm type-check

# 5. E2E tests verify runtime behavior
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:e2e

# 6. Playwright tests verify widget functionality
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test:ui
```

---

## References

### Internal Documentation

- [Rules](../../directives-and-memory/rules.md)
- [Schema-First Execution](../../directives-and-memory/schema-first-execution.md)
- [Testing Strategy](../../directives-and-memory/testing-strategy.md)
- [Plan 01: Tool Metadata Enhancement](./01-mcp-tool-metadata-enhancement-plan.md)

### External Documentation

- [OpenAI Apps SDK Reference](https://developers.openai.com/apps-sdk/reference)
- [OpenAI Apps SDK: Build MCP Server](https://developers.openai.com/apps-sdk/build/mcp-server)
- [OpenAI Apps SDK: Build ChatGPT UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [OpenAI Apps SDK: State Management](https://developers.openai.com/apps-sdk/build/state-management)
- [OpenAI Apps SDK: Optimize Metadata](https://developers.openai.com/apps-sdk/guides/optimize-metadata)
- [MCP Specification: Tools](https://spec.modelcontextprotocol.io/specification/server/tools/)
