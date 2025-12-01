/**
 * Fetch result renderer for the widget.
 *
 * Renders fetched resource details from the fetch tool.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render fetch results in the widget.
 *
 * Handles the following data shape:
 * - { type: string, data: object, canonicalUrl?: string, id?: string }
 */
export const FETCH_RENDERER = `
function renderFetch(data) {
  let h = '';
  const type = data.type || 'Resource';
  const url = data.canonicalUrl;
  const id = data.id || '';
  h += '<div class="sec"><h2 class="sec-ttl">' + esc(type.charAt(0).toUpperCase() + type.slice(1)) + '</h2>';
  if (id) h += '<p class="meta">ID: <code>' + esc(id) + '</code></p>';
  if (url) h += '<p style="margin-top:8px"><a class="link" href="' + esc(url) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(url) + '\\')">View on Oak →</a></p>';
  h += '<div style="margin-top:12px"><pre style="font-size:12px;max-height:300px;overflow:auto">' + esc(JSON.stringify(data.data, null, 2)) + '</pre></div>';
  h += '</div>';
  return h;
}
`.trim();
