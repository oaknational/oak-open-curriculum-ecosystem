# OpenAI Apps SDK Data Return Mechanisms: Analysis and Optimization

## Overview

This research document analyses the three data return mechanisms in the OpenAI Apps SDK (`structuredContent`, `content`, `_meta`), reviews the current Oak MCP implementation, and proposes optimizations for both general use and Oak context grounding.

**Date**: December 2025  
**Related Docs**:

- [OpenAI Apps SDK Reference](https://developers.openai.com/apps-sdk/reference)
- [Build ChatGPT UI Guide](https://developers.openai.com/apps-sdk/build/chatgpt-ui)

---

## 1. Deep Dive: Data Return Mechanisms

The OpenAI Apps SDK defines three sibling payloads in tool responses, each serving a distinct purpose in the ChatGPT ecosystem.

### 1.1 `content` — Model + Conversation Display

| Aspect            | Description                                                            |
| ----------------- | ---------------------------------------------------------------------- |
| **Purpose**       | Optional narration for the model's response (Markdown/plaintext)       |
| **Visibility**    | Model sees it; appears in conversation transcript                      |
| **Format**        | `string` or `Content[]` (typically `[{ type: 'text', text: string }]`) |
| **Token Impact**  | Counts against model context                                           |
| **Best Practice** | Keep concise; use for human-readable summaries                         |

**From OpenAI Docs:**

> `content` – optional narration (Markdown or plaintext) for the model's response.

### 1.2 `structuredContent` — Model + Widget

| Aspect            | Description                                                           |
| ----------------- | --------------------------------------------------------------------- |
| **Purpose**       | Concise JSON for model reasoning AND widget rendering                 |
| **Visibility**    | Model reads verbatim; widget receives via `window.openai.toolOutput`  |
| **Format**        | Object matching optional `outputSchema`                               |
| **Token Impact**  | Counts against model context — **keep minimal**                       |
| **Best Practice** | Include only what model needs; oversized payloads degrade performance |

**From OpenAI Docs:**

> `structuredContent` – concise JSON the widget uses _and_ the model reads. Include only what the model should see.

**Critical Insight:**

> "The model reads `structuredContent` to narrate what happened, so keep it tight and idempotent—ChatGPT may retry tool calls."

### 1.3 `_meta` — Widget Only (Hidden from Model)

| Aspect            | Description                                                                        |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Purpose**       | Large or sensitive data exclusively for the widget                                 |
| **Visibility**    | **Never reaches the model** — widget only via `window.openai.toolResponseMetadata` |
| **Format**        | Object with arbitrary structure                                                    |
| **Token Impact**  | **Zero** — doesn't count against model context                                     |
| **Best Practice** | Put all rich/large data here; widget can access full details                       |

**From OpenAI Docs:**

> `_meta` is forwarded to the component so you can hydrate UI without exposing the data to the model.

### 1.4 Summary Comparison

```text
┌─────────────────────┬───────────────────┬───────────────────┬───────────────────┐
│                     │     content       │ structuredContent │       _meta       │
├─────────────────────┼───────────────────┼───────────────────┼───────────────────┤
│ Model sees          │        ✅         │        ✅         │        ❌         │
│ Widget sees         │        ✅         │        ✅         │        ✅         │
│ Conversation shows  │        ✅         │        ❌         │        ❌         │
│ Token impact        │       High        │       High        │       None        │
│ Ideal for           │ Summaries/status  │ Minimal data      │ Full/rich data    │
└─────────────────────┴───────────────────┴───────────────────┴───────────────────┘
```

### 1.5 Intended Design Pattern

The OpenAI Apps SDK is designed for a **split data pattern**:

1. **`content`**: Brief, human-readable status/summary
2. **`structuredContent`**: Minimal JSON for model reasoning (summaries, counts, preview items)
3. **`_meta`**: Complete data for widget rendering

This pattern minimizes token usage while enabling rich UI experiences.

---

## 2. Current Oak Implementation Review

### 2.1 Generated Tools (26 tools from OpenAPI)

**Location**: `packages/sdks/oak-curriculum-sdk/src/types/generated/api-schema/mcp-tools/`

#### Tool Descriptions ✅ Good

All generated tools include prerequisite guidance:

```typescript
description: "Lesson summary\n\nThis tool returns a summary for a given lesson\n\n
PREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology`
first to understand key stages, subjects, entity hierarchy, and ID formats."
```

This is generated at type-gen time via `tool-description.ts`:

```typescript
export const DOMAIN_PREREQUISITE_GUIDANCE = `

PREREQUISITE: If unfamiliar with Oak's curriculum structure, call \`get-ontology\` 
first to understand key stages, subjects, entity hierarchy, and ID formats.`;
```

#### OpenAI Apps SDK \_meta Fields ✅ Good

All generated tools have proper \_meta:

```typescript
_meta: {
  'openai/outputTemplate': 'ui://widget/oak-json-viewer.html',
  'openai/toolInvocation/invoking': "Fetching Get Lessons Summary…",
  'openai/toolInvocation/invoked': "Get Lessons Summary loaded",
  'openai/widgetAccessible': true,
  'openai/visibility': 'public',
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
}
```

#### Data Return Pattern ⚠️ Suboptimal

Generated tools use `formatData()` which puts **everything** in both `content` AND `structuredContent`:

```typescript
// From executor.ts
function mapExecutionResult(result: ToolExecutionResult): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }
  return formatData({ status: outcome.status, data: outcome.data });
}

