/**
 * Public resource definitions for selective authentication.
 *
 * Resources listed here skip Clerk authentication because they contain
 * no user-specific data. This is a latency optimisation for ChatGPT
 * discovery.
 *
 * ## Security Rationale
 *
 * - **Widget HTML**: Static shell that loads JS/CSS. User-specific
 *   data arrives via `window.openai.toolOutput` at render time.
 * - **Documentation**: Static markdown generated at SDK compile time.
 *   Contains no user-specific information.
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 * @module
 */

import {
  WIDGET_URI,
  DOCUMENTATION_RESOURCES,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Uses base widget URI from SDK (single source of truth).
 * Cache-busting query params don't affect resource matching.
 */
export const PUBLIC_RESOURCE_URIS = [
  WIDGET_URI,
  ...DOCUMENTATION_RESOURCES.map((resource) => resource.uri),
] as const;

/**
 * Set for O(1) lookup of public resource URIs.
 * @internal
 */
const PUBLIC_RESOURCE_URI_SET: ReadonlySet<string> = new Set(PUBLIC_RESOURCE_URIS);

/**
 * Checks if a resource URI is public and should skip authentication.
 *
 * @param uri - The resource URI being requested
 * @returns True if the resource is public and auth can be skipped
 *
 * @example
 * ```typescript
 * isPublicResourceUri('ui://widget/oak-json-viewer.html'); // true
 * isPublicResourceUri('docs://oak/getting-started.md');    // true
 * isPublicResourceUri('ui://other/widget.html');           // false
 * ```
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URI_SET.has(uri);
}
