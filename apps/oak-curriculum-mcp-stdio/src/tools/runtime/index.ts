/**
 * MCP Tool Listing - Generated from SDK
 *
 * Lists all available tools by reading from the SDK's MCP_TOOLS.
 * Passes through SDK-provided inputSchema (compile-time generated),
 * removing runtime reconstruction logic.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

// Typed entries helper to avoid direct Object.* usage at call sites
type ToolsMap = typeof MCP_TOOLS;

function isToolKey(k: PropertyKey): k is Extract<keyof ToolsMap, string> {
  return typeof k === 'string' && k in MCP_TOOLS;
}

function entriesTools(
  map: ToolsMap,
): [Extract<keyof ToolsMap, string>, ToolsMap[Extract<keyof ToolsMap, string>]][] {
  const out: [Extract<keyof ToolsMap, string>, ToolsMap[Extract<keyof ToolsMap, string>]][] = [];
  for (const k in map) {
    if (!isToolKey(k)) continue;
    out.push([k, map[k]]);
  }
  return out;
}

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | JsonArray;
interface JsonObject {
  [k: string]: JsonValue;
}
type JsonArray = readonly JsonValue[];

function toMutableInputSchema(schema: {
  readonly type: 'object';
  readonly properties: Readonly<Record<string, JsonValue>>;
  readonly required?: readonly string[];
}): { type: 'object'; properties: Record<string, JsonValue>; required?: string[] } {
  const props: Record<string, JsonValue> = {};
  for (const k in schema.properties) {
    props[k] = schema.properties[k];
  }
  const req = schema.required ? [...schema.required] : undefined;
  return { type: 'object', properties: props, required: req };
}

/**
 * Get all MCP tools from SDK
 */
export function getMcpTools(): Tool[] {
  return entriesTools(MCP_TOOLS).map(([name, tool]) => ({
    name,
    description: `${tool.method.toUpperCase()} ${tool.path} - ${tool.operationId}`,
    inputSchema: toMutableInputSchema(tool.inputSchema),
  }));
}
