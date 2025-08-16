export function generateLibFile(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Library functions for MCP tools
 */

import { MCP_TOOLS } from './index.js';
import { getToolNameFromOperationId, type AllOperationIds, type AllToolNames } from './types.js';

/**
 * Get tool by name
 */
export function getToolFromToolName<ToolName extends AllToolNames>(toolName: ToolName):  typeof MCP_TOOLS[ToolName] {
  return MCP_TOOLS[toolName];
}

/**
 * Get tool by operation ID
 */
export function getToolFromOperationId(operationId: AllOperationIds): typeof MCP_TOOLS[AllToolNames] {
  return MCP_TOOLS[getToolNameFromOperationId(operationId)];
}
`;
}
