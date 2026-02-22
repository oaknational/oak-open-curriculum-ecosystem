/**
 * Search results renderer for the widget.
 *
 * Renders search results from the `search` tool (SDK-backed, Elasticsearch).
 * Handles all four scopes (lessons, units, threads, sequences) plus suggest.
 *
 * Field extraction uses helpers from helpers.ts:
 * - extractTitle(result, scope) - title from nested scope object
 * - extractSubject(result, scope) - subject, joining arrays for threads
 * - extractKeyStage(result, scope) - key stage, joining arrays for sequences
 * - extractUrl(result, scope) - scope-appropriate URL field
 *
 * Suggest branch: when data has a `suggestions` property, renders
 * suggestion items as a list instead of scoped search results.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 * @see ./helpers.ts - Field-extraction helpers
 */
export const SEARCH_RENDERER = `
function renderSearch(d) {
  if (!d) return '<div class="empty">No results found.</div>';

  if ('suggestions' in d && Array.isArray(d.suggestions)) {
    if (d.suggestions.length === 0) return '<div class="empty">No suggestions found.</div>';
    var sh = '<div class="sec"><h2 class="sec-ttl">Suggestions<span class="badge">' + d.suggestions.length + '</span></h2><div class="list">';
    d.suggestions.forEach(function(s) {
      var label = s.label || '';
      var url = s.url || '';
      var subj = s.subject || '';
      var ks = s.keyStage || '';
      var scopeTag = s.scope || '';
      sh += '<div class="item"><p class="item-ttl">' + esc(label) + '</p>';
      var meta = [subj, ks, scopeTag].filter(Boolean);
      if (meta.length > 0) sh += '<p class="meta">' + esc(meta.join(' \\u2022 ')) + '</p>';
      if (url) sh += '<a class="link" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer" data-oak-url="' + esc(url) + '">View on Oak \\u2192</a>';
      sh += '</div>';
    });
    sh += '</div></div>';
    return sh;
  }

  if (!d.scope) return '<div class="empty">Search data is missing required scope field.</div>';
  if (!Array.isArray(d.results)) return '<div class="empty">Search data is missing required results array.</div>';
  if (typeof d.total !== 'number') return '<div class="empty">Search data is missing required total field.</div>';

  var scope = d.scope;
  var total = d.total;
  var ls = d.results;
  if (ls.length > 0) {
    var badge = total > 0 ? total : ls.length;
    var h = '<div class="sec"><h2 class="sec-ttl">Search ' + esc(scope) + '<span class="badge">' + badge + '</span></h2><div class="list">';
    ls.slice(0,5).forEach(function(l) {
      var t = extractTitle(l, scope);
      var s = extractSubject(l, scope);
      var k = extractKeyStage(l, scope);
      var u = extractUrl(l, scope);
      h += '<div class="item"><p class="item-ttl">' + esc(t) + '</p>';
      if (s || k) h += '<p class="meta">' + esc([s,k].filter(Boolean).join(' \\u2022 ')) + '</p>';
      if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" data-oak-url="' + esc(u) + '">View on Oak \\u2192</a>';
      h += '</div>';
    });
    if (ls.length > 5) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (ls.length-5) + ' more</p>';
    h += '</div></div>';
    return h;
  }
  return '<div class="empty">No results found.</div>';
}
`.trim();
