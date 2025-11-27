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
 * - Oak National Academy logo in header
 * - Lexend font from Google Fonts (Oak brand typeface)
 * - Oak brand colors with light/dark mode support
 * - Reads tool output from `window.openai.toolOutput`
 * - Responsive JSON formatting with word wrap
 *
 * Light mode colors:
 * - Background: #bef2bd (soft green)
 * - Text: #1b3d1c (dark forest)
 *
 * Dark mode colors:
 * - Background: #1b3d1c (dark forest)
 * - Text: #f0f7f0 (off-white)
 */
export const AGGREGATED_TOOL_WIDGET_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500&display=swap" rel="stylesheet">
  <style>
    :root {
      color-scheme: light dark;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      margin: 0;
      padding: 16px;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif;
    }
    
    #root {
      background: #bef2bd;
      color: #1b3d1c;
      border-radius: 8px;
      padding: 16px;
    }
    
    @media (prefers-color-scheme: dark) {
      #root {
        background: #1b3d1c;
        color: #f0f7f0;
      }
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid rgba(27, 61, 28, 0.2);
    }
    
    @media (prefers-color-scheme: dark) {
      .header {
        border-bottom-color: rgba(240, 247, 240, 0.2);
      }
    }
    
    .logo {
      width: 32px;
      height: 32px;
    }
    
    .title {
      font-weight: 500;
      font-size: 14px;
      margin: 0;
    }
    
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
      font-size: 13px;
      line-height: 1.5;
      margin: 0;
      font-family: 'Lexend', system-ui, -apple-system, sans-serif;
    }
  </style>
</head>
<body>
  <div id="root">
    <div class="header">
      <img class="logo" src="data:image/png;base64,${OAK_LOGO_BASE64}" alt="Oak National Academy">
      <h1 class="title">Oak National Academy</h1>
    </div>
    <pre id="output"></pre>
  </div>
  <script type="module">
    // ChatGPT provides tool output via window.openai.toolOutput
    const output = window.openai?.toolOutput ?? {};
    document.getElementById('output').textContent = JSON.stringify(output, null, 2);
  </script>
</body>
</html>`.trim();
