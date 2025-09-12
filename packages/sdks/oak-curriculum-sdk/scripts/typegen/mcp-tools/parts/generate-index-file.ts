export function toolNameToCamelCase(toolName: string): string {
  return toolName.replace(/-([a-z])/g, (_: string, letter: string) => letter.toUpperCase());
}

export function generateIndexFile(toolNames: string[]): string {
  const lines: string[] = [];

  const alphabeticallySortedToolNames = toolNames.toSorted();

  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * MCP Tools index
 * Aggregates all tool definitions and provides the MCP_TOOLS mapping
 */

// Import type helpers to satisfy TS2742 portable type naming
import type {} from 'openapi-typescript-helpers';

// Import all tool definitions`);

  for (const toolName of alphabeticallySortedToolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`import { ${variableName} } from './tools/${toolName}.js';`);
  }

  lines.push(`
// Tool name to tool mapping
export const MCP_TOOLS = {`);

  for (const toolName of alphabeticallySortedToolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`  '${toolName}': ${variableName},`);
  }

  lines.push(`} as const;

// Re-export types with explicit names
export { 
  type AllOperationIds,
  type AllToolNames,
  isToolName,
  getToolNameFromOperationId
} from './types.js';

// Re-export lib functions with explicit names
export {
  getToolFromToolName,
  getToolFromOperationId,
} from './lib.js';
`);

  return lines.join('\n');
}
