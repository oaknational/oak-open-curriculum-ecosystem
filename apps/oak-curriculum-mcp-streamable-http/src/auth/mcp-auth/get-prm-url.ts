/**
 * Generate OAuth Protected Resource Metadata URL.
 *
 * This function generates the canonical OAuth Protected Resource Metadata URL
 * as specified in RFC 9470. The URL is always at the well-known path
 * `/.well-known/oauth-protected-resource` and never varies based on the request path.
 *
 * This is a fix for the bug in @clerk/mcp-tools where getPRMUrl incorrectly
 * appends req.originalUrl to the metadata path, resulting in broken URLs like:
 * `/.well-known/oauth-protected-resource/mcp`
 *
 * The correct behavior is to always return the canonical path without any suffix.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9470 | RFC 9470 - OAuth 2.0 Protected Resource Metadata}
 */

/**
 * Generates the OAuth Protected Resource Metadata URL for the current request.
 *
 * Returns the canonical RFC 9470 compliant URL: `{protocol}://{host}/.well-known/oauth-protected-resource`
 *
 * This function is a pure function that only uses the protocol and host from the request,
 * specifically NOT including req.originalUrl (which was the bug in @clerk/mcp-tools).
 *
 * @param req - Minimal request object with protocol and get method
 * @returns The canonical OAuth Protected Resource Metadata URL
 *
 * @example
 * ```typescript
 * const url = getPRMUrl({ protocol: 'https', get: (h) => 'example.com' });
 * // Returns: 'https://example.com/.well-known/oauth-protected-resource'
 * ```
 */
export function getPRMUrl(
  req: Pick<{ protocol: string; get: (header: string) => string | undefined }, 'protocol' | 'get'>,
): string {
  const host = req.get('host');

  if (!host) {
    throw new Error('Cannot generate OAuth metadata URL: missing host header');
  }

  return `${req.protocol}://${host}/.well-known/oauth-protected-resource`;
}
