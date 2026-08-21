/**
 * The origin this server calls itself when it is served at a canonical
 * address that differs from the hostname reaching it.
 *
 * MCP-172 created the need. The app was served at
 * `https://www.thenational.academy/mcp` behind a path-scoped Cloudflare origin
 * rule that overrode the Host to the app's own Vercel hostname — that is how
 * Vercel selected the serving project. Per-request derivation therefore could
 * not name the canonical address, and the self-description surfaces (RFC 9728
 * protected-resource metadata, RFC 8414 authorization-server metadata, the RFC
 * 8707 resource URL, the `WWW-Authenticate` `resource_metadata` pointer) would
 * have advertised the origin hostname instead.
 *
 * **That rule was withdrawn 2026-08-20 and the app is now served at
 * `https://mcp.thenational.academy`, from that host's root.** The Host override
 * went with the rule: MCP-634 measured this app's own rebinding guard refusing
 * the raw Host `mcp.thenational.academy` with `403 Forbidden: host not allowed`,
 * which is only possible if the client's Host reaches the app unrewritten. So
 * Vercel now selects the project by the registered custom domain, and
 * per-request derivation on the canonical host would name the canonical
 * address.
 *
 * **On the canonical host the configured value and the arriving Host now name
 * the same address, so configuration confirms what derivation would find.**
 * It still earns its place on the other served hosts: the alpha host and every
 * preview advertise the canonical resource because of it, so a token acquired
 * anywhere is accepted everywhere. Whether it is required on the canonical host
 * itself is a behaviour question, and this comment does not settle it.
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
