import type { OperationObject } from 'openapi3-ts/oas31';
import { emitHeader, emitSchema, emitIndex, emitOakTool } from './emitters.js';
import type { ParamMetadataMap, ParamMetadata } from './param-metadata.js';

export type { ParamMetadata };

function buildImports(): string {
  return [
    "import { z } from 'zod';",
    '',
    "import type { ToolDescriptor } from '../tool-descriptor.js';",
    "import { getDescriptorSchemaForEndpoint } from '../../response-map.js';",
    "import type { OakApiPathBasedClient } from '../../../../../client/index.js';",
  ].join('\n');
}

export function generateToolFile(
  toolName: string,
  path: string,
  method: string,
  operationId: string,
  operation: OperationObject,
  pathParamMetadata: ParamMetadataMap,
  queryParamMetadata: ParamMetadataMap,
): string {
  const parts: string[] = [];
  parts.push(buildImports());
  parts.push(emitHeader(toolName, path, method, operationId));
  parts.push(emitSchema(operation, pathParamMetadata, queryParamMetadata));
  parts.push(emitIndex(toolName, path, method, operation));
  parts.push(emitOakTool(toolName));
  // TODO: thread ToolArgs/ToolResult once definitions/types emit stable aliases.
  parts.push(`export const ${toolName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())} = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client[${JSON.stringify(path)}];
    const call = endpoint ? endpoint.${method} : undefined;
    if (typeof call !== 'function') {
      throw new TypeError('Invalid method on endpoint: ${method} for ${path}');
    }
    return call(validation.data);
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolOutputJsonSchema: responseDescriptor.json,
  zodOutputSchema: responseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description,
  path,
  method,
  validateOutput: (data: unknown) => {
    const result = responseDescriptor.zod.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    }
    return { ok: false, message: 'Invalid response payload. Please match the generated output schema.' };
  },
} as const satisfies ToolDescriptor;`);
  return parts.join('\n');
}
