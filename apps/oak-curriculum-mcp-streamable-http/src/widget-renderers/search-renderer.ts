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
 * - { lessons: [...], transcripts: [...] }
 * - { lessons: { results: [...] }, transcripts: { results: [...] } }
 */
export const SEARCH_RENDERER = `
function renderSearch(d) {
  let h = '';
  const ls = d.lessons?.results ?? d.lessons ?? [];
  if (Array.isArray(ls) && ls.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Lessons<span class="badge">' + ls.length + '</span></h2><div class="list">';
    ls.slice(0,5).forEach(l => {
      const t = l.lessonTitle || l.title || l.slug || 'Untitled', s = l.subjectTitle || '', k = l.keyStage || '', u = l.canonicalUrl || '';
      h += '<div class="item"><p class="item-ttl">' + esc(t) + '</p>';
      if (s || k) h += '<p class="meta">' + esc([s,k].filter(Boolean).join(' • ')) + '</p>';
      if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(u) + '\\')">View on Oak →</a>';
      h += '</div>';
    });
    if (ls.length > 5) h += '<p class="meta" style="text-align:center;margin-top:8px">+' + (ls.length-5) + ' more</p>';
    h += '</div></div>';
  }
  const ts = d.transcripts?.results ?? d.transcripts ?? [];
  if (Array.isArray(ts) && ts.length > 0) {
    h += '<div class="sec"><h2 class="sec-ttl">Transcripts<span class="badge">' + ts.length + '</span></h2><div class="list">';
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
