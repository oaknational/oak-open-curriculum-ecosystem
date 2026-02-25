import { extractHostname } from '../../security.js';
import { isAllowedHostname, isValidHostHeader } from '../../host-header-validation.js';

/**
 * Generate path-qualified OAuth Protected Resource Metadata URL per RFC 9728.
 *
 * RFC 9728 Section 3.1 specifies that for a resource at `http://host/mcp`,
 * the PRM URL is `http://host/.well-known/oauth-protected-resource/mcp`.
 * The resource path (`/mcp`) is appended to the well-known prefix.
 *
 * This server's protected resource is always at `/mcp`, so the PRM URL
 * always ends with `/mcp`.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9728#section-3.1 | RFC 9728 Section 3.1}
 */

/**
 * Generates the path-qualified PRM URL for the current request.
 *
 * Returns `{protocol}://{host}/.well-known/oauth-protected-resource/mcp`
 * per RFC 9728 Section 3.1.
 *
 * @param req - Minimal request object with protocol and get method
 * @returns The path-qualified OAuth Protected Resource Metadata URL
 *
 * @example
 * ```typescript
 * const url = getPRMUrl({ protocol: 'https', get: (h) => 'example.com' });
 * // Returns: 'https://example.com/.well-known/oauth-protected-resource/mcp'
 * ```
 */
export function getPRMUrl(
  req: Pick<{ protocol: string; get: (header: string) => string | undefined }, 'protocol' | 'get'>,
  allowedHosts: readonly string[],
): string {
  const host = req.get('host');

  if (!host) {
    throw new Error('Cannot generate OAuth metadata URL: missing host header');
  }
  if (!isValidHostHeader(host)) {
    throw new Error(`Cannot generate OAuth metadata URL: invalid host header format: ${host}`);
  }
  const hostname = extractHostname(host).toLowerCase();
  if (!hostname || !isAllowedHostname(hostname, allowedHosts)) {
    throw new Error(`Cannot generate OAuth metadata URL: host not allowed: ${hostname}`);
  }

  return `${req.protocol}://${host}/.well-known/oauth-protected-resource/mcp`;
}
