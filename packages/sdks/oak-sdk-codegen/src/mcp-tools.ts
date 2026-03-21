/**
 * Subpath barrel: `@oaknational/sdk-codegen/mcp-tools`
 *
 * MCP tool descriptors, contracts, type aliases, runtime execution,
 * stubs for testing, and supported OAuth scopes.
 */

export {
  MCP_TOOL_DESCRIPTORS,
  toolNames,
  getToolEntryFromToolName,
  getToolFromToolName,
  getToolFromOperationId,
  getToolNameFromOperationId,
  getOperationIdFromToolName,
  isToolName,
  isToolOperationId,
  listAllToolDescriptors,
  UndocumentedResponseError,
} from './types/generated/api-schema/mcp-tools/index.js';
export type {
  ToolDescriptorMap,
  ToolMap,
  ToolDescriptorForName,
  ToolDescriptorForOperationId,
  ToolEntry,
  ToolEntryForName,
  ToolOperationId,
  ToolOperationIdForName,
  ToolName,
  ToolNameForOperationId,
  ToolDescriptor,
  ToolArgs,
  ToolArgsForOperationId,
  ToolDescriptors,
  ToolInvoke,
  ToolNameFromOperationId,
  ToolResult,
  ToolResultForOperationId,
  RegisteredToolEntries,
  ToolClient,
  ToolClientForName,
  ToolArgsForName,
  ToolResultForName,
} from './types/generated/api-schema/mcp-tools/index.js';

export { DOCUMENTED_ERROR_PREFIX } from './types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';
export type {
  SecuritySchemeType,
  NoAuthScheme,
  OAuth2Scheme,
  SecurityScheme,
  StatusDiscriminant,
  InvokeResult,
} from './types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.js';

export { callTool } from './types/generated/api-schema/mcp-tools/runtime/execute.js';

export {
  createStubToolExecutor,
  stubbedToolResponses,
  type StubbedToolName,
} from './types/generated/api-schema/mcp-tools/stubs/index.js';

export {
  SCOPES_SUPPORTED,
  type ScopesSupported,
} from './types/generated/api-schema/mcp-tools/scopes-supported.js';
