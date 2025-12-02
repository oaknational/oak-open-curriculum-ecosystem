/**
 * Search results renderer for the widget.
 *
 * Renders lesson and transcript search results from search tools.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render search results in the widget.
 *
 * Handles the following data shapes:
 * - { lessons: [...], transcripts: [...] } (aggregated search tool)
 * - { lessons: { results: [...] }, transcripts: { results: [...] } } (nested results)
 * - [...] (flat array from get-search-lessons or get-search-transcripts)
 */
export const SEARCH_RENDERER = `
function renderSearch(d) {
  let h = '';
  // Handle flat array root (from get-search-lessons or get-search-transcripts)
  // Or nested { lessons: [...] } or { lessons: { results: [...] } }
  const ls = Array.isArray(d) ? d : (d.lessons?.results ?? d.lessons ?? []);
  if (Array.isArray(ls) && ls.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">From lesson similarity<span class="badge">' + ls.length + '</span></h2><div class="list">';
    ls.slice(0,5).forEach(l => {
      const t = l.lessonTitle || l.title || l.slug || 'Untitled';
      const un = Array.isArray(l.units) && l.units.length > 0 ? l.units[0] : null;
      const s = l.subjectTitle || (un ? un.subjectSlug : '') || '';
      const k = l.keyStage || (un ? un.keyStageSlug : '') || '';
      const u = l.canonicalUrl || '';
      h += '<div class="item"><p class="item-ttl">' + esc(t) + '</p>';
      if (s || k) h += '<p class="meta">' + esc([s,k].filter(Boolean).join(' • ')) + '</p>';
      if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(u) + '\\')">View on Oak →</a>';
      h += '</div>';
    });
    if (ls.length > 5) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (ls.length-5) + ' more</p>';
    h += '</div></div>';
  }
  // Transcripts only from nested structure (not from flat array)
  const ts = Array.isArray(d) ? [] : (d.transcripts?.results ?? d.transcripts ?? []);
  if (Array.isArray(ts) && ts.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">From transcript search<span class="badge">' + ts.length + '</span></h2><div class="list">';
    ts.slice(0,3).forEach(t => {
      const ttl = t.lessonTitle || t.title || 'Transcript', sn = t.highlightedContent || t.snippet || '';
      h += '<div class="item"><p class="item-ttl">' + esc(ttl) + '</p>';
      if (sn) h += '<p class="meta">' + esc(sn.slice(0,150)) + (sn.length>150?'...':'') + '</p>';
      h += '</div>';
    });
    if (ts.length > 3) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (ts.length-3) + ' more</p>';
    h += '</div></div>';
  }
  return h || '<div class="empty">No results found.</div>';
}
`.trim();
