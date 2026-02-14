/**
 * Rate limit renderer for the widget.
 *
 * Renders API rate limit status with progress visualisation.
 *
 * @see widget-renderer-registry.ts - Registry that routes to this renderer
 */

/**
 * JavaScript function to render rate limit data in the widget.
 *
 * Handles the following data shape:
 * - `\{ remaining: number, limit: number, reset?: string | number \}`
 */
export const RATE_LIMIT_RENDERER = `
function renderRateLimit(data) {
  let h = '';
  
  const remaining = data.remaining ?? 0;
  const limit = data.limit ?? 0;
  const used = limit - remaining;
  const percent = limit > 0 ? Math.round((used / limit) * 100) : 0;
  
  h += '<div class="sec"><h2 class="sec-ttl">Rate Limit Status</h2>';
  
  // Progress bar
  const barColor = percent > 80 ? '#e74c3c' : (percent > 50 ? '#f39c12' : '#27ae60');
  h += '<div class="rate-limit-bar" style="background:#eee;border-radius:8px;height:24px;margin:12px 0;overflow:hidden">';
  h += '<div style="background:' + barColor + ';height:100%;width:' + percent + '%;transition:width 0.3s"></div>';
  h += '</div>';
  
  // Stats
  h += '<div style="display:flex;justify-content:space-between;font-size:14px">';
  h += '<span><strong>Used:</strong> ' + used + ' / ' + limit + '</span>';
  h += '<span><strong>Remaining:</strong> ' + remaining + '</span>';
  h += '</div>';
  
  // Reset time
  if (data.reset) {
    let resetText = data.reset;
    if (typeof data.reset === 'number') {
      try {
        resetText = new Date(data.reset * 1000).toLocaleTimeString();
      } catch (e) {
        resetText = String(data.reset);
      }
    }
    h += '<p class="meta" style="margin-top:12px;text-align:center">Resets at: ' + esc(resetText) + '</p>';
  }
  
  h += '</div>';
  return h;
}
`.trim();
