import { extractHostname } from '../../security.js';
import { isAllowedHostname, isValidHostHeader } from '../../host-header-validation.js';

/**
 * Get MCP Resource URL for RFC 8707 validation.
 *
 * This function generates the canonical MCP resource URL that should be
 * present in the JWT's `aud` (audience) claim per RFC 8707.
 *
 */

/**
 * Generates the MCP resource URL for the current request.
 *
 * This URL represents the protected resource (the MCP endpoint) and should
 * match the `resource` parameter used during OAuth token acquisition and
 * the `aud` claim in the resulting JWT.
 *
 * @param req - Minimal request object with protocol, host, and originalUrl
 * @returns The MCP resource URL (e.g., "http://localhost:3333/mcp")
 *
 * @example
 * ```typescript
 * const url = getMcpResourceUrl({
 *   protocol: 'https',
 *   get: (h) => 'example.com',
 *   originalUrl: '/mcp'
 * });
 * // Returns: 'https://example.com/mcp'
 * ```
 */
export function getMcpResourceUrl(
  req: {
    protocol: string;
    get: (header: string) => string | undefined;
    originalUrl: string;
  },
  allowedHosts: readonly string[],
): string {
  const host = req.get('host');

  if (!host) {
    throw new Error('Cannot generate MCP resource URL: missing host header');
  }
  if (!isValidHostHeader(host)) {
    throw new Error(`Cannot generate MCP resource URL: invalid host header format: ${host}`);
  }
  const hostname = extractHostname(host).toLowerCase();
  if (!hostname || !isAllowedHostname(hostname, allowedHosts)) {
    throw new Error(`Cannot generate MCP resource URL: host not allowed: ${hostname}`);
  }

  return `${req.protocol}://${host}${req.originalUrl}`;
}
