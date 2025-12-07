# Debug Widget Content Clipping in ChatGPT

## Problem Statement

Widget content is being clipped/cut off when rendered in ChatGPT, despite having safe area insets implemented. We need to understand ChatGPT's spacing and layout system to fix the CSS.

### Visual Evidence

The widget shows:

- Header with Oak National Academy logo and title (visible)
- Content area (being clipped/cut off)
- Footer (not visible due to clipping)

The content appears to overflow the available viewport height, suggesting a layout/CSS issue rather than missing functionality.

## Current Implementation

### Widget Structure

File: `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts`

```html
<main id="root">
  <div class="hdr">
    <div class="logo">{SVG}</div>
    <div class="hdr-text">
      <h1 class="ttl">Oak National Academy</h1>
      <p class="sub-ttl" id="tool-name"></p>
    </div>
    {CTA buttons}
  </div>
  <div id="c"></div>
  <!-- Dynamic content rendered here -->
  <div class="ftr">
    <p class="ftr-disclaimer">AI can make mistakes...</p>
    <p class="ftr-links">{links}</p>
  </div>
</main>
```

### Current CSS Layout

File: `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts`

Key styles:

```css
:root {
  /* Safe area insets - updated by JavaScript */
  --safe-top: 20px;
  --safe-right: 20px;
  --safe-bottom: 20px;
  --safe-left: 20px;
}

body {
  margin: 0;
  padding: 0;
  min-height: 200px;
  display: flex;
  flex-direction: column;
}

#root {
  background: var(--bg);
  color: var(--fg);
  padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--border-color);
}

#c {
  flex: 1; /* Content should grow to fill available space */
}

.ftr {
  margin-top: auto; /* Footer pushes to bottom */
  padding-top: 12px;
  border-top: 1px solid var(--border-color);
}
```

### Safe Area Inset Application

File: `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts`

```javascript
function applySafeAreaInsets() {
  const safeArea = window.openai?.safeArea;
  if (safeArea?.insets) {
    const { top, right, bottom, left } = safeArea.insets;
    document.documentElement.style.setProperty('--safe-top', `${top}px`);
    document.documentElement.style.setProperty('--safe-right', `${right}px`);
    document.documentElement.style.setProperty('--safe-bottom', `${bottom}px`);
    document.documentElement.style.setProperty('--safe-left', `${left}px`);
  }
}

applySafeAreaInsets();
window.addEventListener(
  'openai:set_globals',
  (e) => {
    if (e.detail?.globals?.safeArea !== undefined) applySafeAreaInsets();
  },
  { passive: true },
);
```

## OpenAI Apps SDK Documentation

### Core References

1. **UI Guidelines**: https://developers.openai.com/apps-sdk/concepts/ui-guidelines
   - Spacing & layout rules
   - System grid spacing
   - Visual design principles

2. **Build ChatGPT UI**: https://developers.openai.com/apps-sdk/build/chatgpt-ui
   - window.openai API reference
   - Safe area insets
   - Component lifecycle

3. **Component Reference**: https://developers.openai.com/apps-sdk/plan/components
   - Component architecture
   - Layout expectations

4. **API Reference**: https://developers.openai.com/apps-sdk/reference
   - window.openai bridge API
   - Tool descriptor parameters
   - Metadata fields

### Key Concepts to Investigate

From the UI Guidelines:

- **System grid spacing** - what are ChatGPT's standard spacing units?
- **Viewport constraints** - how does ChatGPT size the iframe/widget container?
- **Flexbox behavior** - how should flex layouts work within ChatGPT widgets?
- **Safe area insets** - are we applying them correctly?
- **Display modes** - inline vs fullscreen vs PiP layout differences

## Questions to Answer

1. **Viewport Height**: How does ChatGPT determine the widget's height? Is there a max-height constraint we need to respect?

2. **Overflow Handling**: Should the widget content scroll internally, or should ChatGPT's iframe provide the scrolling?

3. **Flexbox Layout**: Is our `flex: 1` approach on `#c` correct, or does it conflict with ChatGPT's container behavior?

4. **Safe Area Insets**: Are we applying padding correctly on `#root`, or should it be on a different element?

5. **Body/HTML Sizing**: Should we set explicit height constraints on `html` or `body`? Currently using `min-height: 200px` on body.

6. **Content Overflow**: The content div `#c` has `flex: 1` but no overflow handling. Should it have `overflow-y: auto`?

## Debugging Strategy

1. Read OpenAI spacing/layout documentation thoroughly
2. Check if there are constraints on widget dimensions we're violating
3. Inspect the flexbox layout chain: `body` → `#root` → `#c` + `.ftr`
4. Verify safe area insets are being applied at the correct level
5. Determine if ChatGPT expects widgets to handle internal scrolling
6. Check for any CSS properties that might break ChatGPT's iframe sizing

## Files to Review

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` - HTML structure
- `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts` - CSS layout
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` - Safe area logic
- `apps/oak-curriculum-mcp-streamable-http/src/widget-renderers/` - Content rendering (may affect height)

## Expected Outcome

A clear understanding of:

1. What CSS changes are needed to prevent content clipping
2. How ChatGPT's spacing/layout system works
3. Whether we need to adjust our flexbox strategy, overflow handling, or safe area inset application
