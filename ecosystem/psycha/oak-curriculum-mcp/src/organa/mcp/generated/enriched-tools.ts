/**
 * Enriched Tools Module for Oak Curriculum MCP
 *
 * This file imports tool definitions from the SDK and enriches them with
 * optional decorative metadata. Tool names and coordinates come from TOOL_LOOKUP.
 * Parameters and descriptions come from the schema.
 *
 * Data Flow:
 * OpenAPI Schema → SDK Type Generation → This Module → MCP Server
 *
 * ADR Compliance:
 * - ADR-029: No manual API data (all from SDK)
 * - ADR-030: SDK as single source of truth
 * - ADR-035: Unified SDK-MCP type generation
 */

import { TOOL_LOOKUP, isToolName, type ToolName } from '@oaknational/oak-curriculum-sdk';
import { schema } from '@oaknational/oak-curriculum-sdk';
import { TOOL_DECORATIONS } from '../../../chorai/tool-metadata/tool-decorations';
import type { ToolDecoration } from '../../../chorai/tool-metadata/types.js';

/**
 * Enriched tool type combining SDK data with optional decorations
 */
export interface EnrichedTool {
  /** MCP tool name from SDK */
  mcpName: ToolName;
  /** Path from SDK */
  path: string;
  /** HTTP method from SDK */
  method: string;
  /** Description from schema */
  description?: string;
  /** Optional decorative metadata */
  decoration?: ToolDecoration;
}

/**
 * Extract description from schema operation
 */
function getOperationDescription(path: string, method: string): string | undefined {
  const pathItem = schema.paths?.[path as keyof typeof schema.paths];
  if (!pathItem) return undefined;

  const operation = pathItem[method.toLowerCase() as keyof typeof pathItem];
  if (!operation || typeof operation !== 'object') return undefined;

  // Check for description property
  if ('description' in operation) {
    const desc = operation.description;
    if (typeof desc === 'string') return desc;
  }

  // Check for summary property (some OpenAPI specs use this)
  if ('summary' in operation) {
    const sum = (operation as Record<string, unknown>).summary;
    if (typeof sum === 'string') return sum;
  }

  return undefined;
}

/**
 * Get operation ID from schema
 */
function getOperationId(path: string, method: string): string | undefined {
  const pathItem = schema.paths?.[path as keyof typeof schema.paths];
  if (!pathItem) return undefined;

  const operation = pathItem[method.toLowerCase() as keyof typeof pathItem];
  if (!operation || typeof operation !== 'object') return undefined;

  if ('operationId' in operation && typeof operation.operationId === 'string') {
    return operation.operationId;
  }

  return undefined;
}

/**
 * Create enriched tools by combining TOOL_LOOKUP with schema data and decorations
 */
function createEnrichedTools(): readonly EnrichedTool[] {
  const tools: EnrichedTool[] = [];

  // Iterate through all tools from TOOL_LOOKUP
  for (const [mcpName, coordinates] of Object.entries(TOOL_LOOKUP)) {
    // Use type guard to ensure mcpName is valid
    if (!isToolName(mcpName)) {
      // This should never happen since we're iterating over TOOL_LOOKUP
      // but TypeScript needs the check for type safety
      continue;
    }

    const { path, method } = coordinates;

    // Get operation ID for decoration lookup
    const operationId = getOperationId(path, method);
    const decoration = operationId ? TOOL_DECORATIONS[operationId] : undefined;

    // Combine lookup data with schema description and decoration
    const enrichedTool: EnrichedTool = {
      mcpName, // Now typed as ToolName thanks to type guard
      path,
      method,
      description: getOperationDescription(path, method),
      ...(decoration ? { decoration } : {}),
    };

    tools.push(enrichedTool);
  }

  return tools;
}

/**
 * All enriched tools for the Oak Curriculum MCP
 * Created once at module load time
 */
export const ENRICHED_TOOLS: readonly EnrichedTool[] = createEnrichedTools();

/**
 * Map of tool names to enriched tools for O(1) lookup
 */
export const ENRICHED_TOOLS_MAP: ReadonlyMap<ToolName, EnrichedTool> = new Map(
  ENRICHED_TOOLS.map((tool) => [tool.mcpName, tool]),
);

/**
 * Get an enriched tool by name
 */
export function getEnrichedTool(mcpName: string): EnrichedTool | undefined {
  if (!isToolName(mcpName)) {
    return undefined;
  }
  return ENRICHED_TOOLS_MAP.get(mcpName);
}
