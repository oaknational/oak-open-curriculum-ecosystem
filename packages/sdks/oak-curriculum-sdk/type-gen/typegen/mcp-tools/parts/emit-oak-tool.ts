import { toCamelCase } from './param-utils.js';

export function emitOakTool(toolName: string): string {
  const stubName = `${toCamelCase(toolName)}Tool`;
  const descriptorName = toCamelCase(toolName);
  return `/**
 * @internal Generated Oak MCP tool stub kept for documentation and regression tests.
 * @remarks Runtime execution flows through the ToolDescriptor entry; this stub will be replaced when tool handlers adopt schema-derived types.
 */
export const ${stubName} = ${descriptorName};`;
}
