/**
 * Determines if a tool requires OAuth authentication.
 *
 * This pure function reads security metadata from generated tool descriptors
 * and aggregated tool definitions to determine authentication requirements.
 *
 * **Architecture**: All security metadata is generated at type-gen time or
 * defined for aggregated tools. This function only READS that metadata—it
 * never computes or decides policy.
 *
 * **Decision Logic**:
 * - Reads `securitySchemes` from tool descriptor or aggregated definition
 * - If any scheme is `oauth2` → returns `true` (auth required)
 * - If all schemes are `noauth` → returns `false` (public access)
 * - If no schemes defined → returns `true` (safe default: require auth)
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
 * @see isDiscoveryMethod for MCP protocol method classification
 * @public
 */

import {
  type UniversalToolName,
  isAggregatedToolName,
  AGGREGATED_TOOL_DEFS,
  getToolFromToolName,
} from '@oaknational/oak-curriculum-sdk';

export function toolRequiresAuth(toolName: UniversalToolName): boolean {
  const schemes = isAggregatedToolName(toolName)
    ? AGGREGATED_TOOL_DEFS[toolName].securitySchemes
    : getToolFromToolName(toolName).securitySchemes;

  return schemes.some((scheme) => scheme.type === 'oauth2');
}
