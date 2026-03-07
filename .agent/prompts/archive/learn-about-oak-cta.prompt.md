# Learn About Oak CTA Button

## Objective

Add a Call-To-Action (CTA) button to the OpenAI widget that, when clicked, sends a follow-up message prompting the model to call all three agent support tools (`get-ontology`, `get-knowledge-graph`, `get-help`) to understand Oak's curriculum context.

## Background

### The Problem

When users first interact with the Oak Curriculum MCP server via ChatGPT, the model often lacks context about Oak's curriculum structure. The server provides three agent support tools designed to ground the model:

1. **`get-ontology`** - Domain definitions (key stages, subjects, entity hierarchy, ID formats)
2. **`get-knowledge-graph`** - Concept TYPE relationships and domain structure
3. **`get-help`** - Tool usage guidance and workflows

These tools are mentioned in `SERVER_INSTRUCTIONS` (sent in the MCP initialize response) and `OAK_CONTEXT_HINT` (included in every tool response's `structuredContent`), but the model doesn't always call them proactively.

### The Solution

Use the OpenAI Apps SDK's `window.openai.sendFollowUpMessage()` API to add a CTA button that, when clicked, sends a user message prompting the model to call all three agent support tools.

## Implementation Status

### ✅ Completed - Reusable CTA System

The implementation uses a **reusable CTA system** designed for extensibility:

#### Architecture

```text
widget-cta.ts          → CTA registry + HTML/JS generators (pure functions)
     ↓
widget-script-state.ts → Imports and embeds generated JS
     ↓
aggregated-tool-widget.ts → Imports and embeds generated HTML in header
```

#### Key Files

1. **`apps/oak-curriculum-mcp-streamable-http/src/widget-cta.ts`** (NEW) - The CTA system:

```typescript
/** CTA configuration type */
export interface CtaConfig {
  readonly id: string; // DOM element ID prefix
  readonly label: string; // Button text
  readonly loadingLabel: string; // Text while sending
  readonly icon?: string; // Emoji prefix
  readonly prompt: string; // Follow-up message to send
}

/** Registry of all CTAs - add new CTAs here */
export const CTA_REGISTRY = {
  learnOak: {
    id: 'learn-oak',
    label: 'Learn About Oak',
    loadingLabel: 'Loading...',
    icon: '🌳',
    prompt: `Please use all of the following tools...`,
  },
  // Add more CTAs here for future workflows
} as const satisfies Record<string, CtaConfig>;

// Pure functions for generating HTML and JS
export function generateCtaButtonHtml(cta: CtaConfig): string;
export function generateCtaContainerHtml(): string;
export function generateCtaHandlerJs(): string;
```

2. **`apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`** - Embeds CTA in header:

```typescript
import { generateCtaContainerHtml } from './widget-cta.js';

// CTA positioned in header, right side (margin-left: auto)
<div class="hdr">
  <img class="logo" ...>
  <div class="hdr-text">...</div>
  ${generateCtaContainerHtml()}
</div>
```

3. **`apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts`** - Header-positioned styling:

```css
.cta-container {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
}
.cta-btn {
  background: linear-gradient(135deg, var(--accent) 0%, #1b6330 100%);
  font-size: 12px;
  padding: 8px 14px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  white-space: nowrap;
}
.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
}
```

4. **`apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts`** - Embeds CTA handler:

```typescript
import { generateCtaHandlerJs } from './widget-cta.js';

export const WIDGET_STATE_JS = `
...
${generateCtaHandlerJs()}
...
`;
```

### Location in Widget

The button appears **IN the header**, to the right of the "Oak National Academy" title, pushed to the far right using `margin-left: auto`.

## To Add a New CTA

Simply add an entry to `CTA_REGISTRY` in `widget-cta.ts`:

```typescript
export const CTA_REGISTRY = {
  learnOak: { ... },

  // New CTA for lesson planning workflow
  startLessonPlanning: {
    id: 'start-lesson-planning',
    label: 'Plan a Lesson',
    loadingLabel: 'Starting...',
    icon: '📝',
    prompt: 'Help me plan a lesson. First ask me about the subject, key stage, and topic.',
  },
} as const satisfies Record<string, CtaConfig>;
```

The HTML and JavaScript are automatically generated and included in the widget.

## Assumptions

1. **`sendFollowUpMessage` availability** - The API is available in the ChatGPT widget runtime. The implementation gracefully hides the CTA if the API is unavailable.

2. **Model compliance** - The model will follow the prompt and call all three tools when asked. This is not guaranteed but is expected behaviour.

3. **Single use per session** - The CTA hides after being clicked once. We assume users don't need to re-trigger the context grounding multiple times.

## Decisions

1. **Reusable system** - Built as a registry + generator pattern to support future CTAs without code duplication.

2. **Header positioning** - CTAs appear in the header row, pushed right. This keeps them prominent but not intrusive.

3. **Prompt wording** - Uses explicit tool names with backticks and describes what each provides. Ends with "Call all three tools now, then summarize" to encourage immediate action.

4. **Loading state** - Changes button text to "🌳 Loading..." while the message is being sent, providing user feedback.

5. **Hide after success** - The entire CTA container disappears after successful send to avoid redundant clicks.

6. **Error recovery** - If sending fails, the button is re-enabled so the user can retry.

7. **Feature detection** - Uses `window.openai?.sendFollowUpMessage` check before showing the button, ensuring graceful degradation.

## Unknowns

1. **Visual design approval** - The button styling (gradient green, header-right) has not been reviewed by design. May need adjustment.

2. **Copy/text refinement** - "🌳 Learn About Oak" text may need refinement.

3. **Should it be conditional?** - Currently shows on ALL tool responses. Should it only show on certain tools? Or only on the first tool call in a conversation?

4. **Widget state persistence** - Should we track whether the CTA was clicked using `setWidgetState` so it doesn't reappear on subsequent tool calls?

## Remaining Work

### Phase 1: Testing ✅ Complete

**Unit tests** (`widget-cta.unit.test.ts`) - 21 tests:

- `generateCtaButtonHtml()` produces correct HTML (id, classes, text)
- `generateCtaContainerHtml()` includes all registered CTAs, hidden by default
- `generateCtaHandlerJs()` produces valid JavaScript with feature detection
- Prompt escaping handles backticks correctly
- Registry contains correct CTA configuration

**Integration tests** (`widget-cta.integration.test.ts`) - 14 tests:

- Widget HTML includes CTA container in header
- Widget script includes CTA handlers
- HTML element IDs match what JavaScript expects
- Loading states, error recovery, and hide-on-success behaviors present

**Documented limitations** (cannot test in our environment):

- Actual `sendFollowUpMessage` behaviour (ChatGPT sandbox only)
- Model compliance with the prompt
- Visual appearance (CSS styling)

### Phase 2: Refinement (Based on Feedback)

1. Refine button placement based on design review
2. Refine copy/text based on user feedback
3. Add conditional display logic if needed
4. Add widget state tracking if needed

## Files Modified

- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta.ts` (NEW)
- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta.unit.test.ts` (NEW)
- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta.integration.test.ts` (NEW)
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts`

## Reference Documentation

- [OpenAI Apps SDK - Build UI](.agent/reference-docs/openai-apps/openai-apps-build-ui.md) - `sendFollowUpMessage` API
- [OpenAI Apps SDK - Reference](.agent/reference-docs/openai-apps/openai-apps-sdk-reference.md) - Widget API reference
- [Agent Support Tool Metadata](packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts) - Source of truth for agent support tools
- [ADR-060: Agent Support Metadata System](docs/architecture/architectural-decisions/060-agent-support-metadata-system.md) - Architecture decision for agent support tools
- [ADR-061: Widget Call-to-Action System](docs/architecture/architectural-decisions/061-widget-cta-system.md) - Architecture decision for the CTA system
- [App README - CTA Section](apps/oak-curriculum-mcp-streamable-http/README.md#widget-call-to-action-cta-system) - User-facing documentation

## Quality Gates

All quality gates must pass:

```bash
pnpm type-gen
pnpm build
pnpm type-check
pnpm lint -- --fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:e2e:built
pnpm test:ui
pnpm smoke:dev:stub
```

Current status: ✅ Unit and integration tests pass (35 tests)

## Compliance

This work complies with:

- **[principles.md](.agent/directives/principles.md)** - No type shortcuts, proper TSDoc, pure functions, DRY (single CTA registry)
- **[schema-first-execution.md](.agent/directives/schema-first-execution.md)** - Widget code is authored runtime (not generated from OpenAPI), which is permitted
- **[testing-strategy.md](.agent/directives/testing-strategy.md)** - Testing work is identified as remaining work (Phase 1)
