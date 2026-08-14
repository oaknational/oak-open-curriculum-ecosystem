import { ok, type Result } from '@oaknational/result';
import { deriveSelfOrigin, type HostValidationError } from '../../host-validation-error.js';
import { MCP_RESOURCE_PATH } from '../../served-origin.js';

/**
 * Get MCP Resource URL for RFC 8707 validation.
 *
 * Generates the canonical MCP resource URL that should be present in the
 * JWT's `aud` (audience) claim per RFC 8707.
 */

/**
 * Generates the MCP resource URL for the current request.
 *
 * This URL represents the protected resource (the MCP endpoint) and must
 * match the `resource` parameter used during OAuth token acquisition and
 * the `aud` claim in the resulting JWT — which is why the path is the
 * fixed {@link MCP_RESOURCE_PATH}, exactly what the published PRM document
 * advertises. `req.originalUrl` is deliberately not used: it can carry
 * query components (clients may append query strings to `POST /mcp`
 * requests) that the advertised resource does not, and RFC 8707 §2 says
 * resource URIs SHOULD NOT include a query component.
 *
 * The origin comes from {@link deriveSelfOrigin}: canonical origin first,
 * else allowlist-validated Host with the loopback scheme rule. The
 * request's protocol is never consulted.
 *
 * @param req - Minimal request object exposing header access
 * @param allowedHosts - Hostnames this server may call itself
 * @param canonicalOrigin - Configured origin that supersedes per-request
 *   derivation, or `undefined` to derive from the request
 * @returns `Ok` with the MCP resource URL (e.g. `https://host/mcp`), or
 *   `Err` with the host validation failure (callers map it to an HTTP 403)
 */
export function getMcpResourceUrl(
  req: { get(name: string): string | undefined },
  allowedHosts: readonly string[],
  canonicalOrigin?: string,
): Result<string, HostValidationError> {
  const originResult = deriveSelfOrigin(req, allowedHosts, canonicalOrigin);
  if (!originResult.ok) {
    return originResult;
  }
  return ok(`${originResult.value}${MCP_RESOURCE_PATH}`);
}
