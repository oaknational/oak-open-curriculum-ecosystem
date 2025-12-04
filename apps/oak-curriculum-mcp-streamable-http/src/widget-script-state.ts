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
 */
function generateToolRendererMapJs(): string {
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const entries = Object.entries(TOOL_RENDERER_MAP)
    .map(([tool, renderer]) => `  '${tool}': '${renderer}'`)
    .join(',\n');
  return `const TOOL_RENDERER_MAP = {\n${entries}\n};`;
}

/**
 * Widget state and utility JavaScript.
 *
 * Contains:
 * - Tool renderer map
 * - Widget state persistence
 * - Locale support
 * - External link handling
 * - Display mode
 * - Tool calling
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
  expandedSections: [],
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
// Locale Support
// ========================================
const locale = window.openai?.locale ?? 'en-GB';

function formatDate(dateStr) {
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

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

// ========================================
// Display Mode
// ========================================
function requestFullscreen() {
  if (window.openai?.requestDisplayMode) {
    window.openai.requestDisplayMode('fullscreen').catch(() => {});
  }
}

${generateCtaHandlerJs()}

// ========================================
// Tool Calling (DISABLED - see note below)
// ========================================
// 
// IMPLEMENTATION NOTE: Refresh Button Feature
// -------------------------------------------
// This feature allowed widgets to re-invoke the same MCP tool that produced
// the current output, using window.openai.callTool(). This is useful for:
//
// - Refreshing search results after content updates
// - Polling for changes in rate limits or status
// - Re-fetching data that may have changed server-side
//
// The feature was disabled as it's not currently useful for our use cases,
// but the code is preserved here for future reference.
//
// TO RE-ENABLE:
// 1. Uncomment the code below
// 2. Add back the HTML elements in aggregated-tool-widget.ts:
//    <div id="actions" class="actions" style="display:none"></div>
//    <div id="error" class="error" style="display:none"></div>
// 3. Re-add DOM references in widget-script.ts:
//    const actionsEl = document.getElementById('actions');
//    const errorEl = document.getElementById('error');
// 4. Call updateActions() in the render() function
// 5. The CSS styles (.actions, .btn, .loading, .error) are already present
//
// HOW IT WORKED:
// - updateToolContext() extracted the tool name and args from window.openai
// - updateActions() showed a "↻ Refresh" button if callTool was available
// - refreshData() called window.openai.callTool(toolName, args) to re-invoke
// - setLoading() added visual feedback during the async call
// - showError() displayed any errors with auto-dismiss after 5s
//
// REFERENCE CODE (uncomment to enable):
// --------------------------------------
// let isLoading = false;
// let currentToolName = null;
// let currentToolArgs = null;
//
// function setLoading(loading) {
//   isLoading = loading;
//   c.classList.toggle('loading', loading);
//   const btns = actionsEl.querySelectorAll('button');
//   btns.forEach(btn => { btn.disabled = loading; });
// }
//
// function showError(message) {
//   if (errorEl) {
//     errorEl.textContent = message;
//     errorEl.style.display = 'block';
//     setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
//   }
// }
//
// function hideError() {
//   if (errorEl) { errorEl.style.display = 'none'; }
// }
//
// async function refreshData() {
//   if (!window.openai?.callTool) { console.warn('callTool not available'); return; }
//   if (!currentToolName || !currentToolArgs) { console.warn('No tool context'); return; }
//   if (isLoading) return;
//   hideError();
//   setLoading(true);
//   try {
//     await window.openai.callTool(currentToolName, currentToolArgs);
//   } catch (error) {
//     showError(error instanceof Error ? error.message : 'Failed to refresh');
//   } finally {
//     setLoading(false);
//   }
// }
//
// function updateToolContext() {
//   const input = window.openai?.toolInput;
//   const meta = window.openai?.toolResponseMetadata;
//   currentToolName = meta?.toolName || input?.toolName || null;
//   currentToolArgs = input || null;
//   if (!currentToolName && input) {
//     if (input.query || input.q) currentToolName = 'search';
//     else if (input.id) currentToolName = 'fetch';
//     else if (input.tool_name !== undefined) currentToolName = 'get-help';
//   }
// }
//
// function updateActions() {
//   updateToolContext();
//   const canRefresh = window.openai?.callTool && currentToolName && currentToolArgs;
//   if (canRefresh) {
//     actionsEl.innerHTML = '<button class="btn" id="refresh-btn">↻ Refresh</button>';
//     actionsEl.style.display = 'flex';
//     const btn = document.getElementById('refresh-btn');
//     if (btn) btn.addEventListener('click', refreshData);
//   } else {
//     actionsEl.style.display = 'none';
//   }
// }
`.trim();
