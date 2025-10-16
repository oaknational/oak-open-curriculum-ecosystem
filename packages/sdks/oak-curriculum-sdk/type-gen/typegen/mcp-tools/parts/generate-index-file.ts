const ROOT_BANNER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * MCP Tools barrel exports
 * Re-exports canonical literals, descriptors, and derived types.
 */`;

const DATA_BANNER = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * MCP Tools data exports
 * Provides readonly helpers derived from the canonical descriptor map.
 */`;

export function generateRootIndexFile(): string {
  return [
    ROOT_BANNER,
    'export { toolNames, getToolFromToolName, getToolFromOperationId, getToolNameFromOperationId, getOperationIdFromToolName, isToolName, isToolOperationId, type ToolOperationId, type ToolOperationIdForName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolMap, type ToolName, type ToolNameForOperationId } from "./generated/data/index.js";',
    'export { type ToolDescriptor } from "./contract/tool-descriptor.contract.js";',
    'export { type ToolArgs, type ToolArgsForOperationId, type ToolDescriptors, type ToolInvoke, type ToolNameFromOperationId, type ToolResult, type ToolResultForOperationId, type RegisteredToolEntries, type ToolClient, type ToolClientForName, type ToolArgsForName, type ToolResultForName } from "./generated/aliases/types.js";',
  ].join('\n\n');
}

export function generateDataIndexFile(): string {
  return [
    DATA_BANNER,
    'export { toolNames, getToolFromToolName, getToolFromOperationId, getToolNameFromOperationId, getOperationIdFromToolName, isToolName, isToolOperationId, type ToolOperationId, type ToolOperationIdForName, type ToolDescriptorForName, type ToolDescriptorForOperationId, type ToolMap, type ToolName, type ToolNameForOperationId } from "./definitions.js";',
  ].join('\n\n');
}
