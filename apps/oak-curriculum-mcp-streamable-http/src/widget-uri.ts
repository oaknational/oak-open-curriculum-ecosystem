/**
 * Widget URI utilities for cache-busting.
 *
 * Provides pure functions for constructing widget URIs with optional
 * cache-busting query parameters for remote deployments.
 *
 * @module widget-uri
 */

/**
 * Constructs widget URI with optional cache-busting query parameter.
 *
 * This is a pure function that appends a version query parameter to the base
 * widget URI when a cache-buster is provided. Used by HTTP MCP server to force
 * ChatGPT to reload widget bundles when HTML/CSS/JS changes.
 *
 * @param baseUri - Base widget URI from SDK (single source of truth)
 * @param cacheBuster - Optional cache-busting string (e.g., first 8 chars of git commit SHA)
 * @returns Widget URI with or without cache-busting query param
 *
 * @example
 * ```typescript
 * // Local development (no cache-busting)
 * getWidgetUri(WIDGET_URI); // 'ui://widget/oak-json-viewer.html'
 *
 * // Remote deployment (with cache-busting)
 * getWidgetUri(WIDGET_URI, 'abc12345'); // 'ui://widget/oak-json-viewer.html?v=abc12345'
 * ```
 *
 * @see https://developers.openai.com/apps-sdk/build/mcp-server (cache-busting best practice)
 */
export function getWidgetUri(baseUri: string, cacheBuster?: string): string {
  // Empty string is treated as undefined (no cache-busting)
  if (!cacheBuster) {
    return baseUri;
  }
  return `${baseUri}?v=${cacheBuster}`;
}
