/**
 * Changelog renderer for the widget.
 *
 * Renders API version history and changes.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render changelog data in the widget.
 *
 * Handles the following data shapes:
 * - { version: string, date: string, changes: string[] } (single entry)
 * - [ { version, date, changes }, ... ] (array of entries)
 */
export const CHANGELOG_RENDERER = `
function renderChangelog(data) {
  let h = '';
  
  // Normalize to array
  const entries = Array.isArray(data) ? data : [data];
  
  if (entries.length === 0 || !entries[0].version) {
    return '<div class="empty">No changelog data available.</div>';
  }
  
  h += '<div class="sec"><h2 class="sec-ttl">Changelog<span class="badge">' + entries.length + ' versions</span></h2><div class="list">';
  
  entries.slice(0, 5).forEach(entry => {
    h += '<div class="item changelog-entry">';
    h += '<p class="item-ttl"><span class="version-badge">v' + esc(entry.version || '') + '</span>';
    if (entry.date) h += ' <span class="meta">' + esc(entry.date) + '</span>';
    h += '</p>';
    
    if (entry.changes && Array.isArray(entry.changes) && entry.changes.length > 0) {
      h += '<ul class="changes-list" style="margin:8px 0 0;padding-left:20px;font-size:13px">';
      entry.changes.forEach(change => {
        h += '<li style="margin-bottom:4px">' + esc(change) + '</li>';
      });
      h += '</ul>';
    }
    h += '</div>';
  });
  
  if (entries.length > 5) {
    h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (entries.length - 5) + ' older versions</p>';
  }
  
  h += '</div></div>';
  return h;
}
`.trim();
