/**
 * Pure function that applies MCP security policy to tools.
 *
 * This module contains the core policy application logic used by the generator
 * during type-gen to emit security metadata in tool descriptors.
 */

import { PUBLIC_TOOLS, DEFAULT_AUTH_SCHEME } from '../../mcp-security-policy.js';
import type { SecurityScheme } from './security-types.js';

/**
 * Determines security scheme for a tool based on MCP security policy.
 *
 * Reads the PUBLIC_TOOLS list and applies:
 * - Tools in PUBLIC_TOOLS: noauth scheme (publicly accessible)
 * - Tools NOT in PUBLIC_TOOLS: DEFAULT_AUTH_SCHEME (requires OAuth)
 *
 * @param toolName - MCP tool name
 * @returns Array of security schemes for this tool
 *
 * @remarks
 * Pure function - always returns same result for same input.
 * Security policy is read from mcp-security-policy.ts configuration.
 *
 * Used by generator during type-gen to emit security metadata.
 * Runtime will read from generated descriptors, not call this function.
 *
 * @example
 * ```typescript
 * // Public tool
 * const publicSchemes = getSecuritySchemeForTool('get-changelog');
 * // Returns: [{ type: 'noauth' }]
 *
 * // Protected tool
 * const protectedSchemes = getSecuritySchemeForTool('get-lessons');
 * // Returns: [{ type: 'oauth2', scopes: ['email'] }]
 * ```
 */
export function getSecuritySchemeForTool(toolName: string): readonly SecurityScheme[] {
  if (PUBLIC_TOOLS.includes(toolName)) {
    return [{ type: 'noauth' }];
  }
  return [DEFAULT_AUTH_SCHEME];
}
