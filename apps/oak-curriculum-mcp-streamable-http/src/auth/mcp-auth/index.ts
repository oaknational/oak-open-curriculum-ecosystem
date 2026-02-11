/**
 * MCP OAuth authentication with Clerk - fixed version.
 *
 * This module provides a fixed implementation of MCP OAuth authentication
 * that resolves the bug in @clerk/mcp-tools where getPRMUrl incorrectly
 * appends req.originalUrl to the OAuth metadata path.
 *
 * Bug: @clerk/mcp-tools generates URLs like:
 *   /.well-known/oauth-protected-resource/mcp
 *
 * Fix: We generate the correct RFC 9470 compliant URL:
 *   /.well-known/oauth-protected-resource
 *
 * ## Auth Model
 *
 * Per MCP spec and OpenAI Apps docs, HTTP 401 is required for auth failures.
 * This middleware runs BEFORE the MCP SDK to enable proper HTTP 401 responses.
 */

export { mcpAuth } from './mcp-auth.js';
export { createMcpAuthClerk } from './mcp-auth-clerk.js';
export { createAuthLogContext } from './auth-response-helpers.js';
export { verifyClerkToken } from './verify-clerk-token.js';
export type { AuthInfo, MachineAuthObject, TokenVerifier } from './types.js';
export type { AuthLogContext } from './auth-response-helpers.js';
