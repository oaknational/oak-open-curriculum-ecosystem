/**
 * Oak-branded widget for rendering aggregated tool output in ChatGPT.
 *
 * This HTML is served as an MCP resource with `text/html+skybridge` MIME type.
 * ChatGPT fetches this resource when a tool specifies it as `openai/outputTemplate`.
 *
 * The widget receives tool output via `window.openai.toolOutput` and renders it
 * with Oak brand styling, logo, and the Lexend font.
 *
 * @see https://developers.openai.com/apps-sdk/build/chatgpt-ui
 */

import { OAK_LOGO_BASE64 } from './oak-logo-base64.js';

/**
 * URI for the Oak JSON viewer widget resource.
 *
 * This URI is referenced by aggregated tools in their `_meta.openai/outputTemplate` field.
 * ChatGPT fetches this resource after tool execution to render the output.
 */
export const AGGREGATED_TOOL_WIDGET_URI = 'ui://widget/oak-json-viewer.html';

/**
 * MIME type for ChatGPT widget resources.
 *
 * The `+skybridge` suffix tells ChatGPT to render this HTML in a sandbox
 * with the `window.openai` API available.
 */
export const AGGREGATED_TOOL_WIDGET_MIME_TYPE = 'text/html+skybridge';

/**
 * Oak-branded HTML widget for rendering tool output.
 *
 * Features:
 * - Oak National Academy logo in header with optional tool subtitle
 * - Lexend font from Google Fonts (Oak brand typeface)
 * - Oak brand colors with light/dark mode support (WCAG AA compliant)
 * - Reads tool output from `window.openai.toolOutput`
 * - Responsive JSON formatting with word wrap
 * - AI disclaimer footer
 *
 * Light mode colors:
 * - Background: #bef2bd (soft green)
 * - Text: #1a3a1b (dark forest - adjusted for 4.5:1+ contrast)
 * - Secondary: #3d5e3e (muted green - adjusted for 4.5:1+ contrast)
 *
 * Dark mode colors:
 * - Background: #1b3d1c (dark forest)
 * - Text: #f0f7f0 (off-white)
 * - Secondary: #b8dab9 (light green - adjusted for 4.5:1+ contrast)
 */
export const AGGREGATED_TOOL_WIDGET_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Oak National Academy</title>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: light dark;
      --bg: #bef2bd;
      --fg: #1a3a1b;
      --fg-secondary: #3d5e3e;
      --accent: #287d3c;
      --item-bg: rgba(255,255,255,.5);
      --item-border: rgba(27,61,28,.1);
      --code-bg: rgba(0,0,0,.12);
      --border-color: rgba(27,61,28,.15);
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #1b3d1c;
        --fg: #f0f7f0;
        --fg-secondary: #b8dab9;
        --accent: #8cd98f;
        --item-bg: rgba(0,0,0,.2);
        --item-border: rgba(240,247,240,.1);
        --code-bg: rgba(255,255,255,.1);
        --border-color: rgba(240,247,240,.15);
      }
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; margin: 0; }
    body { padding: 16px; font-family: 'Lexend', system-ui, sans-serif; min-height: 200px; display: flex; flex-direction: column; }
    #root { background: var(--bg); color: var(--fg); border-radius: 12px; padding: 20px; flex: 1; display: flex; flex-direction: column; }
    .hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid var(--border-color); }
    .hdr-text { display: flex; flex-direction: column; gap: 2px; }
    .logo { width: 36px; height: 36px; }
    .ttl { font-weight: 600; font-size: 16px; margin: 0; }
    .sub-ttl { font-size: 12px; color: var(--fg-secondary); margin: 0; }
    #c { flex: 1; }
    .sec { margin-bottom: 16px; }
    .sec-ttl { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; margin: 0 0 10px; color: var(--fg-secondary); }
    .list { display: flex; flex-direction: column; gap: 8px; }
    .item { background: var(--item-bg); border-radius: 8px; padding: 12px; border: 1px solid var(--item-border); }
    .item-ttl { font-weight: 500; font-size: 14px; margin: 0 0 4px; }
    .meta { font-size: 12px; color: var(--fg-secondary); margin: 0; }
    .link { color: var(--accent); text-decoration: none; font-size: 12px; font-weight: 500; }
    .badge { background: var(--accent); color: white; font-size: 11px; padding: 2px 8px; border-radius: 10px; margin-left: 8px; }
    @media (prefers-color-scheme: dark) { .badge { color: #1b3d1c; } }
    pre { white-space: pre-wrap; word-wrap: break-word; font-size: 12px; line-height: 1.5; margin: 0; font-family: monospace; background: var(--code-bg); padding: 12px; border-radius: 8px; }
    code { background: var(--code-bg); padding: 2px 6px; border-radius: 4px; font-size: 11px; }
    .empty { text-align: center; padding: 24px; color: var(--fg-secondary); font-size: 14px; }
    .ftr { margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--fg-secondary); text-align: center; }
  </style>
</head>
<body>
  <main id="root">
    <div class="hdr">
      <img class="logo" src="data:image/png;base64,${OAK_LOGO_BASE64}" alt="Oak National Academy logo">
      <div class="hdr-text">
        <h1 class="ttl">Oak National Academy</h1>
        <p class="sub-ttl" id="tool-name"></p>
      </div>
    </div>
    <div id="c"></div>
    <div class="ftr">AI can make mistakes. Check all generated resources before use.</div>
  </main>
  <script type="module">
    const c = document.getElementById('c');
    const toolNameEl = document.getElementById('tool-name');
    const esc = s => typeof s !== 'string' ? '' : s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');

    function updateToolName() {
      const input = window.openai?.toolInput;
      const meta = window.openai?.toolResponseMetadata;
      const name = meta?.['annotations/title'] || meta?.title || input?.toolName || '';
      if (name && toolNameEl) {
        toolNameEl.textContent = name;
        toolNameEl.style.display = 'block';
      } else if (toolNameEl) {
        toolNameEl.style.display = 'none';
      }
    }

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
          if (u) h += '<a class="link" href="' + esc(u) + '" target="_blank">View →</a>';
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

    function render() {
      updateToolName();
      const o = window.openai?.toolOutput ?? {};
      const d = o.data;
      if (o.serverOverview || o.toolCategories || o.workflows) {
        c.innerHTML = renderHelpContent(o);
      } else if (d?.lessons !== undefined || d?.transcripts !== undefined) {
        c.innerHTML = renderSearchResults(d);
      } else if (o.status !== undefined || d !== undefined) {
        c.innerHTML = '<pre>' + esc(JSON.stringify(o, null, 2)) + '</pre>';
      } else if (Object.keys(o).length === 0) {
        c.innerHTML = '<div class="empty">Loading...</div>';
      } else {
        c.innerHTML = '<pre>' + esc(JSON.stringify(o, null, 2)) + '</pre>';
      }
    }

    render();
    window.addEventListener('openai:set_globals', (e) => {
      if (e.detail?.globals?.toolOutput !== undefined) render();
    }, { passive: true });
  </script>
</body>
</html>`.trim();
