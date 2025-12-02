# Aggregated Tools Widget and Metadata Implementation

Implement a ChatGPT UI widget for Oak curriculum tools. This enables branded output rendering and status feedback when users invoke curriculum tools in ChatGPT.

## Required Reading (In Order)

1. `.agent/directives-and-memory/AGENT.md` - Core agent directives
2. `.agent/directives-and-memory/rules.md` - TDD, no type shortcuts, schema-first principles
3. `.agent/directives-and-memory/testing-strategy.md` - Test first (Red → Green → Refactor)
4. **`.agent/plans/sdk-and-mcp-enhancements/01-aggregated-tools-widget-metadata.md`** - The implementation plan (READ THIS CAREFULLY)
5. `.agent/plans/sdk-and-mcp-enhancements/00-ontology-poc-static-tool.md` - Completed POC (reference for patterns)
6. `.agent/reference-docs/openai-apps-sdk-reference.md` - OpenAI Apps SDK `_meta` fields
7. `.agent/reference-docs/openai-apps-build-ui.md` - How to build ChatGPT UI widgets
8. `.agent/reference-docs/mcp-docs-for-agents.md` - MCP protocol reference

## What This Is About

### The Problem

When users invoke curriculum tools in ChatGPT today:

1. **No feedback** during the 1-3 second API call (just a spinner)
2. **Raw JSON output** displayed as a code block
3. **No branding** - looks like any generic MCP tool

### The Solution

Add OpenAI Apps SDK integration so:

1. **Status text** appears during tool execution ("Searching curriculum…")
2. **Completion text** appears when done ("Search complete")
3. **Branded widget** renders the JSON output with Oak colors and Lexend font

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                        MCP SERVER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  TOOL DEFINITION                      RESOURCE                   │
│  ┌───────────────────────┐           ┌───────────────────────┐  │
│  │ name: "search"        │           │ uri: "ui://widget/..." │  │
│  │ _meta: {              │──────────▶│ mimeType:              │  │
│  │   openai/outputTemplate│  points  │   "text/html+skybridge"│  │
│  │   → "ui://widget/..." │  to      │ text: "<html>...</html>"│  │
│  │ }                     │           └───────────────────────┘  │
│  └───────────────────────┘                      │                │
│                                                 ▼                │
└─────────────────────────────────────────────────────────────────┘
                                                  │
                                                  │ ChatGPT fetches
                                                  │ resource when
                                                  │ tool completes
                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                         CHATGPT                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. User triggers tool                                           │
│  2. ChatGPT shows "Searching curriculum…" (invoking text)        │
│  3. Tool completes, returns JSON                                 │
│  4. ChatGPT shows "Search complete" (invoked text)               │
│  5. ChatGPT fetches widget resource by URI                       │
│  6. Widget HTML receives JSON via window.openai.toolOutput       │
│  7. Widget renders styled output                                 │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Three Key Concepts

### 1. Widget Resource

An MCP resource that serves HTML with a special MIME type (`text/html+skybridge`). ChatGPT recognizes this as a "widget" and renders it in a sandbox with the `window.openai` API available.

### 2. Tool `_meta` Fields

Each tool specifies three OpenAI-specific metadata fields:

| Field                            | Purpose                        | Example                              |
| -------------------------------- | ------------------------------ | ------------------------------------ |
| `openai/outputTemplate`          | URI of widget to render output | `"ui://widget/oak-json-viewer.html"` |
| `openai/toolInvocation/invoking` | Status during execution        | `"Searching curriculum…"`            |
| `openai/toolInvocation/invoked`  | Status after completion        | `"Search complete"`                  |

### 3. Widget JavaScript API

The widget HTML can access tool output via:

```javascript
const data = window.openai?.toolOutput ?? {};
```

## What to Build

1. **Widget HTML file** - Oak-branded JSON viewer with Lexend font and light/dark mode
2. **Resource registration** - Make widget available via MCP `resources/list` and `resources/read`
3. **Tool `_meta` updates** - Add all three fields to `search`, `fetch`, and `get-ontology`
4. **Description updates** - Add "Use when" / "Do NOT use" guidance to `search` and `fetch`

## Oak Brand Styling

| Mode  | Background | Text      |
| ----- | ---------- | --------- |
| Light | `#bef2bd`  | `#1b3d1c` |
| Dark  | `#1b3d1c`  | `#f0f7f0` |

**Font**: Lexend (Google Fonts) with `system-ui` fallback

## Key Files

| File                                                                    | Purpose                        |
| ----------------------------------------------------------------------- | ------------------------------ |
| `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` | New - widget HTML/CSS/JS       |
| `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts`               | Register widget resource       |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.ts`           | Update search/fetch metadata   |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts`       | Add outputTemplate to ontology |

## TDD Approach

Write failing tests first:

**Unit tests** (SDK):

- All aggregated tools have `_meta["openai/outputTemplate"]`
- All aggregated tools have `_meta["openai/toolInvocation/invoking"]`
- All aggregated tools have `_meta["openai/toolInvocation/invoked"]`
- `search` and `fetch` descriptions include "Use this when" / "Do NOT use"

**E2E tests** (HTTP app):

- Widget resource appears in `resources/list`
- Widget resource returns `text/html+skybridge` MIME type
- Widget HTML includes Lexend font and Oak colors

## Quality Gates

```bash
pnpm build && pnpm type-check && pnpm lint -- --fix && pnpm test
```

## Manual Testing

After implementation, test in ChatGPT:

1. Connect the MCP server
2. Ask: "Search for photosynthesis lessons"
3. Verify: Status text appears during/after invocation
4. Verify: Output renders in Oak-branded widget
5. Toggle dark mode and verify colors adapt

## Implementation Order

The detailed plan at `.agent/plans/sdk-and-mcp-enhancements/01-aggregated-tools-widget-metadata.md` specifies the exact implementation order and code to write. Follow it step by step.
