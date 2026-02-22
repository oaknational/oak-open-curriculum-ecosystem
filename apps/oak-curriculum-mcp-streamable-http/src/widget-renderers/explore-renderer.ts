/**
 * Explore-topic renderer for the widget.
 *
 * Renders the output of the `explore-topic` tool, which returns
 * multi-scope results with ok/error per scope plus a topic string.
 * Reuses extractTitle/extractSubject/extractKeyStage/extractUrl
 * from helpers.ts for per-scope field extraction.
 *
 * The renderer handles `lessons`, `units`, and `threads` scopes only.
 * `sequences` is intentionally omitted because the `explore-topic` tool
 * only searches those three scopes (see SDK `aggregated-explore/execution.ts`).
 *
 * @see widget-renderer-registry.ts - Registry routing
 * @see ./helpers.ts - Shared field-extraction helpers
 */
export const EXPLORE_RENDERER = `
function renderExplore(d) {
  if (!d) return '<div class="empty">No results found.</div>';

  var topic = d.topic || '';
  var scopes = ['lessons', 'units', 'threads'];
  var hasAny = false;
  var h = '';

  if (topic) {
    h += '<div class="sec"><h2 class="sec-ttl">Explore: ' + esc(topic) + '</h2></div>';
  }

  scopes.forEach(function(scope) {
    var bucket = d[scope];
    if (!bucket || !bucket.ok || !bucket.data) return;
    var results = bucket.data.results;
    if (!Array.isArray(results) || results.length === 0) return;
    hasAny = true;

    var total = (typeof bucket.data.total === 'number') ? bucket.data.total : results.length;
    h += '<div class="sec"><h2 class="sec-ttl">' + esc(scope) + '<span class="badge">' + total + '</span></h2><div class="list">';
    results.slice(0,5).forEach(function(r) {
      var t = extractTitle(r, scope);
      var s = extractSubject(r, scope);
      var k = extractKeyStage(r, scope);
      var u = extractUrl(r, scope);
      h += '<div class="item"><p class="item-ttl">' + esc(t) + '</p>';
      if (s || k) h += '<p class="meta">' + esc([s,k].filter(Boolean).join(' \\u2022 ')) + '</p>';
      if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank" rel="noopener noreferrer" data-oak-url="' + esc(u) + '">View on Oak \\u2192</a>';
      h += '</div>';
    });
    h += '</div></div>';
  });

  if (!hasAny) return '<div class="empty">No results found.</div>';
  return h;
}
`.trim();
