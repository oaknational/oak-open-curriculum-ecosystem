import { z } from 'zod';

import type { StatusDiscriminant, ToolDescriptor } from '../../../contract/tool-descriptor.contract.js';
import { getResponseDescriptorsByOperationId } from '../../../../response-map.js';
import type { OakApiPathBasedClient } from '../../../../../../../client/index.js';
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

export const toolInputJsonSchema = { type: 'object' as const, properties: {"q":{"type":"string","description":"Search query text snippet","examples":["gothic"]},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","examples":["ks2"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["Gothic poetry"]}} as const, additionalProperties: false as const, required: ["q"] };
export const toolZodSchema = z.object({ params: z.object({ query: z.object({ q: z.string().describe("Search query text snippet"), keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase").optional(), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase").optional(), unit: z.string().describe("Optional unit slug to additionally filter by").optional() }) }) });
export const toolMcpFlatInputSchema = z.object({ q: z.string().describe("Search query text snippet"), keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase").optional(), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to filter by, e.g. 'english' - note that casing is important here, and should be lowercase").optional(), unit: z.string().describe("Optional unit slug to additionally filter by").optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"q":{"type":"string","description":"Search query text snippet","examples":["gothic"]},"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","examples":["ks2"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to filter by, e.g. \'english\' - note that casing is important here, and should be lowercase","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["Gothic poetry"]}},"additionalProperties":false,"required":["q"]}\nRequired: q';
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
    query: {
      q: flatArgs.q,
      keyStage: flatArgs.keyStage,
      subject: flatArgs.subject,
      unit: flatArgs.unit,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getLessons-searchByTextSimilarity.');
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
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      throw new TypeError(`Undocumented response status ${String(status)} for getLessons-searchByTextSimilarity. Documented statuses: 200`);
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
  description: "Lesson search using lesson title\n\nSearch for a term and find the 20 most similar lessons with titles that contain similar text.\n\nPREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-ontology` first to understand key stages, subjects, entity hierarchy, and ID formats.",
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
    title: "Get Search Lessons",
  },
  _meta: {
    'openai/outputTemplate': "ui://widget/oak-json-viewer-local.html",
    'openai/toolInvocation/invoking': "Fetching Get Search Lessons…",
    'openai/toolInvocation/invoked': "Get Search Lessons loaded",
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
