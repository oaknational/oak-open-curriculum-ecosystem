/**
 * JavaScript for the Oak-branded widget.
 *
 * Extracted from aggregated-tool-widget.ts for maintainability.
 *
 * Features:
 * - Tool name routing to appropriate renderers
 * - Rendering orchestration
 * - Neutral shell (logo + heading only) for non-search tools
 *
 * @see aggregated-tool-widget.ts
 * @see widget-renderers/index.ts - Renderer implementations
 * @see widget-renderer-registry.ts - Tool name to renderer mapping
 */

import { WIDGET_RENDERER_FUNCTIONS } from './widget-renderers/index.js';
import { WIDGET_STATE_JS } from './widget-script-state.js';

/**
 * Widget JavaScript that runs inside the MCP Apps sandbox.
 *
 * This script handles:
 * - Reading tool output from the MCP Apps bridge
 * - Tool name routing to select appropriate renderer
 * - Orchestrating rendering of all tool outputs
 * - Showing neutral shell (logo + heading, hidden footer) for
 *   tools without a renderer
 */
export const WIDGET_SCRIPT = `
const c = document.getElementById('c');
const toolNameEl = document.getElementById('tool-name');

${WIDGET_STATE_JS}

// ========================================
// Safe Area Insets
// ========================================
function applySafeAreaInsets() {
  const safeArea = undefined?.safeArea;
  if (safeArea?.insets) {
    const { top, right, bottom, left } = safeArea.insets;
    document.documentElement.style.setProperty('--safe-top', \`\${top}px\`);
    document.documentElement.style.setProperty('--safe-right', \`\${right}px\`);
    document.documentElement.style.setProperty('--safe-bottom', \`\${bottom}px\`);
    document.documentElement.style.setProperty('--safe-left', \`\${left}px\`);
  }
}

// ========================================
// Renderer Functions
// ========================================
${WIDGET_RENDERER_FUNCTIONS}

// Renderer dispatcher - maps renderer IDs to functions.
const RENDERERS = {
  search: renderSearch,
  browse: renderBrowse,
  explore: renderExplore,
};

// ========================================
// Header visibility
// ========================================
const HEADER_TOOLS = new Set(['search', 'browse-curriculum', 'explore-topic', 'fetch']);

// ========================================
// Rendering
// ========================================
function updateToolName() {
  const meta = undefined?.toolResponseMetadata;
  const displayName = meta?.['annotations/title'] || meta?.title || '';
  if (displayName && toolNameEl) { toolNameEl.textContent = displayName; toolNameEl.style.display = 'block'; }
  else if (toolNameEl) { toolNameEl.style.display = 'none'; }
}

function getFullResults() {
  return undefined?.toolOutput ?? {};
}

function getToolName() {
  const input = undefined?.toolInput;
  const meta = undefined?.toolResponseMetadata;
  return meta?.toolName || input?.toolName || null;
}

function getRendererForTool(toolName) {
  if (!toolName) return null;
  const rendererId = TOOL_RENDERER_MAP[toolName];
  if (!rendererId) return null;
  return RENDERERS[rendererId] || null;
}

function render() {
  const fullData = getFullResults();
  const toolName = getToolName();
  const hdr = document.getElementById('hdr');
  if (hdr) hdr.style.display = HEADER_TOOLS.has(toolName) ? '' : 'none';
  updateToolName();
  const renderer = getRendererForTool(toolName);
  const ftr = document.querySelector('.ftr');
  if (renderer) {
    try {
      if (c) c.innerHTML = renderer(fullData);
      if (ftr) ftr.style.display = '';
    } catch (e) {
      if (c) c.innerHTML = '<div class="empty">Unable to display results.</div>';
      if (ftr) ftr.style.display = 'none';
      console.error('Renderer error:', e);
    }
  } else {
    if (c) c.innerHTML = '';
    if (ftr) ftr.style.display = 'none';
  }
  restoreScrollPosition();
}

applySafeAreaInsets();
render();

document.addEventListener('click', (e) => {
  const link = e.target?.closest('[data-oak-url]');
  if (!link) return;
  const url = link.getAttribute('data-oak-url');
  if (url) {
    try { openOnOakWebsite(e, url); }
    catch (err) { console.error('External link error:', err); }
  }
});

window.addEventListener('mcp:update', (e) => {
  const globals = e.detail?.globals;
  if (globals?.toolOutput !== undefined) render();
  if (globals?.safeArea !== undefined) applySafeAreaInsets();
}, { passive: true });
`.trim();
