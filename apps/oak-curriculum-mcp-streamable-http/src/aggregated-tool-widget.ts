/**
 * Oak-branded widget for rendering aggregated tool output.
 *
 * This HTML is served as an MCP Apps resource.
 */

import { OAK_LOGO_SVG } from './oak-logo-svg.js';
import { WIDGET_STYLES } from './widget-styles.js';
import { WIDGET_SCRIPT } from './widget-script.js';

/**
 * Oak-branded HTML widget for rendering tool output.
 *
 * Features:
 * - Oak National Academy logo in header with optional tool subtitle
 * - Lexend font from Google Fonts (Oak brand typeface)
 * - Oak brand colors with light/dark mode support (WCAG AA compliant)
 * - Reads tool output from MCP Apps bridge
 * - Widget state persistence via MCP Apps state API
 * - Responsive JSON formatting with word wrap
 * - AI disclaimer footer
 */
/**
 * Generates the complete widget HTML document.
 *
 * @internal Exported for testing to verify HTML syntax
 * @returns Complete HTML document as string
 */
export function generateWidgetHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Oak National Academy</title>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600&display=swap" rel="stylesheet">
  <style>${WIDGET_STYLES}</style>
</head>
<body>
<div id="root">
  <main id="content-container">
    <header class="hdr" id="hdr" style="display:none">
      <a href="https://www.thenational.academy" target="_blank" rel="noopener noreferrer" class="hdr-link">
        <div class="logo">${OAK_LOGO_SVG}</div>
        <h1 class="ttl">Oak National Academy</h1>
      </a>
      <span class="sub-ttl" id="tool-name"></span>
    </header>
    <div id="c"></div>
    <footer class="ftr">
      <p class="ftr-disclaimer">AI can make mistakes. Check all generated resources before use.</p>
      <p class="ftr-links">
        <a href="https://www.thenational.academy" target="_blank" rel="noopener noreferrer" class="ftr-link nowrap">Explore more Oak curriculum resources</a>
        <span class="ftr-sep">•</span>
        <a href="https://labs.thenational.academy" target="_blank" rel="noopener noreferrer" class="ftr-link"><span class="nowrap">For an educator specific experience try Aila</span> - <span class="nowrap">Oak's AI Lesson Assistant</span></a>
      </p>
    </footer>
  </main>
</div>
<script type="module">${WIDGET_SCRIPT}</script>
</body>
</html>`.trim();
}

/**
 * The complete widget HTML document.
 *
 * This is the HTML that gets served as the widget resource.
 * It includes embedded CSS and JavaScript for a self-contained widget.
 *
 * The widget HTML is self-contained with embedded CSS and JavaScript.
 */
export const AGGREGATED_TOOL_WIDGET_HTML = generateWidgetHtml();
