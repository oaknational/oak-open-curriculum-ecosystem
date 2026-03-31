/**
 * Public resource definitions for selective authentication.
 *
 * Resources listed here skip Clerk authentication because they contain
 * no user-specific data. This is a latency optimisation for widget/resource
 * discovery.
 *
 * ## Security Rationale
 *
 * - **Widget HTML**: Static shell that loads JS/CSS. User-specific
 *   data arrives via the MCP Apps bridge at render time.
 * - **Documentation**: Static markdown generated at SDK compile time.
 *   Contains no user-specific information.
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 */

import { WIDGET_URI, DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Uses SDK-owned resource URIs as the single source of truth.
 *
 * Note: `WIDGET_URI` is retained during the WS3 interim (Phase 1-2) even
 * though the widget resource is temporarily unregistered. The auth bypass
 * is a harmless no-op for URIs that have no registered resource (the MCP
 * SDK returns JSON-RPC error -32002 "Resource not found" inside the SSE
 * envelope). Phase 2-3 will re-register the widget resource, restoring
 * the ADR-057 synchronisation invariant. See MCP reviewer assessment.
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
 * isPublicResourceUri(WIDGET_URI);                      // true
 * isPublicResourceUri('docs://oak/getting-started.md'); // true
 * isPublicResourceUri('ui://other/widget.html');        // false
 * ```
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URI_SET.has(uri);
}
