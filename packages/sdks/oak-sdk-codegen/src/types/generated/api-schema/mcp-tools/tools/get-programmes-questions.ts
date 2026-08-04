import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-programmes-questions
 * Path: /programmes/\{programme\}/questions
 * Method: GET
 */

const operationId = 'getQuestions-getQuestionsForProgramme' as const;
const name = 'get-programmes-questions' as const;
const path = '/programmes/{programme}/questions' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** The programme slug identifier */
  readonly programme: string;
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** If limiting results returned, this allows you to return the next set of results, starting at the given offset point Default: 0 */
  readonly offset?: number;
  /** Limit the number of lessons, e.g. return a maximum of 300 lessons Default: 20 */
  readonly limit?: number;
  /** Optional filter for question results. Use `images` to return only questions with a question image or image answer. Allowed values: images */
  readonly filter?: 'images';
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"programme":{"type":"string","description":"The programme slug identifier","examples":["computing-secondary-year-7"]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 300 lessons","default":20,"examples":[20],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results. Use `images` to return only questions with a question image or image answer.","enum":["images"]}} as const, additionalProperties: false as const, required: ["programme"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ programme: z.string().describe("The programme slug identifier") }), query: z.object({ offset: z.number().describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").optional(), limit: z.number().lte(300).describe("Limit the number of lessons, e.g. return a maximum of 300 lessons").optional(), filter: z.enum(["images"] as const).describe("Optional filter for question results. Use `images` to return only questions with a question image or image answer.").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ programme: z.string().describe("The programme slug identifier").meta({ examples: ["computing-secondary-year-7"] }), offset: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number()).describe("If limiting results returned, this allows you to return the next set of results, starting at the given offset point").meta({ examples: [0] }).optional(), limit: z.preprocess((val) => typeof val === 'string' && /^-?\d+(\.\d+)?$/.test(val) ? Number(val) : val, z.number().lte(300)).describe("Limit the number of lessons, e.g. return a maximum of 300 lessons").meta({ examples: [20] }).optional(), filter: z.enum(["images"] as const).describe("Optional filter for question results. Use `images` to return only questions with a question image or image answer.").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"programme":{"type":"string","description":"The programme slug identifier","examples":["computing-secondary-year-7"]},"offset":{"type":"number","description":"If limiting results returned, this allows you to return the next set of results, starting at the given offset point","default":0,"examples":[0]},"limit":{"type":"number","description":"Limit the number of lessons, e.g. return a maximum of 300 lessons","default":20,"examples":[20],"maximum":300},"filter":{"type":"string","description":"Optional filter for question results. Use `images` to return only questions with a question image or image answer.","enum":["images"]}},"additionalProperties":false,"required":["programme"]}\nRequired: programme';
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
      programme: flatArgs.programme,
    },
    query: {
      offset: flatArgs.offset,
      limit: flatArgs.limit,
      filter: flatArgs.filter,
    },
  };
  return { params };
}
const responseDescriptors = getResponseDescriptorsByOperationId(operationId);
const documentedStatuses = ['200', '400', '401', '404'] as const;
type DocumentedStatus = typeof documentedStatuses[number];
const STATUS_DISCRIMINANTS = { '200': 200, '400': 400, '401': 401, '404': 404 } as const;
type DocumentedStatusDiscriminant = typeof STATUS_DISCRIMINANTS[DocumentedStatus];
const primaryResponseDescriptor = responseDescriptors[documentedStatuses[0]];
if (!primaryResponseDescriptor) {
  throw new TypeError('Missing response descriptor for documented status 200 on getQuestions-getQuestionsForProgramme.');
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
export const getProgrammesQuestions = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/programmes/{programme}/questions"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /programmes/{programme}/questions');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getQuestions-getQuestionsForProgramme', documentedStatuses, responseBody);
    }
    const payload = status >= 200 && status < 300 ? response.data : response.error;
    return { httpStatus: status, payload };
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
  description: "Quiz questions in a programme\n\nUse when you want every quiz question in a single programme (year group) within a subject. Get programme slugs from GET /subjects/{subject}/programmes. Returns questions grouped by lesson with starter and exit quiz questions and answers. Supports offset/limit pagination; Link: rel=\"next\" header signals more pages. Not for: questions in a single lesson (GET /lessons/{lesson}/quiz); questions across a whole sequence (GET /sequences/{sequence}/questions); questions for a key stage + subject without programme structure (GET /key-stages/{keyStage}/subject/{subject}/questions).",
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
    title: "Get Programmes Questions",
  },
  _meta: {
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
      ok: false, message: 'Response does not match any documented schema for statuses: 200, 400, 401, 404',
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
