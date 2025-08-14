/**
 * Type definitions for Oak Curriculum API
 */

export type { OpenAPI3 } from './openapi';

// Re-export generated types
export type { paths } from './generated/api-schema/api-paths-types';
export type { components } from './generated/api-schema/api-paths-types';

// Re-export MCP tools data and types
export { MCP_TOOLS_DATA, isMcpToolName, getMcpTool } from './generated/api-schema/mcp-tools';
export type { McpToolName } from './generated/api-schema/mcp-tools';

// Re-export MCP validators
export { MCP_TOOL_VALIDATORS, validateToolResponse } from './generated/api-schema/mcp-validators';
export type { GetToolValidatedResponse } from './generated/api-schema/mcp-validators';

// Re-export path operations - Note: PATH_OPERATIONS is the const, PathOperation is the type
export { PATH_OPERATIONS, OPERATIONS_BY_ID } from './generated/api-schema/path-parameters';
export type { PathOperation, OperationId } from './generated/api-schema/path-parameters';