// From universal-tool-shared.ts
export function formatData(data: unknown): CallToolResult {
  const normalised = serialiseArg(data);
  const content: TextContent = { type: 'text', text: JSON.stringify(normalised) };
  const structuredContent: StructuredContent = isStructuredContent(normalised)
    ? normalised
    : { data: normalised };
  return { content: [content], structuredContent };
}
```

**Problem**: Full API responses go into `structuredContent`, consuming model tokens unnecessarily.

### 2.2 Aggregated Tools (4 tools)

**Location**: `packages/sdks/oak-curriculum-sdk/src/mcp/`

| Tool           | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `search`       | Full-text search across lessons and transcripts |
| `fetch`        | Retrieve detailed content by prefixed ID        |
| `get-ontology` | Return curriculum domain model structure        |
| `get-help`     | Return tool usage guidance                      |

#### Tool Descriptions ✅ Excellent

Follow the OpenAI-recommended "Use this when / Do NOT use" pattern:

```typescript
description: `Search across lessons and transcripts for curriculum content.

${AGGREGATED_PREREQUISITE_GUIDANCE}

Use this when you need to:
- Find lessons on a topic (e.g., "photosynthesis", "fractions")
- Discover what content exists for a key stage or subject
- Search transcript text for specific concepts

Do NOT use for:
- Fetching known content by ID (use 'fetch')
- Understanding the curriculum structure (use 'get-ontology')

Executes get-search-lessons and get-search-transcripts in parallel.`;
```

#### Data Return Pattern ✅ Optimized

Uses `formatOptimizedResult()` which properly splits data:

```typescript
export function formatOptimizedResult(options: OptimizedResultOptions): CallToolResult {
  const serialisedFullData = serialiseArg(options.fullData);
  const meta = buildMeta(options, serialisedFullData); // Full data in _meta
  const structuredContent = buildStructuredContent(options); // Minimal preview
  const content: TextContent = { type: 'text', text: options.summary };
  return { content: [content], structuredContent, _meta: meta };
}
```

**structuredContent** contains:

- `summary`: Human-readable text
- `previewItems`: Max 5 items
- `hasMore`: Boolean indicator
- `status`: Optional status string

**\_meta** contains:

- `fullResults`: Complete data
- `toolName`: For widget routing
- `annotations/title`: Human-readable title
- `query`, `timestamp`: Context

### 2.3 Widget Description

**Location**: `apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`

```typescript
const WIDGET_DESCRIPTION =
  'Oak National Academy curriculum explorer showing lessons, units, quizzes, and teaching resources.';
```

**Assessment**: Generic description; doesn't guide model behaviour.

### 2.4 Context Guidance Placement Issue ⚠️

Current implementation has context guidance in `_meta`:

```typescript
const CONTEXT_GUIDANCE =
  'If you have not already, use the get-help and get-ontology tools to understand the Oak context';

function buildMeta(options: OptimizedResultOptions, serialisedFullData: unknown): UnknownRecord {
  const meta: UnknownRecord = { fullResults: serialisedFullData, context: CONTEXT_GUIDANCE };
  // ...
}
```

**Problem**: `_meta` is **never seen by the model**. This guidance only helps the widget, not the model's reasoning about what tools to call next.

---

## 3. Optimization Recommendations

### 3.1 General Optimizations

#### A. Generated Tools Should Use `formatOptimizedResult`

**Current**: Full API responses in `structuredContent` consuming model tokens.

**Proposed**: Update `mapExecutionResult` in `executor.ts`:

```typescript
function mapExecutionResult(
  result: ToolExecutionResult,
  toolName: string,
  title: string,
): CallToolResult {
  const outcome = extractExecutionData(result);
  if (!outcome.ok) {
    return formatError(toErrorMessage(outcome.error));
  }

  return formatOptimizedResult({
    summary: `${title} completed successfully`,
    fullData: outcome.data,
    previewItems: extractPreviewItems(outcome.data),
    status: String(outcome.status),
    toolName,
    annotationsTitle: title,
  });
}

