/**
 * Enriched Tools Module for Oak Curriculum MCP
 *
 * This file imports tool definitions from the SDK and enriches them with
 * optional decorative metadata. ALL API data comes from the SDK.
 *
 * Data Flow:
 * OpenAPI Schema → SDK Type Generation → This Module → MCP Server
 *
 * ADR Compliance:
 * - ADR-029: No manual API data (all from SDK)
 * - ADR-030: SDK as single source of truth
 * - ADR-035: Unified SDK-MCP type generation
 */

import {
  MCP_TOOLS_DATA,
  PATH_OPERATIONS,
  type McpToolName,
  type PathOperation,
} from '@oaknational/oak-curriculum-sdk';
import { TOOL_DECORATIONS } from '../../../chorai/tool-metadata/tool-decorations';
import type { ToolDecoration } from '../../../chorai/tool-metadata/types.js';

/**
 * Parameter definition from OpenAPI schema
 */
interface OperationParameter {
  in: 'path' | 'query' | 'header' | 'cookie';
  name: string;
  required?: boolean;
  description?: string;
  schema?: {
    type?: string;
    enum?: readonly string[];
    example?: string;
    format?: string;
    default?: unknown;
  };
}

/**
 * Extended PathOperation type with all properties we need
 */
interface ExtendedPathOperation {
  path: string;
  method: string;
  operationId: string;
  description?: string;
  parameters?: readonly OperationParameter[];
  pathParams?: readonly string[];
  queryParams?: readonly string[];
}

/**
 * Enriched tool type combining SDK data with optional decorations
 */
export interface EnrichedTool {
  /** MCP tool name from SDK */
  mcpName: McpToolName;
  /** Path from SDK */
  path: string;
  /** HTTP method from SDK */
  method: string;
  /** Operation ID from SDK */
  operationId: string;
  /** Description from SDK */
  description?: string;
  /** Path parameters from SDK */
  pathParams: readonly string[];
  /** Query parameters from SDK */
  queryParams: readonly string[];
  /** Optional decorative metadata */
  decoration?: ToolDecoration;
  /** Full parameter definitions from PATH_OPERATIONS */
  parameters: readonly OperationParameter[];
}

/**
 * Create enriched tools by combining SDK data with decorations
 */
function createEnrichedTools(): readonly EnrichedTool[] {
  const tools: EnrichedTool[] = [];

  // Iterate through all tools from the SDK
  for (const [mcpName, toolData] of Object.entries(MCP_TOOLS_DATA)) {
    // Find the full operation data from PATH_OPERATIONS
    const operation = PATH_OPERATIONS.find(
      (op: PathOperation) => op.operationId === toolData.operationId,
    ) as ExtendedPathOperation | undefined;

    if (!operation) {
      console.warn(`No operation found for ${mcpName} with operationId ${toolData.operationId}`);
      continue;
    }

    // Get optional decoration for this operation
    const decoration = TOOL_DECORATIONS[toolData.operationId];

    // Combine SDK data with decoration
    const enrichedTool: EnrichedTool = {
      mcpName: mcpName as McpToolName,
      path: toolData.path,
      method: toolData.method,
      operationId: toolData.operationId,
      description: toolData.description ?? operation.description,
      pathParams: toolData.pathParams,
      queryParams: toolData.queryParams,
      parameters: operation.parameters ?? [],
      ...(decoration && { decoration }),
    };

    tools.push(enrichedTool);
  }

  return tools;
}

/**
 * All enriched tools for the Oak Curriculum MCP
 * Generated from SDK operations with optional decorations
 */
export const ENRICHED_TOOLS = createEnrichedTools();

/**
 * Get enriched tool by operation ID
 */
export function getEnrichedToolById(operationId: string): EnrichedTool | undefined {
  return ENRICHED_TOOLS.find((tool) => tool.operationId === operationId);
}

/**
 * Get enriched tool by MCP name
 */
export function getEnrichedToolByName(mcpName: McpToolName): EnrichedTool | undefined {
  return ENRICHED_TOOLS.find((tool) => tool.mcpName === mcpName);
}

/**
 * Get only tools with decorations
 */
export function getDecoratedTools(): readonly EnrichedTool[] {
  return ENRICHED_TOOLS.filter((tool) => tool.decoration !== undefined);
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category: string): readonly EnrichedTool[] {
  return ENRICHED_TOOLS.filter((tool) => tool.decoration?.category === category);
}
