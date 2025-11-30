/**
 * JavaScript for the Oak-branded widget.
 *
 * Extracted from aggregated-tool-widget.ts for maintainability.
 *
 * Features:
 * - Widget state persistence via window.openai.setWidgetState()
 * - Tool calling via window.openai.callTool()
 * - Rendering orchestration
 *
 * @see aggregated-tool-widget.ts
 * @see widget-renderers.ts
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */

import { WIDGET_RENDERERS } from './widget-renderers.js';

/**
 * Widget JavaScript that runs inside the ChatGPT sandbox.
 *
 * This script handles:
 * - Reading tool output from window.openai.toolOutput
 * - Persisting UI state via window.openai.setWidgetState()
 * - Calling tools via window.openai.callTool()
 * - Orchestrating rendering of help content, search results, and JSON data
 */
export const WIDGET_SCRIPT = `
const c = document.getElementById('c');
const toolNameEl = document.getElementById('tool-name');
const actionsEl = document.getElementById('actions');
const errorEl = document.getElementById('error');
const esc = s => typeof s !== 'string' ? '' : s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

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

/**
 * Formats a date string according to the user's locale.
 */
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
/**
 * Opens an Oak website URL using the OpenAI Apps SDK openExternal API
 * when available, with fallback to window.open.
 */
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
/**
 * Requests fullscreen mode using the OpenAI Apps SDK API.
 * Gracefully handles unavailable API.
 */
function requestFullscreen() {
  if (window.openai?.requestDisplayMode) {
    window.openai.requestDisplayMode('fullscreen').catch(() => {
      // Silently fail if display mode change is rejected
    });
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

// ========================================
// Rendering
// ========================================
function updateToolName() {
  const input = window.openai?.toolInput;
  const meta = window.openai?.toolResponseMetadata;
  const name = meta?.['annotations/title'] || meta?.title || input?.toolName || '';
  if (name && toolNameEl) { toolNameEl.textContent = name; toolNameEl.style.display = 'block'; }
  else if (toolNameEl) { toolNameEl.style.display = 'none'; }
}

/**
 * Gets the full results data for rendering.
 * Prefers _meta.fullResults (optimized structure) over toolOutput (legacy).
 * This enables token optimization where full data is hidden from the model
 * but still available to the widget for rendering.
 */
function getFullResults() {
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};
  // Prefer fullResults from _meta (optimized structure)
  if (meta.fullResults) {
    return meta.fullResults;
  }
  // Fall back to data field from structuredContent (e.g., { status: 200, data: {...} })
  if (output.data && typeof output.data === 'object') {
    return output.data;
  }
  // Fall back to entire toolOutput for legacy format
  return output;
}

${WIDGET_RENDERERS}

function render() {
  updateToolName();
  updateActions();
  const fullData = getFullResults();
  // Check for help content structure (serverOverview, toolCategories, workflows)
  if (fullData.serverOverview || fullData.toolCategories || fullData.workflows) {
    c.innerHTML = renderHelpContent(fullData);
  }
  // Check for search results structure (lessons, transcripts)
  else if (fullData.lessons !== undefined || fullData.transcripts !== undefined) {
    c.innerHTML = renderSearchResults(fullData);
  }
  // Check for fetch results (type, data, canonicalUrl)
  else if (fullData.type && fullData.data !== undefined) {
    c.innerHTML = renderFetchResult(fullData);
  }
  // Fallback: display raw JSON
  else if (Object.keys(fullData).length > 0) {
    c.innerHTML = '<pre>' + esc(JSON.stringify(fullData, null, 2)) + '</pre>';
  }
  // Empty state
  else {
    c.innerHTML = '<div class="empty">Loading...</div>';
  }
  restoreScrollPosition();
}

render();
window.addEventListener('openai:set_globals', (e) => {
  if (e.detail?.globals?.toolOutput !== undefined) render();
}, { passive: true });
`.trim();
