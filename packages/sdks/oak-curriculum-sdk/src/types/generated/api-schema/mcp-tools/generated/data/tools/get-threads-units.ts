import { z } from 'zod';

import type { ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getDescriptorSchemaForEndpoint } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-threads-units
 * Path: /threads/{threadSlug}/units
 * Method: GET
 */

const operationId = 'getThreads-getThreadUnits' as const;
const name = 'get-threads-units' as const;
const path = '/threads/{threadSlug}/units' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  readonly threadSlug: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"params":{"type":"object","properties":{"path":{"type":"object","properties":{"threadSlug":{"type":"string"}},"additionalProperties":false,"required":["threadSlug"]}},"additionalProperties":false,"required":["path"]}} as const, additionalProperties: false as const, required: ["params"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ threadSlug: z.string() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"params":{"type":"object","properties":{"path":{"type":"object","properties":{"threadSlug":{"type":"string"}},"additionalProperties":false,"required":["threadSlug"]}},"additionalProperties":false,"required":["path"]}},"required":["params"],"additionalProperties":false}\nRequired: params';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/threads/{threadSlug}/units');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getThreadsUnits = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/threads/{threadSlug}/units"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /threads/{threadSlug}/units');
    }
    const response = await call(validation.data);
    return response.data;
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolOutputJsonSchema: responseDescriptor.json,
  zodOutputSchema: responseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "This tool returns all of the units that belong to a given thread.",
  path,
  method,
  validateOutput: (data: unknown) => {
    const result = responseDescriptor.zod.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    }
    return {
      ok: false, message: 'Invalid response payload. Please match the generated output schema.',
      issues: result.error.issues,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof responseDescriptor.zod>>;
