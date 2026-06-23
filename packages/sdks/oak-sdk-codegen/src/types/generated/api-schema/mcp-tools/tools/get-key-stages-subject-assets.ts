import { z } from 'zod';

import type { ToolDescriptor } from '../contract/tool-descriptor.contract.js';
import { UndocumentedResponseError } from '../contract/undocumented-response-error.js';
import { getResponseDescriptorsByOperationId } from '../../response-map.js';
import type { OakApiPathBasedClient } from '../../client-types.js';
/**
 * GENERATED FILE - DO NOT EDIT
 * 
 * Tool: get-key-stages-subject-assets
 * Path: /key-stages/\{keyStage\}/subject/\{subject\}/assets
 * Method: GET
 */

const operationId = 'getAssets-getSubjectAssets' as const;
const name = 'get-key-stages-subject-assets' as const;
const path = '/key-stages/{keyStage}/subject/{subject}/assets' as const;
const method = 'GET' as const;


/**
 * Path parameters derived from the OpenAPI schema.
 */
export interface ToolPathParams {
  /** Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase Allowed values: ks1, ks2, ks3, ks4 */
  readonly keyStage: 'ks1' | 'ks2' | 'ks3' | 'ks4';
  /** Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase) Allowed values: art, citizenship, computing, cooking-nutrition, design-technology, english, french, geography, german, history, maths, music, physical-education, religious-education, rshe-pshe, science, spanish */
  readonly subject: 'art' | 'citizenship' | 'computing' | 'cooking-nutrition' | 'design-technology' | 'english' | 'french' | 'geography' | 'german' | 'history' | 'maths' | 'music' | 'physical-education' | 'religious-education' | 'rshe-pshe' | 'science' | 'spanish';
}
/**
 * Query parameters derived from the OpenAPI schema.
 */
export interface ToolQueryParams {
  /** Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/\{slug\}/asset/\{type\} endpoint Allowed values: slideDeck, exitQuiz, exitQuizAnswers, starterQuiz, starterQuizAnswers, supplementaryResource, video, worksheet, worksheetAnswers */
  readonly type?: 'slideDeck' | 'exitQuiz' | 'exitQuizAnswers' | 'starterQuiz' | 'starterQuizAnswers' | 'supplementaryResource' | 'video' | 'worksheet' | 'worksheetAnswers';
  /** Optional unit slug to additionally filter by */
  readonly unit?: string;
}
export interface ToolParams {
  readonly path: ToolPathParams;
  readonly query?: ToolQueryParams;
}

export interface ToolArgs { readonly params: ToolParams; }

