/**
 * Determines if a tool requires OAuth authentication.
 *
 * This pure function reads security metadata from generated tool descriptors
 * and aggregated tool definitions to determine authentication requirements.
 *
 * **Architecture**: All security metadata is generated at sdk-codegen time or
 * defined for aggregated tools. This function only READS that metadata — it
 * never computes or decides policy.
 *
 * **Decision Logic (deny-by-default)**:
 * - If `securitySchemes` is absent or empty → `true` (require auth)
 * - If every scheme is `noauth` → `false` (public access)
 * - Otherwise → `true` (auth required)
 *
 * Only an explicit, non-empty array of all-`noauth` schemes permits
 * unauthenticated access.
 *
 * @param toolName - Universal tool name (generated or aggregated tool)
 * @returns `true` if tool requires OAuth authentication, `false` if public
 *
 * @example
 * ```typescript
 * // Generated OAuth-protected tool
 * toolRequiresAuth('get-lessons')  // => true
 *
 * // Generated public tool
 * toolRequiresAuth('get-changelog')  // => false
 *
 * // Aggregated OAuth-protected tool
 * toolRequiresAuth('search')  // => true
 * ```
 *
 * @see Sub-Phase 2.3 of schema-first-security-implementation.md
 * @public
 */

import {
  type SecurityScheme,
  type UniversalToolName,
  isAggregatedToolName,
  AGGREGATED_TOOL_DEFS,
  getToolFromToolName,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

/**
 * Resolves whether authentication is required from a `securitySchemes` value.
 *
 * Implements deny-by-default: only an explicit, non-empty array where every
 * entry is `noauth` permits unauthenticated access. All other cases —
 * including `undefined`, empty arrays, and arrays containing any non-`noauth`
 * scheme — require authentication.
 *
 * @param schemes - Security schemes from a tool descriptor
 * @returns `true` if auth is required, `false` only if all schemes are `noauth`
 */
export function resolveAuthRequired(schemes: readonly SecurityScheme[] | undefined): boolean {
  if (schemes === undefined || schemes.length === 0) {
    return true;
  }

  return !schemes.every((scheme) => scheme.type === 'noauth');
}

export function toolRequiresAuth(toolName: UniversalToolName): boolean {
  const schemes = isAggregatedToolName(toolName)
    ? AGGREGATED_TOOL_DEFS[toolName].securitySchemes
    : getToolFromToolName(toolName).securitySchemes;

  return resolveAuthRequired(schemes);
}
