import { z } from 'zod';

import type { ToolDescriptor } from '../types.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-lessons
 * Path: /key-stages/{keyStage}/subject/{subject}/lessons
 * Method: GET
 */

const operationId = 'getKeyStageSubjectLessons-getKeyStageSubjectLessons' as const;
const name = 'get-key-stages-subject-lessons' as const;
const path = '/key-stages/{keyStage}/subject/{subject}/lessons' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** Optional unit slug to additionally filter by */
  readonly unit?: string;
  /** Default: 0 */
  readonly offset?: number;
  /** Default: 10 */
  readonly limit?: number;
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"},"offset":{"type":"number","default":0},"limit":{"type":"number","default":10}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]) }), query: z.object({ unit: z.string().optional(), offset: z.number().optional(), limit: z.number().optional() }).optional() }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. \'english\' - note that casing is important here, and should be lowercase","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"},"offset":{"type":"number","default":0},"limit":{"type":"number","default":10}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/key-stages/{keyStage}/subject/{subject}/lessons');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getKeyStagesSubjectLessons = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/key-stages/{keyStage}/subject/{subject}/lessons"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/lessons');
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
  description: "This tool returns an array of available published lessons for a given subject and key stage, grouped by unit.",
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
export const getKeyStagesSubjectLessonsTool = getKeyStagesSubjectLessons;