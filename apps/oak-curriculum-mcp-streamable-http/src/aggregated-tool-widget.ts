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
import { WIDGET_STYLES } from './widget-styles.js';
import { WIDGET_SCRIPT } from './widget-script.js';

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
 * - Widget state persistence via `window.openai.setWidgetState()`
 * - Tool calling via `window.openai.callTool()` for refresh functionality
 * - Responsive JSON formatting with word wrap
 * - AI disclaimer footer
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
  <main id="root">
    <div class="hdr">
      <img class="logo" src="data:image/png;base64,${OAK_LOGO_BASE64}" alt="Oak National Academy logo">
      <div class="hdr-text">
        <h1 class="ttl">Oak National Academy</h1>
        <p class="sub-ttl" id="tool-name"></p>
      </div>
    </div>
    <div id="actions" class="actions" style="display:none"></div>
    <div id="error" class="error" style="display:none"></div>
    <div id="c"></div>
    <div class="ftr">AI can make mistakes. Check all generated resources before use.</div>
  </main>
  <script type="module">${WIDGET_SCRIPT}</script>
</body>
</html>`.trim();
