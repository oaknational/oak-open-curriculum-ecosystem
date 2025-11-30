/**
 * @fileoverview MCP client configuration snippet generator.
 *
 * Provides a pure function for generating the JSON configuration snippet
 * that users can add to their MCP client configuration.
 *
 * @example
 * ```typescript
 * import { createSnippet } from './create-snippet.js';
 *
 * const snippet = createSnippet('my-app.vercel.app');
 * // Returns JSON snippet with the deployment URL
 * ```
 */

import { resolveCanonicalUrl } from './resolve-canonical-url.js';

/**
 * Creates the MCP client configuration snippet.
 *
 * Generates a JSON snippet that can be added to MCP client configurations
 * (e.g., Claude, Cursor) to connect to this MCP server.
 *
 * @param vercelHost - Optional Vercel host header value for URL resolution
 * @returns JSON configuration snippet string (without outer braces)
 *
 * @example
 * ```typescript
 * const snippet = createSnippet('my-app.vercel.app');
 * // Returns:
 * // '
 * //   "mcpServers": {
 * //     "oak-curriculum": {
 * //       "type": "http",
 * //       "url": "https://my-app.vercel.app/mcp"
 * //     }
 * //   }
 * // '
 * ```
 */
export function createSnippet(vercelHost?: string): string {
  const canonicalUrl = resolveCanonicalUrl(vercelHost);
  return `
  "mcpServers": {
    "oak-curriculum": {
      "type": "http",
      "url": "${canonicalUrl}"
    }
  }
`;
}
