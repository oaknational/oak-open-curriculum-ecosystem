import { z } from 'zod';

import type { ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getDescriptorSchemaForEndpoint } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-assets
 * Path: /sequences/{sequence}/assets
 * Method: GET
 */

const operationId = 'getAssets-getSequenceAssets' as const;
const name = 'get-sequences-assets' as const;
const path = '/sequences/{sequence}/assets' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The sequence slug identifier, including the key stage 4 option where relevant. */
  readonly sequence: string;
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used. */
  readonly year?: number;
  /** Optional asset type specifier

Available values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"params":{"type":"object","properties":{"path":{"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."}},"additionalProperties":false,"required":["sequence"]},"query":{"type":"object","properties":{"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false}},"additionalProperties":false,"required":["path"]}} as const, additionalProperties: false as const, required: ["params"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string() }), query: z.object({ year: z.number().optional(), type: z.union([z.literal("slideDeck"), z.literal("exitQuiz"), z.literal("exitQuizAnswers"), z.literal("starterQuiz"), z.literal("starterQuizAnswers"), z.literal("supplementaryResource"), z.literal("video"), z.literal("worksheet"), z.literal("worksheetAnswers")]).optional() }).optional() }) });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"params":{"type":"object","properties":{"path":{"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant."}},"additionalProperties":false,"required":["sequence"]},"query":{"type":"object","properties":{"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},"type":{"type":"string","description":"Optional asset type specifier\\n\\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false}},"additionalProperties":false,"required":["path"]}},"required":["params"],"additionalProperties":false}\nRequired: params';
export const describeToolArgs = () => toolArgsDescription;
const responseDescriptor = getDescriptorSchemaForEndpoint('get', '/sequences/{sequence}/assets');
/**
 * Tool descriptor consumed by MCP_TOOLS.
 *
 * @see MCP_TOOLS
 * @remarks Wiring layers (stdio, HTTP, aliases) rely on this metadata for execution and validation.
 */
export const getSequencesAssets = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/sequences/{sequence}/assets"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/assets');
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
  description: "This tool returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson. This tool contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.",
  path,
  method,
  validateOutput: (data: unknown) => {
    const result = responseDescriptor.zod.safeParse(data);
    if (result.success) {
      return { ok: true, data: result.data };
    }
    return { ok: false, message: 'Invalid response payload. Please match the generated output schema.' };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof responseDescriptor.zod>>;
