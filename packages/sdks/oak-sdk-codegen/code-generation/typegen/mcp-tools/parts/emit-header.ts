export function emitHeader(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
): string {
  // Escape braces in the doc comment so path templates like {keyStage} are TSDoc-safe
  const escapedPath = path.replace(/\{/g, '\\{').replace(/\}/g, '\\}');
  const lines: string[] = [];
  lines.push(`/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: ${toolName}
 * Path: ${escapedPath}
 * Method: ${method.toUpperCase()}
 */

const operationId = '${operationId}' as const;
const name = '${toolName}' as const;
const path = '${path}' as const;
const method = '${method.toUpperCase()}' as const;

`);
  return lines.join('\n');
}
