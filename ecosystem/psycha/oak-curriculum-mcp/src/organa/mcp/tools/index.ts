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
    description: tool.decoration?.description ?? tool.description,
    inputSchema: {
      type: 'object',
      properties: tool.parameters.reduce<Record<string, unknown>>((acc, param) => {
        const paramName = param.name;
        if (param.in === 'path' || param.in === 'query') {
          acc[paramName] = {
            ...param.schema,
            ...('description' in param && param.description
              ? { description: param.description }
              : {}),
          };
        }
        return acc;
      }, {}),
      required: tool.parameters.filter((p) => 'required' in p && p.required).map((p) => p.name),
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
