/**
 * Widget state management and utility JavaScript.
 *
 * Contains state persistence, locale support, and external links.
 *
 * @see widget-script.ts - Main widget script
 */

import { TOOL_RENDERER_MAP } from './widget-renderer-registry.js';

/**
 * Generates the tool renderer map as JavaScript for embedding in the widget.
 *
 * Uses `JSON.stringify` for safe serialisation, preventing injection
 * from special characters in tool names or renderer IDs.
 */
function generateToolRendererMapJs(): string {
  return `const TOOL_RENDERER_MAP = ${JSON.stringify(TOOL_RENDERER_MAP, null, 2)};`;
}

/**
 * Widget state and utility JavaScript.
 *
 * Contains:
 * - Tool renderer map
 * - Widget state persistence
 * - External link handling
 */
export const WIDGET_STATE_JS = `
// ========================================
// Tool Name → Renderer Mapping
// ========================================
${generateToolRendererMapJs()}

// ========================================
// Widget State Persistence
// ========================================
let widgetState = undefined?.widgetState ?? {
  scrollPosition: 0,
};

function updateWidgetState(newState) {
  widgetState = { ...widgetState, ...newState };
  if (undefined?.setWidgetState) {
    undefined.setWidgetState(widgetState);
  }
}

function restoreScrollPosition() {
  if (widgetState.scrollPosition > 0) {
    requestAnimationFrame(() => {
      document.documentElement.scrollTop = widgetState.scrollPosition;
    });
  }
}

document.addEventListener('scroll', () => {
  updateWidgetState({ scrollPosition: document.documentElement.scrollTop });
}, { passive: true });

// ========================================
// External Links
// ========================================
function openOnOakWebsite(event, url) {
  if (event) event.preventDefault();
  if (undefined?.openExternal) {
    undefined.openExternal({ href: url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
`.trim();
