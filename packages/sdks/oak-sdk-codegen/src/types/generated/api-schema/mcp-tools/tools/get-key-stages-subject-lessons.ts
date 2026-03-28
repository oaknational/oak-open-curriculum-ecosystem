import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-lessons
 * Path: /key-stages/\{keyStage\}/subject/\{subject\}/lessons
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
  /** Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted. Default: 0 */
  readonly offset?: number;
  /** Offset applied to lessons within each unit (not to the unit list). Default: 10 */
  readonly limit?: number;
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["word-class"]},"offset":{"type":"number","description":"Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.","default":0,"examples":[50]},"limit":{"type":"number","description":"Offset applied to lessons within each unit (not to the unit list).","default":10,"examples":[10]}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase") }), query: z.object({ unit: z.string().describe("Optional unit slug to additionally filter by").optional(), offset: z.number().describe("Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.").optional(), limit: z.number().describe("Offset applied to lessons within each unit (not to the unit list).").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase"), unit: z.string().describe("Optional unit slug to additionally filter by").optional(), offset: z.number().describe("Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.").optional(), limit: z.number().describe("Offset applied to lessons within each unit (not to the unit list).").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. \'english\' - note that casing is important here, and should be lowercase","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["word-class"]},"offset":{"type":"number","description":"Limit the number of lessons returned per unit. Units with zero lessons after limiting are omitted.","default":0,"examples":[50]},"limit":{"type":"number","description":"Offset applied to lessons within each unit (not to the unit list).","default":10,"examples":[10]}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
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
      keyStage: flatArgs.keyStage,
      subject: flatArgs.subject,
    },
    query: {
      unit: flatArgs.unit,
      offset: flatArgs.offset,
      limit: flatArgs.limit,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getKeyStageSubjectLessons-getKeyStageSubjectLessons.');
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
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getKeyStageSubjectLessons-getKeyStageSubjectLessons', documentedStatuses, responseBody);
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
  description: "Lessons\n\nThis tool returns an array of available published lessons for a given subject and key stage, grouped by unit.\n\nPREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.",
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
    title: "Get Key Stages Subject Lessons",
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
      ok: false, message: 'Response does not match any documented schema for statuses: 200, 400, 401, 404' ,
      issues: attemptedStatuses.flatMap((entry) => entry.issues),
      attemptedStatuses,
    };
  },
} as const satisfies ToolDescriptor<typeof name, OakApiPathBasedClient, ToolArgs, z.infer<typeof toolMcpFlatInputSchema>, z.infer<typeof primaryResponseDescriptor.zod>, DocumentedStatus>;
