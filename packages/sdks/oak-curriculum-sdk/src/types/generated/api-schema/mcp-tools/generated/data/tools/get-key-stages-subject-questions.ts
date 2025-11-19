import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-questions
 * Path: /key-stages/{keyStage}/subject/{subject}/questions
 * Method: GET
 */

const operationId = 'getQuestions-getQuestionsForKeyStageAndSubject' as const;
const name = 'get-key-stages-subject-questions' as const;
const path = '/key-stages/{keyStage}/subject/{subject}/questions' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Subject slug to search by, e.g. 'science' - note that casing is important here Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
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

export const toolInputJsonSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. 'science' - note that casing is important here","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"offset":{"type":"number","default":0},"limit":{"type":"number","default":10}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]) }), query: z.object({ offset: z.number().optional(), limit: z.number().optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.object({ keyStage: z.union([z.literal("ks1"), z.literal("ks2"), z.literal("ks3"), z.literal("ks4")]), subject: z.union([z.literal("art"), z.literal("citizenship"), z.literal("computing"), z.literal("cooking-nutrition"), z.literal("design-technology"), z.literal("english"), z.literal("french"), z.literal("geography"), z.literal("german"), z.literal("history"), z.literal("maths"), z.literal("music"), z.literal("physical-education"), z.literal("religious-education"), z.literal("rshe-pshe"), z.literal("science"), z.literal("spanish")]), offset: z.number().optional(), limit: z.number().optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. \'science\' - note that casing is important here","enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"offset":{"type":"number","default":0},"limit":{"type":"number","default":10}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
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
      offset: flatArgs.offset,
      limit: flatArgs.limit,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getQuestions-getQuestionsForKeyStageAndSubject.');
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
export const getKeyStagesSubjectQuestions = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/key-stages/{keyStage}/subject/{subject}/questions"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/questions');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getQuestions-getQuestionsForKeyStageAndSubject. Documented statuses: 200`);
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
  description: "This tool returns quiz questions and answers for each lesson within a requested subject and key stage.",
  path,
  method,
  documentedStatuses,
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
