/**
 * Rendering functions for the Oak-branded widget.
 *
 * Extracted from widget-script.ts for maintainability.
 *
 * @see widget-script.ts
 */

/**
 * JavaScript rendering functions for help content and search results.
 *
 * These functions are embedded in the widget HTML and run in the ChatGPT sandbox.
 */
export const WIDGET_RENDERERS = `
function renderHelpContent(o) {
  let h = '';
  if (o.serverOverview) {
    h += '<div class="sec"><h2 class="sec-ttl">Overview</h2>';
    h += '<p style="margin:0;font-size:14px">' + esc(o.serverOverview.description || '') + '</p></div>';
  }
  if (o.toolCategories) {
    const cats = Object.entries(o.toolCategories);
    if (cats.length > 0) {
      h += '<div class="sec"><h2 class="sec-ttl">Tool Categories<span class="badge">' + cats.length + '</span></h2><div class="list">';
      cats.forEach(([name, cat]) => {
        h += '<div class="item"><p class="item-ttl">' + esc(name) + '</p>';
        h += '<p class="meta">' + esc(cat.description || '') + '</p>';
        if (cat.tools?.length) h += '<p class="meta" style="margin-top:4px">Tools: ' + cat.tools.map(t => '<code>' + esc(t) + '</code>').join(' ') + '</p>';
        h += '</div>';
      });
      h += '</div></div>';
    }
  }
  if (o.workflows) {
    const wfs = Object.entries(o.workflows);
    if (wfs.length > 0) {
      h += '<div class="sec"><h2 class="sec-ttl">Workflows<span class="badge">' + wfs.length + '</span></h2><div class="list">';
      wfs.forEach(([, wf]) => {
        h += '<div class="item"><p class="item-ttl">' + esc(wf.title || '') + '</p>';
        h += '<p class="meta">' + esc(wf.description || '') + '</p></div>';
      });
      h += '</div></div>';
    }
  }
  if (o.tips?.length) {
    h += '<div class="sec"><h2 class="sec-ttl">Tips</h2><ul style="margin:0;padding-left:20px">';
    o.tips.slice(0,5).forEach(t => { h += '<li style="font-size:13px;margin-bottom:4px">' + esc(t) + '</li>'; });
    h += '</ul></div>';
  }
  return h;
}

function renderSearchResults(d) {
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

function renderFetchResult(data) {
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
