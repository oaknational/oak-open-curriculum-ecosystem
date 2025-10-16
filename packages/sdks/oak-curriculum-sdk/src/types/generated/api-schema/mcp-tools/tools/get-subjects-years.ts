import { z } from 'zod';

import type { ToolDescriptor } from '../tool-descriptor.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-subjects-years
 * Path: /subjects/{subject}/years
 * Method: GET
 */

const operationId = 'getSubjects-getSubjectYears' as const;
const name = 'get-subjects-years' as const;
const path = '/subjects/{subject}/years' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** Subject slug to filter by */
  readonly subject: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"subject":{"type":"string","description":"Subject slug to filter by"}} as const, additionalProperties: false as const, required: ["subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ subject: z.string() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"subject":{"type":"string","description":"Subject slug to filter by"}},"additionalProperties":false,"required":["subject"]}\nRequired: subject';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/subjects/{subject}/years');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSubjectsYears = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/subjects/{subject}/years"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /subjects/{subject}/years');
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
  description: "This tool returns an array of years that are currently available for a given subject.",
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
export const getSubjectsYearsTool = getSubjectsYears;
export const getSubjectsYears = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/subjects/{subject}/years"];
    const call = endpoint ? endpoint.get : undefined;
    if (typeof call !== 'function') {
      throw new TypeError('Invalid method on endpoint: get for /subjects/{subject}/years');
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
} as const satisfies ToolDescriptor;