import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-sequences-questions
 * Path: /sequences/\{sequence\}/questions
 * Method: GET
 */

const operationId = 'getQuestions-getQuestionsForSequence' as const;
const name = 'get-sequences-questions' as const;
const path = '/sequences/{sequence}/questions' as const;
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
  /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
  readonly offset?: number;
  /** Limit the number of lessons, e.g. return a maximum of 100 lessons Default: 10 */
  readonly limit?: number;
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"anyOf":[{"type":"string","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"],"description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]}]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[50]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 100 lessons","default":10,"examples":[10]}} as const, additionalProperties: false as const, required: ["sequence"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant.") }), query: z.object({ year: z.number().describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), offset: z.number().describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").optional(), limit: z.number().describe("Limit the number of lessons, e.g. return a maximum of 100 lessons").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ sequence: z.string().describe("The sequence slug identifier, including the key stage 4 option where relevant."), year: z.union([z.enum(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "all-years"] as const), z.number().int().min(1).max(11).transform(String)]).describe("The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.").optional(), offset: z.number().describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").optional(), limit: z.number().describe("Limit the number of lessons, e.g. return a maximum of 100 lessons").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"sequence":{"type":"string","description":"The sequence slug identifier, including the key stage 4 option where relevant.","examples":["english-primary"]},"year":{"anyOf":[{"type":"string","enum":["1","2","3","4","5","6","7","8","9","10","11","all-years"],"description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used."},{"type":"number","description":"The year group to filter by. For the physical-education-primary sequence, a value of all-years can also be used.","examples":[3]}]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[50]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 100 lessons","default":10,"examples":[10]}},"additionalProperties":false,"required":["sequence"]}\nRequired: sequence';
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
      year: flatArgs.year === 'all-years' ? undefined : flatArgs.year === undefined ? undefined : Number(flatArgs.year),
      offset: flatArgs.offset,
      limit: flatArgs.limit,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getQuestions-getQuestionsForSequence.');
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
export const getSequencesQuestions = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/sequences/{sequence}/questions"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /sequences/{sequence}/questions');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getQuestions-getQuestionsForSequence', documentedStatuses, responseBody);
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
  description: "Questions within a sequence\n\nThis tool returns all quiz questions for a given sequence. The assets are separated into starter quiz and entry quiz arrays, grouped by lesson.\n\nPREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-curriculum-model` first to understand key stages, subjects, entity hierarchy, and ID formats.",
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
    title: "Get Sequences Questions",
  },
  _meta: {
    'openai/outputTemplate': "ui://widget/oak-json-viewer-local.html",
    'openai/toolInvocation/invoking': "Fetching Get Sequences Questions…",
    'openai/toolInvocation/invoked': "Get Sequences Questions loaded",
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
