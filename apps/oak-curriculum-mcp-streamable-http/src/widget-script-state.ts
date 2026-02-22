/**
 * Widget state management and utility JavaScript.
 *
 * Contains state persistence, locale support, external links,
 * display mode, and CTA (Call-to-Action) functionality.
 *
 * @see widget-script.ts - Main widget script
 * @see widget-cta/ - CTA configuration and handler generation
 */

import { generateCtaHandlerJs } from './widget-cta/index.js';
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
 * - CTA handler
 */
export const WIDGET_STATE_JS = `
// ========================================
// Tool Name → Renderer Mapping
// ========================================
${generateToolRendererMapJs()}

// ========================================
// Widget State Persistence
// ========================================
let widgetState = window.openai?.widgetState ?? {
  scrollPosition: 0,
};

function updateWidgetState(newState) {
  widgetState = { ...widgetState, ...newState };
  if (window.openai?.setWidgetState) {
    window.openai.setWidgetState(widgetState);
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
  if (window.openai?.openExternal) {
    window.openai.openExternal({ href: url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

${generateCtaHandlerJs()}
`.trim();
