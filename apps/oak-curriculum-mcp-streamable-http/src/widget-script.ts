/**
 * JavaScript for the Oak-branded widget.
 *
 * Extracted from aggregated-tool-widget.ts for maintainability.
 *
 * Features:
 * - Widget state persistence via window.openai.setWidgetState()
 * - Tool name routing to appropriate renderers
 * - Rendering orchestration
 *
 * @see aggregated-tool-widget.ts
 * @see widget-renderers/index.ts - Renderer implementations
 * @see widget-renderer-registry.ts - Tool name to renderer mapping
 * @see widget-script-state.ts - Contains disabled refresh button code for future reference
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */

import { WIDGET_RENDERER_FUNCTIONS } from './widget-renderers/index.js';
import { WIDGET_STATE_JS } from './widget-script-state.js';

/**
 * Widget JavaScript that runs inside the ChatGPT sandbox.
 *
 * This script handles:
 * - Reading tool output from window.openai.toolOutput
 * - Persisting UI state via window.openai.setWidgetState()
 * - Tool name routing to select appropriate renderer
 * - Orchestrating rendering of all tool outputs
 *
 * NOTE: Tool calling via window.openai.callTool() is implemented but disabled.
 * See widget-script-state.ts for the commented-out refresh button code.
 */
export const WIDGET_SCRIPT = `
const c = document.getElementById('c');
const toolNameEl = document.getElementById('tool-name');

${WIDGET_STATE_JS}

// ========================================
// Safe Area Insets
// ========================================
function applySafeAreaInsets() {
  const safeArea = window.openai?.safeArea;
  if (safeArea?.insets) {
    const { top, right, bottom, left } = safeArea.insets;
    document.documentElement.style.setProperty('--safe-top', \`\${top}px\`);
    document.documentElement.style.setProperty('--safe-right', \`\${right}px\`);
    document.documentElement.style.setProperty('--safe-bottom', \`\${bottom}px\`);
    document.documentElement.style.setProperty('--safe-left', \`\${left}px\`);
  }
  // If no safe area insets, CSS fallback values (20px) are used
}

// ========================================
// Renderer Functions
// ========================================
${WIDGET_RENDERER_FUNCTIONS}

// Renderer dispatcher - maps renderer IDs to functions
const RENDERERS = {
  help: renderHelp,
  search: renderSearch,
  fetch: renderFetch,
  quiz: renderQuiz,
  entitySummary: renderEntitySummary,
  entityList: renderEntityList,
  transcript: renderTranscript,
  assets: renderAssets,
  changelog: renderChangelog,
  rateLimit: renderRateLimit,
  ontology: renderOntology,
};

// ========================================
// Rendering
// ========================================
function updateToolName() {
  const input = window.openai?.toolInput;
  const meta = window.openai?.toolResponseMetadata;
  // Use annotations/title from MCP tool metadata (canonical human-readable name)
  const displayName = meta?.['annotations/title'] || meta?.title || '';
  if (displayName && toolNameEl) { toolNameEl.textContent = displayName; toolNameEl.style.display = 'block'; }
  else if (toolNameEl) { toolNameEl.style.display = 'none'; }
}

function getFullResults() {
  const meta = window.openai?.toolResponseMetadata ?? {};
  const output = window.openai?.toolOutput ?? {};
  if (meta.fullResults) return meta.fullResults;
  if (output.data && typeof output.data === 'object') return output.data;
  return output;
}

function getToolName() {
  const input = window.openai?.toolInput;
  const meta = window.openai?.toolResponseMetadata;
  return meta?.toolName || input?.toolName || null;
}

function getRendererForTool(toolName) {
  if (!toolName) return null;
  const rendererId = TOOL_RENDERER_MAP[toolName];
  if (!rendererId) return null;
  return RENDERERS[rendererId] || null;
}

function render() {
  updateToolName();
  // NOTE: updateActions() was removed - see widget-script-state.ts for refresh button code
  const fullData = getFullResults();
  const toolName = getToolName();
  const renderer = getRendererForTool(toolName);
  const rendererId = toolName ? TOOL_RENDERER_MAP[toolName] : null;
  if (renderer) {
    c.innerHTML = renderer(fullData);
  } else if (fullData.serverOverview || fullData.toolCategories || fullData.workflows) {
    c.innerHTML = renderHelp(fullData);
  } else if (fullData.results !== undefined && fullData.scope !== undefined) {
    c.innerHTML = renderSearch(fullData);
  } else if (fullData.type && fullData.data !== undefined) {
    c.innerHTML = renderFetch(fullData);
  } else if (Object.keys(fullData).length > 0) { // eslint-disable-line no-restricted-properties -- REFACTOR
    c.innerHTML = '<pre>' + esc(JSON.stringify(fullData, null, 2)) + '</pre>';
  } else {
    c.innerHTML = '<div class="empty">Loading...</div>';
  }
  restoreScrollPosition();
}

applySafeAreaInsets();
render();
window.addEventListener('openai:set_globals', (e) => {
  const globals = e.detail?.globals;
  if (globals?.toolOutput !== undefined) render();
  if (globals?.safeArea !== undefined) applySafeAreaInsets();
}, { passive: true });
`.trim();
