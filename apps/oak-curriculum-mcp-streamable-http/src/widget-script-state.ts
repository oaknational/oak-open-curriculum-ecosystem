/**
 * Widget state management and utility JavaScript.
 *
 * Contains state persistence, locale support, external links,
 * display mode, and tool calling functionality.
 *
 * @see widget-script.ts - Main widget script
 */

import { TOOL_RENDERER_MAP } from './widget-renderer-registry.js';

/**
 * Generates the tool renderer map as JavaScript for embedding in the widget.
 */
function generateToolRendererMapJs(): string {
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

// ========================================
// Tool Calling
// ========================================
let isLoading = false;
let currentToolName = null;
let currentToolArgs = null;

function setLoading(loading) {
  isLoading = loading;
  c.classList.toggle('loading', loading);
  const btns = actionsEl.querySelectorAll('button');
  btns.forEach(btn => { btn.disabled = loading; });
}

function showError(message) {
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
    setTimeout(() => { errorEl.style.display = 'none'; }, 5000);
  }
}

function hideError() {
  if (errorEl) { errorEl.style.display = 'none'; }
}

async function refreshData() {
  if (!window.openai?.callTool) { console.warn('callTool not available'); return; }
  if (!currentToolName || !currentToolArgs) { console.warn('No tool context'); return; }
  if (isLoading) return;
  hideError();
  setLoading(true);
  try {
    await window.openai.callTool(currentToolName, currentToolArgs);
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Failed to refresh');
  } finally {
    setLoading(false);
  }
}

function updateToolContext() {
  const input = window.openai?.toolInput;
  const meta = window.openai?.toolResponseMetadata;
  currentToolName = meta?.toolName || input?.toolName || null;
  currentToolArgs = input || null;
  if (!currentToolName && input) {
    if (input.query || input.q) currentToolName = 'search';
    else if (input.id) currentToolName = 'fetch';
    else if (input.tool_name !== undefined) currentToolName = 'get-help';
  }
}

function updateActions() {
  updateToolContext();
  const canRefresh = window.openai?.callTool && currentToolName && currentToolArgs;
  if (canRefresh) {
    actionsEl.innerHTML = '<button class="btn" id="refresh-btn">↻ Refresh</button>';
    actionsEl.style.display = 'flex';
    const btn = document.getElementById('refresh-btn');
    if (btn) btn.addEventListener('click', refreshData);
  } else {
    actionsEl.style.display = 'none';
  }
}
`.trim();
