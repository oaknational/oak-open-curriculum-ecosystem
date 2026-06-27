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
 * @see ADR-205: Public-resource classification pattern (why per-resource is an app
 *   pattern given MCP's server-level auth, and the data-sensitivity rule)
 */

import { DOCUMENTATION_RESOURCES, WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * Two sources: SDK-owned documentation/widget URIs (the original ADR-057 set), plus
 * explicit APP-LOCAL public URIs that are registered inside this app rather than via
 * the SDK. The classification rule and its basis (MCP auth is server-level, so a
 * per-resource public allowlist is an Oak app pattern; classify by data-sensitivity)
 * are recorded in ADR-205. Each app-local entry is drift-guarded by a test that
 * imports the URI the resource is actually registered under.
 */
const PUBLIC_RESOURCE_URIS = [
  ...DOCUMENTATION_RESOURCES.map((resource) => resource.uri),
  WIDGET_URI,
  // App-local (ADR-205): the Oak: Under the Hood orientation pointer. Static,
  // non-user-specific markdown pointing only to the public canonical skill + public
  // Oak URLs — gating it would protect nothing, and its sibling getting-started.md is
  // already public. Sourced from OAK_UNDER_THE_HOOD_RESOURCE_URI in register-resources;
  // the literal is mirrored here and the public-resources test guards against drift.
  'docs://oak/under-the-hood.md',
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
