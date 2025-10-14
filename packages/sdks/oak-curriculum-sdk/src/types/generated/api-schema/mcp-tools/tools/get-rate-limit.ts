import { z } from 'zod';

import type { ToolDescriptor } from '../types.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-rate-limit
 * Path: /rate-limit
 * Method: GET
 */

const operationId = 'getRateLimit-getRateLimit' as const;
const name = 'get-rate-limit' as const;
const path = '/rate-limit' as const;
const method = 'GET' as const;


export type ToolParams = Record<string, never>;

export interface ToolArgs { readonly params?: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {} as const, additionalProperties: false as const };
export const toolZodSchema = z.object({ params: z.object({}).optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{},"additionalProperties":false}\nRequired: (none)';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/rate-limit');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getRateLimit = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/rate-limit"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /rate-limit');
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
  description: "Check your current rate limit status (note that your rate limit is also included in the headers of every response). This specific endpoint does not cost any requests.",
  path,
  method,
  validateOutput: (data: unknown) => {
    const result = responseDescriptor.zod.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    }
    return { ok: false, message: 'Invalid response payload. Please match the generated output schema.' };
  },
} as const satisfies ToolDescriptor;

/**
 * @internal Generated Oak MCP tool stub kept for documentation and regression tests.
 * @remarks Runtime execution flows through the ToolDescriptor entry; this stub will be replaced when tool handlers adopt schema-derived types.
 */
export const getRateLimitTool = getRateLimit;