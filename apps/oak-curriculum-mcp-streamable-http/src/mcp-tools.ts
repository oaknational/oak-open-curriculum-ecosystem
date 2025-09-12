import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

export function getMcpTools(): Tool[] {
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

  return Object.entries(MCP_TOOLS).map(([name, tool]) => ({
    name,
    description: `${tool.method.toUpperCase()} ${tool.path} - ${tool.operationId}`,
    inputSchema: toMutableInputSchema(tool.inputSchema),
  }));
}
