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
 * @module auth/mcp-auth
 */

export { mcpAuthClerk } from './mcp-auth-clerk.js';
export type { AuthInfo } from './types.js';
