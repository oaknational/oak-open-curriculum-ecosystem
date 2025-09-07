/**
 * MCP Tool Listing - Generated from SDK
 *
 * Lists all available tools by reading from the SDK's MCP_TOOLS.
 * Converts SDK metadata to MCP's JSON Schema format.
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { JsonObject } from '@oaknational/mcp-core';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

/**
 * Convert SDK parameter metadata to JSON Schema for MCP
 */
function toJsonSchemaProperty(meta: {
  typePrimitive: string;
  valueConstraint: boolean;
  required: boolean;
}): JsonObject {
  const schema: JsonObject = {
    type: meta.typePrimitive === 'number' ? 'number' : 'string',
  };
  if (meta.valueConstraint) {
    const d = Object.getOwnPropertyDescriptor(meta, 'allowedValues');
    const valuesList = Array.isArray(d?.value) ? d.value.map((v: unknown) => String(v)) : undefined;
    if (valuesList) schema.description = `One of: ${valuesList.join(', ')}`;
  }
  return schema;
}

function generateInputSchema(tool: (typeof MCP_TOOLS)[keyof typeof MCP_TOOLS]) {
  const properties: JsonObject = {};
  const required: string[] = [];

  const accumulate = (
    name: string,
    meta: { typePrimitive: string; valueConstraint: boolean; required: boolean },
  ): void => {
    properties[name] = toJsonSchemaProperty(meta);
    if (meta.required) required.push(name);
  };

  for (const [name, meta] of Object.entries(tool.pathParams)) accumulate(name, meta);
  for (const [name, meta] of Object.entries(tool.queryParams)) accumulate(name, meta);

  return {
    type: 'object' as const,
    properties,
    required: required.length > 0 ? required : undefined,
  };
}

/**
 * Get all MCP tools from SDK
 */
export function getMcpTools(): Tool[] {
  return Object.entries(MCP_TOOLS).map(([name, tool]) => ({
    name,
    description: `${tool.method.toUpperCase()} ${tool.path} - ${tool.operationId}`,
    inputSchema: generateInputSchema(tool),
  }));
}

/**
 * Export for backwards compatibility
 */
export const tools = getMcpTools();
