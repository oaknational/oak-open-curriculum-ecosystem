import { z } from 'zod';

import type { ToolDescriptor } from '../tool-descriptor.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-lessons-assets-by-type
 * Path: /lessons/{lesson}/assets/{type}
 * Method: GET
 */

const operationId = 'getAssets-getLessonAsset' as const;
const name = 'get-lessons-assets-by-type' as const;
const path = '/lessons/{lesson}/assets/{type}' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The lesson slug */
  readonly lesson: string;
  /** Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
export interface ToolParams {
  readonly path: ToolPathParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"lesson":{"type":"string","description":"The lesson slug"},"type":{"type":"string","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["lesson","type"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ lesson: z.string(), type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]) }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"lesson":{"type":"string","description":"The lesson slug"},"type":{"type":"string","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["lesson","type"]}\nRequired: lesson, type';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/lessons/{lesson}/assets/{type}');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getLessonsAssetsByType = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/lessons/{lesson}/assets/{type}"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /lessons/{lesson}/assets/{type}');
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
  description: "This tool will stream the downloadable asset for the given lesson and type. There is no response returned for this tool as it returns a content attachment.",
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
export const getLessonsAssetsByTypeTool = getLessonsAssetsByType;
export const getLessonsAssetsByType = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/lessons/{lesson}/assets/{type}"];
    const call = endpoint ? endpoint.get : undefined;
    if (typeof call !== 'function') {
      throw new TypeError('Invalid method on endpoint: get for /lessons/{lesson}/assets/{type}');
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