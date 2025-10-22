import { z } from 'zod';

import type { ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getDescriptorSchemaForEndpoint } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-lessons-quiz
 * Path: /lessons/{lesson}/quiz
 * Method: GET
 */

const operationId = 'getQuestions-getQuestionsForLessons' as const;
const name = 'get-lessons-quiz' as const;
const path = '/lessons/{lesson}/quiz' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The lesson slug identifier */
  readonly lesson: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"params":{"type":"object","properties":{"path":{"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug identifier"}},"additionalProperties":false,"required":["lesson"]}},"additionalProperties":false,"required":["path"]}} as const, additionalProperties: false as const, required: ["params"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ lesson: z.string() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"params":{"type":"object","properties":{"path":{"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug identifier"}},"additionalProperties":false,"required":["lesson"]}},"additionalProperties":false,"required":["path"]}},"required":["params"],"additionalProperties":false}\nRequired: params';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/lessons/{lesson}/quiz');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getLessonsQuiz = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/lessons/{lesson}/quiz"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /lessons/{lesson}/quiz');
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
  description: "The endpoint returns the quiz questions and answers for a given lesson. The answers data indicates which answers are correct, and which are distractors.",
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