function extractPreviewItems(data: unknown): readonly unknown[] {
  // Extract array items if present, otherwise return empty
  if (typeof data === 'object' && data !== null) {
    const asRecord = data as Record<string, unknown>;
    // Common patterns: { items: [] }, { results: [] }, { lessons: [] }, etc.
    for (const key of ['items', 'results', 'lessons', 'units', 'subjects', 'data']) {
      const value = asRecord[key];
      if (Array.isArray(value)) {
        return value;
      }
    }
  }
  return [];
}
```

**Impact**: ~80% reduction in model token usage for large responses.

#### B. Add Context Guidance to `structuredContent`

**Current**: Context guidance in `_meta` (model-invisible).

**Proposed**: Include in `structuredContent`:

```typescript
function buildStructuredContent(options: OptimizedResultOptions): UnknownRecord {
  const { summary, previewItems, status } = options;
  const structuredContent: UnknownRecord = {
    summary,
    // ADD: Model-visible context hint
    oakContextHint:
      'For best results, ensure you have called get-ontology and get-help to understand Oak curriculum structure.',
  };
  if (previewItems !== undefined) {
    const serialisedPreview = serialiseArg(previewItems);
    const previewArray = Array.isArray(serialisedPreview) ? serialisedPreview : [];
    structuredContent.previewItems = previewArray.slice(0, MAX_PREVIEW_ITEMS);
    structuredContent.hasMore = previewArray.length > MAX_PREVIEW_ITEMS;
  }
  if (status !== undefined) {
    structuredContent.status = status;
  }
  return structuredContent;
}
```

#### C. Enhance Widget Description

**Current**:

```typescript
const WIDGET_DESCRIPTION =
  'Oak National Academy curriculum explorer showing lessons, units, quizzes, and teaching resources.';
```

**Proposed**:

```typescript
const WIDGET_DESCRIPTION =
  'Oak Curriculum explorer. For optimal results, the model should call get-ontology first to understand the curriculum domain model, entity hierarchy, and ID formats.';
```

**Note**: Per OpenAI docs, `openai/widgetDescription` is "surfaced to the model when the component loads, reducing redundant assistant narration."

### 3.2 Oak Context Grounding Optimizations

#### A. Standardize Tool Description Pattern

All tools should follow this enhanced pattern:

```typescript
description: `[ONE-LINE SUMMARY]

CONTEXT: If you haven't already, call get-ontology to understand Oak's curriculum 
structure before using this tool.

Use this when you need to:
- [Use case 1]
- [Use case 2]

Do NOT use for:
- [Anti-pattern 1] (use '[alternative]' instead)
- [Anti-pattern 2]

[ADDITIONAL DETAILS]`;
```

#### B. Add Oak-Specific Metadata to structuredContent

Every tool response should include context metadata visible to the model:

```typescript
structuredContent: {
  summary: "...",
  previewItems: [...],
  // ADD: Oak-specific context for model reasoning
  oakContext: {
    recommendedIfNew: ['get-ontology', 'get-help'],
    toolCategory: 'curriculum-content', // or 'metadata', 'search', 'discovery'
    relatedTools: ['get-lessons-summary', 'get-units-summary'],
  }
}
```

#### C. Enhance get-ontology Response with Next Steps

Update `runOntologyTool` to include actionable guidance:

```typescript
export function runOntologyTool(): CallToolResult {
  return formatOptimizedResult({
    summary:
      'Oak Curriculum domain model loaded. Includes key stages, subjects, entity hierarchy, and tool guidance.',
    fullData: ontologyData,
    status: 'success',
    toolName: 'get-ontology',
    annotationsTitle: 'Get Curriculum Ontology',
  });
}
```

**Proposed enhancement** — add to structuredContent:

```typescript
{
  summary: '...',
  nextSteps: [
    'Use "search" to find lessons on a topic',
    'Use "fetch" with type:slug format (e.g., "lesson:adding-fractions") to retrieve specific content',
    'Use "get-help" for detailed tool usage guidance',
  ],
  quickReference: {
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    idFormat: 'type:slug (e.g., lesson:adding-fractions, unit:algebra-basics)',
    entityHierarchy: 'subject → unit → lesson',
  }
}
```

#### D. Consider a Bootstrap Aggregated Tool

Create a new tool `oak-bootstrap` that provides a single entry point for context grounding:

```typescript
export const OAK_BOOTSTRAP_TOOL_DEF = {
  description: `Initialize Oak curriculum context by loading domain model and tool guidance.

RECOMMENDED FIRST CALL: Use this before other Oak tools to understand the curriculum structure.

This tool combines:
- get-ontology: Curriculum structure, key stages, entity hierarchy, ID formats
- get-help: Tool usage guidance, workflows, best practices

Returns a comprehensive context object for effective curriculum exploration.`,
  inputSchema: { type: 'object', properties: {}, additionalProperties: false },
  // ... other metadata
};

