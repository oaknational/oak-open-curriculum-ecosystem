/**
 * HTML head template for the landing page.
 *
 * Contains the complete HTML `<head>` section including meta tags,
 * font imports, favicon links, and CSS styles for the landing page.
 *
 * The styles support both light and dark modes via CSS media queries
 * and use Oak National Academy brand colors.
 */

/**
 * Complete HTML document head including styles.
 *
 * Includes:
 * - Meta tags for charset, viewport, and theme color
 * - Lexend font from Google Fonts
 * - Favicon links for various platforms
 * - Full CSS stylesheet with dark mode support
 *
 * @remarks
 * The theme uses Oak National Academy's brand green (`rgb(190, 242, 189)`)
 * for light mode and a dark blue (`#0b1021`) for dark mode.
 */
export const HTML_HEAD = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Oak Curriculum MCP (HTTP)</title>
    <meta name="theme-color" content="rgb(190, 242, 189)" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap" rel="stylesheet" />
    <link rel="icon" href="/favicons/favicon.ico" sizes="any" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png" />
    <link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png" />
    <style>
      :root { color-scheme: light dark; }
      body { margin: 0; font-family: 'Lexend', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; line-height: 1.8; background: rgb(190, 242, 189); color: #000; font-size: 20px; }
      .wrap { max-width: 78ch; margin: 0 auto; padding: 2rem 1rem; }
      h1 { font-size: 2.4rem; margin: 0 0 1rem; }
      h2 { font-size: 1.4rem; margin: 0; display: inline; }
      h3 { font-size: 1.2rem; margin: 1.5rem 0 0.5rem; }
      p { font-size: 1.2rem; margin: 0.25rem 0 1rem; }
      .hero { font-size: 1.35rem; line-height: 1.7; margin: 0.5rem 0 1.5rem; }
      .card { background: rgba(255,255,255,0.75); color: #000; border: 2px solid #111; border-radius: 14px; padding: 1.25rem; margin-bottom: 1rem; }
      .expandable { cursor: pointer; }
      .expandable > summary { display: flex; align-items: center; gap: 0.75rem; list-style: none; }
      .expandable > summary::-webkit-details-marker { display: none; }
      .expandable > summary::before { content: '▶'; display: inline-block; font-size: 0.8rem; transition: transform 0.2s; }
      .expandable[open] > summary::before { transform: rotate(90deg); }
      .expand-hint { font-size: 0.9rem; opacity: 0.6; margin-left: auto; }
      .expandable[open] .expand-hint { display: none; }
      .expandable p { margin-top: 1rem; }
      pre { overflow: auto; padding: 1rem; border-radius: 10px; background: #111827; color: #e5e7eb; font-size: 1rem; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.95em; }
      .logo { display: block; width: 120px; height: auto; margin: 0 0 1rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
      a { color: #064e3b; }
      .meta { font-size: 1rem; opacity: 0.9; }
      .tool-list { margin: 0.5rem 0 0; }
      div.tool-list { padding: 0; }
      ul.tool-list, ol.tool-list { padding: 0 0 0 2rem; }
      ul.tool-list li, ol.tool-list li { margin-bottom: 1rem; padding-left: 0.5rem; }
      ul.tool-list li:last-child, ol.tool-list li:last-child { margin-bottom: 0; }
      .tool-list .tool-item { margin-bottom: 0.5rem; }
      .tool-list .tool-item:last-child { margin-bottom: 0; }
      .tool-list .tool-item > summary { cursor: pointer; list-style: none; display: flex; align-items: center; }
      .tool-list .tool-item > summary::-webkit-details-marker { display: none; }
      .tool-list .tool-item > summary::before { content: '▶'; display: inline-block; font-size: 0.7rem; margin-right: 0.35rem; transition: transform 0.2s; }
      .tool-list .tool-item[open] > summary::before { transform: rotate(90deg); }
      .tool-list code { background: rgba(0,0,0,0.08); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600; }
      .tool-desc { font-size: 1rem; opacity: 0.85; margin-top: 0.5rem; margin-left: 1rem; }
      .tool-how-to-use { margin-top: 0.5rem; }
      .tool-how-to-use > summary { font-size: 0.95rem; opacity: 0.8; cursor: pointer; list-style: none; display: flex; align-items: center; }
      .tool-how-to-use > summary::-webkit-details-marker { display: none; }
      .tool-how-to-use > summary::before { content: '▶'; display: inline-block; font-size: 0.65rem; margin-right: 0.3rem; transition: transform 0.2s; }
      .tool-how-to-use[open] > summary::before { transform: rotate(90deg); }
      .tool-how-to-use-body { margin-top: 0.25rem; font-size: 0.95rem; line-height: 1.6; white-space: pre-wrap; }
      .resource-title { display: block; font-weight: 600; margin-top: 0.25rem; }
      .prompt-args { display: block; font-size: 0.9rem; opacity: 0.7; margin-top: 0.25rem; }
      .tool-group-label { font-size: 1.1rem; margin: 1.25rem 0 0; display: block; }
      .tool-group-label.muted { opacity: 0.55; }
      .tool-group-hint { font-size: 0.95rem; opacity: 0.55; margin: 0.15rem 0 0.25rem; }
      .tool-divider { border: none; border-top: 1px solid rgba(0,0,0,0.1); margin: 1.25rem 0; }
      @media (prefers-color-scheme: dark) {
        body { background: #0b1021; color: #e6edf3; }
        .card { background: #111827; color: #f9fafb; border-color: #334155; }
        pre { background: #0b1021; color: #e6edf3; border: 1px solid #334155; }
        a { color: #93c5fd; }
        .tool-list code { background: rgba(255,255,255,0.1); }
        .tool-divider { border-top-color: rgba(255,255,255,0.1); }
      }
    </style>
  </head>`;
