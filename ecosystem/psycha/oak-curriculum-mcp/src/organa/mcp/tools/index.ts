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
import { schema } from '@oaknational/oak-curriculum-sdk';
import { ENRICHED_TOOLS, getEnrichedTool, type EnrichedTool } from '../generated/enriched-tools';

/**
 * Extract parameters from schema for a specific path/method
 */
function getOperationParameters(
  path: string,
  method: string,
): {
  pathParams: string[];
  queryParams: string[];
  requiredParams: string[];
} {
  const pathItem = schema.paths?.[path as keyof typeof schema.paths];
  if (!pathItem) {
    return { pathParams: [], queryParams: [], requiredParams: [] };
  }

  const operation = pathItem[method.toLowerCase() as keyof typeof pathItem];
  if (!operation || typeof operation !== 'object' || !('parameters' in operation)) {
    return { pathParams: [], queryParams: [], requiredParams: [] };
  }

  const pathParams: string[] = [];
  const queryParams: string[] = [];
  const requiredParams: string[] = [];

  if (Array.isArray(operation.parameters)) {
    for (const param of operation.parameters) {
      if (typeof param !== 'object' || !param) continue;

      const p = param as {
        name: string;
        in: string;
        required?: boolean;
      };

      if (p.in === 'path') {
        pathParams.push(p.name);
        // Path parameters are always required
        requiredParams.push(p.name);
      } else if (p.in === 'query') {
        queryParams.push(p.name);
        if (p.required) {
          requiredParams.push(p.name);
        }
      }
    }
  }

  return { pathParams, queryParams, requiredParams };
}

/**
 * Convert enriched tools to MCP SDK Tool format
 */
function toMcpTools(enrichedTools: readonly EnrichedTool[]): Tool[] {
  return enrichedTools.map((tool) => {
    // Get parameters from schema
    const { pathParams, queryParams, requiredParams } = getOperationParameters(
      tool.path,
      tool.method,
    );

    return {
      name: tool.mcpName,
      description:
        tool.decoration?.description ??
        tool.description ??
        `${tool.method.toUpperCase()} ${tool.path}`,
      inputSchema: {
        type: 'object',
        properties: {
          // Include all path parameters (always required)
          ...pathParams.reduce<Record<string, unknown>>((acc, paramName) => {
            acc[paramName] = {
              type: 'string',
              description: `Path parameter: ${paramName}`,
            };
            return acc;
          }, {}),
          // Include all query parameters (optional unless marked required)
          ...queryParams.reduce<Record<string, unknown>>((acc, paramName) => {
            acc[paramName] = {
              type: 'string',
              description: `Query parameter: ${paramName}`,
            };
            return acc;
          }, {}),
        },
        // Include all required parameters
        required: requiredParams,
      },
    };
  });
}

/**
 * All available MCP tools
 * Generated at build time from SDK operations + decorations
 */
export const tools = toMcpTools(ENRICHED_TOOLS);

/**
 * Export convenience function
 */
export { getEnrichedTool };

/**
 * Export tool type
 */
export type { EnrichedTool };

/**
 * Export tool names type
 * Derived from generated tools
 */
export type ToolName = EnrichedTool['mcpName'];
