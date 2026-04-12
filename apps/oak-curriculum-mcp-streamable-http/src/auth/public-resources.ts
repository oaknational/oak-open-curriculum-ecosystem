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
 * - **Widget HTML**: Static self-contained React app generated at build time.
 *   Contains no user-specific information. This is an explicit Oak
 *   compatibility waiver per ADR-113 — tool calls for data access still
 *   require authentication. Owner: Oak engineering. Removal condition:
 *   when the MCP protocol supports authenticated resource delivery for
 *   all host clients.
 *
 * Data-fetching tools (tools/call) still require authentication.
 *
 * @see ADR-057: Selective Authentication for MCP Resources
 * @see ADR-113: MCP Auth Target Semantics
 */

import { DOCUMENTATION_RESOURCES, WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Uses SDK-owned resource URIs as the single source of truth.
 */
const PUBLIC_RESOURCE_URIS = [
  ...DOCUMENTATION_RESOURCES.map((resource) => resource.uri),
  WIDGET_URI,
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
