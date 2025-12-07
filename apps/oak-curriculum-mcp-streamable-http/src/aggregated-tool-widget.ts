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

import { OAK_LOGO_SVG } from './oak-logo-svg.js';
import { generateCtaContainerHtml } from './widget-cta/index.js';
import { WIDGET_STYLES } from './widget-styles.js';
import { WIDGET_SCRIPT } from './widget-script.js';
import { WIDGET_URI } from '@oaknational/oak-curriculum-sdk/public/mcp-tools';

/**
 * Returns the widget URI from the SDK.
 *
 * This is a simple passthrough that makes the widget URI
 * available to the HTTP server's resource registration.
 * The URI already includes a cache-busting hash generated
 * at type-gen time.
 *
 * @returns Widget URI with embedded cache-busting hash
 * @example "ui://widget/oak-json-viewer-abc12345.html"
 */
export function getToolWidgetUri(): string {
  return WIDGET_URI;
}

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
 * - Widget state persistence via `window.openai.setWidgetState()`
 * - Responsive JSON formatting with word wrap
 * - AI disclaimer footer
 *
 * NOTE: Refresh button via window.openai.callTool() is disabled but code preserved.
 * See widget-script-state.ts for implementation details and how to re-enable.
 */
export const AGGREGATED_TOOL_WIDGET_HTML = `<!DOCTYPE html>
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
    <header class="hdr">
      <div class="logo">${OAK_LOGO_SVG}</div>
      <div class="hdr-text">
        <h1 class="ttl">Oak National Academy</h1>
        <p class="sub-ttl" id="tool-name"></p>
      </div>
      ${generateCtaContainerHtml()}
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
