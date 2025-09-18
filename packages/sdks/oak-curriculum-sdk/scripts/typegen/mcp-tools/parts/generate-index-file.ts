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

// Import types used to provide a stable, nameable export surface
import type { OakApiPathBasedClient } from '../../../../client/index.js';
import type { ToolInputJsonSchema } from '../../../../mcp/zod-input-schema.js';
import type { AllToolNames } from './types.js';
import type { Tool as BaseTool } from '@modelcontextprotocol/sdk/types.js';

// Minimal shape to avoid leaking per-tool internal types (e.g. ValidRequestParams)
export interface ToolDescriptor extends BaseTool {
  invoke: (client: OakApiPathBasedClient, _params: unknown) => Promise<unknown>;
  inputSchema: ToolInputJsonSchema;
  operationId: string;
  name: string;
  path: string;
  method: string;
  // Emitted metadata used by the executor to split and validate arguments
  readonly pathParams: Readonly<Record<string, { readonly required?: boolean }>>;
  readonly queryParams: Readonly<Record<string, { readonly required?: boolean }>>;
}

// Import all tool definitions`);

  for (const toolName of alphabeticallySortedToolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`import { ${variableName} } from './tools/${toolName}.js';`);
  }

  lines.push(`
// Tool name to tool mapping
export const MCP_TOOLS: Readonly<Record<AllToolNames, ToolDescriptor>> = {`);

  for (const toolName of alphabeticallySortedToolNames) {
    const variableName = toolNameToCamelCase(toolName);
    lines.push(`  '${toolName}': ${variableName},`);
  }

  lines.push(`};`);

  // Re-export guards and types for SDK consumers and internal usage
  lines.push(`
export { 
  type AllOperationIds,
  type AllToolNames,
  isToolName,
  getToolNameFromOperationId
} from './types.js';
`);

  return lines.join('\n');
}