export const toolInputJsonSchema = { type: 'object' as const, properties: {"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["word-class"]}} as const, additionalProperties: false as const, required: ["keyStage","subject"] };
export const toolZodSchema = z.object({ params: z.object({ path: z.object({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase"), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)") }), query: z.object({ type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint").optional(), unit: z.string().describe("Optional unit slug to additionally filter by").optional() }).optional() }) });
export const toolMcpFlatInputSchema = z.strictObject({ keyStage: z.enum(["ks1", "ks2", "ks3", "ks4"] as const).describe("Key stage slug to filter by, e.g. 'ks2' - note that casing is important here, and should be lowercase").meta({ examples: ["ks1"] }), subject: z.enum(["art", "citizenship", "computing", "cooking-nutrition", "design-technology", "english", "french", "geography", "german", "history", "maths", "music", "physical-education", "religious-education", "rshe-pshe", "science", "spanish"] as const).describe("Subject slug to search by, e.g. 'science' - note that casing is important here (always lowercase)").meta({ examples: ["english"] }), type: z.enum(["slideDeck", "exitQuiz", "exitQuizAnswers", "starterQuiz", "starterQuizAnswers", "supplementaryResource", "video", "worksheet", "worksheetAnswers"] as const).describe("Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint").meta({ examples: ["slideDeck"] }).optional(), unit: z.string().describe("Optional unit slug to additionally filter by").meta({ examples: ["word-class"] }).optional() });
export type ToolInputSchema = z.infer<typeof toolZodSchema>;
const toolArgsDescription = 'Invalid request parameters. Please match the following schema:\nSchema: {"type":"object","properties":{"keyStage":{"type":"string","description":"Key stage slug to filter by, e.g. \'ks2\' - note that casing is important here, and should be lowercase","examples":["ks1"],"enum":["ks1","ks2","ks3","ks4"]},"subject":{"type":"string","description":"Subject slug to search by, e.g. \'science\' - note that casing is important here (always lowercase)","examples":["english"],"enum":["art","citizenship","computing","cooking-nutrition","design-technology","english","french","geography","german","history","maths","music","physical-education","religious-education","rshe-pshe","science","spanish"]},"type":{"type":"string","description":"Use the this type and the lesson slug in conjunction to get a signed download URL to the asset type from the /api/lessons/{slug}/asset/{type} endpoint","examples":["slideDeck"],"enum":["slideDeck","exitQuiz","exitQuizAnswers","starterQuiz","starterQuizAnswers","supplementaryResource","video","worksheet","worksheetAnswers"]},"unit":{"type":"string","description":"Optional unit slug to additionally filter by","examples":["word-class"]}},"additionalProperties":false,"required":["keyStage","subject"]}\nRequired: keyStage, subject';
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
      type: flatArgs.type,
      unit: flatArgs.unit,
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
  throw new TypeError('Missing response descriptor for documented status 200 on getAssets-getSubjectAssets.');
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
export const getKeyStagesSubjectAssets = {
  invoke: async (client: OakApiPathBasedClient, args: ToolArgs) => {
    const validation = toolZodSchema.safeParse(args);
    if (!validation.success) {
      throw new TypeError(describeToolArgs());
    }
    const endpoint = client["/key-stages/{keyStage}/subject/{subject}/assets"];
    const call = endpoint ? endpoint.GET : undefined;
    if (typeof call !== "function") {
      throw new TypeError('Invalid method on endpoint: GET for /key-stages/{keyStage}/subject/{subject}/assets');
    }
    const response = await call(validation.data);
    const status = response.response.status;
    const descriptorForStatus = resolveDescriptorForStatus(status);
    if (!descriptorForStatus) {
      const responseBody = status >= 200 && status < 300 ? response.data : response.error;
      throw new UndocumentedResponseError(status, 'getAssets-getSubjectAssets', documentedStatuses, responseBody);
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
  description: "Downloadable assets by key stage and subject\n\nUse when you want every downloadable asset for a key stage + subject, without programme structure or unit sequence order, optionally scoped to a unit or asset type. Returns assets grouped by lesson, each with signed download URLs, asset type, lesson title and slug, and attribution. Pass unit to restrict to one unit and type to restrict to one asset type (one of: slideDeck, starterQuiz, starterQuizAnswers, exitQuiz, exitQuizAnswers, worksheet, worksheetAnswers, supplementaryResource, video). Lesson content is under OGL v3.0; assets are either Oak-owned or third-party under an OGL-compatible licence. Attribution required — see https://open-api.thenational.academy/docs/about-oaks-api/terms. Not for: assets across a sequence (GET /sequences/{sequence}/assets); assets in one programme (GET /sequences/{sequence}/programmes/{programme}/assets); a single lesson's downloads (GET /lessons/{lesson}/assets); streaming one file (GET /lessons/{lesson}/assets/{type}).\n\nPREREQUISITE: You MUST call the `get-curriculum-model` tool first to understand the curriculum domain.\n\nNOTE: The asset `url` fields returned by this tool are authenticated API endpoints and cannot be used as direct browser download links. To generate a clickable download link for the user, call the `download-asset` tool with the lesson slug and asset type. If `download-asset` is not available (e.g. stdio transport), direct users to the lesson page on the Oak website — use the lesson's `oakUrl` (e.g. `https://www.thenational.academy/teachers/lessons/{lessonSlug}`).\n\nNOTE: This tool can return a large payload at broad scope and may exceed a host's per-result token limit. Narrow with `unit` and/or `type` (asset type), or use `get-lessons-assets` for one lesson.",
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
    title: "Get Key Stages Subject Assets",
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
