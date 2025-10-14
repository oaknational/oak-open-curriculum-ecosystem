import { z } from 'zod';

import type { ToolDescriptor } from '../types.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-lessons-summary
 * Path: /lessons/{lesson}/summary
 * Method: GET
 */

const operationId = 'getLessons-getLesson' as const;
const name = 'get-lessons-summary' as const;
const path = '/lessons/{lesson}/summary' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The slug of the lesson */
  readonly lesson: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"lesson":{"type":"string","description":"The slug of the lesson"}} as const, additionalProperties: false as const, required: ["lesson"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ lesson: z.string() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The slug of the lesson"}},"additionalProperties":false,"required":["lesson"]}\nRequired: lesson';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/lessons/{lesson}/summary');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getLessonsSummary = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/lessons/{lesson}/summary"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /lessons/{lesson}/summary');
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
  description: "This tool returns a summary for a given lesson",
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
export const getLessonsSummaryTool = getLessonsSummary;