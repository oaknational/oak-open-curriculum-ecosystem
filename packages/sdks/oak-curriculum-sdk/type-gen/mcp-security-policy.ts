/**
 * MCP server OAuth 2.1 authentication policy.
 *
 * This file defines which tools require authentication and which are public.
 * Changes to this file trigger regeneration of all tool security metadata.
 *
 * @remarks
 * Tools NOT in PUBLIC_TOOLS require OAuth 2.1 authentication.
 * Tools in PUBLIC_TOOLS are publicly accessible without authentication.
 */

/**
 * List of tools that do not require OAuth authentication.
 *
 * These tools can be called without a Bearer token.
 * Typically used for discovery or public metadata endpoints.
 *
 * @example
 * ```typescript
 * // Make get-key-stages public
 * export const PUBLIC_TOOLS = ['get-key-stages'] as const;
 * ```
 */
export const PUBLIC_TOOLS: readonly string[] = [
  // Add tool names here to make them public
  // By default, all tools require authentication
  'get-changelog',
  'get-changelog-latest',
  'get-rate-limit',
] as const;

/**
 * Default OAuth 2.1 security scheme for protected tools.
 *
 * Applied to all tools NOT in PUBLIC_TOOLS list.
 */
export const DEFAULT_AUTH_SCHEME = {
  type: 'oauth2',
  scopes: ['openid', 'email'],
} as const;

/**
 * Determines if a tool requires authentication based on policy.
 *
 * Pure function - always returns same result for same input.
 * Reads from PUBLIC_TOOLS configuration.
 *
 * @param toolName - MCP tool name
 * @returns true if tool requires auth, false if public
 */
export function toolRequiresAuth(toolName: string): boolean {
  return !PUBLIC_TOOLS.includes(toolName);
}
