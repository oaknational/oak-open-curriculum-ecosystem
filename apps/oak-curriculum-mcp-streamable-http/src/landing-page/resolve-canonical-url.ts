/**
 * Canonical URL resolution for MCP endpoint.
 *
 * Provides a pure function for resolving the canonical URL of the MCP endpoint
 * based on the deployment environment (Vercel vs local development).
 *
 * @example
 * ```typescript
 * import { resolveCanonicalUrl } from './resolve-canonical-url.js';
 *
 * // On Vercel deployment
 * const url = resolveCanonicalUrl('my-app.vercel.app');
 * // Returns: 'https://my-app.vercel.app/mcp'
 *
 * // Local development
 * const localUrl = resolveCanonicalUrl();
 * // Returns: 'http://localhost:3333/mcp'
 * ```
 */

/**
 * Resolves the canonical URL for the MCP endpoint.
 *
 * When a Vercel host header is provided, returns an HTTPS URL using that host.
 * Otherwise, returns a localhost URL for local development.
 *
 * @param vercelHost - Optional Vercel host header value (e.g., 'my-app.vercel.app')
 * @returns The canonical URL for the MCP endpoint
 *
 * @example
 * ```typescript
 * resolveCanonicalUrl('my-app.vercel.app') // 'https://my-app.vercel.app/mcp'
 * resolveCanonicalUrl() // 'http://localhost:3333/mcp'
 * resolveCanonicalUrl('') // 'http://localhost:3333/mcp'
 * ```
 */
export function resolveCanonicalUrl(vercelHost?: string): string {
  if (vercelHost && vercelHost.length > 0) {
    return `https://${vercelHost}/mcp`;
  }
  return 'http://localhost:3333/mcp';
}
