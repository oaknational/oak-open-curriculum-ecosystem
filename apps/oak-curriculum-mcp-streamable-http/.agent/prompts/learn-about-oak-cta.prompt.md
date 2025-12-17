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

### Completed

The following changes have been made and all quality gates pass:

1. **`aggregated-tool-widget.ts`** - Added CTA button HTML in the header area:

```html
<div id="cta-container" class="cta-container" style="display:none">
  <button id="learn-oak-btn" class="btn cta-btn">🌳 Learn About Oak</button>
</div>
```

2. **`widget-styles.ts`** - Added CTA styling:

```css
.cta-container {
  margin-bottom: 12px;
  display: flex;
  justify-content: center;
}
.cta-btn {
  background: linear-gradient(135deg, var(--accent) 0%, #1b6330 100%);
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.cta-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

3. **`widget-script-state.ts`** - Added JavaScript handler:

```javascript
const LEARN_OAK_PROMPT = `Please use all of the following tools to understand Oak's curriculum structure and better help me:
- \`get-ontology\` for domain definitions (key stages, subjects, entity hierarchy)
- \`get-knowledge-graph\` for concept relationships and structure
- \`get-help\` for tool usage guidance and workflows

Call all three tools now, then summarize what you've learned.`;

function initLearnOakCta() {
  const ctaContainer = document.getElementById('cta-container');
  const ctaBtn = document.getElementById('learn-oak-btn');

  // Only show CTA if sendFollowUpMessage is available
  if (!window.openai?.sendFollowUpMessage) {
    if (ctaContainer) ctaContainer.style.display = 'none';
    return;
  }

  // Show the CTA
  if (ctaContainer) ctaContainer.style.display = 'flex';

  // Add click handler
  if (ctaBtn) {
    ctaBtn.addEventListener('click', async () => {
      ctaBtn.disabled = true;
      ctaBtn.textContent = '🌳 Loading...';
      try {
        await window.openai.sendFollowUpMessage({ prompt: LEARN_OAK_PROMPT });
        // Hide the CTA after successful send
        if (ctaContainer) ctaContainer.style.display = 'none';
      } catch (error) {
        ctaBtn.textContent = '🌳 Learn About Oak';
        ctaBtn.disabled = false;
        console.error('Failed to send follow-up message:', error);
      }
    });
  }
}
```

### Location in Widget

The button appears in the **header area** of the widget, between the Oak National Academy header and the main content. See screenshot for reference:

```
┌─────────────────────────────────────────────┐
│ 🌳 Oak National Academy                     │
│    Get Curriculum Ontology                  │
├─────────────────────────────────────────────┤
│  ┌─────────────────────────────────────┐    │  ← CTA BUTTON HERE (roughly)
│  │   🌳 Learn About Oak                │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│ OAK CURRICULUM                              │
│ The Oak Curriculum covers Key Stages...    │
└─────────────────────────────────────────────┘
```

## Assumptions

1. **`sendFollowUpMessage` availability** - The API is available in the ChatGPT widget runtime. The implementation gracefully hides the CTA if the API is unavailable.

2. **Model compliance** - The model will follow the prompt and call all three tools when asked. This is not guaranteed but is expected behavior.

3. **Single use per session** - The CTA hides after being clicked once. We assume users don't need to re-trigger the context grounding multiple times.

4. **Button placement** - The header area placement is reasonable. The user's screenshot annotation suggests this is approximately correct, but exact positioning may need refinement.

## Decisions

1. **Prompt wording** - Uses explicit tool names with backticks and describes what each provides. Ends with "Call all three tools now, then summarize" to encourage immediate action.

2. **Loading state** - Changes button text to "🌳 Loading..." while the message is being sent, providing user feedback.

3. **Hide after success** - The button disappears after successful send to avoid redundant clicks.

4. **Error recovery** - If sending fails, the button is re-enabled so the user can retry.

5. **Feature detection** - Uses `window.openai?.sendFollowUpMessage` check before showing the button, ensuring graceful degradation.

## Unknowns

1. **Visual design approval** - The button styling (gradient green, centered) has not been reviewed by design. May need adjustment.

2. **Exact positioning** - The user's annotation shows "here-ish" in the header area. The current implementation places it below the header but the exact position may need refinement.

3. **Copy/text refinement** - "🌳 Learn About Oak" text may need refinement. Alternatives:
   - "🌳 Ground Context"
   - "📚 Load Curriculum Guide"
   - "🎓 Get Started"

4. **Should it be conditional?** - Currently shows on ALL tool responses. Should it only show on certain tools? Or only on the first tool call in a conversation?

5. **Widget state persistence** - Should we track whether the CTA was clicked using `setWidgetState` so it doesn't reappear on subsequent tool calls?

## Remaining Work

### Phase 1: Testing (Required)

Per the testing strategy, we need tests at all levels:

1. **Unit tests** for the CTA initialization logic (if extracted to a pure function)
2. **Integration tests** to verify the button appears in the widget HTML
3. **E2E tests** to verify the full flow (button click → sendFollowUpMessage call)

### Phase 2: Refinement (Based on Feedback)

1. Refine button placement based on design review
2. Refine copy/text based on user feedback
3. Add conditional display logic if needed
4. Add widget state tracking if needed

## Files Modified

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts`
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts`

## Reference Documentation

- [OpenAI Apps SDK - Build UI](../../.agent/reference-docs/openai-apps/openai-apps-build-ui.md) - `sendFollowUpMessage` API
- [OpenAI Apps SDK - Reference](../../.agent/reference-docs/openai-apps/openai-apps-sdk-reference.md) - Widget API reference
- [Agent Support Tool Metadata](../../../packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts) - Source of truth for agent support tools

## Quality Gates

All quality gates must pass:

```bash
pnpm build && pnpm type-check && pnpm lint -- --fix && pnpm test && pnpm test:e2e
```

Current status: ✅ All passing













