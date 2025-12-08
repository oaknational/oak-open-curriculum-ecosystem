import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
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
  /** Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}} as const, additionalProperties: false as const, required: ["sequence"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") }), query: z.object({ year: z.number().describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant."), year: z.number().describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
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
type DocumentedStatusDiscriminant = StatusDiscriminant<DocumentedStatus>;
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getAssets-getSequenceAssets.');
}
const resolveDescriptorForStatus = (status: number) => {
  const directKey = String(status);
  const direct = responseDescriptors[directKey as keyof typeof responseDescriptors];
  if (direct) {
    return direct;
  }
  const rangeKey = `${String(Math.trunc(status / 100))}XX` as keyof typeof responseDescriptors;
  const range = responseDescriptors[rangeKey];
  if (range) {
    return range;
  }
  return responseDescriptors["default" as keyof typeof responseDescriptors];
};
const toStatusDiscriminant = (status: string) => {
  const numeric = Number(status);
  return Number.isNaN(numeric) ? status : numeric;
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
    return payload as z.infer<typeof descriptorForStatus.zod>;
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
  securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
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
    securitySchemes: [{ type: 'oauth2', scopes: ['openid', 'email'] }],
  },
  validateOutput: (data: unknown) => {
    const attemptedStatuses: { status: DocumentedStatusDiscriminant; issues: unknown[] }[] = [];
    for (const statusKey of documentedStatuses) {
      const descriptor = responseDescriptors[statusKey as keyof typeof responseDescriptors];
      if (!descriptor) {
        continue;
      }
      const result = descriptor.zod.safeParse(data);
      if (result.success) {
        return { ok: true, data: result.data, status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant };
      }
      attemptedStatuses.push({ status: toStatusDiscriminant(statusKey) as DocumentedStatusDiscriminant, issues: result.error.issues });
    }
    return {
      ok: false, message: 'Response does not match any documented schema for statuses: 200' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
