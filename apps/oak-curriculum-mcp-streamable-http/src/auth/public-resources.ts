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

import {
  DOCUMENTATION_RESOURCES,
  EEF_INTERPRETATION_RESOURCE,
  NAVIGATION_GUIDANCE_URIS,
  WIDGET_URI,
} from '@oaknational/curriculum-sdk/public/mcp-tools';

/**
 * Resource URIs that are publicly accessible without authentication.
 *
 * All SDK-owned: the documentation/widget URIs (the original ADR-057 set) plus the
 * served live-set navigation-guidance URIs. The classification rule and its basis
 * (MCP auth is server-level, so a per-resource public allowlist is an Oak app
 * pattern; classify by data-sensitivity) are recorded in ADR-205.
 */
const PUBLIC_RESOURCE_URIS = [
  ...DOCUMENTATION_RESOURCES.map((resource) => resource.uri),
  WIDGET_URI,
  // Agent guidance documents, SERVED LIVE-SET ONLY (ADR-205 classification made
  // explicitly, mcp-101 slice B2b): static SDK-compiled workflow guidance markdown,
  // no user-specific data — the same data-sensitivity class as getting-started.md.
  // Deliberately the navigation three, not the full guidance inventory: dormant
  // documents are unregistered, so a public row for them would be dead — if the
  // allowlist later turns a creation document live, its public/authed
  // classification is made HERE, at that reviewed change.
  ...NAVIGATION_GUIDANCE_URIS,
  // EEF interpretation guide (ADR-205 classification made at the reviewed change
  // turning the row live): static SDK-compiled markdown rendered from the
  // compile-time EEF corpus — public-reference content, no user or tenant data.
  EEF_INTERPRETATION_RESOURCE.uri,
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
