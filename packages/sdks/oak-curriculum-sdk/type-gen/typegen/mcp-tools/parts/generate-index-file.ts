export function generateBarrelFile(): string {
  const banner = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * MCP Tools barrel exports
 * Re-exports canonical literals and derived types.
 */`;

  return [
    banner,
    'export { toolNames, type ToolName, type ToolDescriptorForName, type ToolMap, type OperationId, type ToolNameForOperationId, isToolName, isOperationId, getToolFromToolName, getToolFromOperationId, getToolNameFromOperationId, getOperationIdFromToolName } from "./definitions.js";',
  ].join('\n\n');
}
