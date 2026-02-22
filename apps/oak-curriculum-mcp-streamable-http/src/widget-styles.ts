/**
 * CSS styles for the Oak-branded widget.
 *
 * Extracted from aggregated-tool-widget.ts for maintainability.
 *
 * Features:
 * - Oak brand colors with light/dark mode support (WCAG AA compliant)
 * - Lexend font from Google Fonts (Oak brand typeface)
 * - Responsive layout with flexbox
 * - Action buttons and loading states for tool calling
 *
 * @see aggregated-tool-widget.ts
 */

/**
 * Core CSS styles for the widget.
 *
 * Light mode colors:
 * - Background: #bef2bd (soft green)
 * - Text: #1a3a1b (dark forest - adjusted for 4.5:1+ contrast)
 * - Secondary: #3d5e3e (muted green - adjusted for 4.5:1+ contrast)
 * - Accent high contrast: #1b6330 (dark green - 5.0:1+ for small footer text)
 *
 * Dark mode colors:
 * - Background: #1b3d1c (dark forest)
 * - Text: #f0f7f0 (off-white)
 * - Secondary: #b8dab9 (light green - adjusted for 4.5:1+ contrast)
 * - Accent high contrast: #8cd98f (same as accent - already high contrast)
 */
export const WIDGET_STYLES = `
:root {
  color-scheme: light dark;
  /* Safe area insets - updated by JavaScript from window.openai.safeArea */
  --safe-top: 20px;
  --safe-right: 20px;
  --safe-bottom: 20px;
  --safe-left: 20px;
  /* Oak brand colors */
  --bg: #bef2bd;
  --fg: #1a3a1b;
  --fg-secondary: #3d5e3e;
  --accent: #287d3c;
  --accent-high-contrast: #1b6330;
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
    --accent-high-contrast: #8cd98f;
    --item-bg: rgba(0,0,0,.2);
    --item-border: rgba(240,247,240,.1);
    --code-bg: rgba(255,255,255,.1);
    --border-color: rgba(240,247,240,.15);
  }
}
html { box-sizing: border-box; }
*, *::before, *::after { box-sizing: inherit; }
html, body { margin: 0; padding: 0; }
body { font-family: 'Lexend', system-ui, sans-serif; min-height: 200px; display: flex; flex-direction: column; }
#root { background: var(--bg); color: var(--fg); flex: 1; display: flex; flex-direction: column; }
#content-container { margin: 0.8em; flex: 1; display: flex; flex-direction: column; }
.hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid var(--border-color); }
.hdr-text { display: flex; flex-direction: column; gap: 2px; }
.logo { width: 36px; height: 47px; }
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
.ftr { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--border-color); font-size: 11px; color: var(--fg-secondary); text-align: center; }
.ftr-disclaimer { margin: 0 0 8px; }
.ftr-links { margin: 0; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 4px 8px; }
.ftr-link { color: var(--accent-high-contrast); text-decoration: none; font-weight: 600; text-align: center; }
.ftr-link:hover { text-decoration: underline; }
.ftr-sep { opacity: 0.5; }
.nowrap { white-space: nowrap; }
@media (max-width: 480px) { .ftr-links { flex-direction: column; gap: 0; } .ftr-sep { display: none; } .ftr-link { padding-top: 8px; border-top: 1px solid var(--border-color); } }
.cta-container { margin-left: auto; display: flex; gap: 8px; align-items: center; }
.cta-btn { background: var(--item-bg); color: var(--fg); font-size: 12px; padding: 8px 14px; border-radius: 6px; border: 2px solid var(--accent-high-contrast); white-space: nowrap; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.15s, transform 0.1s, box-shadow 0.1s; }
.cta-btn:hover { background: var(--code-bg); }
.cta-btn:active { transform: scale(0.94); background: var(--accent-high-contrast); color: #fff; box-shadow: inset 0 2px 4px rgba(0,0,0,0.2); }
.cta-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
`.trim();
