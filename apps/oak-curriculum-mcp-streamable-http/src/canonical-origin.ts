/**
 * The origin this server calls itself when it is served at a canonical
 * address that differs from the hostname reaching it.
 *
 * Behind the Cloudflare edge (MCP-172) the app is served at
 * `https://mcp.thenational.academy/mcp`, but the edge presents the app's own
 * Vercel hostname in the Host header — that is how Vercel selects the serving
 * project. Per-request derivation therefore cannot name the canonical
 * address, and the self-description surfaces (RFC 9728 protected-resource
 * metadata, RFC 8414 authorization-server metadata, the RFC 8707 resource
 * URL, the `WWW-Authenticate` `resource_metadata` pointer) would advertise
 * the origin hostname instead.
 *
 * The canonical origin is CONFIGURATION, never a request header. The
 * pre-execution security review (MCP-269) established that no per-request
 * signal can distinguish edge traffic from a direct request: a client
 * reaching the origin directly sends exactly the Host the edge sends, so a
 * trusted-header design has no entropy to check. A configured value has no
 * request input at all, and it makes both hostnames self-describe
 * identically — a client arriving directly is told the canonical resource,
 * acquires a token bound to it, and presents it successfully at either name.
 *
 * The scheme is fixed to `https` rather than read from `req.protocol`:
 * Express returns the first `X-Forwarded-Proto` value when `trust proxy` is
 * set, which a client can prepend to, and an RFC 8707 audience comparison is
 * exact string equality — a scheme disagreement between the metadata
 * document and the expected resource is an unexplained 401.
 */

/**
 * Builds the canonical origin from the configured host.
 *
 * @param canonicalHost - `CANONICAL_HOST` as validated at the env boundary
 *   (a bare hostname; ports, schemes, paths and loopback names are rejected
 *   at startup), or `undefined` when the app self-describes per request
 * @returns The origin (e.g. `https://mcp.thenational.academy`), or
 *   `undefined` when no canonical host is configured
 */
export function resolveCanonicalOrigin(canonicalHost: string | undefined): string | undefined {
  if (!canonicalHost) {
    return undefined;
  }
  return `https://${canonicalHost.toLowerCase()}`;
}
