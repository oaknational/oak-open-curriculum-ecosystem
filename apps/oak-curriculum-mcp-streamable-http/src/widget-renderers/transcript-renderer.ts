/**
 * Transcript renderer for the widget.
 *
 * Renders lesson transcripts with optional VTT data.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render transcript data in the widget.
 *
 * Handles the following data shape:
 * - `\{ transcript: string, vtt?: string \}`
 */
export const TRANSCRIPT_RENDERER = `
function renderTranscript(data) {
  let h = '';
  
  if (data.transcript) {
    h += '<div class="sec"><h2 class="sec-ttl">Transcript</h2>';
    h += '<div class="transcript-text" style="font-size:14px;line-height:1.6;max-height:400px;overflow-y:auto;padding:12px;background:#f8f9fa;border-radius:8px">';
    h += esc(data.transcript);
    h += '</div></div>';
  }
  
  if (data.vtt) {
    h += '<div class="sec"><h2 class="sec-ttl">VTT Data</h2>';
    h += '<details style="margin-top:8px"><summary style="cursor:pointer;font-size:13px;color:#666">Show VTT timing data</summary>';
    h += '<pre style="font-size:11px;max-height:200px;overflow:auto;margin-top:8px;background:#f0f0f0;padding:8px;border-radius:4px">' + esc(data.vtt) + '</pre>';
    h += '</details></div>';
  }
  
  if (!h) {
    h = '<div class="empty">No transcript available.</div>';
  }
  
  // Canonical URL link
  if (data.canonicalUrl) {
    h += '<div class="sec" style="margin-top:16px;padding-top:16px;border-top:1px solid #e0e0e0">';
    h += '<a class="link" href="' + esc(data.canonicalUrl) + '" target="_blank" onclick="openOnOakWebsite(event, \\'' + esc(data.canonicalUrl) + '\\')">View original Oak resource →</a>';
    h += '</div>';
  }
  
  return h;
}
`.trim();