export async function runBootstrapTool(): Promise<CallToolResult> {
  const ontology = runOntologyTool();
  const help = await runHelpTool({});

  return formatOptimizedResult({
    summary:
      'Oak context initialized. You now understand the curriculum structure and available tools.',
    fullData: {
      ontology: ontology._meta?.fullResults,
      help: help._meta?.fullResults,
    },
    status: 'success',
    toolName: 'oak-bootstrap',
    annotationsTitle: 'Initialize Oak Context',
  });
}
```

---

## 4. Implementation Priority

| Priority  | Optimization                                 | Effort | Impact                              |
| --------- | -------------------------------------------- | ------ | ----------------------------------- |
| 🔴 High   | Generated tools use `formatOptimizedResult`  | Medium | Major token savings                 |
| 🔴 High   | Move context guidance to `structuredContent` | Low    | Model sees grounding hints          |
| 🟡 Medium | Enhance widget description                   | Low    | Better model context on widget load |
| 🟡 Medium | Standardize tool description pattern         | Medium | Consistent tool selection           |
| 🟢 Low    | Add `oakContext` to structuredContent        | Low    | Richer model guidance               |
| 🟢 Low    | Create `oak-bootstrap` tool                  | Medium | Single entry point                  |

---

## 5. Validation Approach

### 5.1 Token Usage Measurement

Before/after comparison of model token consumption:

```typescript
// Test harness
async function measureTokenImpact(toolName: string): Promise<void> {
  const result = await executeTool(toolName, testArgs);

  const structuredTokens = estimateTokens(JSON.stringify(result.structuredContent));
  const contentTokens = estimateTokens(result.content?.[0]?.text ?? '');
  const metaTokens = estimateTokens(JSON.stringify(result._meta));

  console.log({
    toolName,
    modelVisibleTokens: structuredTokens + contentTokens,
    widgetOnlyTokens: metaTokens,
    ratio: (structuredTokens + contentTokens) / metaTokens,
  });
}
```

### 5.2 Model Behaviour Testing

Test whether the model follows context guidance:

1. **Control**: Call curriculum tools without prior get-ontology
2. **Treatment**: Call curriculum tools after get-ontology
3. **Measure**: Success rate, parameter accuracy, follow-up questions

### 5.3 Widget Functionality

Ensure widget still renders correctly with optimized responses:

1. All data available via `window.openai.toolResponseMetadata.fullResults`
2. Preview items display correctly
3. "Show more" functionality works

---

## 6. Related Work

- [ADR-054: Tool-Level Auth Error Interception](../../../docs/architecture/architectural-decisions/054-tool-level-auth-error-interception.md)
- [OpenAI Apps SDK Metadata Optimization Guide](https://developers.openai.com/apps-sdk/guides/optimize-metadata)
- [MCP Specification: Tool Results](https://modelcontextprotocol.io/specification/2025-06-18/server/tools#tool-result)

---

## 7. Appendix: OpenAI Apps SDK Follow-Up Messages

### `window.openai.sendFollowUpMessage`

This API allows widgets to insert messages into the conversation as if the user typed them:

```typescript
await window.openai.sendFollowUpMessage({
  prompt: 'Draft a tasting itinerary for the pizzerias I favourited.',
});
```

**Key characteristics**:

- Appears as a **user message** in the conversation
- Triggers a new model response turn
- Maintains widget state when submitted through widget controls

**Potential use for context grounding**:
While technically possible to use `sendFollowUpMessage` to prompt the model to call context tools, this is **not recommended** because:

1. The message appears as if from the user (confusing UX)
2. It's visible in the conversation transcript
3. It's a workaround rather than a proper mechanism

**Better approaches** (implemented in recommendations above):

1. Tool descriptions with "PREREQUISITE" guidance
2. `structuredContent` with context hints
3. Widget description with guidance
4. Bootstrap tool for single-call context loading
