/**
 * Search results renderer for the widget.
 *
 * Renders search results from the `search` tool (SDK-backed, Elasticsearch).
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render search results in the widget.
 *
 * Handles the following data shapes:
 * - `\{ scope, total, took, results: [...] \}` (SDK-backed search tool)
 * - `[...]` (flat array of results)
 */
export const SEARCH_RENDERER = `
function renderSearch(d) {
  let h = '';
  var scopeLabel = (d && d.scope) ? d.scope : 'results';
  var total = (d && typeof d.total === 'number') ? d.total : 0;
  var ls = Array.isArray(d) ? d : (d.results ?? []);
  if (Array.isArray(ls) && ls.length > 0) {
    var badge = total > 0 ? total : ls.length;
    h += '<div class="sec"><h2 class="sec-ttl">Search ' + esc(scopeLabel) + '<span class="badge">' + badge + '</span></h2><div class="list">';
    ls.slice(0,5).forEach(l => {
      const t = l.lessonTitle || l.title || l.slug || 'Untitled';
      const un = Array.isArray(l.units) && l.units.length > 0 ? l.units[0] : null;
      const s = l.subjectTitle || l.subject || (un ? un.subjectSlug : '') || '';
      const k = l.keyStageTitle || l.keyStage || (un ? un.keyStageSlug : '') || '';
      const u = l.canonicalUrl || '';
      h += '<div class="item"><p class="item-ttl">' + esc(t) + '</p>';
      if (s || k) h += '<p class="meta">' + esc([s,k].filter(Boolean).join(' \\u2022 ')) + '</p>';
      if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(u) + '\\')">View on Oak \\u2192</a>';
      h += '</div>';
    });
    if (ls.length > 5) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (ls.length-5) + ' more</p>';
    h += '</div></div>';
  }
  return h || '<div class="empty">No results found.</div>';
}
`.trim();
