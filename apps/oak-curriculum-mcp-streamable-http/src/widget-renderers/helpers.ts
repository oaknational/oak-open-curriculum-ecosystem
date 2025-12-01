/**
 * Shared HTML rendering helpers for widget renderers.
 *
 * These are pure functions that generate HTML strings.
 * They run inside the ChatGPT sandbox as embedded JavaScript.
 *
 * @see widget-script.ts - Main widget script that uses these helpers
 */

/**
 * Helper JavaScript functions that are shared across all renderers.
 *
 * Includes:
 * - esc(): HTML entity escaping
 * - renderSection(): Section container with title and optional badge
 * - renderItem(): Item card with title and metadata
 * - renderBadge(): Count/status badge
 * - renderLink(): Oak website link with openExternal support
 */
export const WIDGET_HELPERS = `
/**
 * Escapes HTML entities to prevent XSS.
 */
function esc(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/**
 * Renders a section container with title and optional badge.
 */
function renderSection(title, content, badgeCount) {
  const badge = badgeCount !== undefined ? '<span class="badge">' + badgeCount + '</span>' : '';
  return '<div class="sec"><h2 class="sec-ttl">' + esc(title) + badge + '</h2>' + content + '</div>';
}

/**
 * Renders an item card with title and optional metadata.
 */
function renderItem(title, meta, link) {
  let h = '<div class="item"><p class="item-ttl">' + esc(title) + '</p>';
  if (meta) h += '<p class="meta">' + esc(meta) + '</p>';
  if (link) h += '<a class="link" href="' + esc(link) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(link) + '\\')">View on Oak →</a>';
  h += '</div>';
  return h;
}

/**
 * Renders a badge with count or text.
 */
function renderBadge(text) {
  return '<span class="badge">' + esc(String(text)) + '</span>';
}

/**
 * Renders a link to Oak website with openExternal support.
 */
function renderOakLink(url, text) {
  if (!url) return '';
  const label = text || 'View on Oak →';
  return '<a class="link" href="' + esc(url) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(url) + '\\')">' + esc(label) + '</a>';
}

/**
 * Renders a list container.
 */
function renderList(items) {
  return '<div class="list">' + items + '</div>';
}

/**
 * Renders a code block.
 */
function renderCode(text) {
  return '<code>' + esc(text) + '</code>';
}

/**
 * Renders a pre-formatted JSON block.
 */
function renderJson(data) {
  return '<pre style="font-size:12px;max-height:300px;overflow:auto">' + esc(JSON.stringify(data, null, 2)) + '</pre>';
}
`.trim();
