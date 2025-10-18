// Aggregated MCP tooling exports to keep the public index concise.

export {
  toolNames,
  isToolName,
  isToolOperationId,
  getToolFromToolName,
  getToolFromOperationId,
  getToolNameFromOperationId,
  getOperationIdFromToolName,
  type ToolOperationId,
  type ToolOperationIdForName,
  type ToolDescriptorForName,
  type ToolDescriptorForOperationId,
  type ToolDescriptor,
  type ToolMap,
  type ToolName,
  type ToolNameForOperationId,
  type ToolArgs,
  type ToolArgsForOperationId,
  type ToolDescriptors,
  type ToolInvoke,
  type ToolNameFromOperationId,
  type ToolResult,
  type ToolResultForOperationId,
  type RegisteredToolEntries,
} from '../types/generated/api-schema/mcp-tools/index.js';

export {
  McpToolRegistry,
  attachMcpHandlers,
  createMcpToolRegistry,
} from '../types/generated/api-schema/mcp-tools/generated/runtime/lib.js';

export { executeToolCall, McpToolError, McpParameterError } from '../mcp/execute-tool-call.js';
export type { ToolExecutionResult } from '../mcp/execute-tool-call.js';

export {
  zodFromToolInputJsonSchema,
  zodRawShapeFromToolInputJsonSchema,
} from '../mcp/zod-input-schema.js';

export {
  listUniversalTools,
  isUniversalToolName,
  createUniversalToolExecutor,
  type UniversalToolName,
  type UniversalToolExecutorDependencies,
  type UniversalToolListEntry,
} from '../mcp/universal-tools.js';
