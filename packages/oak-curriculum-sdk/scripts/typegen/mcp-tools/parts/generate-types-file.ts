import { typeSafeEntries } from '../../../../src/types/helpers.js';

function headerBlock(): string {
  return `/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Type definitions and guards for MCP tools
 */`;
}

function mappingBlock(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  const lines: string[] = [];
  lines.push('/**\n * Operation ID to tool name mapping\n */');
  lines.push('const operationIdToToolName = {');
  for (const [operationId, mapping] of typeSafeEntries(operationIdMap)) {
    lines.push(`  '${operationId}': {`);
    lines.push(`    toolName: '${mapping.toolName}',`);
    lines.push(`    operationIdKey: '${operationId}',`);
    lines.push('  },');
  }
  lines.push('} as const;');
  lines.push('');
  lines.push('const allToolNames = Object.values(operationIdToToolName).map(v => v.toolName);');
  lines.push('export type AllOperationIds = keyof typeof operationIdToToolName;');
  lines.push('export type AllToolNames = typeof allToolNames[number];');
  return lines.join('\n');
}

function guardsBlock(): string {
  return `/**
* Type guard for tool names
*/
export function isToolName(value: unknown): value is AllToolNames {
  if (typeof value !== 'string') return false;
  const validToolNames: readonly string[] = allToolNames;
  return validToolNames.includes(value);
}

/**
* Type guard for operation IDs
*/
function isOperationId(operationId: string): operationId is AllOperationIds {
  return operationId in operationIdToToolName;
}

export function getToolNameFromOperationId(operationId: string): AllToolNames {
  if (!isOperationId(operationId)) {
    throw new TypeError(\`Invalid operation ID: \${operationId}. Allowed values: \${Object.keys(operationIdToToolName).join(', ')}\`);
  }
  return operationIdToToolName[operationId].toolName;
}`;
}

export function generateTypesFile(
  operationIdMap: Record<string, { toolName: string; operationId: string }>,
): string {
  return [headerBlock(), mappingBlock(operationIdMap), guardsBlock()].join('\n\n');
}
