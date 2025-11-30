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

${WIDGET_RENDERERS}

function render() {
  updateToolName();
  updateActions();
  const o = window.openai?.toolOutput ?? {};
  const d = o.data;
  if (o.serverOverview || o.toolCategories || o.workflows) {
    c.innerHTML = renderHelpContent(o);
  } else if (d?.lessons !== undefined || d?.transcripts !== undefined) {
    c.innerHTML = renderSearchResults(d);
  } else if (o.status !== undefined || d !== undefined) {
    c.innerHTML = '<pre>' + esc(JSON.stringify(o, null, 2)) + '</pre>';
  } else if (Object.keys(o).length === 0) {
    c.innerHTML = '<div class="empty">Loading...</div>';
  } else {
    c.innerHTML = '<pre>' + esc(JSON.stringify(o, null, 2)) + '</pre>';
  }
  restoreScrollPosition();
}

render();
window.addEventListener('openai:set_globals', (e) => {
  if (e.detail?.globals?.toolOutput !== undefined) render();
}, { passive: true });
`.trim();
