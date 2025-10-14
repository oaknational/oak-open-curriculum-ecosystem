import { z } from 'zod';

import type { ToolDescriptor } from '../types.js';
import type { OakApiPathBasedClient } from '../../../../../client/index.js';
import { getDescriptorSchemaForEndpoint } from '../../response-map.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-search-transcripts
 * Path: /search/transcripts
 * Method: GET
 */

const operationId = 'searchTranscripts-searchTranscripts' as const;
const name = 'get-search-transcripts' as const;
const path = '/search/transcripts' as const;
const method = 'GET' as const;


/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** A snippet of text to search for in the lesson video transcripts */
  readonly q: string;
}
export interface ToolParams {
  readonly query: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"q":{"type":"string","description":"A snippet of text to search for in the lesson video transcripts"}} as const, additionalProperties: false as const, required: ["q"] };
export const toolZodSchema = z.object({ params: z.object({ query: z.object({ q: z.string() }) }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"q":{"type":"string","description":"A snippet of text to search for in the lesson video transcripts"}},"additionalProperties":false,"required":["q"]}\nRequired: q';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/search/transcripts');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSearchTranscripts = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/search/transcripts"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /search/transcripts');
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
  description: "Search for a term and find the 5 most similar lessons whose video transcripts contain similar text.",
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
export const getSearchTranscriptsTool = getSearchTranscripts;