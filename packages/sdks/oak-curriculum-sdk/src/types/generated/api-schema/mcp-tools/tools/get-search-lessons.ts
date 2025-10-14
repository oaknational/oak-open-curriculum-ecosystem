import { z } from 'zod';

import type { ToolDescriptor } from '../types.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-search-lessons
 * Path: /search/lessons
 * Method: GET
 */

const operationId = 'getLessons-searchByTextSimilarity' as const;
const name = 'get-search-lessons' as const;
const path = '/search/lessons' as const;
const method = 'GET' as const;


/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** Search query text snippet */
  readonly q: string;
  /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage?: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject?: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
  /** Optional unit slug to additionally filter by */
  readonly unit?: string;
}
export interface ToolParams {
  readonly query: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"q":{"type":"string","description":"Search query text snippet"},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"}} as const, additionalProperties: false as const, required: ["q"] };
export const toolZodSchema = z.object({ params: z.object({ query: z.object({ q: z.string(), keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]).optional(), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]).optional(), unit: z.string().optional() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"q":{"type":"string","description":"Search query text snippet"},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. \'english\' - note that casing is important here, and should be lowercase","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by"}},"additionalProperties":false,"required":["q"]}\nRequired: q';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/search/lessons');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSearchLessons = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/search/lessons"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /search/lessons');
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
  description: "Search for a term and find the 20 most similar lessons with titles that contain similar text.",
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
export const getSearchLessonsTool = getSearchLessons;