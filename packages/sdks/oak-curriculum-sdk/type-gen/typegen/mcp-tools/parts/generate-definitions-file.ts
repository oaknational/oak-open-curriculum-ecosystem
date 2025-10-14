const banner = `/**
 * GENERATED FILE - DO NOT EDIT
 *
 * Generated from packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-definitions-file.ts
 *
 * MCP Tools definitions
 * 
 * Canonical literal descriptors for every tool.
 * 
 * This is an internal file, all types and utilities are created in the types.js file
 */`;

interface OperationToToolEntry {
  readonly operationId: string;
  readonly toolName: string;
}

function toolNameToIdentifier(toolName: string): string {
  return toolName.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
}

function emitToolImports(names: readonly string[]): string {
  return names
    .map(
      (toolName) => `import { ${toolNameToIdentifier(toolName)} } from './tools/${toolName}.js';`,
    )
    .join('\n');
}

function emitToolsLiteral(names: readonly string[]): string {
  const rows = names.map((toolName) => `  '${toolName}': ${toolNameToIdentifier(toolName)},`);
  return `export const MCP_TOOLS = {\n${rows.join('\n')}\n} as const;`;
}

const TOOL_NAME_BLOCK = `
type ToolNameToToolDescriptor = typeof MCP_TOOLS;
export type ToolName = keyof ToolNameToToolDescriptor;
`;

const IS_TOOL_NAME_BLOCK = `export function isToolName(value: unknown): value is ToolName {
  if (typeof value !== 'string') {
    return false;
  }
  return value in MCP_TOOLS;
}`;

const GET_TOOL_FROM_TOOL_NAME_BLOCK = `export function getToolFromToolName(toolName: ToolName): ToolDescriptor {
  return MCP_TOOLS[toolName];
}`;

const IS_OPERATION_ID_BLOCK = `export function isOperationId(value: unknown): value is OperationId {
  if (typeof value !== 'string') {
    return false;
  }
  return value in OPERATION_ID_TO_TOOL_NAME;
}`;

const GET_TOOL_NAME_FROM_ID_BLOCK = `export function getToolNameFromOperationId(operationId: OperationId): ToolName {
  const toolName = OPERATION_ID_TO_TOOL_NAME[operationId];
  if (!toolName) {
    throw new TypeError('Unknown operation: ' + String(operationId));
  }
  return toolName;
}`;

const GET_TOOL_FROM_ID_BLOCK = `export function getToolFromOperationId(operationId: OperationId): ToolDescriptor {
  const toolName = getToolNameFromOperationId(operationId);
  return MCP_TOOLS[toolName];
}`;

export function generateDefinitionsFile(
  toolNames: string[],
  operationToTool: readonly OperationToToolEntry[],
): string {
  const names = toolNames.slice().toSorted();

  const operationIdToToolNameCases = operationToTool
    .map(({ operationId, toolName }) => `  '${operationId}': '${toolName}',`)
    .join('\n');

  return [
    banner,
    "import { type ToolDescriptor } from './types.js';",
    '// Import all tool definitions',
    emitToolImports(names),
    emitToolsLiteral(names),
    TOOL_NAME_BLOCK,
    IS_TOOL_NAME_BLOCK,
    GET_TOOL_FROM_TOOL_NAME_BLOCK,
    `const OPERATION_ID_TO_TOOL_NAME = {\n${operationIdToToolNameCases}\n} as const;`,
    `export type OperationId = keyof typeof OPERATION_ID_TO_TOOL_NAME;`,
    IS_OPERATION_ID_BLOCK,
    GET_TOOL_NAME_FROM_ID_BLOCK,
    GET_TOOL_FROM_ID_BLOCK,
  ].join('\n\n');
}
