/**
 * MCP OAuth authentication with Clerk.
 *
 * Generates path-qualified PRM URLs per RFC 9728 Section 3.1 and enforces
 * HTTP 401 for auth failures per MCP spec. Runs BEFORE the MCP SDK to
 * enable proper HTTP 401 responses with `WWW-Authenticate` headers.
 *
 * @see {@link https://datatracker.ietf.org/doc/html/rfc9728#section-3.1 | RFC 9728 Section 3.1}
 */

export { mcpAuth } from './mcp-auth.js';
export { createMcpAuthClerk } from './mcp-auth-clerk.js';
export { createAuthLogContext } from './auth-response-helpers.js';
export { verifyClerkToken } from './verify-clerk-token.js';
export type { AuthInfo, MachineAuthObject, TokenVerifier } from './types.js';
export type { AuthLogContext } from './auth-response-helpers.js';
