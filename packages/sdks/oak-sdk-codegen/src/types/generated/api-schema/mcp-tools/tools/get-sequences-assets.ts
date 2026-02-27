import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-assets
 * Path: /sequences/\{sequence\}/assets
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

export const toolInputJsonSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]},"type":{"type":"string","description":"Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["sequence"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") }), query: z.object({ year: z.number().describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant."), year: z.number().describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Optional asset type specifier\n\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]},"type":{"type":"string","description":"Optional asset type specifier\\n\\nAvailable values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
export const describeToolArgs = () => toolArgsDescription;
/**
 * Transform flat MCP arguments to nested SDK format.
 *
 * Converts flat parameter structure from MCP client to nested params.path/params.query
 * structure expected by SDK invoke function.
 *
 * @param flatArgs - Flat arguments from MCP client (validated against toolMcpFlatInputSchema)
 * @returns Nested arguments for SDK invoke function (ToolArgs format)
 */
export function transformFlatToNestedArgs(flatArgs: z.infer<typeof toolMcpFlatInputSchema>): ToolArgs {
  const params: ToolParams = {
    path: {
      sequence: flatArgs.sequence,
    },
    query: {
      year: flatArgs.year,
      type: flatArgs.type,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
const STATUS_DISCRIMINANTS = { '200': 200 } as const;
type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getAssets-getSequenceAssets.');
}
const resolveDescriptorForStatus = (status: number) => {
  const directKey = String(status);
  const direct = responseDescriptors[directKey];
  if (direct) {
    return direct;
  }
  const rangeKey = `${String(Math.trunc(status / 100))}XX`;
  const range = responseDescriptors[rangeKey];
  if (range) {
    return range;
  }
  return responseDescriptors["default"];
};
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
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getAssets-getSequenceAssets. Documented statuses: 200`);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return payload;
  },
  toolZodSchema,
  toolInputJsonSchema,
  toolMcpFlatInputSchema,
  transformFlatToNestedArgs,
  toolOutputJsonSchema: primaryResponseDescriptor.json,
  zodOutputSchema: primaryResponseDescriptor.zod,
  describeToolArgs,
  inputSchema: toolInputJsonSchema,
  operationId,
  name,
  description: "Assets within a sequence\n\nThis tool returns all assets for a given sequence, and the download endpoints for each. The assets are grouped by lesson. This tool contains licence information for any third-party content contained in the lesson’s downloadable resources. Third-party content is exempt from the open-government license, and users will need to consider whether their use is covered by the stated licence, or if they need to procure their own agreement.\n\nPREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology` first to understand key stages, subjects, entity hierarchy, and ID formats.",
  path,
  method,
  documentedStatuses,
  securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
  requiresDomainContext: true,
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
    title: "Get Sequences Assets",
  },
  _meta: {
    'openai/outputTemplate': "ui://widget/oak-json-viewer-local.html",
    'openai/toolInvocation/invoking': "Fetching Get Sequences Assets…",
    'openai/toolInvocation/invoked': "Get Sequences Assets loaded",
    'openai/widgetAccessible': true,
    'openai/visibility': 'public',
    securitySchemes: [{ type: 'oauth2', scopes: ['email'] }],
  },
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: z.ZodError["issues"] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: STATUS_DISCRIMINANTS[statusKey] };
      }
      attemptedStatuses.push({ status: STATUS_DISCRIMINANTS[statusKey], issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
