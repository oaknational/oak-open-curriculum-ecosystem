/**
 * MCP tool definitions for Oak Curriculum API
 *
 * Uses build-time generated tools that combine SDK operations with decorative metadata.
 *
 * ADR Compliance:
 * - ADR-029: No manual API data (all from SDK)
 * - ADR-030: SDK as single source of truth
 * - ADR-031: Generation at build time (not runtime)
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import {
  ENRICHED_TOOLS,
  getEnrichedToolById,
  getDecoratedTools,
  getToolsByCategory,
  type EnrichedTool,
} from '../generated/enriched-tools';

/**
 * Convert enriched tools to MCP SDK Tool format
 */
function toMcpTools(enrichedTools: readonly EnrichedTool[]): Tool[] {
  return enrichedTools.map((tool) => ({
    name: tool.mcpName,
    description: tool.decoration?.description ?? tool.description ?? `${tool.method.toUpperCase()} ${tool.path}`,
    inputSchema: {
      type: 'object',
      properties: {
        // Include all path parameters (always required)
        ...tool.pathParams.reduce<Record<string, unknown>>((acc, paramName) => {
          acc[paramName] = {
            type: 'string',
            description: `Path parameter: ${paramName}`,
          };
          return acc;
        }, {}),
        // Include all query parameters (optional)
        ...tool.queryParams.reduce<Record<string, unknown>>((acc, paramName) => {
          acc[paramName] = {
            type: 'string',
            description: `Query parameter: ${paramName}`,
          };
          return acc;
        }, {}),
      },
      // Path parameters are always required
      required: tool.pathParams as string[],
    },
  }));
}

/**
 * All available MCP tools
 * Generated at build time from SDK operations + decorations
 */
export const tools = toMcpTools(ENRICHED_TOOLS);

/**
 * Export convenience functions
 */
export { getEnrichedToolById, getDecoratedTools, getToolsByCategory };

/**
 * Export tool type
 */
export type { EnrichedTool };

/**
 * Export tool names type
 * Derived from generated tools
 */
export type ToolName = EnrichedTool['mcpName'];
