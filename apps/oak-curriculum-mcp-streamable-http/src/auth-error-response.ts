/**
 * Auth Error Response Builder
 *
 * Pure function for creating MCP-compliant auth error responses with
 * `_meta["mcp/www_authenticate"]` to trigger ChatGPT OAuth linking UI.
 *
 * Part of Phase 2, Sub-Phase 2.7
 */

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/**
 * Types of authentication errors per RFC 6750 (OAuth 2.0 Bearer Token Usage)
 */
export type AuthErrorType =
  | 'invalid_token' // Token is malformed, expired, or otherwise invalid
  | 'insufficient_scope' // Token lacks required scopes
  | 'token_expired' // Token has expired
  | 'missing_token'; // No token provided

/**
 * MCP-compliant auth error response structure
 *
 * Per OpenAI documentation, includes `_meta["mcp/www_authenticate"]` array
 * to signal that OAuth is available and trigger ChatGPT's "Connect" UI.
 *
 * Extends CallToolResult to preserve type information and ensure compatibility
 * with MCP SDK expectations.
 */
export interface AuthErrorResponse extends CallToolResult {
  content: { type: 'text'; text: string }[];
  isError: true;
  _meta: {
    'mcp/www_authenticate': string[];
  };
}

/**
 * Creates an MCP-compliant auth error response with WWW-Authenticate metadata.
 *
 * This function is pure (no side effects, deterministic output) and formats
 * error responses per RFC 6750 and OpenAI's MCP specification.
 *
 * @param errorType - OAuth error type per RFC 6750
 * @param description - Human-readable error description
 * @param resourceUrl - MCP resource URL (e.g., "https://example.com/mcp")
 * @returns MCP error response with `_meta["mcp/www_authenticate"]`
 *
 * @example
 * ```typescript
 * const response = createAuthErrorResponse(
 *   'invalid_token',
 *   'The provided token has expired',
 *   'https://api.example.com/mcp'
 * );
 * // Returns response with _meta["mcp/www_authenticate"] for ChatGPT
 * ```
 *
 * @see https://datatracker.ietf.org/doc/html/rfc6750#section-3
 * @see OpenAI MCP OAuth documentation
 *
 * @public
 */
export function createAuthErrorResponse(
  errorType: AuthErrorType,
  description: string,
  resourceUrl: string,
): AuthErrorResponse {
  // Generate resource metadata URL from resource URL
  // E.g., "https://example.com/mcp" → "https://example.com/.well-known/oauth-protected-resource"
  const metadataUrl = generateMetadataUrl(resourceUrl);

  // Format WWW-Authenticate header per RFC 6750 Section 3
  // Format: Bearer resource_metadata="...", error="...", error_description="..."
  const wwwAuthenticate = `Bearer resource_metadata="${metadataUrl}", error="${errorType}", error_description="${description}"`;

  // Return MCP-compliant error response
  return {
    content: [
      {
        type: 'text',
        text: `Authentication Error: ${description}`,
      },
    ],
    isError: true,
    _meta: {
      'mcp/www_authenticate': [wwwAuthenticate],
    },
  };
}

/**
 * Generates OAuth protected resource metadata URL from MCP resource URL.
 *
 * Converts resource URL to the well-known metadata endpoint per RFC 9728.
 *
 * @param resourceUrl - MCP resource URL (e.g., "https://example.com/mcp")
 * @returns Metadata URL (e.g., "https://example.com/.well-known/oauth-protected-resource")
 *
 * @internal
 */
function generateMetadataUrl(resourceUrl: string): string {
  // Parse the resource URL to get protocol and host
  const url = new URL(resourceUrl);
  const protocol = url.protocol; // "http:" or "https:"
  const host = url.host; // "example.com" or "localhost:3000"

  // RFC 9728: metadata URL is at /.well-known/oauth-protected-resource
  return `${protocol}//${host}/.well-known/oauth-protected-resource`;
}
