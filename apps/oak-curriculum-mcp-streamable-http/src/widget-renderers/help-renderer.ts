/**
 * Help content renderer for the widget.
 *
 * Renders About Oak section, server overview, tool categories, workflows, and tips
 * from the get-help tool output.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render help content in the widget.
 *
 * Handles the following data shape:
 * - serverOverview: { aboutOak, oakWebsite, description, ... }
 * - toolCategories: { [name]: { description, tools, ... } }
 * - workflows: { [name]: { title, description, ... } }
 * - tips: string[]
 */
export const HELP_RENDERER = `
function renderHelp(o) {
  let h = '';
  if (o.serverOverview?.aboutOak) {
    h += '<div class="sec"><h2 class="sec-ttl">About Oak</h2>';
    h += '<p style="margin:0 0 8px;font-size:14px">' + esc(o.serverOverview.aboutOak) + '</p>';
    if (o.serverOverview.oakWebsite) {
      h += '<p style="margin:0"><a href="' + esc(o.serverOverview.oakWebsite) + '" target="_blank" rel="noopener" style="color:var(--accent-high-contrast);font-size:13px">' + 'Visit Oak →' + '</a></p>';
    }
    h += '</div>';
  }
  if (o.serverOverview?.description) {
    h += '<div class="sec"><h2 class="sec-ttl">MCP Server</h2>';
    h += '<p style="margin:0;font-size:14px">' + esc(o.serverOverview.description) + '</p></div>';
  }
  if (o.toolCategories) {
    const cats = Object.entries(o.toolCategories);
    if (cats.length > 0) {
      h += '<div class="sec"><h2 class="sec-ttl">Tool Categories<span class="badge">' + cats.length + '</span></h2><div class="list">';
      cats.forEach(([name, cat]) => {
        h += '<div class="item"><p class="item-ttl">' + esc(name) + '</p>';
        h += '<p class="meta">' + esc(cat.description || '') + '</p>';
        if (cat.tools?.length) h += '<p class="meta" style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;align-items:center">Tools: ' + cat.tools.map(t => '<code>' + esc(t) + '</code>').join('') + '</p>';
        h += '</div>';
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
`.trim();
