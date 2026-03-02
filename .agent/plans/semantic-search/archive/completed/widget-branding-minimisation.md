# Widget Branding Minimisation

**Status**: Done
**Priority**: High
**Area**: Widget (aggregated tool widget)

## Problem (resolved)

The widget header was disproportionately large relative to the actual content. Every tool invocation rendered a full branding block with a 36x47px logo, `<h1>` title, CTA button container, and a 2px border-bottom separator -- pushing actual content below the fold.

## What was done

### Header restructured to a compact single line

- Logo shrunk from 36x47px to 20x26px
- "Oak National Academy" changed from `<h1>` (16px) to inline `<span>` (13px)
- Logo and wordmark wrapped in a link to `https://www.thenational.academy`
- Tool name shown as inline `<span>` on the same line
- Border-bottom separator removed
- Margins reduced from 16px to 8px

### Header shown only on major tools

Header is hidden by default (`style="display:none"`) and conditionally shown by JavaScript only for four tools:

- `search`
- `browse-curriculum`
- `explore-topic`
- `fetch`

All other tools (get-ontology, get-help, get-thread-progressions, etc.) render without any branding header.

### CTA system removed from widget

- CTA HTML generation removed from widget header
- CTA JavaScript handlers removed from widget script state
- CTA CSS styles removed
- CTA integration tests updated to verify absence
- CTA source files (`widget-cta/`) remain but are no longer imported by the widget

## Files changed

- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.ts` -- header HTML
- `apps/oak-curriculum-mcp-streamable-http/src/widget-styles.ts` -- CSS
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script.ts` -- conditional header, HEADER_TOOLS
- `apps/oak-curriculum-mcp-streamable-http/src/widget-script-state.ts` -- removed CTA import/handler
- `apps/oak-curriculum-mcp-streamable-http/src/aggregated-tool-widget.unit.test.ts` -- new header tests
- `apps/oak-curriculum-mcp-streamable-http/src/widget-cta.integration.test.ts` -- CTA absence tests
