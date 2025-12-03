# ADR-061: Widget Call-to-Action System

## Status

Accepted

## Context

The Oak widget renders in ChatGPT when users interact with the Oak Curriculum MCP server. While the server provides comprehensive agent support tools (`get-ontology`, `get-knowledge-graph`, `get-help`) for grounding AI context, models don't always call these tools proactively.

We identified several opportunities to improve user experience:

1. **Context grounding**: Users benefit when the model understands Oak's curriculum structure before answering questions
2. **Workflow initiation**: Structured workflows (lesson planning, resource finding) could be started with a single click
3. **Feature discovery**: Users may not know about available capabilities

The OpenAI Apps SDK provides `window.openai.sendFollowUpMessage()`, which allows widgets to send messages to the model as if the user typed them. This enables widgets to guide model behaviour through structured prompts.

Previously, there was no mechanism for users to trigger these follow-up messages from the widget UI.

## Decision

Implement a **reusable Call-to-Action (CTA) system** that:

1. Provides a declarative registry for defining CTA buttons
2. Generates HTML and JavaScript from the registry at build time
3. Places CTAs in the widget header for visibility
4. Handles loading states, errors, and feature detection

### Architecture

```text
src/widget-cta.ts (single source of truth)
├── CtaConfig interface          → Type definition for CTAs
├── CTA_REGISTRY                 → Declarative CTA definitions
├── generateCtaButtonHtml()      → Pure function: config → HTML
├── generateCtaContainerHtml()   → Pure function: registry → container HTML
└── generateCtaHandlerJs()       → Pure function: registry → JavaScript
```

### Registry Pattern

CTAs are defined as a readonly object with type-safe configuration:

```typescript
export const CTA_REGISTRY = {
  learnOak: {
    id: 'learn-oak',
    label: 'Learn About Oak',
    loadingLabel: 'Loading...',
    icon: '🌳',
    prompt: `Please use all of the following tools to understand Oak's curriculum structure...`,
  },
  // Add more CTAs here
} as const satisfies Record<string, CtaConfig>;
```

### Integration Points

| File                        | Integration                                     |
| --------------------------- | ----------------------------------------------- |
| `aggregated-tool-widget.ts` | Embeds `generateCtaContainerHtml()` in header   |
| `widget-script-state.ts`    | Embeds `generateCtaHandlerJs()` output          |
| `widget-styles.ts`          | Contains `.cta-container` and `.cta-btn` styles |

### Generated Outputs

**HTML** (embedded in widget template):

```html
<div id="cta-container" class="cta-container" style="display:none">
  <button id="learn-oak-btn" class="btn cta-btn">🌳 Learn About Oak</button>
</div>
```

**JavaScript** (embedded in widget script):

```javascript
const CTA_CONFIGS = [
  {
    id: 'learn-oak',
    buttonText: '🌳 Learn About Oak',
    loadingText: '🌳 Loading...',
    prompt: '...',
  },
];

function initCtaButtons() {
  // Feature detection for sendFollowUpMessage
  // Click handlers with loading states
  // Error recovery
}
```

### UX Behaviour

1. **Hidden by default**: CTAs are `display:none` until JavaScript runs
2. **Feature detection**: Only shown when `window.openai.sendFollowUpMessage` exists
3. **Loading state**: Button text changes and becomes disabled while sending
4. **Hide on success**: Entire container hides after successful send (prevents redundant clicks)
5. **Error recovery**: Button re-enables on error for retry

## Rationale

### Registry + Generator Pattern

This pattern provides several benefits:

- **Single source of truth**: All CTA definitions in one file
- **Type safety**: TypeScript enforces correct configuration
- **Testability**: Pure generator functions can be unit tested
- **Extensibility**: Add new CTAs by adding registry entries

### Pure Functions

The generator functions are pure (no side effects, deterministic output):

```typescript
function generateCtaButtonHtml(cta: CtaConfig): string { ... }
function generateCtaContainerHtml(): string { ... }
function generateCtaHandlerJs(): string { ... }
```

This makes them easy to test and reason about.

### Build-Time Generation

HTML and JavaScript are generated at build time (embedded in template strings), not runtime. This ensures:

- **No runtime overhead**: No dynamic DOM manipulation for setup
- **Predictable output**: Same build produces same widget
- **Type verification**: Registry issues caught at compile time

### Header Placement

CTAs appear in the widget header (right side) for:

- **Visibility**: Always visible without scrolling
- **Discoverability**: Natural location for actions
- **Consistency**: Doesn't interfere with tool output content

## Consequences

### Positive

- **User empowerment**: Users can ground model context with one click
- **Workflow initiation**: Future CTAs can start structured workflows
- **Extensible**: Adding new CTAs requires minimal code changes
- **Graceful degradation**: CTAs hidden when API unavailable
- **Testable**: Pure functions enable comprehensive unit tests

### Negative

- **Limited to ChatGPT**: `sendFollowUpMessage` only works in Skybridge sandbox
- **Single-use**: CTAs hide after use; no way to re-trigger without refresh
- **Model compliance**: No guarantee model will follow the prompt

### Neutral

- **Build dependency**: Widget must be rebuilt to add/change CTAs
- **Documentation**: Developers need to understand the registry system

## Implementation

### Files Added/Modified

- `src/widget-cta.ts` - **NEW**: CTA registry and generator functions
- `src/aggregated-tool-widget.ts` - Modified to embed CTA HTML in header
- `src/widget-script-state.ts` - Modified to embed CTA JavaScript
- `src/widget-styles.ts` - Modified to add CTA styling

### Adding a New CTA

1. Add entry to `CTA_REGISTRY` in `src/widget-cta.ts`:

```typescript
startLessonPlanning: {
  id: 'start-lesson-planning',
  label: 'Plan a Lesson',
  loadingLabel: 'Starting...',
  icon: '📝',
  prompt: 'Help me plan a lesson. First ask about the subject and key stage.',
},
```

2. Run `pnpm build` to regenerate the widget

3. Test in ChatGPT to verify button appears and functions

### Testing Strategy

**Unit tests** for pure functions:

- `generateCtaButtonHtml()` produces correct HTML structure
- `generateCtaContainerHtml()` includes all registered CTAs
- `generateCtaHandlerJs()` produces valid JavaScript

**Integration tests**:

- Widget HTML includes CTA container in header
- CTA container has correct structure and IDs

**Manual/E2E testing** (ChatGPT sandbox required):

- Button appears when `sendFollowUpMessage` is available
- Click triggers loading state
- Success hides container
- Error re-enables button

## Related Decisions

- [ADR-058: Context Grounding for AI Agents](058-context-grounding-for-ai-agents.md) - Why agent context matters
- [ADR-059: Knowledge Graph for Agent Context](059-knowledge-graph-for-agent-context.md) - What the `get-knowledge-graph` tool provides
- [ADR-060: Agent Support Tool Metadata System](060-agent-support-metadata-system.md) - How agent support tools are defined

## References

- [OpenAI Apps SDK - Build UI](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [OpenAI Apps SDK - sendFollowUpMessage](https://developers.openai.com/apps-sdk/build/chatgpt-ui#send-conversational-follow-ups)
