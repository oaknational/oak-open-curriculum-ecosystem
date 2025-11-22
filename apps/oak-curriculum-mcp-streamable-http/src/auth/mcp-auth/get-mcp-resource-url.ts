/**
 * Get MCP Resource URL for RFC 8707 validation.
 *
 * This function generates the canonical MCP resource URL that should be
 * present in the JWT's `aud` (audience) claim per RFC 8707.
 *
 * @module auth/mcp-auth/get-mcp-resource-url
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
export function getMcpResourceUrl(req: {
  protocol: string;
  get: (header: string) => string | undefined;
  originalUrl: string;
}): string {
  const host = req.get('host');

  if (!host) {
    throw new Error('Cannot generate MCP resource URL: missing host header');
  }

  return `${req.protocol}://${host}${req.originalUrl}`;
}
