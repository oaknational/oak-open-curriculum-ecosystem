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
      .expandable summary { display: flex; align-items: center; gap: 0.75rem; list-style: none; }
      .expandable summary::-webkit-details-marker { display: none; }
      .expandable summary::before { content: '▶'; font-size: 0.8rem; transition: transform 0.2s; }
      .expandable[open] summary::before { transform: rotate(90deg); }
      .expand-hint { font-size: 0.9rem; opacity: 0.6; margin-left: auto; }
      .expandable[open] .expand-hint { display: none; }
      .expandable p { margin-top: 1rem; }
      pre { overflow: auto; padding: 1rem; border-radius: 10px; background: #111827; color: #e5e7eb; font-size: 1rem; }
      code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 0.95em; }
      .logo { display: block; width: 120px; height: auto; margin: 0 0 1rem; }
      .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }
      a { color: #064e3b; }
      .meta { font-size: 1rem; opacity: 0.9; }
      .tool-list { list-style: none; padding: 0; margin: 0.5rem 0 0; }
      .tool-list li { padding: 0.75rem 0; border-bottom: 1px solid rgba(0,0,0,0.1); }
      .tool-list li:last-child { border-bottom: none; }
      .tool-list code { background: rgba(0,0,0,0.08); padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 600; }
      .tool-desc { display: block; font-size: 1rem; opacity: 0.85; margin-top: 0.25rem; }
      .resource-title { display: block; font-weight: 600; margin-top: 0.25rem; }
      .prompt-args { display: block; font-size: 0.9rem; opacity: 0.7; margin-top: 0.25rem; }
      @media (prefers-color-scheme: dark) {
        body { background: #0b1021; color: #e6edf3; }
        .card { background: #111827; color: #f9fafb; border-color: #334155; }
        pre { background: #0b1021; color: #e6edf3; border: 1px solid #334155; }
        a { color: #93c5fd; }
        .tool-list li { border-bottom-color: rgba(255,255,255,0.1); }
        .tool-list code { background: rgba(255,255,255,0.1); }
      }
    </style>
  </head>`;
