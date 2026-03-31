/**
 * Public resource definitions for selective authentication.
 *
 * Resources listed here skip Clerk authentication because they contain
 * no user-specific data. This is a latency optimisation for resource
 * discovery.
 *
 * ## Security Rationale
 *
 * - **Documentation**: Static markdown generated at SDK compile time.
 *   Contains no user-specific information.
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * Widget resource will be re-added to this list when WS3 Phase 2-3
 * re-introduces the fresh React MCP App.
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 */

import { DOCUMENTATION_RESOURCES } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Uses SDK-owned resource URIs as the single source of truth.
 */
export const PUBLIC_RESOURCE_URIS = [
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
 * isPublicResourceUri('docs://oak/getting-started.md'); // true
 * isPublicResourceUri('ui://other/widget.html');        // false
 * ```
 */
export function isPublicResourceUri(uri: string): boolean {
  return PUBLIC_RESOURCE_URI_SET.has(uri);
}
